package com.homer.resuablecomponents;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeDriverService;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.ie.InternetExplorerDriverService;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.safari.SafariDriver;
import com.homer.enums.EnumClass.Browser;
import com.homer.helper.HelperClass;

public class DriverFactory {
	
	public WebDriver getLocalWebDriver(Browser browser) throws Exception {
		
		WebDriver driver = null;
		
		switch (browser) {		
		
		case FireFox:
			driver = getFireFoxDriver();
			break;
		case Chrome:
			driver = getChromeDriver();
			break;
		case IE:
			driver = getIEDriver();
			break;
		case Safari:
			driver = getSafariDriver();
			break;
		case HtmlUnit:
			driver = getHTMLUnitDriver();
			break;	
		case Emulator:
			driver = getChromeEmulator();
			break;
		case Appium:
			driver = getAppiumDriver();
			break;
		default:
			break;
		}
		return driver;
	}

	public WebDriver getSauceLabDriver(String testCaseName) throws Exception {
		
		WebDriver driver = null;		
		
		DesiredCapabilities desiredCapabilities = new DesiredCapabilities();
		
		desiredCapabilities.setCapability("name",testCaseName);
		
		setCapabilitiesUsingSaucelabCap(desiredCapabilities);
		
	    URL hubUrl = null;  			
  		hubUrl = new URL(HelperClass.baseModel.sauceLabsUrl);
  		
  		driver = new RemoteWebDriver(hubUrl,desiredCapabilities);  
       
       return (WebDriver)driver;
	}
	
	public WebDriver getSauceLabDriverRunManager(String testCaseName, String browserName, String version, String platform) throws Exception {
		
		WebDriver driver = null;		
		
		DesiredCapabilities desiredCapabilities = new DesiredCapabilities();
		
		desiredCapabilities.setCapability("name",testCaseName);
		desiredCapabilities.setCapability("browserName",browserName);
		desiredCapabilities.setCapability("version",version);
		desiredCapabilities.setCapability("platform",platform);
		
	    URL hubUrl = null;  			
  		hubUrl = new URL(HelperClass.baseModel.sauceLabsUrl);
  		
        driver = new RemoteWebDriver(hubUrl,desiredCapabilities);
	
       
        return (WebDriver)driver;
	}
	
	private void setCapabilitiesUsingSaucelabCap(
			DesiredCapabilities desiredCapabilities) {
		
		for (Entry<String, String> entry : HelperClass.baseModel.sauceLabCapabilities.entrySet()) {
			
			desiredCapabilities.setCapability(entry.getKey(), entry.getValue());
        }
		
		/**** If device name is Emulation********/
		if(Boolean.valueOf(HelperClass.runConfigProp.getProperty("TabletMode")) 
				&& HelperClass.runConfigProp.getProperty("capabilitiesTab.deviceName").contains("Emulation") ){
			
			Map<String, String> mobileEmulation = new HashMap<String, String>();
			mobileEmulation.put("deviceName", "Apple iPad");
			//mobileEmulation.put("deviceName", "Apple iPhone 4");
			Map<String, Object> chromeOptions = new HashMap<String, Object>();
			chromeOptions.put("mobileEmulation", mobileEmulation);
			desiredCapabilities.setCapability(ChromeOptions.CAPABILITY, chromeOptions);		
			
		}
		
	}	
	
	private WebDriver getFireFoxDriver() throws Exception{

		WebDriver driver = null;
		
		driver = new FirefoxDriver();
		driver.manage().window().maximize();
		driver.manage().timeouts().implicitlyWait(45, TimeUnit.SECONDS);

		return driver;
	}

	private WebDriver getChromeEmulator() {
		
		WebDriver driver = null;
		
		String chromeDriverPath =HelperClass.baseModel.driversPath + "/chromedriver.exe";
		System.setProperty(ChromeDriverService.CHROME_DRIVER_EXE_PROPERTY,chromeDriverPath);
		
		DesiredCapabilities capability = DesiredCapabilities.chrome();
		Map<String, String> mobileEmulation = new HashMap<String, String>(1);
		mobileEmulation.put("deviceName",HelperClass.baseModel.chromeEmulationDevice);

		Map<String, Object> chromeOptions = new HashMap<String, Object>();
		chromeOptions.put("mobileEmulation", mobileEmulation);
		
		capability.setCapability(ChromeOptions.CAPABILITY, chromeOptions);
		try {
		
			driver  = new ChromeDriver(capability);
		} catch(Exception ex) {
			System.out.println(ex.getMessage());
		}		
		
		return driver;
	}
	
	private WebDriver getAppiumDriver() {
		// TODO Auto-generated method stub
		return null;
	}
	
	private WebDriver getChromeDriver() throws Exception {

		WebDriver driver=null;
		String chromeDriverPath = null;
		
		chromeDriverPath = HelperClass.baseModel.driversPath + "/chromedriver.exe";
		System.setProperty(ChromeDriverService.CHROME_DRIVER_EXE_PROPERTY,chromeDriverPath);
		/*
		if (HelperClass.baseModel.chromeEmulation){

			Map<String, String> mobileEmulation = new HashMap<String, String>();
			mobileEmulation.put("deviceName", HelperClass.baseModel.chromeEmulationDevice);

			Map<String, Object> chromeOptions = new HashMap<String, Object>();
			chromeOptions.put("mobileEmulation", mobileEmulation);
			DesiredCapabilities capabilities = DesiredCapabilities.chrome();
			capabilities.setCapability("platform", HelperClass.baseModel.platForm);
			capabilities.setCapability("autoAcceptAlerts", "ACCEPT");
		
			capabilities.setCapability(ChromeOptions.CAPABILITY, chromeOptions);
			 driver = new ChromeDriver(capabilities);
			 driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
		} else {			 
			
			driver = new ChromeDriver();
			driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
		}*/
		
		driver = new ChromeDriver();
		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
		
		return driver;
	}
	
	private WebDriver getIEDriver() throws Exception {

		WebDriver driver = null;			
		String ieDriverPath = HelperClass.baseModel.driversPath
				+ "/IEDriverServer.exe";
		System.setProperty(
				InternetExplorerDriverService.IE_DRIVER_EXE_PROPERTY,
				ieDriverPath);

		DesiredCapabilities capabilities = DesiredCapabilities
				.internetExplorer();
		capabilities
				.setCapability(
						InternetExplorerDriver.INTRODUCE_FLAKINESS_BY_IGNORING_SECURITY_DOMAINS,
						true);
		capabilities.setCapability(
				CapabilityType.ForSeleniumServer.ENSURING_CLEAN_SESSION,
				true);

		driver = new InternetExplorerDriver(capabilities);
		driver.manage().deleteAllCookies();
		Runtime.getRuntime().exec(
				"RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 2");
		driver.manage().window().maximize();
		driver.manage().timeouts().implicitlyWait(60, TimeUnit.SECONDS);
		
		return driver;
	}
	
	private WebDriver getSafariDriver() throws Exception{

		WebDriver driver = null;			
		driver = new SafariDriver();
		driver.manage().window().maximize();
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);

		return driver;
	}

	private WebDriver getHTMLUnitDriver() throws Exception {

		HtmlUnitDriver driver = new HtmlUnitDriver();
		driver.setJavascriptEnabled(true);		
		Logger.getLogger("").setLevel(Level.OFF); 
				
		return driver;		
	}	
}
