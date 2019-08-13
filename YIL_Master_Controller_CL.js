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

    function sendNotificationBtn(recId, recType) {
		var recordType	= recType;
		var recordId	= recId;
		//alert('record Id'+recordId);
		//alert('record Type'+recordType);
		//alert('record Type'+recordType);
		var appProcessApplicable	= '';
		var approverId				= '';
        var approverNm				= '';
        var isEmailAppRequired		= '';		
		
		var recLoad	= record.load({type : recordType, id : recordId});
		var suiteletURL = url.resolveScript({ scriptId : 'customscript_yil_master_sl', deploymentId : 'customdeploy_yil_master_contro_sl', returnExternalUrl: true, params: {recordType : recType}});
		//alert('suiteletURL'+suiteletURL);
		
		if(recType == 'vendor' || recType == 'customer'){
			if(recType == 'vendor'){
				var customrecordyil_master_controller_matrixSearchObj = fetchMatrix("Vendor");
				var searchResultCount = customrecordyil_master_controller_matrixSearchObj.runPaged().count;
				log.debug("customrecordyil_master_controller_matrixSearchObj result count",searchResultCount);
				customrecordyil_master_controller_matrixSearchObj.run().each(function(result){
					appProcessApplicable= result.getValue({name : 'custrecord_yil_mcm_is_aprv_appl'});
					approverId			= result.getValue({name : 'custrecord_yil_mcm_approver'});
					approverNm			= result.getText({name : 'custrecord_yil_mcm_approver'});
					isEmailAppRequired	= result.getValue({name : 'custrecord_yil_mcm_email_aprvl_requrd'});
				});
				var approvalStatus		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approval_status'});
				var approverName		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approver'});
				vendorApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus);
			}
			else if(recType == 'customer'){
				//log.debug('inside if and else recType',recType);
				var custName			= recLoad.getText({fieldId : 'companyname'});
				var customrecordyil_master_controller_matrixSearchObj = fetchMatrix("Customer");
				var searchResultCount = customrecordyil_master_controller_matrixSearchObj.runPaged().count;
				log.debug("customrecordyil_master_controller_matrixSearchObj result count",searchResultCount);
				customrecordyil_master_controller_matrixSearchObj.run().each(function(result){
					appProcessApplicable= result.getValue({name : 'custrecord_yil_mcm_is_aprv_appl'});
					approverId			= result.getValue({name : 'custrecord_yil_mcm_approver'});
					approverNm			= result.getText({name : 'custrecord_yil_mcm_approver'});
					isEmailAppRequired	= result.getValue({name : 'custrecord_yil_mcm_email_aprvl_requrd'});
				});
				var approvalStatus		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approval_status'});
				var approverName		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approver'});
				customerApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus);
			}
				/**var approvalStatus		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approval_status'});
				var approverName		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approver'});
				if(recLoad && recType == 'customer'){
					customerApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus);
					log.debug('inside if condition suiteletURL',suiteletURL);
				}
				else if(recLoad && recType == 'vendor'){
					vendorApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus);
				}*/
		}	
		else{
			//alert('Here...');
			var customrecordyil_master_controller_matrixSearchObj = fetchMatrix("Item");
		
			var searchResultCount = customrecordyil_master_controller_matrixSearchObj.runPaged().count;
			log.debug("customrecordyil_master_controller_matrixSearchObj result count",searchResultCount);
			customrecordyil_master_controller_matrixSearchObj.run().each(function(result){
				appProcessApplicable= result.getValue({name : 'custrecord_yil_mcm_is_aprv_appl'});
				approverId			= result.getValue({name : 'custrecord_yil_mcm_approver'});
				approverNm			= result.getText({name : 'custrecord_yil_mcm_approver'});
				isEmailAppRequired	= result.getValue({name : 'custrecord_yil_mcm_email_aprvl_requrd'});
			});
			var approvalStatus		= recLoad.getValue({fieldId : 'custitem_yil_mcm_approval_status'});
			var approverName		= recLoad.getValue({fieldId : 'custitem_yil_mcm_approver'});
			itemApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus);
		}
		/**var approvalStatus		= recLoad.getValue({fieldId : 'custitem_yil_mcm_approval_status'});
		var approverName		= recLoad.getValue({fieldId : 'custitem_yil_mcm_approver'});
		if(recType){
			itemApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus);
		}*/
	}
	
	function approvButtonFun(urlParam) {
		//alert("urlParam"+urlParam);
		//alert("Hi there!");
		window.location.href = urlParam;
	}
	
	function rejectButtonFun(urlParam) {
		//alert("urlParam"+urlParam);
		//alert("Hi there!");
		window.location.href = urlParam;
	}
	
	function customerApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus)
	{
		var customerName= '', customerId = '', approverName = '', subsidiaryName = '', statusText = '', userObj = '', userId = '';
		
		var customerName	= recLoad.getText({fieldId : 'companyname'});
		var customerId		= recLoad.getValue({fieldId : 'companyname'});
		var approverName	= approverNm;
        var subsidiaryName	= recLoad.getText({fieldId : 'subsidiary'});
        var statusText  	= recLoad.getText({fieldId : 'entitystatus'});
		var userObj			= runtime.getCurrentUser();
		var userId			= userObj.id; 
		var emailSubject= "Customer "+customerName+" has been submitted for approval.";
        		
		var approveURLParam = suiteletURL + '&processFlag=a&recId='+recId+'&sts='+approvalStatus+'&aprid='+approverId;
        var rejectURLParam = suiteletURL + '&processFlag=r&recId='+recId+'&sts='+approvalStatus+'&aprid='+approverId;
		
		var emailbody	= '';
		var senderId	= userId;
		var recipientsId= approverId;
		log.debug('approverName',approverName);
		emailbody +="<html>";
		emailbody +="	<body>";
		emailbody +="		Dear "+approverName+",<br/><br/>You have received new Customer for Approval";
		emailbody +="		<br/><br/>";
		
		emailbody +="		<table>";
		emailbody +="		<tr><td>Customer Name</td><td>:</td><td>"+customerName+"</td></tr>";
		emailbody +="		<tr><td>Subsidiary</td><td>:</td><td>"+subsidiaryName+"</td></tr>";
		emailbody +="		<tr><td>Status</td><td>:</td><td>"+statusText+"</td><tr>";
		emailbody +="		<br/></br>";
		if(isEmailAppRequired == true){
		emailbody += "         <a href='"+approveURLParam+"'><img src='https://tstdrv1384668.app.netsuite.com/core/media/media.nl?id=48894&amp;c=TSTDRV1384668&amp;h=81d2879dcbc0da202140' border='0' alt='Accept' style='width: 60px;'/></a>";
        emailbody += "         <a href='"+rejectURLParam+"'><img src='https://tstdrv1384668.app.netsuite.com/core/media/media.nl?id=48895&amp;c=TSTDRV1384668&amp;h=6f7d29136622b30870b2' border='0' alt='Reject' style='width: 60px;'/></a>";
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
	
	function vendorApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus)
	{
		var cumpanyName= '', cuspanyId = '', approverName = '', subsidiaryName = '', userObj = '', userId = '';
		
		var cumpanyName		= recLoad.getText({fieldId : 'entityid'});
		var cuspanyId		= recLoad.getValue({fieldId : 'entityid'});
		var approverName	= approverNm;
        var subsidiaryName	= recLoad.getText({fieldId : 'subsidiary'});
        //var statusText  	= recLoad.getText({fieldId : 'entitystatus'});
		var userObj			= runtime.getCurrentUser();
		var userId			= userObj.id; 
		
		var approveURLParam = suiteletURL + '&processFlag=a&recId='+recId+'&sts='+approvalStatus+'&aprid='+approverId;
        var rejectURLParam = suiteletURL + '&processFlag=r&recId='+recId+'&sts='+approvalStatus+'&aprid='+approverId;
		
		var emailSubject= "Vendor "+cumpanyName+" has been submitted for approval.";
		var emailbody	= '';
		var senderId	= userId;
		var recipientsId= approverId;
		log.debug('approverName',approverName);
		emailbody +="<html>";
		emailbody +="	<body>";
		emailbody +="		Dear "+approverName+",<br/><br/>You have received new Vendor for Approval";
		emailbody +="		<br/><br/>";
		
		emailbody +="		<table>";
		emailbody +="		<tr><td>Customer Name</td><td>:</td><td>"+cumpanyName+"</td></tr>";
		emailbody +="		<tr><td>Subsidiary</td><td>:</td><td>"+subsidiaryName+"</td></tr>";
		//emailbody +="		<tr><td>Status</td><td>:</td><td>"+statusText+"</td><tr>";
		emailbody +="		<br/></br>";
		if(isEmailAppRequired == true){
		emailbody += "         <a href='"+approveURLParam+"'><img src='https://tstdrv1384668.app.netsuite.com/core/media/media.nl?id=48894&amp;c=TSTDRV1384668&amp;h=81d2879dcbc0da202140' border='0' alt='Accept' style='width: 60px;'/></a>";
        emailbody += "         <a href='"+rejectURLParam+"'><img src='https://tstdrv1384668.app.netsuite.com/core/media/media.nl?id=48895&amp;c=TSTDRV1384668&amp;h=6f7d29136622b30870b2' border='0' alt='Reject' style='width: 60px;'/></a>";
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
	
	function itemApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus)
	{
		var itemName= '', itemId = '', approverName = '', subsidiaryName = '', statusText = '', userObj = '', userId = '';
		alert("Item");
		var itemName		= recLoad.getText({fieldId : 'itemid'});
		var itemId			= recLoad.getValue({fieldId : 'itemid'});
		var approverName	= approverNm;
        var subsidiaryName	= recLoad.getText({fieldId : 'subsidiary'});
        //var statusText  	= recLoad.getText({fieldId : 'entitystatus'});
		var userObj			= runtime.getCurrentUser();
		var userId			= userObj.id; 
		log.debug('approvalStatus',approvalStatus);
		log.debug('recId',recId);
		var approveURLParam = suiteletURL + '&processFlag=a&recId='+recId+'&sts='+approvalStatus+'&aprid='+approverId;
        var rejectURLParam = suiteletURL + '&processFlag=r&recId='+recId+'&sts='+approvalStatus+'&aprid='+approverId;
		
		var emailSubject= "Item "+itemName+" has been submitted for approval.";
		var emailbody	= '';
		var senderId	= userId;
		var recipientsId= approverId;
		log.debug('approverName',approverName);
		emailbody +="<html>";
		emailbody +="	<body>";
		emailbody +="		Dear "+approverName+",<br/><br/>You have received new Item for Approval";
		emailbody +="		<br/><br/>";
		
		emailbody +="		<table>";
		emailbody +="		<tr><td>Customer Name</td><td>:</td><td>"+itemName+"</td></tr>";
		emailbody +="		<tr><td>Subsidiary</td><td>:</td><td>"+subsidiaryName+"</td></tr>";
		//emailbody +="		<tr><td>Status</td><td>:</td><td>"+statusText+"</td><tr>";
		emailbody +="		<br/></br>";
		if(isEmailAppRequired == true){
		emailbody += "         <a href='"+approveURLParam+"'><img src='https://tstdrv1384668.app.netsuite.com/core/media/media.nl?id=48894&amp;c=TSTDRV1384668&amp;h=81d2879dcbc0da202140' border='0' alt='Accept' style='width: 60px;'/></a>";
        emailbody += "         <a href='"+rejectURLParam+"'><img src='https://tstdrv1384668.app.netsuite.com/core/media/media.nl?id=48895&amp;c=TSTDRV1384668&amp;h=6f7d29136622b30870b2' border='0' alt='Reject' style='width: 60px;'/></a>";
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
				type: "customrecordyil_master_controller_matrix",
				filters:
				[
					["name","is",recName]
				],
				columns:
				[
					search.createColumn({name: "name", label: "Name" }),
					search.createColumn({name: "custrecord_yil_mcm_is_aprv_appl", label: "Is Approval Process Applicable ?"}),
					search.createColumn({name: "custrecord_yil_mcm_approver", label: "approverId"}),
					search.createColumn({name: "custrecord_yil_mcm_email_aprvl_requrd", label: "Is Email Approval Required?"})
				]
				});
				
		return customrecordyil_master_controller_matrixSearchObj;
	}
		
    return {
		pageInit: pageInit,
		sendNotificationBtn: sendNotificationBtn,
		approvButtonFun: approvButtonFun,
		rejectButtonFun : rejectButtonFun
	}

});