define([
  "baseService"
], function(BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var Model = function() {
    return {
      getBranch: function() {
        var options = {
          url: "locations/country/all/city/all/branchCode"
        };
        return baseService.fetch(options);
      }
    };
  };
  return new Model();
});
