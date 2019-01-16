define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var accountNicknameModel = function() {
    var baseService = BaseService.getInstance(),
      Model = function() {
        this.AccountNickname = {
          "accountNicknameDTOs": [{
            "accountNickname": null,
            "accountNumber": null,
            "partyId": null,
            "accountType": null
          }]
        };
      };
    var accountNicknameDeferred, accountNickname = function(data, deferred) {
      var options = {
        url: "accountNickname",
        data: data,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };
      baseService.add(options);
    };
    return {
      accountNickname: function(data) {
        accountNicknameDeferred = $.Deferred();
        accountNickname(data, accountNicknameDeferred);
        return accountNicknameDeferred;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new accountNicknameModel();
});