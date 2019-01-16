define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var BeneficiaryDetailsModel = function() {
    var baseService = BaseService.getInstance();
    var fetchAccountDetailsDeffered, fetchAccountDetails = function(type, deffered) {
        var url;
        if (type === "accounts") {
          url = "payments/payeeGroup?expand=ALL&types=INTERNAL,INTERNATIONAL,INDIADOMESTIC,UKDOMESTIC,SEPADOMESTIC,PEERTOPEER";
        } else {
          url = "payments/payeeGroup?expand=ALL&types=DEMANDDRAFT";
        }
        var options = {
          url: url,
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getCountriesDeferred, getCountries = function(deferred) {
        var options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchAccountDetails: function(type) {
        fetchAccountDetailsDeffered = $.Deferred();
        fetchAccountDetails(type, fetchAccountDetailsDeffered);
        return fetchAccountDetailsDeffered;
      },
      getCountries: function() {
        getCountriesDeferred = $.Deferred();
        getCountries(getCountriesDeferred);
        return getCountriesDeferred;
      }
    };
  };
  return new BeneficiaryDetailsModel();
});