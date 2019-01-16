define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/beneficiary-maintenance",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojpagingtabledatasource",
    "ojs/ojtable",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojradioset",
    "ojs/ojcheckboxset"
], function (oj, ko, $, BeneMaintenanceModel, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        self.beneficiaryDetails = ko.observable();
        self.editFlag = ko.observable(false);
        if (self.params.additionalBankDetails) {
            self.additionalBankDetails = self.params.additionalBankDetails;
        } else {
            self.additionalBankDetails = ko.observable();
        }
        self.mode = ko.observable();
        self.transactionTypeArray = ko.observableArray();
        if (self.params.editFlag) {
            params.dashboard.headerName(self.resourceBundle.heading.editBeneMaintenance);
        } else {
            params.dashboard.headerName(self.resourceBundle.heading.createBeneMaintenance);
        }
        self.viewFlag = ko.observable(false);
        self.approverFlag = ko.observable(false);
        self.abcFlag = ko.observable(false);
        self.validationTracker = ko.observable();
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.resourceBundle.generic.common.review;
        self.reviewTransactionName.reviewHeader = self.resourceBundle.heading.editConfirmBeneficiary;
        self.reviewTransactionNameCreate=[];
        self.reviewTransactionNameCreate.header = self.resourceBundle.generic.common.review;
        self.reviewTransactionNameCreate.reviewHeader = self.resourceBundle.heading.createConfirmBeneficiary;
        self.dropdownLabels = { country: ko.observable() };
        params.baseModel.registerElement("confirm-screen");
        var countryList = [];
        self.back = function () {
            history.back();
        };
        function getCountryNameFromCode(countryCode) {
            var countryName = countryList.filter(function (data) {
                return data.code === countryCode;
            });
            return countryName.length > 0 ? countryName[0].description : null;
        }
        if (self.params.mode === "approval") {
            self.beneficiaryDetails(ko.mapping.toJS(self.params.data));
            self.approverFlag(true);
            if (self.params.data.name === undefined) {
                BeneMaintenanceModel.getBeneficiaryDetails(self.params.data.id()).done(function (data) {
                    self.beneficiaryDetails(data.beneficiaryDetails);
                    if (self.beneficiaryDetails().swiftId) {
                        BeneMaintenanceModel.getBankDetailsBIC(self.beneficiaryDetails().swiftId).done(function (data) {
                            self.additionalBankDetails(data);
                        });
                    }
                    if (self.beneficiaryDetails().transactionTypeMap) {
                        for (var i = 0; i < self.beneficiaryDetails().transactionTypeMap.length; i++) {
                            self.transactionTypeArray().push(self.resourceBundle.labels[self.beneficiaryDetails().transactionTypeMap[i].transactionType]);
                        }
                    }
                    BeneMaintenanceModel.fetchBeniCountry().done(function (data) {
                        countryList = data.enumRepresentations[0].data;
                        self.dropdownLabels.country(getCountryNameFromCode(self.beneficiaryDetails().address.country));
                    });
                    self.abcFlag(true);
                });
            } else {
                if (self.beneficiaryDetails().swiftId) {
                    BeneMaintenanceModel.getBankDetailsBIC(self.beneficiaryDetails().swiftId).done(function (data) {
                        self.additionalBankDetails(data);
                    });
                }
                if (self.beneficiaryDetails().transactionTypeMap) {
                    for (var j = 0; j < self.beneficiaryDetails().transactionTypeMap.length; j++) {
                        self.transactionTypeArray().push(self.resourceBundle.labels[self.beneficiaryDetails().transactionTypeMap[j].transactionType]);
                    }
                }
                BeneMaintenanceModel.fetchBeniCountry().done(function (data) {
                    countryList = data.enumRepresentations[0].data;
                    self.dropdownLabels.country(getCountryNameFromCode(self.beneficiaryDetails().address.country));
                });
                self.abcFlag(true);
            }
        } else {
            self.beneficiaryDetails(self.params.beneficiaryDetails);
            self.editFlag(self.params.editFlag);
            self.abcFlag(true);
            if (self.beneficiaryDetails().transactionTypeMap) {
                for (var k = 0; k < self.beneficiaryDetails().transactionTypeMap.length; k++) {
                    self.transactionTypeArray().push(self.resourceBundle.labels[self.beneficiaryDetails().transactionTypeMap[k].transactionType]);
                }
            }
            if (self.params.mode === "REVIEW") {
                self.viewFlag(false);
                self.confirm = function () {
                    BeneMaintenanceModel.createBeneMaintenance(ko.mapping.toJSON(self.beneficiaryDetails())).done(function (data, status, jqXhr) {
                        self.httpStatus = jqXhr.status;
                        var createSuccessMessage, createStatusMessages;
                        var confirmScreenDetailsArray = [
                                [{
                                    label: self.resourceBundle.labels.beneficiaryName,
                                    value: self.beneficiaryDetails().name
                                },
                                {
                                    label: self.resourceBundle.labels.accessType,
                                    value: self.beneficiaryDetails().visibility
                                }]
                        ];
                        if(self.beneficiaryDetails().swiftId !== null && self.beneficiaryDetails().swiftId !== ""){
                          if(self.transactionTypeArray().length > 0){
                            confirmScreenDetailsArray.push([{
                                    label: self.resourceBundle.labels.swiftCode,
                                    value: self.beneficiaryDetails().swiftId
                                },
                                {
                                    label: self.resourceBundle.labels.applicability,
                                    value: self.transactionTypeArray()
                                }
                            ]);
                          }else{
                          confirmScreenDetailsArray.push([{
                                    label: self.resourceBundle.labels.swiftCode,
                                    value: self.beneficiaryDetails().swiftId
                                }
                            ]);
                          }
                        }
                        else if(self.transactionTypeArray().length > 0){
                         confirmScreenDetailsArray.push([{
                                    label: self.resourceBundle.labels.applicability,
                                    value: self.transactionTypeArray()
                           }]);
                        }
                        if (self.httpStatus && self.httpStatus !== 202) {
                            createSuccessMessage = self.resourceBundle.confirmScreen.createSuccessMessage;
                            createStatusMessages = self.resourceBundle.confirmScreen.completed;
                        } else if (self.httpStatus && self.httpStatus === 202) {
                            createSuccessMessage = self.resourceBundle.confirmScreen.corpMaker;
                            createStatusMessages = self.resourceBundle.confirmScreen.pendingApproval;
                        }
                        params.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXhr,
                            transactionName: self.resourceBundle.heading.createBeneMaintenance,
                            confirmScreenExtensions: {
                                successMessage: createSuccessMessage,
                                statusMessages: createStatusMessages,
                                isSet: true,
                                taskCode: "TF_N_CBM",
                                confirmScreenDetails: confirmScreenDetailsArray,
                                template: "confirm-screen/trade-finance"
                            }
                        }, self);
                    });
                };
                self.update = function () {
                    BeneMaintenanceModel.updateBeneMaintenance(self.beneficiaryDetails().id, ko.mapping.toJSON(self.beneficiaryDetails())).done(function (data, status, jqXhr) {
                        self.httpStatus = jqXhr.status;
                        var updateSuccessMessage, updateStatusMessages;
                        var confirmScreenDetailsArray = [
                                [{
                                    label: self.resourceBundle.labels.beneficiaryName,
                                    value: self.beneficiaryDetails().name
                                },
                                {
                                    label: self.resourceBundle.labels.accessType,
                                    value: self.beneficiaryDetails().visibility
                                }
                              ]
                        ];
                        if(self.beneficiaryDetails().swiftId !== null && self.beneficiaryDetails().swiftId !== ""){
                          if(self.transactionTypeArray().length > 0){
                            confirmScreenDetailsArray.push([{
                              label: self.resourceBundle.labels.swiftCode,
                              value: self.beneficiaryDetails().swiftId
                            },
                            {
                                  label: self.resourceBundle.labels.applicability,
                                  value: self.transactionTypeArray()
                              }
                            ]);
                          }else{
                          confirmScreenDetailsArray.push([{
                                label: self.resourceBundle.labels.swiftCode,
                                value: self.beneficiaryDetails().swiftId
                                }
                              ]);
                            }
                        }
                        else if(self.transactionTypeArray().length > 0){
                         confirmScreenDetailsArray.push([{
                              label: self.resourceBundle.labels.applicability,
                              value: self.transactionTypeArray()
                          }]);
                        }
                        if (self.httpStatus && self.httpStatus === 200) {
                            updateSuccessMessage = self.resourceBundle.confirmScreen.updateSuccessMessage;
                            updateStatusMessages = self.resourceBundle.confirmScreen.completed;
                        }
                        params.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXhr,
                            transactionName: self.resourceBundle.heading.editBeneMaintenance,
                            confirmScreenExtensions: {
                                successMessage: updateSuccessMessage,
                                statusMessages: updateStatusMessages,
                                isSet: true,
                                taskCode: "TF_N_UBM",
                                confirmScreenDetails: confirmScreenDetailsArray,
                                template: "confirm-screen/trade-finance"
                            }
                        }, self);
                    });
                };
            }
            if (self.params.mode === "VIEW") {
                self.viewFlag(true);
                params.dashboard.headerName(self.resourceBundle.heading.viewBeneMaintenance);
            }
            self.deleteBeneficiary = function () {
                BeneMaintenanceModel.deleteBeneficiary(self.beneficiaryDetails().id).done(function (data, status, jqXhr) {
                    self.httpStatus = jqXhr.status;
                    var deleteSuccessMessage, deleteStatusMessages;
                    if (self.httpStatus && self.httpStatus === 200) {
                        deleteSuccessMessage = self.resourceBundle.confirmScreen.deleteSuccessMessage;
                        deleteStatusMessages = self.resourceBundle.confirmScreen.completed;
                    }
                    params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.resourceBundle.heading.transactionDeleteName,
                        confirmScreenExtensions: {
                            successMessage: deleteSuccessMessage,
                            statusMessages: deleteStatusMessages,
                            isSet: true,
                            taskCode: "TF_N_DBM",
                            template: "confirm-screen/trade-finance"
                        }
                    }, self);
                }).fail(function () {
                    $("#deleteBeneficiary").hide();
                });
            };
            self.editBeneficiary = function () {
                var parameters = {
                    mode: "EDIT",
                    editFlag: self.editFlag(),
                    beneficiaryDetails: ko.mapping.toJS(self.beneficiaryDetails()),
                    additionalBankDetails: self.additionalBankDetails
                };
                params.dashboard.loadComponent("create-beneficiary-maintenance", parameters, self);
            };
            self.confirmDeleteBene = function () {
                $("#deleteBeneficiary").trigger("openModal");
            };
            self.hideDeleteBeneficiary = function(){
                $("#deleteBeneficiary").hide();
            };
            BeneMaintenanceModel.fetchBeniCountry().done(function (data) {
                countryList = data.enumRepresentations[0].data;
                self.dropdownLabels.country(getCountryNameFromCode(self.beneficiaryDetails().address.country));
            });
        }
    };
});
