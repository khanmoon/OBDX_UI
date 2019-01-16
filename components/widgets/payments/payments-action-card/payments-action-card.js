define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/payments-action-card"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.cardData = rootParams.data;
        self.image = ko.observable();
        self.renderPaymentcard = ko.observable(false);
        rootParams.baseModel.registerComponent("list-card", "payments");
        rootParams.baseModel.registerComponent("scheduled-payments", "payments");
        rootParams.baseModel.registerComponent("debtor-money-request", "debtor");
        var typeSpecResource = self.resource.payments[self.cardData.type];
        self.cardData.title = typeSpecResource.title;
        self.cardData.data = {
            "title": typeSpecResource.title,
            "subtitle": typeSpecResource.description,
            "linkText": typeSpecResource.linkText
        };
        if ([
                "managebiller",
                "managepayees",
                "managedebtor",
                "standinginstruction"
            ].indexOf(self.cardData.type) > -1)
            self.renderPaymentcard(true);
        self.transferObject = ko.observable({
            isStandingInstruction: false,
            payeeId: null
        });
        self.actionCardClick = function (componentData, context) {
            if (componentData === "payments.requestmoney") {
                context.loadComponent("debtor-money-request", {}, context);
            } else if (componentData === "payments.moneytransfer") {
                context.loadComponent("payments-money-transfer", self.transferObject(), context);
            } else if (componentData === "payments.bill") {
                context.loadComponent("bill-payments", {}, context);
            } else if (componentData === "payments.demanddraft") {
                context.loadComponent("issue-demand-draft", {}, context);
            } else if (componentData === "managebiller") {
                context.loadComponent("biller-list", self.transferObject(), context);
            } else if (componentData === "managepayees") {
                context.loadComponent("payments-payee-list", {}, context);
            } else if (componentData === "managedebtor") {
                context.loadComponent("debtor-group-list", {}, context);
            } else if (componentData === "standinginstruction") {
                context.loadComponent("standing-instructions-list", {}, context);
            } else if (componentData === "payments.pendingpayments") {
                context.loadComponent("scheduled-payments", {}, context);
            }
        };
    };
});