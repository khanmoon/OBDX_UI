define([
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/password-policy",
    "framework/js/constants/constants",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext"
], function (ko, $, PasswordPolicySearchModel, locale, Constants) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.resourcebundle = locale;

        params.dashboard.headerName(self.resourcebundle.pageTitle.header);
        self.policyName = self.policyName ? self.policyName : ko.observable();
        self.policyDesc = self.policyDesc ? self.policyDesc : ko.observable();
        self.showResults = self.showResults ? self.showResults : ko.observable(false);
        self.results = self.results ? self.results : ko.observableArray();
        params.baseModel.registerElement("page-section");
        params.baseModel.registerComponent("search-results", "password-policy");
        params.baseModel.registerComponent("create", "password-policy");
        self.clear = function () {
            self.policyName("");
            self.policyDesc("");
            self.showResults(false);
        };
        if (Constants.authenticator !== "OBDXAuthenticator") {
            params.baseModel.showMessages(null, [self.resourcebundle.message.unsupportedOperation], "ERROR", function () {
                params.dashboard.openDashBoard();
            });
        }
        self.create = function () {
            params.dashboard.loadComponent("create", {}, self);
        };
        self.search = function () {
            self.showResults(false);
            var searchParameters = {
                "policyName": self.policyName(),
                "policyDesc": self.policyDesc()
            };
            PasswordPolicySearchModel.listPasswordPolicy(searchParameters).done(function (data) {
                self.results(data.passwordPolicyDTO);
                if (self.results().length > 0) {
                    self.showResults(true);
                } else {
                    self.showResults(false);
                    params.baseModel.showMessages(null, [self.resourcebundle.message.noRecordFound], "ERROR");
                }
            });
        };
    };
});
