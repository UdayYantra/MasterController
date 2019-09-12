/** 
*@NApiVersion 2.x   
*@NScriptType UserEventScript
*/

define(['N/record','N/search','N/error'], function(record, search, error){
	function beforeSubmit(context){
		if(context.type == context.UserEventType.DELETE){
			throw error.create({name: 'CANT_DELETE', message: 'You can not delete this record'});
			return false;
		}
		var recId			= context.newRecord.id;
		var recType			= context.newRecord.type;
		var recordObj		= context.newRecord;
		var masterName		= recordObj.getValue({ fieldId: 'custrecord_yil_mcm_master_type'});
		var checkInactive	= '';	
		var checkInactiveColumn	= [];
		var checkInactiveFilter	= [];
		if(recId){
		checkInactiveFilter.push(search.createFilter({name: "internalId", operator: search.Operator.NONEOF, values: recId}));
		}
		checkInactiveFilter.push(search.createFilter({name: "isinactive", operator: search.Operator.IS, values: false}));
		checkInactiveFilter.push(search.createFilter({name: "custrecord_yil_mcm_master_type", operator: search.Operator.IS, values: masterName}));
		checkInactiveColumn.push(search.createColumn({name: "custrecord_yil_mcm_master_type"}));
		checkInactiveColumn.push(search.createColumn({name: "isinactive"}));

		var searchObj	= search.create({type: 'customrecord_yil_master_contro_matrix', columns : checkInactiveColumn, filters: checkInactiveFilter});
		
		var count = searchObj.runPaged().count;
		log.debug({title: "Search count", details:count});
		if(count > 0){
			log.debug({title: "masterName", details: masterName});
			throw error.create({name: 'DUBLICATE_RECORD', message: 'Record Exist in Master Controller Matrix, With the same name'});
			return false;
		}
		
	}
	
	return{
		beforeSubmit : beforeSubmit
	}
});
