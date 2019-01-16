define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/payment-peer-to-peer",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojknockout-validation"
], function (oj, ko, $, peertopeerModel, BaseLogger, ResourceBundle, Constants) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.p2ppaymentData = ko.observable();
        self.resource = ResourceBundle;
        Params.baseModel.registerElement([
            "row",
            "page-section"
        ]);
        if (self.stageTwo()) {
            peertopeerModel.readP2P(self.paymentId()).done(function (data) {
                self.p2ppaymentData(data);
            });
        }
    };
});