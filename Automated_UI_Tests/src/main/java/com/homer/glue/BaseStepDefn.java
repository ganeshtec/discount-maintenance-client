package com.homer.glue;

import org.openqa.selenium.WebDriver;
import com.homer.dao.CommonData;
import com.homer.dao.DataClass;
import com.homer.dao.InstanceContainer;
import com.homer.helper.DataTable;
import com.homer.helper.HelperClass;
import com.homer.po.HomePage;
import com.homer.po.PurchaseConditionAndRewards;
import com.homer.po.Description;
import com.homer.po.RedemptionLimits;
import com.homer.po.Schedule;
import com.homer.reports.Report;
import com.homer.resuablecomponents.ReportUtil;
import com.homer.resuablecomponents.ReusableComponents;
import com.homer.resuablecomponents.WebDriverHelper;

public class BaseStepDefn {
	
	protected Report report;
	protected DataTable dataTable;
	
	protected WebDriverHelper wh;
	protected DataClass ih;
	
	protected WebDriver driver;
	protected InstanceContainer ic;
	protected ReusableComponents rc;
	
	protected HomePage homePage;
	protected ReportUtil rptUtil;
	protected PurchaseConditionAndRewards purchaseCondAndRewards;
	protected Description description;
	protected RedemptionLimits redemptionLimits;
	protected Schedule schedule;
	
	CommonData commonData;	
	
	public BaseStepDefn(DataClass data) {
		
		this.ih = data;
		this.driver = data.driver;
		this.report = data.report;
		this.dataTable = data.dataTable;		
		this.commonData = (CommonData)data.commonData;
		
		wh = new WebDriverHelper(driver, report, dataTable);
		rc = new ReusableComponents(driver, report, wh, dataTable);		
		ic = new InstanceContainer(driver, report,dataTable, wh, rc,commonData);
		
       if(HelperClass.baseModel.plainFramework) {
			
			if(data.tools!=null) {
				
				driver = (WebDriver)data.tools;
				rptUtil = new ReportUtil(driver,report, data);
			} else {
			
				rptUtil = new ReportUtil(report, data);	
			}			
		}	
	}	
}