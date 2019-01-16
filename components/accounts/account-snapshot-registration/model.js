define(["baseService"], function(BaseService) {
  "use strict";
  var AccontSnapshotRegistrationModel = function() {
    var baseService = BaseService.getInstance();
    return {
      getMePreference: function() {
           var options = {
            url: "me/preferences"
            };
         return baseService.fetch(options);
       },
       updateMePreference: function(payload) {
         var options = {
           data: payload,
           url: "me/preferences"
         };
         return baseService.update(options);
      }
    };
  };
  return new AccontSnapshotRegistrationModel();
});
