define(["baseService"], function(BaseService) {
  "use strict";
  var AlternateLogin = function() {
    var baseService = BaseService.getInstance();
    return {
      session: function() {
        return baseService.add({
          url:"session",
          method: "POST",
          data:""
        });
      }
    };
  };
  return new AlternateLogin();
});
