define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/discrepancies",
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
], function (oj, ko, $, DiscrepanciesModel, locale) {
    "use strict";
    return function (params) {
        var self = this;
        self.drawerNameArray = ko.observableArray();
        self.validationTracker = ko.observable();
        self.id = ko.observable();
        self.dataSourceCreated = ko.observable(false);
        self.listExportBills = ko.observableArray();
        self.dataSource = ko.observableArray();
        self.partyId = ko.observable();
        self.counterPartyName = ko.observable();
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;
        params.dashboard.headerName(self.resourceBundle.heading.customerAcceptance);
        params.baseModel.registerComponent("view-discrepancies", "customer-acceptance");
        params.baseModel.registerComponent("customer-acceptance-nav-bar", "customer-acceptance");
        if (self.drawerNameArray().length === 0) {
            DiscrepanciesModel.fetchPartyDetails().done(function (data) {
                self.drawerNameArray.push({
                    label: data.party.personalDetails.fullName,
                    value: data.party.id.value
                });
                DiscrepanciesModel.fetchPartyRelations().done(function (partyData) {
                    for (var i = 0; i < partyData.partyToPartyRelationship.length; i++) {
                        self.drawerNameArray.push({
                            label: partyData.partyToPartyRelationship[i].relatedPartyName,
                            value: partyData.partyToPartyRelationship[i].relatedParty.value
                        });
                    }
                });
            });
        }
        self.reset = function () {
            self.partyId([]);
            self.counterPartyName("");
            self.id("");
            self.dataSourceCreated(false);
        };
        self.onBillSelected = function (data) {
            DiscrepanciesModel.getBillDiscrepanciesDetails(data.billNumber).done(function (response) {
                if (response.discrepancyDTO) {
                    var parameters = {
                        mode: "VIEW",
                        billDetails: response.discrepancyDTO,
                        billReferenceNumber: data.billNumber
                    };
                    params.dashboard.loadComponent("view-discrepancies", parameters, self);
                } else {
                    params.baseModel.showMessages(null, [self.resourceBundle.tradeFinanceErrors.messages.noRecordFound], "ERROR");
                }
            });
        };
        self.getListBillsDiscrepancies = function () {
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.dataSourceCreated(false);
            self.listExportBills.removeAll();
            DiscrepanciesModel.listDiscrepancies(self.partyId()[0], self.counterPartyName(), self.id()).done(function (data) {
                for (var i = 0; i < data.billDTOs.length; i++) {
                    self.listExportBills.push({
                        billNumber: data.billDTOs[i].id,
                        productName: data.billDTOs[i].productName,
                        beneficiary: data.billDTOs[i].counterPartyName,
                        lcNumber: data.billDTOs[i].lcRefNo,
                        billAmount: params.baseModel.formatCurrency(data.billDTOs[i].amount.amount, data.billDTOs[i].amount.currency)
                    });
                }
                self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listExportBills(), { idAttribute: ["billNumber"] })));
                self.dataSourceCreated(true);
            });
        };
    };
});