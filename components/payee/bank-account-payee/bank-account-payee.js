define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/bank-account-payee",
    "framework/js/constants/constants",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojvalidationgroup"
], function(oj, ko, $, addPayeeModel, BaseLogger, ResourceBundle, Constants) {
    "use strict";
    return function(Params) {
        var self = this,
            i = 0,
            j = 0,
            limitsMap = {},
            limitExist = false,
            monthlyLimitExist = false,
            payeeLimitsMap = {},
            isPayeeGroupCreated = false,
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(addPayeeModel.getNewModel());
                return KoModel;
            };
        self.selectedComponent = ko.observable("internal-payee");
        self.currentRelationType = ko.observable("ACC");
        self.currentAccountType = ko.observable("INTERNAL");
        self.accountNumber = ko.observable();
        self.ConfirmaccountNumber = ko.observable();
        self.payeeName = ko.observable();
        self.payeeId = ko.observable();
        self.payeeNickName = ko.observable();
        self.sepaType = ko.observable();
        self.AdhocFlag = ko.observable(false);
        self.paymentType = ko.observable();
        self.accountName = ko.observable();
        self.network = ko.observable();
        self.bankDetailsCode = ko.observable();
        self.bankName = ko.observable();
        self.bankAddress = ko.observable();
        self.country = ko.observable();
        self.city = ko.observable();
        self.accessType = ko.observable("PRIVATE");
        self.payeeGroupId = ko.observable(null);
        self.isNew = ko.observable(true);
        self.region = ko.observable("INDIA");
        ko.utils.extend(self, Params.rootModel.params.fromAdhoc ? Params.rootModel.params : Params.rootModel.previousState ? Params.rootModel.previousState.retainedData : Params.rootModel);
        self.userSegment = Constants.userSegment;
        if (Params.rootModel.params) {
            self.payeeData = {
                name: Params.rootModel.params.name,
                id: Params.rootModel.params.id
            };
        }
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageFour = ko.observable(false);
        self.stageFive = ko.observable(false);
        self.stageTwoPointTwo = ko.observable(false);
        self.authKey = ko.observable();
        self.invalidOtpEntered = ko.observable(false);
        self.payments = ResourceBundle.payments;
        Params.dashboard.headerName(self.payments.addrecipient_header);
        self.isShared = ko.observable();
        self.model = ko.observable();
        self.payeeAccountType = typeof self.payeeAccountType === "function" ? self.payeeAccountType : ko.observable();
        self.isComponentLoaded = ko.observable(true);
        self.refreshLookup = ko.observable(true);
        self.additionalBankDetails = ko.observable(null);
        self.file = ko.observable();
        self.payeeGroupPayload = getNewKoModel().payeeGroup;
        self.internalPayeePayload = getNewKoModel().internalPayeeModel;
        self.domesticIndiaAccBasedPayeePayload = getNewKoModel().domesticIndiaAccBasedPayeeModel;
        self.domesticUKAccBasedPayeePayload = getNewKoModel().domesticUKAccBasedPayeeModel;
        self.domesticSepaAccBasedPayeePayload = getNewKoModel().domesticSepaAccBasedPayeeModel;
        self.internationalAccBasedPayeePayload = getNewKoModel().internationalAccBasedPayeeModel;
        self.payeeLimitModel = getNewKoModel().payeeLimitModel;
        self.setLimitClicked = ko.observable(false);
        self.setMonthlyLimitClicked = ko.observable(false);
        self.newLimitAmount = ko.observable();
        self.newMonthlyLimitAmount = ko.observable();
        self.tommDailyLimitAmount = ko.observable();
        self.tommMonthlyLimitAmount = ko.observable();
        self.effectiveSameDayFlag = ko.observable(false);
        self.showActivitySuccessMsg = ko.observable(false);
        self.limitCurrency = ko.observable();
        self.confirmScreenDetails = ko.observable();
        self.limitSetMessage = ko.observable();
        self.limitPackage = ko.observable({
            exists: false,
            data: null
        });
        self.countryCodeMap = {};
        if (self.payeeData.id) {
            self.payeeName(self.payeeData.name);
            self.payeeGroupId(self.payeeData.id);
            self.isNew(false);
        }
        addPayeeModel.init();
        addPayeeModel.fetchCountryCode().then(function(data) {
            var enumRepresentations = data.enumRepresentations;
            if (enumRepresentations !== null) {
                for (var j = 0; j < enumRepresentations[0].data.length; j++) {
                    self.countryCodeMap[enumRepresentations[0].data[j].code] = enumRepresentations[0].data[j].description;
                }
            }
        });
        addPayeeModel.assignedLimitPackages().done(function(assigned) {
            if (assigned.limitPackageDTOList[0].targetLimitLinkages.length > 0)
                self.limitCurrency(assigned.limitPackageDTOList[0].targetLimitLinkages[0].limits[0].currency);

            if (assigned.limitPackageDTOList && assigned.limitPackageDTOList[0].targetLimitLinkages && assigned.limitPackageDTOList[0].targetLimitLinkages.length > 0) {
                for (j = 0; j < assigned.limitPackageDTOList[0].targetLimitLinkages.length; j++) {
                    for (var k = 0; k < assigned.limitPackageDTOList[0].targetLimitLinkages[j].limits.length; k++) {
                        if (assigned.limitPackageDTOList[0].targetLimitLinkages[j].limits[k].limitType === "DUR") {
                            limitsMap[assigned.limitPackageDTOList[0].targetLimitLinkages[j].target.value] = assigned.limitPackageDTOList[0].targetLimitLinkages[j].limits[k];
                        }
                    }
                }
                self.createLimitsMessage("PC_F_INTRNL");
            }
        });

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
                        throw new oj.ValidatorError("ERROR", self.payments.payee.message.accountNoValidation);
                } else if (self.confirmValue()) {
                    if (value !== self.confirmValue())
                        throw new oj.ValidatorError("ERROR", self.payments.payee.message.accountNoValidation);
                }
            }
        }

        function cnfAccountNoValidator_fn(value) {
            if ((self.accountNumber() && self.accountNumber() !== "") || value) {
                cnfaccountValue = value;
                if (accountValue !== cnfaccountValue) {
                    if (self.accountNumber() !== value) {
                        self.accountNumber("");
                        throw new oj.ValidatorError("ERROR", self.payments.payee.message.accountNoValidation);
                    }
                } else if (accountValue === cnfaccountValue) {
                    self.confirmValue(cnfaccountValue);
                    cnfaccountValue = "";
                    AccountNoValidator_fn(accountValue);
                    document.getElementById("accNumber").validate();
                }
            } else
                throw new oj.ValidatorError("ERROR", self.payments.payee.message.validationMessage);
        }

        self.accountNoValidator = [Params.baseModel.getValidator("ACCOUNT"), {
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

        function getPayeeLimits() {
            addPayeeModel.getPayeeLimit().done(function(data) {
                if (data.limitPackageDTOList && data.limitPackageDTOList.length > 0) {
                    for (var k = 0; k < data.limitPackageDTOList.length; k++) {
                        if (data.limitPackageDTOList[k].targetLimitLinkages && data.limitPackageDTOList[k].targetLimitLinkages.length > 0) {
                            for (var i = 0; i < data.limitPackageDTOList[k].targetLimitLinkages.length; i++) {
                                if (data.limitPackageDTOList[k].targetLimitLinkages[i].target.type.id === "PAYEE") {
                                    if (data.limitPackageDTOList[k].targetLimitLinkages[i].limits && data.limitPackageDTOList[k].targetLimitLinkages[i].limits[0].periodicity) {
                                        if ((!data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate || new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate) > Params.baseModel.getDate()) && !(new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate) > Params.baseModel.getDate())) {
                                            if (!payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value])
                                                payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value] = {};
                                            for (var j = 0; j < data.limitPackageDTOList[k].targetLimitLinkages[i].limits.length; j++) {
                                                payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity] = {
                                                    periodicity: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity,
                                                    maxAmount: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].maxAmount,
                                                    effectiveDate: Params.baseModel.formatDate(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate),
                                                    expiryDate: Params.baseModel.formatDate(data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate),
                                                    isEffectiveFromTomorrow: new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate) > Params.baseModel.getDate()
                                                };
                                                payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity].maxAmount.amount = ko.observable(payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity].maxAmount.amount);
                                                if (data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity === "DAILY")
                                                    limitExist = true;
                                                else if (data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity === "MONTHLY")
                                                    monthlyLimitExist = true;
                                            }
                                        } else if (data.limitPackageDTOList[k].targetLimitLinkages.length > 0) {
                                            limitExist = true;
                                            monthlyLimitExist = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    self.limitPackage().data = data;
                }
            });
        }
        getPayeeLimits();
        self.CoolingPeriodDataSource = ko.observable();
        self.isCollingPeriodSlot = ko.observable(false);
        self.createLimitsMessage = function(taskcode) {
            var limitObject = limitsMap[taskcode];
            self.CoolingPeriodList = ko.observableArray();
            if (limitObject) {
                for (var l = 0; l < limitObject.durationLimitSlots.length; l++) {
                    var duration = 0;
                    self.isCollingPeriodSlot(true);
                    if (limitObject.durationLimitSlots[l].endDuration.days === 0 && limitObject.durationLimitSlots[l].endDuration.hours === 0 && limitObject.durationLimitSlots[l].endDuration.minutes !== 0) {
                        duration = Params.baseModel.format(self.payments.payee.coolingPeriod.minutes, { minutes: limitObject.durationLimitSlots[l].endDuration.minutes });
                    } else if (limitObject.durationLimitSlots[l].endDuration.days === 0 && limitObject.durationLimitSlots[l].endDuration.hours !== 0 && limitObject.durationLimitSlots[l].endDuration.minutes === 0) {
                        duration = Params.baseModel.format(self.payments.payee.coolingPeriod.hours, { hours: limitObject.durationLimitSlots[l].endDuration.hours });
                    } else if (limitObject.durationLimitSlots[l].endDuration.days !== 0 && limitObject.durationLimitSlots[l].endDuration.hours === 0 && limitObject.durationLimitSlots[l].endDuration.minutes === 0) {
                        duration = Params.baseModel.format(self.payments.payee.coolingPeriod.days, { days: limitObject.durationLimitSlots[l].endDuration.days });
                    } else if (limitObject.durationLimitSlots[l].endDuration.days !== 0 && limitObject.durationLimitSlots[l].endDuration.hours !== 0 && limitObject.durationLimitSlots[l].endDuration.minutes === 0) {
                        duration = Params.baseModel.format(self.payments.payee.coolingPeriod.daysHours, {
                            days: limitObject.durationLimitSlots[l].endDuration.days,
                            hours: limitObject.durationLimitSlots[l].endDuration.hours
                        });
                    } else if (limitObject.durationLimitSlots[l].endDuration.days !== 0 && limitObject.durationLimitSlots[l].endDuration.hours === 0 && limitObject.durationLimitSlots[l].endDuration.minutes !== 0) {
                        duration = Params.baseModel.format(self.payments.payee.coolingPeriod.daysMinutes, {
                            days: limitObject.durationLimitSlots[l].endDuration.days,
                            minutes: limitObject.durationLimitSlots[l].endDuration.minutes
                        });
                    } else if (limitObject.durationLimitSlots[l].endDuration.days === 0 && limitObject.durationLimitSlots[l].endDuration.hours !== 0 && limitObject.durationLimitSlots[l].endDuration.minutes !== 0) {
                        duration = Params.baseModel.format(self.payments.payee.coolingPeriod.hoursMinutes, {
                            hours: limitObject.durationLimitSlots[l].endDuration.hours,
                            minutes: limitObject.durationLimitSlots[l].endDuration.minutes
                        });
                    } else if (limitObject.durationLimitSlots[l].endDuration.days !== 0 && limitObject.durationLimitSlots[l].endDuration.hours !== 0 && limitObject.durationLimitSlots[l].endDuration.minutes !== 0) {
                        duration = Params.baseModel.format(self.payments.payee.coolingPeriod.daysHoursMinutes, {
                            days: limitObject.durationLimitSlots[l].endDuration.days,
                            hours: limitObject.durationLimitSlots[l].endDuration.hours,
                            minutes: limitObject.durationLimitSlots[l].endDuration.minutes
                        });
                    }
                    self.CoolingPeriodList.push({
                        duration: duration,
                        amount: Params.baseModel.formatCurrency(limitObject.durationLimitSlots[l].amount.amount, limitObject.durationLimitSlots[l].amount.currency)
                    });
                }
                self.CoolingPeriodDataSource(new oj.ArrayTableDataSource(self.CoolingPeriodList() || []));
            }
        };
        self.componentList = [
            { id: "internal-payee" },
            { id: "domestic-payee" },
            { id: "uk-payee" },
            { id: "sepa-payee" },
            { id: "international-payee" },
            { id: "payments-payee-list" },
            { id: "ifsc-lookup" }
        ];
        for (i = 0; i < self.componentList.length; i++) {
            Params.baseModel.registerComponent(self.componentList[i].id, "payee");
        }
        self.componentList = [{ id: "payments-money-transfer" }];
        for (i = 0; i < self.componentList.length; i++) {
            Params.baseModel.registerComponent(self.componentList[i].id, "payments");
        }
        Params.baseModel.registerElement("confirm-screen");
        self.model(self.model() || self.internalPayeePayload);
        self.payeeAccountType(self.payeeAccountType() || "internal");
        self.accountTypeChanged = function() {
            self.isComponentLoaded(false);
            self.isCollingPeriodSlot(false);
            if (self.currentRelationType() === "ACC" && self.currentAccountType() === "INTERNAL") {
                self.selectedComponent("internal-payee");
                self.model(self.internalPayeePayload);

                self.accountNumber("");
                self.ConfirmaccountNumber("");
                self.payeeNickName("");
                self.accountName("");

                self.createLimitsMessage("PC_F_INTRNL");
                self.payeeAccountType("internal");
            } else if (self.region() === "INDIA" && self.currentRelationType() === "ACC" && self.currentAccountType() === "DOMESTIC") {
                self.selectedComponent("domestic-payee");
                self.model(self.domesticIndiaAccBasedPayeePayload);

                self.accountNumber("");
                self.ConfirmaccountNumber("");
                self.payeeNickName("");
                self.accountName("");
                self.bankDetailsCode("");

                self.createLimitsMessage("PC_F_DOM_NEFT");
                self.payeeAccountType("domestic");
            } else if (self.region() === "UK" && self.currentRelationType() === "ACC" && self.currentAccountType() === "DOMESTIC") {
                self.selectedComponent("uk-payee");
                self.model(self.domesticUKAccBasedPayeePayload);

                self.accountNumber("");
                self.ConfirmaccountNumber("");
                self.payeeNickName("");
                self.accountName("");
                self.bankDetailsCode("");

                self.createLimitsMessage("PC_F_UK_URG");
                self.payeeAccountType("domestic");
            } else if (self.region() === "SEPA" && self.currentRelationType() === "ACC" && self.currentAccountType() === "DOMESTIC") {
                self.selectedComponent("sepa-payee");
                self.model(self.domesticSepaAccBasedPayeePayload);
                self.createLimitsMessage("PC_F_SEPA_CARD");
                self.payeeAccountType("domestic");
            } else if (self.currentRelationType() === "ACC" && self.currentAccountType() === "INTERNATIONAL") {
                self.model(self.internationalAccBasedPayeePayload);
                self.selectedComponent("international-payee");

                self.accountNumber("");
                self.ConfirmaccountNumber("");
                self.payeeNickName("");
                self.accountName("");
                self.bankDetailsCode("");
                self.createLimitsMessage("PC_F_IT");
                self.payeeAccountType("international");
            }
            if (self.payeeData && !self.payeeData.id) {
                self.payeeName("");
            }
            self.additionalBankDetails(null);
            self.network("");
            self.isComponentLoaded(true);
        };
        Params.baseModel.registerComponent("warning-message-dialog", "payee");
        self.networkTypeChanged = function(event) {
            if (event.detail.value === "value" && event.detail.previousValue !== event.detail.value) {
                self.resetCode();
                if (event.detail.value === "NEFT") {
                    self.createLimitsMessage("PC_F_DOM_NEFT");
                } else if (event.detail.value === "RTGS") {
                    self.createLimitsMessage("PC_F_DOM_RTGS");
                } else if (event.detail.value === "IMPS") {
                    self.createLimitsMessage("PC_F_DOM_IMPS");
                } else if (event.detail.value === "CRT") {
                    self.createLimitsMessage("PC_F_SEPA_CREDIT");
                } else if (event.detail.value === "CAT") {
                    self.createLimitsMessage("PC_F_SEPA_CARD");
                }
            }
        };
        self.resetCode = function() {
            self.bankDetailsCode(null);
            self.additionalBankDetails(null);
            ko.tasks.runEarly();
        };
        self.cancel = function() {
            if (!self.stageOne()) {
                self.cancelConfirmation();
                history.back();
            } else {
                Params.dashboard.openDashBoard(self.payments.cancelConfirm);
            }
        };
        self.cancelRecipient = function() {
            self.stageOne(true);
            self.stageTwo(false);
            self.currentRelationType("");
            if (self.payeeData === null) {
                self.payeeName("");
            }
        };
        self.cancelConfirmation = function() {
            if (self.payeeGroupId()) {
                addPayeeModel.readPayee(self.payeeGroupId(), self.payeeId(), self.payeeAccountType()).done(function(data) {
                    var status;
                    if (data.internalPayee) {
                        status = data.internalPayee.status;
                    } else if (data.domesticPayee) {
                        status = data.domesticPayee.status;
                    } else if (data.internationalPayee) {
                        status = data.internationalPayee.status;
                    }
                    if (status !== "ACT") {
                        addPayeeModel.deletePayee(self.payeeGroupId(), self.payeeId(), self.payeeAccountType()).done(function() {
                            isPayeeGroupCreated = false;
                        });
                    }
                });
            }
        };
        self.accessTypes = [{
                id: "PRIVATE",
                label: self.payments.payee.NONSHARED
            },
            {
                id: "PUBLIC",
                label: self.payments.payee.SHARED
            }
        ];
        self.addRecipient = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }
            if (self.accessType() === "PUBLIC") {
                self.isShared(true);
            }
            if (self.accessType() === "PRIVATE") {
                self.isShared(false);
            }
            if (self.currentRelationType() === "ACC" && self.currentAccountType() === "INTERNAL") {
                if (self.userSegment === "CORP") {
                    self.internalPayeePayload.isShared(self.isShared());
                }
                var accNumber = self.accountNumber();
                self.payeeAccountType("internal");
                self.internalPayeePayload.nickName = self.payeeNickName;
                self.internalPayeePayload.accountNumber(accNumber);
                self.internalPayeePayload.accountName = self.accountName;
                var internalPayeePayload = ko.toJSON(self.internalPayeePayload);
                addPayeeModel.addPayee(self.payeeGroupId(), self.payeeAccountType(), internalPayeePayload).done(function(data) {
                    self.payeeId(data.internalPayee.id);
                    self.readPayee();
                }).fail(function() {
                    self.deletePayeeGroup();
                });
            } else if (self.region() === "INDIA" && self.currentRelationType() === "ACC" && self.currentAccountType() === "DOMESTIC") {
                if (self.userSegment === "CORP") {
                    self.domesticIndiaAccBasedPayeePayload.indiaDomesticPayee.isShared(self.isShared());
                } else {
                    self.domesticIndiaAccBasedPayeePayload.indiaDomesticPayee.isShared();
                }
                self.payeeAccountType("domestic");
                self.domesticIndiaAccBasedPayeePayload.nickName = self.payeeNickName;
                self.domesticIndiaAccBasedPayeePayload.indiaDomesticPayee.accountNumber = self.accountNumber;
                self.domesticIndiaAccBasedPayeePayload.indiaDomesticPayee.accountName = self.accountName;
                self.domesticIndiaAccBasedPayeePayload.indiaDomesticPayee.bankDetails.code = self.bankDetailsCode;
                var domesticIndiaAccBasedPayeePayload = ko.toJSON(self.domesticIndiaAccBasedPayeePayload);
                addPayeeModel.addPayee(self.payeeGroupId(), self.payeeAccountType(), domesticIndiaAccBasedPayeePayload).done(function(data) {
                    self.payeeId(data.domesticPayee.id);
                    self.readPayee();
                }).fail(function() {
                    self.deletePayeeGroup();
                });
            } else if (self.region() === "UK" && self.currentRelationType() === "ACC" && self.currentAccountType() === "DOMESTIC") {
                if (self.userSegment === "CORP") {
                    self.domesticUKAccBasedPayeePayload.ukDomesticPayee.isShared(self.isShared());
                } else {
                    self.domesticUKAccBasedPayeePayload.ukDomesticPayee.isShared();
                }
                self.domesticUKAccBasedPayeePayload.nickName = self.payeeNickName;
                self.domesticUKAccBasedPayeePayload.ukDomesticPayee.paymentType = self.paymentType();
                self.domesticUKAccBasedPayeePayload.ukDomesticPayee.network = self.network();
                self.domesticUKAccBasedPayeePayload.ukDomesticPayee.accountName = self.accountName;
                self.domesticUKAccBasedPayeePayload.ukDomesticPayee.accountNumber = self.accountNumber;
                self.domesticUKAccBasedPayeePayload.ukDomesticPayee.bankDetails.code = self.bankDetailsCode;
                var domesticUKAccBasedPayeePayload = ko.toJSON(self.domesticUKAccBasedPayeePayload);
                addPayeeModel.addPayee(self.payeeGroupId(), self.payeeAccountType(), domesticUKAccBasedPayeePayload).done(function(data) {
                    self.payeeId(data.domesticPayee.id);
                    self.readPayee();
                }).fail(function() {
                    self.deletePayeeGroup();
                });
            } else if (self.region() === "SEPA" && self.currentRelationType() === "ACC" && self.currentAccountType() === "DOMESTIC") {
                if (self.userSegment === "CORP") {
                    self.domesticSepaAccBasedPayeePayload.sepaDomesticPayee.isShared(self.isShared());
                } else {
                    self.domesticSepaAccBasedPayeePayload.sepaDomesticPayee.isShared();
                }
                self.domesticSepaAccBasedPayeePayload.nickName = self.payeeNickName;
                self.domesticSepaAccBasedPayeePayload.sepaDomesticPayee.iban = self.accountNumber;
                self.domesticSepaAccBasedPayeePayload.sepaDomesticPayee.accountName = self.accountName;
                self.domesticSepaAccBasedPayeePayload.sepaDomesticPayee.sepaType = self.sepaType();
                self.domesticSepaAccBasedPayeePayload.sepaDomesticPayee.bankDetails.code = self.bankDetailsCode;
                var domesticSepaAccBasedPayeePayload = ko.toJSON(self.domesticSepaAccBasedPayeePayload);
                addPayeeModel.addPayee(self.payeeGroupId(), self.payeeAccountType(), domesticSepaAccBasedPayeePayload).done(function(data) {
                    self.payeeId(data.domesticPayee.id);
                    self.readPayee();
                }).fail(function() {
                    self.deletePayeeGroup();
                });
            } else if (self.currentRelationType() === "ACC" && self.currentAccountType() === "INTERNATIONAL") {
                if (self.userSegment === "CORP") {
                    self.internationalAccBasedPayeePayload.isShared(self.isShared());
                } else {
                    self.internationalAccBasedPayeePayload.isShared();
                }
                self.payeeAccountType("international");
                self.internationalAccBasedPayeePayload.nickName = self.payeeNickName;
                self.internationalAccBasedPayeePayload.accountNumber = self.accountNumber;
                self.internationalAccBasedPayeePayload.accountName = self.accountName;
                self.internationalAccBasedPayeePayload.network = self.network();
                if (self.network() === "SPE") {
                    self.internationalAccBasedPayeePayload.bankDetails.name = self.bankName;
                    self.internationalAccBasedPayeePayload.bankDetails.address = self.bankAddress;
                    self.internationalAccBasedPayeePayload.bankDetails.country = self.country()[0];
                    self.internationalAccBasedPayeePayload.bankDetails.city = self.city;
                }
                self.internationalAccBasedPayeePayload.bankDetails.code = self.bankDetailsCode;
                var internationalAccBasedPayeePayload = ko.toJSON(self.internationalAccBasedPayeePayload);
                addPayeeModel.addPayee(self.payeeGroupId(), self.payeeAccountType(), internationalAccBasedPayeePayload).done(function(data) {
                    self.payeeId(data.internationalPayee.id);
                    self.readPayee();
                }).fail(function() {
                    self.deletePayeeGroup();
                });
            }
        };
        Params.baseModel.registerComponent("review-internal-payee", "payee");
        Params.baseModel.registerComponent("review-domestic-payee", "payee");
        Params.baseModel.registerComponent("review-international-payee", "payee");
        self.readPayee = function() {
            addPayeeModel.readPayee(self.payeeGroupId(), self.payeeId(), self.payeeAccountType()).done(function(data) {
                self.isComponentLoaded(false);
                if (self.payeeAccountType() === "internal") {
                    self.model(ko.mapping.fromJS(data.internalPayee));
                    Params.dashboard.loadComponent("review-internal-payee", {
                        reviewMode: true,
                        payeeId: self.payeeId,
                        header: Params.dashboard.headerName(),
                        groupId: self.payeeGroupId,
                        retainedData: self
                    }, self);
                } else if (self.payeeAccountType() === "domestic") {
                    self.model(ko.mapping.fromJS(data.domesticPayee));
                    Params.dashboard.loadComponent("review-domestic-payee", {
                        reviewMode: true,
                        payeeId: self.payeeId,
                        header: Params.dashboard.headerName(),
                        groupId: self.payeeGroupId,
                        retainedData: self
                    }, self);
                } else if (self.payeeAccountType() === "international") {
                    self.model(ko.mapping.fromJS(data.internationalPayee));
                    Params.dashboard.loadComponent("review-international-payee", {
                        reviewMode: true,
                        payeeId: self.payeeId,
                        header: Params.dashboard.headerName(),
                        groupId: self.payeeGroupId,
                        retainedData: self
                    }, self);
                }
                self.stageOne(false);
                self.stageTwo(true);
                self.isComponentLoaded(true);
            });
        };
        self.createPayeeGroup = function() {
            var payeeFormValidationFailed = !Params.baseModel.showComponentValidationErrors(document.getElementById("tracker")),
                networkCodeValidationFailed = !Params.baseModel.showComponentValidationErrors(document.getElementById("verify-code-tracker") || document.getElementById("verify-swiftCode-tracker") || document.getElementById("verify-ncc-tracker") || document.getElementById("verify-bank-details-tracker")),
                payeeNameValidationFailed = !Params.baseModel.showComponentValidationErrors(document.getElementById("payee-name-tracker")),
                payeeNickNameValidationFailed = !Params.baseModel.showComponentValidationErrors(document.getElementById("payee-nickname-tracker"));

            if (payeeFormValidationFailed || networkCodeValidationFailed || payeeNameValidationFailed || payeeNickNameValidationFailed) {
                return;
            }

            if (self.userSegment !== "CORP" && (!self.isNew() || isPayeeGroupCreated)) {
                isPayeeGroupCreated = true;
                self.addRecipient();
                return;
            }
            self.payeeGroupPayload.name(self.payeeName());
            var payload = ko.toJSON(self.payeeGroupPayload);
            addPayeeModel.createPayeeGroup(payload).done(function(data) {
                self.payeeGroupId(data.payeeGroup.groupId);
                isPayeeGroupCreated = true;
                self.addRecipient();
            });
        };
        self.deletePayeeGroup = function() {
            if (self.isNew()) {
                addPayeeModel.deletePayeeGroup(self.payeeGroupId()).done(function() {
                    self.stageTwo(false);
                    self.stageTwoPointTwo(false);
                    self.stageOne(true);
                    isPayeeGroupCreated = false;
                });
            } else {
                self.stageTwo(false);
                self.stageTwoPointTwo(false);
                self.stageOne(true);
            }
        };
        self.transferObject = ko.observable();
        self.confirmRecipient = function() {
            addPayeeModel.confirmPayee(self.payeeGroupId(), self.payeeId(), self.payeeAccountType()).done(function(data, status, jqXHR) {
                self.httpStatus = jqXHR.status;
                var successMessage, statusMessages;
                if (self.userSegment === "CORP" && self.httpStatus && self.httpStatus !== 202) {
                    successMessage = self.payments.payee.confirmScreen.successMessage;
                    statusMessages = self.payments.common.completed;
                } else if (self.userSegment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                    successMessage = self.payments.payee.confirmScreen.corpMaker;
                    statusMessages = self.payments.payee.pendingApproval;
                } else if (self.userSegment !== "CORP") {
                    successMessage = self.payments.payee.confirmScreen.successMessage;
                    statusMessages = self.payments.common.success;
                }
                if (data.tokenAvailable) {
                    self.stageTwo(false);
                    self.baseURL = "payments/payeeGroup/" + self.payeeGroupId() + "/payees/" + self.payeeAccountType() + "/" + self.payeeId();
                    self.stageTwoPointTwo(true);
                } else {
                    self.transferObject({
                        id: self.payeeId(),
                        isStandingInstruction: false,
                        payeeType: self.currentAccountType(),
                        groupId: self.payeeGroupId(),
                        name: self.payeeName()
                    });
                    self.transactionName = self.payments.payee.transactionMessage[self.payeeAccountType()];
                    self.stageTwo(false);
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        hostReferenceNumber: data.externalReferenceId,
                        setLimit: true,
                        transactionName: self.payments.addrecipient_header,
                        confirmScreenExtensions: {
                            successMessage: successMessage,
                            statusMessages: statusMessages,
                            isSet: true,
                            confirmScreenDetails: self.confirmScreenDetails(),
                            template: "confirm-screen/payments-template"
                        },
                        pay: jqXHR.status !== 202
                    }, self);
                }
            });
        };
        Params.baseModel.registerComponent("payments-money-transfer", "payments");
        self.setPayeeLimit = function() {
            self.confirmPage = ko.observable(true);
            $("#view-edit-payee").trigger("openModal");
        };
        self.done = function() {
            $("#view-edit-payee").hide();
        };
        self.makePayment = function() {
            if (self.userSegment === "CORP") {
                Params.dashboard.loadComponent("payments-money-transfer", { transferDataPayee: self.transferObject() });
            } else {
                self.selectedTab = "";
                Params.dashboard.loadComponent("manage-accounts", {
                    applicationType: "payments",
                    defaultTab: "payments-money-transfer",
                    transferDataPayee: self.transferObject()
                });
            }
        };
        addPayeeModel.fetchEffectiveTodayDetails().done(function(data) {
            if (data.isEffectiveSameDay === "Y")
                self.effectiveSameDayFlag(true);
        });
        self.cancelDailyLimit = function() {
            var payeeLimit = payeeLimitsMap[self.payeeData.id];
            void(payeeLimit && payeeLimit.DAILY && self.newLimitAmount(payeeLimit.DAILY.maxAmount.amount()));
            self.setLimitClicked(false);
        };
        self.cancelMonthlyLimit = function() {
            var monthlyPayeeLimit = payeeLimitsMap[self.payeeData.id];
            void(monthlyPayeeLimit && monthlyPayeeLimit.MONTHLY && self.newMonthlyLimitAmount(monthlyPayeeLimit.MONTHLY.maxAmount.amount()));
            self.setMonthlyLimitClicked(false);
        };
        self.confirmEditPayeeDetails = function(data, periodicity) {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }
            var payload;
            getPayeeLimits();
            if (self.userSegment !== "CORP") {
                if (limitExist || monthlyLimitExist) {
                    self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages = [];
                    self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.push(getNewKoModel().payeeLimitModel.targetLimitLinkages()[0]);
                    payload = ko.mapping.fromJS(self.limitPackage().data.limitPackageDTOList[0]);
                    payload.targetLimitLinkages()[self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.length - 1].target.value(data.id);
                    var dailyLimitModel = getNewKoModel().limitModel;
                    var monthlyLimitModel = getNewKoModel().limitModel;
                    if (self.setLimitClicked() && self.newLimitAmount() > 0 && periodicity === "DAILY") {
                        dailyLimitModel.maxAmount.currency(self.limitCurrency());
                        dailyLimitModel.maxAmount.amount(self.newLimitAmount());
                        dailyLimitModel.periodicity("DAILY");
                        payload.targetLimitLinkages()[self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.length - 1].limits.push(dailyLimitModel);
                        if (self.payeeData.limitDetails && self.payeeData.limitDetails.MONTHLY.maxAmount.amount() && self.newMonthlyLimitAmount() > 0) {
                            monthlyLimitModel.maxAmount.currency(self.limitCurrency());
                            monthlyLimitModel.maxAmount.amount(self.newMonthlyLimitAmount());
                            monthlyLimitModel.periodicity("MONTHLY");
                            payload.targetLimitLinkages()[self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.length - 1].limits.push(monthlyLimitModel);
                        }
                    }
                    if (self.setMonthlyLimitClicked() && self.newMonthlyLimitAmount() > 0 && periodicity === "MONTHLY") {
                        monthlyLimitModel.maxAmount.currency(self.limitCurrency());
                        monthlyLimitModel.maxAmount.amount(self.newMonthlyLimitAmount());
                        monthlyLimitModel.periodicity("MONTHLY");
                        payload.targetLimitLinkages()[self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.length - 1].limits.push(monthlyLimitModel);
                        if (self.payeeData.limitDetails && self.payeeData.limitDetails.DAILY.maxAmount.amount() && self.newLimitAmount() > 0) {
                            dailyLimitModel.maxAmount.currency(self.limitCurrency());
                            dailyLimitModel.maxAmount.amount(self.newLimitAmount());
                            dailyLimitModel.periodicity("DAILY");
                            payload.targetLimitLinkages()[self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.length - 1].limits.push(dailyLimitModel);
                        }
                    }
                    payload = ko.toJSON(ko.mapping.toJS(payload));
                    addPayeeModel.putPayeeLimit(payload).done(function() {
                        if (periodicity === "DAILY" && self.newLimitAmount() > 0) {
                            self.payeeData.limitDetails.DAILY.maxAmount.amount(self.newLimitAmount());
                            self.payeeData.limitDetails.DAILY.maxAmount.currency = self.limitCurrency();
                            if (self.effectiveSameDayFlag()) {
                                self.payeeData.limitDetails.DAILY.isEffectiveFromTomorrow = false;
                            }
                            self.setLimitClicked(false);
                        }
                        if (periodicity === "MONTHLY" && self.newMonthlyLimitAmount() > 0) {
                            self.payeeData.limitDetails.MONTHLY.maxAmount.amount(self.newMonthlyLimitAmount());
                            self.payeeData.limitDetails.MONTHLY.maxAmount.currency = self.limitCurrency();
                            if (self.effectiveSameDayFlag()) {
                                self.payeeData.limitDetails.MONTHLY.isEffectiveFromTomorrow = false;
                            }
                            self.setMonthlyLimitClicked(false);
                        }
                        self.limitSetMessage(self.effectiveSameDayFlag() ? self.payments.payee.message.limitset : self.payments.payee.message.limitSetTom);
                        self.showActivitySuccessMsg(true);
                        setTimeout(function() {
                            self.showActivitySuccessMsg(false);
                        }, 4000);
                    }).fail(function() {
                        self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.pop();
                    });
                } else {
                    self.payeeLimitModel.targetLimitLinkages()[0].target.value(data.id);
                    if (self.setLimitClicked() && self.newLimitAmount() > 0 && periodicity === "DAILY") {
                        var postDailyLimitModel = getNewKoModel().limitModel;
                        postDailyLimitModel.maxAmount.currency(self.limitCurrency());
                        postDailyLimitModel.maxAmount.amount(self.newLimitAmount());
                        postDailyLimitModel.periodicity("DAILY");
                        self.payeeLimitModel.targetLimitLinkages()[0].limits.push(postDailyLimitModel);
                    }
                    if (self.setMonthlyLimitClicked() && self.newMonthlyLimitAmount() > 0 && periodicity === "MONTHLY") {
                        var postMonthlyLimitModel = getNewKoModel().limitModel;
                        postMonthlyLimitModel.maxAmount.currency(self.limitCurrency());
                        postMonthlyLimitModel.maxAmount.amount(self.newMonthlyLimitAmount());
                        postMonthlyLimitModel.periodicity("MONTHLY");
                        self.payeeLimitModel.targetLimitLinkages()[0].limits.push(postMonthlyLimitModel);
                    }
                    self.payeeLimitModel.currency(self.limitCurrency());
                    payload = ko.toJSON(self.payeeLimitModel);
                    addPayeeModel.postPayeeLimit(payload).done(function() {
                        if (periodicity === "DAILY" && self.newLimitAmount() > 0) {
                            self.payeeData.limitDetails.DAILY.maxAmount.amount(self.newLimitAmount());
                            self.payeeData.limitDetails.DAILY.maxAmount.currency = self.limitCurrency();
                            if (self.effectiveSameDayFlag()) {
                                self.payeeData.limitDetails.DAILY.isEffectiveFromTomorrow = false;
                            }
                            self.setLimitClicked(false);
                        }
                        if (periodicity === "MONTHLY" && self.newMonthlyLimitAmount() > 0) {
                            self.payeeData.limitDetails.MONTHLY.maxAmount.amount(self.newMonthlyLimitAmount());
                            self.payeeData.limitDetails.MONTHLY.maxAmount.currency = self.limitCurrency();
                            if (self.effectiveSameDayFlag()) {
                                self.payeeData.limitDetails.MONTHLY.isEffectiveFromTomorrow = false;
                            }
                            self.setMonthlyLimitClicked(false);
                        }
                        self.limitSetMessage(self.effectiveSameDayFlag() ? self.payments.payee.message.limitset : self.payments.payee.message.limitSetTom);
                        self.showActivitySuccessMsg(true);
                        setTimeout(function() {
                            self.showActivitySuccessMsg(false);
                        }, 4000);
                    });
                }
            }
        };
        self.setLimit = function() {
            self.setLimitClicked(true);
        };
        self.setMonthlyLimit = function() {
            self.setMonthlyLimitClicked(true);
        };
        var payeeLimit = payeeLimitsMap[self.payeeData.id] && payeeLimitsMap[self.payeeData.id].DAILY ? payeeLimitsMap[self.payeeData.id].DAILY : null;
        if (payeeLimit)
            self.newLimitAmount(payeeLimit.maxAmount.amount());
        else
            self.newLimitAmount("");
        var monthlyPayeeLimit = payeeLimitsMap[self.payeeData.id] && payeeLimitsMap[self.payeeData.id].MONTHLY ? payeeLimitsMap[self.payeeData.id].MONTHLY : "";
        if (monthlyPayeeLimit)
            self.newMonthlyLimitAmount(monthlyPayeeLimit.maxAmount.amount());
        else
            self.newMonthlyLimitAmount("");
        self.payeeData.limitDetails = {
            DAILY: {
                isEffectiveFromTomorrow: payeeLimit ? payeeLimit.isEffectiveFromTomorrow : "",
                maxAmount: payeeLimit ? payeeLimit.maxAmount : {
                    amount: ko.observable(),
                    currency: self.limitCurrency()
                }
            },
            MONTHLY: {
                isEffectiveFromTomorrow: monthlyPayeeLimit ? monthlyPayeeLimit.isEffectiveFromTomorrow : "",
                maxAmount: monthlyPayeeLimit ? monthlyPayeeLimit.maxAmount : {
                    amount: ko.observable(),
                    currency: self.limitCurrency()
                }
            }
        };
        self.additionalBankDetails.subscribe(function(newValue) {
            self.bankDetailsCode(newValue ? newValue.code : null);
        });
        self.tempcurrency = ko.observable("GBP");
        addPayeeModel.fetchBankConfiguration().done(function(data) {
            self.tempcurrency(data.bankConfigurationDTO.localCurrency);
            self.region(data.bankConfigurationDTO.region);
        });
        Params.baseModel.registerComponent("set-payee-limit", "payee");
        self.createLimit = function() {
            Params.dashboard.loadComponent("set-payee-limit", {}, self);
        };
    };
});