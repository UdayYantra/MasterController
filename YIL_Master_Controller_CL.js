/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
*/
/*************************************************************
 * File Header
 * Script Type	: Client Script
 * Script Name	: 
 * File Name	: YIL_Master_Controller_CL.js
 * Created On	: 09/08/2019
 * Modified On	: 
 * Created By	: Siddhant Mishra (Yantra Inc.)
 * Modified By	: 
 * Description	: This code sends notification Email after button click.
 ************************************************************/
define([ 'N/record','N/search','N/runtime','N/url','N/email'], function(record, search, runtime, url, email){
    function pageInit(context){

    }

    function sendNotificationBtn(recId, recType, approverId, encRecId, encRecType, encAprId) {
		var appProcessApplicable	= '';
		var approverNm				= '';
        var isEmailAppRequired		= '';		
		var scriptObj				= runtime.getCurrentScript();
		var authorID				= scriptObj.getParameter({name: "custscript_yil_master_controller_em_auth"});
		var approverLink			= scriptObj.getParameter({name: "custscript_yil_master_controller_app_img"});
		var rejectionLink			= scriptObj.getParameter({name: "custscript_yil_master_controller_rej_img"});
		
		
		
		
 		var recLoad	= record.load({type : recType, id : recId});
		var suiteletURL = url.resolveScript({ scriptId : 'customscript_yil_master_sl', deploymentId : 'customdeploy_yil_master_contro_sl', returnExternalUrl: true, params: {recordType : recType}});
		if(recType == 'vendor' || recType == 'customer'){
			if(recType == 'vendor'){
				var customrecordyil_master_controller_matrixSearchObj = fetchMatrix(2);
				var searchResultCount = customrecordyil_master_controller_matrixSearchObj.runPaged().count;
				customrecordyil_master_controller_matrixSearchObj.run().each(function(result){
					appProcessApplicable= result.getValue({name : 'custrecord_yil_mcm_is_aprv_appl'});
					//approverId		= result.getValue({name : 'custrecord_yil_mcm_approver'});
					approverNm			= result.getText({name : 'custrecord_yil_mcm_approver'});
					isEmailAppRequired	= result.getValue({name : 'custrecord_yil_mcm_email_aprvl_requrd'});
				});
				var approvalStatus		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approval_status'});
				var approverName		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approver'});
				vendorApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus, encRecId, encRecType, encAprId, authorID, approverLink, rejectionLink);
			}
			else if(recType == 'customer'){
				var custName			= recLoad.getText({fieldId : 'companyname'});
				var customrecordyil_master_controller_matrixSearchObj = fetchMatrix(1);
				var searchResultCount = customrecordyil_master_controller_matrixSearchObj.runPaged().count;
				customrecordyil_master_controller_matrixSearchObj.run().each(function(result){
					appProcessApplicable= result.getValue({name : 'custrecord_yil_mcm_is_aprv_appl'});
					//approverId		= result.getValue({name : 'custrecord_yil_mcm_approver'});
					approverNm			= result.getText({name : 'custrecord_yil_mcm_approver'});
					isEmailAppRequired	= result.getValue({name : 'custrecord_yil_mcm_email_aprvl_requrd'});
				});
				var approvalStatus		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approval_status'});
				var approverName		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approver'});
				customerApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus, encRecId, encRecType, encAprId, authorID, approverLink, rejectionLink);
			}
		}	
		else{
			var customrecordyil_master_controller_matrixSearchObj = fetchMatrix(3);
		
			var searchResultCount = customrecordyil_master_controller_matrixSearchObj.runPaged().count;
			customrecordyil_master_controller_matrixSearchObj.run().each(function(result){
				appProcessApplicable= result.getValue({name : 'custrecord_yil_mcm_is_aprv_appl'});
				//approverId			= result.getValue({name : 'custrecord_yil_mcm_approver'});
				approverNm			= result.getText({name : 'custrecord_yil_mcm_approver'});
				isEmailAppRequired	= result.getValue({name : 'custrecord_yil_mcm_email_aprvl_requrd'});
			});
			var approvalStatus		= recLoad.getValue({fieldId : 'custitem_yil_mcm_approval_status'});
			var approverName		= recLoad.getValue({fieldId : 'custitem_yil_mcm_approver'});
			itemApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus, encRecId, encRecType, encAprId, authorID, approverLink, rejectionLink);
		}
	}
	
	function approvButtonFun(urlParam) {
		window.location.href = urlParam;
	}
	
	function rejectButtonFun(urlParam) {
		window.location.href = urlParam;
	}
	
	function AfterSubForAppButtonClick(recId, recType, approverId, encRecId, encRecType, encAprId){
		var appProcessApplicable	= '';
		var approverNm				= '';
        var isEmailAppRequired		= '';		
		var scriptObj				= runtime.getCurrentScript();
		var authorID				= scriptObj.getParameter({name: "custscript_yil_master_controller_em_auth"});
		var approverLink			= scriptObj.getParameter({name: "custscript_yil_master_controller_app_img"});
		var rejectionLink			= scriptObj.getParameter({name: "custscript_yil_master_controller_rej_img"});
 		var recLoad	= record.load({type : recType, id : recId});
		if(recLoad){
			var suiteletURL = url.resolveScript({ scriptId : 'customscript_yil_master_sl', deploymentId : 'customdeploy_yil_master_contro_sl', returnExternalUrl: true});
			if(recType == 'vendor' || recType == 'customer') {
				//alert("Inside Vendor");
				if(recType == 'vendor'){
					var customrecordyil_master_controller_matrixSearchObj = fetchMatrix(2);
					var searchResultCount = customrecordyil_master_controller_matrixSearchObj.runPaged().count;
					customrecordyil_master_controller_matrixSearchObj.run().each(function(result){
						appProcessApplicable= result.getValue({name : 'custrecord_yil_mcm_is_aprv_appl'});
						approverNm			= result.getText({name : 'custrecord_yil_mcm_approver'});
						isEmailAppRequired	= result.getValue({name : 'custrecord_yil_mcm_email_aprvl_requrd'});
					});					
				}
				else if(recType == 'customer'){
					//var custName			= recLoad.getText({fieldId : 'companyname'});
					var customrecordyil_master_controller_matrixSearchObj = fetchMatrix(1);
					var searchResultCount = customrecordyil_master_controller_matrixSearchObj.runPaged().count;
					customrecordyil_master_controller_matrixSearchObj.run().each(function(result){
						appProcessApplicable= result.getValue({name : 'custrecord_yil_mcm_is_aprv_appl'});
						approverNm			= result.getText({name : 'custrecord_yil_mcm_approver'});
						isEmailAppRequired	= result.getValue({name : 'custrecord_yil_mcm_email_aprvl_requrd'});
					});
				}
				if(appProcessApplicable) {
					//alert("Inside Approval process");
					recLoad.setValue({fieldId : 'isinactive', value : true});
					recLoad.setValue({fieldId : 'custentity_yil_mcm_approval_status', value : 1});
					recLoad.setValue({fieldId : 'custentity_yil_mcm_approver', value : approverId});
					var approvalStatus		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approval_status'});
					var approverName		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approver'});
					if(recType == 'customer') {
						customerApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus, encRecId, encRecType, encAprId, authorID, approverLink, rejectionLink);
					}
					else if(recType == 'vendor') {
						vendorApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus, encRecId, encRecType, encAprId, authorID, approverLink, rejectionLink);
					}
				}
				else {
					recLoad.setValue({fieldId : 'isinactive', value : false});
					recLoad.setValue({fieldId : 'custentity_yil_mcm_approval_status', value : 2});				
				}
			}
			else {
				var customrecordyil_master_controller_matrixSearchObj = fetchMatrix(3);
				var searchResultCount = customrecordyil_master_controller_matrixSearchObj.runPaged().count;
				customrecordyil_master_controller_matrixSearchObj.run().each(function(result){
					appProcessApplicable= result.getValue({name : 'custrecord_yil_mcm_is_aprv_appl'});
					approverNm			= result.getText({name : 'custrecord_yil_mcm_approver'});
					isEmailAppRequired	= result.getValue({name : 'custrecord_yil_mcm_email_aprvl_requrd'});
				});
				if(appProcessApplicable){
					recLoad.setValue({fieldId : 'isinactive', value : true});
					recLoad.setValue({fieldId : 'custitem_yil_mcm_approval_status', value : 1});
					recLoad.setValue({fieldId : 'custitem_yil_mcm_approver', value : approverId});
					var approvalStatus		= recLoad.getValue({fieldId : 'custitem_yil_mcm_approval_status'});
					var approverName		= recLoad.getValue({fieldId : 'custitem_yil_mcm_approver'});
					if(recType){
						itemApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus, encRecId, encRecType, encAprId, authorID, approverLink, rejectionLink);
					}
				}
				else{
					recLoad.setValue({fieldId : 'isinactive', value : false});
					recLoad.setValue({fieldId : 'custitem_yil_mcm_approval_status', value : 2});				
				}
			}
			var updatedRecId	= recLoad.save();
			window.location.reload();
		}
	}
	

		
	function customerApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus, encRecId, encRecType, encAprId, authorID, approverLink, rejectionLink)
	{
		var customerName= '', approverName = '', subsidiaryName = '', statusText = '', userObj = '', userId = '';
		
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
		var numLines		= recLoad.getLineCount({sublistId: 'addressbook'});
		var shippinAddressValue = '';
		var billingAddressValue  = '';
		
		
		for(var n = 0; n < numLines ; n++) {
			var shippingId			= recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'defaultshipping', line: n});
			var billingId			= recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'defaultbilling', line: n});
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
		}
		
        var emailSubject= "Customer "+customerName+" has been submitted for approval.";
        		
		var approveURLParam = suiteletURL + '&processFlag=a&recId='+encRecId+'&recType='+encRecType+'&sts=1&aprid='+encAprId;
        var rejectURLParam = suiteletURL + '&processFlag=r&recId='+encRecId+'&recType='+encRecType+'&sts=1&aprid='+encAprId;
		
		var emailbody	= '';
		var senderId	= authorID;
		var recipientsId= approverId;
		emailbody +="<html>";
		emailbody +="	<body>";
		emailbody +="		Dear "+approverName+",<br/><br/>You have received new Customer for Approval";
		emailbody +="		<br/><br/>";
		
		emailbody +="		<table>";
		emailbody +="		<tr><td><b>Customer Name</b></td><td>:</td><td>"+customerName+"</td></tr>";
		if(parentCompany){
			emailbody += "<tr><td><b>Parent Company</b></td><td>:</td><td>"+parentCompany+"</td></tr>";
		}
		emailbody +="		<tr><td><b>Email</b></td><td>:</td><td>"+emailId+"</td></tr>";
		emailbody +="		<tr><td><b>Phone No.</b></td><td>:</td><td>"+phone+"</td></tr>";
		emailbody +="		<tr><td><b>Fax</b></td><td>:</td><td>"+fax+"</td></tr>";
		emailbody +="		<tr><td><b>Subsidiary</b></td><td>:</td><td>"+subsidiaryName+"</td></tr>";
		if(accountNo) {
			emailbody +="		<tr><td><b>Account Number</b></td><td>:</td><td>"+accountNo+"</td></tr>";
		}
		emailbody +="		<tr><td><b>Primary Currency</b></td><td>:</td><td>"+primaryCurrency+"</td></tr>";
		emailbody +="		<tr><td><b>Terms</b></td><td>:</td><td>"+terms+"</td></tr>";
		emailbody +="		<tr><td><b>Credit Limit</b></td><td>:</td><td>"+creditLimit+"</td></tr>";
		emailbody +="		<tr><td><b>Tax Registration No.</b></td><td>:</td><td>"+taxRegNo+"</td></tr>";
		if(taxable) {
			emailbody +="<tr><td><b>Taxable</b></td><td>:</td><td>Yes</td></tr>";
		}
		else{
			emailbody +="<tr><td><b>Taxable</b></td><td>:</td><td>No</td></tr>";
		}
		if(shippingAddress && shippinAddressValue) {
			emailbody +="<tr><td><b>Shipping Address</b></td><td>:</td><td>"+shippinAddressValue+"</td></tr>";
		}
		if(billingAddress && billingAddressValue) {
			emailbody +="<tr><td><b>Billing Address</b></td><td>:</td><td>"+billingAddressValue+"</td></tr>";
		}
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
	}
	
	function vendorApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus, encRecId, encRecType, encAprId, authorID, approverLink, rejectionLink)
	{
		var vendorName= '', approverName = '', subsidiaryName = '', userObj = '', userId = '';
		
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
		var numLines		= recLoad.getLineCount({sublistId: 'addressbook'});
		var shippinAddressValue = '';
		var billingAddressValue  = '';
		var bankDetails	= _getBankPaymentDetailsFun(recId);
		for(var n = 0; n < numLines ; n++) {
			var shippingId			= recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'defaultshipping', line: n});
			var billingId			= recLoad.getSublistValue({sublistId: 'addressbook', fieldId: 'defaultbilling', line: n});
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
		}
		var approveURLParam = suiteletURL + '&processFlag=a&recId='+encRecId+'&recType='+encRecType+'&sts=1&aprid='+encAprId;
        var rejectURLParam = suiteletURL + '&processFlag=r&recId='+encRecId+'&recType='+encRecType+'&sts=1&aprid='+encAprId;
		var emailSubject= "Vendor "+vendorName+" has been submitted for approval.";
		var emailbody	= '';
		var senderId	= authorID;
		var recipientsId= approverId;
		emailbody +="<html>";
		emailbody +="	<body>";
		emailbody +="		Dear "+approverName+",<br/><br/>You have received new Vendor for Approval";
		emailbody +="		<br/><br/>";
		
		emailbody +="		<table>";
		emailbody +="		<tr><td><b>Vendor Name</b></td><td>:</td><td>"+vendorName+"</td></tr>";
		emailbody +="		<tr><td><b>Email</b></td><td>:</td><td>"+emailId+"</td></tr>";
		emailbody +="		<tr><td><b>Phone No.</b></td><td>:</td><td>"+phone+"</td></tr>";
		emailbody +="		<tr><td><b>Fax</b></td><td>:</td><td>"+fax+"</td></tr>";
		emailbody +="		<tr><td><b>Subsidiary</b></td><td>:</td><td>"+subsidiaryName+"</td></tr>";
		if(accountNo) {
			emailbody +="		<tr><td><b>Account Number</b></td><td>:</td><td>"+accountNo+"</td></tr>";
		}
		emailbody +="		<tr><td><b>Primary Currency</b></td><td>:</td><td>"+primaryCurrency+"</td></tr>";
		emailbody +="		<tr><td><b>Credit Limit</b></td><td>:</td><td>"+creditLimit+"</td></tr>";
		if(shippingAddress && shippinAddressValue) {
			emailbody +="<tr><td><b>Shipping Address</b></td><td>:</td><td>"+shippinAddressValue+"</td></tr>";
		}
		if(billingAddress && billingAddressValue) {
			emailbody +="<tr><td><b>Billing Address</b></td><td>:</td><td>"+billingAddressValue+"</td></tr>";
		}
		emailbody +="</table>";
		if(bankDetails) {
		
			emailbody +="	<table cellspacing='0' cellpadding = '2' valign='top'>";
			emailbody +=	bankDetails;
			emailbody +="		</table>";
		
		}
		
		emailbody +="		<table>";
		emailbody +="		</br></br>";
		if(isEmailAppRequired == true){
			emailbody += "		</br><p>Please use below buttons to either <b>Approve</b> or <b>Reject</b> Master Record</p>";
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
		//alert("Completed");
	}
	
	function itemApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus, encRecId, encRecType, encAprId, authorID, approverLink, rejectionLink)
	{
		var itemName= '', itemId = '', approverName = '', subsidiaryName = '', statusText = '', userObj = '', userId = '';
		var itemName		= recLoad.getText({fieldId : 'itemid'});
		var itemId			= recLoad.getValue({fieldId : 'itemid'});
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
		
		var approveURLParam = suiteletURL + '&processFlag=a&recId='+encRecId+'&recType='+encRecType+'&sts=1&aprid='+encAprId;
        var rejectURLParam = suiteletURL + '&processFlag=r&recId='+encRecId+'&recType='+encRecType+'&sts=1&aprid='+encAprId;
		
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
		emailbody +="		<tr><td><b>Item Name</b></td><td>:</td><td>"+itemName+"</td></tr>";
		emailbody +="		<tr><td><b>Display Name</b></td><td>:</td><td>"+displayName+"</td></tr>";
		emailbody +="		<tr><td><b>Unit Type</b></td><td>:</td><td>"+unitType+"</td></tr>";
		if(subItem) {
			emailbody +="		<tr><td><b>Sub Item</b></td><td>:</td><td>"+subItem+"</td></tr>";
		}
		emailbody +="		<tr><td><b>Subsidiary</b></td><td>:</td><td>"+subsidiaryName+"</td></tr>";
		emailbody +="		<tr><td><b>Department</b></td><td>:</td><td>"+department+"</td></tr>";
		emailbody +="		<tr><td><b>Class</b></td><td>:</td><td>"+className+"</td></tr>";
		emailbody +="		<tr><td><b>Location</b></td><td>:</td><td>"+locationName+"</td></tr>";
		if(costingMethod) {
			emailbody +="		<tr><td><b>Costing Method</b></td><td>:</td><td>"+costingMethod+"</td></tr>";
		}
		if(incomeAccount) {
			emailbody +="		<tr><td><b>Income Account</b></td><td>:</td><td>"+incomeAccount+"</td></tr>";
		}
		if(expenseAccount) {
			emailbody +="		<tr><td><b>Expense Account</b></td><td>:</td><td>"+expenseAccount+"</td></tr>";
		}
		emailbody +="		<tr><td><b>Tax Schedule</b></td><td>:</td><td>"+taxSchedule+"</td></tr>";
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
	}
	function fetchMatrix(recName) {
		var customrecordyil_master_controller_matrixSearchObj = search.create({
				type: "customrecord_yil_master_contro_matrix",
				filters:
				[
					["custrecord_yil_mcm_master_type","anyof",recName]
				],
				columns:
				[
					search.createColumn({name: "custrecord_yil_mcm_master_type", label: "Master Type" }),
					search.createColumn({name: "custrecord_yil_mcm_is_aprv_appl", label: "Is Approval Process Applicable ?"}),
					search.createColumn({name: "custrecord_yil_mcm_approver", label: "approverId"}),
					search.createColumn({name: "custrecord_yil_mcm_email_aprvl_requrd", label: "Is Email Approval Required?"})
				]
				});
		return customrecordyil_master_controller_matrixSearchObj;
	}
	
	
	 function _getBankPaymentDetailsFun(recId) {
		var vendorSearchObj = search.create({
			type: "vendor",
			filters:
			[
			["internalidnumber","equalto",recId]
			],
			columns: 
			[
			search.createColumn({name: 'custrecord_2663_entity_bank_type',join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_file_format',join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_acct_no',join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_acct_name',join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_bank_no', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_bank_name', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_branch_no', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_branch_name', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_acct_suffix', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_acct_type', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			//search.createColumn({name: 'custrecord_2663_parent_vendor', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			//search.createColumn({name: 'custrecord_2663_parent_employee', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			//search.createColumn({name: 'custrecord_2663_parent_customer', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_payment_desc', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_customer_code', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_edi_value', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_child_id', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_reference', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_baby_bonus', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_iban', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_country_code', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_iban_check', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_country_check', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_bank_code', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_processor_code', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_swift', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_address1', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
		    search.createColumn({name: 'custrecord_2663_entity_address2', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_address3', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_city', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_state', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_zip', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_country', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_bban', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			//search.createColumn({name: 'custrecord_2663_parent_cust_ref', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_bic', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			//search.createColumn({name: 'custrecord_2663_entity_bank_acct_type', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_issuer_num', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			//search.createColumn({name: 'custrecord_2663_parent_partner', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_billing_seq_type', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_date_ref_mandate', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_ref_amended', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_final_pay_date', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_num_payments', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_first_pay_date', join: "CUSTRECORD_2663_PARENT_VENDOR"}),
			search.createColumn({name: 'custrecord_2663_entity_company_id', join: "CUSTRECORD_2663_PARENT_VENDOR"})
			]
		});
		var searchResultCount = vendorSearchObj.runPaged().count;
		var stringTable = '';
		var no			= 1;
		
		if(Number(searchResultCount) > 0) {
			stringTable += '<tr>';
			
			vendorSearchObj.run().each(function(result){
			var payFormat   	= result.getText({name: 'custrecord_2663_entity_file_format',join: "CUSTRECORD_2663_PARENT_VENDOR"});
			if(payFormat){
				var typeId			= result.getText({name: 'custrecord_2663_entity_bank_type',join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var bankAccNo		= result.getValue({name: 'custrecord_2663_entity_acct_no',join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var bankAccNm   	= result.getValue({name: 'custrecord_2663_entity_acct_name',join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var bankNo			= result.getValue({name: 'custrecord_2663_entity_bank_no', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var bankNm			= result.getValue({name: 'custrecord_2663_entity_bank_name', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var branchNo		= result.getValue({name: 'custrecord_2663_entity_branch_no', join: "CUSTRECORD_2663_PARENT_VENDOR"})
				var branchNm		= result.getValue({name: 'custrecord_2663_entity_branch_name', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var bankAccSuffix	= result.getValue({name: 'custrecord_2663_entity_acct_suffix', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var accountType		= result.getText({name: 'custrecord_2663_acct_type', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				//var parentVendor	= result.getText({name: 'custrecord_2663_parent_vendor', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				//var parentEmp		= result.getText({name: 'custrecord_2663_parent_employee', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				//var parentCust		= result.getText({name: 'custrecord_2663_parent_customer', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var bankAccPayDesc	= result.getValue({name: 'custrecord_2663_entity_payment_desc', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var eid				= result.getValue({name: 'custrecord_2663_edi', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var custCode		= result.getValue({name: 'custrecord_2663_customer_code', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var ediValue		= result.getValue({name: 'custrecord_2663_edi_value', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var childId			= result.getValue({name: 'custrecord_2663_child_id', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var reference		= result.getValue({name: 'custrecord_2663_reference', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var babyBonus		= result.getValue({name: 'custrecord_2663_baby_bonus', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var ibanEntity		= result.getValue({name: 'custrecord_2663_entity_iban', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var countryCode		= result.getValue({name: 'custrecord_2663_entity_country_code', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var ibanCheckDigit	= result.getValue({name: 'custrecord_2663_entity_iban_check', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var countryCheck	= result.getValue({name: 'custrecord_2663_entity_country_check', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var bankCode		= result.getValue({name: 'custrecord_2663_entity_bank_code', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var processorCode	= result.getValue({name: 'custrecord_2663_entity_processor_code', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var swiftCode		= result.getValue({name: 'custrecord_2663_entity_swift', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var addressOne		= result.getValue({name: 'custrecord_2663_entity_address1', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var addressTwo		= result.getValue({name: 'custrecord_2663_entity_address2', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var addressThree	= result.getValue({name: 'custrecord_2663_entity_address3', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var cityName		= result.getValue({name: 'custrecord_2663_entity_city', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var stateName		= result.getValue({name: 'custrecord_2663_entity_state', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var zipCode			= result.getValue({name: 'custrecord_2663_entity_zip', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var countryNm		= result.getText({name: 'custrecord_2663_entity_country', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var bban			= result.getValue({name: 'custrecord_2663_entity_bban', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				//var parentCustReturn= result.getText({name: 'custrecord_2663_parent_cust_ref', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var bic				= result.getValue({name: 'custrecord_2663_entity_bic', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				//var bankAccType		= result.getText({name: 'custrecord_2663_entity_bank_acct_type', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var issuerNo		= result.getValue({name: 'custrecord_2663_entity_issuer_num', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				//var parentPartner	= result.getText({name: 'custrecord_2663_parent_partner', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var billingSeqType	= result.getText({name: 'custrecord_2663_entity_billing_seq_type', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var dateReMandate	= result.getValue({name: 'custrecord_2663_date_ref_mandate', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var referenceAmended= result.getText({name: 'custrecord_2663_entity_ref_amended', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var finalPaydate	= result.getValue({name: 'custrecord_2663_final_pay_date', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var paymentMode		= result.getValue({name: 'custrecord_2663_num_payments', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var firstPayDate	= result.getValue({name: 'custrecord_2663_first_pay_date', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				var compId			= result.getValue({name: 'custrecord_2663_entity_company_id', join: "CUSTRECORD_2663_PARENT_VENDOR"});
				//if(payFormat){
				stringTable +="	<td align='left' valign = 'top' >";// style='float:left;'
				stringTable +="	<table border = '1' cellspacing='0' cellpadding = '0'>";// style='float:left;'
				stringTable += "<tr><td colspan='2' ><center><b> Bank Payment Detail "+no+"</b></center></td></tr>";
				//stringTable +="<tr><td>";
				//}
				if(typeId) { stringTable += "<tr><td>Type</td><td>"+typeId+"</td></tr>"; }
				if(payFormat) { stringTable += "<tr><td>Payemnt File Format</td><td>"+payFormat+"</td></tr>"; }
				if(bankAccNo) { stringTable += "<tr><td>Bank Account Number</td><td>"+bankAccNo+"</td></tr>"; }
				if(bankAccNm) { stringTable += "<tr><td>Bank Account Name</td><td>"+bankAccNm+"</td></tr>"; }
				if(bankNo) { stringTable += "<tr><td>Bank Number</td><td>"+bankNo+"</td></tr>"; }
				if(bankNm) { stringTable += "<tr><td>Bank Name</td><td>"+bankNm+"</td></tr>"; }
				if(branchNo) { stringTable += "<tr><td>Branch Number</td><td>"+branchNo+"</td></tr>"; }
				if(branchNm) { stringTable += "<tr><td>Branch Name</td><td>"+branchNm+"</td></tr>"; }
				if(bankAccSuffix) { stringTable += "<tr><td>Bank Account Suffix</td><td>"+bankAccSuffix+"</td></tr>"; }
				if(accountType) { stringTable += "<tr><td>Account Type</td><td>"+accountType+"</td></tr>"; }
				//if(parentVendor) { stringTable += "<tr><td>Parent Vendor</td><td>"+parentVendor+"</td></tr>"; }
				//if(parentEmp) { stringTable += "<tr><td>Parent Employee</td><td>"+parentEmp+"</td></tr>"; }
				//if(parentCust) { stringTable += "<tr><td>Parent Customer</td><td>"+parentCust+"</td></tr>"; }
				if(bankAccPayDesc) { stringTable += "<tr><td>Bank Account Payment Description</td><td>"+bankAccPayDesc+"</td></tr>"; }
				if(eid) { stringTable += "<tr><td>EDI</td><td>"+eid+"</td></tr>"; }
				if(custCode) { stringTable += "<tr><td>Customer Code</td><td>"+custCode+"</td></tr>"; }
				if(ediValue) { stringTable += "<tr><td>EDI Value</td><td>"+ediValue+"</td></tr>"; }
				if(childId) { stringTable += "<tr><td>Child ID</td>><td>"+childId+"</td></tr>"; }
				if(reference) { stringTable += "<tr><td>Reference</td><td>"+reference+"</td></tr>"; }
				if(babyBonus) { stringTable += "<tr><td>Baby Bonus</td><td>"+babyBonus+"</td></tr>"; }
				if(ibanEntity) { stringTable += "<tr><td>IBAN</td><td>"+ibanEntity+"</td></tr>"; }
				if(countryCode) { stringTable += "<tr><td>Country Code</td><td>"+countryCode+"</td></tr>"; }
				if(ibanCheckDigit) { stringTable += "<tr><td>IBAN Check Digits</td><td>"+ibanCheckDigit+"</td></tr>"; }
				if(countryCheck) { stringTable += "<tr><td>Country Check</td><td>"+countryCheck+"</td></tr>"; }
				if(bankCode) { stringTable += "<tr><td>Bank Code</td><td>"+bankCode+"</td></tr>"; }
				if(processorCode) { stringTable += "<tr><td>Processor Code</td><td>"+processorCode+"</td></tr>"; }
				if(swiftCode) { stringTable += "<tr><td>Swift code</td><td>"+swiftCode+"</td></tr>"; }
				if(addressOne) { stringTable += "<tr><td>Address1</td><td>"+addressOne+"</td></tr>"; }
				if(addressTwo) { stringTable += "<tr><td>Address2</td><td>"+addressTwo+"</td></tr>"; }
				if(addressThree) { stringTable += "<tr><td>Address3</td><td>"+addressThree+"</td></tr>"; }
				if(cityName) { stringTable += "<tr><td>City</td><td>"+cityName+"</td></tr>"; }
				if(stateName) { stringTable += "<tr><td>State/Province</td><td>"+stateName+"</td></tr>"; }
				if(zipCode) { stringTable += "<tr><td>Zip</td><td>"+zipCode+"</td></tr>"; }
				if(countryNm) { stringTable += "<tr><td>Country</td><td>"+countryNm+"</td></tr>"; }
				if(bban) { stringTable += "<tr><td>BBAN</td><td>"+bban+"</td></tr>"; }
				//if(parentCustReturn) { stringTable += "<tr><td>Parent Customer - Refund</td><td>"+parentCustReturn+"</td></tr>"; }
				if(bic) { stringTable += "<tr><td>BIC</td><td>"+bic+"</td></tr>"; }
				//if(bankAccType) { stringTable += "<tr><td>Bank Account Type</td><td>"+bankAccType+"</td></tr>"; }
				if(issuerNo) { stringTable += "<tr><td>Issuer Number</td><td>"+issuerNo+"</td></tr>"; }
				//if(parentPartner) { stringTable += "<tr><td>Parent Partner</td><td>:</td><td>"+parentPartner+"</td></tr>"; }
				if(billingSeqType) { stringTable += "<tr><td>Billing Sequence Type</td><td>"+billingSeqType+"</td></tr>"; }
				if(dateReMandate) { stringTable += "<tr><td>Date of Reference Mandate</td><td>"+dateReMandate+"</td></tr>"; }
				if(referenceAmended) { stringTable += "<tr><td>Reference Amended</td><td>"+referenceAmended+"</td></tr>"; }
				if(finalPaydate) { stringTable += "<tr><td>Final Payment Date</td><td>"+finalPaydate+"</td></tr>"; }
				if(paymentMode) { stringTable += "<tr><td>Number of Payments Made</td><td>"+paymentMode+"</td></tr>"; }
				if(firstPayDate) { stringTable += "<tr><td>First Payment Date</td><td>"+firstPayDate+"</td></tr>"; }
				if(compId) { stringTable += "<tr><td>Company Id</td><td>"+compId+"</td></tr>"; }
				stringTable	+="		</table>";
				stringTable	+="		</td>";
				//stringTable +="</td></tr>";
				//stringTable +="</td>";
				no++;
				return true;
			}
			});
			stringTable += '</tr>';
		}
		return stringTable;
	}
		  
		
    return {
		pageInit: pageInit,
		sendNotificationBtn: sendNotificationBtn,
		approvButtonFun: approvButtonFun,
		rejectButtonFun : rejectButtonFun,
		AfterSubForAppButtonClick: AfterSubForAppButtonClick
	}

});