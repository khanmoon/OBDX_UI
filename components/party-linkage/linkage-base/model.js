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
        party: party

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
            url: "parties/{partyId}/relations",

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
      fetchMeDeferred, fetchMe = function(deferred) {

        var options = {
          url: "me",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchMeWithPartyNameDeferred, fetchMeWithPartyName = function(deferred) {

        var options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchLinkagesForPartyCorpDeferred, fetchLinkagesForPartyCorp = function(deferred) {
        var options = {
          url: "me/party/relations",
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
      fetchPreferenceForParty: function(partyId) {
        fetchPreferencePartyDeferrred = $.Deferred();
        fetchPreferenceForParty(partyId, fetchPreferencePartyDeferrred);
        return fetchPreferencePartyDeferrred;
      },
      init: function() {
        var modelInitialized = true;
        return modelInitialized;
      },
      fetchLinkagesForParty: function(batchData) {
        fetchLinkagesForPartyDeferred = $.Deferred();
        fetchLinkagesForParty(batchData, fetchLinkagesForPartyDeferred);
        return fetchLinkagesForPartyDeferred;
      },
      fetchMe: function() {
        fetchMeDeferred = $.Deferred();
        fetchMe(fetchMeDeferred);
        return fetchMeDeferred;
      },
      fetchMeWithPartyName: function() {
        fetchMeWithPartyNameDeferred = $.Deferred();
        fetchMeWithPartyName(fetchMeWithPartyNameDeferred);
        return fetchMeWithPartyNameDeferred;
      },
      fetchLinkagesForPartyCorp: function() {
        fetchLinkagesForPartyCorpDeferred = $.Deferred();
        fetchLinkagesForPartyCorp(fetchLinkagesForPartyCorpDeferred);
        return fetchLinkagesForPartyCorpDeferred;
      }
    };
  };
  return new LinkageModel();
});