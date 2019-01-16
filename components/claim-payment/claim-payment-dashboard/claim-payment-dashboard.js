define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "ojL10n!resources/nls/claim-payment",
    "ojs/ojinputnumber",
    "ojs/ojtrain",
    "ojs/ojbutton",
    "ojs/ojinputtext"
], function (oj, ko, $, BaseLogger, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement([
            "row",
            "page-section",
            "confirm-screen"
        ]);
        rootParams.baseModel.registerComponent("security-code-verification", "claim-payment");
        rootParams.baseModel.registerComponent("user-onboarding", "claim-payment");
        rootParams.baseModel.registerComponent("receive-payment", "claim-payment");
        self.resource = ResourceBundle;
        self.aliasType = ko.observable("");
        self.aliasValue = ko.observable("");
        self.paymentId = ko.observable("");
        self.loadComp = ko.observable();
        rootParams.dashboard.headerName(self.resource.payments.peertopeer.claimPaymentHeader);
        self.loadComp("security-code-verification");
    };
});