define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";
    var PayeeListModel = function() {
        var Model = function() {
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
            getPayeeListDeferred, getPayeeList = function(deferred, types) {
                var options = {
                    url: "payments/payeeGroup?expand=ALL" + (types ? ("&types=" + types) : ""),

                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.fetch(options);
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
            fetchCourierAddressDeferred, fetchCourierAddress = function(addressType, deferred) {
                var options = {
                    url: "me/party",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
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
            deletePayeeDeferred, deletePayee = function(deferred, type, groupId, payeeId) {

                var options = {
                        url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
                        success: function(data, status, jqXHR) {
                            deferred.resolve(data, status, jqXHR);
                        },
                        error: function(data, status, jqXHR) {
                            deferred.reject(data, status, jqXHR);
                        }
                    },
                    params = {
                        "payeeType": type,
                        "payeeId": payeeId,
                        "groupId": groupId
                    };
                baseService.remove(options, params);
            },
            getPayeeLimitDeferred, getPayeeLimit = function(deferred) {
                var options = {
                    url: "me/customLimitPackage",
                    success: function(data, status, jqXHR) {
                        deferred.resolve(data, status, jqXHR);
                    },
                    error: function(data, status, jqXHR) {
                        deferred.reject(data, status, jqXHR);
                    }
                };
                baseService.fetch(options);
            },
            readImageDeferred, readImage = function(gId, deferred) {
                var options = {
                        url: "payments/payeeGroup/{groupId}/image",
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    },
                    params = {
                        "groupId": gId
                    };
                baseService.fetch(options, params);
            },
            fetchBranchAddressDeferred, fetchBranchAddress = function(branchCode, deferred) {
                var params = {
                    "branchCode": branchCode
                };
                var options = {
                    url: "locations/branches?branchCode={branchCode}",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.fetch(options, params);
            },
            fetchCountryCodeDeferred, fetchCountryCode = function(deferred) {

                var options = {
                    url: "enumerations/country",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }

                };
                baseService.fetch(options);
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
            getNewModel: function() {
                return new Model();
            },
            deletePayee: function(type, groupId, payeeId) {
                objectInitializedCheck();
                deletePayeeDeferred = $.Deferred();
                deletePayee(deletePayeeDeferred, type, groupId, payeeId);
                return deletePayeeDeferred;
            },
            getPayeeLimit: function() {
                getPayeeLimitDeferred = $.Deferred();
                getPayeeLimit(getPayeeLimitDeferred);
                return getPayeeLimitDeferred;
            },
            fetchEffectiveTodayDetails: function() {
                fetchEffectiveTodayDetailsDeffered = $.Deferred();
                fetchEffectiveTodayDetails(fetchEffectiveTodayDetailsDeffered);
                return fetchEffectiveTodayDetailsDeffered;
            },
            fetchBankConfiguration: function() {
                bancConfigurationDeffered = $.Deferred();
                fetchBankConfiguration(bancConfigurationDeffered);
                return bancConfigurationDeffered;
            },
            fetchCourierAddress: function(addressType) {
                fetchCourierAddressDeferred = $.Deferred();
                fetchCourierAddress(addressType, fetchCourierAddressDeferred);
                return fetchCourierAddressDeferred;
            },
            postPayeeLimit: function(payload) {
                postPayeeLimitDeferred = $.Deferred();
                postPayeeLimit(payload, postPayeeLimitDeferred);
                return postPayeeLimitDeferred;
            },
            putPayeeLimit: function(payload) {
                putPayeeLimitDeferred = $.Deferred();
                putPayeeLimit(payload, putPayeeLimitDeferred);
                return putPayeeLimitDeferred;
            },
            getPayeeList: function(types) {
                objectInitializedCheck();
                getPayeeListDeferred = $.Deferred();
                getPayeeList(getPayeeListDeferred, types);
                return getPayeeListDeferred;
            },
            readImage: function(gId) {
                objectInitializedCheck();
                readImageDeferred = $.Deferred();
                readImage(gId, readImageDeferred);
                return readImageDeferred;
            },
            fetchBranchAddress: function(branchCode) {
                fetchBranchAddressDeferred = $.Deferred();
                fetchBranchAddress(branchCode, fetchBranchAddressDeferred);
                return fetchBranchAddressDeferred;
            },
            fetchCountryCode: function() {
                fetchCountryCodeDeferred = $.Deferred();
                fetchCountryCode(fetchCountryCodeDeferred);
                return fetchCountryCodeDeferred;
            },
            assignedLimitPackages: function() {
                assignedLimitPackagesDeferred = $.Deferred();
                assignedLimitPackages(assignedLimitPackagesDeferred);
                return assignedLimitPackagesDeferred;
            }
        };
    };
    return new PayeeListModel();
});