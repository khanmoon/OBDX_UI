define([
  "jquery",
  "baseService",
  "framework/js/constants/constants"
], function($, BaseService, Constants) {
  "use strict";
  var baseService = BaseService.getInstance();
  var MiniMailboxModel = function() {
    return {
      getMails: function() {
        var options = {
          url: "mailbox/mails?msgFlag=T"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/corporateDashboard/pending-for-action/pending-for-action-mailbox";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);

      },
      getAlerts: function() {
        var options = {
          url: "mailbox/alerts"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/corporateDashboard/pending-for-action/pending-for-action-mailbox-alerts";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);

      },
      getNotifications: function() {
        var options = {
          url: "mailbox/mailers"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/corporateDashboard/notification/notification-mailers";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);

      }
    };
  };
  return new MiniMailboxModel();
});
