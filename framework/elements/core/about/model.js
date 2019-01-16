define([
  "baseService"
], function(BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var Model = function() {
    return {
      getAbout: function() {
        var options = {
          url: "../about"
        };
        return baseService.fetchJSON(options);
      }
    };
  };
  return new Model();
});
