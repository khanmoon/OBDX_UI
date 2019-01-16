define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var CardDetailModel = function() {

    var creditCardDetailsModel = function() {
      this.creditCard = null;
      this.isInternationalUsageAllowed = null;
    };

    var params, baseService = BaseService.getInstance();
    var redeemRewardPoints = function(baseUrl, creditCardId) {
        var options = {
          url: "session",
          success: function() {
            window.open(baseUrl + "/v1/accounts/cards/credit/" + creditCardId + "/rewards/redemption", "_blank", "height=600,width=600");
            var form = document.createElement("form");
            form.action = "/logout.";
            document.body.appendChild(form);
            form.submit();
          }
        };
        baseService.remove(options);
      },
      redeemRewardPointsApp = function(creditCardId) {
        var options = {
          url: "session",
          success: function() {
            $.ajax({
              url: window.APPLICATION_OAM_URL + "/oam/server/logout",
              success: function() {
                setTimeout(function() {
                  window.location = "/index.html?module=login";
                }, 100);
                window.open(window.APPLICATION_BASE_URL + "accounts/cards/credit/" + creditCardId + "/rewards/redemption", "_self");
              }
            });
          }
        };
        baseService.remove(options);
      },
      updateInternationalUsageDeferred, updateInternationalUsage = function(creditCard, payload, deferred) {
        params = {
          "creditCard": creditCard
        };
        var options = {
          url: "accounts/cards/credit/{creditCard}/internationalusage/",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.update(options, params);
      },
      /**
       * Method to update limits information data.
       * @creditCardId - unique account number
       * @type - type for which limits need to be update
       * @payload - data of updated limits
       *  deferred object is resolved once the accounts information list is successfully fetched
       */
      updateLimitDeferred, updateLimit = function(payload, creditCardId, type, deferred) {
        params = {
          "creditCardId": creditCardId,
          "type": type
        };
        var options = {
          url: "accounts/cards/credit/" + creditCardId + "/limit?type=" + type,
          data: payload,

          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.update(options, params);
      },
      fetchBillingsDaysDeferred, fetchBillingsDays = function(deferred) {
        var options = {
          url: "enumerations/billcycles",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      updateBillCycleDeferred, updateBillCycle = function(model, creditCardId, deferred) {
        params = {
          "creditCardId": creditCardId
        };
        var options = {
          url: "accounts/cards/credit/{creditCardId}/billcycle",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.update(options, params);
      },
      fetchCreditDetailsDeferred, fetchCreditDetails = function(creditCardId, deferred) {
        params = {
          "creditCardId": creditCardId
        };
        var options = {
          url: "accounts/cards/credit/{creditCardId}?expand=ALL",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        baseService.fetch(options, params);
      },
      fetchBillCycleDeferred, fetchBillCycle = function(creditCardId, deferred) {
        params = {
          "creditCardId": creditCardId
        };
        var options = {
          url: "accounts/cards/credit/{creditCardId}/billcycle",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, params);
      },
      getActivateReasonsDeferred, getActivateReasons = function(deferred) {
        var options = {
          url: "enumerations/cardActivateReasons",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      activateCardDeferred, activateCard = function(model, creditCardId, deferred) {
        params = {
          "creditCardId": creditCardId
        };
        var options = {
          url: "accounts/cards/credit/{creditCardId}/status",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.update(options, params);
      };
    return {
      redeemRewardPoints: function(creditCardId) {
        redeemRewardPoints(creditCardId);
      },
      redeemRewardPointsApp: function(creditCardId) {
        redeemRewardPointsApp(creditCardId);
      },
      updateInternationalUsage: function(creditCard, payload) {
        updateInternationalUsageDeferred = $.Deferred();
        updateInternationalUsage(creditCard, payload, updateInternationalUsageDeferred);
        return updateInternationalUsageDeferred;
      },
      updateLimit: function(payload, creditCardId, type) {
        updateLimitDeferred = $.Deferred();
        updateLimit(payload, creditCardId, type, updateLimitDeferred);
        return updateLimitDeferred;
      },
      fetchBillingsDays: function() {
        fetchBillingsDaysDeferred = $.Deferred();
        fetchBillingsDays(fetchBillingsDaysDeferred);
        return fetchBillingsDaysDeferred;
      },
      updateBillCycle: function(model, creditCardId) {
        updateBillCycleDeferred = $.Deferred();
        updateBillCycle(model, creditCardId, updateBillCycleDeferred);
        return updateBillCycleDeferred;
      },
      fetchCreditDetails: function(creditCardId) {
        fetchCreditDetailsDeferred = $.Deferred();
        fetchCreditDetails(creditCardId, fetchCreditDetailsDeferred);
        return fetchCreditDetailsDeferred;
      },
      fetchBillCycle: function(creditCardId) {
        fetchBillCycleDeferred = $.Deferred();
        fetchBillCycle(creditCardId, fetchBillCycleDeferred);
        return fetchBillCycleDeferred;
      },
      getNewCreditCardDetailsModel: function() {
        return new creditCardDetailsModel();
      },
      fetchActivateReasons: function() {
        getActivateReasonsDeferred = $.Deferred();
        getActivateReasons(getActivateReasonsDeferred);
        return getActivateReasonsDeferred;
      },
      activateCard: function(model, creditCardId) {
        activateCardDeferred = $.Deferred();
        activateCard(model, creditCardId, activateCardDeferred);
        return activateCardDeferred;
      }
    };
  };
  return new CardDetailModel();
});