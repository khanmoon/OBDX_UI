define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    var baseService = BaseService.getInstance();
    var BillerSearchModel = function () {
        var fetchCategoryDeferred, fetchCategory = function (deferred) {
            var options = {
                url: "categories",
                success: function (data) {
                    deferred.resolve(data);
                }
            };
            baseService.fetch(options);
        },
        billerListDeferred, getBillerList = function(billerName, categoryId, operationalAreaId, deferred) {
            var options = {
              url: "billers?billerName=" + billerName + "&categoryId=" + categoryId + "&operationalAreaId=" + operationalAreaId,
              success: function(data) {
                deferred.resolve(data);
              },
              error: function(data) {
                deferred.reject(data);
              }
            };
            baseService.fetch(options);
          },
           fetchLocationDeferred, fetchLocation = function (deferred) {
              var options = {
                  url: "operationalareas",
                  success: function (data) {
                      deferred.resolve(data);
                  }
              };
              baseService.fetch(options);
          },
          fetchBillerDetailsDeferred, getBillerDetails = function(billerId, deferred) {
            var options = {
                url: "billers/{billerId}",
                success: function(data) {
                  deferred.resolve(data);
                },
                error: function(data) {
                  deferred.reject(data);
                }
              },
              params = {
                "billerId": billerId
              };
            baseService.fetch(options, params);
          };
        return {
            fetchCategory: function () {
                fetchCategoryDeferred = $.Deferred();
                fetchCategory(fetchCategoryDeferred);
                return fetchCategoryDeferred;
            },
              getBillerList: function(billerName, categoryId, operationalAreaId) {
              billerListDeferred = $.Deferred();
              getBillerList(billerName, categoryId, operationalAreaId, billerListDeferred);
              return billerListDeferred;
            },
            fetchLocation: function () {
                fetchLocationDeferred = $.Deferred();
                fetchLocation(fetchLocationDeferred);
                return fetchLocationDeferred;
            },
            getBillerDetails: function(billerId) {
              fetchBillerDetailsDeferred = $.Deferred();
              getBillerDetails(billerId, fetchBillerDetailsDeferred);
              return fetchBillerDetailsDeferred;
            }
        };
    };
    return new BillerSearchModel();
});
