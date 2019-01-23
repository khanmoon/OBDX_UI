define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payments-money-transfer",
    "framework/js/constants/constants",
    "ojs/ojknockout"
], function(oj, ko, $, internationalModel, ResourceBundle, Constants) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.userSegment = Constants.userSegment;
        self.payments = ResourceBundle.payments;
        self.paymentData = ko.observable();
        self.charges = ko.observable();
        self.chargesDescription = ko.observable();
        self.stageTwo = ko.observable(false);
        self.transferNow = ko.observable(true);
        self.paymentId = ko.observable();
        self.chargesData = ko.observable();
        self.chargesSum = ko.observable();
        self.serviceChargesLoaded = ko.observable(false);
        void(self.params.transferData && self.params.transferData.reviewMode && rootParams.dashboard.headerName(self.params.transferData.header));
        self.confirmScreenDetails = rootParams.rootModel.confirmScreenDetails;
        self.dealDetails = ko.observable();
        self.dealType = ko.observable();
        self.exchangeRate = ko.observable();
        self.payeeDetails = self.params.mode === "approval" ? ko.observable() : self.payeeDetails;
        self.instructionId = ko.observable(ko.utils.unwrapObservable(self.params.data ? self.params.data.instructionId : self.params.transferData.instructionId));
        if (self.instructionId()) {
            self.transferNow(false);
            self.paymentId(self.instructionId());
            self.stageTwo(true);
        } else if (self.params.data || self.params.transferData.paymentId) {
            self.paymentId(ko.utils.unwrapObservable(self.params.data ? self.params.data.paymentId : self.params.transferData.paymentId));
            self.stageTwo(true);
        }
        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec"){
                var errors = jqXHR.responseJSON.transactionAction.transactionDTO.errors;
                return errors && errors[0] && errors[0].errorMessage?errors[0].errorMessage:self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg;
            }else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
        };
        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
        };

        function serviceCharges(urlParams) {
            internationalModel.getServiceCharges(urlParams).then(function(chargesResponse) {
                if (chargesResponse && chargesResponse.paymentChargeDetails && chargesResponse.paymentChargeDetails.length > 0) {
                    self.chargesData(chargesResponse.paymentChargeDetails);
                    var sum = 0,
                        j = 0;
                    for (j = 0; j < self.chargesData && self.chargesData().length; j++) {
                        sum = sum + self.chargesData()[j].serviceCharge.amount;
                    }
                    self.chargesSum(sum);
                    self.serviceChargesLoaded(true);
                    self.stageTwo(true);
                }
            });
        }

        function responseHandler(data) {
            self.paymentData(data);
            var transactionAmount, transactionCurrency, debitAccountId;
            if (self.transferNow()) {
                self.charges(data.payoutDetails.charges);
                transactionAmount = data.payoutDetails.amount.amount;
                transactionCurrency = data.payoutDetails.amount.currency;
                debitAccountId = data.payoutDetails.debitAccountId.value;
            } else {
                self.charges(data.payoutDetails.instructionDetails.charges);
                transactionAmount = data.payoutDetails.instructionDetails.amount.amount;
                transactionCurrency = data.payoutDetails.instructionDetails.amount.currency;
                debitAccountId = data.payoutDetails.instructionDetails.debitAccountId.value;
            }
            if (self.paymentData().payoutDetails && self.paymentData().payoutDetails.dealId) {
                internationalModel.fetchForexDealList(self.paymentData().payoutDetails.dealId).then(function(data) {
                    self.dealDetails(false);
                    self.dealType(data.forexDealDTO[0].dealType === "S" ? self.payments.moneytransfer.spot : self.payments.moneytransfer.forward);
                    self.exchangeRate(rootParams.baseModel.formatCurrency(data.forexDealDTO[0].rate, data.forexDealDTO[0].rateType === "B" ? data.forexDealDTO[0].buyAmount.currency : data.forexDealDTO[0].sellAmount.currency));
                    ko.tasks.runEarly();
                    self.dealDetails(true);
                });
            } else if (self.paymentData().payoutDetails.instructionDetails && self.paymentData().payoutDetails.instructionDetails.dealId) {
                internationalModel.fetchForexDealList(self.paymentData().payoutDetails.instructionDetails.dealId).then(function(data) {
                    self.dealDetails(false);
                    self.dealType(data.forexDealDTO[0].dealType === "S" ? self.payments.moneytransfer.spot : self.payments.moneytransfer.forward);
                    self.exchangeRate(rootParams.baseModel.formatCurrency(data.forexDealDTO[0].rate, data.forexDealDTO[0].rateType === "B" ? data.forexDealDTO[0].buyAmount.currency : data.forexDealDTO[0].sellAmount.currency));
                    ko.tasks.runEarly();
                    self.dealDetails(true);
                });
            }

            internationalModel.getChargesMaintenances().then(function(maintenanceRespnse) {
                var checkServiceChargesEnabled, s = 0;
                if (self.userSegment === "RETAIL") {
                    for (s = 0; s < maintenanceRespnse.configurationDetails.length; s++) {
                        checkServiceChargesEnabled = (ko.utils.arrayFirst(maintenanceRespnse.configurationDetails, function(config) {
                            return config.propertyId === "RETAIL_SERVICE_CHARGES_ENABLED";
                        }).propertyValue) === "Y";
                    }
                } else if (self.userSegment === "CORP") {
                    for (s = 0; s < maintenanceRespnse.configurationDetails.length; s++) {
                        checkServiceChargesEnabled = (ko.utils.arrayFirst(maintenanceRespnse.configurationDetails, function(config) {
                            return config.propertyId === "CORPORATE_SERVICE_CHARGES_ENABLED";
                        }).propertyValue) === "Y";
                    }
                }
                if (checkServiceChargesEnabled) {
                    serviceCharges({
                        paymentType: "INTERNATIONALFT",
                        transactionAmount: transactionAmount,
                        transactionCurrency: transactionCurrency,
                        debitAccountId: debitAccountId
                    });
                }
            });

            var bankDetailsPromise;
            if (self.params.mode === "approval") {
                var bankDetailsCode, network;
                if (self.paymentData().payoutDetails.instructionDetails) {
                    bankDetailsCode = self.paymentData().payoutDetails.payeeDetails.bankDetails.code;
                    network = self.paymentData().payoutDetails.payeeDetails.bankDetails.codeType;
                    self.payeeDetails({
                        accountType: "INTERNATIONAL",
                        accountNumber: self.paymentData().payoutDetails.payeeDetails.accountNumber,
                        accountName: self.paymentData().payoutDetails.payeeDetails.accountName
                    });
                } else {
                    bankDetailsCode = self.paymentData().payeeDetails.bankDetails.code;
                    network = self.paymentData().payeeDetails.bankDetails.codeType;
                    self.payeeDetails({
                        accountType: "INTERNATIONAL",
                        accountNumber: self.paymentData().payeeDetails.accountNumber,
                        accountName: self.paymentData().payeeDetails.accountName
                    });
                }
                if (network === "SWI")
                    bankDetailsPromise = internationalModel.getBankDetailsBIC(bankDetailsCode);
                else if (network === "NAC")
                    bankDetailsPromise = internationalModel.getBankDetailsNCC(bankDetailsCode);
                else if (network === "SPE")
                    self.payeeDetails().accountBranch = self.paymentData().payeeDetails ? self.paymentData().payeeDetails.bankDetails : self.paymentData().payoutDetails.payeeDetails.bankDetails;
            } else
                bankDetailsPromise = Promise.resolve();
            if (self.shareMessage) {
                self.shareMessage(rootParams.baseModel.format(self.shareMessage(), {
                    amount: data.payoutDetails.instructionDetails ? rootParams.baseModel.formatCurrency(data.payoutDetails.instructionDetails.amount.amount, data.payoutDetails.instructionDetails.amount.currency) : rootParams.baseModel.formatCurrency(data.payoutDetails.amount.amount, data.payoutDetails.amount.currency),
                    transferTo: data.payoutDetails.instructionDetails ? data.payoutDetails.payeeDetails.nickName : data.payeeDetails.nickName,
                    valueDate: data.payoutDetails.instructionDetails ? rootParams.baseModel.formatDate(data.payoutDetails.instructionDetails.startDate) : rootParams.baseModel.formatDate(data.payoutDetails.valueDate)
                }));
            }
            var confirmScreenDetailsArray;
            Promise.all([
                bankDetailsPromise,
                internationalModel.getCharges()
            ]).then(function(response) {
                var bankDetailsRes = response[0],
                    chargesRes = response[1];
                if (bankDetailsRes) {
                    self.payeeDetails().accountBranch = {
                        code: bankDetailsRes.code,
                        name: bankDetailsRes.name,
                        branch: bankDetailsRes.branchName,
                        address: bankDetailsRes.branchAddress.line1,
                        city: bankDetailsRes.branchAddress.city,
                        country: bankDetailsRes.branchAddress.country
                    };
                }
                if (chargesRes.enumRepresentations !== null) {
                    for (var i = 0; i < chargesRes.enumRepresentations[0].data.length; i++) {
                        if (self.charges() === chargesRes.enumRepresentations[0].data[i].code) {
                            self.chargesDescription(chargesRes.enumRepresentations[0].data[i].description);
                            break;
                        }
                    }
                }
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.moneytransfer.transferTo,
                            value: data.payoutDetails.instructionDetails ? data.payoutDetails.payeeDetails.nickName : data.payeeDetails.nickName
                        },
                        {
                            label: self.payments.moneytransfer.amount,
                            value: data.payoutDetails.instructionDetails ? rootParams.baseModel.formatCurrency(data.payoutDetails.instructionDetails.amount.amount, data.payoutDetails.instructionDetails.amount.currency) : rootParams.baseModel.formatCurrency(data.payoutDetails.amount.amount, data.payoutDetails.amount.currency)
                        }
                    ],
                    [{
                            label: self.payments ? self.payments.payee.accountNumber : self.payments.moneytransfer.accountNumber,
                            value: self.payeeDetails().accountNumber
                        },
                        {
                            label: self.payments ? self.payments.payee.accountType : self.payments.moneytransfer.accountType,
                            value: self.payments.payee.type.INTERNATIONAL
                        }
                    ],
                    [{
                            label: self.payments.payee.branchDetails,
                            value: [
                                self.payeeDetails().accountBranch.code,
                                self.payeeDetails().accountBranch.name,
                                self.payeeDetails().accountBranch.branch,
                                self.payeeDetails().accountBranch.address,
                                self.payeeDetails().accountBranch.city,
                                self.payeeDetails().accountBranch.country
                            ]
                        },
                        {
                            label: self.payments.moneytransfer.paymentdetails,
                            value: data.payoutDetails.instructionDetails ? data.payoutDetails.instructionDetails.otherDetails.line1 : data.payoutDetails.otherDetails.line1
                        }
                    ],
                    [{
                            label: self.payments.moneytransfer.transferfrom,
                            value: data.payoutDetails.instructionDetails ? data.payoutDetails.instructionDetails.debitAccountId.displayValue : data.payoutDetails.debitAccountId.displayValue
                        },
                        {
                            label: self.payments.moneytransfer.transferon,
                            value: data.payoutDetails.instructionDetails ? rootParams.baseModel.formatDate(data.payoutDetails.instructionDetails.startDate) : rootParams.baseModel.formatDate(data.payoutDetails.valueDate)
                        }
                    ]
                ].concat(data.payoutDetails && data.payoutDetails.dealId ? [
                    [{
                        label: self.payments.moneytransfer.dealNumber,
                        value: data.payoutDetails.dealId
                    }]
                ] : []).concat(data.payoutDetails.instructionDetails && data.payoutDetails.instructionDetails.dealId ? [
                    [{
                        label: self.payments.moneytransfer.dealNumber,
                        value: data.payoutDetails.instructionDetails.dealId
                    }]
                ] : []);
                if (typeof self.confirmScreenDetails === "function")
                    self.confirmScreenDetails(confirmScreenDetailsArray);
                else if (self.confirmScreenExtensions) {
                    $.extend(self.confirmScreenExtensions, {
                        isSet: true,
                        eReceiptRequired: true,
                        taskCode: "PC_F_IT",
                        confirmScreenDetails: confirmScreenDetailsArray,
                        confirmScreenMsgEval: self.getConfirmScreenMsg,
                        confirmScreenStatusEval: self.getConfirmScreenStatus,
                        template: "confirm-screen/payments-template"
                    });
                }
                self.stageTwo(true);
            });
        }
        if (self.isMultiplePayment) {
            self.transferNow(rootParams.isTransferNow);
            responseHandler(self.params.data);
        } else {
            internationalModel.getPayoutData(self.paymentId(), "payouts", "international", self.transferNow()).done(function(data) {
                responseHandler(data);
            });
        }
    };
});