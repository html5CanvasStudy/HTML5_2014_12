package org.owls.jy.rtsp.client;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.GridLayout;
import java.awt.Image;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.Socket;
import java.util.StringTokenizer;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.Timer;

import org.owls.jy.rtsp.packet.RTPpacket;


public class RTSPClient {
	
	//Graphic User Interface
	JFrame jFrame = new JFrame("SimpleRTSPClient");
	JButton setupBtn = new JButton("Setup");
	JButton playBtn = new JButton("Play");
	JButton pauseBtn = new JButton("Pause");
	JButton tearBtn = new JButton("Teardown");
	
	JPanel mainPanel = new JPanel();
	JPanel btnPanel = new JPanel();
	
	JLabel iconLabel = new JLabel();
	ImageIcon icon;
	
	// RTP 변수
	DatagramPacket rcvdp; // 서버로부터 전달받은 UDP 패킷 
	DatagramSocket RTPSocket;
	static int RTP_RCV_PORT = 25000; // 서버와 같은 프로젝트 안에 있지만 송신 포트와 송출 포트가 달라야 하나.

	Timer timer; // UDP 소켓으로부터 데이터를 가져오는 타이머 
	byte[] buf; // 서버로부터 전달받은 데이터를 저장할 버퍼 
	
	// RTSP 변수
	// RTSP 상태 상수 
	final static int INIT = 0;
	final static int READY = 1;
	final static int PLAYING = 2;
	// 상태 관리 상수 
	static int state = INIT;
	
	Socket RTSPSocket;
	static BufferedReader RTSPBufferedReader;
	static BufferedWriter RTSPBufferedWriter;
	static String videoFileName;
	int RTSPSeqNb = 0; // 세션에 담긴 RTSP 메세지의 시퀸스 넘버
	int RTSPid = 0; // RTSP 세션의 아이디로 서버에서 보내주는 데이타 
	final static String CRLF = "\r\n";
	
	// Video constants ?
	static int MJPEG_TYPE = 26; // MJPEG 의 RTP payload 타입 

	// 클래스 생성자 
	public RTSPClient() {
		
		//GUI 구성 
		jFrame.addWindowListener(new WindowAdapter() {
			//닫기 이벤트 처리 
			@Override
			public void windowClosing(WindowEvent e) {
				//super.windowClosing(e);
				System.exit(0);
			}
		});
		
		//btn 추가 
		btnPanel.setLayout(new GridLayout(1, 0));
		btnPanel.add(setupBtn); btnPanel.add(playBtn);
		btnPanel.add(pauseBtn); btnPanel.add(tearBtn);
		//btn 이벤트 추가 
		setupBtn.addActionListener(new SetupActionListener());
		playBtn.addActionListener(new PlayActionListener());
		pauseBtn.addActionListener(new PauseActionListener());
		tearBtn.addActionListener(new TearActionListener());
		
		//아이콘 준비 
		iconLabel.setIcon(null);
		
		//프레임 레이아웃
		mainPanel.setLayout(null); // 여기다가 null 넣으면 의미가 없지 않나?
		mainPanel.add(iconLabel);
		mainPanel.add(btnPanel);
		//영역 처리 
		iconLabel.setBounds(0, 0, 380, 50);
		btnPanel.setBounds(0, 280, 380, 50);
		
		jFrame.getContentPane().add(mainPanel, BorderLayout.CENTER);
		jFrame.setSize(new Dimension(390, 370));
		jFrame.setVisible(true);
		
		//타이머 처리
		timer = new Timer(20, new TimerListener());
		timer.setInitialDelay(0);
		timer.setCoalesce(true);
		
		// 서버로부터 전달받을 데이터 버퍼의 메모리 할당 
		buf = new byte[15000];
	}
	
	// ========= Inner Class
	// ============ ActionListener 구현 
	class TimerListener implements ActionListener {

		@Override
		public void actionPerformed(ActionEvent e) {
			rcvdp = new DatagramPacket(buf, buf.length);
			
			try{
				// 패킷 전달받기 
				RTPSocket.receive(rcvdp);
				
				// 데이터 패킷으로부터 사용자가 정의한 RTPpacket Object 를 생성 
				RTPpacket rtp_packet = new RTPpacket(rcvdp.getData(), rcvdp.getLength());
				System.out.println("RTP 패킷을 전송받음. 패킷 시퀸스 : " + rtp_packet.getsequenceNumber() 
						+ ". 타임스탬프 : " + rtp_packet.gettimestamp() 
						+ " ms. 타입 : " +  rtp_packet.getpayloadType());
				
				// 전달받은 헤더를 출력 
				rtp_packet.printHeader();
				
				int payload_length = rtp_packet.getpayload_length();
				byte[] payload = new byte[payload_length];
				rtp_packet.getpayload(payload);
				
				// payload 비트스트림으로부터 이미지 객체 만들기 
				Toolkit toolkit = Toolkit.getDefaultToolkit();
				// 첫번째 인자는 이미지 데이타 바이트 배열, 두번째는 시작 오프셋, 마지막은 종료 오프셋 
				Image image = toolkit.createImage(payload, 0, payload_length);
				
				// Image 객체를 ImageIcon 으로 출력 
				icon = new ImageIcon(image);
				iconLabel.setIcon(icon);
				
			}catch(Exception ex){
				ex.printStackTrace();
			}
		}
	}
	
	//======= 서버와 요청/응답 프로토콜 통신 
	
	private int parse_server_response(){
		int reply_code = 0;
		try{
			String statusLine = RTSPBufferedReader.readLine();
			System.out.println("서버로 부터 전달받은 데이타  >> " + statusLine);
			
			StringTokenizer tokens = new StringTokenizer(statusLine);
			tokens.nextToken();
			reply_code = Integer.parseInt(tokens.nextToken());
			
			if(reply_code == 200){
				String seqLine = RTSPBufferedReader.readLine();
				System.out.println("시퀸스 응답값 >> " + seqLine);
				
				String sessionLine = RTSPBufferedReader.readLine();
				System.out.println("세션 응답값 >> " + sessionLine);

				//if state == INIT gets the Session Id from the SessionLine
				tokens = new StringTokenizer(sessionLine);
				tokens.nextToken(); // Session: 문자열 넘기기 
				RTSPid = Integer.parseInt(tokens.nextToken());
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
		return reply_code;
	}
	
	// 서버에 보낼 응답 
	private void send_RTSP_request(String request_type){
		try{
			//이 부분은 기술되어 있지 않아서 서버의 코드를 가져왔음.
			//
//			RTSPBufferedWriter.write("RTSP/1.0 200 OK" + CRLF);
//			RTSPBufferedWriter.write("RTSP/1.0 200 OK" + CRLF);
			RTSPBufferedWriter.write("SETUP " + videoFileName + CRLF);
			RTSPBufferedWriter.write("Cseq: " + RTSPSeqNb + CRLF);
			RTSPBufferedWriter.write("Session: " + RTSPid + CRLF);
			RTSPBufferedWriter.flush();
			System.out.println("RTSP 클라이언트 - 서버로 response 를 전송하였습니다.");
		}catch(Exception e){
			e.printStackTrace();
			System.exit(0);
		}
	}
	
	// ======== Btn 에 대한 ActionListener 구현 
	class SetupActionListener implements ActionListener {

		@Override
		public void actionPerformed(ActionEvent e) {
			// TODO Auto-generated method stub
			System.out.println("Setup 버튼이 눌렸습니다.");
			
			if(state == INIT){
				// non-blocking RTP 소켓으로 데이터를 받을 것임.
				try{
					RTPSocket = new DatagramSocket(RTP_RCV_PORT); 
					RTPSocket.setSoTimeout(5000);
				}catch(Exception ex){
					ex.printStackTrace();
					System.exit(0);
				}
				
				RTSPSeqNb = 1;
				send_RTSP_request("SETUP");
				
				if(parse_server_response() != 200){
					System.out.println("서버 응답값이 올바르지 않습니다.");
				}else{
					state = READY;
					System.out.println("RTSP 상태가 SETUP 에서 READY 로 변경되었습니다.");
					
				}
			}
			
		}
	}
	
	class PlayActionListener implements ActionListener {

		@Override
		public void actionPerformed(ActionEvent e) {
			System.out.println("Play 버튼이 눌렸습니다.");
			
			if(state == READY){
				RTSPSeqNb ++;
				send_RTSP_request("PLAY");
				
				if(parse_server_response() != 200){
					System.out.println("서버 응답값이 올바르지 않습니다.");
				}else{
					state = PLAYING;
					System.out.println("RTSP 상태가 READY 에서 PLAYING 으로 변경되었습니다.");
					//timer 의 역할이 정확하게 뭔지.
					timer.start();
				}
			}
		}
	}
	
	class PauseActionListener implements ActionListener {

		@Override
		public void actionPerformed(ActionEvent e) {
			// TODO Auto-generated method stub
			System.out.println("Pause 버튼이 눌렸습니다.");
			
			if(state == PLAYING){
				RTSPSeqNb ++;
				send_RTSP_request("PAUSE");
				
				if(parse_server_response() != 200){
					System.out.println("서버 응답값이 올바르지 않습니다.");
				}else{
					state = READY;
					System.out.println("RTSP 상태가 PLAYING 에서 PAUSE 로 변경되었습니다.");
					timer.stop();
				}
			}
		}
	}
	
	class TearActionListener implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent e) {
			System.out.println("TearDown 버튼이 눌렸습니다.");
			
			RTSPSeqNb ++;
			send_RTSP_request("TEARDOWN");
			
			if(parse_server_response() != 200){
				System.out.println("서버 응답값이 올바르지 않습니다.");
			}else{
				state = INIT;
				System.out.println("RTSP 상태가 INIT 으로 변경되었습니다.");
				timer.stop();
				//System.exit(0);
			}
		}
	}
	
	public static void main(String[] args) throws Exception {
		RTSPClient client = new RTSPClient();
		if(args.length != 3){
			System.out.println("인자가 부족합니다.");
			System.exit(0);
		}
		int RTSP_server_port = Integer.parseInt(args[1]);
		String serverHost = args[0];
		InetAddress serverIPAddr = InetAddress.getByName(serverHost);
		
		videoFileName = args[2];
		
		client.RTSPSocket = new Socket(serverIPAddr, RTSP_server_port);
		
		RTSPBufferedReader = new BufferedReader(new InputStreamReader(client.RTSPSocket.getInputStream()));
		RTSPBufferedWriter = new BufferedWriter(new OutputStreamWriter(client.RTSPSocket.getOutputStream()));
		state = INIT;
	}
}