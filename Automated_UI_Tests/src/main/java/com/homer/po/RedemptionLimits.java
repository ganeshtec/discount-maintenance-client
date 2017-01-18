package com.homer.po;

import org.openqa.selenium.By;
import com.homer.dao.Constants;
import com.homer.dao.DataColumn;
import com.homer.dao.InstanceContainer;
import com.homer.enums.EnumClass.StepResult;

public class RedemptionLimits extends PageBase<RedemptionLimits> {
	
	static final By rdoMaxRedemptionLimit = By.name("promomax");
	static final By txtMaxRedemption = By.id("promomaxredem");
	static final By txtMaxRedempOrder = By.id("maxordertext");
	static final By rdoMaxRedemptionSingleOrder = By.name("ordermax");
	static final By rdoMaxRedemptionSingleCust = By.name("custmax");
	static final By txtMaxRedemptionCust = By.id("maxcusttext");
	static final By elePageSection = By.xpath("(//section[@class='admin__promotion__section' and @ng-show='index == 3 || preview'])");
	
	public RedemptionLimits(InstanceContainer ic) {
		 super(ic);        	     
	}
	
	public void VerifyPage() throws Exception {
			
		if(wh.isElementPresent(elePageSection))
			report.addReportStep("Navigate to Redemption Limits Page" , "Redemption Limits Page displayed successfully .", StepResult.PASS);
		else{
			report.addReportStep("Navigate to Redemption Limits Page" , "Navigate to Redemption Limits Page failed .", StepResult.FAIL);
			rc.terminateTestCase("Redemption Limits Page not displayed");
		}
	}
				
	public void enterRedemptionLimits() throws Exception {
		
		if(wh.radioButtonClick(rdoMaxRedemptionLimit, Constants.RedemptionOptUnlimited, Constants.MaxRedemptionLimitField)
				&& wh.radioButtonClick(rdoMaxRedemptionSingleOrder, Constants.RedemptionOptUnlimited, Constants.MaxRedemptionSingleOrderField)
				&& wh.radioButtonClick(rdoMaxRedemptionSingleCust, Constants.RedemptionOptUnlimited, Constants.MaxRedemptionSingleCustField)) {
	
			report.addReportStep("Select Unlimited Redemption Limits", "Redemption Limits selected successfully .", StepResult.PASS);
		}
		else{
			report.addReportStep("Select Unlimited Redemption Limits", "Redemption Limits could not be selected successfully .", StepResult.FAIL);
			rc.terminateTestCase(" Error selecting Redemption Limits for the new promotion");
		}		
	}
		
	public void enterMaxRedemption() throws Exception{
		if(wh.radioButtonClick(rdoMaxRedemptionLimit, Constants.RedemptionOptMax, Constants.MaxRedemptionLimitField)
			&& wh.enterValues(txtMaxRedemption, dataTable.getData(DataColumn.MaxRedemption), Constants.MaxRedemptionField)){
			
			report.addReportStep("Enter Maximum Redemptions", "Maximum Redemptions entered successfully .", StepResult.PASS);

		}
		else{
			report.addReportStep("Enter Maximum Redemptions", "Maximum Redemptions could not be entered successfully .", StepResult.FAIL);
			rc.terminateTestCase(" Error entering Maximum Redemptions for the new promotion");
		}		
	}
	
	public void enterMaxRedemptionSingleOrder() throws Exception{
		if(wh.radioButtonClick(rdoMaxRedemptionSingleOrder, Constants.RedemptionOptMax, Constants.MaxRedemptionSingleOrderField)
			&& wh.enterValues(txtMaxRedempOrder, dataTable.getData(DataColumn.MaxRedemptionOrder), Constants.MaxRedemptionSingleOrderField)){
			
			report.addReportStep("Enter Maximum Redemptions on Single Order", "Maximum Redemptions on Single Order entered successfully .", StepResult.PASS);

		}
		else{
			report.addReportStep("Enter Maximum Redemptions on Single Order", "Maximum Redemptions could not be entered successfully .", StepResult.FAIL);
			rc.terminateTestCase(" Error entering Maximum Redemptions on Single Order for the new promotion");
		}
	}
	
	public void enterMaxRedemptionSingleCustomer() throws Exception{
		if(wh.radioButtonClick(rdoMaxRedemptionSingleCust, Constants.RedemptionOptMax, Constants.MaxRedemptionSingleCustField)
			&& wh.enterValues(txtMaxRedemptionCust, dataTable.getData(DataColumn.MaxRedemptionCustomer), Constants.MaxRedemptionCustField)){
			
			report.addReportStep("Enter Maximum Redemptions on Single Customer", "Maximum Redemptions on Single Customer entered successfully .", StepResult.PASS);

		}
		else{
			report.addReportStep("Enter Maximum Redemptions on Single Customer", "Maximum Redemptions could not be entered successfully .", StepResult.FAIL);
			rc.terminateTestCase(" Error entering Maximum Redemptions on Single Customer for the new promotion");
		}
	}
}