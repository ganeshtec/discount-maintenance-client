package com.homer.po;

import org.openqa.selenium.*;
import com.homer.dao.CommonDataColumn;
import com.homer.dao.Constants;
import com.homer.dao.DataColumn;
import com.homer.dao.InstanceContainer;
import com.homer.enums.EnumClass.StepResult;

public class HomePage extends PageBase<HomePage> {
	
	public static final By homedepotLogo= By.xpath("//div[@id='thdLogo']/a/img");
	static final By eleTitle = By.cssSelector(".brand>span>h1");
	static final By txtPromoName = By.id("name");
	static final By slctPromoType = By.xpath("//select[@ng-model='promoSubTypeObject']");
	static final By slctRedemption = By.xpath("//select[@ng-model='data.promoCdRqrd']");
	static final By rdoPromoCodeType = By.name("promospec");
	static final By txtPromoCodes = By.id("promocodes");
	static final By txtPriority = By.name("priority");
	static final By elePageSection = By.xpath("(//section[@class='admin__promotion__section' and @ng-show='index == 0 || preview'])");
	static final By lnkPurchaseCondAndRewards = By.linkText("Purchase Condition & Reward");
	static final By lnkDescriptions = By.linkText("Descriptions");
	static final By lnkRedemptionLimits = By.linkText("Redemption Limits");
	static final By lnkSchedule = By.linkText("Schedule");
	static final By btnSubmit = By.linkText("Submit");
	static final By txtPrefix = By.id("prefix");
	static final By txtCodeLength = By.id("uniqcode");
	static final By txtSuffix = By.id("suffix");
	static final By txtNumOfCode = By.id("uniquenumbercode");
	static final By slctPromoCombo = By.name("promocombo");
	static final By btnAddNewCode = By.linkText("Add New Code");
	static final By btnRemoveCode = By.linkText("Remove");
			
	public HomePage(InstanceContainer ic) {
		 super(ic);        	     
	}
	
	/** Method to open Home Page **/	
	public void launchAdminUI() throws Exception {
		
		//Open the Home Page URL
		driver.get(dataTable.getCommonData(CommonDataColumn.EnvironmentUrl));	
		wh.waitForPageLoaded();
		driver.manage().window().maximize();
		 
		if(wh.isElementPresent(elePageSection))
			 report.addReportStep("Verify Promotions Admin UI Homepage is displayed", "Promotions Admin UI is sucessfully launched and home page displayed", StepResult.PASS);
		else {
			 report.addReportStep("Verify Promotions Admin UI Homepage is displayed", "Promotions Admin UI not launched.", StepResult.FAIL);
			 rc.terminateTestCase("Promotions Admin UI is not displayed");
		 }
	}
	
	/** Method to Select Promotion Type **/
	public void selectPromoType() throws Exception{
				
		//Get the Promotion type from test data
		strPromoType = dataTable.getData(DataColumn.PromoType);
		
		if(wh.dropDownSelect(slctPromoType, strPromoType, Constants.PromoTypeField))
			report.addReportStep("Select Promotion Type", "Promotion type '" + strPromoType + "' selected successfully .", StepResult.PASS);
		else
			rc.terminateTestCase("Error selecting promotion type '" + strPromoType + "'");
	}
	
	/** Method to enter promotion details by  selecting Public promotion code option **/	
	public void enterPublicPromoCodeDetails() throws Exception {
		
		if(wh.enterValues(txtPromoName, dataTable.getData(DataColumn.PromoName), Constants.PromoNameField)
			&& wh.dropDownSelect(slctRedemption, Constants.RequiresPromoCodes, Constants.RedemptionField)
			&& wh.radioButtonClick(rdoPromoCodeType, Constants.PromoCodeOptPublic, Constants.PromoCodeTypeField)
			&& wh.enterValues(txtPromoCodes, dataTable.getData(DataColumn.PromoCode), Constants.PromoCodeField)
			&& (!wh.isElementEnabled(slctPromoCombo))
			&& wh.enterValues(txtPriority, dataTable.getData(DataColumn.Priority), Constants.PriorityField)) {
	
			report.addReportStep("Enter details for public promotion code", "Promotion Code details entered successfully .", StepResult.PASS);
		}
		else {
			report.addReportStep("Enter details for public promotion code", "Promotion Code details could not be entered successfully", StepResult.FAIL);
			rc.terminateTestCase("Promotion Code details could not be entered successfully");
		}
	}	
	
	/** Method to enter promotion details by selecting System Generated Promotion Code option **/	
	public void enterSystemGeneratedPromoCodeDetails() throws Exception {
		
		if(wh.enterValues(txtPromoName, dataTable.getData(DataColumn.PromoName), Constants.PromoNameField)
			&& wh.dropDownSelect(slctRedemption, Constants.RequiresPromoCodes, Constants.RedemptionField)
			&& wh.radioButtonClick(rdoPromoCodeType, Constants.PromoCodeOptSystemGen, Constants.PromoCodeTypeField)
			&& wh.enterValues(txtPrefix, dataTable.getData(DataColumn.CodePrefix), Constants.CodePrefixField)
			&& wh.enterValues(txtCodeLength, dataTable.getData(DataColumn.CodeLength), Constants.CodeLengthField)
			&& wh.enterValues(txtSuffix, dataTable.getData(DataColumn.CodeSuffix), Constants.CodeSuffixField)
			&& wh.enterValues(txtNumOfCode, dataTable.getData(DataColumn.NumOfCode), Constants.NumOfCodeField)
			&& wh.enterValues(txtPriority, dataTable.getData(DataColumn.Priority), Constants.PriorityField)) {
			
			report.addReportStep("Enter details for System generated Unique Promotion Code", "Promotion Code details entered successfully .", StepResult.PASS);
		}
		else {
			report.addReportStep("Enter details for System generated Unique Promotion Code", "Promotion Code details could not be entered successfully", StepResult.FAIL);
			rc.terminateTestCase("Promotion Code details could not be entered successfully");
		}
	}
	
	/** Method to enter promotion details by selecting Qualifying Purchase as redemption method  **/	
	public void enterQualifyingPurchasePromoDetails() throws Exception {
		
		if(wh.enterValues(txtPromoName, dataTable.getData(DataColumn.PromoName), Constants.PromoNameField)
				&& wh.dropDownSelect(slctRedemption, Constants.QualifyingPurchase, Constants.RedemptionField)
				&& wh.enterValues(txtPriority, dataTable.getData(DataColumn.Priority), Constants.PriorityField)) {
				
			report.addReportStep("Enter details for the Qualifying Purchase Promotion", "Promotion Code details entered successfully .", StepResult.PASS);
		}
			
		else {
			report.addReportStep("Enter details for the Qualifying Purchase Promotion", "Promotion Code details could not be entered successfully", StepResult.FAIL);
			rc.terminateTestCase("Promotion Code details could not be entered successfully");
		}	
	}
	
	/**  Method to enter additional promotion codes **/	
	public void enterAdditionalPromoCodes() throws Exception {
		
		String strValues[] = new String [] { dataTable.getData(DataColumn.PromoCode1), dataTable.getData(DataColumn.PromoCode2), dataTable.getData(DataColumn.PromoCode3) };
		if(wh.enterMultipleTextValues(txtPromoCodes, strValues, Constants.PromoCode1Field))
			report.addReportStep("Enter Additional Promotion Codes", "Promotion Codes entered successfully .", StepResult.PASS);
		else {
			report.addReportStep("Enter Additional Promotion Codes", "Promotion Codes could not be entered successfully", StepResult.FAIL);
			rc.terminateTestCase("Promotion Codes could not be entered successfully");
		}	
	}
		
	/** Method to click Add New Code button **/	
	public void clickAddNewCode() throws Exception {
		
		if(!wh.clickElement(btnAddNewCode, Constants.AddNewCodeButton))
			 rc.terminateTestCase("Click on 'Add New Code' failed");
		else
			report.addReportStep("Click on 'Add New Code'", "'Add New Code' button clicked successfully", StepResult.PASS);
	}		

	/**  Method to click Remove Code button **/	
	public void clickRemoveCode(int intOpt) throws Exception {
		
		if(!wh.clickOneElementInList(btnRemoveCode, intOpt, Constants.RemoveCodeButton))
			 rc.terminateTestCase("Click on 'Remove' failed");
		else
			report.addReportStep("Click on 'Remove'", "'Remove' button clicked successfully", StepResult.PASS);
	}		

	/** Method to click on the given link **/	
	public void clickOnLink(String strLink) throws Exception {
			
		By lnkText = null;
		String strField = null;
			
		switch (strLink)
		{
			case "Purchase Condition & Reward":
				lnkText = lnkPurchaseCondAndRewards;
				strField = Constants.PurchaseCondRewardsLink;
				break;
				
			case "Descriptions" :
				lnkText = lnkDescriptions;
				strField = Constants.DescriptionsLink;
				break;

			case "Redemption Limits":
				lnkText = lnkRedemptionLimits;
				strField = Constants.RedemptionLimitsLink;
				break;
				
			case "Schedule":
				lnkText = lnkSchedule;
				strField = Constants.ScheduleLink;
				break;
		}
				
		if(!wh.clickElement(lnkText, strField))
			 rc.terminateTestCase("Click on '" + strLink + "' link failed");
		else
			report.addReportStep("Click on link '" + strLink + "'", "'" + strLink + "'  link clicked successfully", StepResult.PASS);
	}
	
	/** Method to click Submit **/	
	public void clickSubmit() throws Exception {
		
		if(!wh.clickElement(btnSubmit, Constants.SubmitButton))
			 rc.terminateTestCase("Click on Submit button failed");
		else
			report.addReportStep("Click Submit", "Submit button clicked successfully", StepResult.PASS);
	}
}