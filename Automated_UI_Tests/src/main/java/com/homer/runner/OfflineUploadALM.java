package com.homer.runner;

import com.homer.helper.OfflineALMUploader;
import com.homer.logger.HomerLogger;

public class OfflineUploadALM {

	public static void main(String[] args) throws Exception {
		
		OfflineALMUploader almUploader = new OfflineALMUploader();
		almUploader.uploadResultsOffline();
		
		HomerLogger.getInstance().info("QC update Completed Successfully");	
	}
}
