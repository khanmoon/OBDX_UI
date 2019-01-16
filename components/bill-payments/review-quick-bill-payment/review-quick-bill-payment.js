define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/quick-payments",
    "ojs/ojbutton",
    "ojs/ojknockout"
], function(oj, ko, $, ReviewQuickPaymentModel,resourceBundle) {
    "use strict";
    return function (params) {
      var self = this;
      self.mode = ko.observable();
      ko.utils.extend(self, params.rootModel);
      self.resourceBundle = resourceBundle;
      params.dashboard.headerName(self.resourceBundle.labels.quickBillPay);
      params.baseModel.registerElement("confirm-screen");
      params.baseModel.registerComponent("quick-bill-payment", "bill-payments");

      /**
       * This function redirects to the confirmation screen
       *
       * @function loadConfirmationScreen
       * @param {Object} jqXhr - response object
       * @param {String} transactionName - name of the transaction
       * @param {Object} successMessage - success message to be displayed
       * @param {arrayList} statusMessages - transaction status messages
       * @param {arrayList} confirmScreenDetailsArray - additional details to be displayed on confirm screen
       * @returns {void}
       */
      function loadConfirmationScreen(jqXhr, transactionName, successMessage, statusMessages, confirmScreenDetailsArray){
        params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: transactionName,
            confirmScreenExtensions: {
                successMessage: successMessage,
                statusMessages: statusMessages,
                taskCode: "EB_F_BP",
                isSet: true,
                confirmScreenDetails: confirmScreenDetailsArray,
                template: "confirm-screen/bill-payment"
            }
        }, self);
      }

      self.confirm = function () {
        self.quickBillPayDetails.billerType("QUICK_PAY");
        var successMessage, statusMessages, transactionName;
        var confirmScreenDetailsArray = [
                [{
                    label: self.resourceBundle.registerBiller.labels.amount,
                    value: params.baseModel.formatCurrency(self.quickBillPayDetails.billAmount.amount(), self.quickBillPayDetails.billAmount.currency())
                  },
                  {
                      label: self.resourceBundle.registerBiller.labels.paidFrom,
                      value: self.quickBillPayDetails.debitAccount.displayValue
                      }]
        ];

        ReviewQuickPaymentModel.billPayment(ko.mapping.toJSON(self.quickBillPayDetails)).done(function(data, status, jqXhr){
            successMessage = self.resourceBundle.registerBiller.messages.paymentSuccessMessage;
            statusMessages = self.resourceBundle.registerBiller.messages.sucessfull;
            transactionName = self.resourceBundle.labels.quickBillPay;
            loadConfirmationScreen(jqXhr, transactionName, successMessage, statusMessages, confirmScreenDetailsArray);
          });
          };

      self.editPayBill = function(){
        self.currentStage("CREATE");
    };

    };
});
