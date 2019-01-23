define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/authentication",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojpagingcontrol",
    "ojs/ojknockout",
    "ojs/ojnavigationlist",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable"
], function (oj, ko, $, createAuthenticationMaintenanceModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = ResourceBundle;
        rootParams.dashboard.headerName(self.nls.authentication.headers.authentication);
        self.mode = ko.observable(self.params.mode);
        self.showDropDown = ko.observable(false);
        self.challengeList = ko.observableArray();
        rootParams.baseModel.registerComponent("confirm-authentication-maintenance", "authentication");
        self.challengeSelected = ko.observable();
        self.userSegmentsList = ko.observableArray();
        self.selectedSegmentName = ko.observable(self.nls.authentication.labels[self.params.selectedSegmentId]);
        self.showApprovalsTable = ko.observable(false);
        self.showTransactionsTable = ko.observable(false);
        self.showMaintenanceData = ko.observable(false);
        self.actionHeaderheading = ko.observable(self.nls.authentication.headers[self.mode()]);
        self.editFlag = ko.observable("none");
        self.rowTemplateValue = ko.observable("editRowTemplate");
        self.datasource = null;
        self.challengeSelectedObservableArray = ko.observableArray();
        var i = 0;
        createAuthenticationMaintenanceModel.fetchChallenges(self.params.selectedSegmentId).done(function (data) {
            self.challengeList(data.authenticationTypeDTOs);
            var addingNoneAsChallenge = {
                authTypeKey: "None",
                name: "None"
            };
            self.challengeList.splice(0, 0, addingNoneAsChallenge);
            self.showDropDown(true);
        });
        self.itemNumber = function (index) {
            return index + 1;
        };
        self.optionChangedHandler = function (index) {
                document.getElementById("table").refreshRow(index);
        };
        var createDataSource = function (data) {
            self.showMaintenanceData(false);
            var addingLevels = $.map(data.mappings, function (dataPerTransaction) {
                if (dataPerTransaction.dictionaryArray)
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
                } else {
                    $.map(dataPerTransaction.authenticationInfoDTOList, function (levelPerTransaction) {
                        levelPerTransaction.paramVal1 = levelPerTransaction.paramVal1 || 0;

                        return levelPerTransaction;
                    });
                }
                return dataPerTransaction;
            });
            data.mappings = addingLevels;
            self.challengeSelectedObservableArray(data);
            self.datasource = new oj.ArrayTableDataSource(self.challengeSelectedObservableArray().mappings, { idAttribute: "task" });
            self.showMaintenanceData(true);
        };
        if (self.mode() === "CREATE") {
            var taskType = null;
            if (self.params.selectedSegmentId === "administrator") {
                taskType = ["ADMINISTRATION","COMMON"];
            }
            createAuthenticationMaintenanceModel.fetchTransactionsForMaintenance(taskType).done(function (data) {
                if (self.selectedSegmentId() !== "administrator")
                    for (i = data.taskList.length - 1; i >= 0; i--) {
                        if (data.taskList[i].type === "ADMINISTRATION")
                            data.taskList.splice(i, 1);
                    }
                var jsonForCreation = { mappings: [] };
                for (i = 0; i < data.taskList.length; i++) {
                    jsonForCreation.mappings.push({
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
                createDataSource(jsonForCreation);
            });
        } else if (self.mode() === "EDIT") {
            createDataSource(self.params.dataFetched);
        }
        self.applyToAll = function () {
            for (i = 1; i < self.challengeSelectedObservableArray().mappings.length; i++) {
                self.challengeSelectedObservableArray().mappings[i].authenticationInfoDTOList[0].authType.authTypeKey = self.challengeSelectedObservableArray().mappings[0].authenticationInfoDTOList[0].authType.authTypeKey;
                self.challengeSelectedObservableArray().mappings[i].authenticationInfoDTOList[0].paramVal1 = self.challengeSelectedObservableArray().mappings[0].authenticationInfoDTOList[0].paramVal1;
                self.challengeSelectedObservableArray().mappings[i].authenticationInfoDTOList[1].authType.authTypeKey = self.challengeSelectedObservableArray().mappings[0].authenticationInfoDTOList[1].authType.authTypeKey;
                self.challengeSelectedObservableArray().mappings[i].authenticationInfoDTOList[1].paramVal1 = self.challengeSelectedObservableArray().mappings[0].authenticationInfoDTOList[1].paramVal1;
            }
            createDataSource(self.challengeSelectedObservableArray());
            document.getElementById("table").refresh();
        };
        self.save = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            for (i = 0; i < self.challengeSelectedObservableArray().mappings.length; i++) {
                if (self.challengeSelectedObservableArray().mappings[i].authenticationInfoDTOList[1].authType.authTypeKey !== "None" && self.challengeSelectedObservableArray().mappings[i].authenticationInfoDTOList[0].authType.authTypeKey === "None") {
                    rootParams.baseModel.showMessages(null, [self.nls.authentication.labels.level1Null], "ERROR");
                    return;
                }
            }
            rootParams.dashboard.loadComponent("confirm-authentication-maintenance", {
                challenges: self.challengeSelectedObservableArray(),
                mode: self.mode(),
                selectedSegmentId: self.params.selectedSegmentId
            }, self);
        };
    };
});
