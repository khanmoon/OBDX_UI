define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/dashboard-payments"
], function (ko, $, PaymentsCardModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        self.countPayments = ko.observable();
        self.dataFetched = ko.observable(false);
        rootParams.baseModel.registerElement("dashboard-card");
        rootParams.baseModel.registerComponent("quick-links", "accounts");
        self.cardModule = rootParams.data.data.module;
        if (self.cardModule === "PAYMENTS") {
            self.cardTitle = self.locale.payments.primary_description;
            self.featureText = self.locale.payments.featureText;
            self.module = "payments";
        } else if (self.cardModule === "PFM") {
            self.cardTitle = self.locale.pfm.primary_description;
            self.featureText = self.locale.pfm.featureText;
            self.module = "personal-finance-management";
        }
        self.dataFetched(true);
    };
});