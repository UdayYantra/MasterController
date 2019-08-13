/*
 * Script: USER EVENT SCRIPT
 * Script File Name: SOmaiya_UE_AmtInWords.js
 *
 *
 */

function Amount_In_Words(type, name) {
	try {
      //var recObj = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
        var total = nlapiGetFieldValue('total');
        var currencyId = nlapiGetFieldValue('currency');
        var ISOCode = nlapiGetFieldValue('currencysymbol');
      
		//var recObj = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
		//var total = recObj.getFieldValue('total');
		//var currencyId = recObj.getFieldValue('currency');
		//var ISOCode = recObj.getFieldValue('currencysymbol');

		var amtInWordsText = getAmtInWords(total, currencyId, ISOCode);

		nlapiLogExecution('debug', 'amtInWordsText', amtInWordsText);

		nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custbody_total_amount', amtInWordsText);
	} catch (e) {
		nlapiLogExecution('DEBUG', e.getCode(), e.getDetails());

	}
}

//*******************************************Start Convert Amount in Words*******************************************

function getAmtInWords(total, currencyId, ISOCode) {
	var data = total.toString().split(".");
	//nlapiLogExecution('DEBUG','results','data ='+data[0]);

	var str = "";
	var str1 = "";
	var word = "";

	if (currencyId == 1 && ISOCode == 'INR') //If currency is Indian Rupee & ISOCode is PKR
	{
		//Above Line Commented on 10th May 2017 as Decision took by Kiran Sir while Execution PDF is Going on After Visions Feedback on PDF.
		str = "	Indian Rupees " + convert_number(data[0]) + " Only";
		if (Number(data[1]) > 0) {
			str1 = " and Paise " + convert_number(data[1]) + " Only";
		}
	} else if (currencyId == 2 && ISOCode == 'USD') //If currency is US Dollar & ISOCode is USD
	{
		str = "US Dollars " + convert_number(data[0]) + " Only";
		if (Number(data[1]) > 0) {
			str1 = " and Cents " + convert_number(data[1]) + " Only";
		}
	} else if (currencyId == 3 && ISOCode == 'CAD') // If currency is Canadian Dollar & ISOCode is CAD
	{
		str = "Canadian Dollars " + convert_number(data[0]) + " Only";
		if (Number(data[1]) > 0) {
			str1 = " and Cents " + convert_number(data[1]) + " Only";
		}
	} else if (currencyId == 4 && ISOCode == 'EUR') //If currency is Euro & ISOCode is EUR
	{
		str = "Euros " + convert_number(data[0]) + " Only";
		if (Number(data[1]) > 0) {
			str1 = " and Cents " + convert_number(data[1]) + " Only";
		}
	} else if (currencyId == 5 && ISOCode == 'GBP') //If currency is British pound & ISOCode is GBP
	{
		str = "British Pounds " + convert_number(data[0]) + " Only";
		if (Number(data[1]) > 0) {
			str1 = " and Pence " + convert_number(data[1]) + " Only";
		}
	} else if (currencyId == 6 && ISOCode == 'SGD') //If currency is Singapore Dollar & ISOCode is SGD
	{
		str = "Singapore Dollars " + convert_number(data[0]) + " Only";
		if (Number(data[1]) > 0) {
			str1 = " and Cents " + convert_number(data[1]) + " Only";
		}
	}

	word = str + str1;

	nlapiLogExecution('Debug', 'word==>>', word);
	return word;
} //function getAmtInWords(total, currencyId, ISOCode)

function convert_number(number) {
	if ((number < 0) || (number > 999999999)) {
		return "Number is out of range";
	} //if ((number < 0) || (number > 999999999))

	var Gn = Math.floor(number / 10000000); /* Crore */
	number -= Gn * 10000000;
	var kn = Math.floor(number / 100000); /* lakhs */
	number -= kn * 100000;
	var Hn = Math.floor(number / 1000); /* thousand */
	number -= Hn * 1000;
	var Dn = Math.floor(number / 100); /* Tens (deca) */
	number = number % 100; /* Ones */
	var tn = Math.floor(number / 10);
	var one = Math.floor(number % 10);
	var res = "";

	if (Gn > 0) {
		res += (convert_number(Gn) + " Crore");
	}
	if (kn > 0) {
		res += (((res == "") ? "" : " ") +
			convert_number(kn) + " Lakhs");
	}
	if (Hn > 0) {
		res += (((res == "") ? "" : " ") +
			convert_number(Hn) + " Thousand");
	}
	if (Dn) {
		res += (((res == "") ? "" : " ") +
			convert_number(Dn) + " Hundred");
	}

	var ones = Array("", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen");
	var tens = Array("", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety");

	if (tn > 0 || one > 0) {
		if (!(res == "")) {
			//res += " and ";
			res += " ";
		}
		if (tn < 2) {
			res += ones[tn * 10 + one];
		} else {
			res += tens[tn];
			if (one > 0) {
				res += ("-" + ones[one]);
			}
		}
	} //if (tn>0 || one>0)

	if (res == "") {
		res = "zero";
	}
	return res;
} //function convert_number(number)