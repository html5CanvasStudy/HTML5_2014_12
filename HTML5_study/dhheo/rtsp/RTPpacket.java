package com.spring.mvc.rtsp;

public class RTPpacket {

	public static int MJPEG_TYPE = 26;		// payload type for MJPEG video
	private static int HEADER_SIZE = 12;	// size of the header

	// Fields that compose the header
	private int headerVersion;
	private int headerPadding;
	private int headerExtension;
	private int headerCC;
	private int headerMarker;
	private int headerPayloadType;
	private int headerSequenceNumber;
	private int headerTimeStamp;
	private int headerSsrc;

	private byte[] header;		// Bitstream of the header
	private byte[] payload;		// Bitstream of the payload
	private int payloadSize;	// size of the payload

	/**
	 * shared with both public constructors
	 */
	private RTPpacket() {
		// fill default fields
		headerVersion = 2;
		headerPadding = 0;
		headerExtension = 0;
		headerCC = 0;
		headerMarker = 0;
		headerSsrc = 0;
	}

	/**
	 * Construct from header fields and payload bitstream
	 */
	public RTPpacket(int payloadType, int frameNumber, int timeStamp, byte[] data, int dataLength) {
		this();

		// fill changing header fields
		headerSequenceNumber = frameNumber;
		headerTimeStamp = timeStamp;
		headerPayloadType = payloadType;

		// build the header bistream
		header = new byte[HEADER_SIZE];
		header[0]  = (byte) (0 | headerVersion << 6 | headerPadding << 5 | headerExtension << 4 | headerCC);
		header[1]  = (byte) (0 | headerMarker << 7 | headerPayloadType);
		header[2]  = (byte)  (headerSequenceNumber >> 8);
		header[3]  = (byte)  (headerSequenceNumber & 0xFF);
		header[4]  = (byte)  (headerTimeStamp >> 24);
		header[5]  = (byte) ((headerTimeStamp >> 16) & 0xFF);
		header[6]  = (byte) ((headerTimeStamp >> 8)  & 0xFF);
		header[7]  = (byte)  (headerTimeStamp        & 0xFF);
		header[8]  = (byte)  (headerSsrc >> 24);
		header[9]  = (byte) ((headerSsrc >> 16) & 0xFF);
		header[10] = (byte) ((headerSsrc >> 8)  & 0xFF);
		header[11] = (byte)  (headerSsrc        & 0xFF);
        System.out.println();
        for ( int i = 0; i < header.length; i++ ) System.out.print(header[i] + " ");
        System.out.println();// fill the payload bitstream
		payloadSize = dataLength;
		payload = new byte[dataLength];
		// fill payload array of byte from data
		for (int i = 0; i < payloadSize; i++) {
			payload[i] = data[i];
		}
	}

	/**
	 * Construct from the packet bitstream
	 */
	public RTPpacket(byte[] packet, int packetSize) {
		this();

		// check if total packet size is lower than the header size
		if (packetSize >= HEADER_SIZE) {
			// get the header bitsream
			header = new byte[HEADER_SIZE];
			for (int i = 0; i < HEADER_SIZE; i++) {
				header[i] = packet[i];
			}

			// get the payload bitstream
			payloadSize = packetSize - HEADER_SIZE;
			payload = new byte[payloadSize];
			for (int i = HEADER_SIZE; i < packetSize; i++) {
				payload[i - HEADER_SIZE] = packet[i];
			}

			// interpret the changing fields of the header
			headerPayloadType = header[1] & 127;
			headerSequenceNumber = unsignedInt(header[3]) + 256 * unsignedInt(header[2]);
			headerTimeStamp = unsignedInt(header[7]) + 256 * unsignedInt(header[6]) + 65536 * unsignedInt(header[5]) + 16777216 * unsignedInt(header[4]);
		}
	}

	/**
	 * Fills data with the payload bistream of the RTPpacket and returns the size of the payload
	 * @param data 
	 * @return the size of the RTPpacket payload
	 */
	public int getPayload(byte[] data) {
		for (int i = 0; i < payloadSize; i++) {
			data[i] = payload[i];
		}
		return payloadSize;
	}

	/**
	 * Returns the length of the payload
	 * @return the length of the payload
	 */
	public int getPayloadLength() {
		return payloadSize;
	}

	/**
	 * Returns the total length of the RTP packet
	 * @return the total length of the RTP packet
	 */
	public int getLength() {
		return payloadSize + HEADER_SIZE;
	}

	/**
	 * Fills packet with header and payload data and returns packet size
	 * @param packet
	 * @return the total size of the packet (header && payload)
	 */
	public int getPacket(byte[] packet) {
		// construct the packet = header + payload
		for (int i = 0; i < HEADER_SIZE; i++) {
			packet[i] = header[i];
		}
		for (int i = 0; i < payloadSize; i++) {
			packet[i + HEADER_SIZE] = payload[i];
		}
		// return total size of the packet
		return payloadSize + HEADER_SIZE;
	}

	public int getTimeStamp() {
		return headerTimeStamp;
	}

	public int getSequenceNumber() {
		return headerSequenceNumber;
	}

	public int getPayloadType() {
		return headerPayloadType;
	}

	/**
	 * Print headers without the SSRC
	 */
	public void printheader() {
		for (int i = 0; i < (HEADER_SIZE - 4); i++) {
			for (int j = 7; j >= 0; j--) {
				if (((1 << j) & header[i]) != 0) {
					System.out.print("1");
				} else {
					System.out.print("0");
				}
			}
			System.out.print(" ");
		}
		System.out.println();
	}

	/**
	 * Returns the unsigned value of 8-bit integer nb
	 * @param i
	 * @return the unsigned value of 8-bit integer nb
	 */
	public static int unsignedInt(int i) {
		return i >= 0 ? i : 256 + i;
	}

}

/*
-128 26 0 1 0 0 0 100 0 0 0 0

-128 26 0 2 0 0 0 -56 0 0 0 0

-128 26 0 3 0 0 1 44 0 0 0 0

-128 26 0 4 0 0 1 -112 0 0 0 0

-128 26 0 5 0 0 1 -12 0 0 0 0

-128 26 0 6 0 0 2 88 0 0 0 0

-128 26 0 7 0 0 2 -68 0 0 0 0

-128 26 0 8 0 0 3 32 0 0 0 0

-128 26 0 9 0 0 3 -124 0 0 0 0

-128 26 0 10 0 0 3 -24 0 0 0 0

-128 26 0 11 0 0 4 76 0 0 0 0

-128 26 0 12 0 0 4 -80 0 0 0 0

-128 26 0 13 0 0 5 20 0 0 0 0

-128 26 0 14 0 0 5 120 0 0 0 0

-128 26 0 15 0 0 5 -36 0 0 0 0

-128 26 0 16 0 0 6 64 0 0 0 0

-128 26 0 17 0 0 6 -92 0 0 0 0

-128 26 0 18 0 0 7 8 0 0 0 0

-128 26 0 19 0 0 7 108 0 0 0 0

-128 26 0 20 0 0 7 -48 0 0 0 0

-128 26 0 21 0 0 8 52 0 0 0 0

-128 26 0 22 0 0 8 -104 0 0 0 0

-128 26 0 23 0 0 8 -4 0 0 0 0

-128 26 0 24 0 0 9 96 0 0 0 0

-128 26 0 25 0 0 9 -60 0 0 0 0

-128 26 0 26 0 0 10 40 0 0 0 0

-128 26 0 27 0 0 10 -116 0 0 0 0

-128 26 0 28 0 0 10 -16 0 0 0 0

-128 26 0 29 0 0 11 84 0 0 0 0

-128 26 0 30 0 0 11 -72 0 0 0 0

-128 26 0 31 0 0 12 28 0 0 0 0

-128 26 0 32 0 0 12 -128 0 0 0 0

-128 26 0 33 0 0 12 -28 0 0 0 0

-128 26 0 34 0 0 13 72 0 0 0 0

-128 26 0 35 0 0 13 -84 0 0 0 0

-128 26 0 36 0 0 14 16 0 0 0 0

-128 26 0 37 0 0 14 116 0 0 0 0

-128 26 0 38 0 0 14 -40 0 0 0 0

-128 26 0 39 0 0 15 60 0 0 0 0

-128 26 0 40 0 0 15 -96 0 0 0 0

-128 26 0 41 0 0 16 4 0 0 0 0

-128 26 0 42 0 0 16 104 0 0 0 0

-128 26 0 43 0 0 16 -52 0 0 0 0

-128 26 0 44 0 0 17 48 0 0 0 0

-128 26 0 45 0 0 17 -108 0 0 0 0

-128 26 0 46 0 0 17 -8 0 0 0 0

-128 26 0 47 0 0 18 92 0 0 0 0

-128 26 0 48 0 0 18 -64 0 0 0 0

-128 26 0 49 0 0 19 36 0 0 0 0

-128 26 0 50 0 0 19 -120 0 0 0 0

-128 26 0 51 0 0 19 -20 0 0 0 0

-128 26 0 52 0 0 20 80 0 0 0 0

-128 26 0 53 0 0 20 -76 0 0 0 0

-128 26 0 54 0 0 21 24 0 0 0 0

-128 26 0 55 0 0 21 124 0 0 0 0

-128 26 0 56 0 0 21 -32 0 0 0 0

-128 26 0 57 0 0 22 68 0 0 0 0

-128 26 0 58 0 0 22 -88 0 0 0 0

-128 26 0 59 0 0 23 12 0 0 0 0

-128 26 0 60 0 0 23 112 0 0 0 0

-128 26 0 61 0 0 23 -44 0 0 0 0

-128 26 0 62 0 0 24 56 0 0 0 0

-128 26 0 63 0 0 24 -100 0 0 0 0

-128 26 0 64 0 0 25 0 0 0 0 0

-128 26 0 65 0 0 25 100 0 0 0 0

-128 26 0 66 0 0 25 -56 0 0 0 0

-128 26 0 67 0 0 26 44 0 0 0 0

-128 26 0 68 0 0 26 -112 0 0 0 0

-128 26 0 69 0 0 26 -12 0 0 0 0

-128 26 0 70 0 0 27 88 0 0 0 0

-128 26 0 71 0 0 27 -68 0 0 0 0

-128 26 0 72 0 0 28 32 0 0 0 0

-128 26 0 73 0 0 28 -124 0 0 0 0

-128 26 0 74 0 0 28 -24 0 0 0 0

-128 26 0 75 0 0 29 76 0 0 0 0

-128 26 0 76 0 0 29 -80 0 0 0 0

-128 26 0 77 0 0 30 20 0 0 0 0

-128 26 0 78 0 0 30 120 0 0 0 0

-128 26 0 79 0 0 30 -36 0 0 0 0

-128 26 0 80 0 0 31 64 0 0 0 0

-128 26 0 81 0 0 31 -92 0 0 0 0

-128 26 0 82 0 0 32 8 0 0 0 0

-128 26 0 83 0 0 32 108 0 0 0 0

-128 26 0 84 0 0 32 -48 0 0 0 0

-128 26 0 85 0 0 33 52 0 0 0 0

-128 26 0 86 0 0 33 -104 0 0 0 0

-128 26 0 87 0 0 33 -4 0 0 0 0

-128 26 0 88 0 0 34 96 0 0 0 0

-128 26 0 89 0 0 34 -60 0 0 0 0

-128 26 0 90 0 0 35 40 0 0 0 0

-128 26 0 91 0 0 35 -116 0 0 0 0

-128 26 0 92 0 0 35 -16 0 0 0 0

-128 26 0 93 0 0 36 84 0 0 0 0

-128 26 0 94 0 0 36 -72 0 0 0 0

-128 26 0 95 0 0 37 28 0 0 0 0

-128 26 0 96 0 0 37 -128 0 0 0 0

-128 26 0 97 0 0 37 -28 0 0 0 0

-128 26 0 98 0 0 38 72 0 0 0 0

-128 26 0 99 0 0 38 -84 0 0 0 0

-128 26 0 100 0 0 39 16 0 0 0 0

-128 26 0 101 0 0 39 116 0 0 0 0

-128 26 0 102 0 0 39 -40 0 0 0 0

-128 26 0 103 0 0 40 60 0 0 0 0

-128 26 0 104 0 0 40 -96 0 0 0 0

-128 26 0 105 0 0 41 4 0 0 0 0

-128 26 0 106 0 0 41 104 0 0 0 0

-128 26 0 107 0 0 41 -52 0 0 0 0

-128 26 0 108 0 0 42 48 0 0 0 0

-128 26 0 109 0 0 42 -108 0 0 0 0

-128 26 0 110 0 0 42 -8 0 0 0 0

-128 26 0 111 0 0 43 92 0 0 0 0

-128 26 0 112 0 0 43 -64 0 0 0 0

-128 26 0 113 0 0 44 36 0 0 0 0

-128 26 0 114 0 0 44 -120 0 0 0 0

-128 26 0 115 0 0 44 -20 0 0 0 0

-128 26 0 116 0 0 45 80 0 0 0 0

-128 26 0 117 0 0 45 -76 0 0 0 0

-128 26 0 118 0 0 46 24 0 0 0 0

-128 26 0 119 0 0 46 124 0 0 0 0

-128 26 0 120 0 0 46 -32 0 0 0 0

-128 26 0 121 0 0 47 68 0 0 0 0

-128 26 0 122 0 0 47 -88 0 0 0 0

-128 26 0 123 0 0 48 12 0 0 0 0

-128 26 0 124 0 0 48 112 0 0 0 0

-128 26 0 125 0 0 48 -44 0 0 0 0

-128 26 0 126 0 0 49 56 0 0 0 0

-128 26 0 127 0 0 49 -100 0 0 0 0

-128 26 0 -128 0 0 50 0 0 0 0 0

-128 26 0 -127 0 0 50 100 0 0 0 0

-128 26 0 -126 0 0 50 -56 0 0 0 0

-128 26 0 -125 0 0 51 44 0 0 0 0

-128 26 0 -124 0 0 51 -112 0 0 0 0

-128 26 0 -123 0 0 51 -12 0 0 0 0

-128 26 0 -122 0 0 52 88 0 0 0 0

-128 26 0 -121 0 0 52 -68 0 0 0 0

-128 26 0 -120 0 0 53 32 0 0 0 0

-128 26 0 -119 0 0 53 -124 0 0 0 0

-128 26 0 -118 0 0 53 -24 0 0 0 0

-128 26 0 -117 0 0 54 76 0 0 0 0

-128 26 0 -116 0 0 54 -80 0 0 0 0

-128 26 0 -115 0 0 55 20 0 0 0 0

-128 26 0 -114 0 0 55 120 0 0 0 0

-128 26 0 -113 0 0 55 -36 0 0 0 0

-128 26 0 -112 0 0 56 64 0 0 0 0

-128 26 0 -111 0 0 56 -92 0 0 0 0

-128 26 0 -110 0 0 57 8 0 0 0 0

-128 26 0 -109 0 0 57 108 0 0 0 0

-128 26 0 -108 0 0 57 -48 0 0 0 0

-128 26 0 -107 0 0 58 52 0 0 0 0

-128 26 0 -106 0 0 58 -104 0 0 0 0

-128 26 0 -105 0 0 58 -4 0 0 0 0

-128 26 0 -104 0 0 59 96 0 0 0 0

-128 26 0 -103 0 0 59 -60 0 0 0 0

-128 26 0 -102 0 0 60 40 0 0 0 0

-128 26 0 -101 0 0 60 -116 0 0 0 0

-128 26 0 -100 0 0 60 -16 0 0 0 0

-128 26 0 -99 0 0 61 84 0 0 0 0

-128 26 0 -98 0 0 61 -72 0 0 0 0

-128 26 0 -97 0 0 62 28 0 0 0 0

-128 26 0 -96 0 0 62 -128 0 0 0 0

-128 26 0 -95 0 0 62 -28 0 0 0 0

-128 26 0 -94 0 0 63 72 0 0 0 0

-128 26 0 -93 0 0 63 -84 0 0 0 0

-128 26 0 -92 0 0 64 16 0 0 0 0

-128 26 0 -91 0 0 64 116 0 0 0 0

-128 26 0 -90 0 0 64 -40 0 0 0 0

-128 26 0 -89 0 0 65 60 0 0 0 0

-128 26 0 -88 0 0 65 -96 0 0 0 0

-128 26 0 -87 0 0 66 4 0 0 0 0

-128 26 0 -86 0 0 66 104 0 0 0 0
* */