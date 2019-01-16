define([
  "jquery",
  "baseService",
  "framework/js/constants/constants"
], function ($, BaseService, Constants) {
  "use strict";
  var pendingApprovalList = function () {
    var baseService = BaseService.getInstance();
    return {
      getCountForApproval: function (roleType) {
        if(Constants.userSegment === "ADMIN"){
          return baseService.fetchJSON({
            url: "design-dashboard/data/corporateDashboard/latest-pending-approvals/latest-pending-approvals"
          });
        }
          return baseService.fetch({
            url: "transactions/count?countFor=approval&roleType={roleType}"
          }, {
            "roleType": roleType
          });


      },
      getTransactionData: function (discriminator, rejectPromise) {
        return new Promise(function (resolve, reject) {
          if (rejectPromise) rejectPromise.call(reject, null);
          if(Constants.userSegment === "ADMIN"){
            return baseService.fetchJSON({
              url: "design-dashboard/data/corporateDashboard/latest-pending-approvals/transactionList"
            });
          }
            baseService.fetch({
              url: "transactions?view=approval&discriminator={discriminator}"
            }, {
              "discriminator": discriminator
            }).then(resolve, reject);

        });
      }
    };
  };
  return new pendingApprovalList();
});
