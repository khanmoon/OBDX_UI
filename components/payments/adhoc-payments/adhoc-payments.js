define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/adhoc-payments",
    "framework/js/constants/constants",
    "ojs/ojinputnumber",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojdatetimepicker",
    "ojs/ojdialog",
    "ojs/ojselectcombobox",
    "framework/js/constants/constants-payments"
], function(oj, ko, $, AdhocPaymentModel, ResourceBundle, Constants) {
    "use strict";
    return function(rootParams) {
        var self = this,
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(AdhocPaymentModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.payments = ResourceBundle.payments;
        rootParams.dashboard.headerName(self.payments.addhocinternalheader);
        self.payload = getNewKoModel().adhocPaymentModel;
        self.hostDate = ko.observable();
        self.currentDate = ko.observable();
        self.tomorrow = ko.observable();
        self.yesterday = ko.observable();
        self.dayAfterTomorrow = ko.observable();
        self.refreshLookup = ko.observable(true);
        self.additionalBankDetails = ko.observable(null);
        self.accountNumber = ko.observable();
        self.ConfirmaccountNumber = ko.observable();
        self.accountName = ko.observable();
        self.internal = ko.observable({});
        self.reviewMode = true;
        self.transferMode = ko.observable();
        self.confirmScreenDetails = ko.observable();
        self.transactionPurposeList = ko.observableArray();
        self.purpose = ko.observable();
        self.otherPurposeValue = ko.observable();
        self.otherPurpose = ko.observable(false);
        self.currentAccountType = ko.observable("INTERNAL");
        self.refreshAmountComponent = ko.observable(true);
        self.transferAmount = ko.observable();
        self.transferCurrency = ko.observable();
        self.customCurrencyURL = ko.observable();
        self.isStandingInstruction = ko.observable(false);
        self.ispeerToPeer = ko.observable(false);
        self.transferOn = ko.observable();
        self.transferLater = ko.observable(false);
        self.transferTo = ko.observable();
        self.valuedate = ko.observable();
        self.frequency = ko.observable();
        self.model = ko.observable();
        self.srcAccount = ko.observable();
        self.additionalDetailsFrom = ko.observable();
        self.initialLimitVisibility = ko.observable(false);
        self.customLimitType = ko.observable("");
        self.enableLimitLink = ko.observable(false);
        self.region = ko.observable("INDIA");
        self.sepaType = ko.observable();
        self.isComponentLoaded = ko.observable(false);
        self.currentRelationType = ko.observable("ACC");
        self.selectedComponent = ko.observable("adhoc-payments");
        self.internationalNetworkTypes = ko.observableArray();
        self.domesticNetworkTypes = ko.observableArray();
        self.loadAccessPointList = ko.observable(false);
        self.paymentTypeLoaded = ko.observable(false);
        self.isChargesLoaded = ko.observable(false);
        self.isTransactionPurposeListLoaded = ko.observable(true);
        self.transactionPurposeList = ko.observableArray();
        self.transactionPurposeMap = {};
        self.chargesList = ko.observableArray();
        self.AdhocFlag = ko.observable(true);
        self.oinNumber = ko.observable();
        self.oinDescription = ko.observable();

        self.paymentTypes = ko.observableArray();
        self.isNetworkTypesLoaded = ko.observable(false);
        self.networkTypesMap = {};
        self.paymentTypesMap = {};
        self.isPaymentTypesLoaded = ko.observable(false);
        self.countries = ko.observableArray();
        self.countriesMap = {};
        self.isCountriesLoaded = ko.observable(false);
        self.additionalBankDetails = ko.observable(null);
        self.charges = ko.observable();
        self.otherDetails = ko.observable();
        self.network = ko.observable();
        self.bankDetailsCode = ko.observable();
        self.bankName = ko.observable();
        self.bankAddress = ko.observable();
        self.country = ko.observable();
        self.city = ko.observable();
        self.payeeNickName = ko.observable();
        self.correspondenceCharge = ko.observable("");
        self.correspondenceCharges = ko.observableArray();
        self.invoiceNumber = ko.observable();
        self.note = ko.observable();
        self.userSegment = Constants.userSegment;
        self.clearingCodeType = ko.observable();
        self.isPurposeListLoaded = ko.observable(true);
        self.refreshAccountInputTF = ko.observable(true);
        self.currentTask = ko.observable("PC_F_INTRNL");
        self.stageOne = ko.observable(true);
        self.viewlimits = ko.observable(false);
        self.stageTwo = ko.observable(false);
        self.readData = ko.observable();
        self.requestPageLoad = ko.observable(false);
        self.externalReferenceId = ko.observable();
        self.paymentId = ko.observable();
        self.paymentTransferData = ko.observable();
        self.payeeDetails = ko.observable();
        self.formattedToday = ko.observable();
        self.formattedTomorrow = ko.observable();
        self.formattedDayAfterTomorrow = ko.observable();
        self.payeeListExpandAll = ko.observableArray();
        self.addPayeeInGroup = ko.observable();
        self.adhocPayeeDetails = ko.observable();
        self.p2pAddPayeeAs = ko.observable("existing-payee");
        self.groupValid = ko.observable();
        rootParams.baseModel.registerElement([
            "comment-box",
            "amount-input",
            "confirm-screen",
            "bank-look-up",
            "modal-window",
            "account-input",
            "internal-account-input"
        ]);
        rootParams.baseModel.registerComponent("transfer-view-limits", "financial-limits");
        rootParams.baseModel.registerComponent("review-adhoc-payments", "payments");
        rootParams.baseModel.registerComponent("warning-message-dialog", "payee");
        rootParams.baseModel.registerComponent("payment-money-transfer", "payments");
        rootParams.baseModel.registerComponent("bank-account-payee", "payee");
        self.accountNumber.subscribe(function(value) {
            if (self.currentAccountType() === "INTERNAL" && value !== "" && value.indexOf("undefined") === -1) {
                AdhocPaymentModel.validateAndFetchCurrency(value).done(function(data) {
                    self.customCurrencyURL("payments/currencies?type=INTERNALFT&currency=" + data.currencyCode);
                });
            }
        });
        self.purposeChanged = function(event) {
            if (event.detail.value) {
                self.otherPurpose(event.detail.value === "OTH_Other");
                if ((event.detail.value !== "OTH_Other")) {
                    self.otherPurposeValue("");
                }
            }
        };
        self.loadAccessPointList = ko.observable(false);
        self.selectedChannelTypeName = ko.observable();
        self.selectedChannelType = ko.observable();
        self.selectedChannelIndex = ko.observable();
        self.selectedChannel = ko.observable(false);

        self.channelTypeChangeHandler = function() {
            if (self.selectedChannelIndex() !== null) {
                self.selectedChannel(false);
                ko.tasks.runEarly();
                self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
                self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
                self.selectedChannel(true);
            }
        };
        self.channelList = ko.observableArray();
        AdhocPaymentModel.listAccessPoint().done(function(data) {
            self.channelList(data.accessPointListDTO);
            self.loadAccessPointList(true);
        });
        self.channelPopup = function() {
            var popup1 = document.querySelector("#channel-popup");

            if (popup1.isOpen()) {
                popup1.close();
            } else {
                popup1.open("channel-disclaimer");
            }
        };
        var todate, dt, fromDate, checkUpcomingPayment, configuredDays;
        self.currentDateLoaded = ko.observable(false);

        function fetchHostDate() {
            AdhocPaymentModel.getHostDate().done(function(data) {
                fromDate = oj.IntlConverterUtils.dateToLocalIso(new Date(data.currentDate.valueDate));
                todate = new Date(data.currentDate.valueDate);
                self.requestPageLoad(false);
                dt = new Date(data.currentDate.valueDate);
                self.formattedToday(dt);
                self.currentDate(rootParams.baseModel.formatDate(dt));
                var tomorrow = new Date(data.currentDate.valueDate);
                tomorrow.setDate(dt.getDate() + 1);
                self.formattedTomorrow(tomorrow);
                self.tomorrow(rootParams.baseModel.formatDate(tomorrow));
                var dayAfterTomorrow = new Date(data.currentDate.valueDate);
                dayAfterTomorrow.setDate(tomorrow.getDate() + 1);
                self.formattedDayAfterTomorrow(dayAfterTomorrow);
                self.currentDateLoaded(true);
                self.requestPageLoad(true);
                self.isComponentLoaded(true);

                AdhocPaymentModel.getMaintenances().then(function(maintenances) {
                    checkUpcomingPayment = (ko.utils.arrayFirst(maintenances.configurationDetails, function(config) {
                        return config.propertyId === "CHECK_UPCOMING_PAYMENT";
                    }).propertyValue) === "Y";
                    if (checkUpcomingPayment) {
                        configuredDays = Number(ko.utils.arrayFirst(maintenances.configurationDetails, function(config) {
                            return config.propertyId === "CHECK_UPCOMING_PAYMENT_FOR_DAYS";
                        }).propertyValue);
                        todate = oj.IntlConverterUtils.dateToLocalIso(new Date(dt.setDate(dt.getDate() + configuredDays)));
                    }
                });


            });
        }
        fetchHostDate();

        function setNetwork() {
            if (self.region() === "INDIA" && self.currentAccountType() !== "INTERNATIONAL")
                self.payload.genericPayout.network = self.network();
            else
                self.payload.genericPayee.network = self.network;
        }

        function checkUpcomingPaymentsList() {
            AdhocPaymentModel.getUpcomingPaymentsList(fromDate, todate, self.accountNumber()).then(function(upcomingPaymentsList) {
                if (upcomingPaymentsList && upcomingPaymentsList.instructionsList && upcomingPaymentsList.instructionsList.length > 0) {
                    rootParams.baseModel.showMessages(null, [rootParams.baseModel.format(self.payments.warningMessage, { X: configuredDays })], "INFO");
                }
            });
        }

        function validationFailed() {
            var accountInfoValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker")),
                internationalValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("internationalTracker")),
                networkCodeValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("verify-code-tracker") || document.getElementById("verify-swiftCode-tracker") || document.getElementById("verify-ncc-tracker") || document.getElementById("verify-bank-details-tracker")),
                amountFromTransferMoneyValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("paymentsTracker")),
                noteValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("note-validator"));
            return accountInfoValidationFailed || networkCodeValidationFailed || internationalValidationFailed || amountFromTransferMoneyValidationFailed || noteValidationFailed;
        }

        function setDomesticpaymentType() {
            if (self.transferOn() === "now") {
                if (self.region() === "INDIA") {
                    self.payload.paymentType = "INDIADOMESTICFT";
                } else if (self.region() === "UK") {
                    self.payload.paymentType = "UKPAYMENTS";
                } else if (self.region() === "SEPA") {
                    if (self.sepaType() === "CRT") {
                        self.payload.paymentType = "SEPACREDITTRANSFER";
                    } else if (self.sepaType() === "CAT") {
                        self.payload.paymentType = "SEPACARDPAYMENT";
                    }
                }
            } else if (self.transferOn() === "later") {
                if (self.region() === "INDIA") {
                    self.payload.paymentType = "INDIADOMESTICFT_PAYLATER";
                } else if (self.region() === "UK") {
                    self.payload.paymentType = "UKPAYMENTS_PAYLATER";
                } else if (self.region() === "SEPA") {
                    if (self.sepaType() === "CRT")
                        self.payload.paymentType = "SEPACREDITTRANSFER_PAYLATER";
                    else if (self.sepaType() === "CAT")
                        self.payload.paymentType = "SEPACARDPAYMENT_PAYLATER";
                }
            }
        }

        self.wraperFunction = function() {
            if (validationFailed()) {
                return;
            }
            var accNumber = self.accountNumber();
            if (self.currentAccountType() === "INTERNAL") {
                self.payload.genericPayee.accountNumber = self.accountNumber();
            }
            if (self.currentAccountType() === "INTERNAL" || self.currentAccountType() === "DOMESTIC") {
                var purposeInitials = self.purpose() ? self.purpose().split("_") : "";
                self.payload.genericPayout.purpose = purposeInitials[0];
            }
            self.payload.genericPayee.accountName = self.accountName;
            self.payload.genericPayee.name = self.accountName;
            self.payload.genericPayee.nickName = self.accountName;
            if (self.region() === "UK") {
                self.payload.genericPayee.ukPaymentType = self.paymentType();
                self.paymentTypeChanged({detail : {
                    value : self.paymentType()
                }});
            }
            if (self.region() === "SEPA" && self.currentAccountType() === "DOMESTIC") {
                self.payload.genericPayee.sepaType = self.paymentType();
                self.payload.genericPayout.sepaDomestic = {
                    "amount": {
                        "currency": self.transferCurrency(),
                        "amount": self.transferAmount()
                    },
                    "oinNumber": self.oinNumber(),
                    "oinDescription": self.oinDescription()
                };
            } else {
                self.payload.genericPayout.sepaDomestic = null;
            }

            if (self.currentAccountType() === "INTERNATIONAL" || self.currentAccountType() === "DOMESTIC") {
                self.payload.genericPayee.accountNumber = accNumber;
                self.payload.genericPayee.bankDetails.code = self.bankDetailsCode();
                setNetwork();

            }
            if (self.currentAccountType() === "INTERNATIONAL") {
                self.payload.genericPayout.charges = self.charges()[0].split("_")[0];
                self.payload.genericPayout.otherDetails.line1 = self.otherDetails;
                if (self.network() === "SPE") {
                    self.payload.genericPayee.bankDetails.name = self.bankName;
                    self.payload.genericPayee.bankDetails.address = self.bankAddress;
                    self.payload.genericPayee.bankDetails.city = self.city;
                    self.payload.genericPayee.bankDetails.country = self.country()[0];
                }
            }
            self.payload.genericPayout.amount.currency = self.transferCurrency();
            self.payload.genericPayout.amount.amount = self.transferAmount();
            self.payload.genericPayout.debitAccountId.value = self.srcAccount();
            self.payload.genericPayout.startDate = self.transferOn() === "now"?null:self.valuedate();
            self.payload.genericPayout.remarks = self.note();
            if (self.transferOn() === "later") {
                self.payload.genericPayout.frequency = "10";
            }
            self.payload.genericPayout.purposeText = self.otherPurposeValue();
            if (self.currentAccountType() === "INTERNAL") {
                if (self.transferOn() === "now")
                    self.payload.paymentType = "INTERNALFT";
                else
                    self.payload.paymentType = "INTERNALFT_PAYLATER";

            } else if (self.currentAccountType() === "DOMESTIC") {
                setDomesticpaymentType();
            } else if (self.currentAccountType() === "INTERNATIONAL") {
                if (self.transferOn() === "now") {
                    self.payload.paymentType = "INTERNATIONALFT";
                } else if (self.transferOn() === "later") {
                    self.payload.paymentType = "INTERNATIONALFT_PAYLATER";
                }
            }
            AdhocPaymentModel.makeAdhocPayment(ko.toJSON(self.payload)).done(function(data) {
                document.getElementById("message-box").closeAll(function(message) {
                    return message.severity === "error";
                });
                if (checkUpcomingPayment) {
                    checkUpcomingPaymentsList();
                }
                self.readData = data;
                self.paymentId(self.readData.paymentId);
                self.stageOne(!self.stageOne());
                self.stageTwo(!self.stageTwo());
            });
        };
        self.paymentType = ko.observable();
        self.paymentTypeChanged = function(event) {
            self.additionalBankDetails(null);
            self.refreshLookup(false);
            if (self.region() === "UK") {
                if (event.detail.value === "URG") {
                    self.clearingCodeType("SWI");
                    self.network("SWIFT");
                } else if (event.detail.value === "NOU") {
                    self.clearingCodeType("NAC");
                    self.network("SORT");
                } else if (event.detail.value === "FAS") {
                    self.network("SORT");
                    self.clearingCodeType("NAC");
                }
            }
            self.refreshLookup(true);
        };

        var networkCodeTypeMap = {
            FAS : "SWI",
            URG : "SWI",
            NOU : "NAC",
            CAT : "SWI",
            CRT : "SWI"
        };
        function paymentTypesForRegions() {
            $.when(AdhocPaymentModel.getPaymentTypes()).then(function(paymentTypesResponse) {
                self.paymentTypes.removeAll();
                if (self.currentAccountType() === "DOMESTIC" && (self.region() === "UK" || self.region() === "SEPA")) {
                    for (var i = 0; i < paymentTypesResponse.enumRepresentations[0].data.length; i++) {
                        self.paymentTypes.push({
                            text: paymentTypesResponse.enumRepresentations[0].data[i].description,
                            value: paymentTypesResponse.enumRepresentations[0].data[i].code
                        });
                        self.paymentTypesMap[paymentTypesResponse.enumRepresentations[0].data[i].code] = paymentTypesResponse.enumRepresentations[0].data[i].description;
                    }
                    self.clearingCodeType(networkCodeTypeMap[self.paymentTypes()[0].value]);
                    if (!self.paymentType())
                        self.paymentType(self.paymentTypes()[0].value);
                    if (self.paymentType() === "CAT" || "CRT")
                        self.sepaType(self.paymentType());
                    self.paymentTypeChanged({detail : {
                        value : self.paymentTypes()[0].value
                    }});
                    self.isPaymentTypesLoaded(true);
                    self.paymentTypeLoaded(true);
                }
            });
        }

        function networkTypesForRegions() {
            $.when(AdhocPaymentModel.getNetworkTypes(), AdhocPaymentModel.getCountries()).then(function(networkTypesResponse, countriesResponse) {
                if (self.domesticNetworkTypes().length === 0 && self.currentAccountType() === "DOMESTIC" && self.region() === "INDIA") {
                    for (var i = 0; i < networkTypesResponse.enumRepresentations[0].data.length; i++) {
                        self.domesticNetworkTypes.push({
                            text: networkTypesResponse.enumRepresentations[0].data[i].description,
                            value: networkTypesResponse.enumRepresentations[0].data[i].code
                        });
                        self.networkTypesMap[networkTypesResponse.enumRepresentations[0].data[i].code] = networkTypesResponse.enumRepresentations[0].data[i].description;
                    }
                } else if (self.internationalNetworkTypes().length === 0 && self.currentAccountType() === "INTERNATIONAL") {
                    for (var j = 0; j < networkTypesResponse.enumRepresentations[0].data.length; j++) {
                        self.internationalNetworkTypes.push({
                            text: networkTypesResponse.enumRepresentations[0].data[j].description,
                            value: networkTypesResponse.enumRepresentations[0].data[j].code
                        });
                        self.networkTypesMap[networkTypesResponse.enumRepresentations[0].data[j].code] = networkTypesResponse.enumRepresentations[0].data[j].description;
                    }
                    for (var z = 0; z < countriesResponse.enumRepresentations[0].data.length; z++) {
                        self.countries.push({
                            text: countriesResponse.enumRepresentations[0].data[z].description,
                            value: countriesResponse.enumRepresentations[0].data[z].code
                        });
                        self.countriesMap[countriesResponse.enumRepresentations[0].data[z].code] = countriesResponse.enumRepresentations[0].data[z].description;
                    }
                    self.isCountriesLoaded(true);
                }
                self.network(networkTypesResponse.enumRepresentations[0].data[0].code);
                ko.tasks.runEarly();
                self.isNetworkTypesLoaded(true);
            });
        }

        var cnfaccountValue;
        var accountValue;
        self.confirmValue = ko.observable();

        function AccountNoValidator_fn(value) {
            accountValue = value;
            if (value) {
                if (cnfaccountValue) {
                    if (value === cnfaccountValue) {
                        document.getElementById("confirmAccNumber").validate();
                    } else
                        throw new oj.ValidatorError("ERROR", self.payments.accountNoValidation);
                } else if (self.confirmValue()) {
                    if (value !== self.confirmValue())
                        throw new oj.ValidatorError("ERROR", self.payments.accountNoValidation);
                }
            }
        }

        function cnfAccountNoValidator_fn(value) {
            if ((self.accountNumber() && self.accountNumber() !== "") || value) {
                cnfaccountValue = value;
                if (accountValue !== cnfaccountValue) {
                    if (self.accountNumber() !== value) {
                        self.accountNumber("");
                        throw new oj.ValidatorError("ERROR", self.payments.accountNoValidation);
                    }
                } else if (accountValue === cnfaccountValue) {
                    self.confirmValue(cnfaccountValue);
                    cnfaccountValue = "";
                    AccountNoValidator_fn(accountValue);
                    document.getElementById("accNumber").validate();
                }
            } else
                throw new oj.ValidatorError("ERROR", self.payments.validationMessage);
        }

        self.accountNoValidator = [rootParams.baseModel.getValidator("ACCOUNT"), {
            "validate": AccountNoValidator_fn
        }];
        self.confirmAccountNoValidator = [{
            "validate": cnfAccountNoValidator_fn
        }];

        self.restrictedEvent = function() {
            $("#accNumber").bind("copy paste cut", function(e) {
                e.preventDefault();
            });
            $("#confirmAccNumber").bind("copy paste cut", function(e) {
                e.preventDefault();
            });
        };

        self.accountTypeChanged = function(event) {
            var data = event.detail;
            if (data.value !== data.previousValue) {
                document.getElementById("message-box").closeAll();
                self.isComponentLoaded(false);
                self.isNetworkTypesLoaded(false);
                self.transferOn("now");
                self.transferLater(false);
                self.transferLater(false);
                self.accountNumber("");
                self.ConfirmaccountNumber("");
                self.accountName("");
                self.transferAmount("");
                self.note("");
                self.bankDetailsCode("");
                if (self.currentRelationType() === "ACC" && data.value === "INTERNAL") {
                    rootParams.dashboard.headerName(self.payments.addhocinternalheader);
                    self.getPurposeList();
                    if (self.accountNumber() && self.accountNumber() !== "") {
                        AdhocPaymentModel.validateAndFetchCurrency(self.accountNumber()).done(function(data) {
                            self.customCurrencyURL("payments/currencies?type=INTERNALFT&currency=" + data.currencyCode);
                        });
                    } else {
                        self.customCurrencyURL("");
                    }
                } else if (self.currentRelationType() === "ACC" && data.value === "INTERNATIONAL") {
                    rootParams.dashboard.headerName(self.payments.addhocinternationalheader);
                    self.customCurrencyURL("payments/currencies?type=PC_F_IT");
                    AdhocPaymentModel.init("INTERNATIONAL");
                    networkTypesForRegions();
                } else if (self.currentRelationType() === "ACC" && data.value === "DOMESTIC") {
                    rootParams.dashboard.headerName(self.payments.addhocdomesticheader);
                    self.customCurrencyURL("payments/currencies?type=DOMESTICFT");
                    self.getPurposeList();
                    if (self.region() === "INDIA") {
                        AdhocPaymentModel.init("INDIA");
                        networkTypesForRegions();
                    } else if (self.region() === "UK") {
                        AdhocPaymentModel.init("UK");
                        paymentTypesForRegions();
                    } else if (self.region() === "SEPA") {
                        AdhocPaymentModel.init("SEPA");
                        paymentTypesForRegions();
                    }
                }
                self.setTaskCodeForPayNow();
                self.isComponentLoaded(true);
            }
        };
        self.openLookup = function() {
            $("#menuButtonDialog").trigger("openModal");
        };
        self.validateCode = [{
            "validate": function(value) {
                if (value.length < 1) {
                    return false;
                } else if (value.length > 11 || !/^[a-zA-Z0-9]+$/.test(value))
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.payments.payee.domestic.invalidError));
            }
        }];
        self.validateInterCode = [{
            "validate": function(value) {
                if (value.length < 1) {
                    return false;
                } else if (value.length > 20 || !/^[a-zA-Z0-9]+$/.test(value))
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.payments.payee.international.invalidError));
            }
        }];
        $(document).on("keyup", "#domSwiftCode", function() {
            $(this).val($(this).val().toUpperCase());
        });
        self.verifyCode = function() {
            var tracker;
            if (self.currentAccountType() === "DOMESTIC") {
                if (self.region() === "INDIA")
                    tracker = document.getElementById("verify-code-tracker");
                else if (self.region() === "UK") {
                    if (self.paymentType() === "NOU" || self.paymentType() === "FAS")
                        tracker = document.getElementById("verify-sortcode-tracker");
                    else if (self.paymentType() === "URG")
                        tracker = document.getElementById("verify-swiftCode-tracker");
                } else if (self.region() === "SEPA")
                    tracker = document.getElementById("verify-bankCode-tracker");
            } else if (self.currentAccountType() === "INTERNATIONAL") {
                if (self.network() === "SWI") {
                    tracker = document.getElementById("verify-swiftCode-tracker");
                } else if (self.network() === "NAC") {
                    tracker = document.getElementById("verify-ncc-tracker");
                }
            }
            if (!rootParams.baseModel.showComponentValidationErrors(tracker))
                return;

            if (self.network() === "SWI" || self.network() === "SWIFT") {
                AdhocPaymentModel.getBankDetailsBIC(self.bankDetailsCode()).done(function(data) {
                    self.additionalBankDetails(data);
                });
            } else if (self.network() === "NAC" || self.network() === "SORT") {
                AdhocPaymentModel.getBankDetailsNCC(self.bankDetailsCode(), self.region()).done(function(data) {
                    self.additionalBankDetails(data);
                });
            }else if (self.currentAccountType() === "DOMESTIC") {
                AdhocPaymentModel.getBankDetailsDCC(self.bankDetailsCode()).done(function(data) {
                    self.additionalBankDetails(data);
                });
            }
        };
        self.networkTypeChanged = function(event) {
            if (event.detail.value) {
                self.resetCode();
                if (self.network() === "NEFT") {
                    self.customLimitType("PC_F_DOM_NEFT");
                } else if (self.network() === "RTGS") {
                    self.customLimitType("PC_F_DOM_RTGS");
                } else if (self.network() === "IMPS") {
                    self.customLimitType("PC_F_DOM_IMPS");
                } else if (event.detail.value === "CRT") {
                    self.clearingCodeType("SWI");
                    self.customLimitType("PC_F_SEPA_CREDIT");
                    self.paymentType(event.detail.value);
                } else if (event.detail.value === "CAT") {
                    self.clearingCodeType("SWI");
                    self.customLimitType("PC_F_SEPA_CARD");
                    self.paymentType(event.detail.value);
                }
            }
        };
        self.resetCode = function() {
            ko.tasks.runEarly();
            self.bankDetailsCode(null);
            self.additionalBankDetails(null);
        };
        AdhocPaymentModel.getCorrespondenceCharges().done(function(data) {
            self.isChargesLoaded(false);
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.correspondenceCharges.push({
                    text: data.enumRepresentations[0].data[i].description,
                    value: data.enumRepresentations[0].data[i].code
                });
                self.chargesList[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
            ko.tasks.runEarly();
            self.isChargesLoaded(true);
        });
        self.correspondanceChrgFromFavourites = function() {
            if (self.params.relationshipNumber) {
                for (var j = 0; j < self.correspondenceCharges().length; j++) {
                    if (self.correspondenceCharges()[j].value === self.params.charges) {
                        self.charges(self.correspondenceCharges()[j].value + "_" + self.correspondenceCharges()[j].text);
                        break;
                    }
                }
            }
        };
        self.viewLimitsModalId = Date.now().toString();
        self.viewLimits = function() {
            self.viewlimits(false);
            if (self.currentAccountType() === "INTERNAL") {
                self.customLimitType("PC_F_INTRNL");
            } else if (self.currentAccountType() === "DOMESTIC") {
                self.customLimitType("PC_F_DOM_NEFT");
            } else if (self.currentAccountType() === "INTERNATIONAL") {
                self.customLimitType("PC_F_IT");
            }
            ko.tasks.runEarly();
            $("#" + self.viewLimitsModalId).trigger("openModal");
            self.viewlimits(true);
        };
        self.done = function() {
            $("#" + self.viewLimitsModalId).hide();
        };
        self.transferOnArray = [{
                id: "now",
                label: self.payments.moneytransfer.now
            },
            {
                id: "later",
                label: self.payments.moneytransfer.later
            }
        ];
        self.transferOn(self.transferOnArray[0].id);
        self.setTaskCodeForPayNow = function() {
            self.refreshAccountInputTF(false);
            switch (self.currentAccountType()) {
                case "INTERNAL":
                    self.currentTask("PC_F_INTRNL");
                    break;
                case "INTERNATIONAL":
                    self.currentTask("PC_F_IT");
                    break;
                case "DOMESTIC":
                    self.currentTask("PC_F_DOM");
                    break;
                default:
                    break;
            }
            self.refreshAccountInputTF(true);
        };
        self.setTaskCodeForInstruction = function() {
            self.refreshAccountInputTF(false);
            switch (self.currentAccountType()) {
                case "INTERNAL":
                    self.currentTask("PC_F_INTRNL");
                    break;
                case "INTERNATIONAL":
                    self.currentTask("PC_F_IT");
                    break;
                case "DOMESTIC":
                    self.currentTask("PC_F_DOM");
                    break;
                default:
                    break;
            }
            self.refreshAccountInputTF(true);
        };
        self.transferOnChange = function(event) {
            if (event.detail.value === "now" && event.detail.value !== event.detail.previousValue) {
                self.transferLater(false);
                self.setTaskCodeForPayNow();
                self.valuedate(self.formattedToday());
            } else {
                self.valuedate(null);
                self.transferLater(true);
                self.setTaskCodeForInstruction();
                if (self.transferTo() === "self") {
                    self.model(self.selfPayLaterPayload);
                }
            }
        };

        self.currencyParser = function(data) {
            var output = {};
            output.currencies = [];
            if (data) {
                if (data.currencyList !== null) {
                    self.transferCurrency(data.currencyList[0].code);
                    for (var i = 0; i < data.currencyList.length; i++) {
                        output.currencies.push({
                            code: data.currencyList[i].code,
                            description: data.currencyList[i].code
                        });
                    }
                }
            }
            return output;
        };
        self.getPurposeList = function() {
            AdhocPaymentModel.getTransferPurpose(self.currentAccountType()).done(function(data) {
                self.isPurposeListLoaded(false);
                if (data.linkageList.length > 0) {
                    if (data.linkageList && data.linkageList[0].purposeList && data.linkageList[0].purposeList.length > 0) {
                        self.transactionPurposeList.removeAll();
                        for (var i = 0; i < data.linkageList[0].purposeList.length; i++) {
                            self.transactionPurposeList.push({
                                text: data.linkageList[0].purposeList[i].description,
                                value: data.linkageList[0].purposeList[i].code
                            });
                        }
                    }
                }
                ko.tasks.runEarly();
                self.isPurposeListLoaded(true);
            });
        };
        self.getPurposeList();
        self.isCommentRequired = ko.observable();
        AdhocPaymentModel.fetchBankConfiguration().done(function(data) {
            self.region(data.bankConfigurationDTO.region);
            self.isCommentRequired(data.bankConfigurationDTO.region === "INDIA");
        });
        self.cancelDeletePayment = function() {
            document.getElementById("message-box").closeAll();
            self.stageOne(true);
            self.stageTwo(false);
            fetchHostDate();
            AdhocPaymentModel.deletePayment(self.paymentId());
        };
        self.confirmPayment = function() {
            AdhocPaymentModel.confirmPayment(self.paymentId(), self.payload.paymentType).done(function(data, status, jqXHR) {
                document.getElementById("message-box").closeAll();
                var successMessage, statusMessages;
                self.httpStatus = jqXHR.status;
                if ((self.userSegment === "CORP" && self.httpStatus && self.httpStatus !== 202) || self.userSegment === "RETAIL") {
                    successMessage = self.payments.common.confirmScreen.successMessage;
                    statusMessages = self.payments.common.completed;
                } else if (self.userSegment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                    successMessage = self.payments.common.confirmScreen.corpMaker;
                    statusMessages = self.payments.pendingApproval;
                }
                var header;
                switch (self.currentAccountType()) {
                    case "INTERNAL":
                        header = self.payments.addhocinternalheader;
                        break;
                    case "INTERNATIONAL":
                        header = self.payments.addhocinternationalheader;
                        break;
                    case "DOMESTIC":
                        header = self.payments.addhocdomesticheader;
                        break;
                    default:
                        break;
                }
                self.externalReferenceId(data.externalReferenceId);
                self.stageTwo(false);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: header,
                    isAdhoc: true,
                    confirmScreenExtensions: {
                        successMessage: successMessage,
                        statusMessages: statusMessages,
                        isSet: true,
                        eReceiptRequired: true,
                        taskCode: self.currentTask(),
                        confirmScreenDetails: self.confirmScreenDetails(),
                        template: "confirm-screen/payments-template"
                    }
                }, self);
            });
        };
        self.existingPayee = function() {
            var groupId = self.addPayeeInGroup();
            var obj = ko.utils.arrayFirst(self.payeeListExpandAll(), function(element) {
                return element.groupId === groupId;
            });
            self.createBankAccountPayee("manage-accounts", {
                payeeName: obj.payeeGroupName,
                payeeGroupId: groupId,
                isNew: false
            });
        };
        self.newPayee = function() {
            self.createBankAccountPayee("manage-accounts", { isNew: true });
        };
        self.createPayee = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("createpayee"))) {
                return;
            }
            void((self.p2pAddPayeeAs() === "existing-payee" && self.existingPayee()) || self.newPayee());
        };
        self.addAdhocPayee = function() {
            if (self.userSegment === "RETAIL") {
                AdhocPaymentModel.getPayeeList().done(function(data) {
                    if (data.payeeGroups.length === 0) {
                        self.newPayee();
                        return;
                    }
                    for (var i = 0; i < data.payeeGroups.length; i++) {
                        self.payeeListExpandAll.push({
                            payeeGroupName: data.payeeGroups[i].name,
                            payeeList: data.payeeGroups[i].listPayees,
                            groupId: data.payeeGroups[i].groupId
                        });
                    }
                    $("#p2p-payee").trigger("openModal");
                });
            } else {
                self.createBankAccountPayee("bank-account-payee", { isNew: true });
            }
        };
        self.createBankAccountPayee = function(component, params) {
            var type;
            if (self.currentAccountType() === "INTERNAL") {
                type = "internal";
                self.selectedComponent("internal-payee");
            } else if (self.currentAccountType() === "INTERNATIONAL") {
                type = "international";
                self.selectedComponent("international-payee");
            } else if (self.currentAccountType() === "DOMESTIC") {
                type = "domestic";
                if(self.region() === "INDIA"){
                    self.selectedComponent("domestic-payee");
                }else if(self.region() === "UK"){
                    self.selectedComponent("uk-payee");
                }else{
                    self.selectedComponent("sepa-payee");
                }
            }
            AdhocPaymentModel.readPayee(self.readData.groupId, self.readData.payeeId, type).done(function(data) {
                self.adhocPayeeDetails(data);
                rootParams.dashboard.loadComponent(component, {
                    selectedComponent: self.selectedComponent,
                    currentRelationType: self.currentRelationType,
                    currentAccountType: self.currentAccountType,
                    payeeAccountType : ko.observable(type),
                    accountNumber: self.accountNumber,
                    fromAdhoc: true,
                    region : self.region,
                    defaultTab: "bank-account-payee",
                    applicationType: "payee",
                    isNew: ko.observable(params.isNew),
                    payeeName: ko.observable(params.payeeName),
                    payeeId: ko.observable(self.readData.payeeId),
                    payeeNickName: self.payeeNickName,
                    sepaType: self.sepaType,
                    paymentType: self.paymentType,
                    accountName: self.accountName,
                    network: self.network,
                    bankDetailsCode: self.bankDetailsCode,
                    bankName: self.bankName,
                    bankAddress: self.bankAddress,
                    country: self.country,
                    city: self.city,
                    accessType: ko.observable("PRIVATE"),
                    payeeGroupId: ko.observable(params.payeeGroupId)
                }, self);
            });
        };
    };
});