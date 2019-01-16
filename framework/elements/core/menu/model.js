define(["baseService"], function(BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var MenuModel = function() {
    return {
      getMenu: function() {
        var options = {
          url: "menu"
        };
        return baseService.fetchJSON(options);
      }
    };
  };
  return new MenuModel();
});