define([
    "jquery",
    "baseService"

], function($, BaseService) {
    "use strict";
    var addPayeeModel = function() {
        var Model = function() {
                this.payeeGroup = {
                    name: null
                };
                this.internationalDDPayeeModel = {
                    nickName: null,
                    status: "ACT",
                    isShared: false,
                    payAtCity: null,
                    payAtCountry: null,
                    demandDraftDeliveryDTO: {
                        dictionaryArray: null,
                        refLinks: null,
                        deliveryMode: null,
                        branch: null,
                        mailModeType: null,
                        addressType: null
                    },
                    demandDraftPayeeType: "INT",
                    payeeType: null
                };
                this.domesticDDPayeeModel = {
                    dictionaryArray: null,
                    refLinks: null,
                    id: null,
                    nickName: null,
                    status: "ACT",
                    isShared: false,
                    payAtCity: null,
                    demandDraftDeliveryDTO: {
                        dictionaryArray: null,
                        refLinks: null,
                        deliveryMode: null,
                        branch: null,
                        mailModeType: null,
                        addressType: null
                    },
                    demandDraftPayeeType: "DOM",
                    payeeType: null
                };
                this.addressDetails = {
                    modeofDelivery: null,
                    addressType: null,
                    addressTypeDescription: null,
                    postalAddress: {
                        line1: "",
                        line2: "",
                        line3: "",
                        line4: "",
                        line5: "",
                        line6: "",
                        line7: "",
                        line8: "",
                        line9: "",
                        line10: "",
                        line11: "",
                        line12: "",
                        city: "",
                        state: "",
                        country: "",
                        zipCode: "",
                        branch: "",
                        branchName: ""
                    }
                };
                this.payeeLimitModel = {
                    "currency": "",
                    "accessPointValue": "",
                    "accessPointGroupType": "",
                    "targetLimitLinkages": [{
                        "target": {
                            "value": "",
                            "type": {
                                "id": "PAYEE",
                                "name": "PAYEE",
                                "mandatory": true
                            }
                        },
                        "limits": [],
                        "effectiveDate": "",
                        "expiryDate": ""
                    }]
                };
                this.limitModel = {
                    "limitType": "PER",
                    "maxAmount": {
                        "currency": null,
                        "amount": null
                    },
                    "maxCount": null,
                    "periodicity": null
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
            assignedLimitPackagesDeferred, assignedLimitPackages = function(deferred) {
                var options = {
                    url: "me/assignedLimitPackage",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.fetch(options);
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
            addPayeeDeferred, addPayee = function(gId, type, model, deferred) {
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
                        groupId: gId,
                        payeeType: type
                    };
                baseService.add(options, params);
            },
            deletePayeeDeferred, deletePayee = function(gId, pId, type, deferred) {
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
                        groupId: gId,
                        payeeType: type,
                        payeeId: pId
                    };
                baseService.remove(options, params);
            },
            confirmPayeeDeferred, confirmPayee = function(gId, pId, type, deferred) {
                var options = {
                        url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",

                        success: function(data, status, jqXHR) {
                            deferred.resolve(data, status, jqXHR);
                        }
                    },
                    params = {
                        groupId: gId,
                        payeeId: pId,
                        payeeType: type
                    };
                baseService.patch(options, params);
            },
            confirmPayeeWithAuthDeferred, confirmPayeeWithAuth = function(gId, pId, type, authKey, deferred) {
                var options = {
                        url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}/authentication",

                        headers: {
                            "TOKEN_ID": authKey
                        },
                        success: function(data, status, jqXHR) {
                            deferred.resolve(data, status, jqXHR);
                        },
                        error: function(data, status, jqXHR) {
                            deferred.reject(data, status, jqXHR);
                        }
                    },
                    params = {
                        groupId: gId,
                        payeeId: pId,
                        payeeType: type
                    };
                baseService.update(options, params);
            },
            postPayeeLimitDeferred, postPayeeLimit = function(payload, deferred) {
                var options = {
                    url: "me/customLimitPackage",
                    data: payload,
                    success: function(data, status, jqXHR) {
                        deferred.resolve(data, status, jqXHR);
                    },
                    error: function(data, status, jqXHR) {
                        deferred.reject(data, status, jqXHR);
                    }
                };
                baseService.add(options);
            },
            getPayeeLimitDeferred, getPayeeLimit = function(deferred) {
                var options = {
                    url: "me/customLimitPackage",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.fetch(options);
            },
            putPayeeLimitDeferred, putPayeeLimit = function(payload, deferred) {
                var options = {
                    url: "me/customLimitPackage",
                    data: payload,
                    success: function(data, status, jqXHR) {
                        deferred.resolve(data, status, jqXHR);
                    },
                    error: function(data, status, jqXHR) {
                        deferred.reject(data, status, jqXHR);
                    }
                };
                baseService.update(options);
            },
            fetchEffectiveTodayDetailsDeffered, fetchEffectiveTodayDetails = function(deffered) {
                var options = {
                    url: "limitPackages/config/effectiveToday",
                    success: function(data) {
                        deffered.resolve(data);
                    },
                    error: function(data) {
                        deffered.reject(data);
                    }
                };
                baseService.fetch(options);
            },
            bancConfigurationDeffered, fetchBankConfiguration = function(deferred) {
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
            /**
             * Method to initialize the described model
             */
            init: function() {
                modelInitialized = true;
            },
            getNewModel: function(modelData) {
                return new Model(modelData);
            },
            addPayee: function(gId, type, model) {
                objectInitializedCheck();
                addPayeeDeferred = $.Deferred();
                addPayee(gId, type, model, addPayeeDeferred);
                return addPayeeDeferred;
            },
            deletePayee: function(gId, pId, type) {
                objectInitializedCheck();
                deletePayeeDeferred = $.Deferred();
                deletePayee(gId, pId, type, deletePayeeDeferred);
                return deletePayeeDeferred;
            },
            confirmPayee: function(gId, pId, type) {
                objectInitializedCheck();
                confirmPayeeDeferred = $.Deferred();
                confirmPayee(gId, pId, type, confirmPayeeDeferred);
                return confirmPayeeDeferred;
            },
            confirmPayeeWithAuth: function(gId, pId, type, authKey) {
                objectInitializedCheck();
                confirmPayeeWithAuthDeferred = $.Deferred();
                confirmPayeeWithAuth(gId, pId, type, authKey, confirmPayeeWithAuthDeferred);
                return confirmPayeeWithAuthDeferred;
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
            },
            postPayeeLimit: function(payload) {
                postPayeeLimitDeferred = $.Deferred();
                postPayeeLimit(payload, postPayeeLimitDeferred);
                return postPayeeLimitDeferred;
            },
            fetchEffectiveTodayDetails: function() {
                fetchEffectiveTodayDetailsDeffered = $.Deferred();
                fetchEffectiveTodayDetails(fetchEffectiveTodayDetailsDeffered);
                return fetchEffectiveTodayDetailsDeffered;
            },
            getPayeeLimit: function() {
                getPayeeLimitDeferred = $.Deferred();
                getPayeeLimit(getPayeeLimitDeferred);
                return getPayeeLimitDeferred;
            },
            putPayeeLimit: function(payload) {
                putPayeeLimitDeferred = $.Deferred();
                putPayeeLimit(payload, putPayeeLimitDeferred);
                return putPayeeLimitDeferred;
            },
            assignedLimitPackages: function() {
                assignedLimitPackagesDeferred = $.Deferred();
                assignedLimitPackages(assignedLimitPackagesDeferred);
                return assignedLimitPackagesDeferred;
            },
            fetchBankConfiguration: function() {
                bancConfigurationDeffered = $.Deferred();
                fetchBankConfiguration(bancConfigurationDeffered);
                return bancConfigurationDeffered;
            }
        };
    };
    return new addPayeeModel();
});