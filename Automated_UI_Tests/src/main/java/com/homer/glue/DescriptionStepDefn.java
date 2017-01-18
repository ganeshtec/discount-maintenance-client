package com.homer.glue;

import com.homer.dao.DataClass;
import com.homer.dao.Then;
import com.homer.dao.When;
import com.homer.po.Description;


public class DescriptionStepDefn extends BaseStepDefn {
	
	public DescriptionStepDefn(DataClass ih) {
		super(ih);
	}	
	
	@Then("^Descriptions page is displayed$")
	public void descriptions_page_is_displayed() throws Throwable { 
		description = new Description(ic);
		description.VerifyPage();	  
	}
	
	@When("^I enter the Promotion descriptions$")
	public void i_enter_the_Promotion_descriptions() throws Throwable { 
		description.enterDescription();	  
	}
}
		
	