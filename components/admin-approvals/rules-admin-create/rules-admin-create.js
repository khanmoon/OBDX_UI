define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/rules-admin-approvals",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojbutton",
    "ojs/ojvalidationgroup"
], function (ko, $, ApprovalRulesModel, resourceBundle) {
    "use strict";
    var vm = function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resourceBundle = resourceBundle;
        rootParams.baseModel.registerElement("amount-input");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("party-validate", "common");
        rootParams.baseModel.registerComponent("review-rules-create", "approvals");
        rootParams.baseModel.registerComponent("user-input", "common");
        rootParams.baseModel.registerComponent("workflow-view", "approvals");
        rootParams.dashboard.headerName(self.resourceBundle.headers.rulesAdmin);
        if (self.mode)
            self.mode = ko.observable(self.mode);
        if (self.mode() === "APPROVALREVIEW") {
            ApprovalRulesModel.fetchPartyDetails(self.params.party.value).done(function (data) {
                if (data.party && data.party.personalDetails) {
                    self.partyName = data.party.personalDetails.fullName;
                }
            });
        } else if (self.partyDetails) {
                self.partyName = self.partyDetails.partyName();
            }
        self.deletePopUp = ko.observable(false);
        self.ruleDescription = ko.observable();
        self.ruleCode = ko.observable();
        self.selectedTransaction = ko.observable();
        self.selectedAccount = ko.observable();
        self.fromAmount = ko.observable(null);
        self.toAmount = ko.observable(null);
        self.showAmountRule = ko.observable(false);
        self.showUserAccounts = ko.observable(false);
        self.showTransactions = ko.observable(false);
        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        self.validationTracker = ko.observable();
        self.userGroupListLoaded = ko.observable(false);
        self.userGroupList = ko.observable();
        self.currencyList = ko.observable();
        self.currencyListLoaded = ko.observable(false);
        self.approvalRequired = ko.observable();
        self.workFlowLoaded = ko.observable(false);
        self.workFlowList = ko.observable();
        self.rulesCreateUserGroupId = ko.observable();
        self.rulesCreateWorkFlowId = ko.observable();
        self.selectedUserGroupName = ko.observable();
        self.selectedWorkflowName = ko.observable();
        self.rulesCreateSuccessful = ko.observable(false);
        self.transactionRulesData = ko.observable();
        self.amountRule = ko.observable();
        self.accountRule = ko.observable();
        self.transactionRule = ko.observable();
        self.operator = ko.observable(null);
        self.showDropDownAccounts = ko.observable(false);
        self.showDropDownTransactions = ko.observable(false);
        self.Transactions = ko.observableArray();
        self.bothAmountNull = ko.observable(false);
        self.transactionName = ko.observable();
        self.prevMode = ko.observable();
        self.version = null;
        self.workflowDetails = ko.observable();
        self.workFlowDetailsLoaded = ko.observable(false);
        rootParams.dashboard.backAllowed(false);
        self.selectedTransactionName = ko.observable();
        self.line1 = ko.observable();
        self.groupValid = ko.observable();
        self.statusMessage = ko.observable();
        self.supportedAccountTypes = [];
        var getNewKoModel = function () {
            var KoModel = ApprovalRulesModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rulesCreateModelInstance = ko.observable(getNewKoModel());
        self.userInputModel = ko.observableArray([{
                partyId: "",
                useCase: "DEFAULT",
                selectedUser: null,
                selectedUserGroup: null,
                buttonSet: "USER",
                userType: "ADMIN",
                customLabel: true,
                labelDisplay: self.resourceBundle.adminrules.rules.selectInitiator,
                useMode: null,
                additionalDetails: null,
                editable: ko.observable(true),
                disableSelection: ko.observable(false),
                disableButtonSet: ko.observable(false),
                mode: ko.observable("review")
            }]);
        self.nodeId = ko.observable("jain");
        rootParams.baseModel.registerElement("modal-window");
        self.showWorkflowDetails = function () {
            ApprovalRulesModel.getWorkflowDetails(self.rulesCreateWorkFlowId()).done(function (workflowData) {
                self.workflowDetails(workflowData);
                self.workFlowDetailsLoaded(true);
            });
        };
        self.rulesCreateWorkFlowIdSubscriptions = self.rulesCreateWorkFlowId.subscribe(function (updatedrulesCreateWorkFlowId) {
            if (updatedrulesCreateWorkFlowId) {
                self.showWorkflowDetails();
            }
        });
        self.ruleDetailsFetchedSubscription = self.rulesCreateModelInstance().approvals.ruleDetailsFetched.subscribe(function (newValue) {
            if (newValue) {
                self.fetchDetails();
                self.rulesCreateModelInstance().rulesCreatePayload.ruleName("");
                self.rulesCreateUserGroupId("");
                self.fetchAdminTransactionRules();
            }
        });
        self.changeApprovalRequired = function () {
            if (self.approvalRequired() === "NO") {
                self.workFlowLoaded(false);
                self.rulesCreateWorkFlowId("");
            } else if (self.approvalRequired() === "YES") {
                self.workFlowLoaded(true);
                self.rulesCreateWorkFlowId("");
            }
        };
        self.viewBack = function () {
            self.groupDetailsFetched = false;
            history.back();
        };
        self.disableUITxn = ko.computed(function () {
            if(!(self.mode() === "CREATE" || self.mode() === "EDIT")) {
                return true;
            }
            return false;
        });
        self.getRuleInitiatorMode = ko.computed(function () {
            var _mode = self.mode();
            if (_mode === "EDIT") {
                return "modify";
            } else if (_mode !== "CREATE") {
                return "view";
            }
        });
        self.fetchAdminTransactionRules = function () {
            ApprovalRulesModel.getAdminTransactionRules(self.transactionType()).done(function (adminTransactionRulesData) {
                self.transactionRulesData(adminTransactionRulesData);
                self.displayRulesData(adminTransactionRulesData);
            });
        };
        self.displayRulesData = function (rulesData) {
            self.showTransactions(false);
            for (var i = 0; i < rulesData.ruleCriteriaDTOs.length; i++) {
                if (rulesData.ruleCriteriaDTOs[i].ruleCriteriaName === "TRANSACTION") {
                    self.transactionRule(rulesData.ruleCriteriaDTOs[i]);
                    ApprovalRulesModel.getTransactions(self.transactionType()).done(function (taskData) {
                        function mapping(obj, parent) {
                            if (obj) {
                                parent.label = obj.name;
                                parent.value = obj.id + "~" + obj.name;
                                if (obj.childTasks && obj.childTasks.length > 0) {
                                    parent.children = [];
                                    for (var i = 0; i < obj.childTasks.length; i++) {
                                        parent.children.push({});
                                        mapping(obj.childTasks[i], parent.children[i]);
                                    }
                                }
                            }
                        }
                        var mapped = {};
                        mapping(taskData.taskList[0], mapped);
                        var objectMapped = [mapped];
                        self.Transactions(objectMapped);
                        self.showDropDownTransactions(true);
                        self.showTransactions(true);
                    });
                }
            }
        };
        self.fetchDetails = function () {
            ApprovalRulesModel.getWorkflow(self.rulesCreateModelInstance().approvals.partyId()).done(function (workflowData) {
                self.workFlowList(workflowData.workFlowDTOs);
            });
        };
        self.create = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.rulesCreateModelInstance(null);
            self.rulesCreateModelInstance = ko.observable(getNewKoModel());
            self.rulesCreateModelInstance().rulesCreatePayload.ruleName(self.ruleCode());
            self.rulesCreateModelInstance().rulesCreatePayload.description(self.ruleDescription());
            if (self.approvalRequired() === "YES") {
                for (var i = 0; i < self.workFlowList().length; i++) {
                    if (self.workFlowList()[i].workFlowId === self.rulesCreateWorkFlowId()) {
                        self.rulesCreateModelInstance().rulesCreatePayload.approvalRequired(true);
                        self.selectedWorkflowName(self.workFlowList()[i].name);
                        self.rulesCreateModelInstance().rulesCreatePayload.workflowDto.name(self.selectedWorkflowName());
                        self.rulesCreateModelInstance().rulesCreatePayload.workflowDto.workFlowId = self.workFlowList()[i].workFlowId;
                        break;
                    }
                }
            } else {
                self.rulesCreateModelInstance().rulesCreatePayload.approvalRequired(false);
                self.selectedWorkflowName("");
            }
            if (self.userInputModel()[0].buttonSet === "USER") {
                self.rulesCreateModelInstance().rulesCreatePayload.initiatorUserGroup.unary(true);
                self.rulesCreateModelInstance().rulesCreatePayload.initiatorUserGroup.name(self.userInputModel()[0].selectedUser);
                self.rulesCreateModelInstance().rulesCreatePayload.initiatorUserGroup.users()[0].userId = self.userInputModel()[0].selectedUser;
            } else if (self.userInputModel()[0].buttonSet === "USERGROUP") {
                self.rulesCreateModelInstance().rulesCreatePayload.initiatorUserGroup.unary(false);
                self.rulesCreateModelInstance().rulesCreatePayload.initiatorUserGroup.name(self.userInputModel()[0].selectedUserGroup);
                self.rulesCreateModelInstance().rulesCreatePayload.initiatorUserGroup.id(self.userInputModel()[0].selectedUserGroup);
            }
            if (self.showTransactions()) {
                self.rulesCreateModelInstance().approvals.selectedTransaction(self.selectedTransaction().split("~")[1]);
                self.operator("EQUALSTO");
                var ruleCriteriasForTransaction = {
                    constraintValue1: self.selectedTransaction().split("~")[0],
                    constraintValue2: null,
                    constraintOperator: self.operator(),
                    ruleCriteriaDTO: {
                        dataType: self.transactionRule().dataType,
                        ruleCriteriaId: self.transactionRule().ruleCriteriaId,
                        ruleCriteriaName: self.transactionRule().ruleCriteriaName,
                        taskType: self.transactionRule().taskType,
                        userType: self.transactionRule().userType,
                        weightage: self.transactionRule().weightage
                    }
                };
                self.rulesCreateModelInstance().rulesCreatePayload.associatedRuleCriterias.push(ko.mapping.fromJS(ruleCriteriasForTransaction));
            }
            if (self.prevMode() === "EDIT" || self.mode() === "EDIT") {
                self.rulesCreateModelInstance().rulesCreatePayload.version(self.params.version);
                self.rulesCreateModelInstance().rulesCreatePayload.ruleId(self.params.ruleId);
                self.modify();
            } else if (self.prevMode() === "CREATE") {
                if (self.mode() === "EDIT") {
                    self.rulesCreateModelInstance().rulesCreatePayload.version(self.params.version);
                    self.rulesCreateModelInstance().rulesCreatePayload.ruleId(self.params.ruleId);
                    self.modify();
                } else {
                    self.submit();
                }
            }
        };
        self.submit = function () {
            ApprovalRulesModel.createRules(ko.mapping.toJSON(self.rulesCreateModelInstance().rulesCreatePayload)).done(function (data, status, jqXhr) {
                rootParams.dashboard.backAllowed(false);
                self.transactionName(self.resourceBundle.adminrules.rules.createRule);
                self.mode("SUCCESS");
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                }, self);
            });
        };
        self.modify = function () {
            ApprovalRulesModel.updateRules(ko.mapping.toJSON(self.rulesCreateModelInstance().rulesCreatePayload), self.params.ruleId).done(function (data, status, jqXhr) {
                rootParams.dashboard.backAllowed(false);
                self.transactionName(self.resourceBundle.adminrules.rules.modifyRule);
                self.mode("SUCCESS");
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                }, self);
            });
        };
        self.hideDeleteBlock = function () {
            self.deletePopUp(false);
            $("#deleteDialog").hide();
        };
        self.showDelete = function () {
            self.deletePopUp(true);
            $("#deleteDialog").trigger("openModal");
        };
        self.cancel = function () {
            rootParams.dashboard.openDashBoard(self.resourceBundle.approvals.common.cancelMaintenanceMsg);
        };
        self.deleteRule = function () {
            ApprovalRulesModel.deleteRule(self.params.ruleId).done(function (data, status, jqXhr) {
                rootParams.dashboard.backAllowed(false);
                self.transactionName(self.resourceBundle.generic.common.delete);
                self.mode("SUCCESS");
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                }, self);
            });
        };
        self.editReview = function () {
            self.userInputModel()[0].disableSelection(false);
            self.userInputModel()[0].disableButtonSet(false);
            if (self.params.ruleId) {
                self.mode("EDIT");
            } else {
                self.mode("CREATE");
            }
            location.hash = self.mode();
        };
        self.editRule = function () {
            ApprovalRulesModel.fetchRule(self.params.ruleId).done(function (data) {
                self.version = data.ruleDTO.version;
                self.userInputModel()[0].disableSelection(false);
                self.userInputModel()[0].disableButtonSet(false);
                self.rulesCreateWorkFlowId(data.ruleDTO.workflowDto.workFlowId);
            });
            self.userInputModel()[0].mode("edit");
            self.mode("EDIT");
        };
        self.editBack = function () {
            self.userInputModel()[0].disableSelection(true);
            self.userInputModel()[0].disableButtonSet(true);
            self.mode("VIEW");
        };
        self.back = function () {
            history.back();
        };
        self.save = function () {
            var tracker = document.getElementById("tracker");
            if (tracker.valid === "valid") {
                self.prevMode(self.mode());
                self.userInputModel()[0].disableSelection(true);
                self.userInputModel()[0].disableButtonSet(true);
                self.selectedTransactionName(self.selectedTransaction().split("~")[1]);
                if (self.approvalRequired() === "YES") {
                    var i = 0;
                    for (i = 0; i < self.workFlowList().length; i++) {
                        if (self.workFlowList()[i].workFlowId === self.rulesCreateWorkFlowId()) {
                            self.rulesCreateModelInstance().rulesCreatePayload.approvalRequired(true);
                            self.selectedWorkflowName(self.workFlowList()[i].name);
                            self.rulesCreateModelInstance().rulesCreatePayload.workflowDto.name(self.selectedWorkflowName());
                            self.rulesCreateModelInstance().rulesCreatePayload.workflowDto.workFlowId = self.workFlowList()[i].workFlowId;
                            break;
                        }
                    }
                } else {
                    self.rulesCreateModelInstance().rulesCreatePayload.approvalRequired(false);
                    self.selectedWorkflowName("");
                }
                self.mode("REVIEW");
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };
        if (self.mode() === "VIEW" || self.mode() === "APPROVALREVIEW") {
            self.fetchDetails();
            self.userInputModel()[0].disableSelection(true);
            self.userInputModel()[0].disableButtonSet(true);
            self.transactionType = ko.observable("ADMINISTRATION");
            if (self.transactionType() === "ADMINISTRATION")
                self.fetchAdminTransactionRules();
            if (self.params.approvalRequired) {
                self.approvalRequired("YES");
                self.workFlowLoaded(true);
                self.rulesCreateWorkFlowId([self.params.workflowDto.workFlowId]);
                self.selectedWorkflowName(self.params.workflowDto.name);
                self.rulesCreateModelInstance().rulesCreatePayload.approvalRequired(true);
            } else {
                self.approvalRequired("NO");
                self.rulesCreateModelInstance().rulesCreatePayload.approvalRequired(false);
            }
            self.ruleCode(self.params.ruleName);
            self.ruleDescription(self.params.description);
            self.rulesCreateModelInstance().rulesCreatePayload.ruleName(self.ruleCode());
            self.rulesCreateModelInstance().rulesCreatePayload.description(self.ruleDescription());
            self.userInputModel()[0].useMode = "modify";
            self.rulesCreateUserGroupId([self.params.initiatorUserGroup.id]);
            if (self.params.initiatorUserGroup.unary) {
                self.userInputModel()[0].buttonSet = "USER";
                self.userInputModel()[0].selectedUser = self.params.initiatorUserGroup.name;
            } else {
                self.userInputModel()[0].buttonSet = "USERGROUP";
                self.userInputModel()[0].selectedUserGroup = self.params.initiatorUserGroup.id;
            }
            var i = 0;
            for (; i < self.params.associatedRuleCriterias.length; i++) {
                if (self.params.associatedRuleCriterias[i].ruleCriteriaDTO.ruleCriteriaName === "TRANSACTION") {
                    var temp = i;
                    ApprovalRulesModel.getTransactionName(self.params.associatedRuleCriterias[i].constraintValue1).done(function (data) {
                        if (data.task) {
                            self.selectedTransactionName(data.task.name);
                            self.selectedTransaction(data.task.id + "~" + data.task.name);
                            self.transactionRule(self.params.associatedRuleCriterias[temp].ruleCriteriaDTO);
                        }
                    });
                }
            }
        }else if (self.mode() === "CREATE") {
            self.transactionType = ko.observable("ADMINISTRATION");
            self.approvalRequired("NO");
            self.rulesCreateModelInstance().approvals.ruleDetailsFetched(true);
        }
};
vm.prototype.dispose = function () {
    this.rulesCreateWorkFlowIdSubscriptions.dispose();
    this.ruleDetailsFetchedSubscription.dispose();
    this.disableUITxn.dispose();
    this.getRuleInitiatorMode.dispose();
};
return vm;
});
