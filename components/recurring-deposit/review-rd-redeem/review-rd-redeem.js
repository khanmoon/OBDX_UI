/**
 * Reccuring Deposit Redemption.
 *
 * @module recurring-deposit
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} ResourceBundle
 */
define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/review-rd-redeem",
  "ojs/ojbutton"
], function(oj, ko, reviewRedeemModel, ResourceBundle) {
  "use strict";
  /** Review Recurring Deposit Redemption.
   *
   *It allows user review all the details entered to redeem Recurring Deposit.
   * @param {object} rootParams  An object which contains contect of dashboard and param values
   * @return {function} function
   * @return {object} getNewKoModel
   *
   */
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.redeemRDModel = self.params.redeemRDModel;
    self.resource = ResourceBundle;
    rootParams.baseModel.registerElement(["page-section", "row", "confirm-screen"]);
    rootParams.baseModel.registerComponent("create-rd", "recurring-deposit");
    rootParams.dashboard.headerName(self.resource.header.redemption);
    if (self.redeemRDModel.payoutInstructions()[0].clearingCode() && self.redeemRDModel.payoutInstructions()[0].networkType()) {
        reviewRedeemModel.fetchBranch(self.redeemRDModel.payoutInstructions()[0].networkType(), self.redeemRDModel.payoutInstructions()[0].clearingCode()).then(function(data) {
          self.redeemRDModel.payoutInstructions()[0].address.line1(data.branchAddress.line1);
          self.redeemRDModel.payoutInstructions()[0].address.line2(data.branchAddress.line2);
          self.redeemRDModel.payoutInstructions()[0].address.city(data.branchAddress.city);
          self.redeemRDModel.payoutInstructions()[0].address.country(data.branchAddress.country);
          self.redeemRDModel.payoutInstructions()[0].bankName(data.name);
        });
      }
      var confirmScreenDetailsArray = [
                [
                    {
                        label:  self.resource.confirmScreenLabels.recurringDepositNumber,
                        value: self.redeemRDModel.accountId.displayValue()
                    },
                    {
                        label: self.resource.payoutDetails.payTo,
                        value: self.resource.payoutDetails.payoutType[self.redeemRDModel.payoutInstructions()[0].type()]
                      }
                      ],
                [
                {
                        label: self.resource.payoutDetails.creditAccountNum,
                        value: [self.redeemRDModel.payoutInstructions()[0].accountId.displayValue(),self.redeemRDModel.payoutInstructions()[0].account(),self.redeemRDModel.payoutInstructions()[0].beneficiaryName(),self.redeemRDModel.payoutInstructions()[0].bankName(),self.redeemRDModel.payoutInstructions()[0].address.line1(),self.redeemRDModel.payoutInstructions()[0].address.line2(),self.redeemRDModel.payoutInstructions()[0].address.city(),self.redeemRDModel.payoutInstructions()[0].address.country()]
                      },
                      {
                        label: self.resource.redemptionDetails.finalRedemptionAmount,
                        value:rootParams.baseModel.formatCurrency(self.redeemRDModel.redemptionAmount.amount(),self.redeemRDModel.redemptionAmount.currency())
                    }
                      ]
            ];
     self.confirmRedeemRD = function () {
            reviewRedeemModel.redeem(self.redeemRDModel.accountId.value(),ko.mapping.toJSON(self.redeemRDModel)).done(function (data, status, jqXhr) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resource.header.redemption,
                    redeem:true,
                    hostReferenceNumber: data.redemptionDetail ? data.redemptionDetail[0].redeemReferenceNo : null,
                    confirmScreenExtensions: {
                                  isSet: true,
                                  taskCode: "TD_F_RDM_RD",
                                  successMessage: self.resource.confirmScreenLabels.createSuccessMessage,
                                  confirmScreenDetails: confirmScreenDetailsArray,
                                  template: "confirm-screen/rd-template"
                                }
                });
            });
        };
   };
});
