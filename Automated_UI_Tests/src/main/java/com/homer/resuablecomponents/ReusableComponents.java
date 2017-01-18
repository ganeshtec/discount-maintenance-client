package com.homer.resuablecomponents;

import java.util.HashMap;
import org.openqa.selenium.WebDriver;
import com.homer.helper.DataTable;
import com.homer.reports.Report;

public class ReusableComponents {

	Report report;
	WebDriver driver;
	WebDriverHelper wh;
	DataTable dataHelper;
	public boolean terminateTestOnElementNotPresent = true;
	public HashMap<String, Object> dataStore = new HashMap<String, Object>();
	public static final int appTimeoutsetting=30;
	
	public ReusableComponents(WebDriver driver, Report report,
			WebDriverHelper wh, DataTable dataHelper) {

		this.report = report;
		this.driver = driver;
		this.dataHelper = dataHelper;
		this.wh = wh;
	}
	
	/**
	 * Method to throw custom exception to terminate test case
	 * 
	 * @throws Exception
	 */
	public void throwCustomException() throws Exception {

		throw new Exception("Custom Error");
	}

	/**
	 * Method to terminate test case.
	 * 
	 * @param pageName
	 * @throws Exception
	 */
	public void terminateTestCase(String strMessage) throws Exception {

			report.addCustomErrorStep("Terminating test case",
					"Terminating test case : " + strMessage);
							
			throwCustomException();
	}		
}