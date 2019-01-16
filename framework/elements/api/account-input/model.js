define([
  "framework/js/constants/constants",
  "baseService"
], function (Constants, BaseService) {
  "use strict";
  /**
   * This file contains all the REST services APIs for the account-input component.
   *
   * @class AccountDetailsModel
   * @extends BaseService {@link BaseService}
   * @property {Object} baseService - baseService instance through which all the rest calls will be made.
   * @version Revision
   */
  var AccountDetailsModel = function () {
    var baseService = BaseService.getInstance();
    return {
      fetchAccountData: function (type, taskCode) {
        return Constants.userSegment === "ADMIN" ? baseService.fetchJSON({
          url: "design-dashboard/data/accounts/demand-deposit"
        }) : baseService.fetch({
          url: "accounts/" + type + ((type.indexOf("?") > -1) ? "&taskCode={taskCode}&status=ACTIVE&status=DORMANT" : "?taskCode={taskCode}&status=ACTIVE&status=DORMANT")
        }, {
          taskCode: taskCode
        });
      },
      fetchBankAddress: function (bankCode) {
        return baseService.fetch({
          url: "locations/branches?branchCode={bankCode}"
        }, {
          bankCode: bankCode
        });
      }
    };
  };
  return new AccountDetailsModel();
});