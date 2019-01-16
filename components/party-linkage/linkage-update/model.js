define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var LinkageModel = function() {
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

      var party = {};

      party.value = "";
      party.displayValue = "";

      this.partyDetails = {
        partyId: "",
        userType: "",
        partyName: "",
        partyDetailsFetched: false,
        partyFirstName: "",
        partyLastName: "",
        additionalDetails: "",
        party: party,
        partyIdDisplay: "",
        relatedPartyIdDisplay: "",
        relatedPartyId: ""
      };

    };

    /**
     * This function gets list of associated users for party
     * @params {partyID} - partyID for preference needs to be fetched
     * @function fetchLinkagesForParty
     * @memberOf ExclusionModel
     **/
    var fetchLinkagesForPartyDeferred, fetchLinkagesForParty = function(partyID, deferred) {
      var params = {
          "partyId": partyID
        },
        options = {

          url: "P2plinkage/PartyToPartyRelations",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
      baseService.fetchJSON(options, params);

    };
    /**
     * This function gets list of associated users for party
     * @params {partyId} - partyId for preference needs to be fetched
     * @function readPartyToPartyAccountSetup
     * @memberOf ExclusionModel
     **/
    var readPartyToPartyAccountSetupDeferred, readPartyToPartyAccountSetup = function(partyId, relatedPartyId, deferred) {
        var params = {
            "partyId": partyId
          },
          options = {

            url: "parties/" + partyId + "/relations/accountAccess/" + relatedPartyId,
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
       * This function gets customer preference for party id
       * @function fetchPreferenceForParty
       * @memberOf PreferenceFunctionsModel
       **/
      fetchPreferencePartyDeferrred, fetchPreferenceForParty = function(partyId, deferred) {
        var params = {
            "partyId": partyId
          },
          options = {
            showMessage: false,
            url: "parties/{partyId}/preferences",
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
      getNewModel: function() {
        return new Model();
      },
      fetchLinkagesForParty: function(batchData) {
        fetchLinkagesForPartyDeferred = $.Deferred();
        fetchLinkagesForParty(batchData, fetchLinkagesForPartyDeferred);
        return fetchLinkagesForPartyDeferred;
      },
      readPartyToPartyAccountSetup: function(partyId, relatedPartyId) {
        readPartyToPartyAccountSetupDeferred = $.Deferred();
        readPartyToPartyAccountSetup(partyId, relatedPartyId, readPartyToPartyAccountSetupDeferred);
        return readPartyToPartyAccountSetupDeferred;
      },
      fetchPreferenceForParty: function(partyId) {
        fetchPreferencePartyDeferrred = $.Deferred();
        fetchPreferenceForParty(partyId, fetchPreferencePartyDeferrred);
        return fetchPreferencePartyDeferrred;
      }
    };
  };
  return new LinkageModel();
});