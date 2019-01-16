define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /* Extending predefined baseService to get ajax functions. */
  var baseService = BaseService.getInstance();

  var MiniMailboxModel = function() {
    return {
      getNotifications: function() {
        var options = {
          url: "mailbox/mailers"
        };
        return baseService.fetch(options);

      },
      getMailCount: function() {
        var options = {
          url: "mailbox/count",
          selfLoader: true
        };
        return baseService.fetch(options);

      }
    };
  };
  return new MiniMailboxModel();
});
