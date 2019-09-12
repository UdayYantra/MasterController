/**
 * @NApiVersion 2.x
 * @NScriptType Scheduledscript
*/
define(['N/record','N/runtime','N/search','N/task','N/log','N/email'], function(record, runtime, search, task, log, email){
	function execute(context)
	{
		var	flagval		= '';
		
		var yilMasterControllerFilter	= [];
		var yilMasterControllerColumn	= [];
		
		var scriptObj		= runtime.getCurrentScript();
		var scriptIDVal		= scriptObj.id;
		var deploymentIDCVal= scriptObj.deploymentId;
			
        flagVal = scriptObj.getParameter({name: 'custscript_yil_flag_value'});
		//log.debug({title :'Last Id Used flagVal',details: flagVal});
		if(flagVal){
			yilMasterControllerFilter.push(search.createFilter({ name: "internalidnumber", operator: search.Operator.GREATERTHAN, values: flagVal}));
		}
		
			yilMasterControllerFilter.push(search.createFilter({ name: 'custrecord_yil_mcm_is_aprv_appl', operator: search.Operator.IS, values: true}));
			yilMasterControllerColumn.push(search.createColumn({ name: 'internalid', sort: search.Sort.ASC}));
            yilMasterControllerColumn.push(search.createColumn({ name: 'custrecord_yil_mcm_master_type'}));
			
			var searchObj	= search.create({ type: 'customrecord_yil_master_contro_matrix', columns : yilMasterControllerColumn, filters: yilMasterControllerFilter});
			
			var count = searchObj.runPaged().count;
			//log.debug({title: "Search Count",details: count});
			
			var internalIdVal	= '';
			searchObj.run().each(function(result){
				internalIdVal	= result.getValue({name: 'internalid'});
				var masterType	= result.getValue({name: 'custrecord_yil_mcm_master_type'});
				var masterName	= result.getText({name: 'custrecord_yil_mcm_master_type'});
				log.debug({title: "After Search Function masterName", details: masterName});
				_sendEmailNotificationPerMasterRecord(masterType, masterName);
			});
			
			if(Number(count) > 1 && internalIdVal){
				var taskObj	= task.create({taskType: task.TaskType.SCHEDULED_SCRIPT, scriptId : scriptIDVal, deploymentId : deploymentIDCVal, params: {custscript_yil_flag_value: internalIdVal}});
				taskObj.submit();
			}
	}
	
	function _sendEmailNotificationPerMasterRecord(masterType, masterName){
		var yilVendorMasterFilter	= [];
		var yilVendorMasterColumn	= [];
		var yilCustomerMasterFilter	= [];
		var yilCustomerMasterColumn	= [];
		var yilItemMasterFilter		= [];
		var yilItemMasterColumn		= [];
		var vendorName				= '';
		var approverNm				= '';
		var approverId				= '';
		var customerName			= '';
		var itemName				= '';
		var subsidiaryNm			= '';
		var masterArray				= [];
		var approverNmArray			= [];
		var approverIdArray			= [];
		var subsidiaryArray			= [];
		var emailBodyTable			= [];
        var rowLength				= [];
		var rowString				= "";
		
		if(masterType == 2){
			yilVendorMasterFilter.push(search.createFilter({ name: 'custentity_yil_mcm_approval_status', operator: search.Operator.ANYOF, values: 1}));
			yilVendorMasterFilter.push(search.createFilter({ name: 'isinactive', operator: search.Operator.IS, values: true}));
			yilVendorMasterColumn.push(search.createColumn({ name: 'entityid'}));
			yilVendorMasterColumn.push(search.createColumn({ name: 'custentity_yil_mcm_approver'}));
			yilVendorMasterColumn.push(search.createColumn({ name: 'subsidiary'}));
			
			var vendorSearchObj		= search.create({ type:	'vendor', filters: yilVendorMasterFilter, columns: yilVendorMasterColumn});
			var vendorSearchCount	= vendorSearchObj.runPaged().count;
			log.debug({title: "vendorSearchCount", details: vendorSearchCount});
			
			if(Number(vendorSearchCount) > 0){
					var emailObj ={
						approverIdArray: [],
						approverNmArray: [],
						emailBodyTable: [],
						rowLength: []
					};
					vendorSearchObj.run().each(function(result){
					vendorName			= result.getValue({ name: 'entityid'});
					approverId			= result.getValue({ name: 'custentity_yil_mcm_approver'});
					approverNm			= result.getText({ name: 'custentity_yil_mcm_approver'});
					subsidiaryNm		= result.getText({ name: 'subsidiary'});
					masterArray.push(vendorName);
					approverNmArray.push(approverNm);
					approverIdArray.push(approverId);
					subsidiaryArray.push(subsidiaryNm);
				
					if(emailObj.approverIdArray.length == 0){
						emailObj.approverIdArray.push(approverId);
						emailObj.approverNmArray.push(approverNm);
						emailObj.rowLength.push([1]);
						rowString = "<tr>";
							rowString += "<td>1</td><td>"+vendorName+"</td><td>"+subsidiaryNm+"</td></br>";
						rowString += "</br></tr>";
						emailObj.emailBodyTable.push(rowString);
					}
					else{
						if(emailObj.approverIdArray.indexOf(approverId) < 0){
							emailObj.approverIdArray.push(approverId);
							emailObj.approverNmArray.push(approverNm);
							emailObj.rowLength.push([1]);
							rowString = "<tr>";
								rowString += "<td>1</td><td>"+vendorName+"</td><td>"+subsidiaryNm+"</td><br>";
							rowString += "</br></tr>";
							emailObj.emailBodyTable.push(rowString);
						}
						else{
							var index = emailObj.approverIdArray.indexOf(approverId);
							var rowLen = emailObj.rowLength[index].length;
							rowLen++;
							rowString = "<tr>";
								rowString += "<td>"+rowLen+"</td><td>"+vendorName+"</td><td>"+subsidiaryNm+"</td></br>";
							rowString += "</br></tr>";
							emailObj.rowLength[index].push(rowLen);
							emailObj.emailBodyTable[index] = emailObj.emailBodyTable[index] + rowString;
						}
					}				
					return true;
				});
				if(emailObj.approverIdArray.length > 0){

						for(var e=0;e<emailObj.approverIdArray.length;e++){
							_sendEmail(emailObj.approverIdArray[e], emailObj.approverNmArray[e], emailObj.emailBodyTable[e], emailObj.rowLength[e].length, masterName);
						}
				}
			}
	    }
		else if(masterType == 1){
			yilCustomerMasterFilter.push(search.createFilter({ name: 'custentity_yil_mcm_approval_status', operator: search.Operator.ANYOF, values: 1}));
			yilCustomerMasterFilter.push(search.createFilter({ name: 'isinactive', operator: search.Operator.IS, values: true}));
			yilCustomerMasterColumn.push(search.createColumn({ name: 'entityid'}));
			yilCustomerMasterColumn.push(search.createColumn({ name: 'custentity_yil_mcm_approver'}));
			yilCustomerMasterColumn.push(search.createColumn({ name: 'subsidiary'}));
			
			var customerSearchObj = search.create({ type: 'customer', filters: yilCustomerMasterFilter, columns: yilCustomerMasterColumn});
			var customerSearchCount	= customerSearchObj.runPaged().count;
			//log.debug({title: "customerSearchCount", details: customerSearchCount});
			
			if(Number(customerSearchCount) > 0){
				var emailObj = {
					approverIdArray: [],
					approverNmArray: [],
					emailBodyTable: [],
					rowLength: []
				};
				
				customerSearchObj.run().each(function(result){
					customerName		= result.getValue({ name: 'entityid'});
					approverId			= result.getValue({ name: 'custentity_yil_mcm_approver'});
					approverNm			= result.getText({ name: 'custentity_yil_mcm_approver'});
					subsidiaryNm		= result.getText({ name: 'subsidiary'});
					masterArray.push(customerName);
					approverIdArray.push(approverId);
					approverNmArray.push(approverNm);
					subsidiaryArray.push(subsidiaryNm);
					
					if(emailObj.approverIdArray.length == 0){
						emailObj.approverIdArray.push(approverId);
						emailObj.approverNmArray.push(approverNm);
						emailObj.rowLength.push([1]);
						rowString = "<tr>";
							rowString += "<td>1</td><td>"+customerName+"</td><td>"+subsidiaryNm+"</td></br>";
						rowString += "</br></tr>";
						emailObj.emailBodyTable.push(rowString);
					}
					else{
						if(emailObj.approverIdArray.indexOf(approverId) < 0){
							emailObj.approverIdArray.push(approverId);
							emailObj.approverNmArray.push(approverNm);
							emailObj.rowLength.push([1]);
							rowString = "<tr>";
								rowString += "<td>1</td><td>"+customerName+"</td><td>"+subsidiaryNm+"</td></br>";
							rowString += "</br></tr>";
							emailObj.emailBodyTable.push(rowString);
						}
						else{
							var index = emailObj.approverIdArray.indexOf(approverId);
							var rowLen = emailObj.rowLength[index].length;
							rowLen++;
							rowString = "<tr>";
								rowString += "<td>"+rowLen+"</td><td>"+customerName+"</td><td>"+subsidiaryNm+"</td></br>";
							rowString += "</br></tr>";
							emailObj.rowLength[index].push(rowLen);
							emailObj.emailBodyTable[index] = emailObj.emailBodyTable[index] + rowString;
							
						}
					}				
					return true;
				});
				if(emailObj.approverIdArray.length > 0){

						for(var e=0;e<emailObj.approverIdArray.length;e++){
							_sendEmail(emailObj.approverIdArray[e], emailObj.approverNmArray[e], emailObj.emailBodyTable[e], emailObj.rowLength[e].length, masterName);
						}
				}
			}
		}
		else if(masterType == 3){
			yilItemMasterFilter.push(search.createFilter({ name: 'custitem_yil_mcm_approval_status', operator: search.Operator.ANYOF, values: 1}));
			yilItemMasterFilter.push(search.createFilter({ name: 'isinactive', operator: search.Operator.IS, values: true}));
			yilItemMasterColumn.push(search.createColumn({ name: 'itemid'}));
			yilItemMasterColumn.push(search.createColumn({ name: 'custitem_yil_mcm_approver'}));
			yilItemMasterColumn.push(search.createColumn({ name: 'subsidiary'}));
			
			var itemSearchObj = search.create({ type: 'item', filters: yilItemMasterFilter, columns: yilItemMasterColumn});
			var itemSearchCount	= itemSearchObj.runPaged().count;
			//log.debug({title: "itemSearchCount", details: itemSearchCount});
			
			if(Number(itemSearchCount) > 0){
				var emailObj = {
                    approverIdArray: [],
					approverNmArray: [],
                    emailBodyTable: [],
                    rowLength: []
				};
			
				itemSearchObj.run().each(function(result){
					itemName		= result.getValue({ name: 'itemid'});
					approverId		= result.getValue({ name: 'custitem_yil_mcm_approver'});
					approverNm		= result.getText({ name: 'custitem_yil_mcm_approver'});
					subsidiaryNm	= result.getText({ name: 'subsidiary'});
					masterArray.push(itemName);
					approverNmArray.push(approverNm);
					approverIdArray.push(approverId);
					subsidiaryArray.push(subsidiaryNm);
					
					if(emailObj.approverIdArray.length == 0){
						emailObj.approverIdArray.push(approverId);
						emailObj.approverNmArray.push(approverNm);
						emailObj.rowLength.push([1]);
						rowString = "<tr>";
							rowString += "<td>1</td><td>"+itemName+"</td><td>"+subsidiaryNm+"</td></br>";
						rowString += "</br></tr>";
						emailObj.emailBodyTable.push(rowString);
					}
					else{
						if(emailObj.approverIdArray.indexOf(approverId) < 0){
							emailObj.approverIdArray.push(approverId);
							emailObj.approverNmArray.push(approverNm);
							emailObj.rowLength.push([1]);
							rowString = "<tr>";
								rowString += "<td>1</td><td>"+itemName+"</td><td>"+subsidiaryNm+"</td></br>";
							rowString += "</br></tr>";
							emailObj.emailBodyTable.push(rowString);
						}
						else{
							var index = emailObj.approverIdArray.indexOf(approverId);
							var rowLen = emailObj.rowLength[index].length;
							rowLen++;
							rowString = "<tr>";
								rowString += "<td>"+rowLen+"</td><td>"+itemName+"</td><td>"+subsidiaryNm+"</td></br>";
							rowString += "</br></tr>";
							emailObj.rowLength[index].push(rowLen);
							emailObj.emailBodyTable[index] = emailObj.emailBodyTable[index] + rowString;
						}
					}
					return true;
				});
				if(emailObj.approverIdArray.length > 0){

						for(var e=0;e<emailObj.approverIdArray.length;e++){
							_sendEmail(emailObj.approverIdArray[e], emailObj.approverNmArray[e], emailObj.emailBodyTable[e], emailObj.rowLength[e].length, masterName);
						}
				}
			}
		}
		log.debug({title: "emailObj", details: emailObj});
		log.debug({title: "masterArray", details: masterArray});
		log.debug({title: "approverIdArray", details: approverIdArray});
		log.debug({title: "subsidiaryArray", details: subsidiaryArray});
	}
	
	function _sendEmail(approverIdArray, approverNmArray, emailBodyTable, rowLength, masterName)
	{
	try{
		var scriptObj	= runtime.getCurrentScript();
		var authorID	= scriptObj.getParameter({name: "custscript_yil_master_controller_em_auth"});
		
		if(!approverNmArray){
            approverNmArray = "User";
        }
		if(Number(rowLength) > 1){
            rowLength = "are " + rowLength;
        }
        else{
            rowLength = "is " + rowLength;
        }
		
		log.debug({ title: "approverNmArray", details: approverNmArray});
		log.debug({ title: "emailBodyTable", details: emailBodyTable});
		log.debug({ title: "approverIdArray", details: approverIdArray});
		log.debug({ title: "masterName", details: masterName});
		
		var subjectText = "Pending "+masterName+" Approval Notification: "+masterName+"(s) pending for your approval."
        var bodyString = "";
        bodyString += "<html>";
            bodyString += "<body>";
            bodyString += "Dear "+approverNmArray+",";
                bodyString += "<br/><br/>";
                bodyString += "This is to bring to your notice that there " +rowLength+" "+masterName+" pending for your Approval.";
                bodyString += "<table border= '1' cellspacing='0' cellpadding='5'>";
                bodyString += "<tr><th><center><b>Sr. No.</b></center></th><th><center><b>"+masterName+" Name</b></center></th><th><center><b>Subsidiary</b></center></th></tr>";
                bodyString += emailBodyTable;
                bodyString += "<br/><br/>";
                bodyString += "Thank you<br/>Admin.";
            bodyString += "</body>";
        bodyString += "</html>";
       
        var sendEmailObj = email.send({
            author: authorID,
            recipients: approverIdArray,
            subject:  subjectText,
            body: bodyString
        });
	    log.debug({ title: "sendEmailObj", details: sendEmailObj});
		log.debug({ title: "bodyString", details: bodyString });
	}
		catch(ex){
        	log.debug({
                title: '_sendEmail',
                details: JSON.stringify(ex)
            });

        }
	}
	
	
	return{
		execute : execute
	}
});
