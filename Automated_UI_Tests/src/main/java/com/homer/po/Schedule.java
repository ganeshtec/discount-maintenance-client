package com.homer.po;

import org.openqa.selenium.By;
import com.homer.dao.Constants;
import com.homer.dao.DataColumn;
import com.homer.dao.InstanceContainer;
import com.homer.enums.EnumClass.StepResult;

public class Schedule extends PageBase<Schedule> {
	
	static final By txtStartDate = By.name("start");
	static final By txtEndDate = By.name("end");
	static final By elePageSection = By.xpath("(//section[@class='admin__promotion__section' and @ng-show='index == 4 || preview'])");
	
	public Schedule(InstanceContainer ic) {
		 super(ic);        	     
	}
	
	public void VerifyPage() throws Exception {
			
		if(wh.isElementPresent(elePageSection))
			report.addReportStep("Navigate to Schedule Page" , "Schedule Page displayed successfully .", StepResult.PASS);
		else{
			report.addReportStep("Navigate to Schedule Page" , "Navigate to Schedule Page failed .", StepResult.FAIL);
			rc.terminateTestCase("Schedule Page not displayed");
		}
	}
				
	public void enterSchedule() throws Exception {
		//Using clear on the date field was throwing error so used the following function
		if(wh.enterValueWithoutClearing(txtStartDate, dataTable.getData(DataColumn.StartDate), Constants.StartDateField)
			&& wh.enterValueWithoutClearing(txtEndDate, dataTable.getData(DataColumn.EndDate), Constants.EndDateField))	
			report.addReportStep("Enter start and end date", "start and end date entered successfully .", StepResult.PASS);
		else{
			report.addReportStep("Enter start and end date", "start and end date could not be entered successfully .", StepResult.FAIL);
			rc.terminateTestCase(" Error entering start and end date for the new promotion");
		}
	}	
}
		
			
	