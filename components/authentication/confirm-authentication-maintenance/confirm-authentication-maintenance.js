define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/authentication",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable"
], function(oj, ko, $, confirmAuthenticationMaintenanceModel, ResourceBundle) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = ResourceBundle;
        rootParams.dashboard.headerName(self.nls.authentication.headers.authentication);
        self.userSegmentsLoaded = ko.observable(false);
        rootParams.baseModel.registerComponent("create-authentication-maintenance", "authentication");
        rootParams.baseModel.registerElement("confirm-screen");
        self.back = function() {
            history.back();
        };
        var dataFetched = null;
        self.userSegmentsList = ko.observableArray();
        self.selectedSegmentId = ko.observable(self.params.selectedSegmentId);
        self.selectedSegmentName = ko.observable(self.nls.authentication.labels[self.selectedSegmentId()]);
        self.showApprovalsTable = ko.observable(false);
        self.showTransactionsTable = ko.observable(false);
        self.showCreateScreen = ko.observable(false);
        self.actionHeaderheading = ko.observable(self.nls.authentication.headers.REVIEW);
        self.openCreateMode = function() {
            rootParams.dashboard.loadComponent("create-authentication-maintenance", {
                selectedSegmentId: self.selectedSegmentId(),
                mode: "CREATE",
                dataFetched: null
            }, self);
        };
        self.showEditScreen = function() {
            rootParams.dashboard.loadComponent("create-authentication-maintenance", {
                selectedSegmentId: self.selectedSegmentId(),
                mode: "EDIT",
                dataFetched: dataFetched
            }, self);
        };
        self.showMaintenanceData = ko.observable(false);
        self.editFlag = ko.observable("none");
        self.rowTemplateValue = ko.observable("editRowTemplate");
        self.datasource = ko.observable();
        var createDataSource = function(data) {
            dataFetched = $.map(data.mappings, function(dataPerTransaction) {
                if (dataPerTransaction.dictionaryArray)
                    dataPerTransaction.transactionName = dataPerTransaction.dictionaryArray[0].nameValuePairDTOArray[0].value;
                if (!(dataPerTransaction.authenticationInfoDTOList && dataPerTransaction.authenticationInfoDTOList.length > 0)) {
                    dataPerTransaction.authenticationInfoDTOList = [{
                            authType: { authTypeKey: "None" },
                            levelNumber: 1
                        },
                        {
                            authType: { authTypeKey: "None" },
                            levelNumber: 2
                        }
                    ];
                } else if (dataPerTransaction.authenticationInfoDTOList && dataPerTransaction.authenticationInfoDTOList.length === 1) {
                    dataPerTransaction.authenticationInfoDTOList.push({
                        authType: { authTypeKey: "None" },
                        levelNumber: 2
                    });
                }
                return dataPerTransaction;
            });
            data.mappings = dataFetched;
            self.datasource = new oj.ArrayTableDataSource(data.mappings, { idAttribute: "task" });
            self.showMaintenanceData(true);
        };
        if (self.transactionDetails) {
            self.challenges = ko.observable(self.transactionDetails().transactionSnapshot);
            self.selectedSegmentName(self.nls.authentication.labels[self.transactionDetails().transactionSnapshot.userSegmentId]);
        } else {
            self.challenges = ko.observable(self.params.challenges);
            self.showButtons = ko.observable(true);
        }
        createDataSource(self.challenges());
        self.save = function() {
            self.challenges().userSegmentId = self.selectedSegmentId();
            $(self.challenges().mappings).each(function(k, v) {
                if (!v.version) {
                    v.version = 0;
                }
                for (var i = v.authenticationInfoDTOList.length - 1; i >= 0; i--) {

                    if (v.authenticationInfoDTOList[i].authType.authTypeKey !== "SEC_QUE")
                        delete v.authenticationInfoDTOList[i].paramVal1;
                    if (v.authenticationInfoDTOList[i].authType.authTypeKey === "None")
                        v.authenticationInfoDTOList.splice(i, 1);
                }
            });
            for (var i = self.challenges().mappings.length - 1; i >= 0; i--) {
                if (self.challenges().mappings[i].authenticationInfoDTOList.length === 0) {
                    self.challenges().mappings.splice(i, 1);
                }
            }
            if (self.params.mode === "CREATE")
                confirmAuthenticationMaintenanceModel.createAuthenticationMaintenance(self.params.selectedSegmentId, ko.mapping.toJSON(self.challenges())).done(function(data, status, jqXhr) {
                    rootParams.dashboard.loadComponent("confirm-screen", { jqXHR: jqXhr }, self);
                });
            if (self.params.mode === "EDIT")
                confirmAuthenticationMaintenanceModel.updateAuthenticationMaintenance(self.params.selectedSegmentId, ko.mapping.toJSON(self.challenges())).done(function(data, status, jqXhr) {
                    rootParams.dashboard.loadComponent("confirm-screen", { jqXHR: jqXhr }, self);
                });
        };
    };
});