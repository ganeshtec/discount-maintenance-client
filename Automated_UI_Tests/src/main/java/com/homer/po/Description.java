package com.homer.po;

import org.openqa.selenium.By;
import com.homer.dao.Constants;
import com.homer.dao.DataColumn;
import com.homer.dao.InstanceContainer;
import com.homer.enums.EnumClass.StepResult;

public class Description extends PageBase<Description> {
	
	static final By txtShortDesc = By.id("shortdesc");
	static final By txtLongDesc = By.id("longdesc");
	static final By elePageSection = By.xpath("(//section[@class='admin__promotion__section' and @ng-show='index == 2 || preview'])");
	
	public Description(InstanceContainer ic) {
		 super(ic);        	     
	}
	
	public void VerifyPage() throws Exception {
			
		if(wh.isElementPresent(elePageSection))
			report.addReportStep("Navigate to Description Page" , "Description Page displayed successfully .", StepResult.PASS);
		else{
			report.addReportStep("Navigate to Description Page" , "Navigate to Description Page failed .", StepResult.FAIL);
			rc.terminateTestCase("Description Page not displayed");
		}
	}
				
	public void enterDescription() throws Exception {
		if(wh.enterValues(txtShortDesc, dataTable.getData(DataColumn.ShortDesc), Constants.ShortDescField)
				&& wh.enterValues(txtLongDesc, dataTable.getData(DataColumn.LongDesc), Constants.LongDescField)){
	
			report.addReportStep("Enter Description", "Description entered successfully .", StepResult.PASS);
		}
		else{
			report.addReportStep("Enter Description", "Description could not be entered successfully .", StepResult.FAIL);
			rc.terminateTestCase(" Error entering Description for the new promotion");
		}
	}
}
		
			
	