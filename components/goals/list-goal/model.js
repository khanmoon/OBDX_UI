define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var PFMmodel = function PFMmodel() {

    var baseService = BaseService.getInstance(),

      getGoalsListDeferred, getGoalsList = function(isDashboard, deferred) {
        var options = {
          url: "goals?status=ACTIVE",
          selfLoader: isDashboard,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);

      },
      fetchBankConfigDeferred, fetchBankConfig = function(deferred) {
        var options = {
          url: "bankConfiguration",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);

      },
      fireBatchDeferred,
      fireBatch = function(subRequestList, deferred) {
        var options = {
          headers: {
            "BATCH_ID": "5678"
          },
          url: "batch/",
          selfLoader: true,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.batch(options, {}, subRequestList);
      },
      getinActiveGoalsListDeferred, getinActiveGoalsList = function(deferred) {
        var options = {
          url: "goals?status=CLOSED",

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);

      }
    /*,
    				getgoalCategoriesDeferred, getgoalCategories = function (deferred) {
    								var options = {
    										url: 'goals/categories?status=ACT',

    										success: function (data) {
    												deferred.resolve(data);
    										},
    										error: function (data) {
    												deferred.reject(data);
    										}
    								};
    								baseService.fetch(options);

    						}*/
    ;

    return {

      getGoalsList: function(isDashboard) {
        getGoalsListDeferred = $.Deferred();
        getGoalsList(isDashboard, getGoalsListDeferred);
        return getGoalsListDeferred;
      },
      getinActiveGoalsList: function() {
        getinActiveGoalsListDeferred = $.Deferred();
        getinActiveGoalsList(getinActiveGoalsListDeferred);
        return getinActiveGoalsListDeferred;
      },
      fetchBankConfig: function() {
        fetchBankConfigDeferred = $.Deferred();
        fetchBankConfig(fetchBankConfigDeferred);
        return fetchBankConfigDeferred;
      },
      fireBatch: function(subRequestList) {
        fireBatchDeferred = $.Deferred();
        fireBatch(subRequestList, fireBatchDeferred);
        return fireBatchDeferred;
      }
      /*,
      getgoalCategories:function(){
      	getgoalCategoriesDeferred = $.Deferred();
      	getgoalCategories(getgoalCategoriesDeferred);
      	return getgoalCategoriesDeferred;
      }*/
    };
  };

  return new PFMmodel();
});