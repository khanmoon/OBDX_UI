define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var CardBalanceTransferModel = function() {

    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance();
    /**
     * In case more than one instance of model is required
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf Requirements~RequirementsModel
     */
    var BalanceTransferModel = function() {
      this.transferCard = {
        cardIssuerName: "",
        payeeName: "",
        cardId: "",
        balanceTransferAmount: 0,
        currencyCode: ""
      };
    };
    /**
     * Method to get new instance of Balance Transfer details model. This method is a static member
     * of ProductRequirements class, and on calling it will instantiate the defined [Model]{@link RequirementsModel.Model} (private to
     * this class) and return a new instance of same.
     *
     * @function
     * @memberOf Requirements~RequirementsModel
     * @returns Model
     */
    this.getNewModel = function() {
      return new BalanceTransferModel();
    };
    /**
     * Add Balance Transfer details to filed application.
     */
    this.addBalanceTransfer = function(successHandler, submissionId, applicationId, sendData) {
      var options = {
        url: "submissions/" + submissionId + "/applications/" + applicationId + "/balanceTransfer",
        data: JSON.stringify(sendData),
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.update(options);
    };
    /**
     * Fetch credit card issuer names
     */
    this.fetchCardIssuerNames = function(successHandler) {
      var options = {
        url: "enumerations/cardIssuerNames",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetch(options);
    };
  };
  return new CardBalanceTransferModel();
});
