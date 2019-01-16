define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for UsersCreateModel section
   *
   * @namespace UsersCreateModel code~UsersCreateModel
   * @class
   */
  var UsersCreateModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @private
     */
    var baseService = BaseService.getInstance(),
      params;
    var model = function() {
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
          partyId: null,
          partyName: null,
          partyDetailsFetched: false,
          partyFirstName: null,
          partyLastName: null,
          party: {
            value: null,
            displayValue: null
          }
        };
      },
      modelInitialized = false,
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/

      /**
       * This function fires a GET request to party details of specific party ID
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function fetchPartyDetails
       * @memberOf UsersCreateModel
       * @param {String} partyId      - String indicating the party id whose  details are to be fetched

       * @example UsersCreateModel.fetchPartyDetails(data.partyId());
       */
      fetchPartyDetailsDeferred, fetchPartyDetails = function(partyId, deferred) {
        var options = {
          url: "administration/parties/" + partyId,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      checkIfUserExistsDeferred, checkIfUserExists = function(username, deferred) {
        var options = {
          url: "users/" + username + "/exists",
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
       * This function fires a GET request to fetch the user groups options
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function fetchUserGroupOptions
       * @memberOf UsersCreateModel

       * @example UsersCreateModel.fetchUserGroupOptions();
       */
      fetchUserGroupOptionsDeferred, fetchUserGroupOptions = function(deferred) {
        var options = {
          url: "enterpriseRoles?isLocal=true",
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
       * This function fires a POST request to create user
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function createUser
       * @memberOf UsersCreateModel
       * @param {String} payload  -  indicates the form details filled by admin

       * @example UsersCreateModel.createUser(data);
       */
      createUserDeferred, createUser = function(payload, deferred) {
        var options = {
          url: "users",
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
      /**
       * This function fires a POST request to update user details
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function updateUser
       * @memberOf UsersCreateModel
       * @param {String} payload  -  indicates the form details to be updated filled by admin

       * @example UsersCreateModel.createUser(data);
       */
      updateUserDeferred, updateUser = function(payload, id, deferred) {
        var options = {
          url: "users/" + id,
          data: payload,
          success: function(payload, status, jqXhr) {
            deferred.resolve(payload, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.update(options, params);
      },
      /**
       * This function fires a GET request to get the list of user types
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function fetchUserType
       * @memberOf UsersCreateModel

       * @example UsersCreateModel.fetchUserType(data);
       */
      fetchUserTypeDeferred, fetchUserType = function(deferred) {
        var options = {
          url: "enumerations/userType",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchCountryDeferred, fetchCountry = function(deferred) {
        var options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchCityDeferred, fetchCity = function(selectedCountry, deferred) {
        var params = {
            "countryID": selectedCountry
          },
          options = {
            url: "locations/country/{countryID}/city",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchUserLimitOptionsDeferred, fetchUserLimitOptions = function(deferred, businessEntity, assignableEntitiesData) {
        var params = {
            "assignableEntitiesData": assignableEntitiesData
          },
          options = {
            url: "limitPackages?assignableEntities={assignableEntitiesData}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        if (businessEntity) {
          options.headers = {
            "X-Target-Unit": businessEntity
          };
        }
        baseService.fetch(options, params);
      },
      showPartyDetailsDeferred, showPartyDetails = function(deferred) {
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
      fetchPartyDetailsByNameDeferred, fetchPartyDetailsByName = function(deferred) {
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
      fetchChildRoleDeferred, fetchChildRole = function(enterpriseRoleId, deferred) {
        var options = {
          url: "applicationRoles?accessPointType=INT&enterpriseRole=" + enterpriseRoleId,
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
       * This function read the role preferences corresponding to the roleId
       * @params {deferred} - object to trach completion of Batch call
       * @function fetchRolePreference
       * @memberOf ExclusionModel
       **/
      fetchRolePreferenceDeferred, fetchRolePreference = function(roleId, deferred) {
        var options = {
          url: "rolePreferences/" + roleId + "/preferences",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       * This function read the party preferences
       * @params {deferred} - object to trach completion of network call
       * @function fetchPartyPreferences
       * @memberOf ExclusionModel
       **/
      fetchPartyPreferencesDeferred, fetchPartyPreferences = function(partyId, deferred) {
        var options = {
          url: "parties/" + partyId + "/preferences",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       * This function read the entities
       * @params {deferred} - object to trach completion of network call
       * @function fetchEntitites
       * @memberOf ExclusionModel
       **/
      fetchEntititesDeferred, fetchEntitites = function(deferred) {
        var options = {
          url: "entities",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchAccessDeferred, fetchAccess = function(searchParams, deferred) {
          var options = {
              url: "accessPoints?accessType={accessType}",
              success: function(data) {
                  deferred.resolve(data);
              }
          };
          baseService.fetch(options, searchParams);
      },
      fetchMeWithPartyDeferred, fetchMeWithParty = function(deferred) {

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
      };
    return {
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function() {
        return new model();
      },
      fetchPartyDetails: function(partyId) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyId, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);
        return fetchUserGroupOptionsDeferred;
      },
      createUser: function(payload) {
        createUserDeferred = $.Deferred();
        createUser(payload, createUserDeferred);
        return createUserDeferred;
      },
      updateUser: function(payload, id) {
        updateUserDeferred = $.Deferred();
        updateUser(payload, id, updateUserDeferred);
        return updateUserDeferred;
      },
      fetchUserType: function() {
        fetchUserTypeDeferred = $.Deferred();
        fetchUserType(fetchUserTypeDeferred);
        return fetchUserTypeDeferred;
      },
      fetchCountry: function() {
        fetchCountryDeferred = $.Deferred();
        fetchCountry(fetchCountryDeferred);
        return fetchCountryDeferred;
      },
      fetchCity: function(countryID) {
        fetchCityDeferred = $.Deferred();
        fetchCity(countryID, fetchCityDeferred);
        return fetchCityDeferred;
      },
      fetchUserLimitOptions: function(businessEntity, assignableEntitiesData) {
        fetchUserLimitOptionsDeferred = $.Deferred();
        fetchUserLimitOptions(fetchUserLimitOptionsDeferred, businessEntity, assignableEntitiesData);
        return fetchUserLimitOptionsDeferred;
      },
      showPartyDetails: function() {
        showPartyDetailsDeferred = $.Deferred();
        showPartyDetails(showPartyDetailsDeferred);
        return showPartyDetailsDeferred;
      },
      fetchPartyDetailsByName: function() {
        fetchPartyDetailsByNameDeferred = $.Deferred();
        fetchPartyDetailsByName(fetchPartyDetailsByNameDeferred);
        return fetchPartyDetailsByNameDeferred;
      },
      fetchChildRole: function(enterpriseRoleId) {
        fetchChildRoleDeferred = $.Deferred();
        fetchChildRole(enterpriseRoleId, fetchChildRoleDeferred);
        return fetchChildRoleDeferred;
      },
      fetchRolePreference: function(roleId) {
        fetchRolePreferenceDeferred = $.Deferred();
        fetchRolePreference(roleId, fetchRolePreferenceDeferred);
        return fetchRolePreferenceDeferred;
      },
      fetchPartyPreferences: function(partyId) {
        fetchPartyPreferencesDeferred = $.Deferred();
        fetchPartyPreferences(partyId, fetchPartyPreferencesDeferred);
        return fetchPartyPreferencesDeferred;
      },
      checkIfUserExists: function(username) {
        checkIfUserExistsDeferred = $.Deferred();
        checkIfUserExists(username, checkIfUserExistsDeferred);
        return checkIfUserExistsDeferred;
      },
      fetchEntitites: function() {
        fetchEntititesDeferred = $.Deferred();
        fetchEntitites(fetchEntititesDeferred);
        return fetchEntititesDeferred;
      },
      fetchMeWithParty: function() {
        fetchMeWithPartyDeferred = $.Deferred();
        fetchMeWithParty(fetchMeWithPartyDeferred);
        return fetchMeWithPartyDeferred;
      },
      fetchAccess: function(searchParams) {
          fetchAccessDeferred = $.Deferred();
          fetchAccess(searchParams, fetchAccessDeferred);
          return fetchAccessDeferred;
      }
    };
  };
  return new UsersCreateModel();
});
