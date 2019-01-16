define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var PreferenceFunctionsModel = function() {
    var baseService = BaseService.getInstance();
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf PreferenceFunctionsModel~PreferenceFunctionsModel
     */
    var Model = function() {
      this.addressData = {
        postalAddress: {
          line1: "",
          line2: "",
          line3: "",
          line4: "",
          line5: "",
          line6: "",
          line7: "",
          line8: "",
          line9: "",
          line10: "",
          line11: "",
          line12: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
          branch: "",
          branchName: ""
        }
      };
      this.partyDetails = {
        party: {
          value: null,
          displayValue: null
        },
        partyName: null,
        partyDetailsFetched: null,
        partyFirstName: null,
        partyLastName: null
      };
    };
    /**
     * This function gets customer preference for party id
     * @function fetchPreferenceForParty
     * @memberOf PreferenceFunctionsModel
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
       * This function fires 'DELETE' to delete the CP of particular party ID
       * @function deleteCPforParty
       * @memberOf PreferenceFunctionsModel
       **/
      fetchdeleteCPDeferred, deleteCPforParty = function(partyId, deferred) {
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
        baseService.remove(options, params);
      },
      /**
       * This function 'GET' the party details from host of interested party ID
       * @function fetchPartyDetails
       * @memberOf PreferenceFunctionsModel
       **/
      /*fetchPartyDetailsDeferred,
      fetchPartyDetails = function (partyId, deferred) {
      	var params = {
      			"partyId": partyId
      		},
      		options = {
      			url: SERVICE_URL.URL.FETCH_PARTY_DETAILS,

      			success: function (data) {
      				deferred.resolve(data);
      			},
      			error: function (data) {
      				deferred.reject(data);
      			}
      		};
      	baseService.fetch(options, params);
      },*/
      /**
       * This function creates or updates the customer preferences of valid party Id,
       * posts updated details filled in the form as request payload
       * along with the party id ,
       * @function updateCP
       * @memberOf CreateCPModel
       **/
      updateCPDeferred, updateCP = function(partyId, payload, deferred) {
        var params = {
            "payload": payload,
            "partyId": partyId
          },
          options = {
            url: "parties/{partyId}/preferences",

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
      fetchMeDeferred, fetchMeWithPartyDeferred,
      fetchMe = function(deferred) {

        var options = {
          url: "me",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchMeWithParty = function(deferred) {

        var options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getMaxGracePeriodDeferred, getMaxGracePeriod = function(partyId, deffered) {
        var params = {
            "partyId": partyId
          },
          options = {
            url: "parties/{partyId}/preferences/config/maxGracePeriod",
            success: function(data) {
              deffered.resolve(data);
            },
            error: function(data) {
              deffered.reject(data);
            }
          };
        baseService.fetch(options, params);
      };

    return {
      fetchPreferenceForParty: function(partyID) {
        fetchPreferencePartyDeferrred = $.Deferred();
        fetchPreferenceForParty(partyID, fetchPreferencePartyDeferrred);
        return fetchPreferencePartyDeferrred;
      },
      deleteCPforParty: function(partyID) {
        fetchdeleteCPDeferred = $.Deferred();
        deleteCPforParty(partyID, fetchdeleteCPDeferred);
        return fetchdeleteCPDeferred;
      },
      getNewModel: function() {
        return new Model();
      },
      updateCP: function(partyId, payload) {
        updateCPDeferred = $.Deferred();
        updateCP(partyId, payload, updateCPDeferred);
        return updateCPDeferred;
      },
      fetchMe: function() {
        fetchMeDeferred = $.Deferred();
        fetchMe(fetchMeDeferred);
        return fetchMeDeferred;
      },
      fetchMeWithParty: function() {
        fetchMeWithPartyDeferred = $.Deferred();
        fetchMeWithParty(fetchMeWithPartyDeferred);
        return fetchMeWithPartyDeferred;
      },
      getMaxGracePeriod: function(partyId) {
        getMaxGracePeriodDeferred = $.Deferred();
        getMaxGracePeriod(partyId, getMaxGracePeriodDeferred);
        return getMaxGracePeriodDeferred;
      }
    };
  };
  return new PreferenceFunctionsModel();
});
