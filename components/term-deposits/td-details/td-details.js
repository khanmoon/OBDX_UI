define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/td-details"
], function (ko, $, TDdetailsModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.valueDate = ko.observable();
        self.depositDate = ko.observable();
        self.payoutInstructions = ko.observableArray([]);
        self.viewDetails = ko.observable(false);
        self.editDetails = ko.observable(false);
        self.maturityDate = ko.observable();
        self.closeTDdetails = ko.observable();
        self.payoutFromRedemptionFetched = ko.observable(false);
        self.tdDetailsLocale = locale;
        self.closeTDdetailsLoaded = ko.observable(false);
        rootParams.dashboard.headerName(locale.termDepositDetails.depositDetails);
        self.accountNickNameData = ko.observable();
        self.viewDetailsLoaded = ko.observable(false);
        self.tdViewDetails = ko.observable();
        rootParams.baseModel.registerComponent("td-amend", "term-deposits");
        rootParams.baseModel.registerComponent("td-topup", "term-deposits");
        rootParams.baseModel.registerComponent("td-redeem", "term-deposits");
        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("row");
        self.selectedAccount = ko.observable(self.params.id ? self.params.id.value : null);
        self.additionalDetails = ko.observable();
        self.isSweepinProvider =ko.observable(locale.termDepositDetails.sweepInFlags.inactive);
        self.showFloatingPanel = function () {
            $("#panelTermDeposit").trigger("openFloatingPanel");
        };
        self.checkLength = function (args, type) {
            return args === 0 ? "" : rootParams.baseModel.format(self.tdDetailsLocale.generic.common.tenure[args > 1 ? "plural" : "singular"][type], { count: args })+" ";
        };
        self.formatTenure = function (tenure) {
            return rootParams.baseModel.format("{years}{months}{days}", {
                years: self.checkLength(tenure.years, "year"),
                months: self.checkLength(tenure.months, "month"),
                days: self.checkLength(tenure.days, "day")
            });
        };
        self.amendData = self.params;
        self.fetchDetails = function (accountNumber) {
            TDdetailsModel.fetchTdDetails(accountNumber).done(function (data) {
                self.tdViewDetails(data.termDepositDetails);
                self.payoutFromRedemptionFetched(false);
                if (self.tdViewDetails().status === "CLOSED") {
                    var count = 0;
                    TDdetailsModel.fetchClosedTDdetails(accountNumber).done(function (data) {
                        self.closeTDdetails(data);
                        var bankURL;
                        if(data.redemptionDetail.length>0){
                          self.payoutFromRedemptionFetched(true);
                        }
                        else{
                          self.fetchpayoutInstructions(accountNumber);
                        }
                        for (var i = 0; i < data.redemptionDetail.length; i++) {
                            if (data.redemptionDetail[i].typeRedemption === "F") {
                                if (data.redemptionDetail[i].payoutInstructions[0].type !== "E") {
                                    bankURL = "locations/branches?branchCode=" + data.redemptionDetail[i].payoutInstructions[0].branchId;
                                    TDdetailsModel.fetchBankDetails(bankURL).done(function (bankDetails) {
                                        self.closeTDdetails().redemptionDetail[count].payoutInstructions[0].branchAddress = bankDetails.addressDTO[0].branchAddress.postalAddress;
                                        self.closeTDdetails().redemptionDetail[count].payoutInstructions[0].branchName = bankDetails.addressDTO[0].branchName;
                                        self.closeTDdetailsLoaded(true);
                                    });
                                } else {
                                    bankURL = "financialInstitution/domesticClearingDetails/" + data.redemptionDetail[i].payoutInstructions[0].networkType + "/" + data.redemptionDetail[i].payoutInstructions[0].clearingCode;
                                    TDdetailsModel.fetchBankDetails(bankURL).done(function (domesticBankDetails) {
                                        self.closeTDdetails().redemptionDetail[count].payoutInstructions[0].branchAddress = domesticBankDetails.addressDTO[0].branchAddress.postalAddress;
                                        self.closeTDdetails().redemptionDetail[count].payoutInstructions[0].branchName = domesticBankDetails.addressDTO[0].branchName;
                                        self.closeTDdetailsLoaded(true);
                                    });
                                }
                            }
                        }
                    });
                  }
                if (self.tdViewDetails().rollOverType !== "I" && (!self.payoutFromRedemptionFetched() || self.tdViewDetails().status !== "CLOSED")) {
                  self.fetchpayoutInstructions(accountNumber);
                }
              if(self.tdViewDetails && ko.isObservable(self.tdViewDetails) && self.tdViewDetails().sweepinProvider){
                  self.isSweepinProvider(locale.termDepositDetails.sweepInFlags.active);
              }
                self.viewDetailsLoaded(true);
            });
        };
        if (self.selectedAccount()) {
            self.fetchDetails(self.selectedAccount());
        }
        self.selectedAccount.subscribe(function (newValue) {
            self.viewDetailsLoaded(false);
            self.fetchDetails(newValue);
        });
        self.fetchpayoutInstructions=function(accountNumber){
          TDdetailsModel.fetchpayoutInstructions(accountNumber).done(function (data) {
              self.payoutInstructions(data.payoutInstructions);
              var count = 0;
              var bankURL;
              var totalPayout = data.payoutInstructions.length;
              for (var i = 0; i < data.payoutInstructions.length; i++) {
                  if (data.payoutInstructions[i].type !== "E") {
                      bankURL = "locations/branches?branchCode=" + data.payoutInstructions[i].branchId;
                      TDdetailsModel.fetchBankDetails(bankURL).done(function (bankDetails) {
                          self.payoutInstructions()[count].branchAddress = bankDetails.addressDTO[0].branchAddress.postalAddress;
                          self.payoutInstructions()[count].branchName = bankDetails.addressDTO[0].branchName;
                          count++;
                          if (count === totalPayout) {
                              self.viewDetails(true);
                          }
                      });
                  } else {
                      bankURL = "financialInstitution/domesticClearingDetails/" + data.payoutInstructions[i].networkType + "/" + data.payoutInstructions[i].clearingCode;
                      TDdetailsModel.fetchBankDetails(bankURL).done(function (domesticBankDetails) {
                          self.payoutInstructions()[count].branchAddress = domesticBankDetails.branchAddress;
                          self.payoutInstructions()[count].branchName = domesticBankDetails.name;
                          count++;
                          if (count === totalPayout) {
                              self.viewDetails(true);
                          }
                      });
                  }
              }
          });
        };
        self.amendTD = function() {
          rootParams.dashboard.loadComponent("td-amend", {
                        rolloverType: self.tdViewDetails().rollOverType,
                        payoutInstructions: self.payoutInstructions(),
                        id: self.params.id
                    }, self);
        };
    };
});
