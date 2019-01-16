define([
    "ojs/ojcore",
    "knockout"
], function (oj, ko) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.stageFour = ko.observable(true);
        self.stageFive = ko.observable(false);
        self.validationTracker = ko.observable();
        self.reviewLimit = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.stageFour(false).stageFive(true);
        };
        self.cancelReviewLimit = function () {
            self.stageFour(true).stageFive(false);
        };
        rootParams.baseModel.registerComponent("demand-draft-payee", "payee");
        rootParams.baseModel.registerComponent("bank-account-payee", "payee");
        rootParams.baseModel.registerElement("amount-input");
    };
});