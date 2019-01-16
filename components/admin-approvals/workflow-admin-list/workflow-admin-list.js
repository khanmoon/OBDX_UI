define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/workflow-admin-approvals",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, WorkflowSearchModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resourceBundle = resourceBundle;
        self.searchWorkflowList = ko.observableArray();
        rootParams.dashboard.headerName(self.resourceBundle.workflow.adminWorkflowDetails);
        self.userType = ko.observable("");
        self.dataLoaded = ko.observable(false);
        self.datasource = {};
        self.mode = "";
        self.validationTracker = ko.observable();
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerComponent("workflow-admin-view", "admin-approvals");
        var getNewKoModel = function () {
            var KoModel = WorkflowSearchModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.createNew = function () {
            self.mode = "CREATE";
            var data = {};
            data.partyDetails = self.rootModelInstance().approvals;
            rootParams.dashboard.loadComponent("workflow-admin-view", data, self);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.workflowDetails = rootParams.rootModel.workflowDetails;

        self.fetchWorkflowDetailsCode = function () {
            if (!self.workflowDetails.workflowName() && !self.workflowDetails.workflowDescription()) {
                rootParams.baseModel.showMessages(null, [self.resourceBundle.info.noDescription], "ERROR");
                return;
            }
            WorkflowSearchModel.searchWorkflow(self.workflowDetails.workflowName(), self.workflowDetails.workflowDescription()).done(function (data) {
                var workflowCodeData = $.map(data.workFlowDTOs, function (workflowData) {
                    workflowData.approvalCount = workflowData.steps.length;
                    workflowData.workflowDetails = self.workflowDetails;
                    workflowData.mode = "";
                    return workflowData;
                });
                if (workflowCodeData.length > 0) {
                    self.datasource = new oj.ArrayTableDataSource(workflowCodeData, { idAttribute: "workFlowId" });
                    self.dataLoaded(true);
                } else {
                    self.dataLoaded(false);
                    rootParams.baseModel.showMessages(null, [self.resourceBundle.info.noRecordFound], "INFO");
                }
            });
        };
        self.onWorkflowSelected = function (data) {
            data.mode = "VIEW";
            self.mode = "VIEW";
            data.partyDetails = self.rootModelInstance().approvals;
            rootParams.dashboard.loadComponent("workflow-admin-view", data, self);
        };
        self.goToMap = function (data) {
            data.mode = "VIEW";
            self.mode = "VIEW";
            data.partyDetails = self.rootModelInstance().approvals;
            rootParams.dashboard.loadComponent("workflow-admin-view", data, self);
        };
        self.back = function () {
            history.back();
        };
        self.clear = function () {
            self.workflowDetails.workflowName(null);
            self.workflowDetails.workflowDescription(null);
            self.workflowDetails.workflowDetailsFetched(false);
            self.dataLoaded(false);
        };
        self.cancel = function () {
            rootParams.dashboard.openDashBoard();
        };
    };
});