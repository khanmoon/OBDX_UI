define([
  "jquery", "framework/js/constants/constants",
  "baseService"
], function ($, Constants, BaseService) {
  "use strict";
  var pendingApprovalList = function () {
    var baseService = BaseService.getInstance();
    var getCountForApprovalDeferred, getCountForApproval = function (roleType, deferred) {
      var params = {
          "roleType": roleType
        },
        options = {
          url: "transactions/count?countFor=approval&roleType={roleType}",
          success: function (data) {
            deferred.resolve(data);
          }
        };
      baseService.fetch(options, params);
    };
    var getTransactionDataDeferred, getTransactionData = function (deferred, discriminator) {
      var options = {
          url: "transactions?view={view}&discriminator={discriminator}&roleType={roleType}",
          success: function (data) {
            deferred.resolve(data);
          }
        },
        params = {
          "discriminator": discriminator,
          "view": "approval",
          "roleType": Constants.userSegment === "ADMIN" ? "A" : Constants.userSegment === "CORPADMIN" ? "PA" : "P"
        };
      baseService.fetch(options, params);
    };
    return {
      getCountForApproval: function (roleType) {
        getCountForApprovalDeferred = $.Deferred();
        getCountForApproval(roleType, getCountForApprovalDeferred);
        return getCountForApprovalDeferred;
      },
      getTransactionData: function (discriminator) {
        getTransactionDataDeferred = $.Deferred();
        getTransactionData(getTransactionDataDeferred, discriminator);
        return getTransactionDataDeferred;
      }
    };
  };
  return new pendingApprovalList();
});