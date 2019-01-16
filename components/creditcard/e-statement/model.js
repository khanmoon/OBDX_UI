define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  var eStatementModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    var params, baseService = BaseService.getInstance();

    var estatementDetailsModel = function() {
      this.primaryEmailId = null;
      this.frequency = null;
      this.subscriptionStatus = null;
      this.dayOfMonth = null;
    };
    var updateSubscriptionForStatementDeferred, updateSubscriptionForStatement = function(cardId, payload, deferred) {
      params = {
        "cardId": cardId
      };
      var options = {
        url: "accounts/cards/credit/{cardId}/preferences/eStatement",
        data: payload,
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
      updateSubscriptionForStatement: function(cardId, payload) {
        updateSubscriptionForStatementDeferred = $.Deferred();
        updateSubscriptionForStatement(cardId, payload, updateSubscriptionForStatementDeferred);
        return updateSubscriptionForStatementDeferred;
      },
      getNewEStatementDetailsModel: function() {
        return new estatementDetailsModel();
      }
    };
  };
  return new eStatementModel();
});