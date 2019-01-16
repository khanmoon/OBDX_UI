define([
    "baseService"
  ], function(BaseService) {
    "use strict";
    var baseService = BaseService.getInstance();
    var Model = function() {
      return {
        fetchUserData: function() {
          return baseService.fetch({
            url: "me"
          });
        },
        fetchBankConfig: function() {
          return baseService.fetch({
            url: "bankConfiguration",
            showMessage : false
          });
        },
        fetchEntities: function() {
          return baseService.fetch({
            url: "entities"
          });
        }
      };
    };
    return new Model();
  });
