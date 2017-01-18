package com.homer.po;

import org.openqa.selenium.WebDriver;

import com.homer.dao.CommonData;
import com.homer.dao.InstanceContainer;
import com.homer.helper.DataTable;
import com.homer.reports.Report;
import com.homer.resuablecomponents.ReusableComponents;
import com.homer.resuablecomponents.WebDriverHelper;

public class PageBase <CHILD extends PageBase<CHILD>>{
	
	protected InstanceContainer ic;
	protected WebDriver driver;
	protected WebDriverHelper wh;
	protected DataTable dataTable;
	protected ReusableComponents rc;
	protected Report report;
	protected CommonData commonData;
	protected static String strPromoType;
	
	public PageBase(InstanceContainer ic) {
		
		this.ic = ic;
		this.driver = ic.driver;
		this.wh = ic.wh;
		this.rc = ic.rc;
		this.dataTable = ic.dataTable;
		this.report = ic.report;
		this.commonData = ic.commonData;
	}	
}