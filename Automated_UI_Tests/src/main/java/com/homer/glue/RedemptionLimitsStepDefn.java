package com.homer.glue;

import com.homer.dao.When;
import com.homer.dao.DataClass;
import com.homer.dao.Then;
import com.homer.po.RedemptionLimits;

public class RedemptionLimitsStepDefn extends BaseStepDefn {
	
	public RedemptionLimitsStepDefn(DataClass ih) {
		super(ih);
	}	
	
	@Then("^Redemption Limits page is displayed$")
	public void redemption_Limits_page_is_displayed() throws Throwable { 
		redemptionLimits = new RedemptionLimits(ic);
		redemptionLimits.VerifyPage(); 	  
	}
	
	@When("^I enter the Redemption Limits for the promotion$")
	public void i_enter_the_Redemption_Limits_for_the_promotion() throws Throwable { 
		redemptionLimits.enterRedemptionLimits();		
	}
	
	@When("^I enter the Maximum Redemption Limits for the promotion$")
	public void i_enter_the_Maximum_Redemption_Limits_for_the_promotion() throws Throwable { 
		redemptionLimits.enterMaxRedemption();
		redemptionLimits.enterMaxRedemptionSingleOrder();
		redemptionLimits.enterMaxRedemptionSingleCustomer();		  
	}	
}
		
	