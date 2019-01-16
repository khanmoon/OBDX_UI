define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
	 * Model file for Debit card section. This file contains the model definition
	 * for Debit cards section and exports the DebitCardModel  which can be used
	 * as a component in any form in which user's debit card associated with particular accounts
	 * information are required.
	 * @namespace DebitCardDetails~DebitCardModel
     * @class

     *@property {Object} baseService -To store the baseService object
     *@property {Object} fetchDebitCardInfoDeferred -To store the deferred object
	 */
  var DebitCardModel = function() {
    var baseService = BaseService.getInstance(),

      /**
       * Model - description
       *
       * @return {type}  description
       */
      Model = function() {
        this.activateDebitCard = {
          requestType: "",
          requestData: "",
          entityTypeIdentifier: "",
          status: "",
          entityTypeIdentifierKey: "",
          priorityType: "",
          entityType: "",
          definition: {
            id: ""
          }
        };
        this.requestData = {
          label: ""
        };
      };
    /**
     * Method to fetch Debit card information data for specific account id .
     * deferred object is resolved once the accounts information list is successfully fetched
     */
    var fetchDebitCardInfoDeferred, fetchDebitCardInfo = function(acccountId, deferred) {
        var options = {
          url: "accounts/demandDeposit/" + acccountId + "/debitCards",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      createActivateDebitCardRequestDeferred, createActivateDebitCardRequest = function(payload, deferred) {
        var options = {
          url: "servicerequest",
          data: payload,

          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      };
    return {
      fetchDebitCardInfo: function(acccountId) {
        fetchDebitCardInfoDeferred = $.Deferred();
        fetchDebitCardInfo(acccountId, fetchDebitCardInfoDeferred);
        return fetchDebitCardInfoDeferred;
      },

      createActivateDebitCardRequest: function(data) {
        createActivateDebitCardRequestDeferred = $.Deferred();
        createActivateDebitCardRequest(data, createActivateDebitCardRequestDeferred);
        return createActivateDebitCardRequestDeferred;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new DebitCardModel();
});
