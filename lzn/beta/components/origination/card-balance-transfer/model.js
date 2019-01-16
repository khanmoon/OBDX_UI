define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * BalanceTransferModel - Model file for Balance Transfer for Credit Card product.
   *
   * @return {void}  description
   */
  return function BalanceTransferModel() {
    /**
     * var Model - Model for balance transfer object.
     *
     * @param  {object} modelData description
     * @return {void}           description
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
       * fetchCardIssuerNames - Method to fetch card issuer names for balance transfer.
       *
       * @param  {object} deferred description
       * @return {void}          description
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
       * updateBalanceTransferDetails - Method to update balance details transfer for the credit card product.
       *
       * @param  {object} submissionId description
       * @param  {object} payload      description
       * @param  {object} deferred     description
       * @return {void}              description
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
       * fetchBalanceTransferDetails - Method to fetch balance transfer details for the credit card product.
       *
       * @param  {object} submissionId description
       * @param  {object} facilityId   description
       * @param  {object} simulationId description
       * @param  {object} offerId      description
       * @param  {object} deferred     description
       * @return {void}              description
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

      /**
       * getNewModel - description
       *
       * @param  {object} modelData description
       * @return {object} model
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },

      /**
       * fetchCardIssuerNames - description
       *
       * @return {object} fetchCardIssuerNamesDeferred
       */
      fetchCardIssuerNames: function() {
        fetchCardIssuerNamesDeferred = $.Deferred();
        fetchCardIssuerNames(fetchCardIssuerNamesDeferred);
        return fetchCardIssuerNamesDeferred;
      },

      /**
       * updateBalanceTransferDetails - description
       *
       * @param  {object} submissionId description
       * @param  {object} payload      description
       * @return {object} updateBalanceTransferDetailsDeferred
       */
      updateBalanceTransferDetails: function(submissionId, payload) {
        updateBalanceTransferDetailsDeferred = $.Deferred();
        updateBalanceTransferDetails(submissionId, payload, updateBalanceTransferDetailsDeferred);
        return updateBalanceTransferDetailsDeferred;
      },

      /**
       * fetchBalanceTransferDetails - description
       *
       * @param  {object} submissionId description
       * @param  {object} facilityId   description
       * @param  {object} simulationId description
       * @param  {object} offerId      description
       * @return {object} fetchBalanceTransferDetailsDeferred
       */
      fetchBalanceTransferDetails: function(submissionId, facilityId, simulationId, offerId) {
        fetchBalanceTransferDetailsDeferred = $.Deferred();
        fetchBalanceTransferDetails(submissionId, facilityId, simulationId, offerId, fetchBalanceTransferDetailsDeferred);
        return fetchBalanceTransferDetailsDeferred;
      }
    };
  };
});
