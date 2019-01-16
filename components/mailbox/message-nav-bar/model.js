define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /* Extending predefined baseService to get ajax functions. */
  var baseService = BaseService.getInstance();

  var MiniMailboxModel = function() {
    var getMailsDeferred, getMails = function(deferred) {
        var options = {
          url: "mailbox/mails?&msgFlag=T",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getAlertsDeferred, getAlerts = function(deferred) {
        var options = {
          url: "mailbox/alerts",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getNotificationsDeferred, getNotifications = function(deferred) {
        var options = {
          url: "mailbox/mailers",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getMails: function() {
        getMailsDeferred = $.Deferred();
        getMails(getMailsDeferred);
        return getMailsDeferred;
      },
      getAlerts: function() {
        getAlertsDeferred = $.Deferred();
        getAlerts(getAlertsDeferred);
        return getAlertsDeferred;
      },
      getNotifications: function() {
        getNotificationsDeferred = $.Deferred();
        getNotifications(getNotificationsDeferred);
        return getNotificationsDeferred;
      }
    };
  };
  return new MiniMailboxModel();
});