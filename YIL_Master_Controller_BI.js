/**
 * @NApiVersion 2.0
 * @NScriptType BundleInstallationScript
 */
define(['N/config','N/search','N/runtime'], function(config, search, runtime) {
	function afterInstall(context) {
		var approveUrlId		= "PR Approve";
		var rejectUrlId			= "PR Reject";
		var approveFilter		= search.createFilter({name: 'name', operator: search.Operator.HASKEYWORDS, values: approveUrlId });
		var rejectFilter		= search.createFilter({name: 'name', operator: search.Operator.HASKEYWORDS, values: rejectUrlId});
		var urlColumns			= search.createColumn({name: 'url'});
		var approveSearchObj	= search.create({type: "file", filters: approveFilter, columns: urlColumns });
		var rejectSearchObj		= search.create({type: "file", filters: rejectFilter, columns: urlColumns });
		var userObj				= runtime.getCurrentUser();
		log.debug({title: "userObj", details: userObj});
		log.debug({title: "approveSearchObj", details:approveSearchObj});
		approveSearchObj.run().each(function(result){
			approveUrl	= result.getValue({name: "url"});
		});
		rejectSearchObj.run().each(function(result){
			rejectUrl	= result.getValue({name: "url"});
		});
		
		var forImage		= "&expurl=T";
		var finalApproveUrl	= approveUrl+forImage;
		var finalRejectUrl	= rejectUrl+forImage;
		
		
		var compPreferences	= config.load({type: config.Type.COMPANY_PREFERENCES});
		log.debug({title: "compPreferences", details:compPreferences});
		compPreferences.setValue({fieldId: 'custscript_yil_master_controller_app_img', value: finalApproveUrl});
		compPreferences.setValue({fieldId: 'custscript_yil_master_controller_rej_img', value: finalRejectUrl});
		//companyInfo.setValue({fieldId: 'custscript_yil_master_controller_em_auth', value: finalApproveUrl});
		var saveId = compPreferences.save({ignoreMandatoryFields: true});
	}
	return{
		afterInstall : afterInstall
	}
});