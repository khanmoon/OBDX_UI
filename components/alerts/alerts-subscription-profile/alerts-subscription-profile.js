define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",

    "ojL10n!resources/nls/alerts-subscription",
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
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojlistview",
    "ojs/ojaccordion",
    "ojs/ojcollapsible"
], function (oj, ko, $, BaseLogger, AlertsSubscriptionProfileModel, resourceBundle) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.mode = Params.rootModel.mode;
        var partyDetails = Params.partyDetails;
        self.nls = resourceBundle;
        self.activityEventActionModelList = Params.accountlist;
        Params.baseModel.registerComponent("party-validate", "common");
        Params.baseModel.registerComponent("alerts-nav-bar", "alerts");
        self.subscribedActions = ko.observableArray();
        self.actionSubscription = Params.actionSubscription;
        self.refreshList = ko.observable(true);
        self.datasource = {};
        self.validRecipientCategory = ko.observable();
        self.validRecipient = ko.observable();
        self.validAlertType = ko.observable("S");
        if (partyDetails.userType === "corporateuser") {
            self.validRecipientCategory("CORPORATE");
            self.validRecipient("USER");
        } else {
            self.validRecipientCategory("PARTY");
            self.validRecipient("CUSTOMER");
        }
        self.datasource = new oj.ArrayTableDataSource(self.activityEventActionModelList());
        self.paginationDataSource = new oj.PagingTableDataSource(self.datasource);
        self.subscribedPreference = function (accountId, activityEventActionModel, destinationType) {
            if (self.mode() === "CREATE" || self.mode() === "EDIT") {
                self.refreshList(false);
                var selectedRecipientMessageTemplate;
                ko.utils.arrayForEach(activityEventActionModel.activityEventAction.alertDTO.recipientMessageTemplates, function (recipientMessageTemplate) {
                    if (recipientMessageTemplate.keyDTO.recipient === self.validRecipient() && recipientMessageTemplate.keyDTO.recipientCategory === self.validRecipientCategory() && recipientMessageTemplate.alertType === self.validAlertType()) {
                        selectedRecipientMessageTemplate = recipientMessageTemplate;
                    }
                });
                var preference = AlertsSubscriptionProfileModel.getNewPreferenceModel();
                preference.version = 1;
                preference.generatedPackageId = false;
                preference.auditSequence = 1;
                preference.destination = destinationType;
                preference.recipientCategory = selectedRecipientMessageTemplate.keyDTO.recipientCategory;
                preference.transactionAmount = { "amount": 0 };
                preference.consolidationRequired = false;
                preference.timeRestricted = false;
                preference.startRestrictedTime = 0;
                preference.endRestrictedTime = 0;
                preference.urgencyType = "H";
                preference.activityId = selectedRecipientMessageTemplate.keyDTO.activityId;
                preference.eventId = selectedRecipientMessageTemplate.keyDTO.eventId;
                preference.actionId = selectedRecipientMessageTemplate.keyDTO.actionId;
                if (self.actionSubscription()) {
                    preference.subscriptionId = self.actionSubscription().subscriptionId;
                    preference.subscriptionLevel = self.actionSubscription().subscriptionLevel;
                } else {
                    preference.subscriptionId = "";
                    preference.subscriptionLevel = "PARTY";
                }
                preference.subscriberValue = self.validRecipient();
                preference.subscriptionLevelPartyKey = partyDetails.party.value();
                if (destinationType === "EMAIL") {
                    preference.destinationAddress = partyDetails.emailAddress();
                    activityEventActionModel.emailPreference(preference);
                    activityEventActionModel.emailSelected(true);
                } else if (destinationType === "SMS") {
                    preference.destinationAddress = partyDetails.mobileNumber();
                    activityEventActionModel.smsPreference(preference);
                    activityEventActionModel.smsSelected(true);
                } else if (destinationType === "SECURE_MAIL_BOX") {
                    activityEventActionModel.mailboxPreference(preference);
                    activityEventActionModel.mailboxSelected(true);
                } else if (destinationType === "PUSH_NOTIFICATION") {
                    activityEventActionModel.pushNotificationPreference(preference);
                    activityEventActionModel.pushNotificationSelected(true);
                }
                self.refreshList(true);
                return true;
            } else if (self.mode() === "REVIEW") {
                return false;
            }
        };
        self.unSubscribedPreference = function (activityEventActionModel, destinationType) {
            if (self.mode() === "CREATE" || self.mode() === "EDIT") {
                self.refreshList(false);
                var emailPreference, smsPreference, mailboxPreference, pushNotificationPreference;
                if (destinationType === "EMAIL") {
                    activityEventActionModel.emailPreference(emailPreference);
                    activityEventActionModel.emailSelected(false);
                } else if (destinationType === "SMS") {
                    activityEventActionModel.smsPreference(smsPreference);
                    activityEventActionModel.smsSelected(false);
                } else if (destinationType === "SECURE_MAIL_BOX") {
                    activityEventActionModel.mailboxPreference(mailboxPreference);
                    activityEventActionModel.mailboxSelected(false);
                } else if (destinationType === "PUSH_NOTIFICATION") {
                    activityEventActionModel.pushNotificationPreference(pushNotificationPreference);
                    activityEventActionModel.pushNotificationSelected(false);
                }
                self.refreshList(true);
                return true;
            } else if (self.mode() === "REVIEW") {
                return false;
            }
        };
    };
});