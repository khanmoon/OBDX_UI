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
], function (oj, ko, $, viewAuthenticationMaintenanceModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = ResourceBundle;
        rootParams.dashboard.headerName(self.nls.authentication.headers.authentication);
        self.userSegmentsLoaded = ko.observable(false);
        rootParams.baseModel.registerComponent("create-authentication-maintenance", "authentication");
        self.back = function () {
            history.back();
        };
        var dataFetched = null;
        self.userSegmentsList = ko.observableArray();
        self.selectedSegmentId = ko.observable(self.params.selectedSegmentId);
        self.selectedSegmentName = ko.observable(self.nls.authentication.labels[self.selectedSegmentId()]);
        self.showApprovalsTable = ko.observable(false);
        self.showTransactionsTable = ko.observable(false);
        self.showCreateScreen = ko.observable(false);
        self.taskIdMap = {};
        self.actionHeaderheading = ko.observable(self.nls.authentication.headers.VIEW);
        self.showMaintenanceData = self.showMaintenanceData || ko.observable(false);
        self.editFlag = ko.observable("none");
        self.rowTemplateValue = ko.observable("editRowTemplate");
        self.datasource = self.datasource || ko.observable();
        var maintenanceData = null;
        var i = 0;
        self.openCreateMode = function () {
            rootParams.dashboard.loadComponent("create-authentication-maintenance", {
                selectedSegmentId: self.selectedSegmentId(),
                mode: "CREATE",
                dataFetched: null
            }, self);
        };
        self.showEditScreen = function () {
            rootParams.dashboard.loadComponent("create-authentication-maintenance", {
                selectedSegmentId: self.selectedSegmentId(),
                mode: "EDIT",
                dataFetched: maintenanceData.userSegmentTFAMaintenanceDTO[0]
            }, self);
        };
        var createDataSource = function (data) {
            self.showMaintenanceData(false);
            dataFetched = $.map(data.userSegmentTFAMaintenanceDTO[0].mappings, function (dataPerTransaction) {
                dataPerTransaction.transactionName = dataPerTransaction.dictionaryArray[0].nameValuePairDTOArray[0].value;
                if (!(dataPerTransaction.authenticationInfoDTOList && dataPerTransaction.authenticationInfoDTOList.length > 0)) {
                    dataPerTransaction.authenticationInfoDTOList = [
                        {
                            authType: { authTypeKey: "None" },
                            levelNumber: 1,
                            paramVal1: 0
                        },
                        {
                            authType: { authTypeKey: "None" },
                            levelNumber: 2,
                            paramVal1: 0
                        }
                    ];
                } else if (dataPerTransaction.authenticationInfoDTOList && dataPerTransaction.authenticationInfoDTOList.length === 1) {
                    dataPerTransaction.authenticationInfoDTOList.push({
                        authType: { authTypeKey: "None" },
                        levelNumber: 2,
                        paramVal1: 0
                    });
                }
                return dataPerTransaction;
            });
            var mappingsData = data;
            var taskType = null;
            if (self.selectedSegmentId() === "administrator")
                taskType = ["ADMINISTRATION", "COMMON"];
            viewAuthenticationMaintenanceModel.fetchTransactionsForMaintenance(taskType).done(function (data) {
                if (self.selectedSegmentId() !== "administrator")
                    for (i = data.taskList.length - 1; i >= 0; i--) {
                        if (data.taskList[i].type === "ADMINISTRATION")
                            data.taskList.splice(i, 1);
                    }
                for (i = 0; i < data.taskList.length; i++) {
                    if (!self.taskIdMap[data.taskList[i].id])
                        dataFetched.push({
                            task: data.taskList[i].id,
                            transactionName: data.taskList[i].name,
                            userSegmentId: self.params.selectedSegmentId,
                            authenticationInfoDTOList: [
                                {
                                    levelNumber: 1,
                                    authType: { authTypeKey: "None" },
                                    paramVal1: 0
                                },
                                {
                                    levelNumber: 2,
                                    authType: { authTypeKey: "None" },
                                    paramVal1: 0
                                }
                            ]
                        });
                }
                mappingsData.userSegmentTFAMaintenanceDTO[0].mappings = dataFetched;
                maintenanceData = mappingsData;
                self.datasource = new oj.ArrayTableDataSource(maintenanceData.userSegmentTFAMaintenanceDTO[0].mappings, { idAttribute: "task" });
                self.showMaintenanceData(true);
            });
        };
        viewAuthenticationMaintenanceModel.fetchSegementAuthenticationMaintenance(self.selectedSegmentId()).done(function (data) {
            if (data && data.userSegmentTFAMaintenanceDTO && data.userSegmentTFAMaintenanceDTO[0] && data.userSegmentTFAMaintenanceDTO[0].mappings && data.userSegmentTFAMaintenanceDTO[0].mappings.length > 0) {
                for (i = 0; i < data.userSegmentTFAMaintenanceDTO[0].mappings.length; i++) {
                    self.taskIdMap[data.userSegmentTFAMaintenanceDTO[0].mappings[i].task] = data.userSegmentTFAMaintenanceDTO[0].mappings[i];
                }
                createDataSource(data);
            } else {
                self.showCreateScreen(true);
                self.showMaintenanceData(true);
            }
        });
    };
});