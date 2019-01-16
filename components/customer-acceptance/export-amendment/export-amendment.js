define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/discrepancies",
    "ojs/ojnavigationlist",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojvalidation",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojknockout-validation",
    "ojs/ojdatetimepicker",
    "ojs/ojcheckboxset",
    "ojs/ojselectcombobox",
    "ojs/ojcube",
    "ojs/ojdatagrid",
    "ojs/ojswitch",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingdatagriddatasource"
], function (oj, ko, $, ExportAmendmentModel, locale) {
    "use strict";
    return function (params) {
        var self = this;
        params.baseModel.registerComponent("customer-acceptance-nav-bar", "customer-acceptance");
        params.baseModel.registerComponent("review-amend-lc", "letter-of-credit");
        self.beneNameArray = ko.observableArray();
        self.benePartyId = ko.observable();
        self.lcNumber = ko.observable(null);
        self.applicantName = ko.observable(null);
        self.validationTracker = ko.observable();
        self.dataSourceExportAmendments = ko.observable(false);
        self.dataSourceForExportAmendment = ko.observable();
        self.listOfExportAmendments = ko.observableArray([]);
        self.lcAmendValues = ko.observable();
        self.amendmentDetails = ko.observable();
        self.amendmentId = ko.observable();
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;
        params.dashboard.headerName(self.resourceBundle.heading.customerAcceptance);
        ExportAmendmentModel.fetchPartyDetails().done(function (data) {
            self.beneNameArray.removeAll();
            self.beneNameArray.push({
                label: data.party.personalDetails.fullName,
                value: data.party.id.value
            });
            ExportAmendmentModel.fetchPartyRelations().done(function (partyData) {
                for (var i = 0; i < partyData.partyToPartyRelationship.length; i++) {
                    self.beneNameArray.push({
                        label: partyData.partyToPartyRelationship[i].relatedPartyName,
                        value: partyData.partyToPartyRelationship[i].relatedParty.value
                    });
                }
            });
        });
        self.cancel = function () {
            params.dashboard.openDashBoard();
        };
        self.reset = function () {
            self.benePartyId([]);
            self.applicantName("");
            self.lcNumber("");
            self.dataSourceExportAmendments(false);
        };
        self.fetchAmendmentDetails = function (values) {
            ExportAmendmentModel.getAmendmentDetails(values.lcNumber, values.amendmentNo).done(function (data) {
                var parameters = {
                    mode: "ACCEPTANCE",
                    data: ko.mapping.fromJS(data.letterOfCreditAmendment)
                };
                params.dashboard.loadComponent("review-amend-lc", parameters, self);
            });
        };
        self.getExportAmendmentList = function () {
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.dataSourceExportAmendments(false);
            ExportAmendmentModel.getExportAmendments(self.benePartyId()[0], self.applicantName(), self.lcNumber()).done(function (data) {
                self.listOfExportAmendments.removeAll();
                for (var i = 0; i < data.letterOfCreditAmendmentDTOs.length; i++) {
                    self.listOfExportAmendments.push({
                        amendmentNo: data.letterOfCreditAmendmentDTOs[i].id,
                        productName: data.letterOfCreditAmendmentDTOs[i].productType,
                        applicant: data.letterOfCreditAmendmentDTOs[i].applicantName,
                        lcNumber: data.letterOfCreditAmendmentDTOs[i].lcId,
                        lcAmount: params.baseModel.formatCurrency(data.letterOfCreditAmendmentDTOs[i].newAmount.amount, data.letterOfCreditAmendmentDTOs[i].newAmount.currency)
                    });
                }
                self.dataSourceForExportAmendment(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listOfExportAmendments())));
                self.dataSourceExportAmendments(true);
            });
        };
    };
});