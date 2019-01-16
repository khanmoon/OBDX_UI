define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/register-biller",
    "ojs/ojbutton",
    "ojs/ojknockout"
], function(oj, ko, $, ReviewBillPaymentModel,resourceBundle) {
    "use strict";
    return function (params) {
      var self = this;
      self.mode = ko.observable();
      ko.utils.extend(self, params.rootModel);
      self.resourceBundle = resourceBundle;
      params.dashboard.headerName(self.resourceBundle.heading.payBills);
      params.baseModel.registerElement("confirm-screen");
      params.baseModel.registerComponent("pay-bill", "bill-payments");
      if (params.mode) {
        self.mode(params.mode);
      }else if(self.params.mode){
        self.mode(self.params.mode);
      }

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
        var successMessage, statusMessages, transactionName;
        var confirmScreenDetailsArray = [
                [{
                    label: self.resourceBundle.labels.paidTo,
                    value: self.billerPaymentDetails.billerRegistration.billerNickName
                },
                {
                    label: self.resourceBundle.labels.amount,
                    value: params.baseModel.formatCurrency(self.billerPaymentDetails.billAmount.amount(), self.billerPaymentDetails.billAmount.currency())
                    }]
        ];
        confirmScreenDetailsArray.push([{
          label: self.resourceBundle.labels.paidFrom,
          value: self.billerPaymentDetails.debitAccount.displayValue
        }]);
        ReviewBillPaymentModel.billPayment(ko.mapping.toJSON(self.billerPaymentDetails)).done(function(data, status, jqXhr){
            successMessage = self.resourceBundle.messages.paymentSuccessMessage;
            statusMessages = self.resourceBundle.messages.sucessfull;
          transactionName = self.resourceBundle.heading.payBills;
            loadConfirmationScreen(jqXhr, transactionName, successMessage, statusMessages, confirmScreenDetailsArray);
          });
          };

      self.editPayBill = function(){
        var parameters = {
            mode: "EDIT",
            billerPaymentDetails: self.billerPaymentDetails,
            billerDetails:self.billerDetails
        };
        params.dashboard.loadComponent("pay-bill", parameters, self);
      };

    };
});
