define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/internal-payee",
    "ojL10n!resources/nls/bank-account-payee",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton"
], function(oj, ko, $, internalPayeeModel, BaseLogger, ResourceBundle, commonPayee, Constants) {
    "use strict";
    return function(Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.internal = ko.toJS(Params.model);
        self.validationTracker = Params.validator;
        self.payeeDetails = ko.observable(self.internal);
        self.payments = commonPayee.payments;
        self.payments.payee.internal = ResourceBundle.payments.payee.internal;

        Params.baseModel.registerElement([
            "internal-account-input"
        ]);
    };
});