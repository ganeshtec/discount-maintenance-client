package com.homer.po;

import org.openqa.selenium.By;
import com.homer.dao.Constants;
import com.homer.dao.DataColumn;
import com.homer.dao.InstanceContainer;
import com.homer.enums.EnumClass.StepResult;

public class PurchaseConditionAndRewards extends PageBase<PurchaseConditionAndRewards> {
	
	static final By btnNext = By.linkText("Next");
	static final By rdoPurchaseOption = By.name("purchaseoption");
	static final By rdoPurchaseType = By.name("minpurchase");
	static final By txtMinimumQty = By.id("minamount");
	static final By txtValueOff = By.id("value");
	static final By txtMaxDiscount = By.id("maxval");
	static final By elePageSection = By.xpath("(//section[@class='admin__promotion__section' and @ng-show='index == 1 || preview'])");
	static final By btnAddNewCond = By.linkText("Add New Condition");
	static final By btnRemovePurcahseCond = By.cssSelector(".md-text-field>a");
	
	public PurchaseConditionAndRewards(InstanceContainer ic) {
		 super(ic);        	     
	}
	
	/** Method to Verify the Page displayed **/
	public void VerifyPage() throws Exception {
			
		if(wh.isElementPresent(elePageSection))
			report.addReportStep("Navigate to Purchase Condition and Rewards Page" , "Purchase Condition and Rewards Page displayed successfully .", StepResult.PASS);
		else {
			report.addReportStep("Navigate to Purchase Condition and Rewards Page" , "Navigate to Purchase Condition and Rewards Page failed .", StepResult.FAIL);
			rc.terminateTestCase("Purchase Condition and Rewards Page not displayed");
		}
	}
	
	/** Method to enter purchase conditions and rewards for the promotion **/
	public void enterPurchaseConditionsAndRewards(int intPurchaseOpt, int intPurchaseTypeOpt) throws Exception {
		
		if(wh.radioButtonClick(rdoPurchaseOption, intPurchaseOpt, Constants.PurchaseCondField)
				&& wh.radioButtonClick(rdoPurchaseType, intPurchaseTypeOpt, Constants.MinPurchaseTypeField)					
				&& wh.enterValues(txtMinimumQty, dataTable.getData(DataColumn.MinPurchase), Constants.MinQtyField)
				&& wh.enterValues(txtValueOff, dataTable.getData(DataColumn.ValueOff), Constants.ValueOffField)) {
			
			// Only promotion type with percentage will need the Max discount to be populated
			if(strPromoType.toLowerCase().contains("percentage")) {
				if(!wh.enterValues(txtMaxDiscount, dataTable.getData(DataColumn.MaxDiscount), Constants.MaxDiscAmtField)) {

					report.addReportStep("Enter Purchase Condition and Rewards", "Purchase Condition and Rewards could not be entered successfully .", StepResult.FAIL);
					rc.terminateTestCase("Purchase Condition and Rewards could not be entered successfully");				
				}
			}
		}
		else {
			report.addReportStep("Enter Purchase Condition and Rewards", "Purchase Condition and Rewards could not be entered successfully .", StepResult.FAIL);
			rc.terminateTestCase("Purchase Condition and Rewards could not be entered successfully");
		}
			
		report.addReportStep("Enter Purchase Condition and Rewards", "Purchase Condition and Rewards entered successfully .", StepResult.PASS);
	}
	
	/** Method to click Add new Purchase condition **/	
	public void clickAddPurchaseCond() throws Exception {
		
		if(!wh.clickElement(btnAddNewCond, Constants.AddNewCondButton))
			 rc.terminateTestCase("Click on 'Add New Condition' button failed");
		else
			report.addReportStep("Click 'Add New Condition'", "'Add New Condition' clicked successfully", StepResult.PASS);
	}
	
	/**  Method to enter additional purchase conditions **/	
	public void enterAdditionalPurchaseCond() throws Exception {
		
		String strMinPurchase[] = new String [] { dataTable.getData(DataColumn.MinPurchase1), dataTable.getData(DataColumn.MinPurchase2), dataTable.getData(DataColumn.MinPurchase3) };
		String strValueOff[] = new String [] { dataTable.getData(DataColumn.ValueOff1), dataTable.getData(DataColumn.ValueOff2), dataTable.getData(DataColumn.ValueOff3) };
		
		if(wh.enterMultipleTextValues(txtMinimumQty, strMinPurchase, Constants.PurchaseCondField1)
				&& wh.enterMultipleTextValues( txtValueOff, strValueOff, Constants.PurchaseCondField1)) {
			
			// Only promotion type with percentage will need the Max discount to be populated
			if(strPromoType.toLowerCase().contains("percentage")) {
				String strMaxDiscount[] = new String [] { dataTable.getData(DataColumn.MaxDiscount1), dataTable.getData(DataColumn.MaxDiscount2), dataTable.getData(DataColumn.MaxDiscount3) };
				
				if(!wh.enterMultipleTextValues(txtMaxDiscount, strMaxDiscount, Constants.PurchaseCondField1)) {
					report.addReportStep("Enter Additional Purchase Condition", "Additional Purchase Conditions could not be entered successfully .", StepResult.FAIL);
					rc.terminateTestCase("Additional Purchase Conditions could not be entered successfully");				
				}
			}
		}
		else {
			report.addReportStep("Enter Additional Purchase Conditions", "Additional Purchase Conditions could not be entered successfully", StepResult.FAIL);
			rc.terminateTestCase("Additional Purchase Condition could not be entered successfully");
		}	
		
		report.addReportStep("Enter Additional Purchase Conditions", "Additional Purchase Conditions entered successfully .", StepResult.PASS);
	}
	
	/**  Method to click Remove Purchase condition button **/	
	public void clickRemovePurchaseCond(int intOpt) throws Exception {
		
		//To remove the intOpt option from the list the index to be used is option - 1 
		if(!wh.clickOneElementInList(btnRemovePurcahseCond, intOpt - 1, Constants.RemovePurchCondButton))
			 rc.terminateTestCase("Click on 'Remove Purchase Condition' failed");
		else
			report.addReportStep("Click on 'Remove Purchase Condition'", "'Remove Purchase Condition' button clicked successfully", StepResult.PASS);
	}	
}
		
			
	