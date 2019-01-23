define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",

    "ojL10n!resources/nls/manage-alerts-subscription",
    "ojs/ojselectcombobox",
    "ojs/ojpopup",
    "promise",
    "ojs/ojdatagrid",
    "ojs/ojdatetimepicker",
    "ojs/ojvalidation",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojaccordion",
    "ojs/ojcollapsible"
], function (oj, ko, $, BaseLogger, AlertsSubscriptionModel, resourceBundle) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.mode = ko.observable();
        self.transactionDetails = ko.observable();
        self.data = ko.observable();
        self.transactionSnapshot = ko.observable();
        self.menuOptionsAttached = ko.observable(false);

        self.transactionId = null;
        self.approverReview = ko.observable(false);
        self.actionHeaderheading = ko.observable();
        self.resourceBundle = resourceBundle;
        self.showPartyValidateComponent = ko.observable(false);
        self.SubscriptionModelInstance = ko.observable();
        if (Params.rootModel.transactionId) {
            self.transactionId = ko.observable(Params.rootModel.transactionId);
            self.mode("REVIEW");
            self.transactionDetails = Params.rootModel.transactionDetails;
            self.transactionSnapshot(self.transactionDetails().transactionSnapshot);
            self.approverReview(true);
            self.actionHeaderheading(self.resourceBundle.headers.REVIEW);
        } else if (Params.rootModel.mode) {
            self.mode(Params.rootModel.mode);
            Params.dashboard.headerName(self.resourceBundle.headers.subscriptionHeading);
        } else {
            self.mode("CREATE");
            Params.dashboard.headerName(self.resourceBundle.headers.subscriptionHeading);
        }
        if (Params.rootModel.userFullData) {
            self.data = Params.rootModel.userFullData;
        }
        Params.baseModel.registerElement("row");
        Params.baseModel.registerElement("confirm-screen");
        Params.baseModel.registerElement("modal-window");
        Params.baseModel.registerComponent("party-validate", "common");
        Params.baseModel.registerComponent("alerts-nav-bar", "alerts");
        Params.baseModel.registerComponent("alerts-subscription-casa", "alerts");
        Params.baseModel.registerComponent("alerts-subscription-td", "alerts");
        Params.baseModel.registerComponent("alerts-subscription-loans", "alerts");
        Params.baseModel.registerComponent("alerts-subscription-profile", "alerts");
        Params.baseModel.registerComponent("alerts-subscription-payments", "alerts");
        Params.baseModel.registerElement("modal-window");
        self.moduleTypes = ko.observableArray();
        self.ActivityEventActionsForModule = ko.observableArray();
        self.userTypeList = ko.observableArray([]);
        self.AccountListForAccountType = ko.observableArray();
        self.subscriptionLevel = ko.observable("ACCOUNT");
        self.actionSubscription = ko.observable();
        self.profileSubscription = ko.observable();
        self.transaction1Success = ko.observable(false);
        self.transaction2Success = ko.observable(false);
        self.save1Initiated = ko.observable(false);
        self.save2Initiated = ko.observable(false);
        self.transactionName = ko.observable();
        self.transactionStatus = ko.observable();
        self.statusMessage = ko.observable();
        self.httpStatus = ko.observable();
        self.confirmationMsg = ko.observable();
        self.validRecipientCategory = ko.observable();
        self.validRecipient = ko.observable();
        self.getEnterpriseRoles = function () {
            AlertsSubscriptionModel.getEnterpriseRoles().done(function (data) {
                self.userTypeList = data.enterpriseRoleDTOs;
                self.setModelData();
            });
        };
        self.getEnterpriseRoles();
        self.menuOptions = ko.observableArray([{
                id: "CASA",
                label: self.resourceBundle.subscription.accounts
            },
            {
                id: "TD",
                label: self.resourceBundle.subscription.td
            },
            {
                id: "LOANS",
                label: self.resourceBundle.subscription.loans
            },
            {
                id: "PROFILE",
                label: self.resourceBundle.subscription.profile
            },
            {
                id: "PAYMENTS",
                label: self.resourceBundle.subscription.payments
            }
        ]);
        self.componentId = ko.observable();
        self.menuSelection = ko.observable("CASA");
        self.activityEventActionModelList = ko.observableArray();
        self.profileLevelActions = null;
        self.showComponent = ko.observable(false);
        self.moduleCount = ko.observable(0);
        var dateValue = ko.observable(Params.baseModel.getDate().toISOString().slice(0, 10));
        var enddateValue = ko.observable(new Date(2099, 1, 1).toISOString().slice(0, 10));
        self.accountsLoadedList = ko.observableArray();
        self.validAlertType = ko.observable("S");
        self.getNewKoModel = function () {
            var KoModel = AlertsSubscriptionModel.getNewModel();
            return KoModel;
        };
        self.getNewPartyDetailsModel = function () {
            var KoModel = AlertsSubscriptionModel.getNewPartyDetailsModel();
            return KoModel;
        };
        self.getNewRecipientMessageTemplateModel = function () {
            var koRecipientMessageTemplateModel = AlertsSubscriptionModel.getNewRecipientMessageTemplateModel();
            return koRecipientMessageTemplateModel;
        };
        self.getNewMessageTemplateModel = function () {
            var koMessageTemplateModel = AlertsSubscriptionModel.getNewMessageTemplateModel();
            return koMessageTemplateModel;
        };
        self.isCorpAdmin = null;
        var partyId = {};
        partyId.value = Params.dashboard.userData.userProfile.partyId.value;
        partyId.displayValue = Params.dashboard.userData.userProfile.partyId.displayValue;
        if (partyId.value) {
            self.isCorpAdmin = true;
        } else {
            self.isCorpAdmin = false;
        }
        self.init = function () {
            self.moduleTypes.push("CH");
            self.ActivityEventActionsForModule.push({
                "module": self.moduleTypes()[0],
                "list": ko.observableArray()
            });
            self.AccountListForAccountType.push({
                "module": self.moduleTypes()[0],
                "accountType": "CSA",
                "list": ko.observableArray(),
                "componentId": "alerts-subscription-casa"
            });
            self.accountsLoadedList.push({
                "module": self.moduleTypes()[0],
                "accountType": "CSA",
                "componentId": "alerts-subscription-casa",
                accountsLoaded: ko.observable(false)
            });
            self.moduleTypes.push("TD");
            self.ActivityEventActionsForModule.push({
                "module": self.moduleTypes()[1],
                "list": ko.observableArray()
            });
            self.AccountListForAccountType.push({
                "module": self.moduleTypes()[1],
                "accountType": "TRD",
                "list": ko.observableArray(),
                "componentId": "alerts-subscription-td"
            });
            self.accountsLoadedList.push({
                "module": self.moduleTypes()[1],
                "accountType": "TRD",
                "componentId": "alerts-subscription-td",
                accountsLoaded: ko.observable(false)
            });
            self.moduleTypes.push("LN");
            self.ActivityEventActionsForModule.push({
                "module": self.moduleTypes()[2],
                "list": ko.observableArray()
            });
            self.AccountListForAccountType.push({
                "module": self.moduleTypes()[2],
                "accountType": "LON",
                "list": ko.observableArray(),
                "componentId": "alerts-subscription-loans"
            });
            self.accountsLoadedList.push({
                "module": self.moduleTypes()[2],
                "accountType": "LON",
                "componentId": "alerts-subscription-loans",
                accountsLoaded: ko.observable(false)
            });
            self.moduleTypes.push("PC");
            self.ActivityEventActionsForModule.push({
                "module": self.moduleTypes()[3],
                "list": ko.observableArray()
            });
            self.AccountListForAccountType.push({
                "module": self.moduleTypes()[3],
                "accountType": "CSA",
                "list": ko.observableArray(),
                "componentId": "alerts-subscription-payments"
            });
            self.accountsLoadedList.push({
                "module": self.moduleTypes()[3],
                "accountType": "CSA",
                "componentId": "alerts-subscription-payments",
                accountsLoaded: ko.observable(false)
            });
            self.moduleTypes.push("PI");
            self.ActivityEventActionsForModule.push({
                "module": self.moduleTypes()[4],
                "list": ko.observableArray()
            });
            self.profileLevelActions = {
                "module": self.moduleTypes()[4],
                "list": self.activityEventActionModelList
            };
            ko.utils.arrayForEach(self.moduleTypes(), function (moduleType) {
                self.fetchActivityEventActionList(moduleType);
            });
        };
        self.setModelData = function () {
            self.SubscriptionModelInstance(AlertsSubscriptionModel.getNewPartyDetailsModel());
            if (self.data()) {
                self.SubscriptionModelInstance().partyDetails.partyDetailsFetched = ko.observable(true);
                self.SubscriptionModelInstance().partyDetails.party.displayValue = ko.observable(self.data().partyId.displayValue);
                self.SubscriptionModelInstance().partyDetails.party.value = ko.observable(self.data().partyId.value);
                self.SubscriptionModelInstance().partyDetails.partyName = ko.observable(self.data().partyName);
                self.SubscriptionModelInstance().partyDetails.emailAddress = ko.observable(self.data().emailId);
                self.SubscriptionModelInstance().partyDetails.mobileNumber = ko.observable(self.data().mobileNumber);
                self.SubscriptionModelInstance().partyDetails.userName = ko.observable(self.data().username);
                ko.utils.arrayForEach(self.userTypeList, function (item) {
                    for (var i = 0; i < self.data().userGroups.length; i++) {
                        if (item.enterpriseRoleId.toLowerCase() === self.data().userGroups[i].toLowerCase()) {
                            self.SubscriptionModelInstance().partyDetails.userType = item.enterpriseRoleId;
                        }
                    }
                });
                self.showPartyValidateComponent(true);
                if (self.SubscriptionModelInstance().partyDetails.userType === "corporateuser") {
                    self.validRecipientCategory("CORPORATE");
                    self.validRecipient("USER");
                } else {
                    self.validRecipientCategory("PARTY");
                    self.validRecipient("CUSTOMER");
                }
            } else if (self.approverReview()) {
                if (self.transactionSnapshot().subscriber.id) {
                    AlertsSubscriptionModel.getUserDetails(self.transactionSnapshot().subscriber.id).then(function (data) {
                        self.SubscriptionModelInstance().partyDetails.partyDetailsFetched = ko.observable(true);
                        self.SubscriptionModelInstance().partyDetails.party.displayValue = ko.observable(data.userDTO.partyId.displayValue);
                        self.SubscriptionModelInstance().partyDetails.party.value = ko.observable(data.userDTO.partyId.value);
                        self.SubscriptionModelInstance().partyDetails.partyName = ko.observable(data.userDTO.partyName);
                        self.SubscriptionModelInstance().partyDetails.userName = ko.observable(data.userDTO.username);
                        self.SubscriptionModelInstance().partyDetails.emailAddress = ko.observable(data.userDTO.emailId);
                        self.SubscriptionModelInstance().partyDetails.mobileNumber = ko.observable(data.userDTO.mobileNumber);
                        ko.utils.arrayForEach(self.userTypeList, function (item) {
                            for (var i = 0; i < self.data().userGroups.length; i++) {
                                if (item.enterpriseRoleId.toLowerCase() === self.data().userGroups[i].toLowerCase()) {
                                    self.SubscriptionModelInstance().partyDetails.userType = item.enterpriseRoleId;
                                }
                            }
                        });
                        self.showPartyValidateComponent(true);
                        if (self.SubscriptionModelInstance().partyDetails.userType === "corporateuser") {
                            self.validRecipientCategory("CORPORATE");
                            self.validRecipient("USER");
                        } else {
                            self.validRecipientCategory("PARTY");
                            self.validRecipient("CUSTOMER");
                        }
                        self.init();
                    });
                } else {
                    AlertsSubscriptionModel.searchUserDetails("retailuser", self.transactionSnapshot().subscriber.party.value).then(function (userDTOList) {
                        ko.utils.arrayForEach(userDTOList, function (userDTO) {
                            if (userDTO.partyId.value === self.transactionSnapshot().subscriber.party.value) {
                                self.SubscriptionModelInstance().partyDetails.partyDetailsFetched = ko.observable(true);
                                self.SubscriptionModelInstance().partyDetails.party.displayValue = ko.observable(userDTO.partyId.displayValue);
                                self.SubscriptionModelInstance().partyDetails.party.value = ko.observable(userDTO.partyId.value);
                                self.SubscriptionModelInstance().partyDetails.partyName = ko.observable(userDTO.partyName);
                                ko.utils.arrayForEach(self.userTypeList, function (item) {
                                    for (var i = 0; i < self.data().userGroups.length; i++) {
                                        if (item.enterpriseRoleId.toLowerCase() === self.data().userGroups[i].toLowerCase()) {
                                            self.SubscriptionModelInstance().partyDetails.userType = item.enterpriseRoleId;
                                        }
                                    }
                                });
                                self.SubscriptionModelInstance().partyDetails.userName = ko.observable(userDTO.username);
                                self.SubscriptionModelInstance().partyDetails.emailAddress = ko.observable(userDTO.emailId);
                                self.SubscriptionModelInstance().partyDetails.mobileNumber = ko.observable(userDTO.mobileNumber);
                                self.showPartyValidateComponent(true);
                                if (self.SubscriptionModelInstance().partyDetails.userType === "corporateuser") {
                                    self.validRecipientCategory("CORPORATE");
                                    self.validRecipient("USER");
                                } else {
                                    self.validRecipientCategory("PARTY");
                                    self.validRecipient("CUSTOMER");
                                }
                                self.init();
                            }
                        });
                    });
                }
            }
            if (self.transactionId) {
                if (self.transactionSnapshot().subscriptionLevel === "ACCOUNT") {
                    self.actionSubscription = self.transactionSnapshot;
                } else {
                    self.profileSubscription = self.transactionSnapshot;
                }
            } else {
                self.getSubscription();
            }
        };
        self.getSubscription = function () {
            self.actionHeaderheading(self.resourceBundle.headers.update);
            if (self.SubscriptionModelInstance().partyDetails.userType === "corporateuser") {
                AlertsSubscriptionModel.getSubscriptionForUser(self.SubscriptionModelInstance().partyDetails.userName(), partyId.value).then(function (data) {
                    if (data.actionSubscriptionDTO && data.actionSubscriptionDTO.length > 0) {
                        ko.utils.arrayForEach(data.actionSubscriptionDTO, function (actionSubscriptionDTO) {
                            if (actionSubscriptionDTO.subscriptionLevel === "ACCOUNT") {
                                self.actionSubscription(actionSubscriptionDTO);
                            } else {
                                self.profileSubscription(actionSubscriptionDTO);
                            }
                        });
                    }
                });
            } else {
                AlertsSubscriptionModel.getSubscriptionForParty(self.SubscriptionModelInstance().partyDetails.party.value()).then(function (data) {
                    if (data.actionSubscriptionDTO && data.actionSubscriptionDTO.length > 0) {
                        ko.utils.arrayForEach(data.actionSubscriptionDTO, function (actionSubscriptionDTO) {
                            if (actionSubscriptionDTO.subscriptionLevel === "ACCOUNT") {
                                self.actionSubscription(actionSubscriptionDTO);
                            } else {
                                self.profileSubscription(actionSubscriptionDTO);
                            }
                        });
                    }
                });
            }
        };
        self.confirm = function () {
            self.save1Initiated(false);
            self.save2Initiated(false);
            if (self.actionSubscription() && self.actionSubscription().subscriptionId) {
                self.updateSubscription();
            } else {
                self.createSubscription();
            }
            if (self.profileSubscription() && self.profileSubscription().subscriptionId) {
                self.updateProfileSubscription();
            } else {
                self.createProfileSubscription();
            }
        };
        self.saveSubscription = function () {
            if (self.checkForConfirmation()) {
                self.mode("REVIEW");
                self.actionHeaderheading(self.resourceBundle.headers.REVIEW);
            } else {
                Params.baseModel.showMessages(null, [self.resourceBundle.subscription.noSelectionMade], "INFO");
            }
        };
        self.editSubscription = function () {
            self.mode("EDIT");
            self.actionHeaderheading(self.resourceBundle.headers.update);
        };
        self.updateSubscription = function () {
            self.mode("EDIT");
            var subscribedActions = ko.observableArray();
            ko.utils.arrayForEach(self.AccountListForAccountType(), function (accountListForAccountType) {
                ko.utils.arrayForEach(accountListForAccountType.list(), function (accountModel) {
                    ko.utils.arrayForEach(accountModel.activityEventActions(), function (activityEventActionModel) {
                        var subscriptionLevelKey = {
                            "displayValue": accountModel.accountDisplayId,
                            "value": accountModel.accountId
                        };
                        var subscribedAction = self.fetchSubscribedAction("ACCOUNT", subscriptionLevelKey, activityEventActionModel, "EDIT", accountListForAccountType.module);
                        if (subscribedAction) {
                            subscribedActions.push(subscribedAction);
                        }
                    });
                });
            });
            if (subscribedActions().length > 0) {
                self.save1Initiated(true);
                var actionSubscriptionModel = AlertsSubscriptionModel.getNewActionSubscriptionModel();
                var subscriber = AlertsSubscriptionModel.getNewSubscriberModel();
                if (self.SubscriptionModelInstance().partyDetails.userType === "corporateuser") {
                    subscriber.id = self.SubscriptionModelInstance().partyDetails.userName();
                    subscriber.subscriberType = "CORPORATE";
                } else {
                    subscriber.subscriberType = "PARTY";
                    subscriber.party = {
                        "displayValue": self.SubscriptionModelInstance().partyDetails.party.displayValue(),
                        "value": self.SubscriptionModelInstance().partyDetails.party.value()
                    };
                    subscriber.id = self.SubscriptionModelInstance().partyDetails.userName();
                }
                actionSubscriptionModel.isActive = true;
                actionSubscriptionModel.subscribedActions = subscribedActions();
                actionSubscriptionModel.subscriptionStartDate = self.actionSubscription().subscriptionStartDate;
                actionSubscriptionModel.subscriptionEndDate = self.actionSubscription().subscriptionEndDate;
                actionSubscriptionModel.subscriptionLevel = self.actionSubscription().subscriptionLevel;
                actionSubscriptionModel.subscriptionId = self.actionSubscription().subscriptionId;
                actionSubscriptionModel.subscriber = subscriber;
                self.transactionName(self.resourceBundle.subscription.modifySubscription);
                AlertsSubscriptionModel.updateSubscription(ko.toJSON(actionSubscriptionModel), self.actionSubscription().subscriptionId).done(function (data, status, jqXhr) {
                    self.transaction1Success(true);
                    self.actionHeaderheading(self.resourceBundle.headers[self.mode()]);
                    self.confirmationMsg(self.resourceBundle.subscription.successMessage);
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        hostReferenceNumber: data.referenceNumber,
                        transactionName: self.transactionName()
                    }, self);
                });
            } else if (self.actionSubscription().subscribedActions && self.actionSubscription().subscribedActions.length > 0) {
                self.save1Initiated(true);
                AlertsSubscriptionModel.deleteSubscription(self.actionSubscription().subscriptionId).done(function (data, status, jqXhr) {
                    self.transaction1Success(true);
                    self.actionHeaderheading(self.resourceBundle.headers[self.mode()]);
                    self.confirmationMsg(self.resourceBundle.subscription.successMessage);
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        hostReferenceNumber: data.referenceNumber,
                        transactionName: self.transactionName()
                    }, self);
                });
            }
        };
        self.updateProfileSubscription = function () {
            self.mode("EDIT");
            var subscribedActions = ko.observableArray();
            ko.utils.arrayForEach(self.activityEventActionModelList(), function (activityEventActionModel) {
                var subscriptionLevelKey = {
                    "displayValue": self.SubscriptionModelInstance().partyDetails.party.displayValue(),
                    "value": self.SubscriptionModelInstance().partyDetails.party.value()
                };
                var subscribedAction = self.fetchSubscribedAction("PARTY", subscriptionLevelKey, activityEventActionModel, "EDIT", "PI");
                if (subscribedAction) {
                    subscribedActions.push(subscribedAction);
                }
            });
            if (subscribedActions().length > 0) {
                self.save2Initiated(true);
                var actionSubscriptionModel = AlertsSubscriptionModel.getNewActionSubscriptionModel();
                var subscriber = AlertsSubscriptionModel.getNewSubscriberModel();
                if (self.SubscriptionModelInstance().partyDetails.userType === "corporateuser") {
                    subscriber.id = self.SubscriptionModelInstance().partyDetails.userName();
                    subscriber.subscriberType = "CORPORATE";
                } else {
                    subscriber.id = self.SubscriptionModelInstance().partyDetails.userName();
                    subscriber.subscriberType = "PARTY";
                    subscriber.party = {
                        "displayValue": self.SubscriptionModelInstance().partyDetails.party.displayValue(),
                        "value": self.SubscriptionModelInstance().partyDetails.party.value()
                    };
                }
                actionSubscriptionModel.isActive = true;
                actionSubscriptionModel.subscribedActions = subscribedActions();
                actionSubscriptionModel.subscriptionStartDate = self.profileSubscription().subscriptionStartDate;
                actionSubscriptionModel.subscriptionEndDate = self.profileSubscription().subscriptionEndDate;
                actionSubscriptionModel.subscriptionLevel = self.profileSubscription().subscriptionLevel;
                actionSubscriptionModel.subscriptionId = self.profileSubscription().subscriptionId;
                actionSubscriptionModel.subscriber = subscriber;
                self.transactionName(self.resourceBundle.subscription.modifySubscription);
                AlertsSubscriptionModel.updateSubscription(ko.toJSON(actionSubscriptionModel), self.profileSubscription().subscriptionId).done(function (data, status, jqXhr) {
                    self.transaction2Success(true);
                    self.transactionStatus(data);
                    self.mode("SUCCESS");
                    self.actionHeaderheading(self.resourceBundle.headers[self.mode()]);
                    self.confirmationMsg(self.resourceBundle.subscription.successMessage);
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        hostReferenceNumber: data.referenceNumber,
                        transactionName: self.transactionName()
                    }, self);
                });
            } else if (self.profileSubscription().subscribedActions && self.profileSubscription().subscribedActions.length > 0) {
                self.save2Initiated(true);
                AlertsSubscriptionModel.deleteSubscription(self.profileSubscription().subscriptionId).done(function (data, status, jqXhr) {
                    self.transaction2Success(true);
                    self.httpStatus(jqXhr.status);
                    self.mode("SUCCESS");
                    self.actionHeaderheading(self.resourceBundle.headers[self.mode()]);
                    self.confirmationMsg(self.resourceBundle.subscription.successMessage);
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        hostReferenceNumber: data.referenceNumber,
                        transactionName: self.transactionName()
                    }, self);
                });
            }
        };
        self.createSubscription = function () {
            self.mode("CREATE");
            var subscribedActions = ko.observableArray();
            ko.utils.arrayForEach(self.AccountListForAccountType(), function (accountListForAccountType) {
                ko.utils.arrayForEach(accountListForAccountType.list(), function (accountModel) {
                    ko.utils.arrayForEach(accountModel.activityEventActions(), function (activityEventActionModel) {
                        var subscriptionLevelKey = {
                            "displayValue": accountModel.accountDisplayId,
                            "value": accountModel.accountId
                        };
                        var subscribedAction = self.fetchSubscribedAction("ACCOUNT", subscriptionLevelKey, activityEventActionModel, "CREATE", accountListForAccountType.module);
                        if (subscribedAction) {
                            subscribedActions.push(subscribedAction);
                        }
                    });
                });
            });
            if (subscribedActions().length > 0) {
                self.save1Initiated(true);
                var actionSubscriptionModel = AlertsSubscriptionModel.getNewActionSubscriptionModel();
                var subscriber = AlertsSubscriptionModel.getNewSubscriberModel();
                if (self.SubscriptionModelInstance().partyDetails.userType === "corporateuser") {
                    subscriber.id = self.SubscriptionModelInstance().partyDetails.userName();
                    subscriber.subscriberType = "CORPORATE";
                } else {
                    subscriber.id = self.SubscriptionModelInstance().partyDetails.userName();
                    subscriber.subscriberType = "PARTY";
                    subscriber.party = {
                        "displayValue": self.SubscriptionModelInstance().partyDetails.party.displayValue(),
                        "value": self.SubscriptionModelInstance().partyDetails.party.value()
                    };
                }
                actionSubscriptionModel.isActive = true;
                actionSubscriptionModel.subscribedActions = subscribedActions();
                actionSubscriptionModel.subscriptionStartDate = dateValue();
                actionSubscriptionModel.subscriptionEndDate = enddateValue();
                actionSubscriptionModel.subscriptionLevel = "ACCOUNT";
                actionSubscriptionModel.subscriptionId = "";
                actionSubscriptionModel.subscriber = subscriber;
                self.transactionName(self.resourceBundle.subscription.createSubscription);
                AlertsSubscriptionModel.createSubscription(ko.toJSON(actionSubscriptionModel)).done(function (data, status, jqXhr) {
                    self.transaction1Success(true);
                    self.mode("SUCCESS");
                    self.actionHeaderheading(self.resourceBundle.headers[self.mode()]);
                    self.confirmationMsg(self.resourceBundle.subscription.successMessage);
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        hostReferenceNumber: data.referenceNumber,
                        transactionName: self.transactionName()
                    }, self);
                });
            }
        };
        self.createProfileSubscription = function () {
            self.mode("CREATE");
            var subscribedActions = ko.observableArray();
            ko.utils.arrayForEach(self.activityEventActionModelList(), function (activityEventActionModel) {
                var subscriptionLevelKey = {
                    "displayValue": self.SubscriptionModelInstance().partyDetails.party.displayValue(),
                    "value": self.SubscriptionModelInstance().partyDetails.party.value()
                };
                var subscribedAction = self.fetchSubscribedAction("PARTY", subscriptionLevelKey, activityEventActionModel, "CREATE", "PI");
                if (subscribedAction) {
                    subscribedActions.push(subscribedAction);
                }
            });
            if (subscribedActions().length > 0) {
                self.save2Initiated(true);
                var actionSubscriptionModel = AlertsSubscriptionModel.getNewActionSubscriptionModel();
                var subscriber = AlertsSubscriptionModel.getNewSubscriberModel();
                if (self.SubscriptionModelInstance().partyDetails.userType === "corporateuser") {
                    subscriber.id = self.SubscriptionModelInstance().partyDetails.userName();
                    subscriber.subscriberType = "CORPORATE";
                } else {
                    subscriber.id = self.SubscriptionModelInstance().partyDetails.party.value();
                    subscriber.subscriberType = "PARTY";
                    subscriber.party = {
                        "displayValue": self.SubscriptionModelInstance().partyDetails.party.displayValue(),
                        "value": self.SubscriptionModelInstance().partyDetails.party.value()
                    };
                }
                actionSubscriptionModel.isActive = true;
                actionSubscriptionModel.subscribedActions = subscribedActions();
                actionSubscriptionModel.subscriptionStartDate = dateValue();
                actionSubscriptionModel.subscriptionEndDate = enddateValue();
                actionSubscriptionModel.subscriptionLevel = "PARTY";
                actionSubscriptionModel.subscriptionId = "";
                actionSubscriptionModel.subscriber = subscriber;
                self.transactionName(self.resourceBundle.subscription.createSubscription);
                AlertsSubscriptionModel.createSubscription(ko.toJSON(actionSubscriptionModel)).done(function (data, status, jqXhr) {
                    self.transaction2Success(true);
                    self.mode("SUCCESS");
                    self.actionHeaderheading(self.resourceBundle.headers[self.mode()]);
                    self.confirmationMsg(self.resourceBundle.subscription.successMessage);
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        hostReferenceNumber: data.referenceNumber,
                        transactionName: self.transactionName()
                    }, self);
                });
            }
        };
        self.fetchSubscribedAction = function (subscriptionLevel, subscriptionLevelKey, activityEventActionModel, mode, module) {
            var subscribedAction;
            var subscribedPreferences = ko.observableArray();
            var activityEventAction;
            var actionTemplateKey;
            var actionTemplate;
            if (mode === "CREATE") {
                if (activityEventActionModel.emailSelected()) {
                    subscribedPreferences.push(activityEventActionModel.emailPreference());
                }
                if (activityEventActionModel.smsSelected()) {
                    subscribedPreferences.push(activityEventActionModel.smsPreference());
                }
                if (activityEventActionModel.mailboxSelected()) {
                    subscribedPreferences.push(activityEventActionModel.mailboxPreference());
                }
                if (activityEventActionModel.pushNotificationSelected()) {
                    subscribedPreferences.push(activityEventActionModel.pushNotificationPreference());
                }
                if (subscribedPreferences().length > 0) {
                    subscribedAction = AlertsSubscriptionModel.getNewSubscribedActionModel();
                    activityEventAction = activityEventActionModel.activityEventAction.alertDTO;
                    subscribedAction.alertName = activityEventAction.alertName;
                    subscribedAction.activityId = activityEventAction.alertKeyDTO.activityId;
                    subscribedAction.eventId = activityEventAction.alertKeyDTO.eventId;
                    subscribedAction.actionId = activityEventAction.alertKeyDTO.actionId;
                    subscribedAction.subscribedActionStartDate = dateValue();
                    subscribedAction.subscribedActionEndDate = enddateValue();
                    subscribedAction.subscriptionPreferences = subscribedPreferences();
                    actionTemplateKey = {
                        "version": 1,
                        "generatedPackageId": false,
                        "auditSequence": 1,
                        "id": "1"
                    };
                    actionTemplate = {
                        "version": 1,
                        "generatedPackageId": false,
                        "auditSequence": 1,
                        "keyDTO": actionTemplateKey
                    };
                    subscribedAction.actionTemplate = actionTemplate;
                    subscribedAction.module = module;
                    subscribedAction.subscriptionId = "";
                    subscribedAction.subscriptionLevel = subscriptionLevel;
                    if (subscriptionLevel === "ACCOUNT") {
                        subscribedAction.subscriptionLevelAccountKey = subscriptionLevelKey;
                    } else {
                        subscribedAction.subscriptionLevelPartyKey = subscriptionLevelKey;
                    }
                }
                return subscribedAction;
            } else if (mode === "EDIT") {
                subscribedPreferences = ko.observableArray();
                activityEventAction = activityEventActionModel.activityEventAction.alertDTO;
                if (activityEventActionModel.emailSelected()) {
                    subscribedPreferences.push(activityEventActionModel.emailPreference());
                }
                if (activityEventActionModel.smsSelected()) {
                    subscribedPreferences.push(activityEventActionModel.smsPreference());
                }
                if (activityEventActionModel.mailboxSelected()) {
                    subscribedPreferences.push(activityEventActionModel.mailboxPreference());
                }
                if (activityEventActionModel.pushNotificationSelected()) {
                    subscribedPreferences.push(activityEventActionModel.pushNotificationPreference());
                }
                if (subscribedPreferences().length > 0) {
                    subscribedAction = AlertsSubscriptionModel.getNewSubscribedActionModel();
                    subscribedAction.alertName = activityEventAction.alertName;
                    subscribedAction.activityId = activityEventAction.alertKeyDTO.activityId;
                    subscribedAction.eventId = activityEventAction.alertKeyDTO.eventId;
                    subscribedAction.actionId = activityEventAction.alertKeyDTO.actionId;
                    subscribedAction.subscriptionPreferences = subscribedPreferences();
                    actionTemplateKey = {
                        "version": 1,
                        "generatedPackageId": false,
                        "auditSequence": 1,
                        "id": "1"
                    };
                    actionTemplate = {
                        "version": 1,
                        "generatedPackageId": false,
                        "auditSequence": 1,
                        "keyDTO": actionTemplateKey
                    };
                    subscribedAction.actionTemplate = actionTemplate;
                    subscribedAction.module = module;
                    var subscription;
                    if (subscriptionLevel === "ACCOUNT") {
                        subscription = self.actionSubscription;
                        subscribedAction.subscriptionLevelAccountKey = subscriptionLevelKey;
                    } else {
                        subscription = self.profileSubscription;
                        subscribedAction.subscriptionLevelPartyKey = subscriptionLevelKey;
                    }
                    subscribedAction.subscribedActionStartDate = subscription().subscriptionStartDate;
                    subscribedAction.subscribedActionEndDate = subscription().subscriptionEndDate;
                    subscribedAction.subscriptionId = subscription().subscriptionId;
                    subscribedAction.subscriptionLevel = subscription().subscriptionLevel;
                }
                return subscribedAction;
            }
        };
        self.fetchAccountList = function (componentId) {
            var object;
            if (componentId === "alerts-subscription-profile") {
                object = self.profileLevelActions;
            } else {
                ko.utils.arrayForEach(self.AccountListForAccountType(), function (accountListForAccountType) {
                    if (accountListForAccountType.componentId === componentId) {
                        object = accountListForAccountType;
                    }
                });
            }
            return object.list;
        };
        self.fetchSubscription = function (componentId) {
            if (componentId === "alerts-subscription-profile") {
                return self.profileSubscription;
            }
            return self.actionSubscription;

        };
        self.checkAccountList = function () {
            var notFound = false;
            ko.utils.arrayForEach(self.accountsLoadedList(), function (listItem) {
                if (listItem.accountsLoaded() === false) {
                    notFound = true;
                }
            });
            if (!notFound) {
                self.menuOptionsAttached(true);
                ko.utils.arrayForEach(self.AccountListForAccountType(), function (object) {
                    if (object.list().length === 0) {
                        if (object.module === "CH") {
                            self.menuOptions = ko.observableArray(self.menuOptions.remove(function (remove) {
                                return remove.id !== "CASA";
                            }));
                        }
                        if (object.module === "PC") {
                            self.menuOptions = ko.observableArray(self.menuOptions.remove(function (remove) {
                                return remove.id !== "PAYMENTS";
                            }));
                        }
                        if (object.module === "LN") {
                            self.menuOptions = ko.observableArray(self.menuOptions.remove(function (remove) {
                                return remove.id !== "LOANS";
                            }));
                        }
                        if (object.module === "TD") {
                            self.menuOptions = ko.observableArray(self.menuOptions.remove(function (remove) {
                                return remove.id !== "TD";
                            }));
                        }
                    }
                });
            }
            notFound = false;

        };
        self.fetchCASAAccounts = function (activityEventActionModuleList, moduleType) {
            var party = self.SubscriptionModelInstance().partyDetails.party.value();
            var userId = self.SubscriptionModelInstance().partyDetails.userName();
            var accountType = "CSA";
            var userType = self.SubscriptionModelInstance().partyDetails.userType;
            if (userType) {
                userType = userType.toLowerCase();
                if (userType === "corporateuser" || userType === "corporate") {
                    AlertsSubscriptionModel.getAccountListUser(party, userId, accountType).then(function (data) {
                        if (data.accounts && data.accounts.length > 0) {
                            ko.utils.arrayForEach(data.accounts, function (partyAccounts) {
                                if (partyAccounts.party && partyAccounts.party.value === party && partyAccounts.accountsList && partyAccounts.accountsList.length > 0) {
                                    ko.utils.arrayForEach(partyAccounts.accountsList, function (account) {
                                        ko.utils.arrayForEach(self.AccountListForAccountType(), function (object) {
                                            if (object.accountType === account.accountType && object.module === moduleType) {
                                                var activityEventActionModelList = self.MapActionsWithAccounts(account.accountNumber.value, activityEventActionModuleList);
                                                var datasource = new oj.ArrayTableDataSource(activityEventActionModelList);
                                                object.list.push({
                                                    "accountId": account.accountNumber.value,
                                                    "accountDisplayId": account.accountNumber.displayValue,
                                                    "activityEventActions": activityEventActionModelList,
                                                    "datasource": datasource
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        }
                        ko.utils.arrayForEach(self.accountsLoadedList(), function (listItem) {
                            if (listItem.module === moduleType) {
                                listItem.accountsLoaded(true);
                                self.checkAccountList();
                            }
                        });
                    }).fail(function () {
                        ko.utils.arrayForEach(self.accountsLoadedList(), function (listItem) {
                            if (listItem.module === moduleType) {
                                listItem.accountsLoaded(true);
                                self.checkAccountList();
                            }
                        });
                    });
                } else if (userType === "retailuser") {
                    AlertsSubscriptionModel.getAccountListParty(party, accountType).then(function (data) {
                        if (data.partyToAccountRelationshipDTOs && data.partyToAccountRelationshipDTOs.length > 0) {
                            ko.utils.arrayForEach(data.partyToAccountRelationshipDTOs, function (account) {
                                ko.utils.arrayForEach(self.AccountListForAccountType(), function (object) {
                                    if (object.accountType === account.accountType && object.module === moduleType) {
                                        var activityEventActionModelList = self.MapActionsWithAccounts(account.account.value, activityEventActionModuleList);
                                        var datasource = new oj.ArrayTableDataSource(activityEventActionModelList);
                                        object.list.push({
                                            "accountId": account.account.value,
                                            "accountDisplayId": account.account.displayValue,
                                            "activityEventActions": activityEventActionModelList,
                                            "datasource": datasource
                                        });
                                    }
                                });
                            });
                        }
                        ko.utils.arrayForEach(self.accountsLoadedList(), function (listItem) {
                            if (listItem.module === moduleType) {
                                listItem.accountsLoaded(true);
                                self.checkAccountList();
                            }
                        });
                    }).fail(function () {
                        ko.utils.arrayForEach(self.accountsLoadedList(), function (listItem) {
                            if (listItem.module === moduleType) {
                                listItem.accountsLoaded(true);
                                self.checkAccountList();
                            }
                        });
                    });
                }
            }
            self.componentId("alerts-subscription-casa");
            self.showComponent(false);
            self.showComponent(true);
        };
        self.fetchTDAccounts = function (activityEventActionModuleList, moduleType) {
            var party = self.SubscriptionModelInstance().partyDetails.party.value();
            var userId = self.SubscriptionModelInstance().partyDetails.userName();
            var accountType = "TRD";
            var userType = self.SubscriptionModelInstance().partyDetails.userType;
            if (userType) {
                userType = userType.toLowerCase();
                if (userType.toLowerCase() === "corporateuser" || userType === "corporate") {
                    AlertsSubscriptionModel.getAccountListUser(party, userId, accountType).then(function (data) {
                        if (data.accounts && data.accounts.length > 0) {
                            ko.utils.arrayForEach(data.accounts, function (partyAccounts) {
                                if (partyAccounts.party && partyAccounts.party.value === party && partyAccounts.accountsList && partyAccounts.accountsList.length > 0) {
                                    ko.utils.arrayForEach(partyAccounts.accountsList, function (account) {
                                        var accountListForAccountType;
                                        ko.utils.arrayForEach(self.AccountListForAccountType(), function (object) {
                                            if (object.accountType === account.accountType && object.module === moduleType) {
                                                accountListForAccountType = object;
                                            }
                                        });
                                        var activityEventActionModelList = self.MapActionsWithAccounts(account.accountNumber.value, activityEventActionModuleList);
                                        var datasource = new oj.ArrayTableDataSource(activityEventActionModelList);
                                        accountListForAccountType.list.push({
                                            "accountId": account.accountNumber.value,
                                            "accountDisplayId": account.accountNumber.displayValue,
                                            "activityEventActions": activityEventActionModelList,
                                            "datasource": datasource
                                        });
                                    });
                                }
                            });
                        }
                        ko.utils.arrayForEach(self.accountsLoadedList(), function (listItem) {
                            if (listItem.module === moduleType) {
                                listItem.accountsLoaded(true);
                                self.checkAccountList();
                            }
                        });
                    }).fail(function () {
                        ko.utils.arrayForEach(self.accountsLoadedList(), function (listItem) {
                            if (listItem.module === moduleType) {
                                listItem.accountsLoaded(true);
                                self.checkAccountList();
                            }
                        });
                    });
                } else if (userType === "retailuser") {
                    AlertsSubscriptionModel.getAccountListParty(party, accountType).then(function (data) {
                        if (data.partyToAccountRelationshipDTOs && data.partyToAccountRelationshipDTOs.length > 0) {
                            ko.utils.arrayForEach(data.partyToAccountRelationshipDTOs, function (account) {
                                var accountListForAccountType;
                                ko.utils.arrayForEach(self.AccountListForAccountType(), function (object) {
                                    if (object.accountType === account.accountType && object.module === moduleType) {
                                        accountListForAccountType = object;
                                    }
                                });
                                var activityEventActionModelList = self.MapActionsWithAccounts(account.account.value, activityEventActionModuleList);
                                var datasource = new oj.ArrayTableDataSource(activityEventActionModelList);
                                accountListForAccountType.list.push({
                                    "accountId": account.account.value,
                                    "accountDisplayId": account.account.displayValue,
                                    "activityEventActions": activityEventActionModelList,
                                    "datasource": datasource
                                });
                            });
                        }
                        ko.utils.arrayForEach(self.accountsLoadedList(), function (listItem) {
                            if (listItem.module === moduleType) {
                                listItem.accountsLoaded(true);
                                self.checkAccountList();
                            }
                        });
                    }).fail(function () {
                        ko.utils.arrayForEach(self.accountsLoadedList(), function (listItem) {
                            if (listItem.module === moduleType) {
                                listItem.accountsLoaded(true);
                                self.checkAccountList();
                            }
                        });
                    });
                }
            }
            self.componentId("alerts-subscription-td");
            self.showComponent(false);
            self.showComponent(true);
        };
        self.fetchLNAccounts = function (activityEventActionModuleList, moduleType) {
            var party = self.SubscriptionModelInstance().partyDetails.party.value();
            var userId = self.SubscriptionModelInstance().partyDetails.userName();
            var accountType = "LON";
            var userType = self.SubscriptionModelInstance().partyDetails.userType;
            if (userType) {
                userType = userType.toLowerCase();
                if (userType === "corporateuser" || userType === "corporate") {
                    AlertsSubscriptionModel.getAccountListUser(party, userId, accountType).then(function (data) {
                        if (data.accounts && data.accounts.length > 0) {
                            ko.utils.arrayForEach(data.accounts, function (partyAccounts) {
                                if (partyAccounts.party && partyAccounts.party.value === party && partyAccounts.accountsList && partyAccounts.accountsList.length > 0) {
                                    ko.utils.arrayForEach(partyAccounts.accountsList, function (account) {
                                        var accountListForAccountType;
                                        ko.utils.arrayForEach(self.AccountListForAccountType(), function (object) {
                                            if (object.accountType === account.accountType && object.module === moduleType) {
                                                accountListForAccountType = object;
                                            }
                                        });
                                        var activityEventActionModelList = self.MapActionsWithAccounts(account.accountNumber.value, activityEventActionModuleList);
                                        var datasource = new oj.ArrayTableDataSource(activityEventActionModelList);
                                        accountListForAccountType.list.push({
                                            "accountId": account.accountNumber.value,
                                            "accountDisplayId": account.accountNumber.displayValue,
                                            "activityEventActions": activityEventActionModelList,
                                            "datasource": datasource
                                        });
                                    });
                                }
                            });
                        }
                        ko.utils.arrayForEach(self.accountsLoadedList(), function (listItem) {
                            if (listItem.module === moduleType) {
                                listItem.accountsLoaded(true);
                                self.checkAccountList();
                            }
                        });
                    }).fail(function () {
                        ko.utils.arrayForEach(self.accountsLoadedList(), function (listItem) {
                            if (listItem.module === moduleType) {
                                listItem.accountsLoaded(true);
                                self.checkAccountList();
                            }
                        });
                    });
                } else if (userType === "retailuser") {
                    AlertsSubscriptionModel.getAccountListParty(party, accountType).then(function (data) {
                        if (data.partyToAccountRelationshipDTOs && data.partyToAccountRelationshipDTOs.length > 0) {
                            ko.utils.arrayForEach(data.partyToAccountRelationshipDTOs, function (account) {
                                var accountListForAccountType;
                                ko.utils.arrayForEach(self.AccountListForAccountType(), function (object) {
                                    if (object.accountType === account.accountType && object.module === moduleType) {
                                        accountListForAccountType = object;
                                    }
                                });
                                var activityEventActionModelList = self.MapActionsWithAccounts(account.account.value, activityEventActionModuleList);
                                var datasource = new oj.ArrayTableDataSource(activityEventActionModelList);
                                accountListForAccountType.list.push({
                                    "accountId": account.account.value,
                                    "accountDisplayId": account.account.displayValue,
                                    "activityEventActions": activityEventActionModelList,
                                    "datasource": datasource
                                });
                            });
                        }
                        ko.utils.arrayForEach(self.accountsLoadedList(), function (listItem) {
                            if (listItem.module === moduleType) {
                                listItem.accountsLoaded(true);
                                self.checkAccountList();
                            }
                        });
                    }).fail(function () {
                        ko.utils.arrayForEach(self.accountsLoadedList(), function (listItem) {
                            if (listItem.module === moduleType) {
                                listItem.accountsLoaded(true);
                                self.checkAccountList();
                            }
                        });
                    });
                }
            }
            self.componentId("alerts-subscription-loans");
            self.showComponent(false);
            self.showComponent(true);
        };
        self.MapPIAlerts = function (activityEventActionList) {
            self.activityEventActionModelList.removeAll();
            ko.utils.arrayForEach(activityEventActionList(), function (activityEventAction) {
                var activityEventActionModel = AlertsSubscriptionModel.getNewActivityEventActionModel();
                activityEventActionModel.activityEventAction = activityEventAction;
                var emailPreference, smsPreference, mailboxPreference, pushNotificationPreference = false;
                var emailSelected, smsSelected, mailboxSelected, pushNotificationSelected = false;
                var emailExists, smsExists, mailboxExists, pushNotificationExists = false;
                ko.utils.arrayForEach(activityEventAction.alertDTO.recipientMessageTemplates, function (recipientMessageTemplate) {
                    ko.utils.arrayForEach(recipientMessageTemplate.messageTemplateDTO, function (messageTemplateDTO) {
                        if (messageTemplateDTO) {
                            if (messageTemplateDTO.destinationType === "EMAIL") {
                                emailExists = true;
                            } else if (messageTemplateDTO.destinationType === "SMS") {
                                smsExists = true;
                            } else if (messageTemplateDTO.destinationType === "SECURE_MAIL_BOX") {
                                mailboxExists = true;
                            } else if (messageTemplateDTO.destinationType === "PUSH_NOTIFICATION") {
                                pushNotificationExists = true;
                            }
                        }
                    });
                });
                activityEventActionModel.emailExists = ko.observable(emailExists);
                activityEventActionModel.smsExists = ko.observable(smsExists);
                activityEventActionModel.mailboxExists = ko.observable(mailboxExists);
                activityEventActionModel.pushNotificationExists = ko.observable(pushNotificationExists);
                if (self.profileSubscription() && self.profileSubscription().subscribedActions) {
                    ko.utils.arrayForEach(self.profileSubscription().subscribedActions, function (subscribedAction) {
                        if (subscribedAction.activityId === activityEventAction.alertDTO.alertKeyDTO.activityId && subscribedAction.eventId === activityEventAction.alertDTO.alertKeyDTO.eventId && subscribedAction.actionId === activityEventAction.alertDTO.alertKeyDTO.actionId) {
                            ko.utils.arrayForEach(subscribedAction.subscriptionPreferences, function (subscribedPreference) {
                                if (subscribedPreference.subscriptionLevel === "PARTY" && subscribedPreference.subscriptionLevelPartyKey.value === self.SubscriptionModelInstance().partyDetails.party.value()) {
                                    if (subscribedPreference.destination === "EMAIL") {
                                        emailPreference = subscribedPreference;
                                        emailSelected = true;
                                    } else if (subscribedPreference.destination === "SMS") {
                                        smsPreference = subscribedPreference;
                                        smsSelected = true;
                                    } else if (subscribedPreference.destination === "SECURE_MAIL_BOX") {
                                        mailboxPreference = subscribedPreference;
                                        mailboxSelected = true;
                                    } else if (subscribedPreference.destination === "PUSH_NOTIFICATION") {
                                        pushNotificationPreference = subscribedPreference;
                                        pushNotificationSelected = true;
                                    }
                                }
                            });
                        }
                    });
                    activityEventActionModel.emailPreference = ko.observable(emailPreference);
                    activityEventActionModel.smsPreference = ko.observable(smsPreference);
                    activityEventActionModel.mailboxPreference = ko.observable(mailboxPreference);
                    activityEventActionModel.emailSelected = ko.observable(emailSelected);
                    activityEventActionModel.smsSelected = ko.observable(smsSelected);
                    activityEventActionModel.mailboxSelected = ko.observable(mailboxSelected);
                } else {
                    activityEventActionModel.emailPreference = ko.observable(emailPreference);
                    activityEventActionModel.smsPreference = ko.observable(smsPreference);
                    activityEventActionModel.mailboxPreference = ko.observable(mailboxPreference);
                    activityEventActionModel.emailSelected = ko.observable(emailSelected);
                    activityEventActionModel.smsSelected = ko.observable(smsSelected);
                    activityEventActionModel.mailboxSelected = ko.observable(mailboxSelected);
                }
                activityEventActionModel.pushNotificationPreference = ko.observable(pushNotificationPreference);
                activityEventActionModel.pushNotificationSelected = ko.observable(pushNotificationSelected);
                self.activityEventActionModelList.push(activityEventActionModel);
            });
        };
        self.MapActionsWithAccounts = function (accountId, activityEventActionModuleList) {
            var activityEventActionModelList = ko.observableArray();
            ko.utils.arrayForEach(activityEventActionModuleList(), function (activityEventAction) {
                var activityEventActionModel = AlertsSubscriptionModel.getNewActivityEventActionModel();
                activityEventActionModel.activityEventAction = activityEventAction;
                var emailPreference, smsPreference, mailboxPreference, pushNotificationPreference = false;
                var emailSelected, smsSelected, mailboxSelected, pushNotificationSelected = false;
                var emailExists, smsExists, mailboxExists, pushNotificationExists = false;
                ko.utils.arrayForEach(activityEventAction.alertDTO.recipientMessageTemplates, function (recipientMessageTemplate) {
                    if (recipientMessageTemplate.keyDTO.recipient === self.validRecipient() && recipientMessageTemplate.keyDTO.recipientCategory === self.validRecipientCategory()) {
                        ko.utils.arrayForEach(recipientMessageTemplate.messageTemplateDTO, function (messageTemplateDTO) {
                            if (messageTemplateDTO) {
                                if (messageTemplateDTO.destinationType === "EMAIL") {
                                    emailExists = true;
                                } else if (messageTemplateDTO.destinationType === "SMS") {
                                    smsExists = true;
                                } else if (messageTemplateDTO.destinationType === "SECURE_MAIL_BOX") {
                                    mailboxExists = true;
                                } else if (messageTemplateDTO.destinationType === "PUSH_NOTIFICATION") {
                                    pushNotificationExists = true;
                                }
                            }
                        });
                    }
                });
                activityEventActionModel.emailExists = ko.observable(emailExists);
                activityEventActionModel.smsExists = ko.observable(smsExists);
                activityEventActionModel.mailboxExists = ko.observable(mailboxExists);
                activityEventActionModel.pushNotificationExists = ko.observable(pushNotificationExists);
                if (self.actionSubscription() && self.actionSubscription().subscribedActions) {
                    ko.utils.arrayForEach(self.actionSubscription().subscribedActions, function (subscribedAction) {
                        if (subscribedAction.activityId === activityEventAction.alertDTO.alertKeyDTO.activityId && subscribedAction.eventId === activityEventAction.alertDTO.alertKeyDTO.eventId && subscribedAction.actionId === activityEventAction.alertDTO.alertKeyDTO.actionId) {
                            ko.utils.arrayForEach(subscribedAction.subscriptionPreferences, function (subscribedPreference) {
                                if (subscribedPreference.subscriptionLevel === self.subscriptionLevel() && subscribedPreference.subscriptionLevelAccountKey.value === accountId) {
                                    if (subscribedPreference.destination === "EMAIL") {
                                        emailPreference = subscribedPreference;
                                        emailSelected = true;
                                    } else if (subscribedPreference.destination === "SMS") {
                                        smsPreference = subscribedPreference;
                                        smsSelected = true;
                                    } else if (subscribedPreference.destination === "SECURE_MAIL_BOX") {
                                        mailboxPreference = subscribedPreference;
                                        mailboxSelected = true;
                                    } else if (subscribedPreference.destination === "PUSH_NOTIFICATION") {
                                        pushNotificationPreference = subscribedPreference;
                                        pushNotificationSelected = true;
                                    }
                                }
                            });
                        }
                        activityEventActionModel.emailPreference = ko.observable(emailPreference);
                        activityEventActionModel.smsPreference = ko.observable(smsPreference);
                        activityEventActionModel.mailboxPreference = ko.observable(mailboxPreference);
                        activityEventActionModel.pushNotificationPreference = ko.observable(pushNotificationPreference);
                        activityEventActionModel.emailSelected = ko.observable(emailSelected);
                        activityEventActionModel.smsSelected = ko.observable(smsSelected);
                        activityEventActionModel.mailboxSelected = ko.observable(mailboxSelected);
                        activityEventActionModel.pushNotificationSelected = ko.observable(pushNotificationSelected);
                    });
                } else {
                    activityEventActionModel.emailPreference = ko.observable(emailPreference);
                    activityEventActionModel.smsPreference = ko.observable(smsPreference);
                    activityEventActionModel.mailboxPreference = ko.observable(mailboxPreference);
                    activityEventActionModel.pushNotificationPreference = ko.observable(pushNotificationPreference);
                    activityEventActionModel.emailSelected = ko.observable(emailSelected);
                    activityEventActionModel.smsSelected = ko.observable(smsSelected);
                    activityEventActionModel.mailboxSelected = ko.observable(mailboxSelected);
                    activityEventActionModel.pushNotificationSelected = ko.observable(pushNotificationSelected);
                }
                activityEventActionModelList.push(activityEventActionModel);
            });
            return activityEventActionModelList;
        };
        self.getAccountsLoaded = function (componentId) {
            var accountsLoaded;
            ko.utils.arrayForEach(self.accountsLoadedList(), function (listItem) {
                if (componentId === listItem.componentId) {
                    accountsLoaded = listItem.accountsLoaded;
                }
            });
            return accountsLoaded;
        };
        self.fetchActivityEventActionList = function (moduleType) {
            var activityEventActionList = ko.observableArray();
            AlertsSubscriptionModel.getActivityEventActionList(moduleType).then(function (data) {
                if (data.alertResponseDTO && data.alertResponseDTO.length > 0) {
                    ko.utils.arrayForEach(data.alertResponseDTO, function (alertResponse) {
                        var activityEventAction = alertResponse;
                        var containsPartyTemplate = false;
                        ko.utils.arrayForEach(activityEventAction.alertDTO.recipientMessageTemplates, function (recipientMessageTemplate) {
                            if (recipientMessageTemplate.keyDTO.recipient === self.validRecipient() && recipientMessageTemplate.keyDTO.recipientCategory === self.validRecipientCategory() && recipientMessageTemplate.alertType === self.validAlertType()) {
                                containsPartyTemplate = true;
                            }
                        });
                        if (activityEventAction.alertDTO.alertType === self.validAlertType() && containsPartyTemplate) {
                            activityEventActionList.push(activityEventAction);
                        }
                    });
                }
                ko.utils.arrayForEach(self.ActivityEventActionsForModule(), function (activityEventActionsForModule) {
                    if (activityEventActionsForModule.module === moduleType) {
                        activityEventActionsForModule.list = activityEventActionList;
                        if (moduleType === "CH" || moduleType === "PC") {
                            self.fetchCASAAccounts(activityEventActionsForModule.list, moduleType);
                        } else if (moduleType === "TD") {
                            self.fetchTDAccounts(activityEventActionsForModule.list, moduleType);
                        } else if (moduleType === "LN") {
                            self.fetchLNAccounts(activityEventActionsForModule.list, moduleType);
                        } else {
                            self.MapPIAlerts(activityEventActionsForModule.list);
                        }
                    }
                });
                self.moduleCount(self.moduleCount() + 1);
                if (self.moduleCount() === 5) {
                    ko.utils.arrayForEach(self.ActivityEventActionsForModule(), function (activityEventActionsForModule) {
                        if (activityEventActionsForModule.module === "CH") {
                            if (activityEventActionsForModule.list().length === 0) {
                                self.menuOptions = ko.observableArray(self.menuOptions.remove(function (remove) {
                                    return remove.id !== "CASA";
                                }));
                            }
                        }
                        if (activityEventActionsForModule.module === "PC") {
                            if (activityEventActionsForModule.list().length === 0) {
                                self.menuOptions = ko.observableArray(self.menuOptions.remove(function (remove) {
                                    return remove.id !== "PAYMENTS";
                                }));
                            }
                        }
                        if (activityEventActionsForModule.module === "PI") {
                            if (activityEventActionsForModule.list().length === 0) {
                                self.menuOptions = ko.observableArray(self.menuOptions.remove(function (remove) {
                                    return remove.id !== "PROFILE";
                                }));
                            }
                        }
                        if (activityEventActionsForModule.module === "LN") {
                            if (activityEventActionsForModule.list().length === 0) {
                                self.menuOptions = ko.observableArray(self.menuOptions.remove(function (remove) {
                                    return remove.id !== "LOANS";
                                }));
                            }
                        }
                        if (activityEventActionsForModule.module === "TD") {
                            if (activityEventActionsForModule.list().length === 0) {
                                self.menuOptions = ko.observableArray(self.menuOptions.remove(function (remove) {
                                    return remove.id !== "TD";
                                }));
                            }
                        }
                    });

                }
            }).fail(function () {
                self.moduleCount(self.moduleCount() + 1);
            });
        };
        self.componentId.subscribe(function () {
            self.showComponent(false);
            self.showComponent(true);
        });
        self.ok = function () {
            window.location.reload();
        };
        self.cancelConfirmation = function () {
            $("#cancelDialog").trigger("openModal");
        };
        self.closeDialogBox = function () {
            $("#cancelDialog").hide();
        };
        self.back = function () {
            history.back();
        };
        if (!self.approverReview()) {
            self.init();
        }
        self.checkForConfirmation = function () {
            var changesMade = false;
            var subscribedActions = ko.observableArray();
            var checkMode = "";
            var checkProfileMode = "";
            if (self.actionSubscription() && self.actionSubscription().subscriptionId) {
                checkMode = "EDIT";
            } else {
                checkMode = "CREATE";
            }
            if (self.profileSubscription() && self.profileSubscription().subscriptionId) {
                checkProfileMode = "EDIT";
            } else {
                checkProfileMode = "CREATE";
            }
            ko.utils.arrayForEach(self.AccountListForAccountType(), function (accountListForAccountType) {
                ko.utils.arrayForEach(accountListForAccountType.list(), function (accountModel) {
                    ko.utils.arrayForEach(accountModel.activityEventActions(), function (activityEventActionModel) {
                        var subscriptionLevelKey = {
                            "displayValue": accountModel.accountDisplayId,
                            "value": accountModel.accountId
                        };
                        var subscribedAction = self.fetchSubscribedAction("ACCOUNT", subscriptionLevelKey, activityEventActionModel, checkMode, accountListForAccountType.module);
                        if (subscribedAction) {
                            subscribedActions.push(subscribedAction);
                        }
                    });
                });
            });
            ko.utils.arrayForEach(self.activityEventActionModelList(), function (activityEventActionModel) {
                var subscriptionLevelKey = {
                    "displayValue": self.SubscriptionModelInstance().partyDetails.party.displayValue(),
                    "value": self.SubscriptionModelInstance().partyDetails.party.value()
                };
                var subscribedAction = self.fetchSubscribedAction("PARTY", subscriptionLevelKey, activityEventActionModel, checkProfileMode, "PI");
                if (subscribedAction) {
                    subscribedActions.push(subscribedAction);
                }
            });
            if (subscribedActions().length > 0) {
                changesMade = true;
            } else if (self.actionSubscription() && self.actionSubscription().subscribedActions && self.actionSubscription().subscribedActions.length > 0) {
                changesMade = true;
            } else if (self.profileSubscription() && self.profileSubscription().subscribedActions && self.profileSubscription().subscribedActions.length > 0) {
                changesMade = true;
            }
            return changesMade;
        };
    };
});