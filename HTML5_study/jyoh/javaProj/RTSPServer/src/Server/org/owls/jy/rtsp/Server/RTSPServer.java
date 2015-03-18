package Server.org.owls.jy.rtsp.Server;

import java.awt.BorderLayout;
import java.awt.HeadlessException;
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
import java.net.ServerSocket;
import java.net.Socket;
import java.util.StringTokenizer;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.Timer;

import Server.org.owls.jy.rtsp.Packet.RTPpacket;
import Server.org.owls.jy.rtsp.Stream.VideoStream;

/**
 * 원본은 http://nsl.cs.sfu.ca/teaching/09/820/streaming/Server.html
 * @author juneyoungoh
 *
 */
public class RTSPServer extends JFrame implements ActionListener {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	//=== GUI
	JLabel label;
	
	//=== Video 처리 변수 
	int imagenb = 0; // 현재 전송된 이미지의 바이트 수(image nb of the image currently transmitted)
	VideoStream video; // 이 VideoStream 객체는 어디서 나온거지? video 에 접근하기 위한 VideoStream Object
	static int MJPEG_TYPE = 26; // MJPEG 형식의 비디오의 RTP payload 타입 
	static int FRAME_PERIOD = 100; // ms 단위로 읽을 프레임. 100 frames/ms
	static int VIDEO_LENGTH = 500; // 비디오의 길이 (프레임 단위)
	Timer timer; // image 를 송출할 타이머 (java.util 의 타이머가 아니고 java.swing 의 타이머)
	byte[] buf; // 클라이언트로 전송할 때 담을 바이트 버퍼 
	
	
	//=== RTP 변수 : RTP 와 RTSP 의 차이는?
	DatagramSocket RTPSocket; 	// UDP 패킷을 송수신하는 소켓 
	DatagramPacket RTPPacket; 	// Video frames 를 나르는 패킷 
	
	
	InetAddress ClientIPAddr; 	// 클라이언트의 ip 주소
	int RTP_dest_port = 0; 		// RTP 패킷을 전송할 포트번호 (클라이언트에서 요청받는 값으로 들어감)
	
	
	//=== RTSP(Real Time Streaming Protocol) 변수 
	//RTSP 상태 변수 
	static final int INIT = 0;
	static final int READY = 1;
	static final int PLAYING = 2;
	
	//RTSP 메세지 유형 
	static final int SETUP = 3;
	static final int PLAY = 4;
	static final int PAUSE = 5;
	static final int TEARDOWN = 6; // 왠지 STOP 이어야 할 거 같은데...
	
	static int state = 0; // 이 변수에는 'RTSP 상태 변수' 가 들어감.
	Socket RTSPSocket; // RTSP 메세지를 송수신할 소켓
	
	// input/output stream 필터 
	static BufferedReader RTSPBufferedReader;
	static BufferedWriter RTSPBufferedWriter;
	static String videoFileName; // 클라이언트에서 요청한 비디오 파일명 
	static int RTSP_ID = 123456; // RTSP 세션의 ID 
	int RTSPSeqNum = 0; // 세션 내에서의 RTSP 시퀸스 넘버  
	
	//=== 기타 변수 
	// 이 변수는 아마 rtsp 나 http 프로토콜이 텍스트 기반 프로토콜이기 때문에 필요한 변수일 것이다 
	final static String CRLF = "\r\n"; 

	
	//********* 생성자

	public RTSPServer() throws HeadlessException {
		// Frame 초기화 
		//super("Server");
		
		// Timer 초기화 
		timer = new Timer(FRAME_PERIOD, this);
		timer.setInitialDelay(0); // 최초 딜레이 //
		timer.setCoalesce(true); // Frame 병합 옵션 
		
		// 송신 버퍼에 대한 메모리 할당 
		buf = new byte[15000];
		
		addWindowListener(new WindowAdapter() {
			@Override
			public void windowClosing(WindowEvent e) {
				//super.windowClosing(e);
				timer.stop();
				System.exit(0);
			}
		});
		
		// 이 부분은 GUI 의 정렬 부분 
		label = new JLabel("Send frame #", JLabel.CENTER);
		getContentPane().add(label, BorderLayout.CENTER);
	}
		
	public static void main(String[] args) throws Exception {
		RTSPServer server = new RTSPServer();
		
		// pack 메소드의 의미는?
		server.pack();
		server.setVisible(true);
		
		// 커맨드 라인으로부터 RTSP 소켓을 가져옴
		int RTSPport = Integer.parseInt(args[0]);
		
		// RTSP 세션을 위한 TCP 접속 초기화 
		ServerSocket listenSocket = new ServerSocket(RTSPport);
		server.RTSPSocket = listenSocket.accept();
		listenSocket.close();
		
		// 클라이언트 IP 수집
		server.ClientIPAddr = server.RTSPSocket.getInetAddress();
		
		// RTSP 상태 초기화
		state = INIT;
		
		// input/output Stream 필터 새팅
		RTSPBufferedReader = new BufferedReader(new InputStreamReader(server.RTSPSocket.getInputStream()));
		RTSPBufferedWriter = new BufferedWriter(new OutputStreamWriter(server.RTSPSocket.getOutputStream()));
		
		// 클라이언트로부터 SETUP 메세지가 수신되기를 기다림.
		int request_type;
		boolean done = false;
		
		while(!done){
			// blocking 이라고 주석이 달려 있는데, 
			// 실질적으로 이 메소드는 RTSPBufferedReader 로 부터 예약된 정보를 가져오는데 사용됨
			request_type = server.parse_RTSP_request(); 
			
			if(request_type == SETUP){
				done = true;
				state = READY;
				System.out.println("RTSP 상태가 변경되었습니다. >> READY");
				
				//response 전송 
				server.send_RTSP_response();
				
				//VideoStream 오브젝트를 다시 초기화 
				server.video = new VideoStream(videoFileName);
				
				//RTP 소켓 초기화 
				server.RTPSocket = new DatagramSocket();
			}
		}
		
		// RTSP request 를 처리하기 위한 루프 
		while(true){
			request_type = server.parse_RTSP_request();
			if((request_type == PLAY) && (state == READY)){
				server.send_RTSP_response();
				// 타이머 시작 
				server.timer.start();
				// 상태 업데이트 
				state = PLAYING;
				System.out.println("RTSP 상태가 변경되었습니다. >> PLAYING");
			} else if ((request_type == PAUSE) && (state == PLAYING)){
				server.send_RTSP_response();
				// 타이머 정지 
				server.timer.stop();
				//상태 업데이트 
				state = READY;
				System.out.println("RTSP 상태가 변경되었습니다. >> READY");
			} else if (request_type == TEARDOWN) {
				server.send_RTSP_response();
				server.timer.stop();
				server.RTSPSocket.close();
				server.RTPSocket.close();
				System.exit(0);
			}
		}
	}
	
	
	//ActionListener에서 선택적 상속 
	@Override
	public void actionPerformed(ActionEvent e) {
		// 현재 이미지 넘버가 video length 보다 작다면 
		if(imagenb < VIDEO_LENGTH){
			//현재 이미지 넘버(인덱스인 듯) 업데이트한다.
			imagenb ++;
			
			try{
				// 비디오에서 송출될 다음 프레임을 가져온다(사이즈도)
				int image_length = video.getnextframe(buf);
				
				// frame 정보를 가지고 있는 RTP 패킷을 작성한다.
				RTPpacket rtp_packet = new RTPpacket(MJPEG_TYPE, image_length, imagenb*FRAME_PERIOD, buf, image_length);
				
				
				// 전송할 RTP 패킷의 전체 사이즈를 가져온다.
				int packet_length = rtp_packet.getlength();
				
				//패킷에서 bitstream 을 가져와서 bytes 의 배열로 저장한다. ==> bit 랑 byte 랑 다른건데 괜찮나...
				byte[] packet_bits = new byte[packet_length];
				rtp_packet.getpacket(packet_bits);
				
				//UDP 소켓을 통해 packet 을 DatagramPacket 으로 전송함 
				RTPPacket = new DatagramPacket(packet_bits, packet_length, ClientIPAddr, RTP_dest_port);
				RTPSocket.send(RTPPacket);
				
				rtp_packet.printHeader();
				//GUI 업데이트 
				label.setText("Send frame #" + imagenb);
			}catch(Exception ex){
				ex.printStackTrace();
				System.exit(0);
			}
		}else{
			timer.stop();
		}
	}
	
	//***** RTSP 요청을 파싱 
	private int parse_RTSP_request(){
		int request_type = -1;
		try{
			System.out.println("RTSP Server - 클라이언트의 요청ready");
			String requestLine = RTSPBufferedReader.readLine();
			System.out.println("RTSP Server - 클라이언트의 요청을 받았습니다!");
			System.out.println(requestLine);
			
			// 뭘로 tokenizing 하는지 알아볼 필요가 있음. Tokenizer 의 역할은 ?
			StringTokenizer tokens = new StringTokenizer(requestLine);
			String req_type_str = tokens.nextToken();
			
			// req_type 으로 변환 (convert to request_type structure)
			// equals 랑 다른가...
			
			System.out.println(req_type_str + ".compareTo >> (SETUP / PLAY / PAUSE / TEARDOWN)" );
			if(req_type_str.compareTo("SETUP") == 0) request_type = SETUP;
			if(req_type_str.compareTo("PLAY") == 0) request_type = PLAY;
			if(req_type_str.compareTo("PAUSE") == 0) request_type = PAUSE;
			if(req_type_str.compareTo("TEARDOWN") == 0) request_type = TEARDOWN;
			
			System.out.println("토큰에 더 많은 요소가 있습니까? " + tokens.hasMoreElements());
			if(request_type == SETUP){ 
				videoFileName = tokens.nextToken(); 
				System.out.println("VIDEO 파일명 >> " + videoFileName);
			}
			
			// CSeq 필드를 추출해서 시퀸스 넘버를 가져오기 
			String seqNumLine = RTSPBufferedReader.readLine();
			System.out.println("시퀸스 넘버 >> " + seqNumLine);
			tokens = new StringTokenizer(seqNumLine);
			String token2Print = tokens.nextToken();
			System.out.println(token2Print);
			token2Print = tokens.nextToken();
			RTSPSeqNum = Integer.parseInt(token2Print.trim());
			
			// 마지막 라인 가져오기 
			String lastLine = RTSPBufferedReader.readLine();
			System.out.println("마지막 라인 >> " + lastLine);
			
			if(request_type == SETUP){
				// RTP 대상 포트를 가져옴 
				tokens = new StringTokenizer(lastLine);
				for(int i = 0; i < 3; i++){
					tokens.nextToken();
					RTP_dest_port = Integer.parseInt(tokens.nextToken().trim());
					System.out.println("RTP 대상 포트 >> " + RTP_dest_port);
				}
			}
		}catch(Exception e){
			e.printStackTrace();
			System.exit(0);
		}
		return(request_type);
		//return request_type;
	}
	
	//***** RTSP 응답을 보냄 
	private void send_RTSP_response(){
		try{
			RTSPBufferedWriter.write("RTSP/1.0 200 OK" + CRLF);
			RTSPBufferedWriter.write("Cseq: " + RTSPSeqNum + CRLF);
			RTSPBufferedWriter.write("Session: " + RTSP_ID + CRLF);
			RTSPBufferedWriter.flush();
			System.out.println("RTSP 서버 - 클라이언트로 response 를 전송하였습니다.");
		}catch(Exception e){
			e.printStackTrace();
			System.exit(0);
		}
	}
};