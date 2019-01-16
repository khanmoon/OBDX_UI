define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/alpha/resources/nls/funding-table",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojinputnumber"
], function (oj, ko, $, FundingTableModelObject, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, FundingTableModel = new FundingTableModelObject(), getNewKoModel = function () {
                var KoModel = FundingTableModel.getNewModel();
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.validationTracker = ko.observable();
        self.fundingTableInfoLoaded = ko.observable(false);
        self.contributionOk = ko.observable("OPTION_YES");
        self.applicantObject = rootParams.applicantObject;
        FundingTableModel.init(self.productDetails().submissionId.value);
        FundingTableModel.fetchFundingTable().done(function (data) {
            self.applicantObject().fundingTableInfo = getNewKoModel().fundingTableInfo;
            self.applicantObject().fundingTableInfo.fundingTableDetailDTO = data.fundingTableDetailDTO[0];
            self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "VEHICLE_COST")].totalAmount.amount = ko.observable(self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "VEHICLE_COST")].totalAmount.amount);
            self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "FACILITY")].totalAmount.amount = ko.observable(self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "FACILITY")].totalAmount.amount);
            self.applicantObject().fundingTableInfo.fundingTableDetailDTO.totalOutlay.amount = ko.observable(self.applicantObject().fundingTableInfo.fundingTableDetailDTO.totalOutlay.amount);
            self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "CUSTOMER")].totalAmount.amount = ko.observable(self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "CUSTOMER")].totalAmount.amount);
            self.applicantObject().message = getNewKoModel().message;
            self.fundingTableInfoLoaded(true);
        });
        self.getIndex = function (obj, key) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].fundingItemType === key) {
                    return i;
                }
            }
        };
        self.contributionOkSelected = function (event) {
            if (event.detail.value === "OPTION_NO") {
                self.contributionOk("OPTION_NO");
            }
            if (event.detail.value === "OPTION_YES") {
                self.contributionOk("OPTION_YES");
            }
        };
        self.submitFundingRequirement = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            FundingTableModel.validateRequirement(ko.toJSON(self.productDetails().requirements)).done(function (data) {
                FundingTableModel.fetchFundingTable().done(function () {
                    self.fundingTableInfoLoaded(false);
                    self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "VEHICLE_COST")].totalAmount.amount(data.fundingTableDetailDTO[0].fundingItemDetailDTOs[self.getIndex(data.fundingTableDetailDTO[0].fundingItemDetailDTOs, "VEHICLE_COST")].totalAmount.amount);
                    self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "FACILITY")].totalAmount.amount(data.fundingTableDetailDTO[0].fundingItemDetailDTOs[self.getIndex(data.fundingTableDetailDTO[0].fundingItemDetailDTOs, "FACILITY")].totalAmount.amount);
                    self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.applicantObject().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "CUSTOMER")].totalAmount.amount(data.fundingTableDetailDTO[0].fundingItemDetailDTOs[self.getIndex(data.fundingTableDetailDTO[0].fundingItemDetailDTOs, "CUSTOMER")].totalAmount.amount);
                    self.applicantObject().fundingTableInfo.fundingTableDetailDTO.totalOutlay.amount(data.fundingTableDetailDTO[0].totalOutlay.amount);
                    self.fundingTableInfoLoaded(true);
                    self.contributionOk("OPTION_YES");
                });
            });
        };
        self.submitFundingInfo = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            FundingTableModel.saveFundingTable(ko.toJSON(self.applicantObject().fundingTableInfo)).done(function () {
                self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
            });
        };
    };
});
