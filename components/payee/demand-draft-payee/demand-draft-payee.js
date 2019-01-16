define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/demand-draft-payee",
    "framework/js/constants/constants",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojvalidationgroup"
], function(oj, ko, $, addPayeeModel, ResourceBundle, Constants) {
    "use strict";
    return function(Params) {
        var self = this,
            isPayeeGroupCreated = false,
            i = 0,
            j = 0,
            limitsMap = {},
            limitExist = false,
            monthlyLimitExist = false,
            payeeLimitsMap = {},
            payeeLimitsMap2 = {},
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(addPayeeModel.getNewModel());
                return KoModel;
            };
        self.currentRelationType = ko.observable("DD");
        self.currentAccountType = ko.observable("DOMESTIC");
        self.payeeName = ko.observable();
        self.payeeId = ko.observable();
        self.payeeNickName = ko.observable();
        self.addressDescription = ko.observable();
        self.payeeGroupId = ko.observable(null);
        self.addressDetails = getNewKoModel().addressDetails;
        self.selectedCountry = ko.observable();
        self.payeeGroupPayload = getNewKoModel().payeeGroup;
        self.internationalDDPayeePayload = getNewKoModel().internationalDDPayeeModel;
        self.domesticDDPayeePayload = getNewKoModel().domesticDDPayeeModel;
        self.payeeLimitModel = getNewKoModel().payeeLimitModel;
        self.accessType = ko.observable("PRIVATE");
        ko.utils.extend(self, Params.rootModel.previousState ? Params.rootModel.previousState.retainedData : Params.rootModel);
        self.payeeData = ko.toJS(Params.rootModel.params);
        self.payments = ResourceBundle.payments;
        self.common = ResourceBundle.payments.common;
        Params.dashboard.headerName(self.payments.addrecipient_header);
        self.userSegment = Constants.userSegment;
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageTwoPointTwo = ko.observable(false);
        self.stageFour = ko.observable(false);
        self.stageFive = ko.observable(false);
        self.authKey = ko.observable();
        self.invalidOtpEntered = ko.observable(false);
        self.stageThree = ko.observable(false);
        self.selectedComponent = ko.observable("domestic-demand-draft");
        self.isShared = ko.observable();
        self.model = ko.observable();
        self.type = ko.observable();
        self.isComponentLoaded = ko.observable();
        self.validationTracker = ko.observable();
        self.isNew = ko.observable(true);
        self.file = ko.observable();
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
        if (self.payeeData.id) {
            self.payeeName(self.payeeData.name);
            self.payeeGroupId(self.payeeData.id);
            self.isNew(false);
        }
        addPayeeModel.init();
        addPayeeModel.fetchEffectiveTodayDetails().done(function(data) {
            if (data.isEffectiveSameDay === "Y")
                self.effectiveSameDayFlag(true);
        });
        addPayeeModel.assignedLimitPackages().done(function(assigned) {
            if (assigned.limitPackageDTOList && assigned.limitPackageDTOList.length > 0)
                self.limitCurrency(assigned.limitPackageDTOList[0].targetLimitLinkages[0].limits[0].currency);
            if (assigned.limitPackageDTOList && assigned.limitPackageDTOList[0].targetLimitLinkages && assigned.limitPackageDTOList[0].targetLimitLinkages.length > 0) {
                for (j = 0; j < assigned.limitPackageDTOList[0].targetLimitLinkages.length; j++) {
                    for (var k = 0; k < assigned.limitPackageDTOList[0].targetLimitLinkages[j].limits.length; k++) {
                        if (assigned.limitPackageDTOList[0].targetLimitLinkages[j].limits[k].limitType === "DUR") {
                            limitsMap[assigned.limitPackageDTOList[0].targetLimitLinkages[j].target.value] = assigned.limitPackageDTOList[0].targetLimitLinkages[j].limits[k];
                        }
                    }
                }
                self.createLimitsMessage("PC_F_DOMDRAFT");
            }
        });

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
                                        if (!data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate && new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate) > Params.baseModel.getDate()) {
                                            if (!payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value])
                                                payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value] = {};
                                            for (var f = 0; f < data.limitPackageDTOList[k].targetLimitLinkages[i].limits.length; f++) {
                                                payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].periodicity] = {
                                                    periodicity: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].periodicity,
                                                    maxAmount: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].maxAmount,
                                                    effectiveDate: Params.baseModel.formatDate(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate),
                                                    expiryDate: Params.baseModel.formatDate(data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate),
                                                    isEffectiveFromTomorrow: new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate) > Params.baseModel.getDate()
                                                };
                                                payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].periodicity].maxAmount.amount = ko.observable(payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].periodicity].maxAmount.amount);
                                            }
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
            { id: "international-demand-draft" },
            { id: "domestic-demand-draft" }
        ];
        for (i = 0; i < self.componentList.length; i++) {
            Params.baseModel.registerComponent(self.componentList[i].id, "payee");
        }
        self.componentList = [{ id: "issue-demand-draft" }];
        for (j = 0; j < self.componentList.length; j++) {
            Params.baseModel.registerComponent(self.componentList[j].id, "payments");
        }
        Params.baseModel.registerElement("confirm-screen");
        Params.baseModel.registerComponent("review-demand-draft-payee", "payee");
        Params.baseModel.registerComponent("otp-verification", "payments");
        self.accessTypes = [{
                id: "PRIVATE",
                label: self.payments.payee.NONSHARED
            },
            {
                id: "PUBLIC",
                label: self.payments.payee.SHARED
            }
        ];
        self.transferObject = ko.observable();

        function refreshPayload() {
            if (self.currentAccountType() === "INTERNATIONAL") {
                self.internationalDDPayeePayload.nickName = "";
                self.internationalDDPayeePayload.payAtCity = "";
                self.internationalDDPayeePayload.payAtCountry = "";
            } else {
                self.domesticDDPayeePayload.nickName = "";
                self.domesticDDPayeePayload.payAtCity = "";
                self.domesticDDPayeePayload.payAtCountry = "";
            }
        }

        self.accountTypeChanged = function() {
            self.isComponentLoaded(false);
            self.isCollingPeriodSlot(false);
            if (self.currentRelationType() === "DD" && self.currentAccountType() === "INTERNATIONAL") {
                self.selectedComponent("international-demand-draft");
                refreshPayload();
                self.model(self.internationalDDPayeePayload);
                self.createLimitsMessage("PC_F_ID");
                self.type("demandDraft");
            } else if (self.currentRelationType() === "DD" && self.currentAccountType() === "DOMESTIC") {
                self.selectedComponent("domestic-demand-draft");
                refreshPayload();
                self.model(self.domesticDDPayeePayload);
                self.createLimitsMessage("PC_F_DOMDRAFT");
                self.type("demandDraft");
            }
            if (self.payeeData && !self.payeeData.id) {
                self.payeeName("");
            }
            ko.tasks.runEarly();
            self.isComponentLoaded(true);
        };
        self.accountTypeChanged();
        self.cancelRecipient = function() {
            self.stageOne(true);
            self.stageTwo(false);
            self.stageThree(false);
            self.currentRelationType("");
            if (self.payeeData === null) {
                self.payeeName("");
            }
        };
        self.cancelConfirmation = function() {
            addPayeeModel.deletePayee(self.payeeGroupId(), self.payeeId(), self.type()).done(function() {
                isPayeeGroupCreated = false;
            });
        };
        self.addRecipient = function() {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (self.currentRelationType() === "DD" && self.currentAccountType() === "INTERNATIONAL") {
                self.internationalDDPayeePayload.nickName = (self.model().nickName);
                self.payeeNickName = (self.internationalDDPayeePayload.nickName);
                if (self.userSegment === "CORP") {
                    self.internationalDDPayeePayload.isShared(self.isShared());
                } else {
                    self.internationalDDPayeePayload.isShared();
                }

                self.internationalDDPayeePayload.demandDraftDeliveryDTO.deliveryMode(self.addressDetails.modeofDelivery());
                if (self.internationalDDPayeePayload.demandDraftDeliveryDTO.deliveryMode() === "ACC") {
                    self.internationalDDPayeePayload.demandDraftDeliveryDTO.deliveryMode("MAI");
                    self.internationalDDPayeePayload.demandDraftDeliveryDTO.mailModeType("REM");
                    self.internationalDDPayeePayload.demandDraftDeliveryDTO.addressType(self.addressDetails.addressType());
                } else {
                    self.internationalDDPayeePayload.demandDraftDeliveryDTO.branch(self.addressDetails.postalAddress.branch);
                }
                var internationalDDPayeePayload = ko.toJSON(self.internationalDDPayeePayload);
                addPayeeModel.addPayee(self.payeeGroupId(), self.type(), internationalDDPayeePayload).done(function(data) {
                    self.payeeId(data.demandDraftPayeeDTO.id);
                    self.invokeReadPayee();
                }).fail(function() {
                    self.deletePayeeGroup();
                });
            } else if (self.currentRelationType() === "DD" && self.currentAccountType() === "DOMESTIC") {
                self.domesticDDPayeePayload.nickName = (self.model().nickName);
                self.payeeNickName = (self.domesticDDPayeePayload.nickName);
                if (self.userSegment === "CORP") {
                    self.domesticDDPayeePayload.isShared(self.isShared());
                } else {
                    self.domesticDDPayeePayload.isShared();
                }
                self.domesticDDPayeePayload.demandDraftDeliveryDTO.deliveryMode(self.addressDetails.modeofDelivery());

                if (self.domesticDDPayeePayload.demandDraftDeliveryDTO.deliveryMode() === "ACC") {
                    self.domesticDDPayeePayload.demandDraftDeliveryDTO.deliveryMode("MAI");
                    self.domesticDDPayeePayload.demandDraftDeliveryDTO.mailModeType("REM");
                    self.domesticDDPayeePayload.demandDraftDeliveryDTO.addressType(self.addressDetails.addressType());
                } else {
                    self.domesticDDPayeePayload.demandDraftDeliveryDTO.branch(self.addressDetails.postalAddress.branch);
                }
                var domesticDDPayeePayload = ko.toJSON(self.domesticDDPayeePayload);
                addPayeeModel.addPayee(self.payeeGroupId(), self.type(), domesticDDPayeePayload).done(function(data) {
                    self.payeeId(data.demandDraftPayeeDTO.id);
                    self.invokeReadPayee();
                }).fail(function() {
                    self.deletePayeeGroup();
                });
            }
        };
        self.createPayeeGroup = function() {
            var payeeNameValidationFailed = !Params.baseModel.showComponentValidationErrors(document.getElementById("dd-payee-name-tracker")),
                ddPayeeValidationFailed = !Params.baseModel.showComponentValidationErrors(document.getElementById("dd-payee-tracker"));
            if (payeeNameValidationFailed || ddPayeeValidationFailed) {
                return;
            }
            if (self.accessType() === "PUBLIC") {
                self.isShared(true);
            }
            if (self.accessType() === "PRIVATE") {
                self.isShared(false);
            }
            if (self.userSegment !== "CORP" && (!self.isNew() || isPayeeGroupCreated)) {
                isPayeeGroupCreated = true;
                self.addRecipient();
                return;
            }
            self.payeeGroupPayload.name(self.payeeName());
            var payload = ko.toJSON(self.payeeGroupPayload);
            addPayeeModel.createPayeeGroup(payload).done(function(data) {
                isPayeeGroupCreated = true;
                self.payeeGroupId(data.payeeGroup.groupId);
                self.addRecipient();
            });
        };
        self.deletePayeeGroup = function() {
            if (self.isNew()) {
                addPayeeModel.deletePayeeGroup(self.payeeGroupId()).done(function() {
                    self.stageOne(true);
                    self.stageTwo(false);
                    self.stageTwoPointTwo(false);
                    self.stageThree(false);
                    self.isComponentLoaded(true);
                    isPayeeGroupCreated = false;
                });
            } else {
                self.stageOne(true);
                self.stageTwo(false);
                self.stageTwoPointTwo(false);
                self.stageThree(false);
                self.isComponentLoaded(true);
            }
        };
        self.invokeReadPayee = function() {
            self.stageOne(false);
            Params.dashboard.loadComponent("review-demand-draft-payee", {
                reviewMode: true,
                payeeId: self.payeeId,
                header: Params.dashboard.headerName(),
                payeeGroupId: self.payeeGroupId,
                retainedData: self
            }, self);
        };
        self.confirmRecipient = function() {
            self.baseURL = "payments/payeeGroup/" + self.payeeGroupId() + "/payees/" + self.type() + "/" + self.payeeId();
            addPayeeModel.confirmPayee(self.payeeGroupId(), self.payeeId(), self.type()).done(function(data, status, jqXHR) {
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
                    self.stageTwoPointTwo(true);
                } else {
                    self.transferObject({
                        id: self.payeeId(),
                        groupId: self.payeeGroupId()
                    });
                    self.transactionName = self.payments.payee.transactionMessage[self.type()];
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
        self.setPayeeLimit = function() {
            self.confirmPage = ko.observable(true);
            $("#view-edit-payee").trigger("openModal");
        };
        self.done = function() {
            $("#view-edit-payee").hide();
        };
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
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker()))
                return;
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
        void((payeeLimit && self.newLimitAmount(payeeLimit.maxAmount.amount())) || self.newLimitAmount(""));
        var monthlyPayeeLimit = payeeLimitsMap[self.payeeData.id] && payeeLimitsMap[self.payeeData.id].MONTHLY ? payeeLimitsMap[self.payeeData.id].MONTHLY : "";
        void((monthlyPayeeLimit && self.newMonthlyLimitAmount(monthlyPayeeLimit.maxAmount.amount())) || self.newMonthlyLimitAmount(""));
        var effFromTommDailyPayeeLimit = payeeLimitsMap2[self.payeeData.id] && payeeLimitsMap2[self.payeeData.id].DAILY ? payeeLimitsMap2[self.payeeData.id].DAILY : null;
        void((effFromTommDailyPayeeLimit && self.tommDailyLimitAmount(effFromTommDailyPayeeLimit.maxAmount.amount())) || self.tommDailyLimitAmount(""));
        var effFromTommMonthlyPayeeLimit = payeeLimitsMap2[self.payeeData.id] && payeeLimitsMap2[self.payeeData.id].MONTHLY ? payeeLimitsMap2[self.payeeData.id].MONTHLY : "";
        void((effFromTommMonthlyPayeeLimit && self.tommMonthlyLimitAmount(effFromTommMonthlyPayeeLimit.maxAmount.amount())) || self.tommMonthlyLimitAmount(""));
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
        self.tempcurrency = ko.observable("GBP");
        addPayeeModel.fetchBankConfiguration().done(function(data) {
            self.tempcurrency(data.bankConfigurationDTO.localCurrency);
        });
        Params.baseModel.registerComponent("set-payee-limit", "payee");
        self.createLimit = function() {
            Params.dashboard.loadComponent("set-payee-limit", {}, self);
        };
        self.reviewLimit = function() {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.stageFour(false).stageFive(true);
        };
        self.cancelReviewLimit = function() {
            self.stageFour(true).stageFive(false);
        };
        Params.baseModel.registerComponent("warning-message-dialog", "payee");
        self.cancel = function() {
            Params.dashboard.openDashBoard(self.payments.cancelConfirm);
        };
        self.cancelDemandDraft = function() {
            Params.dashboard.hideDetails();
            self.stageOne(true);
        };
        self.makePayment = function() {
            if (self.userSegment === "CORP") {
                Params.dashboard.loadComponent("issue-demand-draft", { transferDataPayee: self.transferObject() });
            } else {
                self.selectedTab = "";
                Params.dashboard.loadComponent("manage-accounts", {
                    applicationType: "payments",
                    defaultTab: "issue-demand-draft",
                    transferDataPayee: self.transferObject()
                });
            }
        };
    };
});