package com.homer.resuablecomponents;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map.Entry;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import us.monoid.json.JSONException;
import us.monoid.json.JSONObject;
import us.monoid.json.XML;

import com.homer.helper.HelperClass;
//import us.monoid.json.JSONException;
//import us.monoid.json.JSONObject;
//import us.monoid.json.XML;

public class APITesting {	
	
	public String reportFolder;
	
	
	/**
	 * Method to post entity using POST method * 
	 * @param url
	 * @param xml
	 * @param request prop to set(ex:-Content-type, Authorization)
	 * this needs to be passed in hash map with key and value. Key-request prop name, value- request prop value
	 * @return Response
	 * @throws Exception
	 */
	public String postEntity(String url,String sXML,HashMap<String,String> mapSetReqProp) throws Exception {

		try {		
			
			URL obj = new URL(url);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			
			con.setDoOutput(true);
			con.setDoInput(true);
						
			if(!mapSetReqProp.isEmpty()){
				for (Entry<String, String> entry : mapSetReqProp.entrySet()) {
					 con.setRequestProperty(entry.getKey(),entry.getValue());					
		        }	
			}							
			
			con.setRequestMethod("POST");			
			OutputStream out = con.getOutputStream();
			if(!sXML.isEmpty())
			out.write(sXML.getBytes());
			out.flush();
			out.close();

			int responseCode = con.getResponseCode();
			BufferedReader in;

			if (responseCode != 200) {

				in = new BufferedReader(new InputStreamReader(con.getErrorStream()));

				return "";

			} else {

				in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			}

			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {

				response.append(inputLine);
			}

			in.close();

			String strResponse = response.toString();
			
			return strResponse;

		} catch (Exception e) {

			System.out.println("Error in POST method" + e.getMessage());
			return "";
		}
	}
			
		
	/**
	 * Method to Get entity using GET method * 
	 * @param url
	 * @param request property to set(ex:-Content-type, Authorization)
	 * this property needs to be passed in hash map with key and value. Key-request prop name, value- request prop value
	 * @return Response
	 * @throws Exception
	 */
	public String getEntity(String url,HashMap<String,String> mapSetReqProp) {

		try {	
			
			URL obj = new URL(url);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			
			if(!mapSetReqProp.isEmpty()){
				for (Entry<String, String> entry : mapSetReqProp.entrySet()) {
					 con.setRequestProperty(entry.getKey(),entry.getValue());					
		        }	
			}							
						
				
			con.setRequestMethod("GET");		
			
			int responseCode = con.getResponseCode();
			BufferedReader in;

			if (responseCode != 200) {

				in = new BufferedReader(new InputStreamReader(con.getErrorStream()));
				return "";

			} else {

				in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			}

			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {

				response.append(inputLine);
			}

			in.close();
			String sResponse = response.toString();

			

			return sResponse;

		} catch (Exception e) {
			System.out.println("Error in GET method" + e.getMessage());
			return "";
		}
	}
	
	/**
	 * Method to save current response in XML * 
	 * @param Response
	 * @param xml File name	 
	 * @return Response XML Path
	 * @throws Exception
	 */
	public String SaveCurrentXML(String sResponse,String sXMLFileName) throws IOException {
		reportFolder = HelperClass.baseModel.reportRunPath;
		String responseXMLPath=reportFolder + "/API_Response_" + sXMLFileName + ".xml";	
		
		try{
			
			JSONObject json = new JSONObject(sResponse);
			sResponse = XML.toString(json); 
		}catch(JSONException je){
			System.out.println("Not a JSON response");
		}
		 		
	
		if(!sResponse.contains("xml version")) 
		sResponse="<root>"+sResponse+"</root>";
		BufferedWriter writer = null;
		writer = new BufferedWriter(new FileWriter(responseXMLPath));
		writer.write(sResponse.toString());
		writer.close();
		return responseXMLPath;
		
	}
	
	
	/**
	 * Method to get data from response xml by tag name * 
	 * @param xml file path
	 * @param xml tag to read
	 * @return result
	 * @throws Exception
	 *//*	
	public String getDataFromResponseXML(String sxmlFilePath,String XmlTagToRead) throws ParserConfigurationException, SAXException, IOException {

		File fXmlFile = new File(sxmlFilePath);
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		Document doc = dBuilder.parse(fXmlFile);
		doc.getDocumentElement().normalize();
		NodeList nList = doc.getElementsByTagName(XmlTagToRead);
		String strResponse=nList.item(0).getTextContent();
		
		return strResponse;		
		
	}*/
	/**
	 * Method to get data from response xml by tag name * 
	 * @param xml file path
	 * @param xpath to find 
	 * @param attribute name to read 
	 * @return result
	 * @throws XPathExpressionException 
	 * @throws Exception
	 */	
	public String getDataFromResponseXML(String sxmlFilePath,String xPathQuery,String sAttribute) throws ParserConfigurationException, SAXException, IOException, XPathExpressionException {
        String strResponse="";
        
        try{
        	
        	File fXmlFile = new File(sxmlFilePath);
    		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
    		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
    		Document doc = dBuilder.parse(fXmlFile);
    		XPath xPath =  XPathFactory.newInstance().newXPath();
    		NodeList nodeList = (NodeList) xPath.compile(xPathQuery).evaluate(doc, XPathConstants.NODESET);
    		
    		if(sAttribute.isEmpty()){
    			strResponse=nodeList.item(0).getTextContent();
    			//System.out.println(nodeList.item(0).getTextContent());
    		}else{
    			strResponse=nodeList.item(0).getAttributes().getNamedItem(sAttribute).getNodeValue();
    			//System.out.println(nodeList.item(0).getAttributes().getNamedItem(sAttribute).getNodeValue());		  	
    		}
        	
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (SAXException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        }      
		
		
		
				
		return strResponse;		
		
	}
		
	/**
	 * Method to get formatted XML from input XML file	 * 
	 * @param input XML path
	 * @return FormattedXML
	 * @throws Exception 
	 */
	public String getInputXML(String sXMLPath) throws Exception {
				
		if(sXMLPath.isEmpty())
			return "";
		else sXMLPath=HelperClass.baseModel.basePath+sXMLPath;
		
		BufferedReader br= new BufferedReader(new FileReader(sXMLPath));
		String inputLine;
		StringBuilder sb= new StringBuilder();
		while((inputLine=br.readLine())!=null){
			sb.append(inputLine);
		}
		
		String sFormattedXML=sb.toString();
		br.close();
		return sFormattedXML;
        
	}
	
	/**
	 * Method to set connection request prop to has map
	 * 
	 * @param Request Prop to Set.
	 * We need to pass request prop in following format Example: sRequestPropToSet="content-type:application/xml,Authrization:23$%$5"
	 * you can pass multiple prop name with value using comma separator
	 * @return mapSetReqProp has map having key and value
	 * @throws Exception 
	 */
	public static HashMap<String,String> setRequestPropToMap(String sRequestPropToSet) throws Exception {
		HashMap<String,String> mapSetReqProp= new HashMap<String, String>();
		mapSetReqProp.clear();
		
		String str1="";
		String splitArr[]= sRequestPropToSet.split("\\,");
		if(splitArr.length>0){
			for(int i=0;i<splitArr.length;i++){
				str1=splitArr[i];
				String splitArr1[]=str1.split("\\:");
				if(splitArr1.length>0){
					mapSetReqProp.put(splitArr1[0], splitArr1[1]);					
				}
			}
			
		}
		
		return mapSetReqProp;		

	}
		
	/**
	 * Method to delete response from XML file	 * 
	 * @param input XML path
	 * @return FormattedXML
	 * @throws Exception 
	 */
	public void deleteResponseXMLFile(String sXMLPath) {
		
		File fXmlFile = new File(sXMLPath);
		fXmlFile.delete();
	}
	

}
