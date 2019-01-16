define(["baseService"], function(BaseService) {
  "use strict";
  var AccontSnapshotModel = function() {
    var baseService = BaseService.getInstance();
    return {
      missedCallBankingAndSMSBanking: function(payload) {
        var options = {
          url: "smsbanking/pinRegistration",
          data: payload
        };
        return baseService.update(options);
      },
      smsbankingpinRegistrationRead: function() {
        var options = {
          url: "smsbanking/pinRegistration"
        };
        return baseService.fetch(options);
      }
    };
  };
  return new AccontSnapshotModel();
});
