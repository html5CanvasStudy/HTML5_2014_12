package Server.org.owls.jy.rtsp.Stream;

import java.io.FileInputStream;

public class VideoStream {
	FileInputStream fis;
	int frame_idx;
	
	public VideoStream(String filename) throws Exception {
		fis = new FileInputStream(filename);
		frame_idx = 0;
	}
	
	public int getnextframe(byte[] frame) throws Exception {
		int length = 0;
		String length_str;
		// 5씩 끊는 별도의 이유가 있나?
		byte[] frame_length = new byte[5];
		
		// 현재 프레임의 길이를 읽는다.
		fis.read(frame_length, 0, 5);
		length_str = new String(frame_length);
		System.out.println("프레임 길이 >> " + length_str);
		length = Integer.parseInt(length_str.trim());
		
		// 이게 무슨 의미지?
		return (fis.read(frame, 0, length));
	}
}