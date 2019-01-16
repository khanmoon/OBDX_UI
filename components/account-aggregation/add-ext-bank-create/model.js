define([
  "jquery"
], function() {
  "use strict";
  var CreateBankModel = function() {
    var Model = function() {
        this.BankDetails = {
          "bankCode": null,
          "bankName": null,
          "url": null,
          "address": {
            "line1": null,
            "line2": null,
            "line3": null,
            "city": null,
            "state": null,
            "country": null,
            "zipCode": null
          },
          "logo": {
              "value": null,
              "maskingQualifier": null,
              "maskingAttribute": null,
              "indirectionType": null,
              "displayValue": null
          },
          "oauth_enabled":false,
          "authorizationDetail":{
            "authurl": null,
            "tokenurl":null,
            "revokeurl":null,
            "client_id":null,
            "client_secret":null,
            "externalAPIs": []
          }

        };
    };
    return {
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new CreateBankModel();
});
