package com.homer.runner;

import com.homer.setup.RunManager;

public class HomerRunner {

	public static void main(String[] args) throws Exception {	
		
		//Use below method to set PIP UI class to be called - AB testing
		//GenericUtil.setPIPUIClass();
		
		//Use below method to set AUT features - AUT testing
		//GenericUtil.setAUTSwitch();
		RunManager rm = new RunManager();
		rm.runTestCases(args);
		System.out.println("Automation execution completed successfully");
		System.exit(0);
	}
	
	
}
