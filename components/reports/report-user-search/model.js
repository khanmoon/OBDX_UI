define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reportUserSearchModel = function() {
    var
      baseService = BaseService.getInstance(),
      listUsersDeferred, listUsers = function(deferred, URL) {
        var options = {
          url: URL,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      listMappedUsersDeferred, listMappedUsers = function(deferred, partyId) {
        var options = {
            url: "reports/reportDefinition/userReportMappings?partyId={partyId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "partyId": partyId
          };
        baseService.fetch(options, params);
      },
      fetchMeDeferred, fetchMeWithPartyDeferred, fetchMe = function(deferred) {

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
      listUsers: function(URL) {
        listUsersDeferred = $.Deferred();
        listUsers(listUsersDeferred, URL);
        return listUsersDeferred;
      },
      listMappedUsers: function(partyId) {
        listMappedUsersDeferred = $.Deferred();
        listMappedUsers(listMappedUsersDeferred, partyId);
        return listMappedUsersDeferred;
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
  return new reportUserSearchModel();
});