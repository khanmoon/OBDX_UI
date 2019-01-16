define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",

    "ojL10n!resources/nls/rules-admin-approvals",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, BaseLogger, RulesAdminModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("rules-admin-list", "admin-approvals");
        rootParams.baseModel.registerComponent("rules-admin-create", "admin-approvals");
        rootParams.baseModel.registerComponent("rules-admin-search", "admin-approvals");
        rootParams.baseModel.registerElement("action-header");
        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.adminrules.rules.adminRuleMaintainance);
        self.heading = ko.observable(self.nls.headers.rulesAdmin);
        self.ruleDescription = ko.observable("");
        self.searchRulesList = ko.observableArray([]);
        self.noSearchResults = ko.observable(false);
        var getNewKoModel = function () {
            var KoModel = RulesAdminModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.ruleDetails = self.rootModelInstance().approvals;
        self.createNew = function () {
            self.mode = "CREATE";
            rootParams.dashboard.loadComponent("rules-admin-create", {}, self);
        };
        self.fetchRuleDetails = function () {
            self.ruleDetails.ruleDetailsFetched();
            RulesAdminModel.fetchDetails(self.ruleDetails).done(function (data) {
                if (self.ruleDetails.ruleName() !== "") {
                    self.ruleDescription(data.ruleDTOs[0].ruleName);
                } else {
                    self.ruleDescription("");
                }
                if (data.ruleDTOs && data.ruleDTOs.length > 0) {
                    self.searchRulesList(data.ruleDTOs);
                    self.datasource = new oj.ArrayTableDataSource(self.searchRulesList(), { idAttribute: "ruleId" });
                    self.ruleDetails.ruleDetailsFetched(true);
                    self.noSearchResults(false);
                    $("#searchRuleListView").ojListView("refresh");
                } else {
                    self.noSearchResults(true);
                }
                self.ruleDetails.ruleDetailsFetched(true);
            });
        };
    };
});