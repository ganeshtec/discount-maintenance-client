package com.homer.runner;

import com.homer.logger.HomerLogger;
import com.homer.tctpupload.ALMRunner;

public class ALMTCTPUpload {

	public static void main(String[] args) throws Exception {
		
		ALMRunner almtctpupload = new ALMRunner();
		almtctpupload.almtctpupload();
		
		HomerLogger.getInstance().info("ALM Test Case Upload completed Successfully");	
	}
}