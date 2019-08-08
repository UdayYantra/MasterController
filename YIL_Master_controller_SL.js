/**
 * @NAPiVersion 2.x
 * @NScriptType Suitelet
 */
 

define(['N/record', 'N/encode', "N/ui/serverWidget", "N/error"], function(record, encode, ui, error) {


    function onRequest(context) {

        log.debug({title:"Reached Here", details: "Reached Here"});
        
        var requestObj = context.request;

        if(requestObj.method == "GET") {
            
            var processFlag = requestObj.parameters['processFlag'];
            var custRecId = requestObj.parameters['recId'];
			log.debug('custRecId',custRecId);
			var custRecType = requestObj.parameters['recordType'];
			log.debug('custRecType',custRecType);
            var approvalStatus = requestObj.parameters['sts'];
            var approverId = requestObj.parameters['aprid'];
            log.debug('custRecId',custRecId);
			log.debug('approvalStatus',approvalStatus);
			log.debug('approverId',approverId);
			
            if(!custRecId || !approvalStatus || !approverId) {
                error.create({name: "MISSING PARAMETERS", message: "You are missing required parameters to proceed. Please contact your administrator for more details."});
            }
            var form = ui.createForm({title: ' ', hideNavBar: true});
            var msgFld = form.addField({id: 'custpage_message', type: ui.FieldType.INLINEHTML, label: ' '});
            var defaultText = '';
                        
		    /**var custRecId = getDecodedValue(recId);
			var custRecType = getDecodedValue(recType);
		    var approvalStatus = getDecodedValue(aprSts);
		    var approverId = getDecodedValue(aprId);
		    log.debug({title: 'poId', details: poId});
            log.debug({title: 'approvalStatus', details: approvalStatus});
            log.debug({title: 'approverId', details: approverId});*/

            var recApprovalStatus = '';

            if(custRecId && approvalStatus) {
                var recObj = record.load({type: custRecType, id: custRecId});
				if(custRecType == 'customer' || custRecType == 'vendor'){
					recApprovalStatus = recObj.getValue({fieldId: 'custentity_yil_mcm_approval_status'});
				}
				else
					recApprovalStatus = recObj.getValue({fieldId: 'custitem_yil_mcm_approval_status'});
				log.debug('recApprovalStatus',recApprovalStatus);
			}
    
            if(recApprovalStatus && processFlag == "a") {
                recObj.setValue({fieldId : 'isinactive', value : false})
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
                msgFld.defaultValue = defaultText;
                log.debug({title: 'Approval Process', details: 'Approved'});
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
                
                    requestIdField.defaultValue = custRecId;
					requestTypeField.defaultValue = custRecType;
                    approverIdField.defaultValue = approverId;
                
                    requestIdField.updateDisplayType({displayType: ui.FieldDisplayType.HIDDEN});
					requestTypeField.updateDisplayType({displayType: ui.FieldDisplayType.HIDDEN});
                    approverIdField.updateDisplayType({displayType: ui.FieldDisplayType.HIDDEN});
                
                    form.addSubmitButton({label: 'Confirm Reject'});

                }
                else if(Number(recApprovalStatus) == Number(3)) {
                    //already rejected
                    defaultText = '<center><font size="5" face="arial">This Record is already rejected. Thank you.</font></center>';
                    msgFld.defaultValue = defaultText;
                    log.debug({title: 'Rejection Process', details: 'Already Rejected'});
                }
                else {
                    //already approved
                    defaultText = '<center><font size="5" face="arial">This Record is already approved. Thank you.</font></center>';
                    msgFld.defaultValue = defaultText;
                    log.debug({title: 'Rejection Process', details: 'Already Approved'});
                }
            }
    
            context.response.writePage(form);
            log.debug({title: 'Finished', details: 'Finished'});
        }
        else {
            var custRecId = requestObj.parameters['custpage_rec_id'];
			var custRecType = requestObj.parameters['custpage_type_id'];
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
				if(custRecType == 'customer' || custRecType == 'vendor'){
					recObj.setValue({fieldId : 'custentity_yil_mcm_approval_status', value : 3});
					recObj.setValue({fieldId : 'custentity_yil_mcm_rejection_reason', value: rejText});
					recObj.save();
				}
				else
					recObj.setValue({fieldId : 'custitem_yil_mcm_approval_status', value : 3});
					recObj.setValue({fieldId : 'custitem_yil_mcm_rejection_reason', value: rejText});
					recObj.save();

                defaultText = '<center><font size="5" face="arial">You have rejected the Record. Thank you.</font></center>';
                msgFld.defaultValue = defaultText;
            }

            context.response.writePage(form);

        }
    }
    function getDecodedValue(tempString) {
		//tempString = new String(tempString);
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