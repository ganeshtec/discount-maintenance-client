package com.homer.glue;

import com.homer.dao.And;
import com.homer.dao.Constants;
import com.homer.dao.DataClass;
import com.homer.dao.Then;
import com.homer.dao.When;
import com.homer.po.PurchaseConditionAndRewards;

public class PurchaseConditionAndRewardsStepDefn extends BaseStepDefn {
	
	public PurchaseConditionAndRewardsStepDefn(DataClass ih) {
		super(ih);
	}	
			
	@Then("^Purchase Condition and Reward page is displayed$")
	public void purchase_Condition_and_Reward_page_is_displayed() throws Throwable { 
		purchaseCondAndRewards = new PurchaseConditionAndRewards(ic);
		purchaseCondAndRewards.VerifyPage();	  
	} 
	
	@When("^I enter the Purchase condtion for the new promotion$")
	public void i_enter_the_Purchase_condtion_for_the_new_promotion() throws Throwable { 
		purchaseCondAndRewards.enterPurchaseConditionsAndRewards(Constants.PurchaseOptItems, Constants.MinPurchaseTypeOptQty);	  
	}	
	
	@When("^I enter the Purchase condtion with minimum purchase type as amount$")
	public void i_enter_the_Purchase_condtion_with_minimum_purchase_type_as_amount() throws Throwable { 
		purchaseCondAndRewards.enterPurchaseConditionsAndRewards(Constants.PurchaseOptItems, Constants.MinPurchaseTypeOptAmt);	  

	}
	
	@And("^I click on the Add New Condition button$")
	public void i_click_on_the_Add_New_Condition_button() throws Throwable { 
		purchaseCondAndRewards.clickAddPurchaseCond();  
	}

	@And("^I enter the new Minimum Purchase conditions$")
	public void i_enter_the_new_Minimum_Purchase_conditions() throws Throwable { 
		purchaseCondAndRewards.enterAdditionalPurchaseCond();
	}

	@And("^I click the Remove button to remove the Purchase Condition on row \"(.*?)\"$")
	public void i_click_the_Remove_button_to_remove_the_Purchase_Condition_on_row_arg1(String strOpt) throws Throwable { 
		purchaseCondAndRewards.clickRemovePurchaseCond(Integer.parseInt(strOpt));
		Thread.sleep(5000);
	}
	
}
