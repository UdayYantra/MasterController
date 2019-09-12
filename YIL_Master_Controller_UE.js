/**
 *@NApiVersion 2.x   
 *@NScriptType UserEventScript
 *@NModuleScope SameAccount
 */
 /*************************************************************
 * File Header
 * Script Type	: User Event
 * Script Name	: YIL Master Controller UE
 * File Name	: YIL_Master_Controller_UE.js
 * Created On	: 30/07/2019
 * Modified On	: 08/08/2019
 * Created By	: Siddhant Mishra (Yantra Inc.)
 * Modified By	: Siddhant Mishra (Yantra Inc.)
 * Description	: The code shows Approve, reject and Send Notification buttons on View mode,
                  And also sends Email after record is submitted.
 ************************************************************/
define([ 'N/record','N/search','N/ui/serverWidget','N/runtime','N/url','N/email', 'N/encode'], function(record, search, server, runtime, url, email, encode){
	
	function beforeLoad(context)
	{
		var form			= context.form;
		var recObj			= context.newRecord;
		var recType			= recObj.type;
		var recId			= recObj.id;
		if(context.type == context.UserEventType.VIEW) {
			recObj			= record.load({type: recType, id: recId});
		}
		var userObj			= runtime.getCurrentUser();
		var currentUser		= userObj.name;
		var inactive		= recObj.getValue({ fieldId : 'isinactive'});
        
		
			
		if(context.type == context.UserEventType.VIEW) {	
			
			if(recType == 'vendor' || recType == 'customer'){
				var appStatus		= recObj.getValue({ fieldId : 'custentity_yil_mcm_approval_status'});
				var approverName	= recObj.getText({ fieldId : 'custentity_yil_mcm_approver'});	
				var approverId		= recObj.getValue({fieldId : 'custentity_yil_mcm_approver'});
			}
			else{
				var appStatus		= recObj.getValue({ fieldId : 'custitem_yil_mcm_approval_status'});
				var approverName	= recObj.getText({ fieldId : 'custitem_yil_mcm_approver'});
				var approverId		= recObj.getValue({fieldId : 'custitem_yil_mcm_approver'});
			}
			
			form.clientScriptModulePath = '/SuiteBundles/Bundle 294796/MasterControllerFolder/YIL_Master_Controller_CL.js';
			var suiteletURL = url.resolveScript({ scriptId : 'customscript_yil_master_sl', deploymentId : 'customdeploy_yil_master_contro_sl',returnExternalUrl: true});
			var approveURLParam	= suiteletURL + '&processFlag=a&recId='+getEncodedValue(recId)+'&recType='+getEncodedValue(recType)+'&sts='+appStatus+'&aprid='+getEncodedValue(approverId)+"&ir=T";
            var rejectURLParam	= suiteletURL + '&processFlag=r&recId='+getEncodedValue(recId)+'&recType='+getEncodedValue(recType)+'&sts='+appStatus+'&aprid='+getEncodedValue(approverId)+"&ir=T";

			if(appStatus == 1 && inactive == true && approverName == currentUser){
				var approveButton	= form.addButton({ id : 'custpage_approve', label : 'Approve', functionName : "approvButtonFun('" + approveURLParam.toString() + "');"});
				var rejectButton	= form.addButton({ id : 'custpage_reject', label : 'Reject', functionName : "rejectButtonFun('" + rejectURLParam.toString() + "');"});
			}
			if(appStatus == 1 && inactive == true){
				var sendNotification= form.addButton({ id : 'custpage_notification', label : 'Send Notification', functionName : "sendNotificationBtn('"+recId+"','"+recType.toString()+"','"+approverId+"','"+getEncodedValue(recId)+"','"+getEncodedValue(recType.toString())+"','"+getEncodedValue(approverId)+"')"});
			}
			if(appStatus == 4 && inactive == true) {
				var subForAppButton	= form.addButton({ id : 'custpage_subforapp', label : 'Submit For Approval', functionName : "AfterSubForAppButtonClick('"+recId+"','"+recType.toString()+"','"+approverId+"','"+getEncodedValue(recId)+"','"+getEncodedValue(recType.toString())+"','"+getEncodedValue(approverId)+"')"});
			}
		}
		if(context.type == context.UserEventType.EDIT) {
			if(recType == 'vendor' || recType == 'customer'){
				var appStatus	= recObj.getValue({ fieldId : 'custentity_yil_mcm_approval_status'});
			}
			else{
				var appStatus	= recObj.getValue({ fieldId : 'custitem_yil_mcm_approval_status'});
			}
			if(inactive && (appStatus == 1 || appStatus == 3 || appStatus == 4)){
				var invFieldObj		= form.getField({id : 'isinactive'});
				log.debug({title: "invFieldObj", details: invFieldObj});
				if(invFieldObj){
					invFieldObj.updateDisplayType({displayType : server.FieldDisplayType.DISABLED});
				}
			}
		}			
	}
	
	function afterSubmit(context)
	{ 
		var form	           	= context.form;
		var recObj  	       	= context.newRecord;
		var recId       	   	= recObj.id;
		var recType        		= recObj.type;
		var recObj      		= context.newRecord;
		var recType     		= recObj.type;
		var recId       		= recObj.id;
		var suiteletURL			= '';
		var appProcessApplicable= '';
		var approverId			= '';
		var approverNm			= '';
		var isEmailAppRequired	= '';
		var recordName			= '';
		var scriptObj			= runtime.getCurrentScript();
		var authorID			= scriptObj.getParameter({name: "custscript_yil_master_controller_em_auth"});
		var approverLink		= scriptObj.getParameter({name: "custscript_yil_master_controller_app_img"});
		var rejectionLink		= scriptObj.getParameter({name: "custscript_yil_master_controller_rej_img"});
 		
		if(context.type == context.UserEventType.DELETE){
			return true;
		}
		var recLoad				= record.load({type : recType, id : recId});
		var checkInactive		= recLoad.getValue({fieldId : "isinactive"});
		
		
		if(context.type == context.UserEventType.CREATE){
			var suiteletURL			= url.resolveScript({ scriptId : 'customscript_yil_master_sl', deploymentId : 'customdeploy_yil_master_contro_sl', returnExternalUrl: true, params: {recordType : recType}});
			
			
			if(recType == 'vendor' || recType == 'customer') {
				if(recType == 'vendor'){
					var customrecordyil_master_controller_matrixSearchObj = fetchMatrix(2);
					
					var searchResultCount = customrecordyil_master_controller_matrixSearchObj.runPaged().count;
					log.debug("customrecordyil_master_controller_matrixSearchObj result count",searchResultCount);
					customrecordyil_master_controller_matrixSearchObj.run().each(function(result){
						appProcessApplicable= result.getValue({name : 'custrecord_yil_mcm_is_aprv_appl'});
						approverId			= result.getValue({name : 'custrecord_yil_mcm_approver'});
						approverNm			= result.getText({name : 'custrecord_yil_mcm_approver'});
						isEmailAppRequired	= result.getValue({name : 'custrecord_yil_mcm_email_aprvl_requrd'});
						
					});					
				}
				else if(recType == 'customer'){
					var custName			= recLoad.getText({fieldId : 'companyname'});
					
					var customrecordyil_master_controller_matrixSearchObj = fetchMatrix(1);
					
					var searchResultCount = customrecordyil_master_controller_matrixSearchObj.runPaged().count;
					log.debug("customrecordyil_master_controller_matrixSearchObj result count",searchResultCount);
					customrecordyil_master_controller_matrixSearchObj.run().each(function(result){
						appProcessApplicable= result.getValue({name : 'custrecord_yil_mcm_is_aprv_appl'});
						approverId			= result.getValue({name : 'custrecord_yil_mcm_approver'});
						approverNm			= result.getText({name : 'custrecord_yil_mcm_approver'});
						isEmailAppRequired	= result.getValue({name : 'custrecord_yil_mcm_email_aprvl_requrd'});
						
					});
				}
				
				if(appProcessApplicable) {
					//log.debug({title: 'recType', details: recType});
					recLoad.setValue({fieldId : 'isinactive', value : true});
					recLoad.setValue({fieldId : 'custentity_yil_mcm_approval_status', value : 4});
					recLoad.setValue({fieldId : 'custentity_yil_mcm_approver', value : approverId});
					
					//var approvalStatus		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approval_status'});
					//var approverName		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approver'});
					
					/**if(recLoad && recType == 'customer') {
						customerApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, recType, approvalStatus, authorID, approverLink, rejectionLink);
						log.debug('inside if condition suiteletURL',suiteletURL);
					}
					else if(recLoad && recType == 'vendor') {
						vendorApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, recType, approvalStatus, authorID, approverLink, rejectionLink);
					}*/
				}
				else {
					recLoad.setValue({fieldId : 'isinactive', value : false});
					recLoad.setValue({fieldId : 'custentity_yil_mcm_approval_status', value : 2});				
				}
			}
			else {
				var customrecordyil_master_controller_matrixSearchObj = fetchMatrix(3);
				
				var searchResultCount = customrecordyil_master_controller_matrixSearchObj.runPaged().count;
				log.debug("customrecordyil_master_controller_matrixSearchObj result count",searchResultCount);
				customrecordyil_master_controller_matrixSearchObj.run().each(function(result){
					appProcessApplicable= result.getValue({name : 'custrecord_yil_mcm_is_aprv_appl'});
					approverId			= result.getValue({name : 'custrecord_yil_mcm_approver'});
					approverNm			= result.getText({name : 'custrecord_yil_mcm_approver'});
					isEmailAppRequired	= result.getValue({name : 'custrecord_yil_mcm_email_aprvl_requrd'});
					
				});
				
				if(appProcessApplicable){
					recLoad.setValue({fieldId : 'isinactive', value : true});
					recLoad.setValue({fieldId : 'custitem_yil_mcm_approval_status', value : 4});
					recLoad.setValue({fieldId : 'custitem_yil_mcm_approver', value : approverId});
					
					/**var approvalStatus		= recLoad.getValue({fieldId : 'custitem_yil_mcm_approval_status'});
					var approverName		= recLoad.getValue({fieldId : 'custitem_yil_mcm_approver'});
					if(recType){
						itemApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, recType, approvalStatus, authorID, approverLink, rejectionLink);
					}*/
				}
				else{
					recLoad.setValue({fieldId : 'isinactive', value : false});
					recLoad.setValue({fieldId : 'custitem_yil_mcm_approval_status', value : 2});				
				}
			}
		}
		
		if(context.type == context.UserEventType.EDIT) {
			if(recType == 'customer' || recType == 'vendor'){
				var appStatus	= recLoad.getValue({fieldId : "custentity_yil_mcm_approval_status"});
				log.debug({title: "appStatus", details: appStatus});
				log.debug({title: "checkInactive", details: checkInactive});
				if(checkInactive && appStatus == 3){
					if(checkInactive && appStatus == 3 && runtime.executionContext != runtime.ContextType.SUITELET){
						recLoad.setValue({fieldId: "custentity_yil_mcm_approval_status", value: 4});
						recLoad.setValue({fieldId: "custentity_yil_mcm_rejection_reason", value: null});
					}
				}
				else if(!checkInactive && appStatus != 2) {
					recLoad.setValue({fieldId: "custentity_yil_mcm_approval_status", value: 2});
				}
			}
			else{
				var itemAppStatus	= recLoad.getValue({fieldId : "custitem_yil_mcm_approval_status"});
				log.debug({title: "itemAppStatus", details: itemAppStatus});
				if(checkInactive && itemAppStatus == 3){
					if(checkInactive && itemAppStatus == 3 && runtime.executionContext != runtime.ContextType.SUITELET){
						recLoad.setValue({fieldId: "custitem_yil_mcm_approval_status", value: 4});
						recLoad.setValue({fieldId: "custitem_yil_mcm_rejection_reason", value: null});
					}
				}
				else if(!checkInactive && itemAppStatus != 2) {
					recLoad.setValue({fieldId: "custitem_yil_mcm_approval_status", value: 2});
				}
			}
		}
		recLoad.save();
	}
	/**function customerApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, recType, approvalStatus, authorID, approverLink, rejectionLink)
	{
		var customerName= '', approverName = '', subsidiaryName = '', statusText = '';
		
		var customerName	= recLoad.getText({fieldId : 'entityid'});
		var approverName	= approverNm;
        var subsidiaryName	= recLoad.getText({fieldId : 'subsidiary'});
        var parentCompany	= recLoad.getText({fieldId : 'parent'});
		var emailId			= recLoad.getValue({fieldId : 'email'});
		var phone			= recLoad.getValue({fieldId : 'phone'});
		var fax 			= recLoad.getValue({fieldId : 'fax'});
		var accountNo		= recLoad.getValue({fieldId : 'accountnumber'});
		var primaryCurrency	= recLoad.getText({fieldId : 'currency'});
		var terms			= recLoad.getText({fieldId : 'terms'});
		var creditLimit		= recLoad.getValue({fieldId : 'creditlimit'});
		var taxRegNo		= recLoad.getValue({fieldId : 'vatregnumber'});
		var taxable			= recLoad.getValue({fieldId : 'taxable'});
		log.debug({title: "taxable", details: taxable});
		var numLines		= recLoad.getLineCount({sublistId: 'addressbook'});
		log.debug({title : "numLines", details: numLines});
		var shippinAddressValue = '';
		var billingAddressValue  = '';
		
		
		for(var n = 0; n < numLines ; n++) {
			var shippingId			= recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'defaultshipping', line: n});
			log.debug({title : "shippingId", details: shippingId});
		    var billingId			= recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'defaultbilling', line: n});
			log.debug({title : "billingId", details: billingId});
			if(shippingId){
				log.debug({title : "Inside shipping condition", details:shippingId });
				var shippingAddress	= recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'defaultshipping', line: n});
				shippinAddressValue = recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'addressbookaddress_text', line: n});
			}
			else if(billingId){
				log.debug({title : "Inside billing condition", details: billingId});
				var billingAddress	= recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'defaultbilling', line: n});
				billingAddressValue	= recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'addressbookaddress_text', line: n});
			}
			log.debug({title: "shippinAddressValue", details: shippinAddressValue});
			log.debug({title: "billingAddressValue", details: billingAddressValue});
		}
		
		var emailSubject= "Customer "+customerName+" has been submitted for approval.";
        		
		var approveURLParam = suiteletURL + '&processFlag=a&recId='+getEncodedValue(recId)+'&recType='+getEncodedValue(recType)+'&sts='+approvalStatus+'&aprid='+getEncodedValue(approverId);
        var rejectURLParam = suiteletURL + '&processFlag=r&recId='+getEncodedValue(recId)+'&recType='+getEncodedValue(recType)+'&sts='+approvalStatus+'&aprid='+getEncodedValue(approverId);
			
		var emailbody	= '';
		var senderId	= authorID;
		var recipientsId= approverId;
		log.debug('approverName',approverName);
		emailbody +="<html>";
		emailbody +="	<body>";
		emailbody +="		Dear "+approverName+",<br/><br/>You have received new Customer for Approval";
		emailbody +="		<br/><br/>";
		
		emailbody +="		<table>";
		emailbody +="		<tr><td>Customer Name</td><td>:</td><td>"+customerName+"</td></tr>";
		if(parentCompany){
			emailbody += "<tr><td>Parent Company</td><td>:</td><td>"+parentCompany+"</td></tr>";
		}
		emailbody +="		<tr><td>Email</td><td>:</td><td>"+emailId+"</td></tr>";
		emailbody +="		<tr><td>Phone No.</td><td>:</td><td>"+phone+"</td></tr>";
		emailbody +="		<tr><td>Fax</td><td>:</td><td>"+fax+"</td></tr>";
		emailbody +="		<tr><td>Subsidiary</td><td>:</td><td>"+subsidiaryName+"</td></tr>";
		if(accountNo) {
			emailbody +="		<tr><td>Account Number</td><td>:</td><td>"+accountNo+"</td></tr>";
		}
		emailbody +="		<tr><td>Primary Currency</td><td>:</td><td>"+primaryCurrency+"</td></tr>";
		emailbody +="		<tr><td>Terms</td><td>:</td><td>"+terms+"</td></tr>";
		emailbody +="		<tr><td>Credit Limit</td><td>:</td><td>"+creditLimit+"</td></tr>";
		emailbody +="		<tr><td>Tax Registration No.</td><td>:</td><td>"+taxRegNo+"</td></tr>";
		if(taxable) {
			emailbody +="<tr><td>Taxable</td><td>:</td><td>Yes</td></tr>";
		}
		else{
			emailbody +="<tr><td>Taxable</td><td>:</td><td>No</td></tr>";
		}
		if(shippingAddress && shippinAddressValue) {
			emailbody +="<tr><td>Shipping Address</td><td>:</td><td>"+shippinAddressValue+"</td></tr>";
		}
		if(billingAddress && billingAddressValue) {
			emailbody +="<tr><td>Billing Address</td><td>:</td><td>"+billingAddressValue+"</td></tr>";
		}
		emailbody +="		<br/></br>";
		if(isEmailAppRequired == true){
			emailbody += "		<p>Please use below buttons to either <b>Approve</b> or <b>Reject</b> Master Record</p>";
			emailbody += "		<p><b>Note</b>: Upon rejection system will ask for 'Reason for Rejection'.</p></br>";
			emailbody += "      <a href='"+approveURLParam+"'><img src='"+approverLink+"' border='0' alt='Accept' style='width: 60px;'/></a>";
			emailbody += "      <a href='"+rejectURLParam+"'><img src='"+rejectionLink+"' border='0' alt='Reject' style='width: 60px;'/></a>";
		}
		emailbody +="		<tr><td>Thank You,</td><tr/>";
		emailbody +="		<tr><td>Admin</td></tr>";
		emailbody +="		</table>";
		emailbody +="	</body>";
		emailbody +="</html>";
        		
		
		var emailObj = email.send({
                author: senderId,
                recipients: recipientsId,
                subject: emailSubject,
                body: emailbody
                //relatedRecords: {transactionId: Number(recordObj.id)}
            });
	}
	
	function vendorApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, recType, approvalStatus, authorID, approverLink, rejectionLink)
	{
		var vendorName= '', approverName = '', subsidiaryName = '';
		
		var vendorName		= recLoad.getText({fieldId : 'entityid'});
		var approverName	= approverNm;
        var emailId			= recLoad.getValue({fieldId : 'email'});
		var phone			= recLoad.getValue({fieldId : 'phone'});
		var fax 			= recLoad.getValue({fieldId : 'fax'});
		var subsidiaryName	= recLoad.getText({fieldId : 'subsidiary'});
		var legalName		= recLoad.getValue({fieldId : 'legalname'});
		var accountNo		= recLoad.getValue({fieldId : 'accountnumber'});
		var primaryCurrency	= recLoad.getText({fieldId : 'currency'});
		var creditLimit		= recLoad.getValue({fieldId : 'creditlimit'});
		var addressCount	= recLoad.getSublistFields({sublistId : 'addressbook'});
		log.debug({title : "addressCount", details:addressCount });
		var numLines		= recLoad.getLineCount({sublistId: 'addressbook'});
		log.debug({title : "numLines", details: numLines});
		var shippinAddressValue = '';
		var billingAddressValue  = '';
		
        var approveURLParam = suiteletURL + '&processFlag=a&recId='+getEncodedValue(recId)+'&recType='+getEncodedValue(recType)+'&sts='+approvalStatus+'&aprid='+getEncodedValue(approverId);
        var rejectURLParam  = suiteletURL + '&processFlag=r&recId='+getEncodedValue(recId)+'&recType='+getEncodedValue(recType)+'&sts='+approvalStatus+'&aprid='+getEncodedValue(approverId);
			
		for(var n = 0; n < numLines ; n++) {
			var shippingId			= recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'defaultshipping', line: n});
			log.debug({title : "shippingId", details: shippingId});
		    var billingId			= recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'defaultbilling', line: n});
			log.debug({title : "billingId", details: billingId});
			if(shippingId){
				log.debug({title : "Inside shipping condition", details:shippingId });
				var shippingAddress	= recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'defaultshipping', line: n});
				shippinAddressValue = recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'addressbookaddress_text', line: n});
			}
			else if(billingId){
				log.debug({title : "Inside billing condition", details: billingId});
				var billingAddress	= recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'defaultbilling', line: n});
				billingAddressValue	= recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'addressbookaddress_text', line: n});
			}
			log.debug({title: "shippinAddressValue", details: shippinAddressValue});
			log.debug({title: "billingAddressValue", details: billingAddressValue});
		}
		
		var emailSubject= "Vendor "+vendorName+" has been submitted for approval.";
		var emailbody	= '';
		var senderId	= authorID;
		var recipientsId= approverId;
		//log.debug({title: 'approverName', details: approverName});
		emailbody +="<html>";
		emailbody +="	<body>";
		emailbody +="		Dear "+approverName+",<br/><br/>You have received new Vendor for Approval";
		emailbody +="		<br/><br/>";
		
		emailbody +="		<table>";
		emailbody +="		<tr><td>Vendor Name</td><td>:</td><td>"+vendorName+"</td></tr>";
		emailbody +="		<tr><td>Email</td><td>:</td><td>"+emailId+"</td></tr>";
		emailbody +="		<tr><td>Phone No.</td><td>:</td><td>"+phone+"</td></tr>";
		emailbody +="		<tr><td>Fax</td><td>:</td><td>"+fax+"</td></tr>";
		emailbody +="		<tr><td>Subsidiary</td><td>:</td><td>"+subsidiaryName+"</td></tr>";
		if(accountNo) {
			emailbody +="		<tr><td>Account Number</td><td>:</td><td>"+accountNo+"</td></tr>";
		}
		emailbody +="		<tr><td>Primary Currency</td><td>:</td><td>"+primaryCurrency+"</td></tr>";
		emailbody +="		<tr><td>Credit Limit</td><td>:</td><td>"+creditLimit+"</td></tr>";
		if(shippingAddress && shippinAddressValue) {
			emailbody +="<tr><td>Shipping Address</td><td>:</td><td>"+shippinAddressValue+"</td></tr>";
		}
		if(billingAddress && billingAddressValue) {
			emailbody +="<tr><td>Billing Address</td><td>:</td><td>"+billingAddressValue+"</td></tr>";
		}
		emailbody +="		<br/></br>";
		if(isEmailAppRequired == true){
			emailbody += "		<p>Please use below buttons to either <b>Approve</b> or <b>Reject</b> Master Record</p>";
			emailbody += "		<p><b>Note</b>: Upon rejection system will ask for 'Reason for Rejection'.</p></br>";
			emailbody += "         <a href='"+approveURLParam+"'><img src='"+approverLink+" border='0' alt='Accept' style='width: 60px;'/></a>";
			emailbody += "         <a href='"+rejectURLParam+"'><img src='"+rejectionLink+"' border='0' alt='Reject' style='width: 60px;'/></a>";
		}
		emailbody +="		<tr><td>Thank You,</td><tr/>";
		emailbody +="		<tr><td>Admin</td></tr>";
		emailbody +="		</table>";
		emailbody +="	</body>";
		emailbody +="</html>";
        		
		
		var emailObj = email.send({
                author: senderId,
                recipients: recipientsId,
                subject: emailSubject,
                body: emailbody
                //relatedRecords: {transactionId: Number(recordObj.id)}
            });
	}
	
	function itemApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, recType, approvalStatus, authorID, approverLink, rejectionLink)
	{
		var itemName= '', approverName = '', subsidiaryName = '', statusText = '';
		
		var itemName		= recLoad.getText({fieldId : 'itemid'});
		var approverName	= approverNm;
        var subsidiaryName	= recLoad.getText({fieldId : 'subsidiary'});
		var displayName		= recLoad.getValue({fieldId : 'displayname'})
		var unitType		= recLoad.getText({fieldId : 'unitstype'});
		var subItem			= recLoad.getText({fieldId : 'parent'});
		var department		= recLoad.getText({fieldId : 'department'});
		var className		= recLoad.getText({fieldId : 'class'});
		var locationName	= recLoad.getText({fieldId : 'location'});
		var costingMethod	= recLoad.getText({fieldId : 'costingmethod'});
		var incomeAccount	= recLoad.getText({fieldId : 'incomeaccount'});
		var expenseAccount	= recLoad.getText({fieldId : 'expenseaccount'});
		var taxSchedule		= recLoad.getText({fieldId : 'taxschedule'});
		
        var approveURLParam = suiteletURL + '&processFlag=a&recId='+getEncodedValue(recId)+'&recType='+getEncodedValue(recType)+'&sts='+approvalStatus+'&aprid='+getEncodedValue(approverId);
        var rejectURLParam = suiteletURL + '&processFlag=r&recId='+getEncodedValue(recId)+'&recType='+getEncodedValue(recType)+'&sts='+approvalStatus+'&aprid='+getEncodedValue(approverId);
			
		var emailSubject= "Item "+itemName+" has been submitted for approval.";
		var emailbody	= '';
		var senderId	= authorID;
		var recipientsId= approverId;
		log.debug('approverName',approverName);
		emailbody +="<html>";
		emailbody +="	<body>";
		emailbody +="		Dear "+approverName+",<br/><br/>You have received new Item for Approval";
		emailbody +="		<br/><br/>";
		
		emailbody +="		<table>";
		emailbody +="		<tr><td>Item Name</td><td>:</td><td>"+itemName+"</td></tr>";
		emailbody +="		<tr><td>Display Name</td><td>:</td><td>"+displayName+"</td></tr>";
		emailbody +="		<tr><td>Unit Type</td><td>:</td><td>"+unitType+"</td></tr>";
		if(subItem) {
			emailbody +="		<tr><td>Sub Item</td><td>:</td><td>"+subItem+"</td></tr>";
		}
		emailbody +="		<tr><td>Subsidiary</td><td>:</td><td>"+subsidiaryName+"</td></tr>";
		emailbody +="		<tr><td>Department</td><td>:</td><td>"+department+"</td></tr>";
		emailbody +="		<tr><td>Class</td><td>:</td><td>"+className+"</td></tr>";
		emailbody +="		<tr><td>Location</td><td>:</td><td>"+locationName+"</td></tr>";
		if(costingMethod) {
			emailbody +="		<tr><td>Costing Method</td><td>:</td><td>"+costingMethod+"</td></tr>";
		}
		if(incomeAccount) {
			emailbody +="		<tr><td>Income Account</td><td>:</td><td>"+incomeAccount+"</td></tr>";
		}
		if(expenseAccount) {
			emailbody +="		<tr><td>Expense Account</td><td>:</td><td>"+expenseAccount+"</td></tr>";
		}
		emailbody +="		<tr><td>Tax Schedule</td><td>:</td><td>"+taxSchedule+"</td></tr>";
		//emailbody +="		<tr><td>Status</td><td>:</td><td>"+statusText+"</td><tr>";
		emailbody +="		<br/></br>";
		if(isEmailAppRequired == true){
			emailbody += "		<p>Please use below buttons to either <b>Approve</b> or <b>Reject</b> Master Record</p>";
			emailbody += "		<p><b>Note</b>: Upon rejection system will ask for 'Reason for Rejection'.</p></br>";
			emailbody += "         <a href='"+approveURLParam+"'><img src='"+approverLink+"' border='0' alt='Accept' style='width: 60px;'/></a>";
			emailbody += "         <a href='"+rejectURLParam+"'><img src='"+rejectionLink+"' border='0' alt='Reject' style='width: 60px;'/></a>";
		}
		emailbody +="		<tr><td>Thank You,</td><tr/>";
		emailbody +="		<tr><td>Admin</td></tr>";
		emailbody +="		</table>";
		emailbody +="	</body>";
		emailbody +="</html>";
        		
		
		var emailObj = email.send({
                author: senderId,
                recipients: recipientsId,
                subject: emailSubject,
                body: emailbody
                //relatedRecords: {transactionId: Number(recordObj.id)}
            });
	}*/
	
	function fetchMatrix(recName) {
		var customrecordyil_master_controller_matrixSearchObj = search.create({
				type: "customrecord_yil_master_contro_matrix",
				filters:
				[
					["custrecord_yil_mcm_master_type","anyof",recName]
                ],
				columns:
				[
					search.createColumn({name: "custrecord_yil_mcm_master_type", label: "MASTER TYPE " }),
					search.createColumn({name: "custrecord_yil_mcm_is_aprv_appl", label: "Is Approval Process Applicable ?"}),
					search.createColumn({name: "custrecord_yil_mcm_approver", label: "approverId"}),
					search.createColumn({name: "custrecord_yil_mcm_email_aprvl_requrd", label: "Is Email Approval Required?"}),
				]
				});
				
		return customrecordyil_master_controller_matrixSearchObj;
	}
	
	function getEncodedValue(tempString) {
        var encodedValue = encode.convert({
            string: tempString.toString(),
            inputEncoding: encode.Encoding.UTF_8,
            outputEncoding: encode.Encoding.BASE_64_URL_SAFE        
        });

        return encodedValue.toString();
    }

	
	return{
		beforeLoad : beforeLoad,
		afterSubmit : afterSubmit
	}
});