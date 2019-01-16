define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var AmendLetterOfCreditModel = function() {
    var baseService = BaseService.getInstance();
    var Model = function() {
      this.AmendedLCDetails = {
        "id": null,
        "lcId": null,
        "issueDate": null,
        "newExpiryDate": null,
        "counterPartyName": null,
        "versionNo": null,
        "newAmount": {
          "currency": null,
          "amount": null
        },
        "partyId": {
          "displayValue": null,
          "value": null
        },
        "eventDate": null,
        "eventDescription": null,
        "amendmentDate": null,
        "percCreditAmount": null,
        "toleranceType": null,
        "toleranceUnder": null,
        "toleranceAbove": null,
        "additionalAmountCovered": null,
        "narrative": null,
        "shipmentDetails": {
          "date": null,
          "description": null,
          "destination": null,
          "dischargePort": null,
          "goodsCode": null,
          "id": null,
          "loadingPort": null,
          "partial": false,
          "period": null,
          "source": null,
          "transShipment": false
        },
        "goods":[]
      };

    };
    var fetchBranchDateDeferred, fetchBranchDate = function(code, deferred) {
      var options = {
          url: "branchdate/{branchCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          "branchCode": code
        };
      baseService.fetch(options, params);
    };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      fetchBranchDate: function(code) {
        fetchBranchDateDeferred = $.Deferred();
        fetchBranchDate(code, fetchBranchDateDeferred);
        return fetchBranchDateDeferred;
      }
    };
  };
  return new AmendLetterOfCreditModel();
});
