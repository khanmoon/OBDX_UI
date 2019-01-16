define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var AuditLogModel = function() {
    var baseService = BaseService.getInstance();
    /**
     * Function to get new instance of ApplicationRolesCreateModel
     *
     * @function
     * @memberOf AuditLogModel
     * @returns Model
     */
    var fetchUsersListDeferred, fetchUsersList = function(Parameters, deferred) {
        var params = {
            "username": Parameters.username,
            "partyId": Parameters.partyId,
            "isAccessSetupCheckRequired": false,
            "userType": Parameters.userType
          },
          options = {
            url: "users?firstName={username}&userType={userType}&partyId={partyId}",
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
       * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
       * @function fetchDetails
       *
       * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
       * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
       */
      fetchDetailsDeferred, fetchDetails = function(partyId, deferred) {
        var options = {
          url: "parties?partyId=" + partyId,
          success: function(data) {
            deferred.resolve(data);
          },
          failure: function(data) {
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
       * @memberOf AuditLogModel

       * @example AuditLogModel.fetchUserGroupOptions();
       */
      fetchUserGroupOptionsDeferred, fetchUserGroupOptions = function(deferred) {
        var params = {
            "isLocal": true
          },
          options = {
            url: "enterpriseRoles?isLocal={isLocal}",
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
       * @function fetchActivities
       * @memberOf AuditLogModel

       * @example AuditLogModel.fetchActivities();
       */
      fetchActivitiesDeferred, fetchActivities = function(deferred) {

        var options = {
          url: "resourceTasks?view=list",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },

      fetchPreferencePartyDeferrred, fetchPreferenceForParty = function(partyID, deferred) {
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

      searchAuditDeferred, searchAudit = function(username, fromdateTime, todateTime, activity, partyId, action, status, referenceNo, userType, deferred) {
        var options = {
          url: "audit?userID=" + username + "&startTime=" + fromdateTime + "&endTime=" + todateTime + "&activity=" + activity + "&partyId=" + partyId + "&action=" + action + "&status=" + status + "&referenceNo=" + referenceNo + "&userType=" + userType,

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
       * This function uses baseService's fetch to GET the bank details data from defined URL as specified in the lookUpUrl variable.
       * @function fetchDetails
       *
       * @param {String} lookUpUrl - String indicating the URL with which the details are to be fetched.
       * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
       */
      fetchDetailsByNameDeferred, fetchDetailsByName = function(partyName, deferred) {
        var options = {
          url: "parties?fullName=" + partyName,
          success: function(data) {
            deferred.resolve(data);
          },
          failure: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };

    return {
      fetchDetails: function(partyId) {
        fetchDetailsDeferred = $.Deferred();
        fetchDetails(partyId, fetchDetailsDeferred);
        return fetchDetailsDeferred;
      },
      fetchUsersList: function(Parameters) {
        fetchUsersListDeferred = $.Deferred();
        fetchUsersList(Parameters, fetchUsersListDeferred);
        return fetchUsersListDeferred;
      },
      fetchDetailsByName: function(partyName) {
        fetchDetailsByNameDeferred = $.Deferred();
        fetchDetailsByName(partyName, fetchDetailsByNameDeferred);
        return fetchDetailsByNameDeferred;
      },
      fetchPreferenceForParty: function(partyID) {
        fetchPreferencePartyDeferrred = $.Deferred();
        fetchPreferenceForParty(partyID, fetchPreferencePartyDeferrred);
        return fetchPreferencePartyDeferrred;
      },
      searchAudit: function(username, fromdateTime, todateTime, activity, partyId, action, status, referenceNo, userType) {
        searchAuditDeferred = $.Deferred();
        searchAudit(username, fromdateTime, todateTime, activity, partyId, action, status, referenceNo, userType, searchAuditDeferred);
        return searchAuditDeferred;
      },
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);
        return fetchUserGroupOptionsDeferred;
      },
      fetchActivities: function() {
        fetchActivitiesDeferred = $.Deferred();
        fetchActivities(fetchActivitiesDeferred);
        return fetchActivitiesDeferred;
      }
    };
  };
  return new AuditLogModel();
});
