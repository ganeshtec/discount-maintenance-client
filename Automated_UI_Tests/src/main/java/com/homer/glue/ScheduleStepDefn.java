package com.homer.glue;

import com.homer.dao.DataClass;
import com.homer.dao.Then;
import com.homer.dao.When;
import com.homer.po.Schedule;


public class ScheduleStepDefn extends BaseStepDefn {
	
	public ScheduleStepDefn(DataClass ih) {
		super(ih);
	}	
	
	@Then("^Schedule page is displayed$")
	public void schedule_page_is_displayed() throws Throwable { 
		schedule = new Schedule(ic);
		schedule.VerifyPage();	  
	}
	
	@When("^I enter the Schedule for the promotion$")
	public void i_enter_the_Schedule_for_the_promotion() throws Throwable { 
		schedule.enterSchedule();	  
	}
}
		
	