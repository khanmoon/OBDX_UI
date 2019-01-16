define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/quick-payments",
    "ojs/ojbutton",
    "ojs/ojknockout"
], function(oj, ko, $, ReviewQuickRechargeModel,resourceBundle) {
    "use strict";
    return function (params) {
      var self = this;
      self.mode = ko.observable();
      ko.utils.extend(self, params.rootModel);
      self.resourceBundle = resourceBundle;
      params.baseModel.registerElement("confirm-screen");
      params.baseModel.registerComponent("quick-recharge", "bill-payments");
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
                    label: self.resourceBundle.registerBiller.labels.amount,
                    value: params.baseModel.formatCurrency(self.quickRechargeDetails.billAmount.amount(), self.quickRechargeDetails.billAmount.currency())
                  },{
                      label: self.resourceBundle.registerBiller.labels.paidFrom,
                      value: self.quickRechargeDetails.debitAccount.displayValue
                      }]
        ];

          ReviewQuickRechargeModel.quickBillPayment(ko.mapping.toJSON(self.quickRechargeDetails)).done(function(data, status, jqXhr){
            successMessage = self.resourceBundle.registerBiller.messages.paymentSuccessMessage;
            statusMessages = self.resourceBundle.registerBiller.messages.sucessfull;
            transactionName = self.resourceBundle.heading.quickRecharge;
            loadConfirmationScreen(jqXhr, transactionName, successMessage, statusMessages, confirmScreenDetailsArray);
          });
          };

          self.editPayBill = function(){
            self.currentStage("CREATE");
          };

    };
});
