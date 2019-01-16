define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * This file contains the view model for the Cheque stop unblock  section
   * @namespace ChequeStopUnblock~viewModel
   * @member
   * @implements [ChequeStopUnblockModel]{@link ChequeStopUnblock~ChequeStopUnblockModel}
   * @constructor ChequeStopUnblockViewModel
   * @property {String} stopUnblockCheque.chequeInstructionType -To store the reference number.
   * @property {String} stopUnblockCheque.startChequeNumber -To store the starting cheque number.
   * @property {String} stopUnblockCheque.endChequeNumber -To store the starting end cheque number.
   * @property {String} chequeInstructionType -To store type of action user wants to do with the cheqe i.e.
   * @property {String} reason -To store the reason of stopping the cheque
   * @property {Object} chequeNo - an Object for storing the start cheque number range
   * @property {Object} stopUnblockCheque - an Object for storing the payload (details) of the cheque which is being stopped or unblocked.
   */
  var StopUnblockChequeModel = function() {
    /**
     * In case more than one instance of StopUnblockChequeModel model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf StopUnblockChequeModel
     */
    var Model = function() {
      return {
        stopUnblockCheque: {
          chequeInstructionType: "STOP",
          reason: "",
          startChequeNumber: "",
          endChequeNumber: ""
        },
        chequeNo: {
          startChequeNumber: null,
          endChequeNumber: null
        }
      };
    };
    /**
    POST method to stop/unblock cheques
    @accountId - account id for particular account for which new debitcard is requested,
    @payload - expected request payload to service
    @deferred - returns deferred resolve or reject
    **/
    var baseService = BaseService.getInstance(),
      postRequestDeffered, postRequest = function(accountId, payload, deffered) {
        var options = {
          url: "accounts/demandDeposit/" + accountId + "/issuedCheques",
          data: payload,
          success: function(data, status, jqXhr) {
            deffered.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deffered.reject(data, status, jqXhr);
          }
        };
        baseService.patch(options);
      };
    return {
      postRequest: function(accountId, payload) {
        postRequestDeffered = $.Deferred();
        postRequest(accountId, payload, postRequestDeffered);
        return postRequestDeffered;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new StopUnblockChequeModel();
});
