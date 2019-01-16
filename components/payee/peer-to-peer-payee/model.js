define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";
    var PeerToPeerModel = function() {
        var Model = function() {
                this.p2pPayee = {
                    "dictionaryArray": null,
                    "refLinks": null,
                    "id": null,
                    "name": null,
                    "nickName": "",
                    "partyId": null,
                    "groupId": "",
                    "status": "ACTIVE",
                    "alias": null,
                    "tokenId": null,
                    "transferMode": "",
                    "transferValue": "",
                    "payeeType": "PEERTOPEER"
                };
                this.payeeGroup = {
                    name: null
                };
            },
            modelInitialized = false,
            baseService = BaseService.getInstance(),
            /* variable to make sure that in case there is no change
             * in model no additional fetch requests are fired.*/
            createPayeeGroupDeferred, createPayeeGroup = function(model, deferred) {

                var options = {
                    url: "payments/payeeGroup",
                    data: model,
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.add(options);
            },
            deletePayeeGroupDeferred, deletePayeeGroup = function(gId, deferred) {

                var options = {
                        url: "payments/payeeGroup/{groupId}",
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    },
                    params = {
                        groupId: gId
                    };
                baseService.remove(options, params);
            },
            addPayeeDeferred, addPayee = function(id, type, model, deferred) {

                var options = {
                        url: "payments/payeeGroup/{groupId}/payees/{payeeType}",
                        data: model,
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    },
                    params = {
                        "groupId": id,
                        "payeeType": type
                    };
                baseService.add(options, params);
            },
            verifyPayeeDeferred, verifyPayee = function(groupId, payeeId, type, deferred) {

                var options = {
                        url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
                        success: function(data, status, jqXHR) {
                            deferred.resolve(data, status, jqXHR);
                        }
                    },
                    params = {
                        "groupId": groupId,
                        "payeeType": type,
                        "payeeId": payeeId
                    };
                baseService.patch(options, params);
            },
            readPayeeDeferred, readPayee = function(groupId, payeeId, type, deferred) {

                var options = {
                        url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    },
                    params = {
                        "payeeType": type,
                        "payeeId": payeeId,
                        "groupId": groupId
                    };
                baseService.fetch(options, params);
            },
            errors = {
                InitializationException: function() {
                    var message = "";
                    message += "\nObject can't be initialized without a valid submission Id. ";
                    message += "\nPlease make sure the submission id is present.";
                    message += "\nProper initialization has to be:";
                    message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
                    return message;
                }(),
                ObjectNotInitialized: function() {
                    var message = "";
                    message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
                    message += "\nProper initialization has to be: ";
                    message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
                    return message;
                }()
            },
            objectInitializedCheck = function() {
                if (!modelInitialized) {
                    throw new Error(errors.ObjectNotInitialized);
                }
            };
        return {
            init: function() {
                modelInitialized = true;
                return modelInitialized;
            },
            getNewModel: function(modelData) {
                return new Model(modelData);
            },
            addPayee: function(groupId, payeeType, model) {
                objectInitializedCheck();
                addPayeeDeferred = $.Deferred();
                addPayee(groupId, payeeType, model, addPayeeDeferred);
                return addPayeeDeferred;
            },
            verifyPayee: function(groupId, payeeId, payeeType) {
                objectInitializedCheck();
                verifyPayeeDeferred = $.Deferred();
                verifyPayee(groupId, payeeId, payeeType, verifyPayeeDeferred);
                return verifyPayeeDeferred;
            },
            readPayee: function(groupId, payeeId, payeeType) {
                objectInitializedCheck();
                readPayeeDeferred = $.Deferred();
                readPayee(groupId, payeeId, payeeType, readPayeeDeferred);
                return readPayeeDeferred;
            },
            createPayeeGroup: function(payload) {
                objectInitializedCheck();
                createPayeeGroupDeferred = $.Deferred();
                createPayeeGroup(payload, createPayeeGroupDeferred);
                return createPayeeGroupDeferred;
            },
            deletePayeeGroup: function(gId) {
                objectInitializedCheck();
                deletePayeeGroupDeferred = $.Deferred();
                deletePayeeGroup(gId, deletePayeeGroupDeferred);
                return deletePayeeGroupDeferred;
            }
        };
    };
    return new PeerToPeerModel();
});