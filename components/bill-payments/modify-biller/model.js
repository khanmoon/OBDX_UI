define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    var baseService = BaseService.getInstance(),
    Model = function() {
        this.ModifiedBillerDetails = {
            "billerRegistrationId": null,
            "billerNickName": null,
            "autopay":"false",
            "isSchedule": "false",
            "autopayInstructions": {
                "paymentType": null,
                "debitAccount": {
                    "displayValue": null,
                    "value": null
                },
                "limitAmount": {
                    "currency": null,
                    "amount": null
                },
                "startDate": null,
                "endDate": null,
                "frequency": null
            }
        };
    };
    var ManageBillerRegistrationModel = function () {
      var fetchCategoryDeferred, fetchCategory = function(categoryId, deferred) {
        var options = {
          url: "categories/{categoryId}",
          success: function(data) {
            deferred.resolve(data);
          }
        }, params = {
          categoryId: categoryId
        };
        baseService.fetch(options, params);
      }, fetchLocationDetailsDeferred, fetchLocationDetails = function(operationalAreaId, deferred) {
          var options = {
            url: "operationalareas/{operationalAreaId}",
            success: function(data) {
              deferred.resolve(data);
            }
          }, params = {
            operationalAreaId: operationalAreaId
          };
          baseService.fetch(options, params);
      }, fetchBillerDetailsDeferred, fetchBillerDetails = function(billerId, deferred) {
          var options = {
            url: "billers/{billerId}",
            success: function(data) {
              deferred.resolve(data);
            }
          }, params = {
            billerId: billerId
          };
          baseService.fetch(options, params);
      }, fetchRegisteredBillersDeferred, fetchRegisteredBillers = function(deferred) {
        var options = {
          url: "registeredBillers",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchRegisteredBillerDetailsDeferred, fetchRegisteredBillerDetails = function(billerRegistrationId, deferred) {
        var options = {
          url: "registeredBillers/{billerRegistrationId}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          billerRegistrationId: billerRegistrationId
        };
        baseService.fetch(options, params);
      },
      deleteBillerDeferred, deleteBiller = function(billerRegistrationId, deferred) {
        var options = {
          url: "registeredBillers/{billerRegistrationId}",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        },
        params = {
          billerRegistrationId: billerRegistrationId
        };
        baseService.remove(options, params);
      },
      fetchNicknamesDeferred, fetchNicknames = function(deferred) {
          var options = {
            url: "registeredBillers/userDetails",
            success: function(data) {
              deferred.resolve(data);
            }
          };
          baseService.fetch(options);
      };
      return {
        getNewModel: function() {
            return new Model();
        },
        fetchCategory: function(categoryId) {
            fetchCategoryDeferred = $.Deferred();
            fetchCategory(categoryId, fetchCategoryDeferred);
            return fetchCategoryDeferred;
        },
        fetchLocationDetails: function(operationalAreaId) {
            fetchLocationDetailsDeferred = $.Deferred();
            fetchLocationDetails(operationalAreaId, fetchLocationDetailsDeferred);
            return fetchLocationDetailsDeferred;
        },
        fetchBillerDetails: function(billerId) {
            fetchBillerDetailsDeferred = $.Deferred();
            fetchBillerDetails(billerId, fetchBillerDetailsDeferred);
            return fetchBillerDetailsDeferred;
        },
        fetchRegisteredBillers: function() {
            fetchRegisteredBillersDeferred = $.Deferred();
            fetchRegisteredBillers(fetchRegisteredBillersDeferred);
            return fetchRegisteredBillersDeferred;
        },
        fetchRegisteredBillerDetails: function(billerRegistrationId) {
            fetchRegisteredBillerDetailsDeferred = $.Deferred();
            fetchRegisteredBillerDetails(billerRegistrationId, fetchRegisteredBillerDetailsDeferred);
            return fetchRegisteredBillerDetailsDeferred;
        },
        deleteBiller: function(billerRegistrationId) {
            deleteBillerDeferred = $.Deferred();
            deleteBiller(billerRegistrationId, deleteBillerDeferred);
            return deleteBillerDeferred;
        },
        fetchNicknames: function() {
            fetchNicknamesDeferred = $.Deferred();
            fetchNicknames(fetchNicknamesDeferred);
            return fetchNicknamesDeferred;
        }
      };
    };
    return new ManageBillerRegistrationModel();
});
