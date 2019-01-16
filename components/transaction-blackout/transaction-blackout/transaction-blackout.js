define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",

    "ojL10n!resources/nls/transaction-blackout",
    "ojs/ojinputtext",
    "ojs/ojradioset"
], function (oj, ko, $, BaseLogger, transactionBlackoutModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.nls = resourceBundle;
        ko.utils.extend(self, rootParams.rootModel);
        self.partyId = ko.observable();
        self.actionHeaderheading = ko.observable(self.nls.transaction.blackout);
        rootParams.baseModel.registerComponent("search-transaction-blackout", "transaction-blackout");
    };
});