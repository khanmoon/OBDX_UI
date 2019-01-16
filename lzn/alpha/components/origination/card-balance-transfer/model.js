define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model file for Balance Transfer for Credit Card product.
   * @returns {function} BalanceTransferModel Balance Transfer Model
   */
  return function BalanceTransferModel() {
    /**
     * Model for balance transfer object.
     * @param {Object} modelData model Data
     * @returns {void}
     */
    var Model = function(modelData) {
        this.transferCard = {
          cardIssuerName: modelData ? (modelData.cardIssuerName ? modelData.cardIssuerName : "") : "",
          payeeName: modelData ? (modelData.payeeName ? modelData.payeeName : "") : "",
          cardId: modelData ? (modelData.cardId ? modelData.cardId : "") : "",
          temp_maskedCardNumber: "",
          temp_maskedNumber: "",
          temp_isActive: false,
          balanceTransferAmount: modelData ? (modelData.balanceTransferAmount ? modelData.balanceTransferAmount : "") : "",
          currencyCode: modelData ? (modelData.currencyCode ? modelData.currencyCode : "") : ""
        };
      },
      baseService = BaseService.getInstance();
    var fetchCardIssuerNamesDeferred,
      /**
       * Method to fetch card issuer names for balance transfer.
       * @param {Object} deferred deferred object
       * @returns {void}
       */
      fetchCardIssuerNames = function(deferred) {
        var options = {
          url: "enumerations/cardIssuerNames",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      updateBalanceTransferDetailsDeferred,
      /**
       * Method to update balance details transfer for the credit card product.
       * @param {String} submissionId Submission id of the application
       * @param {String} payload request paylaod
       * @param {String} deferred deferred object
       * @returns {void}
       */
      updateBalanceTransferDetails = function(submissionId, payload, deferred) {
        var params = {
            submissionId: submissionId
          },
          options = {
            url: "submissions/{submissionId}/creditCardApplications/balanceTransfer",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.update(options, params);
      },
      fetchBalanceTransferDetailsDeferred,
      /**
       * Method to fetch balance transfer details for the credit card product.
       * @param {String} submissionId Submission id of the application
       * @param {String} facilityId facility Id
       * @param {String} simulationId simulation Id
       * @param {String} offerId offerId
       * @param {String} deferred deferred object
       * @returns {void}
       */
      fetchBalanceTransferDetails = function(submissionId, facilityId, simulationId, offerId, deferred) {
        var params = {
            submissionId: submissionId,
            facilityId: facilityId,
            simulationId: simulationId,
            offerId: offerId
          },
          options = {
            url: "submissions/{submissionId}/creditCardApplications/balanceTransfer?offerId={offerId}&facilityId={facilityId}&simulationId={simulationId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * Public method to get card issuer name
       *
       * @returns {Object} fetchCardIssuerNamesDeferred An object of type deferred
       */
      fetchCardIssuerNames: function() {
        fetchCardIssuerNamesDeferred = $.Deferred();
        fetchCardIssuerNames(fetchCardIssuerNamesDeferred);
        return fetchCardIssuerNamesDeferred;
      },
      /**
       * Public method to update balance transfer details
       *
       * @param {Object} submissionId Submission id of the application
       * @param {Object} payload request payload
       * @returns {Object} updateBalanceTransferDetailsDeferred An object of type deferred
       */
      updateBalanceTransferDetails: function(submissionId, payload) {
        updateBalanceTransferDetailsDeferred = $.Deferred();
        updateBalanceTransferDetails(submissionId, payload, updateBalanceTransferDetailsDeferred);
        return updateBalanceTransferDetailsDeferred;
      },
      /**
       * Public method to fetch balance transfer details
       *
       * @param {Object} submissionId submission Id
       * @param {Object} facilityId facility Id
       * @param {Object} simulationId simulation Id
       * @param {Object} offerId offer Id
       * @returns {Object} fetchBalanceTransferDetailsDeferred An object of type deferred
       */
      fetchBalanceTransferDetails: function(submissionId, facilityId, simulationId, offerId) {
        fetchBalanceTransferDetailsDeferred = $.Deferred();
        fetchBalanceTransferDetails(submissionId, facilityId, simulationId, offerId, fetchBalanceTransferDetailsDeferred);
        return fetchBalanceTransferDetailsDeferred;
      }
    };
  };
});