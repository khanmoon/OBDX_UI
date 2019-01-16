define(["baseService"], function(BaseService) {
  "use strict";
  var AccontSnapshotModel = function() {
    var baseService = BaseService.getInstance();
    return {
      getPreference: function() {
        var options = {
          url: "me/preferences?userID"
        };
        return baseService.fetch(options);
      },
      updatePreference: function(payload) {
        var options = {
          data: payload,
          url: "me/preferences"
        };
        return baseService.update(options);
      }
    };
  };
  return new AccontSnapshotModel();
});
