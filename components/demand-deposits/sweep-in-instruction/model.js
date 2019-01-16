define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model file for Selected Account detail section. This file contains the model definition
   * for Details section and exports the sweepInInstructionModel model which can be used
   * as a component in any form in which specific account detail information are required.
   * @namespace sweepInInstructionModel~sweepInInstructionModel
   * @property {Object} params -To store data passed
   * @property {Object} baseService -To store baseService object
   * @return {type}  description
   */

  var sweepInInstructionModel = function() {
    var params, baseService = BaseService.getInstance(),

      /**
       * addSweepInInstructionsDeferred - to add sweep in instructions
       *
       * @param  {type} payload               description
       * @param  {type} selectedAccountNumber description
       * @param  {type} deferred              description
       * @return {type}                       description
       */
      addSweepInInstructionsDeferred, addSweepInInstructions = function(payload, selectedAccountNumber, deferred) {
        var params = {
          "accNum": selectedAccountNumber
        };
        var options = {

          url: "accounts/demandDeposit/{accNum}/sweepInInstructions",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options, params);
      },


      /**
       * deleteSweepInInstructionsDeferred - delete sweep in instructions
       *
       * @param  {type} selectedAccountNumber description
       * @param  {type} instructionNo         description
       * @param  {type} deferred              description
       * @return {type}                       description
       */
      deleteSweepInInstructionsDeferred, deleteSweepInInstructions = function(selectedAccountNumber, instructionNo, deferred) {
        var params = {
          "accNum": selectedAccountNumber,
          "instructionNo": instructionNo
        };
        var options = {

          url: "accounts/demandDeposit/{accNum}/sweepInInstructions/{instructionNo}",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.remove(options, params);
      },

      fireBatchDeferred,
      /**
       * fireBatchDeferred - fires the batch request that creates each sweep in instruction.
       *
       * @param  {type} deferred             description
       * @param  {type} batchRequest         description
       * @param  {type} type                 description
       * @return {type}                      description
       */
      fireBatch = function(deferred, batchRequest, type) {
        var options = {
          url: "batch",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        };
        baseService.batch(options, {
          type: type
        }, batchRequest);
      };


    return {
      /**
       * fetchDDA - it fetches the all demand Deposit accounts
       *
       * @return {type}  description
       */
      fetchDDA: function() {
        params = {};
        var options = {
          url: "accounts/demandDeposit"
        };
        return baseService.fetch(options, params);
      },
      /**
       * fetchTDA - it fetches the all term Deposit accounts
       *
       * @return {type}  description
       */
      fetchTDA: function() {
        params = {
          noDepositNumber:true
        };
        var options = {
          url: "accounts/deposit?noDepositNumber={noDepositNumber}&module=CON&module=ISL"
        };
        return baseService.fetch(options, params);
      },

      /**
       * fetchSweepInInstructionslist - provies the list of accounts which are linked for sweeep in
       *
       * @param  {type} selectedAccountNumber description
       * @return {type}                       description
       */
      fetchSweepInInstructionslist: function(selectedAccountNumber) {
        params = {
          "accNum": selectedAccountNumber
        };
        var options = {
          url: "accounts/demandDeposit/{accNum}/sweepInInstructions"

        };
        return baseService.fetch(options, params);
      },

      /**
       * addSweepInInstructions - description
       *
       * @param  {type} payload               description
       * @param  {type} selectedAccountNumber description
       * @return {type}                       description
       */
      addSweepInInstructions: function(payload, selectedAccountNumber) {
        addSweepInInstructionsDeferred = $.Deferred();
        addSweepInInstructions(payload, selectedAccountNumber, addSweepInInstructionsDeferred);
        return addSweepInInstructionsDeferred;
      },

      /**
       * deleteSweepInInstructions - description
       *
       * @param  {type} selectedAccountNumber description
       * @param  {type} instructionNo         description
       * @return {type}                       description
       */
      deleteSweepInInstructions: function(selectedAccountNumber, instructionNo) {
        deleteSweepInInstructionsDeferred = $.Deferred();
        deleteSweepInInstructions(selectedAccountNumber, instructionNo, deleteSweepInInstructionsDeferred);
        return deleteSweepInInstructionsDeferred;
      },

      /**
       * confirmSweepInInstructions - description
       *
       * @param  {type} batchRequest description
       * @param  {type} type         description
       * @return {type}              description
       */
      confirmSweepInInstructions: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);
        return fireBatchDeferred;
      }
    };
  };
  return new sweepInInstructionModel();
});
