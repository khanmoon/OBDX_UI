define(["baseService"], function(BaseService) {
  "use strict";
  var AccontSnapshotModel = function() {
    var baseService = BaseService.getInstance();
    return {
      getDeviceCount: function() {
        var options = {
          url: "mobileClient/registeredPushToken"
        };
        return baseService.fetch(options);
      },
      unregisterDevices: function(osType) {
        var options = {
          url: "mobileClient/pushToken/os/{osType}"
        };
        return baseService.remove(options, {
          "osType": osType
        });
      }
    };
  };
  return new AccontSnapshotModel();
});
