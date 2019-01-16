window.authorize = function authorize() {
	"use strict";
	//Gets the Authorization Code
	var code = window.getURLParameter("code");
	var state = window.getURLParameter("state");

	if(typeof code !== "undefined") {
		if(typeof state !== "undefined") {
			//Redirecting to Authorization URL
			var redirercturl=window.location.protocol+"//"+window.location.hostname+":"+window.location.port+"/index.html?homeModule=account-aggregation&homeComponent=aggregate-register-accounts&state="+state+"&code="+code;
			location.href = redirercturl;
		}
	}
};
//Helper function to get URL Parameter
window.getURLParameter = function getURLParameter(sParam) {
	"use strict";
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split("&");
    for (var i = 0; i < sURLVariables.length; i++) {

        var sParameterName = sURLVariables[i].split("=");

        if (sParameterName[0] === sParam) {
            return sParameterName[1];
        }
    }
};