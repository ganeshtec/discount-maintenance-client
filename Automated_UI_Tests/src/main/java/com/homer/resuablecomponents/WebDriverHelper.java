package com.homer.resuablecomponents;

import java.awt.AWTException;
import java.awt.Robot;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.NoSuchElementException;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.regex.Pattern;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.Point;
import org.openqa.selenium.SearchContext;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.JavascriptExecutor;
import com.homer.enums.EnumClass.Browser;
import com.homer.enums.EnumClass.StepResult;
import com.homer.helper.DataTable;
import com.homer.logger.HomerLogger;
import com.homer.reports.Report;
//import com.homer.uistore.CommonElements;

//import javassist.bytecode.Descriptor.Iterator;

import java.util.List;

public class WebDriverHelper {
	
	Properties prop= new Properties();
	Report report;
	DataTable dataHelper;

	int noWaitTime = 1;
	int waitTime = 30;

	public boolean continueOnClickFail = false;
	public Browser currentBrowser;
	public WebDriver driver;
	public DataTable dataTable;
	public static int timeout = 5;
		
	public WebDriverHelper(WebDriver driver, Report report,
			DataTable dataHelper, Browser currentBrowser) {

		this.driver = driver;
		this.report = report;
		this.dataHelper = dataHelper;
		this.currentBrowser = currentBrowser;

		if (currentBrowser == Browser.IE) {

			noWaitTime = 3;
			waitTime = 50;
		}
	}

	public WebDriverHelper(WebDriver driver, Report report,
			DataTable dataTable) {
		
		this.driver = driver;
		this.report = report;
		this.dataHelper = dataTable;
	}

	/**
	 * Method to check if element is present
	 * 
	 * @param elementBy
	 * @return success or failure
	 * @throws Exception 
	 */		
	public boolean clickElement(By elementBy, String strField) throws Exception {

		try {

			if (isElementPresent(elementBy)) {
				driver.findElement(elementBy).click();	
				return true;
			}

		} catch (Exception ex) {

			System.out.println(ex.getMessage());
			HomerLogger.getInstance().info("Could not perform click on '" + strField + "'" + System.getProperty("line.separator"));
			HomerLogger.getInstance().info(ex.toString());
		}
			
		report.addReportStep("Click on " + strField, "Click failed", StepResult.FAIL);
		return false;
	}

	/**
	 * Method to check if click on radio button for a given option
	 * 
	 * @param elementBy, option to be selected, field name
	 * @return success or failure
	 * @throws Exception 
	 */
	public boolean radioButtonClick(By elementBy, int intOption, String strField) throws Exception {

		try {

			List<WebElement> rdoElements = driver.findElements(elementBy);
		
			if(rdoElements.size() > 0){
				
				if(rdoElements.get(intOption).isEnabled())
					rdoElements.get(intOption).click();	
				return true;
			}

		} catch (Exception ex) {

			System.out.println(ex.getMessage());
			HomerLogger.getInstance().info("Could not perform the radio button click for '" + strField + "'" + System.getProperty("line.separator"));
			HomerLogger.getInstance().info(ex.toString());
		}
			
		report.addReportStep("Click on " + strField, "Click failed", StepResult.FAIL);
		return false;
	}
	
	/**
	 * Method to enter values in a text box
	 * 
	 * @param elementBy, value to be entered, field name
	 * @return success or failure
	 * @throws Exception 
	 */
	public boolean enterValues(By elementBy, String strValue, String strField) throws Exception 
	{
		try {

			if (isElementPresent(elementBy)) {

				driver.findElement(elementBy).clear();
				driver.findElement(elementBy).sendKeys(strValue);
				return true;
			}	

		} catch (Exception ex) {

			System.out.println(ex.getMessage());
			HomerLogger.getInstance().info("Could not enter value in '" + strField + "' field " + System.getProperty("line.separator"));
			HomerLogger.getInstance().info(ex.toString());
		}
		
		report.addReportStep("Enter text for " + strField, "Text could not be entered successfully", StepResult.FAIL);
		return false;		
	}		
	
	/**
	 * Method to click on an element in a list of elements
	 * 
	 * @param elementBy, index of the element to be clicked, field name
	 * @return success or failure
	 * @throws Exception 
	 */
	public boolean clickOneElementInList(By elementBy, int intOpt, String strField) throws Exception 
	{
		try {

			if (isElementPresent(elementBy)) {

				List<WebElement> lstElements = driver.findElements(elementBy);
				lstElements.get(intOpt).click();
				return true;
			}	

		} catch (Exception ex) {

			System.out.println(ex.getMessage());
			HomerLogger.getInstance().info("Could not click on '" + strField + "'" + System.getProperty("line.separator"));
			HomerLogger.getInstance().info(ex.toString());
		}
		
		report.addReportStep("Click on "  + strField, " Click on " + strField  + " could not be completed successfully ", StepResult.FAIL);
		return false;		
	}	
	
	
	/**
	 * Method to check if element is present after waiting for specific time
	 * 
	 * @param elementBy
	 * @return success or failure
	 */
	public boolean isElementPresent(final By elementBy) {

		FluentWait<WebDriver> wait = new FluentWait<WebDriver>(driver)
				.withTimeout(waitTime, TimeUnit.SECONDS)
				.pollingEvery(1, TimeUnit.SECONDS);
				
		try {
			
			wait.until(ExpectedConditions.visibilityOfElementLocated(elementBy));
			
			if(driver.findElement(elementBy).isDisplayed())
				return true;

		} catch (Exception ex)	{

			HomerLogger.getInstance().info("Failed to find an element with the locator '" + elementBy + System.getProperty("line.separator"));
			HomerLogger.getInstance().info(ex.toString());
			System.out.println("Exception occured " + ex.getMessage());
		}

		return false;
	}
	
	/**
	 * Method to select an option from the drop down based on the visible text
	 *  
	 * @param elementBy, visible text, field name
	 * @return success or failure
	 */		
	public boolean dropDownSelect(By elementBy, String strText, String strField) {

		try {
			
			if(isElementPresent(elementBy)){
			
				Select slctElement = new Select(driver.findElement(elementBy));
				slctElement.selectByVisibleText(strText);
				return true;
			}
		
		} catch (Exception ex) {
			
			System.out.println(ex.getMessage());
			HomerLogger.getInstance().info("Could not locate the option '" + strText + "' in the '"  + "'" + strField + "' drop down" + System.getProperty("line.separator"));
			HomerLogger.getInstance().info(ex.toString());
		}		

		report.addReportStep("Select option '" + strText + "' from drop down " + strField, "Selecting option '" + strText + "' from the drop down " + strField + " failed", StepResult.FAIL);
		return false;	
	}
	
	/**
	 * Method to verify if an element is enabled
	 ** 
	 * @param elementBy, text 
	 * @return success or failure
	 */	
	public boolean isElementEnabled(By by) {
		 
		try {
			if(isElementPresent(by)){
		 		 	
				if(driver.findElement(by).isEnabled())
					return true;	        			            
		 	 }
		} catch (Exception ex) {
			
			System.out.println(ex.getMessage());
			HomerLogger.getInstance().info("Element not enabled" + System.getProperty("line.separator"));
			HomerLogger.getInstance().info(ex.toString());		 
		}
		
		return false;
	}
		
	/**
	 * Method to wait for page to get loaded
	 */
	public void waitForPageLoaded() {

		ExpectedCondition<Boolean> expectation = new ExpectedCondition<Boolean>() {
			public Boolean apply(WebDriver driver) {
				return ((JavascriptExecutor) driver).executeScript(
						"return document.readyState").equals("complete");
			}
		};

		WebDriverWait wait = new WebDriverWait(driver, waitTime);

		try {

			wait.until(expectation);

		} catch (Exception ex) {

			ex.printStackTrace();
			System.out.println(ex.getMessage());
			HomerLogger.getInstance().info("Error waiting for page to load" + System.getProperty("line.separator"));
			HomerLogger.getInstance().info(ex.toString());	
		}
	}
	
	/**
	 * Method to send keys to text element without clearing
	 * 
	 * @param elementBy
	 * @param typeValue
	 * @throws InterruptedException
	 */
	public boolean enterValueWithoutClearing(By elementBy, String strValue, String strField) throws Exception {

		try{
			if (isElementPresent(elementBy)){ 			
				driver.findElement(elementBy).sendKeys(strValue);
				return true;
			}
		} catch (Exception ex) {

			System.out.println(ex.getMessage());
			HomerLogger.getInstance().info("Could not enter value in '" + strField + "' field " + System.getProperty("line.separator"));
			HomerLogger.getInstance().info(ex.toString());
		}
	
		report.addReportStep("Enter text for " + strField, "Text could not be entered successfully", StepResult.FAIL);
		return false;		
	}	

	/**
	 * Method to send keys to text elements 
	 * 
	 * @param elementBy, Value to be entered , Field name
	 * @throws InterruptedException
	 */
	public boolean enterMultipleTextValues(By elementBy, String[] strValues, String strField) throws Exception {
		
        WebElement ele = null;
		
        try{
			if (isElementPresent(elementBy)) { 			
				
				
				List <WebElement> lstElements = driver.findElements(elementBy);
				
				//Using for with index since it fetches some additional elements and I want to fill only the 2 - 4 rows
				for(int i=0; i < 3; i++ ) {
					// Start from 2nd element
					ele = lstElements.get(i + 1);
					ele.clear();
					ele.sendKeys(strValues[i]);
		
				}
				return true;
			}
		} catch (Exception ex) {

			System.out.println(ex.getMessage());
			HomerLogger.getInstance().info("Could not enter value in '" + strField + "' field " + System.getProperty("line.separator"));
			HomerLogger.getInstance().info(ex.toString());
		}
	
		report.addReportStep("Enter text for " + strField, "Text could not be entered successfully", StepResult.FAIL);
		return false;		
	}	
}