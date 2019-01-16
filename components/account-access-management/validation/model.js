define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ExclusionModel = function() {
    var baseService = BaseService.getInstance();
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf ExclusionModel~ExclusionModel
     */
    var Model = function() {
      this.partyDetails = {
        party: {
          value: "",
          displayValue: ""
        },

        userType: "",
        partyName: null,
        partyDetailsFetched: false,
        additionalDetails: "",
        partyFirstName: null,
        partyLastName: null
      };
    };
    /**
     * This function fires batch of set of request
     * @params {deferred} - object to trach completion of Batch call
     * {batchData} - payload of batch service
     * @function fireBatch
     * @memberOf ExclusionModel
     **/
    var fireBatchDeferred, fireBatch = function(batchData, deferred) {
        var options = {
          headers: {
            "BATCH_ID": ((Math.random() * 1000000000000) + 1).toString()
          },
          url: "batch/",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.batch(options, {}, batchData);
      },
      fetchCorpAdminPartyDetailsDeferred, fetchCorpAdminPartyDetails = function(deferred) {

        var options = {
          url: "me/party",

          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       * This function gets list of associated users for party
       * @params {partyID} - partyID for preference needs to be fetched
       * @function fetchAssociatedUserForParty
       * @memberOf ExclusionModel
       **/
      fetchAssociatedUserForPartyDeferred, fetchAssociatedUserForParty = function(partyID, deferred) {
        var params = {
            "partyId": partyID
          },
          options = {
            url: "users?partyId={partyId}&isAccessSetupCheckRequired=true",

            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      /**
       * This function creates the access
       * @params {deferred} - object to trach completion of Batch call
       * {payload} - payload of batch service
       * @function readUserAccountAccess
       * @memberOf ExclusionModel
       **/
      readUserAccountAccessDeferred, readUserAccountAccess = function(userId, partyId, deferred) {
        var options = {
          url : "accountAccess?partyId=" + partyId + "&userId=" + userId,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       * This function creates the access
       * @params {deferred} - object to trach completion of Batch call
       * {payload} - payload of batch service
       * @function readUserAccountAccess
       * @memberOf ExclusionModel
       **/
      readAllAccountDetailsDeferred, readAllAccountDetails = function(partyId, deferred) {
        var options = {
          url: "accountAccess?partyId=" + partyId + "&accountType=CSA&accountType=TRD&accountType=LON",

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);

      },
      /**
       * This function read the access details
       * @params {deferred} - object to trach completion of Batch call
       * {payload} - payload of batch service
       * @function readUserAccountAccess
       * @memberOf ExclusionModel
       **/
      readAllUserAccountDetailsDeferred, readAllUserAccountDetails = function(partyId, userId, deferred) {
        var options = {
          url: "accountAccess?partyId=" + partyId + "&userId=" + userId + "&accountType=CSA&accountType=TRD&accountType=LON",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      fireBatch: function(batchData) {
        fireBatchDeferred = $.Deferred();
        fireBatch(batchData, fireBatchDeferred);
        return fireBatchDeferred;
      },
      fetchCorpAdminPartyDetails: function() {
        fetchCorpAdminPartyDetailsDeferred = $.Deferred();
        fetchCorpAdminPartyDetails(fetchCorpAdminPartyDetailsDeferred);
        return fetchCorpAdminPartyDetailsDeferred;
      },
      fetchAssociatedUserForParty: function(batchData) {
        fetchAssociatedUserForPartyDeferred = $.Deferred();
        fetchAssociatedUserForParty(batchData, fetchAssociatedUserForPartyDeferred);
        return fetchAssociatedUserForPartyDeferred;
      },
      readUserAccountAccess: function(userId, partyId) {
        readUserAccountAccessDeferred = $.Deferred();
        readUserAccountAccess(userId, partyId, readUserAccountAccessDeferred);
        return readUserAccountAccessDeferred;
      },
      readAllAccountDetails: function(partyId) {
        readAllAccountDetailsDeferred = $.Deferred();
        readAllAccountDetails(partyId, readAllAccountDetailsDeferred);
        return readAllAccountDetailsDeferred;
      },
      readAllUserAccountDetails: function(partyId, userId) {
        readAllUserAccountDetailsDeferred = $.Deferred();
        readAllUserAccountDetails(partyId, userId, readAllUserAccountDetailsDeferred);
        return readAllUserAccountDetailsDeferred;
      }
    };
  };
  return new ExclusionModel();
});