define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var EditMailerModel = function() {
    var Model = function() {
        this.mailersModel = {
          "code": null,
          "messageType": null,
          "subject": null,
          "messageBody": null,
          "description": null,
          "recipients": [],
          "activationDate": null
        };
      },
      baseService = BaseService.getInstance(),

      listEnterpriseRolesDeferred, listEnterpriseRoles = function(deferred) {
        var options = {
          url: "enterpriseRoles?isLocal=true",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchUsersListDeferred, fetchUsersList = function(userId, deferred) {
        var options = {
          url: "users?userId={userId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchPartyListDeferred, fetchPartyList = function(partyId, deferred) {
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
      };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      listEnterpriseRoles: function() {
        listEnterpriseRolesDeferred = $.Deferred();
        listEnterpriseRoles(listEnterpriseRolesDeferred);
        return listEnterpriseRolesDeferred;
      },
      fetchPartyList: function(partyId) {
        fetchPartyListDeferred = $.Deferred();
        fetchPartyList(partyId, fetchPartyListDeferred);
        return fetchPartyListDeferred;
      },
      fetchUsersList: function(userId) {
        fetchUsersListDeferred = $.Deferred();
        fetchUsersList(userId, fetchUsersListDeferred);
        return fetchUsersListDeferred;
      }
    };

  };
  return new EditMailerModel();
});