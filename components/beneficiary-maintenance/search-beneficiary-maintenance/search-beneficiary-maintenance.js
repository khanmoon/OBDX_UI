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
    "ojs/ojknockout-validation"
], function (oj, ko, $, BeneMaintenanceModel, locale) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;
        params.dashboard.headerName(self.resourceBundle.heading.beneMaintenance);
        self.mode = ko.observable();
        self.dataSourceCreated = ko.observable(false);
        self.dataSource = ko.observableArray();
        self.additionalBankDetails = ko.observable(null);
        self.transactionTypeArray = ko.observableArray();
        self.swiftCode = ko.observable();
        params.baseModel.registerComponent("create-beneficiary-maintenance", "beneficiary-maintenance");
        params.baseModel.registerElement("search-box");
        params.baseModel.registerComponent("review-beneficiary-maintenance", "beneficiary-maintenance");
        self.create = function () {
            self.mode("CREATE");
            params.dashboard.loadComponent("create-beneficiary-maintenance", {}, self);
        };
        BeneMaintenanceModel.getBeneficiaryList().done(function (data) {
            var templateList = [];
            for (var i = 0; i < data.beneficiaryDTOs.length; i++) {
                var transactionTypeArray = [];
                for (var j = 0; j < data.beneficiaryDTOs[i].transactionTypeMap.length; j++) {
                    transactionTypeArray.push(self.resourceBundle.labels[data.beneficiaryDTOs[i].transactionTypeMap[j].transactionType]);
                }
                if (data.beneficiaryDTOs[i].swiftId === undefined) {
                    self.swiftCode("-");
                } else {
                    self.swiftCode(data.beneficiaryDTOs[i].swiftId.toUpperCase());
                }
                templateList.push({
                    name: data.beneficiaryDTOs[i].name,
                    address: data.beneficiaryDTOs[i].address,
                    swiftId: self.swiftCode(),
                    nickName: data.beneficiaryDTOs[i].nickName,
                    visibility: self.resourceBundle.labels[data.beneficiaryDTOs[i].visibility],
                    transactionTypeMap: transactionTypeArray,
                    id: data.beneficiaryDTOs[i].id
                });
            }
            self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(templateList, { idAttribute: ["name"] })));
            self.dataSourceCreated(true);
        });
        self.onBeneficiarySelected = function (data) {
            BeneMaintenanceModel.getBeneficiaryDetails(data.id).done(function (response) {
                if (response.beneficiaryDetails.swiftId) {
                    BeneMaintenanceModel.getBankDetailsBIC(response.beneficiaryDetails.swiftId).done(function (data) {
                        self.additionalBankDetails(data);
                        var parameters = {
                            mode: "VIEW",
                            editFlag: "true",
                            beneficiaryDetails: response.beneficiaryDetails,
                            additionalBankDetails: self.additionalBankDetails
                        };
                        params.dashboard.loadComponent("review-beneficiary-maintenance", parameters, self);
                    });
                } else {
                    var parameters = {
                        mode: "VIEW",
                        editFlag: "true",
                        beneficiaryDetails: response.beneficiaryDetails,
                        additionalBankDetails: self.additionalBankDetails
                    };
                    params.dashboard.loadComponent("review-beneficiary-maintenance", parameters, self);
                }
            });
        };
    };
});
