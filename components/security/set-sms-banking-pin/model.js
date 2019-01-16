define(["baseService"], function(BaseService) {
  "use strict";
  var AccontSnapshotModel = function() {
    var baseService = BaseService.getInstance();
    return {
      smsbankingpinRegistration: function(payload) {
        var options = {
          url: "smsbanking/pinRegistration",
          data: payload
        };
        return baseService.update(options);
      }
    };
  };
  return new AccontSnapshotModel();
});
