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
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, BaseLogger, RulesAdminModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resourceBundle = resourceBundle;
        rootParams.baseModel.registerComponent("rules-admin-create", "admin-approvals");
        rootParams.baseModel.registerComponent("rules-admin-search", "admin-approvals");
        rootParams.dashboard.headerName(self.resourceBundle.headers.rulesAdmin);
        self.actionHeaderheading = ko.observable(self.resourceBundle.headers.rulesAdmin);
        self.ruleList = null;
        self.transactionType = ko.observable("ADMINISTRATION");
        self.adminTransactionsList = ko.observable();
        self.searchRulesList = ko.observable();
        self.searchResultsFetched = ko.observable(false);

        self.columnArray=[{
          headerText:self.resourceBundle.adminrules.rules.ruleCode,
          renderer: oj.KnockoutTemplateUtils.getRenderer("viewDetails", true)
        },
        {
          headerText:self.resourceBundle.adminrules.rules.description,
          field:"description"
        },
        {
          headerText:self.resourceBundle.adminrules.rules.transactions,
          field:"transaction"
        }];

        var getNewKoModel = function () {
            var KoModel = RulesAdminModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };

        self.cancel = function () {
            rootParams.dashboard.openDashBoard();
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.ruleDetails = self.rootModelInstance().approvals;
        self.submitIfEnter = function (data, event) {
            if (event.keyCode === 13) {
                self.fetchRuleDetails();
            }
        };
        self.back = function () {
            self.ruleDetails.description("");
            self.ruleDetails.ruleName("");
            self.ruleDetails.ruleDetailsFetched(false);
            self.searchResultsFetched(false);
        };
        self.viewRule = function (data) {
            if (rootParams.baseModel.small()) {
                data.ruleDetails = self.rootModelInstance().approvals;
                data.mode = "VIEW";
                self.mode = "VIEW";
                rootParams.dashboard.loadComponent("rules-admin-create", data, self);
            } else {
                var context = { party: {} };
                if (data.ruleName) {
                    context = data;
                    context.partyDetails = self.rootModelInstance().approvals;
                    context.mode = "VIEW";
                    self.mode = "VIEW";
                    rootParams.dashboard.loadComponent("rules-admin-create", context, self);
                }
            }
        };
        self.clear = function () {
            self.ruleDetails.description(null);
            self.ruleDetails.ruleName(null);
            self.ruleDetails.ruleDetailsFetched(false);
            self.searchResultsFetched(false);
        };
        self.fetchRuleDetails = function () {
            if (self.ruleDetails.ruleName() === "" && self.ruleDetails.description() === "") {
                rootParams.baseModel.showMessages(null, [self.resourceBundle.info.noDescription], "ERROR");
                return;
            }
            RulesAdminModel.getTransactions(self.transactionType()).done(function (taskData) {
                self.adminTransactionsList(taskData);
                RulesAdminModel.fetchDetails(self.ruleDetails).done(function (data) {
                    if (data.ruleDTOs && data.ruleDTOs.length > 0) {
                        self.ruleList = data.ruleDTOs;
                        for (var i = 0; i < data.ruleDTOs.length; i++) {
                            if (!data.ruleDTOs[i].description) {
                                data.ruleDTOs[i].description = "";
                            }
                            if (!data.ruleDTOs[i].associatedRuleCriterias || data.ruleDTOs[i].associatedRuleCriterias.length <= 0) {
                                data.ruleDTOs[i].associatedRuleCriterias.push({
                                    constraintValue1: "",
                                    ruleCriteriaDTO: { taskType: "" }
                                });
                            }
                            if (!data.ruleDTOs[i].transaction && self.adminTransactionsList()) {
                                for (var j = 0; j < self.adminTransactionsList().taskList[0].childTasks.length; j++) {
                                    if (data.ruleDTOs[i].associatedRuleCriterias[0].constraintValue1 === "MT") {
                                        data.ruleDTOs[i].transaction = self.adminTransactionsList().taskList[0].name;
                                        break;
                                    } else if (data.ruleDTOs[i].associatedRuleCriterias[0].constraintValue1 === "") {
                                        data.ruleDTOs[i].transaction = "";
                                    } else if (self.adminTransactionsList().taskList[0].childTasks[j]) {
                                            if (self.adminTransactionsList().taskList[0].childTasks[j].childTasks) {
                                                for (var k = 0; k < self.adminTransactionsList().taskList[0].childTasks[j].childTasks.length; k++) {
                                                    if (data.ruleDTOs[i].associatedRuleCriterias[0].constraintValue1 === self.adminTransactionsList().taskList[0].childTasks[j].childTasks[k].id) {
                                                        data.ruleDTOs[i].transaction = self.adminTransactionsList().taskList[0].childTasks[j].childTasks[k].name;
                                                        break;
                                                    } else if (data.ruleDTOs[i].associatedRuleCriterias[0].constraintValue1 === self.adminTransactionsList().taskList[0].childTasks[j].id) {
                                                            data.ruleDTOs[i].transaction = self.adminTransactionsList().taskList[0].childTasks[j].name;
                                                            break;
                                                        }
                                                }
                                            } else if (data.ruleDTOs[i].associatedRuleCriterias[0].constraintValue1 === self.adminTransactionsList().taskList[0].childTasks[j].id) {
                                                    data.ruleDTOs[i].transaction = self.adminTransactionsList().taskList[0].childTasks[j].name;
                                                    break;
                                                }
                                        }
                                }
                            }
                        }
                        self.searchRulesList(data.ruleDTOs);
                        self.datasource = new oj.ArrayTableDataSource(self.searchRulesList(), { idAttribute: "ruleId" });
                        self.ruleDetails.ruleDetailsFetched(true);
                        self.searchResultsFetched(true);
                        $("#searchRuleListView").ojListView("refresh");
                    } else {
                        self.ruleDetails.ruleDetailsFetched(false);
                        rootParams.baseModel.showMessages(null, [self.resourceBundle.info.noRecordFound], "INFO");
                    }
                });
            });
        };
    };
});
