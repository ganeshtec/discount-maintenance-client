package com.homer.glue;

import com.homer.dao.And;
import com.homer.dao.DataClass;
import com.homer.dao.Given;
import com.homer.dao.Then;
import com.homer.dao.When;
import com.homer.po.HomePage;

public class HomePageStepDefn extends BaseStepDefn {
	
	public HomePageStepDefn(DataClass ih) {
		super(ih);
	}	
		
	@Given("^I am on the Promotions Admin UI page$")
	public void i_am_on_the_Promotions_Admin_UI_page() throws Throwable { 
		homePage = new HomePage(ic);
		homePage.launchAdminUI();
	}
	
	//PromoType is read from the data sheet 
	//In feature file just to indicate the different Promo type it is used as a variable
	@And("^I select Promotion Type \"(.*?)\"$")
	public void i_select_Promotion_Type_arg1(String arg1) throws Throwable { 
		homePage.selectPromoType();
	}
	
	@When("^I enter the promotion Properties$")
	public void i_enter_the_promotion_Properties() throws Throwable { 
		 homePage.enterPublicPromoCodeDetails(); 	  
	}
	
	@When("^I enter the System generated unique promotion Properties$")
	public void i_enter_the_System_generated_unique_promotion_Properties() throws Throwable { 
		homePage.enterSystemGeneratedPromoCodeDetails();	  
	}
	
	@When("^I enter the promotion Properties with Qualifying Purchase as Redemption Method$")
	public void i_enter_the_promotion_Properties_with_Qualifying_Purchase_as_Redemption_Method() throws Throwable { 
		homePage.enterQualifyingPurchasePromoDetails();
	}
	
	@And("^I click on the Add New Code button$")
	public void i_click_on_the_Add_New_Code_button() throws Throwable { 
		homePage.clickAddNewCode();
	  
	}

	@And("^I enter the new Promotion Codes$")
	public void i_enter_the_new_Promotion_Codes() throws Throwable { 
		homePage.enterAdditionalPromoCodes();
	}

	@And("^I click the Remove button to remove the (\\d+)nd Promotion Code$")
	public void i_click_the_Remove_button_to_remove_the_2nd_Promotion_Code() throws Throwable { 
		homePage.clickRemoveCode(1);
	}

	@And("^I Click on the \"(.*?)\" link$")
	public void i_Click_on_the_arg1_link(String strLink) throws Throwable {
		homePage.clickOnLink(strLink);	  
	}	
	
	@And("^I click on the Submit button$")
	public void i_click_on_the_Submit_button() throws Throwable { 
	 // Write code here that turns the phrase above into concrete actions 
	  
	}

	@Then("^the New Promotion is created successfully$")
	public void the_New_Promotion_is_created_successfully() throws Throwable { 
	 // Write code here that turns the phrase above into concrete actions 
	  
	}
}
