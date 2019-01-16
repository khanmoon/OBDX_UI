define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "ojL10n!resources/nls/account-aggregator"
], function(oj, ko, $, BaseLogger, resourceBundle) {
  "use strict";

  /**
   * return function - description
   *
   * @param  {type} rootParams description
   * @return {type}            description
   */
  return function(params) {
    var self = this;
    self.resource = resourceBundle;
    params.baseModel.registerComponent("aggregate-accounts-list", "account-aggregation");

    self.linkAccount = function () {
		params.dashboard.loadComponent("aggregate-accounts-list", {}, self);
    };


    };
});
