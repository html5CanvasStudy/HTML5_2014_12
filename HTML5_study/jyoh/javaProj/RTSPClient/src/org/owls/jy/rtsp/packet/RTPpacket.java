package org.owls.jy.rtsp.packet;

public class RTPpacket {
	static int HEADER_SIZE = 12;
	
	//RTP 헤더를 처리할 수 있는 필드 선언 
	public int version;
	public int padding;
	public int extension;
	public int cc;
	public int marker;
	public int payloadType;
	public int sequenceNumber;
	public int timestamp;
	public int ssrc;
	
	//RTP 헤더의 Bitstream
	public byte[] header;

	//RTP Payload 의 사이즈 
	public int payload_size;
	//RTP Payload 의 Bitstream
	public byte[] payload;
	
	//생성자
	public RTPpacket(int pType, int frameIdx, int time, byte[] data, int data_length) {
		version = 2;
		padding = 0;
		extension = 0;
		cc = 0;
		marker = 0;
		ssrc = 0;
		
		// Header 필드 변경 
		sequenceNumber = frameIdx;
		timestamp = time;
		payloadType = pType;
		
		// 헤더 Bitstream 빌드 
		header = new byte[HEADER_SIZE];
		
		payload_size = data_length;
		payload = new byte[data_length];
	}

	public RTPpacket(byte[] packet, int packet_size) {
		version = 2;
		padding = 0;
		extension = 0;
		cc = 0;
		marker = 0;
		ssrc = 0;
		
		if(packet_size >= HEADER_SIZE){
			header = new byte[HEADER_SIZE];
			for(int i = 0; i < HEADER_SIZE; i++){
				header[i] = packet[i];
			}
			
			payload_size = packet_size - HEADER_SIZE;
			payload = new byte[payload_size];
			
			for(int i = HEADER_SIZE; i < packet_size; i++){
				payload[i - HEADER_SIZE] = packet[i];
				
				//헤더 필드 인터프리팅 
				payloadType = header[1] & 127;
				sequenceNumber = unsigned_int(header[3]) + 256 * unsigned_int(header[2]);
				timestamp = 
						unsigned_int(header[7]) + 256 * unsigned_int(header[6]) + 
						65536 * unsigned_int(header[5]) + 16777216 * unsigned_int(header[4]);
			}
		}
	}
	
	public int getpayload(byte[] data){
		for(int i = 0; i < payload_size; i++){
			data[i] = payload[i];
		}
		return payload_size;
	}
	
	public int getpayload_length(){
		return payload_size;
	}
	
	public int getlength(){
		return payload_size + HEADER_SIZE;
	}
	
	//전달받은 byte 배열에 값을 담고 길이를 반환.
	public int getpacket(byte[] packet){
		// 패킷 생성 packet = header + payload
		for(int i = 0; i < HEADER_SIZE; i++){
			packet[i] = header[i];
		}
		
		for(int i = 0; i < payload_size; i++){
			packet[i + HEADER_SIZE] = payload[i];
		}
		return payload_size + HEADER_SIZE;
	}
	
	public int gettimestamp(){
		return timestamp;
	}
	
	public int getsequenceNumber(){
		return sequenceNumber;
	}
	
	public int getpayloadType(){
		return payloadType;
	}
	
	// 헤더 정보 출력 
	// 패킷 스니퍼처럼 찍는건가...
	public void printHeader(){
		//4 는 왜 빼는데?
		for(int i = 0; i <(HEADER_SIZE - 4); i++){
			 for(int j = 7; j >= 0; j--){
				 // 이 byte 연산의 의미는 무엇인가.
				 if(((1 << j) & header[i]) != 0){
					 System.out.print("1");
				 }else{
					 System.out.print("0");
					 System.out.print(" ");
				 }
			 }
		}
		System.out.println();
	}
	
	// 왜 256 더해? 
	static int unsigned_int(int number) {
		if(number >= 0) return number;
		else return 256 + number;
	}
}
