define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/payments-payee-list"
], function (oj, ko, $, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.payments = ResourceBundle.payments;
        self.backButtonHandler = rootParams.backButtonHandler;
        rootParams.dashboard.headerName(self.payments.payee.view);
        rootParams.baseModel.registerElement("modal-window");
    };
});