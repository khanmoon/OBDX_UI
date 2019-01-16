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
], function(oj, ko, $, FundingTableModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      FundingTableModel = new FundingTableModelObject(),
      getNewKoModel = function() {
        var KoModel = FundingTableModel.getNewModel();
        return KoModel;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.validationTracker = ko.observable();
    self.fundingTableInfoLoaded = ko.observable(false);
    self.contributionOk = ko.observable("OPTION_YES");
    self.feesConfigured = ko.observable(false);
    self.showFeeTooltip = ko.observable(false);
    FundingTableModel.init(self.productDetails().submissionId.value);
    FundingTableModel.fetchFundingTable().done(function(data) {
      if (!$.isEmptyObject(data.fundingTableDetailDTO)) {
        self.productDetails().fundingTableInfo = getNewKoModel().fundingTableInfo;
        self.productDetails().fundingTableInfo.fundingTableDetailDTO = data.fundingTableDetailDTO[0];
        if (self.productDetails().productType === "LOANS") {
          self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "PROPERTY_PURCHASE_COST")].totalAmount.amount = ko.observable(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "PROPERTY_PURCHASE_COST")].totalAmount.amount);
          self.productDetails().fundingTableInfo.fundingTableDetailDTO.lvrValue = ko.observable(self.productDetails().fundingTableInfo.fundingTableDetailDTO.lvrValue);
        }
        if (self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "BANK_FEE")) {
          if (self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "BANK_FEE")]) {
            self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "BANK_FEE")].totalAmount.amount = ko.observable(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "BANK_FEE")].totalAmount.amount);
            self.feesConfigured(true);
          }
        }
        if (self.productDetails().productType === "AUTOMOBILE") {
          self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "VEHICLE_COST")].totalAmount.amount = ko.observable(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "VEHICLE_COST")].totalAmount.amount);
        }
        self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "FACILITY")].totalAmount.amount = ko.observable(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "FACILITY")].totalAmount.amount);
        self.productDetails().fundingTableInfo.fundingTableDetailDTO.totalOutlay.amount = ko.observable(self.productDetails().fundingTableInfo.fundingTableDetailDTO.totalOutlay.amount);
        self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "CUSTOMER")].customerFundingItemDTOs[0].totalFeeValue.amount = ko.observable(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "CUSTOMER")].customerFundingItemDTOs[0].totalFeeValue.amount);
        self.productDetails().message = getNewKoModel().message;
        self.fundingTableInfoLoaded(true);
        if (self.feesConfigured()) {
          var messageObject = {};
          var i;
          var totalFeeIndex = self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "BANK_FEE");
          for (i = 0; i < self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[totalFeeIndex].bankFeeFundingItemDTOs.length; i++) {
            if (self.resource.bankFees[self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[totalFeeIndex].bankFeeFundingItemDTOs[i].totalFeeType]) {
              messageObject["feeType" + (i + 1)] = self.resource.bankFees[self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[totalFeeIndex].bankFeeFundingItemDTOs[i].totalFeeType];
            } else {
              messageObject["feeType" + (i + 1)] = self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[totalFeeIndex].bankFeeFundingItemDTOs[i].totalFeeType;
            }
            messageObject["fee" + (i + 1)] = rootParams.baseModel.formatCurrency(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[totalFeeIndex].bankFeeFundingItemDTOs[i].totalFeeValue.amount, self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[totalFeeIndex].bankFeeFundingItemDTOs[i].totalFeeValue.currency);
          }
          for (i = 0; i < self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[totalFeeIndex].bankFeeFundingItemDTOs.length; i++) {
            self.productDetails().message = self.productDetails().message + rootParams.baseModel.format(self.resource.totalFeesTooltip, {
              feeType1: messageObject["feeType" + (i + 1)],
              fee1: messageObject["fee" + (i + 1)]
            }) + "<br>";
          }
          self.showFeeTooltip(true);
        }
      }
    });
    self.getIndex = function(obj, key) {
      for (var i = 0; i < obj.length; i++) {
        if (obj[i].fundingItemType === key) {
          return i;
        }
      }
    };
    self.contributionOkSelected = function(event, data) {
      if (data.value === "OPTION_NO") {
        self.contributionOk("OPTION_NO");
      }
      if (data.value === "OPTION_YES") {
        self.contributionOk("OPTION_YES");
      }
    };
    self.editPrice = function() {
      self.contributionOk("OPTION_NO");
    };
    self.submitFundingRequirement = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      FundingTableModel.validateRequirement(ko.mapping.toJSON(self.productDetails().requirements, {
        "ignore": ["propertySubTypeName", "propertyTypeName", "selectedCountry", "selectedState", "selectedValues"]
      })).done(function() {
        self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "CUSTOMER")].customerFundingItemDTOs[0].totalFeeValue.amount(0);
        FundingTableModel.saveFundingTable(ko.toJSON(self.productDetails().fundingTableInfo)).done(function() {
          FundingTableModel.fetchFundingTable().done(function(data) {
            self.fundingTableInfoLoaded(false);
            if (self.productDetails().productType === "LOANS") {
              self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "PROPERTY_PURCHASE_COST")].totalAmount.amount(data.fundingTableDetailDTO[0].fundingItemDetailDTOs[self.getIndex(data.fundingTableDetailDTO[0].fundingItemDetailDTOs, "PROPERTY_PURCHASE_COST")].totalAmount.amount);
              self.productDetails().fundingTableInfo.fundingTableDetailDTO.lvrValue(data.fundingTableDetailDTO[0].lvrValue);
            }
            if (self.productDetails().productType === "AUTOMOBILE") {
              self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "VEHICLE_COST")].totalAmount.amount(data.fundingTableDetailDTO[0].fundingItemDetailDTOs[self.getIndex(data.fundingTableDetailDTO[0].fundingItemDetailDTOs, "VEHICLE_COST")].totalAmount.amount);
            }
            self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "FACILITY")].totalAmount.amount(data.fundingTableDetailDTO[0].fundingItemDetailDTOs[self.getIndex(data.fundingTableDetailDTO[0].fundingItemDetailDTOs, "FACILITY")].totalAmount.amount);
            self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "CUSTOMER")].customerFundingItemDTOs[0].totalFeeValue.amount(data.fundingTableDetailDTO[0].fundingItemDetailDTOs[self.getIndex(data.fundingTableDetailDTO[0].fundingItemDetailDTOs, "CUSTOMER")].customerFundingItemDTOs[0].totalFeeValue.amount);
            if (self.feesConfigured()) {
              self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "BANK_FEE")].totalAmount.amount = ko.observable(data.fundingTableDetailDTO[0].fundingItemDetailDTOs[self.getIndex(data.fundingTableDetailDTO[0].fundingItemDetailDTOs, "BANK_FEE")].totalAmount.amount);
            }
            self.productDetails().fundingTableInfo.fundingTableDetailDTO.totalOutlay.amount(data.fundingTableDetailDTO[0].totalOutlay.amount);
            self.fundingTableInfoLoaded(true);
            if (self.feesConfigured()) {
              var messageObject = {};
              var i;
              var totalFeeIndex = self.getIndex(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs, "BANK_FEE");
              for (i = 0; i < self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[totalFeeIndex].bankFeeFundingItemDTOs.length; i++) {
                if (self.resource.bankFees[self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[totalFeeIndex].bankFeeFundingItemDTOs[i].totalFeeType]) {
                  messageObject["feeType" + (i + 1)] = self.resource.bankFees[self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[totalFeeIndex].bankFeeFundingItemDTOs[i].totalFeeType];
                } else {
                  messageObject["feeType" + (i + 1)] = self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[totalFeeIndex].bankFeeFundingItemDTOs[i].totalFeeType;
                }
                messageObject["fee" + (i + 1)] = rootParams.baseModel.formatCurrency(self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[totalFeeIndex].bankFeeFundingItemDTOs[i].totalFeeValue.amount, self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[totalFeeIndex].bankFeeFundingItemDTOs[i].totalFeeValue.currency);
              }
              self.productDetails().message = "";
              for (i = 0; i < self.productDetails().fundingTableInfo.fundingTableDetailDTO.fundingItemDetailDTOs[totalFeeIndex].bankFeeFundingItemDTOs.length; i++) {
                self.productDetails().message = self.productDetails().message + rootParams.baseModel.format(self.resource.totalFeesTooltip, {
                  feeType1: messageObject["feeType" + (i + 1)],
                  fee1: messageObject["fee" + (i + 1)]
                }) + "<br>";
              }
            }
            self.contributionOk("OPTION_YES");
          });
        });
      });
    };
    self.submitFundingInfo = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      if (self.fundingTableInfoLoaded()) {
        FundingTableModel.saveFundingTable(ko.toJSON(self.productDetails().fundingTableInfo)).done(function() {
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
        });
      } else {
        self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
      }
    };
  };
});
