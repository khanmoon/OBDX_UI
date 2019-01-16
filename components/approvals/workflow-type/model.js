define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ApprovalNavBarModel = function() {
    var baseService = BaseService.getInstance();
    var Model = function() {
        this.approvals = {
          "partyFirstName": null,
          "partyLastName": null,
          "userType": "CUSTOMER",
          "partyName": null,
          "partyDetailsFetched": false,
          "additionalDetails": "",
          "userTypeLabel": "",
          "party": {
            "value": "",
            "displayValue": ""
          }

        };
      },
      fetchUserGroupSearchListDeferred, fetchUserGroupSearchList = function(deferred, userType, partyId, userGroupName, userId) {
        userType = "CUSTOMER";
        var options = {
          url: "userGroups?partyId=" + partyId + "&userGroupName=" + userGroupName + "&userId=" + userId + "&userGroupType=" + userType,
          selfLoader: false,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
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
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      fetchUserGroupSearchList: function(userType, partyId, userGroupName, userId) {
        fetchUserGroupSearchListDeferred = $.Deferred();
        fetchUserGroupSearchList(fetchUserGroupSearchListDeferred, userType, partyId, userGroupName, userId);
        return fetchUserGroupSearchListDeferred;
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
      }

    };
  };
  return new ApprovalNavBarModel();
});