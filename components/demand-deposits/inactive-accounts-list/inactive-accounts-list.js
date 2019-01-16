define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/demand-deposit-list"
], function (ko, $, InactiveAccountsModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        self.inactiveAccountList = ko.observableArray();
        rootParams.dashboard.headerName(self.locale.closeAccountList);
        rootParams.baseModel.registerElement("page-section");
        InactiveAccountsModel.fetchInactiveAccounts().then(function(data){
          self.inactiveAccountList.push(data);
        });
    };
});
