package com.homer.resuablecomponents;

import java.io.File;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.Augmenter;

import com.homer.dao.DataClass;
import com.homer.enums.EnumClass.StepResult;
import com.homer.helper.HelperClass;
import com.homer.reports.Report;
import com.homer.util.DateUtil;

public class ReportUtil {
	
	public Report report;
	public DataClass data;
	
	public WebDriver tool;
	
	public ReportUtil(WebDriver tool,Report report, DataClass data) {
		 
		this.tool = tool;
		this.report = report;
		this.data = data;
	}
	
	public ReportUtil(Report report, DataClass data) {
		
		this.report = report;
		this.data = data;
	}
	
	public void addReportStep(String description, String actualResult,StepResult stepResult) throws Exception {
		
		boolean captureScreenShot = false;
		String fileName = "";
		
		if(stepResult == StepResult.PASS && HelperClass.baseModel.runPassScreenshots) {
			
			captureScreenShot= false;			
			
		} else if(HelperClass.baseModel.runFailScreenshots && (stepResult==StepResult.FAIL ||
				stepResult==StepResult.FAIL_ENV || stepResult==StepResult.FAIL_FEATURE ||
				stepResult==StepResult.FAIL_TESTDATA)) {
			
			captureScreenShot= true;
		}
		
		if(captureScreenShot) {
			
			fileName = takeScreenShot();
			report.addReportLinkScreenshot(description, actualResult, stepResult, fileName);
			
		} else {
			
			report.addReportStepNoScreenshots(description, actualResult, stepResult);
		}
	}

	private String takeScreenShot() {
		
		String formattedDate = DateUtil.getFormattedDateTime();
		String screenShotFilePath = "";
		String testCaseName = data.testCaseName.replace(" ", "_");

		String stepDateForScreenShot;
		int maxTCNameLength;
		int maxScreenShotNameLength = 50;

		stepDateForScreenShot = "_Step-No_" +data.stepNo +"_"+ formattedDate + ".png";

		maxTCNameLength = maxScreenShotNameLength
				- stepDateForScreenShot.length();

		if (testCaseName.length() > maxTCNameLength) {

			testCaseName = testCaseName.substring(0, maxTCNameLength);
		}

		screenShotFilePath = "./ScreenShots/" + testCaseName
				+ stepDateForScreenShot;

		String screnShotSavePath = "";

		screnShotSavePath = data.screenShotFolder + "/" + testCaseName
				+ stepDateForScreenShot;

		try {
			saveScreenShot(screnShotSavePath);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return screenShotFilePath;
	}

	/*private void saveScreenShot(String screnShotSavePath) {
		
        try{
        	
            BufferedImage image = new Robot().createScreenCapture(new Rectangle(Toolkit.getDefaultToolkit().getScreenSize()));
            ImageIO.write(image, "png", new File(screnShotSavePath));
        }
        catch(Exception e){
           System.out.println("Unable to capture Screenshot--"+e); 
        }
	}	*/
	
	private void saveScreenShot(String screnShotSavePath) throws Exception {
		
		File scrFile;		
		/*	
		scrFile = ((TakesScreenshot)tool)
				.getScreenshotAs(OutputType.FILE);	*/
			

		WebDriver augmentedDriver = new Augmenter().augment(tool);
		scrFile = ((TakesScreenshot) augmentedDriver)
				.getScreenshotAs(OutputType.FILE);
		
		FileUtils.copyFile(scrFile, new File(screnShotSavePath));
	}

}
