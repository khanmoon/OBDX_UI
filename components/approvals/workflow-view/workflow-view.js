define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "framework/js/constants/constants",
    "ojL10n!resources/nls/workflow",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojselectcombobox"
], function (oj, ko, $, WorkflowViewModel, Constants, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.datasource = new oj.ArrayTableDataSource([]);
        self.userID = ko.observable("");
        self.httpStatus = ko.observable();
        self.userListId = ko.observable(false);
        rootParams.dashboard.headerName(self.nls.workflow.workflowDetails);
        self.actionHeaderheading = ko.observable();
        self.mode = ko.observable(rootParams.rootModel.mode);
        rootParams.baseModel.registerElement("modal-window");
        self.transactionName = ko.observable();
        self.statusMessage = ko.observable();
        self.partyID = self.nls.common.partyid;
        self.partyName = self.nls.common.partyname;
        self.workflowCodeLabel = self.nls.workflow.workflowCode;
        self.workflowDescriptionLabel = self.nls.workflow.workflowDescription;
        self.groupDescriptionLabel = self.nls.workflow.workflowDescription;
        self.addLabel = self.nls.common.add;
        self.backLabel = self.nls.common.back;
        self.inputLabel = self.nls.common.input;
        self.cancelTransactionLabel = self.nls.common.cancelTransaction;
        self.yes = self.nls.common.yes;
        self.no = self.nls.common.no;
        self.saveLabel = self.nls.generic.common.save;
        self.edit = self.nls.generic.common.edit;
        self.confirmLabel = self.nls.common.confirm;
        self.cancel = self.nls.generic.common.cancel;
        self.cancelMaintenanceMsg = self.nls.common.cancelMaintenanceMsg;
        self.editLabel = self.nls.generic.common.edit;
        self.firstName = ko.observable();
        self.lastName = ko.observable();
        self.userName = ko.observable();
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.nls.common.review;
        self.reviewTransactionName.reviewHeader = self.nls.info.reviewMessage;
        self.viewFunction = function () {
            if (self.params.workFlowId) {
                WorkflowViewModel.readWorkflow(self.params.workFlowId).done(function (data) {
                    self.workflowDetails(data.workFlowDetails);
                    self.workflowCode(self.params.name);
                    self.rootModelInstance().workflowPayload.workFlowId = self.params.workFlowId;
                    self.version(self.params.version);
                    self.workflowDescription(self.params.description);
                    if (self.mode() !== "CREATE") {
                        self.userInputModel.removeAll();
                        for (var i = 0; i < self.workflowDetails().steps.length; i++) {
                            if (i > 0) {
                                var sequenceNo = self.sequenceNo();
                                self.rootModelInstance().workflowPayload.steps.push(ko.mapping.fromJS({
                                    "sequenceNo": sequenceNo,
                                    "userGroup": {
                                        "id": null,
                                        "name": null,
                                        "partyId": null,
                                        "unary": null,
                                        "users": [{
                                                "userId": null,
                                                "firstName": null,
                                                "lastName": null
                                            }]
                                    }
                                }));
                                sequenceNo++;
                                self.sequenceNo(sequenceNo);
                            }
                            if (self.workflowDetails().steps[i].userGroup.unary) {
                                self.userInputModel.push({
                                    partyId: self.partyDetails.party.value(),
                                    useCase: "DEFAULT",
                                    selectedUser: self.workflowDetails().steps[i].userGroup.users[0].userId,
                                    selectedUserGroup: null,
                                    buttonSet: "USER",
                                    userType: "CUSTOMER",
                                    customLabel: true,
                                    labelDisplay: ko.observable(rootParams.baseModel.format(self.nls.workflow.appLevel, { level: self.workflowDetails().steps[i].sequenceNo })),
                                    useMode: "modify",
                                    additionalDetails: null
                                });
                            } else {
                                self.userInputModel.push({
                                    partyId: self.partyDetails.party.value(),
                                    useCase: "DEFAULT",
                                    selectedUser: null,
                                    selectedUserGroup: self.workflowDetails().steps[i].userGroup.id,
                                    buttonSet: "USERGROUP",
                                    userType: "CUSTOMER",
                                    customLabel: true,
                                    labelDisplay: ko.observable(rootParams.baseModel.format(self.nls.workflow.appLevel, { level: self.workflowDetails().steps[i].sequenceNo })),
                                    useMode: "modify",
                                    additionalDetails: null
                                });
                            }
                        }
                        var nextSequenceNo = self.userInputModel().length + 1;
                        self.sequenceNo(nextSequenceNo);
                    }
                    self.workflowDetailsLoaded(true);
                });
            } else {
                self.workflowDetailsLoaded(true);
            }
        };
        var j = 0;
        function checkHash() {
            if (self.mode() === "EDIT") {
                rootParams.dashboard.headerName(self.nls.workflow.workflowDetails);
                self.mode("EDIT");
                if (self.prevMode() === "REVIEW") {
                    for (j = 0; j < self.userInputModel().length; j++) {
                        self.userInputModel()[j].useMode = "modify";
                    }
                }
                self.actionHeaderheading(self.nls.generic.common[self.mode().toLowerCase()]);
            } else if (self.mode() === "VIEW") {
                rootParams.dashboard.headerName(self.nls.workflow.workflowDetails);
                self.mode("VIEW");
                self.viewFunction();
                self.actionHeaderheading(self.nls.common[self.mode().toLowerCase()]);
            } else if (self.mode() === "CREATE") {
                rootParams.dashboard.headerName(self.nls.workflow.workflowDetails);
                self.mode("CREATE");
                self.viewFunction();
                if (self.prevMode() === "REVIEW") {
                    for (j = 0; j < self.userInputModel().length; j++) {
                        self.userInputModel()[j].useMode = "modify";
                    }
                }
                self.actionHeaderheading(self.nls.generic.common[self.mode().toLowerCase()]);
            } else if (self.mode() === "REVIEW") {
                rootParams.dashboard.headerName(self.nls.workflow.workflowDetails);
                self.mode("REVIEW");
                self.actionHeaderheading(self.nls.common[self.mode().toLowerCase()]);
            }
        }
        self.workflowCode = ko.observable();
        self.version = ko.observable();
        self.workflowDescription = ko.observable();
        rootParams.baseModel.registerElement("confirm-screen");
        self.workflowDetails = ko.observable();
        self.prevMode = ko.observable();
        self.userList = ko.observableArray();
        self.userListLoaded = ko.observable(false);
        self.selectedUser = ko.observable();
        self.workflowDetailsLoaded = ko.observable(false);
        self.validationTracker = ko.observable();
        self.showInitiators = ko.observable(true);
        rootParams.dashboard.backAllowed(false);
        self.userInputModel = ko.observableArray([]);
        rootParams.baseModel.registerComponent("user-input", "common");
        var getNewKoModel = function () {
            var KoModel = WorkflowViewModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.transactionStatus = ko.observable();

        self.editReview = function () {
            var previousValue = self.prevMode();
            self.prevMode(self.mode());
            self.mode(previousValue);
            checkHash();
        };
        self.back = function () {
            history.back();
        };
        self.confirm = function () {
            if (self.prevMode() === "EDIT") {
                self.transactionName(self.nls.workflow.modifyWorkflow);
                self.rootModelInstance().workflowPayload.name = self.workflowCode();
                self.rootModelInstance().workflowPayload.version = self.version();
                self.rootModelInstance().workflowPayload.description = self.workflowDescription();
                WorkflowViewModel.updateWorkflow(ko.mapping.toJSON(self.rootModelInstance().workflowPayload), self.rootModelInstance().workflowPayload.workFlowId).done(function (data, status, jqXhr) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.workflow.modifyWorkflow
                    }, self);
                });
            } else if (self.prevMode() === "CREATE") {
                self.transactionName(self.nls.workflow.createWorkflow);
                self.rootModelInstance().workflowPayload.name = self.workflowCode();
                self.rootModelInstance().workflowPayload.description = self.workflowDescription();
                WorkflowViewModel.createWorkflow(ko.mapping.toJSON(self.rootModelInstance().workflowPayload)).done(function (data, status, jqXhr) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.workflow.createWorkflow
                    }, self);
                });
            }
        };
        if (self.mode() === "CREATE") {
            self.userInputModel = ko.observableArray([{
                    partyId: self.partyDetails.party.value(),
                    useCase: "DEFAULT",
                    selectedUser: null,
                    selectedUserGroup: null,
                    buttonSet: "USER",
                    userType: "CUSTOMER",
                    customLabel: true,
                    labelDisplay: ko.observable(rootParams.baseModel.format(self.nls.workflow.appLevel, { level: "1" })),
                    useMode: null,
                    additionalDetails: null
                }]);
        }
        self.save = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (self.prevMode() === "REVIEW") {
                self.rootModelInstance().workflowPayload = ko.mapping.fromJS(self.rootModelInstance().workflowPayload);
            }
            self.prevMode(self.mode());
            self.mode("REVIEW");
            checkHash();
            self.actionHeaderheading(self.nls.common[self.mode().toLowerCase()]);
            self.rootModelInstance().workflowPayload.partyId(self.partyDetails.party.value());
            for (var i = 0; i < self.rootModelInstance().workflowPayload.steps().length; i++) {
                if (self.userInputModel()[i].buttonSet === "USER") {
                    self.rootModelInstance().workflowPayload.steps()[i].userGroup.unary(true);
                    self.rootModelInstance().workflowPayload.steps()[i].userGroup.users()[0].userId(self.userInputModel()[i].selectedUser);
                    self.rootModelInstance().workflowPayload.steps()[i].userGroup.users()[0].firstName(self.userInputModel()[i].additionalDetails.firstName);
                    self.rootModelInstance().workflowPayload.steps()[i].userGroup.users()[0].lastName(self.userInputModel()[i].additionalDetails.lastName);
                } else if (self.userInputModel()[i].buttonSet === "USERGROUP") {
                    self.rootModelInstance().workflowPayload.steps()[i].userGroup.unary(false);
                    self.rootModelInstance().workflowPayload.steps()[i].userGroup.id(self.userInputModel()[i].selectedUserGroup);
                    self.rootModelInstance().workflowPayload.steps()[i].userGroup.name(self.userInputModel()[i].additionalDetails.name);
                }
                var copy = ko.toJS(self.rootModelInstance().workflowPayload.steps()[i]);
                self.rootModelInstance().workflowPayload.steps()[i] = copy;
            }
            var copy1 = ko.mapping.toJS(self.rootModelInstance().workflowPayload);
            self.rootModelInstance().workflowPayload = copy1;
            self.workflowDetails(copy1);
        };
        self.editWorkflow = function () {
            self.mode("EDIT");
            checkHash();
            self.actionHeaderheading(self.nls.generic.common[self.mode().toLowerCase()]);
        };
        self.sequenceNo = ko.observable("2");
        self.addApprovalLevel = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            var sequenceNo = self.sequenceNo();
            self.userInputModel.push({
                partyId: self.partyDetails.party.value(),
                useCase: "DEFAULT",
                selectedUser: null,
                selectedUserGroup: null,
                buttonSet: "USER",
                userType: "CUSTOMER",
                customLabel: true,
                labelDisplay: ko.observable(rootParams.baseModel.format(self.nls.workflow.appLevel, { level: sequenceNo })),
                useMode: null,
                additionalDetails: null
            });
            self.rootModelInstance().workflowPayload.steps.push(ko.mapping.fromJS({
                "sequenceNo": sequenceNo,
                "userGroup": {
                    "id": null,
                    "name": null,
                    "partyId": null,
                    "unary": "User",
                    "users": [{
                            "userId": null,
                            "firstName": null,
                            "lastName": null
                        }]
                }
            }));
            sequenceNo++;
            self.sequenceNo(sequenceNo);
        };
        self.deleteApprovalFromWorkflow = function (index, data) {
            if ((data.selectedUser !== null || data.selectedUserGroup !== null) && !rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            for (var i = index; i < self.userInputModel().length; i++) {
                self.userInputModel()[i].labelDisplay = ko.observable(rootParams.baseModel.format(self.nls.workflow.appLevel, { level: i }));
            }
            self.userInputModel.remove(data);
            self.temp = ko.observableArray();
            self.temp(self.userInputModel.slice(0));
            self.userInputModel.removeAll();
            for (j = 0; j < self.temp().length; j++) {
                self.temp()[j].useMode = "modify";
                var newJob = ko.mapping.fromJS(ko.mapping.toJS(self.temp()[j]));
                self.userInputModel.push(ko.mapping.toJS(newJob));
            }
            var sequenceNo = self.sequenceNo();
            sequenceNo--;
            self.sequenceNo(sequenceNo);
            self.rootModelInstance().workflowPayload.steps.pop();
        };
        self.cancelConfirmation = function () {
            $("#confirmCancellationScreen").trigger("openModal");
        };
        self.closeDialogBox = function() {
          $("#confirmCancellationScreen").hide();
        };
        checkHash();
    };
});
