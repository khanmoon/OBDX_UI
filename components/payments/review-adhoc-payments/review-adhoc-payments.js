define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/adhoc-payments",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojbutton"
], function(oj, ko, $, ReviewAdhocPaymentModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function(Params) {
        var self = this,
            taskCode, confirmScreenDetailsArray;
        self.network = ko.observable();
        ko.utils.extend(self, Params.rootModel);
        self.payments = ResourceBundle.payments;
        self.paymentTemplate = ko.observable();
        self.payeeTemplate = ko.observable();
        self.payeeDetails = ko.observable();
        self.domesticPayeeType = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.paymentType = ko.observable();
        self.branchName = ko.observable();
        self.branchesLoaded = ko.observable(true);
        self.branches = ko.observableArray();
        self.branchCode = ko.observable();
        self.purpose = ko.observable();
        self.purposeText = ko.observable();
        self.chargesDescription = ko.observable();
        self.isCorrespondenceChargesLoaded = ko.observable(true);
        self.successMessage = ko.observable();
        self.adhocPaymentFlag = ko.observable(true);
        self.transactionPurposeList = ko.observableArray();
        self.isStandingInstruction = ko.observable();
        self.confirmScreenDetails = Params.rootModel.confirmScreenDetails;
        self.charges = ko.observable();
        self.paymentId = Params.readData ? Params.readData.paymentId : self.params.data ? self.params.data.paymentId() : self.params.paymentId();
        self.corpPSheader = "";
        self.paymentData = ko.observable();
        self.chargesData = ko.observable();
        self.chargesSum = ko.observable();
        self.valueDate = ko.observable();
        self.serviceChargesLoaded = ko.observable(false);
        self.payeeDetails = self.params.data ? self.params.data.payeeDetails ? self.params.data.payeeDetails() : self.params.payeeDetails ? self.params.payeeDetails() : ko.observable() : ko.observable();
        self.paymentTransferData = self.params.data ? self.params.data.paymentTransferData ? self.params.data.paymentTransferData() : self.params.paymentTransferData ? self.params.paymentTransferData() : ko.observable() : ko.observable();
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
            if (urlParams.network !== "IMPS") {
                ReviewAdhocPaymentModel.getServiceCharges(urlParams).then(function(chargesResponse) {
                    if (chargesResponse && chargesResponse.paymentChargeDetails && chargesResponse.paymentChargeDetails.length > 0) {
                        self.chargesData(chargesResponse.paymentChargeDetails);
                        var sum = 0,
                            j = 0;
                        for (j = 0; j < self.chargesData().length; j++) {
                            sum = sum + self.chargesData()[j].serviceCharge.amount;
                        }
                        self.chargesSum(sum);
                        self.serviceChargesLoaded(true);
                        self.dataLoaded(true);
                    }
                });
            }
        }

        function getinternalConfirmScreen() {
            confirmScreenDetailsArray = [
                [{
                        label: self.payments.moneytransfer.transferto,
                        value: self.paymentData().payeeDetails ? self.paymentData().payeeDetails.nickName : self.paymentTransferData().payeeDetails.nickName
                    },
                    {
                        label: self.payments.moneytransfer.amount,
                        value: self.paymentTransferData().amount ? Params.baseModel.formatCurrency(self.paymentTransferData().amount.amount, self.paymentTransferData().amount.currency) : Params.baseModel.formatCurrency(self.paymentTransferData().instructionDetails.amount.amount, self.paymentTransferData().instructionDetails.amount.currency)
                    }
                ],
                [{
                        label: self.payments ? self.payments.payee.accountnumber : self.payments.moneytransfer.accountNumber,
                        value: self.payeeDetails().accountNumber,
                        isInternalAccNo : true
                    },
                    {
                        label: self.payments ? self.payments.payee.accounttype : self.payments.moneytransfer.accounttype,
                        value: self.payments.payee.accinternal
                    }
                ],
                [{
                        label: self.payments.moneytransfer.transferfrom,
                        value: self.paymentTransferData().debitAccountId ? self.paymentTransferData().debitAccountId.displayValue : self.paymentTransferData().instructionDetails.debitAccountId.displayValue
                    },
                    {
                        label: self.payments.moneytransfer.transferon,
                        value: self.paymentTransferData().valueDate ? Params.baseModel.formatDate(self.paymentTransferData().valueDate) : Params.baseModel.formatDate(self.paymentTransferData().instructionDetails.startDate)
                    }
                ]
            ];
        }

        function getDomesticConfirmScreen() {
            if (self.payeeDetails().domesticPayeeType === "INDIA") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.moneytransfer.transferto,
                            value: self.paymentData().payeeDetails ? self.paymentData().payeeDetails.nickName : self.paymentTransferData().payeeDetails.nickName
                        },
                        {
                            label: self.payments.moneytransfer.amount,
                            value: self.paymentTransferData().amount ? Params.baseModel.formatCurrency(self.paymentTransferData().amount.amount, self.paymentTransferData().amount.currency) : Params.baseModel.formatCurrency(self.paymentTransferData().instructionDetails.amount.amount, self.paymentTransferData().instructionDetails.amount.currency)
                        }
                    ],
                    [{
                            label: self.payments ? self.payments.payee.accountnumber : self.payments.moneytransfer.accountNumber,
                            value: self.payeeDetails().indiaDomesticPayee.accountNumber
                        },
                        {
                            label: self.payments ? self.payments.payee.accounttype : self.payments.moneytransfer.accountType,
                            value: self.payments.payee.accdomestic
                        }
                    ],
                    [{
                            label: self.payments.payee.bankdetails,
                            value: [
                                self.payeeDetails().indiaDomesticPayee.bankDetails.code,
                                self.payeeDetails().indiaDomesticPayee.bankDetails.name,
                                self.payeeDetails().indiaDomesticPayee.bankDetails.city,
                                self.payeeDetails().indiaDomesticPayee.bankDetails.country
                            ]
                        },
                        {
                            label: self.payments.payee.payvia,
                            value: self.paymentData().payeeDetails ? (self.paymentData().payeeDetails.indiaDomesticPayee.network ? self.paymentData().payeeDetails.indiaDomesticPayee.network : self.network()) : self.paymentTransferData().payeeDetails.indiaDomesticPayee.network
                        }
                    ],
                    [{
                            label: self.payments.moneytransfer.transferfrom,
                            value: self.paymentTransferData().debitAccountId ? self.paymentTransferData().debitAccountId.displayValue : self.paymentTransferData().instructionDetails.debitAccountId.displayValue
                        },
                        {
                            label: self.payments.moneytransfer.transferon,
                            value: self.paymentTransferData().valueDate ? Params.baseModel.formatDate(self.paymentTransferData().valueDate) : Params.baseModel.formatDate(self.paymentTransferData().instructionDetails.startDate)
                        }
                    ]
                ];
            } else if (self.payeeDetails().domesticPayeeType === "UK") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.moneytransfer.transferto,
                            value: self.paymentData().payeeDetails ? self.paymentData().payeeDetails.nickName : self.paymentTransferData().payeeDetails.nickName
                        },
                        {
                            label: self.payments.moneytransfer.amount,
                            value: self.paymentTransferData().amount ? Params.baseModel.formatCurrency(self.paymentTransferData().amount.amount, self.paymentTransferData().amount.currency) : Params.baseModel.formatCurrency(self.paymentTransferData().instructionDetails.amount.amount, self.paymentTransferData().instructionDetails.amount.currency)
                        }
                    ],
                    [{
                            label: self.payments ? self.payments.payee.accountnumber : self.payments.moneytransfer.accountNumber,
                            value: self.payeeDetails().ukDomesticPayee.accountNumber
                        },
                        {
                            label: self.payments ? self.payments.payee.accounttype : self.payments.moneytransfer.accountType,
                            value: self.payments.payee.accdomestic
                        }
                    ],
                    [{
                            label: self.payments.payee.bankdetails,
                            value: [
                                self.payeeDetails().ukDomesticPayee.bankDetails.code,
                                self.payeeDetails().ukDomesticPayee.bankDetails.name,
                                self.payeeDetails().ukDomesticPayee.bankDetails.city,
                                self.payeeDetails().ukDomesticPayee.bankDetails.country
                            ]
                        },
                        {
                            label: self.payments.payee.payvia,
                            value: self.paymentData().payeeDetails ? (self.paymentData().payeeDetails.ukDomesticPayee.network ? self.paymentData().payeeDetails.ukDomesticPayee.network : self.network()) : self.paymentTransferData().payeeDetails.ukDomesticPayee.network
                        }
                    ],
                    [{
                            label: self.payments.moneytransfer.transferfrom,
                            value: self.paymentTransferData().debitAccountId ? self.paymentTransferData().debitAccountId.displayValue : self.paymentTransferData().instructionDetails.debitAccountId.displayValue
                        },
                        {
                            label: self.payments.moneytransfer.transferon,
                            value: self.paymentTransferData().valueDate ? Params.baseModel.formatDate(self.paymentTransferData().valueDate) : Params.baseModel.formatDate(self.paymentTransferData().instructionDetails.startDate)
                        }
                    ]
                ];

            } else if (self.payeeDetails().domesticPayeeType === "SEPA") {

                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.moneytransfer.transferto,
                            value: self.paymentData().payeeDetails ? self.paymentData().payeeDetails.nickName : self.paymentTransferData().payeeDetails.nickName
                        },
                        {
                            label: self.payments.moneytransfer.amount,
                            value: self.paymentTransferData().amount ? Params.baseModel.formatCurrency(self.paymentTransferData().amount.amount, self.paymentTransferData().amount.currency) : Params.baseModel.formatCurrency(self.paymentTransferData().instructionDetails.amount.amount, self.paymentTransferData().instructionDetails.amount.currency)
                        }
                    ],
                    [{
                            label: self.payments ? self.payments.payee.accountnumber : self.payments.moneytransfer.accountNumber,
                            value: self.payeeDetails().sepaDomesticPayee.accountNumber
                        },
                        {
                            label: self.payments ? self.payments.payee.accounttype : self.payments.moneytransfer.accountType,
                            value: self.payments.payee.accdomestic
                        }
                    ],
                    [{
                            label: self.payments.payee.bankdetails,
                            value: [
                                self.payeeDetails().sepaDomesticPayee.bankDetails.code,
                                self.payeeDetails().sepaDomesticPayee.bankDetails.name,
                                self.payeeDetails().sepaDomesticPayee.bankDetails.city,
                                self.payeeDetails().sepaDomesticPayee.bankDetails.country
                            ]
                        },
                        {
                            label: self.payments.payee.payvia,
                            value: self.paymentData().payeeDetails ? (self.paymentData().payeeDetails.sepaDomesticPayee.network ? self.paymentData().payeeDetails.sepaDomesticPayee.network : self.network()) : self.paymentTransferData().payeeDetails.sepaDomesticPayee.network
                        }
                    ],
                    [{
                            label: self.payments.moneytransfer.transferfrom,
                            value: self.paymentTransferData().debitAccountId ? self.paymentTransferData().debitAccountId.displayValue : self.paymentTransferData().instructionDetails.debitAccountId.displayValue
                        },
                        {
                            label: self.payments.moneytransfer.transferon,
                            value: self.paymentTransferData().valueDate ? Params.baseModel.formatDate(self.paymentTransferData().valueDate) : Params.baseModel.formatDate(self.paymentTransferData().instructionDetails.startDate)
                        }
                    ]
                ];
            }
        }

        function getInternationalConfirmScreen() {
            confirmScreenDetailsArray = [
                [{
                        label: self.payments.moneytransfer.transferto,
                        value: self.paymentData().payeeDetails ? self.paymentData().payeeDetails.nickName : self.paymentTransferData().payeeDetails.nickName
                    },
                    {
                        label: self.payments.moneytransfer.amount,
                        value: self.paymentTransferData().amount ? Params.baseModel.formatCurrency(self.paymentTransferData().amount.amount, self.paymentTransferData().amount.currency) : Params.baseModel.formatCurrency(self.paymentTransferData().instructionDetails.amount.amount, self.paymentTransferData().instructionDetails.amount.currency)
                    }
                ],
                [{
                        label: self.payments ? self.payments.payee.accountnumber : self.payments.moneytransfer.accountNumber,
                        value: self.payeeDetails().accountNumber
                    },
                    {
                        label: self.payments ? self.payments.payee.accounttype : self.payments.moneytransfer.accountType,
                        value: self.payments.payee.accinternational
                    }
                ],
                [{
                        label: self.payments.payee.bankdetails,
                        value: [
                            self.payeeDetails().bankDetails.code,
                            self.payeeDetails().bankDetails.name,
                            self.payeeDetails().bankDetails.city,
                            self.payeeDetails().bankDetails.country
                        ]
                    },
                    {
                        label: self.payments.moneytransfer.paymentdetails,
                        value: self.paymentTransferData().otherDetails ? self.paymentTransferData().otherDetails.line1 : self.paymentTransferData().instructionDetails.otherDetails.line1
                    }
                ],
                [{
                        label: self.payments.moneytransfer.transferfrom,
                        value: self.paymentTransferData().debitAccountId ? self.paymentTransferData().debitAccountId.displayValue : self.paymentTransferData().instructionDetails.debitAccountId.displayValue
                    },
                    {
                        label: self.payments.moneytransfer.transferon,
                        value: self.paymentTransferData().valueDate ? Params.baseModel.formatDate(self.paymentTransferData().valueDate) : Params.baseModel.formatDate(self.paymentTransferData().instructionDetails.startDate)
                    }
                ],
                [{
                    label: self.payments.payee.payvia,
                    value: self.paymentData().payeeDetails ? self.paymentData().payeeDetails.bankDetails.codeType : self.paymentTransferData().payeeDetails.bankDetails.codeType
                }]
            ];
        }

        function getDomesticData(data) {
            self.corpPSheader = Params.baseModel.format(self.payments.moneytransfer.corpheader, { transaction: self.payments.payee.accdomestic });
            if (data.domesticPayoutReadResponse)
                self.valueDate(data.domesticPayoutReadResponse.payoutDetails.valueDate);
            else if (data.domesticPayoutInstructionReadResponse)
                self.valueDate(data.domesticPayoutInstructionReadResponse.payoutDetails.instructionDetails.startDate);
            self.paymentTemplate("review-payment-domestic");
            self.payeeTemplate("review-domestic-payee");
            if (data.paymentType === "INDIADOMESTICFT" || data.paymentType === "INDIADOMESTICFT_PAYLATER")
                self.domesticPayeeType("INDIA");
            else if (data.paymentType === "UKPAYMENTS" || data.paymentType === "UKPAYMENTS_PAYLATER")
                self.domesticPayeeType("UK");
            else if (data.paymentType === "SEPACREDITTRANSFER" || data.paymentType === "SEPACARDPAYMENT" || data.paymentType === "SEPACREDITTRANSFER_PAYLATER" || data.paymentType === "SEPACARDPAYMENT_PAYLATER")
                self.domesticPayeeType("SEPA");
            taskCode = "PC_F_DOM";
            if (data.paymentType === "INDIADOMESTICFT" || data.paymentType === "UKPAYMENTS" || data.paymentType === "SEPACREDITTRANSFER" || data.paymentType === "SEPACARDPAYMENT") {
                self.paymentData(data.domesticPayoutReadResponse);
                self.purpose(data.domesticPayoutReadResponse.payoutDetails.purpose);
                if (self.purpose() === "OTH")
                    self.purposeText(data.domesticPayoutReadResponse.payoutDetails.purposeText);
                self.paymentTransferData(data.domesticPayoutReadResponse.payoutDetails);
            } else {
                self.paymentData(data.domesticPayoutInstructionReadResponse);
                self.purpose(data.domesticPayoutInstructionReadResponse.payoutDetails.instructionDetails.purpose);
                if (self.purpose() === "OTH")
                    self.purposeText(data.domesticPayoutInstructionReadResponse.payoutDetails.instructionDetails.purposeText);
                self.paymentTransferData(data.domesticPayoutInstructionReadResponse.payoutDetails);
            }
            self.payeeDetails(data.payeeReadResponse.payeeDTO);
            if (Params.payeeDetails) {
                Params.payeeDetails(data.payeeReadResponse.payeeDTO);
            }
            if (self.purpose() !== "OTH")
                self.getPurposeText();
            else
                self.dataLoaded(true);

        }

        ReviewAdhocPaymentModel.readAdhocPayment(self.paymentId).done(function(data) {
            if (data !== null) {
                self.paymentType(data.paymentType);

                var paymentType, transactionAmount, transactionCurrency, debitAccountId, networkType;
                if (data.paymentType === "INTERNATIONALFT" || data.paymentType === "INTERNATIONALFT_PAYLATER") {
                    paymentType = "INTERNATIONALFT";
                    self.corpPSheader = Params.baseModel.format(self.payments.moneytransfer.corpheader, { transaction: self.payments.payee.accinternational });
                    self.paymentTemplate("review-payment-international");
                    self.payeeTemplate("review-international-payee");
                    taskCode = "PC_F_IT";
                    if (data.paymentType === "INTERNATIONALFT") {
                        transactionAmount = data.internationalPayoutReadResponse.payoutDetails.amount.amount;
                        transactionCurrency = data.internationalPayoutReadResponse.payoutDetails.amount.currency;
                        debitAccountId = data.internationalPayoutReadResponse.payoutDetails.debitAccountId.value;
                        self.paymentData(data.internationalPayoutReadResponse);
                        self.charges(data.internationalPayoutReadResponse.payoutDetails.charges);
                        self.paymentTransferData(data.internationalPayoutReadResponse.payoutDetails);
                    } else {
                        transactionAmount = data.internationalPayoutInstructionReadResponse.payoutDetails.instructionDetails.amount.amount;
                        transactionCurrency = data.internationalPayoutInstructionReadResponse.payoutDetails.instructionDetails.amount.currency;
                        debitAccountId = data.internationalPayoutInstructionReadResponse.payoutDetails.instructionDetails.debitAccountId.value;
                        self.paymentData(data.internationalPayoutInstructionReadResponse);
                        self.charges(data.internationalPayoutInstructionReadResponse.payoutDetails.instructionDetails.charges);
                        self.paymentTransferData(data.internationalPayoutInstructionReadResponse.payoutDetails);
                    }
                    self.payeeDetails(data.payeeReadResponse.payeeDTO);
                    if (Params.payeeDetails) {
                        Params.payeeDetails(data.payeeReadResponse.payeeDTO);
                    }
                    networkType = data.payeeReadResponse.payeeDTO.network;
                    self.network(data.payeeReadResponse.payeeDTO.network);
                    self.getChargesDescription();
                    getInternationalConfirmScreen();
                } else if (data.paymentType === "INDIADOMESTICFT" || data.paymentType === "INDIADOMESTICFT_PAYLATER" || data.paymentType === "UKPAYMENTS" || data.paymentType === "UKPAYMENTS_PAYLATER" || data.paymentType === "SEPACREDITTRANSFER" || data.paymentType === "SEPACARDPAYMENT" || data.paymentType === "SEPACREDITTRANSFER_PAYLATER" || data.paymentType === "SEPACARDPAYMENT_PAYLATER") {
                    paymentType = data.paymentType.split("_")[0];
                    if (data.paymentType === "INDIADOMESTICFT" || data.paymentType === "UKPAYMENTS" || data.paymentType === "SEPACREDITTRANSFER" || data.paymentType === "SEPACARDPAYMENT") {
                        transactionAmount = data.domesticPayoutReadResponse.payoutDetails.amount.amount;
                        transactionCurrency = data.domesticPayoutReadResponse.payoutDetails.amount.currency;
                        debitAccountId = data.domesticPayoutReadResponse.payoutDetails.debitAccountId.value;
                        networkType = data.domesticPayoutReadResponse.payoutDetails.network;
                    } else {
                        transactionAmount = data.domesticPayoutInstructionReadResponse.payoutDetails.instructionDetails.amount.amount;
                        transactionCurrency = data.domesticPayoutInstructionReadResponse.payoutDetails.instructionDetails.amount.currency;
                        debitAccountId = data.domesticPayoutInstructionReadResponse.payoutDetails.instructionDetails.debitAccountId.value;
                        networkType = data.domesticPayoutInstructionReadResponse.payoutDetails.instructionDetails.network;
                    }
                    getDomesticData(data);
                    getDomesticConfirmScreen();
                } else if (data.paymentType === "INTERNALFT" || data.paymentType === "INTERNALFT_PAYLATER") {
                    self.corpPSheader = Params.baseModel.format(self.payments.moneytransfer.corpheader, { transaction: self.payments.payee.accinternal });
                    self.paymentTemplate("review-payment-internal");
                    self.payeeTemplate("review-internal-payee");
                    taskCode = "PC_F_INTRNL";
                    if (data.paymentType === "INTERNALFT") {
                        self.paymentData(data.internalTransferReadResponse);
                        self.purpose(data.internalTransferReadResponse.transferDetails.purpose);
                        if (self.purpose() === "OTH")
                            self.purposeText(data.internalTransferReadResponse.transferDetails.purposeText);
                        self.paymentTransferData(data.internalTransferReadResponse.transferDetails);
                    } else {
                        self.paymentData(data.internalTransferInstructionReadResponse);
                        self.purpose(data.internalTransferInstructionReadResponse.transferDetails.instructionDetails.purpose);
                        if (self.purpose() === "OTH")
                            self.purposeText(data.internalTransferInstructionReadResponse.transferDetails.instructionDetails.purposeText);
                        self.paymentTransferData(data.internalTransferInstructionReadResponse.transferDetails);
                    }
                    if (data.payeeReadResponse.payeeDTO) {
                        self.branchName(data.payeeReadResponse.payeeDTO.branchCode);
                    }
                    self.payeeDetails(data.payeeReadResponse.payeeDTO);
                    if (Params.payeeDetails) {
                        Params.payeeDetails(data.payeeReadResponse.payeeDTO);
                    }
                    if (self.purpose() !== "OTH")
                        self.getPurposeText();
                    else
                        self.dataLoaded(true);
                    getinternalConfirmScreen();
                }
                if (data.paymentType !== "INTERNALFT" && data.paymentType !== "INTERNALFT_PAYLATER") {
                    ReviewAdhocPaymentModel.getChargesMaintenances().then(function(maintenanceRespnse) {
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
                                paymentType: paymentType,
                                transactionAmount: transactionAmount,
                                transactionCurrency: transactionCurrency,
                                debitAccountId: debitAccountId,
                                network: networkType
                            });
                        }
                    });
                }
            }
            if (typeof self.confirmScreenDetails === "function")
                self.confirmScreenDetails(confirmScreenDetailsArray);
            else if (self.confirmScreenExtensions) {
                $.extend(self.confirmScreenExtensions, {
                    isSet: true,
                    eReceiptRequired: true,
                    taskCode: taskCode,
                    confirmScreenDetails: confirmScreenDetailsArray,
                    template: "confirm-screen/payments-template",
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus
                });
            }
        });
        self.getChargesDescription = function() {
            ReviewAdhocPaymentModel.getCharges().done(function(data) {
                if (data.enumRepresentations !== null) {
                    for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        if (self.charges() === data.enumRepresentations[0].data[i].code) {
                            self.chargesDescription(data.enumRepresentations[0].data[i].description);
                            break;
                        }
                    }
                }
                self.dataLoaded(true);
            });
        };
        self.getPurposeText = function() {
            ReviewAdhocPaymentModel.getTransferPurpose(self.paymentType()).done(function(data) {
                if (data.linkageList.length > 0) {
                    for (var i = 0; i < data.linkageList[0].purposeList.length; i++) {
                        self.transactionPurposeList.push({
                            text: data.linkageList[0].purposeList[i].description,
                            value: data.linkageList[0].purposeList[i].code
                        });
                        if (self.purpose() === data.linkageList[0].purposeList[i].code) {
                            self.purposeText(data.linkageList[0].purposeList[i].description);
                            break;
                        }
                    }
                }
                self.dataLoaded(true);
            });
        };
    };
});