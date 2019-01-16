define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    var QuickBillPaymentModel = function () {
        var baseService = BaseService.getInstance(),
            Model = function() {
                this.QuickBillPayDetails = {
                  "id": null,
                  "debitAccount": {
                            "value": null,
                            "displayValue": null
                                   },
                   "customerName": null,
                   "billerRegistrationId": null,
                   "billAmount": {
                             "currency": null,
                             "amount": null
                                    },
                   "paymentDate": null,
                   "planId": null,
                   "billerId": null,
                   "location":null,
                   "billerName": null,
                   "billId": null,
                   "partyId": null,
                   "cardExpiryDate": null,
                   "paymentStatus": "COM",
                   "billPaymentRelDetails": [],
                   "paymentType": null,
                   "isPayLater": "false",
                   "isRecurring": "false",
                   "billerType": null,
                   "locationId": null,
                   "categoryId": null,
                   "category": null,
                   "paymentHostStatus": null,
                   "billerRegistration": {
                               "billerNickName": null,
                               "autopayInstructions": {
                                     "frequency": null,
                                     "endDate": null
                                                      }
                                          }
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
            },
            fetchBillerDetailsDeferred, fetchBillerDetails = function(billerId, deferred) {
                var options = {
                  url: "billers/{billerId}",
                  success: function(data) {
                    deferred.resolve(data);
                  }
                }, params = {
                  billerId: billerId
                };
                baseService.fetch(options, params);
            },
            listAccessPointDeferred, listAccessPoint = function(deferred) {
              var options = {
                url: "accessPoints",
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
            },
            fetchBillerDetails: function(billerId) {
                fetchBillerDetailsDeferred = $.Deferred();
                fetchBillerDetails(billerId, fetchBillerDetailsDeferred);
                return fetchBillerDetailsDeferred;
            },
            listAccessPoint: function() {
              listAccessPointDeferred = $.Deferred();
              listAccessPoint(listAccessPointDeferred);
              return listAccessPointDeferred;
            }
        };
    };
    return new QuickBillPaymentModel();
});
