define([
    "jquery",
    "baseService",
    "framework/js/constants/constants-claim-payment"
], function($, BaseService) {
    "use strict";
    var SecuritycodeModel = function() {
        var Model = function() {
                this.bankdetailsModel = {
                    "accountId": "",
                    "status": "U",
                    "bankCode": "",
                    "payeeType": "INTERNATIONAL",
                    "partyId": "",
                    "aliasType": "",
                    "aliasValue": "",
                    "uId": "",
                    "firstName": "",
                    "paymentId": ""
                };
            },
            modelInitialized = false,
            baseService = BaseService.getInstance(),
            /* variable to make sure that in case there is no change
             * in model no additional fetch requests are fired.*/
            readUserDeferred, readUser = function(value, type, deferred) {
                var options = {
                        url: "payments/transfers/peerToPeer/user?type={aliasType}&value={aliasValue}",
                        success: function(data, status, jqXhr) {
                            deferred.resolve(data, status, jqXhr);
                        },
                        error: function(data, status, jqXhr) {
                            deferred.reject(data, status, jqXhr);
                        }
                    },
                    params = {
                        aliasValue: value,
                        aliasType: type
                    };
                baseService.fetch(options, params);
            },
            fetchPartyDeferred, fetchParty = function(deferred) {
                var options = {
                    url: "parties/me",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.fetch(options);
            },
            fetchLdapUserDeferred, fetchLdapUser = function(deferred) {
                var options = {
                    url: "me",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.fetch(options);
            },
            confirmPaymentDeferred, confirmPayment = function(paymentId, deferred) {
                var options = {
                        url: "payments/transfers/peerToPeer/user/{paymentId}",
                        success: function(data, status, jqXHR) {
                            deferred.resolve(data, status, jqXHR);
                        },
                        error: function(data, status, jqXHR) {
                            deferred.reject(data, status, jqXHR);
                        }
                    },
                    params = {
                        paymentId: paymentId
                    };
                baseService.patch(options, params);
            },

            logout = function(callback) {
                if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage("logout");
                }
                var options = {
                    url: "session",
                    success: function() {
                        callback();
                    }
                };
                baseService.remove(options);
            },
            logoutDBAuth = function() {
                if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage("logout");
                }
                var options = {
                    url: "session",
                    success: function() {
                        window.location.href = window.location.origin + "/pages/home.html?module=login";
                    }
                };
                baseService.remove(options);
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
            readUser: function(value, type) {
                objectInitializedCheck();
                readUserDeferred = $.Deferred();
                readUser(value, type, readUserDeferred);
                return readUserDeferred;
            },
            fetchParty: function() {
                objectInitializedCheck();
                fetchPartyDeferred = $.Deferred();
                fetchParty(fetchPartyDeferred);
                return fetchPartyDeferred;
            },
            fetchLdapUser: function() {
                objectInitializedCheck();
                fetchLdapUserDeferred = $.Deferred();
                fetchLdapUser(fetchLdapUserDeferred);
                return fetchLdapUserDeferred;
            },
            confirmPayment: function(paymentId) {
                objectInitializedCheck();
                confirmPaymentDeferred = $.Deferred();
                confirmPayment(paymentId, confirmPaymentDeferred);
                return confirmPaymentDeferred;
            },
            logout: function(callback) {
                logout(callback);
            },
            logoutDBAuth: function() {
                logoutDBAuth();
            }
        };
    };
    return new SecuritycodeModel();
});