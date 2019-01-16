define(["baseService"], function(BaseService) {
  "use strict";
  var AccontSnapshotModel = function() {
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
      },
      getDemandDeposits: function() {
        var options = {
          url: "accounts/demandDeposit"
        };
        return baseService.fetch(options);
      },
      deleteSession: function() {
        return new Promise(function(resolve, reject) {
          baseService.remove({
            url: "session"
          }).then(function() {
            baseService.invalidateNonce();
            resolve();
          }, function() {
            reject();
          });
        });
      }
    };
  };
  return new AccontSnapshotModel();
});
