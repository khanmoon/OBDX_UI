define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/wallets-report",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox"
], function (oj, ko, $, walletKYCModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle.wallets;
        self.validationTracker = ko.observable();
        self.statusMap = {};
        self.walletKYCStatuses = ko.observableArray();
        self.isWalletKYCStatusesLoaded = ko.observable(false);
        walletKYCModel.fetchEnumeration().done(function (data) {
            self.walletKYCStatuses(data.enumRepresentations[0].data);
            self.isWalletKYCStatusesLoaded(true);
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.statusMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
        });
        self.onKYCStatusSelected = function (event) {
            if (event.detail.value) {
                $("#statusDisplayName").val(self.statusMap[event.detail.value]);
            }
        };
    };
});