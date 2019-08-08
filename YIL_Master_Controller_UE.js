/**
 *@NApiVersion 2.x   
 *@NScriptType UserEventScript
 *@NModuleScope SameAccount
 */

define([ 'N/record','N/search','N/ui/serverWidget','N/runtime','N/url','N/email', 'N/encode'], function(record, search, server, runtime, url, email, encode){
	
	function beforeLoad(context)
	{
        if(context.type == context.UserEventType.VIEW){
			var form           = context.form;
			var recObj         = context.newRecord;
			var recId          = recObj.id;
			var recType        = recObj.type;
			var userObj 	   = runtime.getCurrentUser();
			var currentUser    = userObj.name;
            			
			var recLoad		   = record.load({type : recType, id : recId});
		    var inactive       = recLoad.getValue({ fieldId : 'isinactive'});
			
			if(recType == 'vendor' || recType == 'customer'){
				var appStatus		= recLoad.getValue({ fieldId : 'custentity_yil_mcm_approval_status'});
				var approverName	= recLoad.getText({ fieldId : 'custentity_yil_mcm_approver'});	
				var approverId		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approver'});
			}
			else{
				var appStatus		= recLoad.getValue({ fieldId : 'custitem_yil_mcm_approval_status'});
				var approverName	= recLoad.getText({ fieldId : 'custitem_yil_mcm_approver'});
				var approverId		= recLoad.getValue({fieldId : 'custitem_yil_mcm_approver'})
			}
			
			form.clientScriptModulePath = '/SuiteScripts/YIL_Master_Controller_CL.js';
			var suiteletURL = url.resolveScript({ scriptId : 'customscript_yil_master_sl', deploymentId : 'customdeploy_yil_master_contro_sl',returnExternalUrl: true, params: {recordType : recType}});
			var approveURLParam = suiteletURL + '&processFlag=a&recId='+recId+'&sts='+appStatus+'&aprid='+approverId;
            var rejectURLParam = suiteletURL + '&processFlag=r&recId='+recId+'&sts='+appStatus+'&aprid='+approverId;
			
			if(appStatus == 1 && inactive == true && approverName == currentUser){
				var approveButton	= form.addButton({ id : 'custpage_approve', label : 'Approve', functionName : "window.open('" + approveURLParam + "');"});
				var rejectButton	= form.addButton({ id : 'custpage_reject', label : 'Reject', functionName : "window.open('" + rejectURLParam + "');"});
				
			}
			if(appStatus == 1 && inactive == true){
				var sendNotification= form.addButton({ id : 'custpage_reject', label : 'Send Notification', functionName : 'buttonclick('+recId+',"'+recType+'");'});
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
		var userObj				= runtime.getCurrentUser();
		var userId				= userObj.id; 
		var suiteletURL			= '';
		var appProcessApplicable= '';
		var approverId			= '';
		var approverNm			= '';
		var isEmailAppRequired	= '';
		var recordName			= '';
		
		if(context.type == context.UserEventType.CREATE){
			var recLoad				= record.load({type : recType, id : recId});
			var checkInactive 		= recLoad.getValue({fieldId : 'isinactive'});
			var suiteletURL = url.resolveScript({ scriptId : 'customscript_yil_master_sl', deploymentId : 'customdeploy_yil_master_contro_sl', returnExternalUrl: true, params: {recordType : recType}});
			//var recLoad		= record.load({type : recType, id : recId});
			
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
			}
			else if(recType == 'itemgroup'){
				
				var customrecordyil_master_controller_matrixSearchObj = fetchMatrix("Item");
				
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
				
				var customrecordyil_master_controller_matrixSearchObj = fetchMatrix("Customer");
				
				var searchResultCount = customrecordyil_master_controller_matrixSearchObj.runPaged().count;
				log.debug("customrecordyil_master_controller_matrixSearchObj result count",searchResultCount);
				customrecordyil_master_controller_matrixSearchObj.run().each(function(result){
					appProcessApplicable= result.getValue({name : 'custrecord_yil_mcm_is_aprv_appl'});
					approverId			= result.getValue({name : 'custrecord_yil_mcm_approver'});
					approverNm			= result.getText({name : 'custrecord_yil_mcm_approver'});
					isEmailAppRequired	= result.getValue({name : 'custrecord_yil_mcm_email_aprvl_requrd'});
					
				});
			}
			
			if(appProcessApplicable == true && recType == 'itemgroup'){
				recLoad.setValue({fieldId : 'isinactive', value : true})
				recLoad.setValue({fieldId : 'custitem_yil_mcm_approval_status', value : 1});
				recLoad.setValue({fieldId : 'custitem_yil_mcm_approver', value : approverId});
				
				var approvalStatus		= recLoad.getValue({fieldId : 'custitem_yil_mcm_approval_status'});
				var approverName		= recLoad.getValue({fieldId : 'custitem_yil_mcm_approver'});
				if(recType){
					itemApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus);
				}
			}
			else if((appProcessApplicable == true && recType == 'customer') || (appProcessApplicable == true && recType == 'vendor')){
				log.debug('recType',recType);
				recLoad.setValue({fieldId : 'isinactive', value : true})
				recLoad.setValue({fieldId : 'custentity_yil_mcm_approval_status', value : 1});
				recLoad.setValue({fieldId : 'custentity_yil_mcm_approver', value : approverId});
				
				var approvalStatus		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approval_status'});
				var approverName		= recLoad.getValue({fieldId : 'custentity_yil_mcm_approver'});
				
				if(recLoad && recType == 'customer'){
					customerApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus);
					log.debug('inside if condition suiteletURL',suiteletURL);
                }
				else if(recLoad && recType == 'vendor'){
					vendorApprovalEmailTemplate(recLoad, approverId, approverNm, isEmailAppRequired, suiteletURL, recId, approvalStatus);
				}
			}
			else{
				recLoad.setValue({fieldId : 'custentity_yil_mcm_approval_status', value : 2});				
			}
			
			
		}
		if(context.type == context.UserEventType.EDIT){
			//log.debug('checkInactive',checkInactive);
			if(checkInactive == false) {
				recLoad.setValue({fieldId : 'custentity_yil_mcm_approval_status', value : 2});
			}
			
		}
		recLoad.save();
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