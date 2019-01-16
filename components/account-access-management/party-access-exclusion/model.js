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
        partyId: null,
        userType: "",
        partyName: null,
        partyDetailsFetched: false,
        additionalDetails: "",
        partyFirstName: null,
        partyLastName: null
      };
       this.transactionMappingCasa = {
        accountNumber: "",
        selectedTasks: []
      };
       this.transactionMappingTD = {
        accountNumber: "",
        selectedTasks: []
      };
       this.transactionMappingLoan = {
        accountNumber: "",
        selectedTasks: []
      };
    };
    /**
     * This function gets customer preference for party id
     * @params {partyID} - partyID for preference needs to be fetched
     * @function fetchPreferenceForParty
     * @memberOf ExclusionModel
     **/
    var fetchPreferencePartyDeferrred, fetchPreferenceForParty = function(partyID, deferred) {
        var params = {
            "partyId": partyID
          },
          options = {
            url: "parties/{partyId}/preferences",

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
       * @function readAccess
       * @memberOf ExclusionModel
       **/
      readAccessDeferred, readAccess = function(partyId, isCorpAdmin, deferred) {
        var options = {
          url: isCorpAdmin ? "me/party/accountAccess" : "parties/" + partyId + "/preferences/accountAccess",
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
       * @function updateAccess
       * @memberOf ExclusionModel
       **/
      /*  uri: "/parties/" + self.partyID() + "/preferences/accountAccesses/" + self.casaAccountAccessId(),
                       methodType: 'PUT',
                       payLoad: self.getCasaPayload(),
                       sequenceId: 1*/
      updateAccessDeferred, updateAccess = function(partyId, accessID, payload, deferred) {
        var options = {
          url: "parties/" + partyId + "/preferences/accountAccess/" + accessID,
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.update(options);
      },
      createAccessCloneDeferred,
      createAccessClone = function(payload, partyId,isCorpAdmin, deferred) {
        var options = {
          url: isCorpAdmin ? "me/party/accountAccess" : "parties/" + partyId + "/preferences/accountAccess",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      deleteAccessDeferred,
      deleteAccess = function(payload, partyId, deferred) {

        var options = {
          url: "parties/" + partyId + "/preferences/accountAccess",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.remove(options);

      },

      /**
       * This function updates the access
       * @params {deferred} - object to track completion of put request
       * {payload} - payload of batch service
       * @function updateAccess
       * @memberOf ExclusionModel
       **/

      updateAccessCloneDeferred,
      updateAccessClone = function(payload, partyId, isCorpAdmin, deferred) {
        var options = {

          url: isCorpAdmin ? "me/party/accountAccess" : "parties/" + partyId + "/preferences/accountAccess",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.update(options);
      };
    return {
      fetchPreferenceForParty: function(partyID) {
        fetchPreferencePartyDeferrred = $.Deferred();
        fetchPreferenceForParty(partyID, fetchPreferencePartyDeferrred);
        return fetchPreferencePartyDeferrred;
      },
      readAccess: function(partyId, isCorpAdmin) {
        readAccessDeferred = $.Deferred();
        readAccess(partyId, isCorpAdmin, readAccessDeferred);
        return readAccessDeferred;
      },
      updateAccess: function(partyId, accessID, payload) {
        updateAccessDeferred = $.Deferred();
        updateAccess(partyId, accessID, payload, updateAccessDeferred);
        return updateAccessDeferred;
      },
      getNewModel: function() {
        return new Model();
      },
      createAccessClone: function(payload, partyId,isCorpAdmin) {
        createAccessCloneDeferred = $.Deferred();
        createAccessClone(payload, partyId, isCorpAdmin, createAccessCloneDeferred);
        return createAccessCloneDeferred;
      },
      deleteAccess: function(payload, partyId) {
        deleteAccessDeferred = $.Deferred();
        deleteAccess(payload, partyId, deleteAccessDeferred);
        return deleteAccessDeferred;
      },
      updateAccessClone: function(payload, partyId, isCorpAdmin) {
        updateAccessCloneDeferred = $.Deferred();
        updateAccessClone(payload, partyId, isCorpAdmin, updateAccessCloneDeferred);
        return updateAccessCloneDeferred;
      }
    };
  };
  return new ExclusionModel();
});
