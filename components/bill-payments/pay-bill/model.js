define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    var baseService = BaseService.getInstance(),
    Model = function() {
        this.BillerPaymentDetails = {
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
                               "billerNickName": "null",
                               "autopayInstructions": {
                                     "frequency": null,
                                     "endDate": null
                                                      }
                                          }
            };
        };
    var PayBillModel = function () {
        var fetchBillerDetailsDeferred, fetchBillerDetails = function(billerId, deferred) {
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
        fetchLocationDetailsDeferred, fetchLocationDetails = function(operationalAreaId, deferred) {
            var options = {
              url: "operationalareas/{operationalAreaId}",
              success: function(data) {
                deferred.resolve(data);
              }
            }, params = {
              operationalAreaId: operationalAreaId
            };
            baseService.fetch(options, params);
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
            fetchLocationDetails: function(operationalAreaId) {
                fetchLocationDetailsDeferred = $.Deferred();
                fetchLocationDetails(operationalAreaId, fetchLocationDetailsDeferred);
                return fetchLocationDetailsDeferred;
            },
            listAccessPoint: function() {
              listAccessPointDeferred = $.Deferred();
              listAccessPoint(listAccessPointDeferred);
              return listAccessPointDeferred;
            }
        };
    };
    return new PayBillModel();
});
