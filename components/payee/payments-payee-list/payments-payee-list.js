define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/payments-payee-list",
    "framework/js/constants/constants",
    "ojs/ojinputnumber",
    "ojs/ojpopup",
    "ojs/ojlistview",
    "ojs/ojaccordion",
    "ojs/ojvalidationgroup",
    "ojs/ojarraytabledatasource",
    "ojs/ojcheckboxset"
], function(oj, ko, $, PayeeListModel, BaseLogger, ResourceBundle, Constants) {
    "use strict";
    return function(rootParams) {
        var self = this,
            limitExist = false,
            monthlyLimitExist = false,
            payeeLimitsMap = {},
            payeeLimitsMap2 = {},
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(PayeeListModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.userSegment = Constants.userSegment;
        self.payments = ResourceBundle.payments;
        self.peerToPeerValue = ko.observable(self ? self.transferValue ? self.transferValue : "" : "");
        self.isPayeesLoaded = ko.observable(false);
        self.payees = ko.observableArray();
        self.expandedAccordians = ko.observableArray([]);
        rootParams.baseModel.registerElement([
            "modal-window",
            "confirm-screen",
            "amount-input",
            "search-box"
        ]);
        rootParams.baseModel.registerComponent("payments-money-transfer", "payments");
        rootParams.baseModel.registerComponent("payee-view-edit", "payments");
        rootParams.baseModel.registerComponent("issue-demand-draft", "payments");
        rootParams.baseModel.registerComponent("bank-account-payee", "payee");
        rootParams.baseModel.registerComponent("demand-draft-payee", "payee");
        rootParams.dashboard.headerName(self.payments.managerecipients_header);
        self.payeeGroupImage = ko.observable();
        self.setLimitClicked = ko.observable(false);
        self.setMonthlyLimitClicked = ko.observable(false);
        self.limitPackage = ko.observable({});
        self.payeeLimitModel = getNewKoModel().payeeLimitModel;
        self.showActivitySuccessMsg = ko.observable(false);
        self.refreshPayeeList = ko.observable(true);
        self.limitCurrency = ko.observable();
        self.addressMap = ko.observable({});
        self.countryCodeMap = {};
        self.newLimitAmount = ko.observable();
        self.newMonthlyLimitAmount = ko.observable();
        self.tommDailyLimitAmount = ko.observable();
        self.tommMonthlyLimitAmount = ko.observable();
        self.effectiveSameDayFlag = ko.observable(false);
        self.payeeData = ko.observable();
        self.limitModified = false;
        self.removeLimit = ko.observableArray();
        self.limitSetMessage = ko.observable();
        self.validationTracker = ko.observable();
        self.setBackButton = ko.observable(false);
        PayeeListModel.fetchEffectiveTodayDetails().done(function(data) {
            if (data.isEffectiveSameDay === "Y")
                self.effectiveSameDayFlag(true);
        });
        PayeeListModel.assignedLimitPackages().done(function(data) {
            if (data.limitPackageDTOList[0].targetLimitLinkages.length > 0)
                self.limitCurrency(data.limitPackageDTOList[0].targetLimitLinkages[0].limits[0].currency);
        });

        function getPayeeLimits() {
            PayeeListModel.getPayeeLimit().done(function(data) {
                if (data.limitPackageDTOList && data.limitPackageDTOList.length > 0) {
                    payeeLimitsMap = {};
                    payeeLimitsMap2 = {};
                    for (var k = 0; k < data.limitPackageDTOList.length; k++) {
                        if (data.limitPackageDTOList[k].targetLimitLinkages && data.limitPackageDTOList[k].targetLimitLinkages.length > 0) {
                            for (var i = 0; i < data.limitPackageDTOList[k].targetLimitLinkages.length; i++) {
                                if (data.limitPackageDTOList[k].targetLimitLinkages[i].target.type.id === "PAYEE") {
                                    if (data.limitPackageDTOList[k].targetLimitLinkages[i].limits && data.limitPackageDTOList[k].targetLimitLinkages[i].limits[0].periodicity) {
                                        if ((!data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate ||
                                                new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate) > rootParams.baseModel.getDate()) &&
                                            !(new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate) > rootParams.baseModel.getDate())) {
                                            if (!payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value])
                                                payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value] = {};
                                            for (var j = 0; j < data.limitPackageDTOList[k].targetLimitLinkages[i].limits.length; j++) {
                                                payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity] = {
                                                    periodicity: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity,
                                                    maxAmount: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].maxAmount,
                                                    effectiveDate: rootParams.baseModel.formatDate(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate),
                                                    expiryDate: rootParams.baseModel.formatDate(data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate),
                                                    isEffectiveFromTomorrow: new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate) > rootParams.baseModel.getDate()
                                                };
                                                payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity].maxAmount.amount = ko.observable(payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity].maxAmount.amount);
                                                if (data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity === "DAILY")
                                                    limitExist = true;
                                                else if (data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity === "MONTHLY")
                                                    monthlyLimitExist = true;
                                            }
                                        }
                                        if (!data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate && new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate) > rootParams.baseModel.getDate()) {
                                            if (!payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value])
                                                payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value] = {};
                                            for (var f = 0; f < data.limitPackageDTOList[k].targetLimitLinkages[i].limits.length; f++) {
                                                payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].periodicity] = {
                                                    periodicity: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].periodicity,
                                                    maxAmount: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].maxAmount,
                                                    effectiveDate: rootParams.baseModel.formatDate(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate),
                                                    expiryDate: rootParams.baseModel.formatDate(data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate),
                                                    isEffectiveFromTomorrow: new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate) > rootParams.baseModel.getDate()
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
                    self.limitModified = true;
                }
            });
        }
        getPayeeLimits();
        self.cancelDailyLimit = function() {
            var payeeLimit = payeeLimitsMap[self.payeeData().id];
            self.newLimitAmount((payeeLimit && payeeLimit.DAILY && payeeLimit.DAILY.maxAmount) ? payeeLimit.DAILY.maxAmount.amount() : null);
            void(payeeLimit && payeeLimit.DAILY && self.newLimitAmount(payeeLimit.DAILY.maxAmount.amount()));
            self.setLimitClicked(false);
        };
        self.cancelMonthlyLimit = function() {
            var monthlyPayeeLimit = payeeLimitsMap[self.payeeData().id];
            self.newMonthlyLimitAmount((monthlyPayeeLimit && monthlyPayeeLimit.MONTHLY && monthlyPayeeLimit.MONTHLY.maxAmount) ? monthlyPayeeLimit.MONTHLY.maxAmount.amount() : null);
            void(monthlyPayeeLimit && monthlyPayeeLimit.MONTHLY && self.newMonthlyLimitAmount(monthlyPayeeLimit.MONTHLY.maxAmount.amount()));
            self.setMonthlyLimitClicked(false);
        };
        self.confirmEditPayeeDetails = function(data, periodicity) {

            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker()))
                return;
            var payload;
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
                        if (self.payeeData().limitDetails && self.payeeData().limitDetails.MONTHLY.maxAmount.amount() && (self.newMonthlyLimitAmount() > 0 || self.tommMonthlyLimitAmount() > 0)) {
                            monthlyLimitModel.maxAmount.currency(self.limitCurrency());
                            if (self.effectiveSameDayFlag())
                                monthlyLimitModel.maxAmount.amount(self.newMonthlyLimitAmount());
                            else
                                monthlyLimitModel.maxAmount.amount(self.tommMonthlyLimitAmount() ? self.tommMonthlyLimitAmount() : self.newMonthlyLimitAmount());
                            monthlyLimitModel.periodicity("MONTHLY");
                            payload.targetLimitLinkages()[self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.length - 1].limits.push(monthlyLimitModel);
                        }

                    }
                    if (self.setMonthlyLimitClicked() && self.newMonthlyLimitAmount() > 0 && periodicity === "MONTHLY") {
                        monthlyLimitModel.maxAmount.currency(self.limitCurrency());
                        monthlyLimitModel.maxAmount.amount(self.newMonthlyLimitAmount());
                        monthlyLimitModel.periodicity("MONTHLY");
                        payload.targetLimitLinkages()[self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.length - 1].limits.push(monthlyLimitModel);
                        if (self.payeeData().limitDetails && self.payeeData().limitDetails.DAILY.maxAmount.amount() && (self.newLimitAmount() > 0 || self.tommDailyLimitAmount() > 0)) {
                            dailyLimitModel.maxAmount.currency(self.limitCurrency());
                            if (self.effectiveSameDayFlag())
                                dailyLimitModel.maxAmount.amount(self.newLimitAmount());
                            else
                                dailyLimitModel.maxAmount.amount(self.tommDailyLimitAmount() ? self.tommDailyLimitAmount() : self.newLimitAmount());
                            dailyLimitModel.periodicity("DAILY");
                            payload.targetLimitLinkages()[self.limitPackage().data.limitPackageDTOList[0].targetLimitLinkages.length - 1].limits.push(dailyLimitModel);
                        }
                    }
                    payload = ko.toJSON(ko.mapping.toJS(payload));
                    PayeeListModel.putPayeeLimit(payload).done(function() {
                        self.limitModified = true;
                        if (periodicity === "DAILY" && self.newLimitAmount() > 0) {
                            self.payeeData().limitDetails.DAILY.maxAmount.amount(self.newLimitAmount());
                            self.payeeData().limitDetails.DAILY.maxAmount.currency = self.limitCurrency();
                            if (self.effectiveSameDayFlag()) {
                                self.payeeData().limitDetails.DAILY.isEffectiveFromTomorrow = false;
                            }
                            self.setLimitClicked(false);

                        }
                        if (periodicity === "MONTHLY" && self.newMonthlyLimitAmount() > 0) {
                            self.payeeData().limitDetails.MONTHLY.maxAmount.amount(self.newMonthlyLimitAmount());
                            self.payeeData().limitDetails.MONTHLY.maxAmount.currency = self.limitCurrency();
                            if (self.effectiveSameDayFlag()) {
                                self.payeeData().limitDetails.MONTHLY.isEffectiveFromTomorrow = false;
                            }
                            self.setMonthlyLimitClicked(false);

                        }
                        self.limitSetMessage(self.effectiveSameDayFlag() ? self.payments.payee.message.limitset : self.payments.payee.message.limitSetTom);
                        self.showActivitySuccessMsg(true);
                        getPayeeLimits();
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
                    PayeeListModel.postPayeeLimit(payload).done(function() {
                        self.limitModified = true;
                        if (periodicity === "DAILY" && self.newLimitAmount() > 0) {
                            self.payeeData().limitDetails.DAILY.maxAmount.amount(self.newLimitAmount());
                            self.payeeData().limitDetails.DAILY.maxAmount.currency = self.limitCurrency();
                            if (self.effectiveSameDayFlag()) {
                                self.payeeData().limitDetails.DAILY.isEffectiveFromTomorrow = false;
                            }
                            self.setLimitClicked(false);
                            limitExist = true;

                        }
                        if (periodicity === "MONTHLY" && self.newMonthlyLimitAmount() > 0) {
                            self.payeeData().limitDetails.MONTHLY.maxAmount.amount(self.newMonthlyLimitAmount());
                            self.payeeData().limitDetails.MONTHLY.maxAmount.currency = self.limitCurrency();
                            if (self.effectiveSameDayFlag()) {
                                self.payeeData().limitDetails.MONTHLY.isEffectiveFromTomorrow = false;
                            }
                            self.setMonthlyLimitClicked(false);
                            monthlyLimitExist = true;

                        }
                        self.limitSetMessage(self.effectiveSameDayFlag() ? self.payments.payee.message.limitset : self.payments.payee.message.limitSetTom);
                        self.showActivitySuccessMsg(true);
                        getPayeeLimits();
                        setTimeout(function() {
                            self.showActivitySuccessMsg(false);
                        }, 4000);
                    });
                }
            }
        };
        PayeeListModel.fetchCourierAddress().done(function(data) {
            var addresses = data.party.addresses;
            for (var i = 0; i < addresses.length; i++) {
                self.addressMap()[addresses[i].type] = addresses[i].postalAddress;
            }
        });
        var payeetypesMap = {
            DEMANDDRAFT: "demandDraft",
            INTERNAL: "internal",
            DOMESTIC: "domestic",
            INTERNATIONAL: "international",
            PEERTOPEER: "peerToPeer"
        };
        self.createPayeeInExistingGroup = function(defaultTab, data) {
            self.selectedTab = "";
            rootParams.dashboard.loadComponent("manage-accounts", {
                applicationType: "payee",
                defaultTab: defaultTab,
                id: data.id,
                name: data.name
            }, self);
        };
        self.choiseBoxOpened = ko.observable(false);
        self.openChoiseBox = function() {
            $("#choiseDialog").trigger("openModal");
            self.choiseBoxOpened(true);
        };
        self.changeComponent = function(componentName, isDashboard, data) {
            rootParams.dashboard.loadComponent(componentName, "", data);
        };
        self.readImage = function(gId) {
            PayeeListModel.readImage(gId).done(function(data) {
                self.payeeGroupImage(data.payeeGroupImageDTO ? data.payeeGroupImageDTO.image : "");
            });
        };
        self.payeeViewEditCloseHandler = function() {
            $("#view-payee").hide();
        };
        self.removeLimitCloseHandler = function() {
            $("#delete-payee").hide();
            self.removeLimit.removeAll();
        };
        self.componentList = [
            { id: "payee-sub-list" },
            { id: "bank-account-payee" },
            { id: "demand-draft-payee" },
            { id: "payee-card" },
            { id: "account-type-dialog" }
        ];
        for (var i = 0; i < self.componentList.length; i++) {
            rootParams.baseModel.registerComponent(self.componentList[i].id, "payee");
        }
        PayeeListModel.init("");
        self.srcCountArray = ko.observableArray();
        self.back = function() {
            history.back();
        };
        PayeeListModel.getPayeeList().done(function(data) {
            if (data.payeeGroups !== null) {
                for (var i = 0; i < data.payeeGroups.length; i++) {
                    var bankAccountCount = 0,
                        p2pCount = 0,
                        demandDraftcount = 0;
                    for (var j = 0; j < data.payeeGroups[i].listPayees.length; j++) {
                        var type = data.payeeGroups[i].listPayees[j].payeeType;
                        if (type === "INTERNAL" || type === "INTERNATIONAL" || type === "DOMESTIC") {
                            bankAccountCount++;
                        } else if (type === "DEMANDDRAFT") {
                            demandDraftcount++;
                        } else if (type === "PEERTOPEER") {
                            p2pCount++;
                        }
                    }
                    var srcCount = ko.observableArray([{
                            src: bankAccountCount !== 0 ? "payments/recipients-accounts.svg" : "default",
                            count: bankAccountCount !== 0 ? bankAccountCount : null
                        },
                        {
                            src: p2pCount !== 0 ? "payments/recipients-mobile-email.svg" : "default",
                            count: p2pCount !== 0 ? p2pCount : null
                        },
                        {
                            src: demandDraftcount !== 0 ? "payments/recipients-demand-drafts.svg" : "default",
                            count: demandDraftcount !== 0 ? demandDraftcount : null
                        }
                    ]);
                    self.payees.push({
                        name: data.payeeGroups[i].name,
                        id: data.payeeGroups[i].groupId,
                        icons: srcCount(),
                        listPayees: data.payeeGroups[i].listPayees,
                        dataSource: new oj.ArrayTableDataSource(data.payeeGroups[i].listPayees, { idAttribute: "id" })
                    });
                }
            }
            self.isPayeesLoaded(true);
        });
        self.setLimit = function() {
            self.setLimitClicked(true);
        };
        self.setMonthlyLimit = function() {
            self.setMonthlyLimitClicked(true);
        };

        function getConfirmScreenDetailsArray() {
            var confirmScreenDetailsArray;
            if (self.payeeData().payeeType === "INTERNAL") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.labels.acctype,
                            value: self.payments.payee.type[self.payeeData().payeeType]
                        },
                        {
                            label: self.payments.payee.labels.accountNumber,
                            value: self.payeeData().accountNumber
                        }
                    ],
                    [{
                        label: self.payments.payee.labels.accountName,
                        value: self.payeeData().accountName
                    }]
                ];
            } else if (self.payeeData().payeeType === "DOMESTIC") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.labels.acctype,
                            value: self.payments.payee.type[self.payeeData().payeeType]
                        },
                        {
                            label: self.payments.payee.labels.accountNumber,
                            value: self.payeeData().accountNumber
                        }
                    ],
                    [{
                            label: self.payments.payee.labels.accountName,
                            value: self.payeeData().accountName
                        },
                        {
                            label: self.payments.payee.labels.bnkdetails,
                            value: [
                                self.payeeData().bankDetails.code,
                                self.payeeData().bankDetails.name,
                                self.payeeData().bankDetails.city,
                                self.payeeData().bankDetails.country
                            ]
                        }
                    ]
                ];
            } else if (self.payeeData().payeeType === "INTERNATIONAL") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.labels.acctype,
                            value: self.payments.payee.type[self.payeeData().payeeType]
                        },
                        {
                            label: self.payments.payee.labels.accountName,
                            value: self.payeeData().accountName
                        }
                    ],
                    [{
                        label: self.payments.payee.labels.bnkdetails,
                        value: [
                            self.payeeData().bankDetails.code,
                            self.payeeData().bankDetails.name,
                            self.payeeData().bankDetails.city,
                            self.payeeData().bankDetails.country
                        ]
                    }]
                ];
            } else if (self.payeeData().payeeType === "DEMANDDRAFT" && self.payeeData().demandDraftPayeeType === "DOM") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.labels.drafttype,
                            value: self.payments.payee.type[self.payeeData().demandDraftPayeeType]
                        },
                        {
                            label: self.payments.payee.labels.nickname,
                            value: self.payeeData().nickName
                        }
                    ],
                    [{
                        label: self.payments.payee.labels.payAtCity,
                        value: self.payeeData().payAtCity
                    }]
                ];
            } else if (self.payeeData().payeeType === "DEMANDDRAFT" && self.payeeData().demandDraftPayeeType === "INT") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.labels.drafttype,
                            value: self.payments.payee.type[self.payeeData().demandDraftPayeeType]
                        },
                        {
                            label: self.payments.payee.labels.nickname,
                            value: self.payeeData().nickName
                        }
                    ],
                    [{
                            label: self.payments.payee.labels.payAtCountry,
                            value: self.countryCodeMap[self.payeeData().payAtCountry]
                        },
                        {
                            label: self.payments.payee.labels.payAtCity,
                            value: self.payeeData().payAtCity
                        }
                    ]
                ];
            }
            return confirmScreenDetailsArray;
        }
        self.confirmDeletePayee = function() {
            PayeeListModel.deletePayee(payeetypesMap[self.payeeData().payeeType], self.payeeData().groupId, self.payeeData().id).done(function(data, status, jqXHR) {
                self.closeModal();
                self.httpStatus = jqXHR.status;
                var successMessage, statusMessages;
                if (self.userSegment === "CORP" && self.httpStatus && self.httpStatus !== 202) {
                    successMessage = self.payments.payee.confirmScreen.successMessage;
                    statusMessages = self.payments.common.completed;
                } else if (self.userSegment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                    successMessage = self.payments.payee.confirmScreen.corpMaker;
                    statusMessages = self.payments.payee.confirmScreen.pendingApproval;
                } else if (self.userSegment !== "CORP") {
                    successMessage = self.payments.payee.confirmScreen.successMessage;
                    statusMessages = self.payments.common.success;
                }
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.payments.payee.labels.deletePayee,
                    confirmScreenExtensions: {
                        successMessage: successMessage,
                        statusMessages: statusMessages,
                        isSet: true,
                        confirmScreenDetails: getConfirmScreenDetailsArray(),
                        template: "confirm-screen/payments-template"
                    }
                }, self);
                getPayeeLimits();
            }).fail(function() {
                self.closeModal();
            });
        };
        self.menuItems = [{
                id: "pay",
                label: self.payments.payee.labels.pay
            },
            {
                id: "viewedit",
                label: self.payments.payee.labels.viewedit
            },
            {
                id: "delete",
                label: self.payments.payee.labels.delete
            }
        ];
        self.openMenu = function(data, event) {
            $("#menuLauncher-payeelist-contents-" + data.id).ojMenu("open", event);
        };
        self.closeModal = function() {
            $("#view-payee").hide();
            $("#delete-payee").hide();
            if (self.choiseBoxOpened()) {
                self.choiseBoxOpened(false);
                $("#choiseDialog").hide();
            }
        };
        self.paySelectedPayee = function() {
            if (!rootParams.baseModel.small())
                rootParams.rootModel.changeView(self.payeeData().payeeType === "DEMANDDRAFT" ? "issue-demand-draft" : "payments-money-transfer", { transferDataPayee: self.payeeData() });
            else
                rootParams.dashboard.loadComponent(self.payeeData().payeeType === "DEMANDDRAFT" ? "issue-demand-draft" : "payments-money-transfer", { transferDataPayee: self.payeeData() }, self);
        };
        self.showPayeeDetails = ko.observable(false);

        function fetchBranchAddress(branchCode) {
            PayeeListModel.fetchBranchAddress(branchCode).done(function(data) {
                data.addressDTO[0].branchAddress.postalAddress.branchName = data.addressDTO[0].branchName;
                self.payeeData().postalAddress = data.addressDTO[0].branchAddress.postalAddress;
                self.payeeData().postalAddress.addressType = self.payments.payee.addressType.BRN;
                self.showPayeeDetails(true);
                $("#view-payee").trigger("openModal");
            });
        }
        self.removeLimits = function() {
            if (!rootParams.baseModel.small())
                $("#view-payee").hide();
            $("#remove-limits").trigger("openModal");
        };
        self.done = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("removeLimitTracker"))) {
                return;
            }
            if (self.limitPackage() !== null && self.limitPackage().data !== null) {
                var limitData = self.limitPackage().data;
                if (limitData.limitPackageDTOList && limitData.limitPackageDTOList.length > 0) {
                    for (var k = 0; k < limitData.limitPackageDTOList.length; k++) {
                        if (limitData.limitPackageDTOList[k].targetLimitLinkages && limitData.limitPackageDTOList[k].targetLimitLinkages.length > 0) {
                            for (var i = 0; i < limitData.limitPackageDTOList[k].targetLimitLinkages.length; i++) {
                                if (ko.utils.unwrapObservable(limitData.limitPackageDTOList[k].targetLimitLinkages[i].target.type.id) === "PAYEE") {
                                    var limits = ko.utils.unwrapObservable(limitData.limitPackageDTOList[k].targetLimitLinkages[i].limits);
                                    if (limits && limits.length > 0 && limits[0].periodicity) {
                                        if (limitData.limitPackageDTOList[k].targetLimitLinkages[i].target.value === self.payeeData().id) {
                                            if (!limitData.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate) {
                                                var removeLimitPayload;
                                                limitData.limitPackageDTOList[k].targetLimitLinkages = [];
                                                limitData.limitPackageDTOList[k].targetLimitLinkages.push(getNewKoModel().payeeLimitModel.targetLimitLinkages()[0]);
                                                removeLimitPayload = ko.mapping.fromJS(limitData.limitPackageDTOList[k]);
                                                removeLimitPayload.targetLimitLinkages()[limitData.limitPackageDTOList[k].targetLimitLinkages.length - 1].target.value(self.payeeData().id);
                                                if (self.effectiveSameDayFlag()) {
                                                    removeLimitPayload.targetLimitLinkages()[limitData.limitPackageDTOList[k].targetLimitLinkages.length - 1].expiryDate = oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate());
                                                } else {
                                                    var date = rootParams.baseModel.getDate();
                                                    date.setDate(date.getDate() + 1);
                                                    removeLimitPayload.targetLimitLinkages()[limitData.limitPackageDTOList[k].targetLimitLinkages.length - 1].expiryDate = oj.IntlConverterUtils.dateToLocalIso(date);
                                                }
                                                removeLimitPayload.targetLimitLinkages()[limitData.limitPackageDTOList[k].targetLimitLinkages.length - 1].effectiveDate = ko.utils.unwrapObservable(limitData.limitPackageDTOList[k].targetLimitLinkages[0].effectiveDate);
                                                var removeDailyLimitModel = getNewKoModel().limitModel;
                                                var removeMonthlyLimitModel = getNewKoModel().limitModel;
                                                if (self.newLimitAmount() > 0) {
                                                    removeDailyLimitModel.maxAmount.currency(self.limitCurrency());
                                                    removeDailyLimitModel.maxAmount.amount(self.newLimitAmount());
                                                    removeDailyLimitModel.periodicity("DAILY");
                                                    removeLimitPayload.targetLimitLinkages()[limitData.limitPackageDTOList[k].targetLimitLinkages.length - 1].limits.push(removeDailyLimitModel);
                                                }
                                                if (self.newMonthlyLimitAmount() > 0) {
                                                    removeMonthlyLimitModel.maxAmount.currency(self.limitCurrency());
                                                    removeMonthlyLimitModel.maxAmount.amount(self.newMonthlyLimitAmount());
                                                    removeMonthlyLimitModel.periodicity("MONTHLY");
                                                    removeLimitPayload.targetLimitLinkages()[limitData.limitPackageDTOList[k].targetLimitLinkages.length - 1].limits.push(removeMonthlyLimitModel);
                                                }
                                                if (self.removeLimit().length === 1) {
                                                    if (self.removeLimit()[0] === self.payments.payee.labels.dailylimit && self.newMonthlyLimitAmount() > 0) {
                                                        removeLimitPayload.targetLimitLinkages.push(getNewKoModel().payeeLimitModel.targetLimitLinkages()[0]);
                                                        removeLimitPayload.targetLimitLinkages()[removeLimitPayload.targetLimitLinkages().length - 1].target.value(self.payeeData().id);
                                                        var newMonthlyLimitModel = getNewKoModel().limitModel;
                                                        newMonthlyLimitModel.maxAmount.currency(self.limitCurrency());
                                                        newMonthlyLimitModel.maxAmount.amount(self.newMonthlyLimitAmount());
                                                        newMonthlyLimitModel.periodicity("MONTHLY");
                                                        removeLimitPayload.targetLimitLinkages()[removeLimitPayload.targetLimitLinkages().length - 1].limits.push(newMonthlyLimitModel);
                                                    } else if (self.removeLimit()[0] === self.payments.payee.labels.monthlylimit && self.newLimitAmount() > 0) {
                                                        removeLimitPayload.targetLimitLinkages.push(getNewKoModel().payeeLimitModel.targetLimitLinkages()[0]);
                                                        removeLimitPayload.targetLimitLinkages()[removeLimitPayload.targetLimitLinkages().length - 1].target.value(self.payeeData().id);
                                                        var newDailyLimitModel = getNewKoModel().limitModel;
                                                        newDailyLimitModel.maxAmount.currency(self.limitCurrency());
                                                        newDailyLimitModel.maxAmount.amount(self.newLimitAmount());
                                                        newDailyLimitModel.periodicity("DAILY");
                                                        removeLimitPayload.targetLimitLinkages()[removeLimitPayload.targetLimitLinkages().length - 1].limits.push(newDailyLimitModel);
                                                    } else {
                                                        removeLimitPayload.targetLimitLinkages.push(getNewKoModel().payeeLimitModel.targetLimitLinkages()[0]);
                                                        removeLimitPayload.targetLimitLinkages()[removeLimitPayload.targetLimitLinkages().length - 1].target.value(self.payeeData().id);
                                                    }
                                                }
                                                if (self.removeLimit().length === 2) {
                                                    removeLimitPayload.targetLimitLinkages.push(getNewKoModel().payeeLimitModel.targetLimitLinkages()[0]);
                                                    removeLimitPayload.targetLimitLinkages()[removeLimitPayload.targetLimitLinkages().length - 1].target.value(self.payeeData().id);
                                                }
                                                removeLimitPayload = ko.toJSON(ko.mapping.toJS(removeLimitPayload));
                                                PayeeListModel.putPayeeLimit(removeLimitPayload).done(function(data, status, jqXHR) {
                                                    self.limitModified = true;
                                                    self.limitSetMessage(self.effectiveSameDayFlag() ? self.payments.payee.message.limitRemove : self.payments.payee.message.limitRemoveTom);
                                                    self.showActivitySuccessMsg(true);
                                                    if (self.removeLimit().length === 1) {
                                                        if (self.removeLimit()[0] === self.payments.payee.labels.monthlylimit)
                                                            self.newMonthlyLimitAmount("");
                                                        if (self.removeLimit()[0] === self.payments.payee.labels.dailylimit)
                                                            self.newLimitAmount("");
                                                    } else if (self.removeLimit().length === 2) {
                                                        self.newMonthlyLimitAmount("");
                                                        self.newLimitAmount("");
                                                    }
                                                    self.removeLimit.removeAll();
                                                    if (rootParams.baseModel.small() && self.userSegment === "RETAIL") {
                                                        self.showActivitySuccessMsg(false);
                                                        rootParams.dashboard.loadComponent("confirm-screen", {
                                                            jqXHR: jqXHR,
                                                            confirmScreenExtensions: {
                                                                template: "confirm-screen/payments-template",
                                                                successMessage: self.limitSetMessage(),
                                                                statusMessages: self.payments.common.success,
                                                                isSet: true,
                                                                confirmScreenDetails: getConfirmScreenDetailsArray()
                                                            }
                                                        }, self);
                                                    }
                                                    getPayeeLimits();
                                                    setTimeout(function() {
                                                        if (rootParams.baseModel.large()) {
                                                            self.showActivitySuccessMsg(false);
                                                            $("#remove-limits").hide();
                                                        }
                                                    }, 2000);
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        PayeeListModel.fetchCountryCode().done(function(data) {
            var enumRepresentations = data.enumRepresentations;
            if (enumRepresentations !== null) {
                for (var j = 0; j < enumRepresentations[0].data.length; j++) {
                    self.countryCodeMap[enumRepresentations[0].data[j].code] = enumRepresentations[0].data[j].description;
                }
            }
        });

        function menuItemSelectHandler(selectedItem, data) {
            if (selectedItem === "pay")
                self.paySelectedPayee();
            else if (selectedItem === "viewedit") {
                self.setLimitClicked(false);
                self.setMonthlyLimitClicked(false);
                if (data.demandDraftDeliveryDTO && data.demandDraftDeliveryDTO.deliveryMode === "BRN") {
                    fetchBranchAddress(data.demandDraftDeliveryDTO.branch);
                } else if (data.demandDraftDeliveryDTO && data.demandDraftDeliveryDTO.deliveryMode === "MAI") {
                    self.payeeData().postalAddress = self.addressMap()[data.demandDraftDeliveryDTO.addressType];
                    self.payeeData().postalAddress.addressType = self.payments.payee.addressType.MAI;
                    self.showPayeeDetails(true);
                } else
                    self.showPayeeDetails(true);
                if (!rootParams.baseModel.small())
                    $("#view-payee").trigger("openModal");
                else if (rootParams.baseModel.small() && self.userSegment === "RETAIL")
                    rootParams.dashboard.loadComponent("payee-view-edit", {}, self);
            } else if (selectedItem === "delete")
                $("#delete-payee").trigger("openModal");

        }

        self.menuItemSelect = function(data, event) {
            if (data.payeeType === "DOMESTIC") {
                if (data.domesticPayeeType === "INDIA") {
                    self.payeeData(data.indiaDomesticPayee);
                } else if (data.domesticPayeeType === "UK") {
                    self.payeeData(data.ukDomesticPayee);
                } else if (data.domesticPayeeType === "SEPA") {
                    self.payeeData(data.sepaDomesticPayee);
                }

            } else {
                self.payeeData(data);
            }
            self.showPayeeDetails(false);
            var payeeLimit = payeeLimitsMap[self.payeeData().id] && payeeLimitsMap[self.payeeData().id].DAILY ? payeeLimitsMap[self.payeeData().id].DAILY : null;
            void((payeeLimit && self.newLimitAmount(payeeLimit.maxAmount.amount())) || self.newLimitAmount(""));
            var monthlyPayeeLimit = payeeLimitsMap[self.payeeData().id] && payeeLimitsMap[self.payeeData().id].MONTHLY ? payeeLimitsMap[self.payeeData().id].MONTHLY : null;
            void((monthlyPayeeLimit && self.newMonthlyLimitAmount(monthlyPayeeLimit.maxAmount.amount())) || self.newMonthlyLimitAmount(""));
            var effFromTommDailyPayeeLimit = payeeLimitsMap2[self.payeeData().id] && payeeLimitsMap2[self.payeeData().id].DAILY ? payeeLimitsMap2[self.payeeData().id].DAILY : null;
            void((effFromTommDailyPayeeLimit && self.tommDailyLimitAmount(effFromTommDailyPayeeLimit.maxAmount.amount())) || self.tommDailyLimitAmount(""));
            var effFromTommMonthlyPayeeLimit = payeeLimitsMap2[self.payeeData().id] && payeeLimitsMap2[self.payeeData().id].MONTHLY ? payeeLimitsMap2[self.payeeData().id].MONTHLY : null;
            void((effFromTommMonthlyPayeeLimit && self.tommMonthlyLimitAmount(effFromTommMonthlyPayeeLimit.maxAmount.amount())) || self.tommMonthlyLimitAmount(""));
            self.payeeData().limitDetails = {
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
            menuItemSelectHandler(event.target.value, data);
        };
    };
});