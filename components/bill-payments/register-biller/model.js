define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    var RegisterBillerModel = function () {
        var baseService = BaseService.getInstance(),
            Model = function() {
                this.RegisterBillerDetails = {
                    "billerId":null,
                    "billerNickName": null,
                    "customerName": null,
                    "category": {
                      "id": null
                    },
                    "location": {
                      "id": null
                    },
                    "autopay":"false",
                    "relationshipDetails": [],
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
                        "frequency": null
                    },
                    "billerType":null

                };
            };
            var fetchCategoryDeferred, fetchCategory = function(deferred) {
              var options = {
                url: "categories",
                success: function(data) {
                  deferred.resolve(data);
                }
              };
              baseService.fetch(options);
            }, fetchLocationDeferred, fetchLocation = function(categoryId, deferred) {
                var options = {
                  url: "operationalareas?categoryId={categoryId}",
                  success: function(data) {
                    deferred.resolve(data);
                  }
                },params = {
                  "categoryId": categoryId
                };
                baseService.fetch(options, params);
            }, fetchBillersDeferred, fetchBillers = function(categoryId, locationId, deferred) {
                var options = {
                  url: "billers?categoryId={categoryId}&operationalAreaId={operationalAreaId}",
                  success: function(data) {
                    deferred.resolve(data);
                  }
                },params = {
                  "categoryId": categoryId,
                  "operationalAreaId": locationId
                };
                baseService.fetch(options, params);
            },
            retrieveImageDeffered, retrieveImage = function(id, deferred) {
              var options = {
                  url: "contents/{id}",
                  success: function(data) {
                    deferred.resolve(data);
                  },
                  error: function(data) {
                    deferred.reject(data);
                  }
                },
                params = {
                  "id": id
                };
              baseService.fetch(options, params);
            },
            fetchNicknamesDeferred, fetchNicknames = function(deferred) {
                var options = {
                  url: "registeredBillers/userDetails",
                  success: function(data) {
                    deferred.resolve(data);
                  }
                };
                baseService.fetch(options);
            },
            fireBatchDeferred,fireBatch = function(deferred, subRequestList, type) {
              var options = {
                url: "batch",
                success: function(data) {
                  deferred.resolve(data);
                },
                error: function(data) {
                  deferred.reject(data);
                }
              };
              baseService.batch(options, {type: type}, subRequestList);
            };
        return {
            getNewModel: function() {
                return new Model();
            },
            fetchCategory: function() {
                fetchCategoryDeferred = $.Deferred();
                fetchCategory(fetchCategoryDeferred);
                return fetchCategoryDeferred;
            },
            fetchLocation: function(categoryId) {
                fetchLocationDeferred = $.Deferred();
                fetchLocation(categoryId, fetchLocationDeferred);
                return fetchLocationDeferred;
            },
            fetchBillers: function(categoryId, locationId) {
                fetchBillersDeferred = $.Deferred();
                fetchBillers(categoryId, locationId, fetchBillersDeferred);
                return fetchBillersDeferred;
            },
            retrieveImage: function(id) {
              retrieveImageDeffered = $.Deferred();
              retrieveImage(id, retrieveImageDeffered);
              return retrieveImageDeffered;
            },
            fetchNicknames: function() {
                fetchNicknamesDeferred = $.Deferred();
                fetchNicknames(fetchNicknamesDeferred);
                return fetchNicknamesDeferred;
            },
            fireBatch: function(subRequestList, type) {
                fireBatchDeferred = $.Deferred();
                fireBatch(fireBatchDeferred, subRequestList, type);
                return fireBatchDeferred;
            }
        };
    };
    return new RegisterBillerModel();
});
