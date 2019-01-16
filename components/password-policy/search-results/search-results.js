define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/password-policy",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource"
], function (oj, ko, $, model, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = locale;
        self.passwordPolicyDetails = ko.observable();
        rootParams.baseModel.registerComponent("read", "password-policy");
        self.resultsDataSource = new oj.ArrayTableDataSource(self.results(), { idAttribute: "pwdPolicyName" });
        self.paginationDataSource = new oj.PagingTableDataSource(self.resultsDataSource);
        self.showPasswordPolicyDetails = function (passwordPolicyDetails) {
            self.passwordPolicyDetails(passwordPolicyDetails);
            rootParams.dashboard.loadComponent("read", {}, self);
        };
    };
});