define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/alerts-subscription",
    "framework/js/constants/constants",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojmenu",
    "ojs/ojdialog",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation"
], function (oj, ko, $, CustomerSubscriptionModel, BaseLogger, resourceBundle, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        var data = self;
        self.resource = resourceBundle;
        self.mode = ko.observable();
        self.moduleType = ko.observable((data.params.moduleId || rootParams.moduleId).toUpperCase());
        self.subscriptionLevel = ko.observable();
        self.subscriptionLevelKey = ko.observable();
        if (self.moduleType() === "PI") {
            self.subscriptionLevel("PARTY");
        } else {
            self.subscriptionLevel("ACCOUNT");
        }
        self.currencyCode = ko.observable("NA");
        self.accounts = ko.observableArray();
        self.accountType = ko.observable();
        self.accountTypes = ko.observableArray();
        self.showAccountType = ko.observable(false);
        self.showAccountList = ko.observable(false);
        self.customerName = ko.observable();
        self.account_type = ko.observable();
        self.user = ko.observable();
        self.userRoles = ko.observableArray();
        self.showButton = ko.observable(true);
        self.page = window.location.pathname.split("/").pop();
        self.partyId = ko.observable();
        self.accountlist = ko.observableArray();
        self.selected_account = ko.observable();
        self.koModel = ko.observable();
        self.koAlertModel = ko.observableArray();
        self.koSubscribedAlertModel = ko.observableArray();
        self.koPreferenceModel = ko.observableArray();
        self.subscribedAlertsList = ko.observableArray();
        self.subscriptionPresent = ko.observable(false);
        self.saveChangesDisabled = ko.observable(true);
        self.showUnsubscribed = ko.observable(false);
        self.showSubscribed = ko.observable(true);
        self.selected_alerts = ko.observableArray();
        self.other_selected_alerts = ko.observableArray();
        self.recipientString = Constants.userSegment==="CORP"? "USER" : "CUSTOMER";
        self.recipientCategoryString = Constants.userSegment==="CORP"? "CORPORATE" : "PARTY";
        self.selected_alert = ko.observable();
        self.dateValue = ko.observable(rootParams.baseModel.getDate().toISOString().slice(0, 10));
        self.enddateValue = ko.observable(new Date(2099, 1, 1).toISOString().slice(0, 10));
        self.subscription_id = ko.observable();
        self.selected_preferences = ko.observableArray();
        self.subscribed_preferences = ko.observableArray();
        self.alertsAvailable = ko.observable(false);
        self.alertMessage = ko.observable();
        self.showErrorMessage = ko.observable(true);
        self.showTransaction = ko.observable(false);
        self.showEmailNotAvailable = ko.observable(false);
        self.showSMSNotAvailable = ko.observable(false);
        rootParams.baseModel.registerElement("amount-input");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("modal-window");
        self.transactionSuccess = ko.observable(false);
        self.selectedAccount = CustomerSubscriptionModel.getNewSelectedAccountModel();
        self.unsubscribedAlertList = ko.observableArray();
        self.transactionName = ko.observable(self.resource.subscription.title);
        self.transactionStatus = ko.observable();
        self.statusMessage = ko.observable();
        self.httpStatus = ko.observable();
        self.confirmationMsg = ko.observable();
        self.actionHeaderheading = ko.observable();
        self.userId = rootParams.dashboard.userData.userProfile.userName;
        rootParams.dashboard.headerName(self.resource.subscription.title);
        CustomerSubscriptionModel.init();
        self.ActionSubscriptionModel = CustomerSubscriptionModel.getNewActionSubscriptionModel();
        CustomerSubscriptionModel.getUser().then(function (data) {
            self.partyId(data.userProfile.partyId.value);
            self.fetchAlertList();
        }).fail(function () {
            self.showErrorMessage(false);
            self.alertsAvailable(false);
            self.alertMessage(self.resource.subscription.common.serverError);
            self.showErrorMessage(true);
        });
        self.goToCreate = function () {
            self.mode("CREATE");
            $("html,body").animate({ scrollTop: $("#alerts-panel").offset().top - 200 }, "slow");
        };
        self.save = function () {
            self.mode("REVIEW");
            $("html,body").animate({ scrollTop: $("#alerts-panel").offset().top - 200 }, "slow");
        };
        self.fetchAlertList = function () {
            CustomerSubscriptionModel.getActivityEventActionList(self.moduleType()).then(function (data) {
                self.mode("CREATE");
                self.koAlertModel.removeAll();
                self.koModel.unsubscribedAlerts = data.alertResponseDTO;
                if (self.koModel.unsubscribedAlerts && self.koModel.unsubscribedAlerts.length > 0) {
                    ko.utils.arrayForEach(self.koModel.unsubscribedAlerts, function (unsubscribedAlert) {
                        if (unsubscribedAlert.alertDTO.alertType === "S" && unsubscribedAlert.alertDTO.expiryDate > self.dateValue()) {
                            self.unsubscribedAlertList.push(unsubscribedAlert.alertDTO);
                        }
                    });
                }
                if (self.unsubscribedAlertList().length > 0) {
                    if (self.subscriptionLevel() === "ACCOUNT") {
                        self.fetchAccounts();
                    } else {
                        self.subscriptionLevelKey(self.partyId());
                        self.fetchContacts();
                    }
                } else {
                    self.showErrorMessage(false);
                    self.alertsAvailable(false);
                    self.showAccountList(false);
                    self.alertMessage(self.resource.subscription.alertslist.alertNotAvailable);
                    self.showErrorMessage(true);
                }
            }).fail(function () {
                self.showErrorMessage(false);
                self.alertsAvailable(false);
                self.alertMessage(self.resource.subscription.common.serverError);
                self.showErrorMessage(true);
            });
            self.saveChangesDisabled(true);
        };
        self.fetchAccounts = function () {
            if (self.moduleType() === "CH" || self.moduleType() === "PC") {
                self.accountType("demandDeposit");
            } else if (self.moduleType() === "LN") {
                self.accountType("loan");
            } else if (self.moduleType() === "TD") {
                self.accountType("deposit");
            } else {
                self.accountType("card");
            }
            CustomerSubscriptionModel.getAccountList(self.accountType()).then(function (data) {
                var SavingsExists = ko.observable(false);
                var CurrentExists = ko.observable(false);
                if (data.accounts && data.accounts.length > 0) {
                    ko.utils.arrayForEach(data.accounts, function (account) {
                        var koAccountModel = CustomerSubscriptionModel.getNewAccountModel();
                        koAccountModel.accountId = account.id.value;
                        koAccountModel.displayValue = account.id.displayValue;
                        koAccountModel.customerName = account.partyName;
                        koAccountModel.currencyCode = account.currencyCode;
                        self.accountlist.push({
                            value: koAccountModel.accountId,
                            label: koAccountModel.displayValue,
                            customerName: koAccountModel.customerName,
                            currencyCode: koAccountModel.currencyCode
                        });
                    });
                    self.selected_account(self.accountlist()[0].value);
                    self.subscriptionLevelKey(self.accountlist()[0].value);
                    self.customerName(self.accountlist()[0].customerName);
                    self.currencyCode(self.accountlist()[0].currencyCode);
                }
                if (SavingsExists) {
                    self.accountTypes.push({
                        value: self.resource.subscription.savingAccount,
                        label: self.resource.subscription.savingAccount
                    });
                }
                if (CurrentExists) {
                    self.accountTypes.push({
                        value: self.resource.subscription.currentAccount,
                        label: self.resource.subscription.currentAccount
                    });
                }
                if (self.accountlist().length > 0) {
                    self.showAccountList(true);
                }
                self.fetchContacts();
            }).fail(function () {
                self.showErrorMessage(false);
                self.alertsAvailable(false);
                self.alertMessage(self.resource.subscription.common.serverError);
                self.showErrorMessage(true);
            });
        };
        self.fetchContacts = function () {
            CustomerSubscriptionModel.getContactDetails(self.partyId()).then(function (data) {
                var contacts = data.partyContacts;
                ko.utils.arrayForEach(contacts, function (contact) {
                    if (contact.contactType === "HMO" && contact.phone.number) {
                        if (contact.phone.number.length > 0) {
                            self.user.mobileNo = contact.phone.number;
                        }
                    }
                    if (self.user.mobileNo) {
                        if (contact.contactType === "WMO" && contact.phone.number) {
                            if (contact.phone.number.length > 0) {
                                self.user.mobileNo = contact.phone.number;
                            }
                        }
                    }
                    if (contact.contactType === "PEM") {
                        if (contact.email.length > 0) {
                            self.user.emailId = contact.email;
                        }
                    }
                    if (self.user.emailId) {
                        if (contact.contactType === "WEM") {
                            if (contact.email.length > 0) {
                                self.user.emailId = contact.email;
                            }
                        }
                    }
                });
                if (self.subscriptionLevel() === "PARTY") {
                    self.populateAlerts();
                }
            }).fail(function () {
                self.showErrorMessage(false);
                self.alertsAvailable(false);
                self.alertMessage(self.resource.subscription.common.serverError);
                self.showErrorMessage(true);
            });
        };
        self.valueChangeHandler = function (context, valueParam) {
            if (valueParam.option === "value") {
                self.showAccountList(false);
                self.accountlist.removeAll();
                ko.utils.arrayForEach(self.accounts(), function (account) {
                    if (account.accountType === valueParam.value) {
                        self.accountlist.push({
                            value: account.accountId,
                            label: account.displayValue,
                            customerName: account.customerName,
                            currency: account.currencyCode,
                            currencyCode: account.currencyCode
                        });
                    }
                });
                self.selected_account(self.accountlist()[0].value);
                self.selectedAccount.displayValue = self.accountlist()[0].label;
                self.selectedAccount.value = self.accountlist()[0].value;
                self.subscriptionLevelKey(self.selectedAccount.value);
                self.customerName(self.accountlist()[0].customerName);
                self.currencyCode(self.accountlist()[0].currencyCode);
                self.showAccountList(true);
            }
        };
        self.accountChangeHandler = function (event) {
            var i = 0;
            ko.utils.arrayForEach(self.accountlist(), function (account) {
                if (account.label === event.detail.value) {
                    self.customerName(account.customerName);
                    self.currencyCode(account.currencyCode);
                    self.selectedAccount.displayValue = self.accountlist()[i].label;
                    self.selectedAccount.value = self.accountlist()[i].value;
                    self.subscriptionLevelKey(self.selectedAccount.value);
                    self.populateAlerts();
                }
                i = i + 1;
            });
        };
        self.populateAlerts = function () {
            self.koModel = CustomerSubscriptionModel.getNewModel();
            self.koSubscribedAlertModel.removeAll();
            self.koModel.isSubscriptionPresent = false;
            self.subscription_id = ko.observable();
            CustomerSubscriptionModel.getAlertList(self.moduleType(), self.subscriptionLevel(), self.subscriptionLevelKey(), self.partyId(), self.userId, Constants.userSegment==="CORP").then(function (data) {
                self.mode("CREATE");
                self.koModel.subscribedAlerts = data.actionSubscriptionDTO;
                self.other_selected_alerts.removeAll();
                self.ActionSubscriptionModel.isActive = true;
                if (self.koModel.subscribedAlerts) {
                    self.ActionSubscriptionModel.subscriptionEndDate = self.koModel.subscribedAlerts[0].subscriptionEndDate;
                    self.ActionSubscriptionModel.subscriptionLevel = self.koModel.subscribedAlerts[0].subscriptionLevel;
                    self.ActionSubscriptionModel.subscriptionStartDate = self.koModel.subscribedAlerts[0].subscriptionStartDate;
                    self.ActionSubscriptionModel.subscriptionId = self.koModel.subscribedAlerts[0].subscriptionId;
                    self.subscription_id = self.ActionSubscriptionModel.subscriptionId;
                    if (self.koModel.subscribedAlerts && self.koModel.subscribedAlerts[0].subscribedActions && self.koModel.subscribedAlerts[0].isActive) {
                        ko.utils.arrayForEach(self.koModel.subscribedAlerts[0].subscribedActions, function (subscribedAlert) {
                            if (subscribedAlert.module !== self.moduleType()) {
                                self.other_selected_alerts.push(subscribedAlert);
                            }
                            var subsKeyValue;
                            if (subscribedAlert.subscriptionLevel === "ACCOUNT") {
                                subsKeyValue = subscribedAlert.subscriptionLevelAccountKey.value;
                            } else if (subscribedAlert.subscriptionLevel === "PARTY") {
                                subsKeyValue = subscribedAlert.subscriptionLevelPartyKey.value;
                            }
                            if (subsKeyValue === self.subscriptionLevelKey()) {
                                var alertModel = CustomerSubscriptionModel.getNewSubscribedActionModel();
                                alertModel.alertName = subscribedAlert.alertName;
                                alertModel.subscribedActionStartDate = ko.observable(new Date(subscribedAlert.subscribedActionStartDate).toISOString().slice(0, 10));
                                alertModel.subscribedActionEndDate = ko.observable(new Date(subscribedAlert.subscribedActionEndDate).toISOString().slice(0, 10));
                                alertModel.actionId = subscribedAlert.actionId;
                                alertModel.eventId = subscribedAlert.eventId;
                                alertModel.activityId = subscribedAlert.activityId;
                                alertModel.actionTemplateId = subscribedAlert.actionTemplate.keyDTO.id;
                                alertModel.module = subscribedAlert.module;
                                var koSubscribedPreferencesModel = ko.observableArray();
                                if (subscribedAlert.subscriptionPreferences && subscribedAlert.subscriptionPreferences) {
                                    ko.utils.arrayForEach(subscribedAlert.subscriptionPreferences, function (subscribedPreference) {
                                        var preference = CustomerSubscriptionModel.getNewSubscriptionPreferenceModel();
                                        preference.consolidationRequired = subscribedPreference.consolidationRequired;
                                        preference.recipientCategory = subscribedPreference.recipientCategory;
                                        preference.startRestrictedTime = subscribedPreference.startRestrictedTime;
                                        preference.endRestrictedTime = subscribedPreference.endRestrictedTime;
                                        preference.transactionAmount = subscribedPreference.transactionAmount;
                                        preference.timeRestricted = subscribedPreference.timeRestricted;
                                        preference.destination = subscribedPreference.destination;
                                        preference.urgencyType = subscribedPreference.urgencyType;
                                        koSubscribedPreferencesModel.push(preference);
                                    });
                                    alertModel.subscriptionPreferences = koSubscribedPreferencesModel();
                                    self.koSubscribedAlertModel.push(alertModel);
                                }
                            } else {
                                self.other_selected_alerts.push(subscribedAlert);
                            }
                        });
                    }
                }
                self.fetchActivityEventActions();
            }).fail(function () {
                self.showErrorMessage(false);
                self.alertsAvailable(false);
                self.alertMessage(self.resource.subscription.common.serverError);
                self.showErrorMessage(true);
            });
        };
        self.fetchActivityEventActions = function () {
            self.koAlertModel.removeAll();
            self.selected_alerts.removeAll();
            var i = 0;
            if (self.unsubscribedAlertList() && self.unsubscribedAlertList().length > 0) {
                ko.utils.arrayForEach(self.unsubscribedAlertList(), function (unsubscribedAlert) {
                    var alertModel = self.populateAlertModel(unsubscribedAlert, i);
                    var subscribedAlert;
                    if (unsubscribedAlert.recipientMessageTemplates && unsubscribedAlert.recipientMessageTemplates.length > 0) {
                        ko.utils.arrayForEach(self.koSubscribedAlertModel(), function (subscribedAlertObj) {
                            if (subscribedAlertObj.alertName === alertModel.alertName) {
                                alertModel.subscribed = true;
                                subscribedAlert = subscribedAlertObj;
                            }
                        });
                        ko.utils.arrayForEach(unsubscribedAlert.recipientMessageTemplates, function (recipientMessageTemplate) {
                            if (recipientMessageTemplate.keyDTO.recipient === self.recipientString && recipientMessageTemplate.keyDTO.recipientCategory === self.recipientCategoryString && recipientMessageTemplate.alertType === "S") {
                                ko.utils.arrayForEach(recipientMessageTemplate.messageTemplateDTO, function (messageTemplate) {
                                    var preferenceModel = self.populatePreferenceModel(unsubscribedAlert, recipientMessageTemplate, messageTemplate);
                                    if (preferenceModel.destination === "EMAIL") {
                                        if (alertModel.subscribed) {
                                            ko.utils.arrayForEach(subscribedAlert.subscriptionPreferences, function (preference) {
                                                if (preference.destination === "EMAIL") {
                                                    preferenceModel.destinationAddress = preference.destinationAddress;
                                                    alertModel.destinationEmail = true;
                                                    alertModel.amount(preference.transactionAmount.amount);
                                                    preferenceModel.amount = ko.observable(alertModel.amount());
                                                    alertModel.emailpreference = preferenceModel;
                                                    alertModel.activeEmail = ko.observable(true);
                                                }
                                            });
                                            if (!alertModel.activeEmail()) {
                                                preferenceModel.destinationAddress = ko.observable(self.user.emailId);
                                                alertModel.destinationEmail = true;
                                                alertModel.emailpreference = preferenceModel;
                                                alertModel.activeEmail = ko.observable(false);
                                            }
                                        } else {
                                            preferenceModel.destinationAddress = ko.observable(self.user.emailId);
                                            alertModel.destinationEmail = true;
                                            alertModel.activeEmail = ko.observable(false);
                                            alertModel.emailpreference = preferenceModel;
                                        }
                                    }
                                    if (preferenceModel.destination === "SMS") {
                                        if (alertModel.subscribed) {
                                            ko.utils.arrayForEach(subscribedAlert.subscriptionPreferences, function (preference) {
                                                if (preference.destination === preferenceModel.destination) {
                                                    preferenceModel.destinationAddress = preference.destinationAddress;
                                                    alertModel.destinationSMS = true;
                                                    alertModel.amount(preference.transactionAmount.amount);
                                                    preferenceModel.amount = ko.observable(alertModel.amount());
                                                    alertModel.smspreference = preferenceModel;
                                                    alertModel.activeSMS = ko.observable(true);
                                                }
                                            });
                                            if (!alertModel.activeSMS()) {
                                                preferenceModel.destinationAddress = ko.observable(self.user.emailId);
                                                alertModel.destinationSMS = true;
                                                alertModel.smspreference = preferenceModel;
                                                alertModel.activeSMS = ko.observable(false);
                                            }
                                        } else {
                                            preferenceModel.destinationAddress = ko.observable(self.user.mobileNo);
                                            alertModel.destinationSMS = true;
                                            alertModel.smspreference = preferenceModel;
                                            alertModel.activeSMS = ko.observable(false);
                                        }
                                    }
                                    if (preferenceModel.destination === "SECURE_MAIL_BOX") {
                                        if (alertModel.subscribed) {
                                            ko.utils.arrayForEach(subscribedAlert.subscriptionPreferences, function (preference) {
                                                if (preference.destination === "SECURE_MAIL_BOX") {
                                                    preferenceModel.destinationAddress = preference.destinationAddress;
                                                    alertModel.destinationSecure = true;
                                                    alertModel.amount(preference.transactionAmount.amount);
                                                    preferenceModel.amount = ko.observable(alertModel.amount());
                                                    alertModel.securePreference = preferenceModel;
                                                    alertModel.activeSecure = ko.observable(true);
                                                }
                                            });
                                            if (!alertModel.activeSecure()) {
                                                preferenceModel.destinationAddress = ko.observable(self.user.emailId);
                                                alertModel.destinationSecure = true;
                                                alertModel.securePreference = preferenceModel;
                                                alertModel.activeSecure = ko.observable(false);
                                            }
                                        } else {
                                            preferenceModel.destinationAddress = ko.observable(self.user.emailId);
                                            alertModel.destinationSecure = true;
                                            alertModel.securePreference = preferenceModel;
                                            alertModel.activeSecure = ko.observable(false);
                                        }
                                    }
                                    if (preferenceModel.destination === "PUSH_NOTIFICATION") {
                                        if (alertModel.subscribed) {
                                            ko.utils.arrayForEach(subscribedAlert.subscriptionPreferences, function (preference) {
                                                if (preference.destination === "PUSH_NOTIFICATION") {
                                                    preferenceModel.destinationAddress = preference.destinationAddress;
                                                    alertModel.destinationPush = true;
                                                    alertModel.amount(preference.transactionAmount.amount);
                                                    preferenceModel.amount = ko.observable(alertModel.amount());
                                                    alertModel.pushPreference = preferenceModel;
                                                    alertModel.activePush = ko.observable(true);
                                                }
                                            });
                                            if (!alertModel.activePush()) {
                                                preferenceModel.destinationAddress = ko.observable("DEVICE_KEY");
                                                alertModel.destinationPush = true;
                                                alertModel.pushPreference = preferenceModel;
                                                alertModel.activePush = ko.observable(false);
                                            }
                                        } else {
                                            preferenceModel.destinationAddress = ko.observable("DEVICE_KEY");
                                            alertModel.destinationPush = true;
                                            alertModel.pushPreference = preferenceModel;
                                            alertModel.activePush = ko.observable(false);
                                        }
                                    }
                                });
                            }
                        });
                        if (alertModel.activeEmail() || alertModel.activeSMS() || alertModel.activeSecure()) {
                            if (alertModel.activeEmail() && !alertModel.activeSMS()) {
                                alertModel.amount(alertModel.emailpreference.amount);
                                if (alertModel.destinationSMS) {
                                    alertModel.smspreference.amount = ko.observable(alertModel.amount());
                                }
                            } else if (!alertModel.activeEmail() && alertModel.activeSMS()) {
                                alertModel.amount(alertModel.smspreference.amount);
                                if (alertModel.destinationEmail) {
                                    alertModel.emailpreference.amount = ko.observable(alertModel.amount());
                                }
                            }
                            alertModel.readonly = ko.observable(true);
                        } else {
                            if (alertModel.destinationSMS) {
                                alertModel.smspreference.amount = ko.observable(alertModel.amount());
                            }
                            if (alertModel.destinationEmail) {
                                alertModel.emailpreference.amount = ko.observable(alertModel.amount());
                            }
                            alertModel.readonly = ko.observable(false);
                        }
                    }
                    if (alertModel.destinationSMS || alertModel.destinationEmail || alertModel.destinationSecure) {
                        if (alertModel.expiryDate > alertModel.start_date()) {
                            self.koAlertModel.push(alertModel);
                            i = i + 1;
                            if (alertModel.subscribed) {
                                self.selected_alerts.push(alertModel);
                            }
                        }
                    }
                });
            }
            if (self.koAlertModel().length > 0) {
                self.alertsAvailable(true);
                self.showAccountList(true);
            } else {
                self.showErrorMessage(false);
                self.alertsAvailable(false);
                self.showAccountList(false);
                self.alertMessage(self.resource.subscription.alertslist.alertNotAvailable);
                self.showErrorMessage(true);
            }
        };
        self.populateAlertModel = function (unsubscribedAlert, i) {
            var alertModel = CustomerSubscriptionModel.getNewAlertModel();
            alertModel.index = i;
            alertModel.alertName = unsubscribedAlert.alertName;
            alertModel.start_date = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
            alertModel.expiryDate = unsubscribedAlert.expiryDate;
            alertModel.end_date = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(alertModel.expiryDate)));
            alertModel.actionId = unsubscribedAlert.alertKeyDTO.actionId;
            alertModel.eventId = unsubscribedAlert.alertKeyDTO.eventId;
            alertModel.activityId = unsubscribedAlert.alertKeyDTO.activityId;
            alertModel.actionTemplateId = unsubscribedAlert.alertTemplate.keyDTO.id;
            alertModel.eventType = unsubscribedAlert.eventType;
            if (self.currencyCode() === "NA") {
                alertModel.transactional = false;
            } else {
                alertModel.transactional = unsubscribedAlert.transactional;
            }
            alertModel.destinationEmail = false;
            alertModel.destinationSMS = false;
            alertModel.destinationSecure = false;
            alertModel.destinationPush = false;
            alertModel.activeEmail = ko.observable(false);
            alertModel.activeSMS = ko.observable(false);
            alertModel.activeSecure = ko.observable(false);
            alertModel.activePush = ko.observable(false);
            alertModel.subscribed = false;
            alertModel.amount = ko.observable();
            return alertModel;
        };
        self.populatePreferenceModel = function (unsubscribedAlert, recipientMessageTemplate, messageTemplate) {
            var preferenceModel = CustomerSubscriptionModel.getNewPreferenceModel();
            preferenceModel.contact_name = self.customerName();
            preferenceModel.priority = unsubscribedAlert.alertTemplate.urgency;
            preferenceModel.recipient = recipientMessageTemplate.keyDTO.recipient;
            preferenceModel.recipientCategory = recipientMessageTemplate.keyDTO.recipientCategory;
            preferenceModel.templateId = messageTemplate.messageTemplateId;
            preferenceModel.recipientType = recipientMessageTemplate.recipientType;
            preferenceModel.destination = messageTemplate.destinationType;
            return preferenceModel;
        };
        function addObjectToSelectedAlertsIfItsNotAddedYet(object) {
            if (!object.activeSMS() && !object.activeEmail() && !object.activePush() && !object.activeSecure()) {
                self.selected_alerts.push(object);
            }
        }
        function removeObjectFromSelectedAlertsIfNoAlertIsActive(object) {
            if (!object.activeSMS() && !object.activeEmail() && !object.activePush() && !object.activeSecure()) {
                self.selected_alerts.remove(function (alert) {
                    return alert.alertName === object.alertName;
                });
            }
        }
        self.toggleEmailSelect = function (object) {
            if (self.user.emailId) {
                self.showEmailNotAvailable(true);
                $("#ContactUnavailable").trigger("openModal");
            } else {
                self.saveChangesDisabled(false);
                if (!object.activeEmail()) {
                    addObjectToSelectedAlertsIfItsNotAddedYet(object);
                    object.activeEmail(true);
                } else {
                    object.activeEmail(false);
                    removeObjectFromSelectedAlertsIfNoAlertIsActive(object);
                }
            }
        };
        self.toggleSMSSelect = function (object) {
            if (self.user.mobileNo) {
                self.showSMSNotAvailable(true);
                $("#ContactUnavailable").trigger("openModal");
            } else {
                self.saveChangesDisabled(false);
                if (!object.activeSMS()) {
                    addObjectToSelectedAlertsIfItsNotAddedYet(object);
                    object.activeSMS(true);
                } else {
                    object.activeSMS(false);
                    removeObjectFromSelectedAlertsIfNoAlertIsActive(object);
                }
            }
        };
        self.toggleSecureSelect = function (object) {
            self.saveChangesDisabled(false);
            if (!object.activeSecure()) {
                addObjectToSelectedAlertsIfItsNotAddedYet(object);
                object.activeSecure(true);
            } else {
                object.activeSecure(false);
                removeObjectFromSelectedAlertsIfNoAlertIsActive(object);
            }
        };
        self.togglePushSelect = function (object) {
            self.saveChangesDisabled(false);
            if (!object.activePush()) {
                addObjectToSelectedAlertsIfItsNotAddedYet(object);
                object.activePush(true);
            } else {
                object.activePush(false);
                removeObjectFromSelectedAlertsIfNoAlertIsActive(object);
            }
        };
        self.subscribe = function () {
            if (self.selected_alerts().length === 0 && self.subscription_id && self.other_selected_alerts().length === 0) {
                self.deleteSubscription();
                self.subscription_id = ko.observable();
            } else {
                var koSubscribedActions = ko.observableArray();
                self.koSubscribedAlertModel.removeAll();
                var populateSubscriptionPreference = function (preference, SubscriptionPreferenceModel, alert) {
                    SubscriptionPreferenceModel.recipientCategory = preference.recipientCategory;
                    SubscriptionPreferenceModel.recipient = preference.recipient;
                    SubscriptionPreferenceModel.destinationAddress = preference.destinationAddress;
                    SubscriptionPreferenceModel.startRestrictedTime = 0;
                    SubscriptionPreferenceModel.endRestrictedTime = 0;
                    var transactionAmount = CustomerSubscriptionModel.getNewTransactionAmountModel();
                    transactionAmount.currency = self.currencyCode();
                    transactionAmount.amount = 0;
                    SubscriptionPreferenceModel.transactionAmount = transactionAmount;
                    SubscriptionPreferenceModel.consolidationRequired = false;
                    SubscriptionPreferenceModel.timeRestricted = false;
                    SubscriptionPreferenceModel.destination = preference.destination;
                    SubscriptionPreferenceModel.recipientType = preference.recipientType;
                    SubscriptionPreferenceModel.urgencyType = preference.priority;
                    SubscriptionPreferenceModel.subscriptionLevel = self.subscriptionLevel();
                    if (self.subscriptionLevel() === "ACCOUNT")
                        SubscriptionPreferenceModel.subscriptionLevelAccountKey = self.subscriptionLevelKey();
                    else if (self.subscriptionLevel() === "PARTY")
                        SubscriptionPreferenceModel.subscriptionLevelPartyKey = self.subscriptionLevelKey();
                    SubscriptionPreferenceModel.activityId = alert.activityId;
                    SubscriptionPreferenceModel.eventId = alert.eventId;
                    SubscriptionPreferenceModel.actionId = alert.actionId;
                    SubscriptionPreferenceModel.subscriberValue = Constants.userSegment === "CORP"? self.resource.subscription.user.toUpperCase() : self.resource.subscription.recipient.toUpperCase();
                    SubscriptionPreferenceModel.subscriptionId = self.subscription_id;
                };
                var SubscriptionPreferenceModel;
                var preference;
                ko.utils.arrayForEach(self.selected_alerts(), function (alert) {
                    var KoSubscriptionPreference = ko.observableArray();
                    if (alert.destinationEmail && alert.activeEmail()) {
                        SubscriptionPreferenceModel = CustomerSubscriptionModel.getNewSubscriptionPreferenceModel();
                        preference = alert.emailpreference;
                        populateSubscriptionPreference(preference, SubscriptionPreferenceModel, alert);
                        KoSubscriptionPreference.push(SubscriptionPreferenceModel);
                    }
                    if (alert.destinationSMS && alert.activeSMS()) {
                        SubscriptionPreferenceModel = CustomerSubscriptionModel.getNewSubscriptionPreferenceModel();
                        preference = alert.smspreference;
                        populateSubscriptionPreference(preference, SubscriptionPreferenceModel, alert);
                        KoSubscriptionPreference.push(SubscriptionPreferenceModel);
                    }
                    if (alert.destinationSecure && alert.activeSecure()) {
                        SubscriptionPreferenceModel = CustomerSubscriptionModel.getNewSubscriptionPreferenceModel();
                        preference = alert.securePreference;
                        populateSubscriptionPreference(preference, SubscriptionPreferenceModel, alert);
                        KoSubscriptionPreference.push(SubscriptionPreferenceModel);
                    }
                    if (alert.destinationPush && alert.activePush()) {
                        SubscriptionPreferenceModel = CustomerSubscriptionModel.getNewSubscriptionPreferenceModel();
                        preference = alert.pushPreference;
                        populateSubscriptionPreference(preference, SubscriptionPreferenceModel, alert);
                        KoSubscriptionPreference.push(SubscriptionPreferenceModel);
                    }
                    var SubscribedActionModel = CustomerSubscriptionModel.getNewSubscribedActionModel();
                    var actionTemplateKeyDTO = { "id": alert.actionTemplateId };
                    var actionTemplateDTO = { "keyDTO": actionTemplateKeyDTO };
                    SubscribedActionModel.actionTemplate = actionTemplateDTO;
                    SubscribedActionModel.module = self.moduleType;
                    SubscribedActionModel.actionId = alert.actionId;
                    SubscribedActionModel.eventId = alert.eventId;
                    SubscribedActionModel.activityId = alert.activityId;
                    SubscribedActionModel.subscribedActionStartDate = new Date(alert.start_date()).toISOString().slice(0, 10);
                    SubscribedActionModel.subscribedActionEndDate = new Date(alert.expiryDate).toISOString().slice(0, 10);
                    SubscribedActionModel.alertName = alert.alertName;
                    SubscribedActionModel.eventType = alert.eventType;
                    SubscribedActionModel.subscriptionLevel = self.subscriptionLevel();
                    if (self.subscriptionLevel() === "ACCOUNT")
                        SubscribedActionModel.subscriptionLevelAccountKey = self.subscriptionLevelKey();
                    else if (self.subscriptionLevel() === "PARTY")
                        SubscribedActionModel.subscriptionLevelPartyKey = self.subscriptionLevelKey();
                    SubscribedActionModel.subscriptionId = self.subscription_id;
                    SubscribedActionModel.subscriptionPreferences = KoSubscriptionPreference();
                    koSubscribedActions.push(SubscribedActionModel);
                });
                if (self.other_selected_alerts) {
                    ko.utils.arrayForEach(self.other_selected_alerts(), function (alert) {
                        koSubscribedActions.push(alert);
                    });
                }
                if (Constants.userSegment === "CORP") {
                    var subscriberForCorp = {
                        id: rootParams.dashboard.userData.userProfile.userName,
                        subscriberType: "CORPORATE"
                    };
                    self.ActionSubscriptionModel.subscriber = subscriberForCorp;
                }
                else {
                    var subscriber = {
                        "party": self.partyId(),
                        "subscriberType": "PARTY"
                    };
                    self.ActionSubscriptionModel.subscriber = subscriber;
                }
                var ActionSubscriptionModelJson;
                if (self.ActionSubscriptionModel.subscriptionId) {
                    self.ActionSubscriptionModel.subscribedActions = koSubscribedActions();
                    ActionSubscriptionModelJson = ko.toJSON(self.ActionSubscriptionModel);
                    CustomerSubscriptionModel.saveModel(ActionSubscriptionModelJson).done(function (data, status, jqXhr) {
                        self.transactionSuccess(true);
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXhr,
                            transactionName: self.transactionName(),
                            template: "confirm-screen/alerts"
                        }, self);
                        self.actionHeaderheading(self.resource.subscription.headers[self.mode()]);
                        self.confirmationMsg(self.resource.subscription.success_message);
                    });
                } else {
                    self.ActionSubscriptionModel.isActive = true;
                    self.ActionSubscriptionModel.subscriptionLevel = self.subscriptionLevel();
                    self.ActionSubscriptionModel.subscriptionStartDate = self.dateValue();
                    self.ActionSubscriptionModel.subscriptionEndDate = self.enddateValue();
                    self.ActionSubscriptionModel.subscribedActions = koSubscribedActions();
                    ActionSubscriptionModelJson = ko.toJSON(self.ActionSubscriptionModel);
                    CustomerSubscriptionModel.saveModel(ActionSubscriptionModelJson).done(function (data, status, jqXhr) {
                        self.transactionSuccess(true);
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXhr,
                            transactionName: self.transactionName(),
                            template: "confirm-screen/alerts"
                        }, self);
                        self.transactionStatus(data);
                        self.actionHeaderheading(self.resource.subscription.headers[self.mode()]);
                        self.confirmationMsg(self.resource.subscription.success_message);
                    });
                }
            }
        };
        self.deleteSubscription = function () {
            CustomerSubscriptionModel.deleteModel(self.subscription_id).done(function (data, status, jqXhr) {
                self.transactionSuccess(true);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                }, self);
            });
        };
        self.ok = function () {
            window.location.reload();
        };
    };
});
