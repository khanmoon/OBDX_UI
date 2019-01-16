define([
  "baseService"
], function(BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var Model = function() {
    return {
      getData: function() {
        var options = {
          url: "docked-menu-items"
        };
        return baseService.fetchJSON(options);
      }
    };
  };
  return new Model();
});
