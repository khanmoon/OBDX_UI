define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";
    var AdhocPaymentModel = function() {
        var Model = function() {
                this.adhocPaymentModel = {
                    "genericPayee": {
                        "accountNumber": null,
                        "accountName": null,
                        "branchCode": null,
                        "transferMode": "ACC",
                        "network": null,
                        "bankDetails": {
                            "name": null,
                            "branch": null,
                            "address": null,
                            "city": null,
                            "country": null,
                            "codeType": null,
                            "code": null
                        },
                        "name": null,
                        "nickName": null,
                        "groupId": null,
                        "sepaType": null,
                        "ukPaymentType": null
                    },
                    "genericPayout": {
                        "charges": null,
                        "otherDetails": {
                            "line1": null
                        },
                        "partyId": {
                            "displayValue": null,
                            "value": null
                        },
                        "amount": {
                            "currency": null,
                            "amount": null
                        },
                        "userReferenceNo": null,
                        "remarks": null,
                        "purpose": null,
                        "purposeText": null,
                        "debitAccountId": {
                            "displayValue": null,
                            "value": null
                        },
                        "creditAccountId": null,
                        "valueDate": null,
                        "frequency": null,
                        "startDate": null,
                        "endDate": null,
                        "nextExecutionDate": null,
                        "instances": null,
                        "externalReferenceNumber": null,
                        "freqDays": 0,
                        "freqMonths": 0,
                        "freqYears": 0
                    },
                    "paymentType": null
                };
            },
            baseService = BaseService.getInstance(),
            region, getNetworkTypesDeferred, getNetworkTypes = function(deferred) {
                var options = {
                        url: "enumerations/networkType?REGION={region}",
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    },
                    params = {
                        "region": region
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
            },
            getCountriesDeferred, getCountries = function(deferred) {
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
            readPayeeDeferred, readPayee = function(gId, pId, type, deferred) {
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
                        payeeId: pId,
                        payeeType: type
                    };
                baseService.fetch(options, params);
            },

            getPayeeListDeferred, getPayeeList = function(deferred) {
                var options = {
                    url: "payments/payeeGroup?expand=ALL",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.fetch(options);
            },
            getBankDetailsBICDeferred, getBankDetailsBIC = function(code, deferred) {
                var options = {
                        url: "financialInstitution/bicCodeDetails/{BICCode}",
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    },
                    params = {
                        "BICCode": code
                    };
                baseService.fetch(options, params);
            },
            getBankDetailsNCCDeferred, getBankDetailsNCC = function(code, region, deferred) {
                var options = {
                        url: "financialInstitution/nationalClearingDetails/{nationalClearingCodeType}/{nationalClearingCode}",
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    },
                    params = {
                        "nationalClearingCode": code,
                        "nationalClearingCodeType": region
                    };
                baseService.fetch(options, params);
            },
            getBankDetailsDCCDeferred, getBankDetailsDCC = function(code, deferred) {
                var options = {
                        url: "financialInstitution/domesticClearingDetails/{domesticClearingCodeType}/{domesticClearingCode}",
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    },
                    params = {
                        "domesticClearingCodeType": "INDIA",
                        "domesticClearingCode": code
                    };
                baseService.fetch(options, params);
            },
            getCorrespondenceChargesDeferred, getCorrespondenceCharges = function(deferred) {
                var options = {
                    url: "enumerations/correspondanceChargeType",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.fetch(options);
            },
            makeAdhocPaymentDeferred, makeAdhocPayment = function(payload, deferred) {
                var options = {
                    url: "payments/generic",
                    data: payload,
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.add(options);
            },
            getBranchesDeferred, getBranches = function(deferred) {
                var options = {
                    url: "locations/country/all/city/all/branchCode/",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.fetch(options);
            },
            getTransferPurposeDeferred, getTransferPurpose = function(paymentType, deferred) {
                var url;
                if (paymentType === "INTERNAL") {
                    url = "purposes/linkages?taskCode=PC_F_INTRNL";
                }
                if (paymentType === "DOMESTIC") {
                    url = "purposes/linkages?taskCode=PC_F_DOM";
                }
                var options = {
                    url: url,
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
            validateAndFetchCurrencyDeferred, validateAndFetchCurrency = function(accountNumber, deferred) {
                var options = {
                    url: "payments/generic/internal/" + accountNumber,
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.fetch(options);
            },
            getHostDateDeferred, getHostDate = function(deferred) {
                var options = {
                    url: "payments/currentDate",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.fetch(options);
            },
            deletePaymentDeferred, deletePayment = function(paymentId, deferred) {
                var options = {
                    url: "payments/generic/" + paymentId,
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };
                baseService.remove(options);
            },
            confirmPaymentDeferred, confirmPayment = function(paymentId, paymentType, deferred) {
                var options = {
                    url: "payments/generic/" + paymentId + "?paymentType=" + paymentType,
                    success: function(data, status, jqXHR) {
                        deferred.resolve(data, status, jqXHR);
                    }
                };
                baseService.patch(options);
            };
        return {
            init: function(reg) {
                region = reg || undefined;
            },
            getNewModel: function(modelData) {
                return new Model(modelData);
            },
            getNetworkTypes: function() {
                getNetworkTypesDeferred = $.Deferred();
                getNetworkTypes(getNetworkTypesDeferred);
                return getNetworkTypesDeferred;
            },
            getPaymentTypes: function() {
                return baseService.fetch({
                    url: "enumerations/paymentType?REGION={region}"
                }, {
                    "region": region
                });

            },
            getCountries: function() {
                getCountriesDeferred = $.Deferred();
                getCountries(getCountriesDeferred);
                return getCountriesDeferred;
            },
            getBankDetailsBIC: function(code) {
                getBankDetailsBICDeferred = $.Deferred();
                getBankDetailsBIC(code, getBankDetailsBICDeferred);
                return getBankDetailsBICDeferred;
            },
            getBankDetailsNCC: function(code, region) {
                getBankDetailsNCCDeferred = $.Deferred();
                getBankDetailsNCC(code, region, getBankDetailsNCCDeferred);
                return getBankDetailsNCCDeferred;
            },
            getBankDetailsDCC: function(code) {
                getBankDetailsDCCDeferred = $.Deferred();
                getBankDetailsDCC(code, getBankDetailsDCCDeferred);
                return getBankDetailsDCCDeferred;
            },
            getCorrespondenceCharges: function() {
                getCorrespondenceChargesDeferred = $.Deferred();
                getCorrespondenceCharges(getCorrespondenceChargesDeferred);
                return getCorrespondenceChargesDeferred;
            },
            makeAdhocPayment: function(payload) {
                makeAdhocPaymentDeferred = $.Deferred();
                makeAdhocPayment(payload, makeAdhocPaymentDeferred);
                return makeAdhocPaymentDeferred;
            },
            getBranches: function() {
                getBranchesDeferred = $.Deferred();
                getBranches(getBranchesDeferred);
                return getBranchesDeferred;
            },
            getTransferPurpose: function(paymentType) {
                getTransferPurposeDeferred = $.Deferred();
                getTransferPurpose(paymentType, getTransferPurposeDeferred);
                return getTransferPurposeDeferred;
            },
            validateAndFetchCurrency: function(accountNumber) {
                validateAndFetchCurrencyDeferred = $.Deferred();
                validateAndFetchCurrency(accountNumber, validateAndFetchCurrencyDeferred);
                return validateAndFetchCurrencyDeferred;
            },
            getHostDate: function() {
                getHostDateDeferred = $.Deferred();
                getHostDate(getHostDateDeferred);
                return getHostDateDeferred;
            },
            deletePayment: function(paymentId) {
                deletePaymentDeferred = $.Deferred();
                deletePayment(paymentId, deletePaymentDeferred);
                return deletePaymentDeferred;
            },
            fetchBankConfiguration: function() {
                bancConfigurationDeffered = $.Deferred();
                fetchBankConfiguration(bancConfigurationDeffered);
                return bancConfigurationDeffered;
            },
            listAccessPoint: function() {
                listAccessPointDeferred = $.Deferred();
                listAccessPoint(listAccessPointDeferred);
                return listAccessPointDeferred;
            },
            confirmPayment: function(paymentId, paymentType) {
                confirmPaymentDeferred = $.Deferred();
                confirmPayment(paymentId, paymentType, confirmPaymentDeferred);
                return confirmPaymentDeferred;
            },
            readPayee: function(gId, pId, type) {
                readPayeeDeferred = $.Deferred();
                readPayee(gId, pId, type, readPayeeDeferred);
                return readPayeeDeferred;
            },
            getPayeeList: function() {
                getPayeeListDeferred = $.Deferred();
                getPayeeList(getPayeeListDeferred);
                return getPayeeListDeferred;
            },
            getMaintenances: function() {
                return baseService.fetch({
                    url: "maintenances/payments"
                });
            },
            getUpcomingPaymentsList: function(fromDate, toDate, creditAccountId) {
                return baseService.fetch({
                    url: "payments/instructions?status=ACTIVE&type=ALL&fromDate={fromDate}&toDate={toDate}&creditAccountId={creditAccountId}"
                }, {
                    fromDate: fromDate,
                    toDate: toDate,
                    creditAccountId: creditAccountId
                });
            }
        };
    };
    return new AdhocPaymentModel();
});