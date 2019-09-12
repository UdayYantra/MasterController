/**
 * @NAPiVersion 2.x
 * @NScriptType Suitelet
 */
  /*************************************************************
 * File Header
 * Script Type	: SuiteLet
 * Script Name	: YIL Master Controller SL
 * File Name	: YIL_Master_Controller_SL.js
 * Created On	: 01/08/2019
 * Modified On	: 06/08/019
 * Created By	: Siddhant Mishra (Yantra Inc.)
 * Modified By	: Siddhant Mishra (Yantra Inc.)
 * Description	: The code creates Email on approve and reject button click, 
                  and also set some in record.	   
 ************************************************************/


define(['N/record', 'N/encode', "N/ui/serverWidget", "N/error"], function(record, encode, ui, error) {


    function onRequest(context) {

        log.debug({title:"Reached Here", details: "Reached Here"});
        
        var requestObj = context.request;

        if(requestObj.method == "GET") {
            
            var processFlag = requestObj.parameters['processFlag'];
            var recordId = requestObj.parameters['recId'];
			var fromRec	= requestObj.parameters['ir'];
			var recordType = requestObj.parameters['recType'];
			log.debug('recordType',recordType);
            var approStatus = requestObj.parameters['sts'];
            var appId = requestObj.parameters['aprid'];
            //log.debug('recordId',recordId);
			
            if(!recordId || !approStatus || !appId) {
                error.create({name: "MISSING PARAMETERS", message: "You are missing required parameters to proceed. Please contact your administrator for more details."});
            }
            var form = ui.createForm({title: ' ', hideNavBar: true});
            var msgFld = form.addField({id: 'custpage_message', type: ui.FieldType.INLINEHTML, label: ' '});
            var defaultText = '';
            
			log.debug({title:"recordId", details: recordId});
			log.debug({title:"approStatus" ,details: approStatus});
			log.debug({title:"appId", details: appId});
									
			var custRecId		= getDecodedValue(recordId);
			var approvalStatus	= approStatus;
			var custRecType		= getDecodedValue(recordType);
			var approverId		= getDecodedValue(appId);
					
			//log.debug({title: "custRecId", details: custRecId});
			//log.debug({title: "approvalStatus", details: approvalStatus});
			//log.debug({title: "approverId", details: approverId});
					
            var recApprovalStatus = '';

            if(custRecId && approvalStatus) {
                var recObj = record.load({type: custRecType, id: custRecId});
				if(custRecType == 'customer' || custRecType == 'vendor'){
					recApprovalStatus = recObj.getValue({fieldId: 'custentity_yil_mcm_approval_status'});
				}
				else
					recApprovalStatus = recObj.getValue({fieldId: 'custitem_yil_mcm_approval_status'});
			}
			if(recApprovalStatus == 1 && processFlag == "a") {
				recObj.setValue({fieldId : 'isinactive', value : false});
				if(custRecType == 'customer' || custRecType == 'vendor'){
					recObj.setValue({fieldId : 'custentity_yil_mcm_approval_status', value : 2});
					recObj.setValue({fieldId : 'custentity_yil_mcm_approver', value : approverId});
					recObj.save();
				}
				else{
					recObj.setValue({fieldId : 'custitem_yil_mcm_approval_status', value : 2});
					recObj.setValue({fieldId : 'custitem_yil_mcm_approver', value : approverId});
					recObj.save();
                }
                defaultText = '<center><font size="5" face="arial">You have approved the Record. Thank you.</font></center>';
				if(custRecType == 'customer' && fromRec){
					defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/entity/custjob.nl?id='+custRecId+'">Go Back</a></font></center>';
				}
				else if(custRecType == 'vendor' && fromRec) {
					defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/entity/vendor.nl?id='+custRecId+'">Go Back</a></font></center>';
				}
				else if(fromRec) {
					defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/item/item.nl?id='+custRecId+'">Go Back</a></font></center>';
				}
                msgFld.defaultValue = defaultText;
                log.debug({title: 'Approval Process', details: 'Approved'});
				
            }
            else if(recApprovalStatus == 2 && processFlag == "a"){
				defaultText = '<center><font size="5" face="arial">Record is already approved. Thank you.</font></center>';
				if(custRecType == 'customer' && fromRec){
					defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/entity/custjob.nl?id='+custRecId+'">Go Back</a></font></center>';
				}
				else if(custRecType == 'vendor' && fromRec){
					defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/entity/vendor.nl?id='+custRecId+'">Go Back</a></font></center>';
				}
				else if(fromRec){
					defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/item/item.nl?id='+custRecId+'">Go Back</a></font></center>';
				}
				msgFld.defaultValue = defaultText;
				log.debug({title: "Already Approved", details: 'Already Approved'})
			}
			else if(recApprovalStatus == 3 && processFlag == "a"){
				defaultText = '<center><font size="5" face="arial">Record is already rejected. Thank you.</font></center>';
				if(custRecType == 'customer' && fromRec){
					log.debug({title: "fromRec", details:fromRec});
					defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/entity/custjob.nl?id='+custRecId+'">Go Back</a></font></center>';
				}
				else if(custRecType == 'vendor' && fromRec){
					defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/entity/vendor.nl?id='+custRecId+'">Go Back</a></font></center>';
				}
				else if(fromRec){
					defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/item/item.nl?id='+custRecId+'">Go Back</a></font></center>';
				}
				msgFld.defaultValue = defaultText;
				log.debug({title: "Already rejected", details: 'Already rejected'})
			}
			
            else if(recApprovalStatus && processFlag == "r") {
                if(Number(recApprovalStatus) == Number(approvalStatus)) {
                    //set checkbox
					log.debug('ScustRecId',custRecId);
                    var reasonField = form.addField({id: 'custpage_reason', type: ui.FieldType.TEXTAREA, label: 'Rejection Reason'});
                    reasonField.isMandatory = true;
            
                    var requestIdField      = form.addField({id: 'custpage_rec_id', type: ui.FieldType.SELECT, label: 'Record Id', source: 'transaction'});
					var requestTypeField    = form.addField({id: 'custpage_type_id', type: ui.FieldType.TEXT, label: 'Record Type'});
                    var approverIdField     = form.addField({id: 'custpage_apr_id', type: ui.FieldType.SELECT, label: 'Approver Id', source: 'employee'});
                    var fromRecField		= form.addField({id: 'custpage_frm_id', type: ui.FieldType.TEXT, label: 'From Record'});	
                    
					requestIdField.defaultValue = custRecId;
					requestTypeField.defaultValue = custRecType;
                    approverIdField.defaultValue = approverId;
                    fromRecField.defaultValue = fromRec;
					
                    requestIdField.updateDisplayType({displayType: ui.FieldDisplayType.HIDDEN});
					requestTypeField.updateDisplayType({displayType: ui.FieldDisplayType.HIDDEN});
                    approverIdField.updateDisplayType({displayType: ui.FieldDisplayType.HIDDEN});
					fromRecField.updateDisplayType({displayType: ui.FieldDisplayType.HIDDEN});
					
                    form.addSubmitButton({label: 'Confirm Reject'});

                }
                else if(Number(recApprovalStatus) == Number(3)) {
                    //already rejected
                    defaultText = '<center><font size="5" face="arial">This Record is already rejected. Thank you.</font></center>';
					if(custRecType == 'customer' && fromRec){
						defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/entity/custjob.nl?id='+custRecId+'">Go Back</a></font></center>';
					}
					else if(custRecType == 'vendor' && fromRec){
						defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/entity/vendor.nl?id='+custRecId+'">Go Back</a></font></center>';
					}
					else if(fromRec){
						defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/item/item.nl?id='+custRecId+'">Go Back</a></font></center>';
					}
                    msgFld.defaultValue = defaultText;
                    log.debug({title: 'Rejection Process', details: 'Already Rejected'});
                }
                else {
                    //already approved
                    defaultText = '<center><font size="5" face="arial">This Record is already approved. Thank you.</font></center>';
					if(custRecType == 'customer' && fromRec){
						defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/entity/custjob.nl?id='+custRecId+'">Go Back</a></font></center>';
					}
					else if(custRecType == 'vendor' && fromRec){
						defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/entity/vendor.nl?id='+custRecId+'">Go Back</a></font></center>';
					}
					else if(fromRec){
						defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/item/item.nl?id='+custRecId+'">Go Back</a></font></center>';
					}
                    msgFld.defaultValue = defaultText;
                    log.debug({title: 'Rejection Process', details: 'Already Approved'});
                }
            }
    
            context.response.writePage(form);
            log.debug({title: 'Finished', details: 'Finished'});
        }
        else {
			var custRecField	= requestObj.parameters['custpage_frm_id'];
            var custRecId		= requestObj.parameters['custpage_rec_id'];
			var custRecType		= requestObj.parameters['custpage_type_id'];
			log.debug('VcustRecId',custRecId);
			log.debug('VcustRecTytpe',custRecType);
            var rejText = requestObj.parameters['custpage_reason'];
           // var approverId = requestObj.parameters['custpage_apr_id'];
            
            var form = ui.createForm({title: ' ', hideNavBar: true});
            var msgFld = form.addField({id: 'custpage_message', type: ui.FieldType.INLINEHTML, label: ' '});
            var defaultText = '';

            log.debug({title: 'rejText', details: rejText});
            //log.debug({title: 'recId', details: recId});

            if(custRecId && rejText) {
                var recObj = record.load({type: custRecType, id: custRecId});
                var recApprovalStatus = recObj.getValue({fieldId: 'custentity_yil_mcm_approval_status'});
                var approverFieldText = '';
                recObj.setValue({fieldId : 'isinactive', value : true});
				if()
				if(custRecType == 'customer' || custRecType == 'vendor'){
					recObj.setValue({fieldId : 'custentity_yil_mcm_approval_status', value : 3});
					recObj.setValue({fieldId : 'custentity_yil_mcm_rejection_reason', value: rejText});
					recObj.save();
				}
				else{
					recObj.setValue({fieldId : 'custitem_yil_mcm_approval_status', value : 3});
					recObj.setValue({fieldId : 'custitem_yil_mcm_rejection_reason', value: rejText});
					recObj.save();
                }
                defaultText = '<center><font size="5" face="arial">You have rejected the Record. Thank you.</font></center>';
				if(custRecType == 'customer' && custRecField == 'T'){
					defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/entity/custjob.nl?id='+custRecId+'">Go Back</a></font></center>';
				}
				else if(custRecType == 'vendor' && custRecField == 'T'){
					defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/entity/vendor.nl?id='+custRecId+'">Go Back</a></font></center>';
				}
				else if(custRecField == 'T') {
					defaultText += '<center><br/><br/><font size="5" face="arial"><a href="/app/common/item/item.nl?id='+custRecId+'">Go Back</a></font></center>';
				}
                msgFld.defaultValue = defaultText;
            }

            context.response.writePage(form);

        }
    }
	
    function getDecodedValue(tempString) {
		log.debug('tempString',tempString);
        var decodedValue = encode.convert({
            string: tempString.toString(),
            inputEncoding: encode.Encoding.BASE_64_URL_SAFE,
            outputEncoding: encode.Encoding.UTF_8      
        });

        return decodedValue.toString();
    }
    return{
        onRequest: onRequest
    }

 });