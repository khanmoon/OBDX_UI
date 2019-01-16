define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/rules",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojbutton"
], function (ko, $, ApprovalRulesModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("user-input", "common");
        self.resourceBundle = resourceBundle;
        if (rootParams.data) {
            self.rulesData = rootParams.data;
        } else {
            self.rulesData = rootParams.rootModel.params.data;
        }
        self.fromAmount = ko.observable(0);
        self.toAmount = ko.observable(0);
        self.account = ko.observable();
        self.isRulesdataLoaded = ko.observable(false);
        self.currency = ko.observable();
        self.isCurrencyLoaded = ko.observable(false);
        self.userInputModel = ko.observableArray([{
                partyId: self.rulesData.type === "ADMIN" ? "" : self.rulesData.party.value(),
                useCase: "DEFAULT",
                selectedUser: null,
                selectedUserGroup: self.rulesData.initiatorUserGroup.id ? self.rulesData.initiatorUserGroup.id : null,
                buttonSet: "USER",
                userType: self.rulesData.type,
                customLabel: true,
                labelDisplay: self.resourceBundle.rules.selectInitiator,
                useMode: "modify",
                additionalDetails: null,
                editable: ko.observable(false),
                disableSelection: ko.observable(true),
                disableButtonSet: ko.observable(true)
            }]);
        self.approvalUser = ko.observable();
        if (self.rulesData.type === "ADMIN") {
            self.approvalUser("AdminUser");
        } else {
            self.approvalUser("CorporateUser");
        }
        self.nodeId = ko.observable();
        self.transactionName = ko.observable();
        self.approvalRequired = ko.observable();
        self.workFlowLoaded = ko.observable(false);
        self.rulesCreateWorkFlowId = ko.observable();
        self.selectedWorkflowName = ko.observable();
        self.selectedTransaction = ko.observable();
        self.workflowDetails = ko.observable();
        self.workFlowDetailsLoaded = ko.observable(false);
        var i = 0;
        self.partyName = ko.observable();
        self.showUsers = ko.observable(false);
        self.fetchPartyDetails = function () {
            if (self.params.data.party.value) {
                self.partyName(self.transactionDetails().partyName.fullName);
            }
        };
        self.ruleCode = ko.observable(self.rulesData.ruleName());
        self.ruleDescription = ko.observable(self.rulesData.description());
        if (self.rulesData.type) {
            if (self.rulesData.type !== "ADMIN") {
                self.fetchPartyDetails();
                for (i = 0; i < self.rulesData.associatedRuleCriterias().length; i++) {
                    if (self.rulesData.associatedRuleCriterias()[i].ruleCriteriaDTO.ruleCriteriaName() === "AMOUNT") {
                        self.fromAmount(self.rulesData.associatedRuleCriterias()[i].dataValue1());
                        self.toAmount(self.rulesData.associatedRuleCriterias()[i].dataValue2());
                    }
                    if (self.rulesData.associatedRuleCriterias()[i].ruleCriteriaDTO.ruleCriteriaName() === "ACCOUNT") {
                        self.account(self.rulesData.associatedRuleCriterias()[i].constraintValue1());
                    }
                    if (self.rulesData.associatedRuleCriterias()[i].ruleCriteriaDTO.ruleCriteriaName() === "CURRENCY") {
                        self.currency(self.rulesData.associatedRuleCriterias()[i].constraintValue1());
                        self.isCurrencyLoaded(true);
                    }
                }
            }
        }
        if (self.rulesData.approvalRequired()) {
            self.approvalRequired("YES");
            self.rulesCreateWorkFlowId([self.rulesData.workflowDto.workFlowId]);
            self.selectedWorkflowName(self.rulesData.workflowDto.name());
            if (self.rulesCreateWorkFlowId) {
                ApprovalRulesModel.getWorkflowDetails(self.rulesData.workflowDto.workFlowId()).done(function (data) {
                    self.workflowDetails(data);
                    self.workFlowDetailsLoaded(true);
                });
            }
            self.workFlowLoaded(true);
        } else {
            self.approvalRequired("NO");
        }
        if (self.rulesData.initiatorUserGroup.unary()) {
            self.userInputModel()[0].buttonSet = "USER";
            self.userInputModel()[0].selectedUser = self.rulesData.initiatorUserGroup.users()[0].userId();
        } else {
            self.userInputModel()[0].buttonSet = "USERGROUP";
            self.userInputModel()[0].selectedUserGroup = self.rulesData.initiatorUserGroup.id;
        }
        for (i = 0; i < self.rulesData.associatedRuleCriterias().length; i++) {
            if (self.rulesData.associatedRuleCriterias()[i].ruleCriteriaDTO.ruleCriteriaName() === "TRANSACTION") {
                ApprovalRulesModel.getTransactionName(self.rulesData.associatedRuleCriterias()[i].constraintValue1()).done(function (data) {
                    if (data.task) {
                        self.transactionName(data.task.name);
                        self.selectedTransaction([data.task.id + "~" + data.task.name]);
                    }
                });
            }
        }
        self.isRulesdataLoaded(true);
    };
});