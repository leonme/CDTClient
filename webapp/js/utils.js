var oBundle = getMessageBundle();
var _DELETE = 3;
var _NO_CHANGE_=0;
var _NEW = 1;
var _CHANGE = 2;
var baseUrl = "http://localhost:8080";

function getBaseUrl(){
    return baseUrl;
}
function getMessageBundle(){
    var locale = sap.ui.getCore().getConfiguration().getLocale().getLanguage();
    jQuery.sap.require("jquery.sap.resources");
    var oBundle = jQuery.sap.resources({url : "i18n/i18n.properties", locale: locale});
    return oBundle;
}

function isObjectNotNull (object) {
    if (object !== undefined && object != null && object !== "")
        return true;

    return false;
}

function getServiceResponse(strUrl) {
	var result = '';

    sap.ui.core.BusyIndicator.show(0);
	var request = $.ajax({
        type : 'GET',
        dataType : 'text',
        url : strUrl,
		async : false
    });
	request.done(function(data, textStatus, xmlhttprequest) {
		result = xmlhttprequest.responseText;
	});
	request.fail(
			function(jqXHR, textStatus) {
				if(jqXHR.status == 500) {
					var messageText = jqXHR.responseText;
					return;
				}
			});

    sap.ui.core.BusyIndicator.hide();
	return result;
}

function getServiceResult(strUrl) {
    var result = '';

    sap.ui.core.BusyIndicator.show(0);
    var request = $.ajax({
        type : 'GET',
        dataType : 'text',
        url : strUrl,
        async : false
    });
    request.done(function(data, textStatus, xmlhttprequest) {
        result = data;
    });
    request.fail(
        function(jqXHR, textStatus) {
            if(jqXHR.status == 500) {
                var messageText = jqXHR.responseText;
                return;
            }
        });

    sap.ui.core.BusyIndicator.hide();
    return result;
}



