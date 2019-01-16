define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var payeeCountLimitModel = function payeeCountLimitModel() {

    var Model = function() {

        this.updatePayload = {
          payeeCountLimitList: []
        };

        this.updateElement = {
          payeeType: null,
          payeesPerDay: null,
          payeeCountLimitStatus: null
        };

      },
      baseService = BaseService.getInstance();

    var addPayeeLimitsDeferred, addPayeeLimits = function(model, deferred) {
        var options = {
          url: "payments/maintenances/payeecount",

          data: model,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        baseService.update(options);

      },

      listAllLimitsDeferred, listAllLimits = function(deferred) {
        var options = {
          url: "payments/maintenances/payeecount",
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
      getNewModel: function() {
        return new Model();
      },
      listAllLimits: function() {
        listAllLimitsDeferred = $.Deferred();
        listAllLimits(listAllLimitsDeferred);
        return listAllLimitsDeferred;
      },
      addPayeeLimits: function(model) {
        addPayeeLimitsDeferred = $.Deferred();
        addPayeeLimits(model, addPayeeLimitsDeferred);
        return addPayeeLimitsDeferred;
      }
    };
  };

  return new payeeCountLimitModel();
});