/**
 * New Reccuring Deposit Booking.
 *
 * @module recurring-deposit
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} ResourceBundle
 */
define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/review-create-rd",
  "ojs/ojbutton"
], function(oj, ko, $, ResourceBundle) {
  "use strict";
  /** New Reccuring Deposit Booking.
   *
   *It allows user review all the details entered to book Recurring Deposit.
   * @param {object} rootParams  An object which contains contect of dashboard and param values
   * @return {function} function
   * @return {object} getNewKoModel
   *
   */
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.createRDModel = self.params.createRDModel;
    self.primaryAccHolder=self.params.primaryAccHolder;
    self.parties =self.params.parties;
    self.resource = ResourceBundle;
    rootParams.baseModel.registerElement(["page-section", "row", "confirm-screen"]);
    rootParams.baseModel.registerComponent("review-add-edit-nominee","nominee");
    rootParams.dashboard.headerName(self.resource.header.newRecurringDeposit);
    self.component = ko.observable("review-add-edit-nominee");
    /**
     * This function is used set tenure of Recurring Deposit .
     *
     * @memberOf review-create-rd
     * @function formatTenure
     * @returns {void}
     */
    self.formatTenure = function() {
      var year, month;
      if (self.createRDModel.tenure.years() <= 1)
        year = rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.year, {
          n: self.createRDModel.tenure.years()
        });
      else
        year = rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.year, {
          n: self.createRDModel.tenure.years()
        });
      if (self.createRDModel.tenure.months() <= 1)
        month = rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.month, {
          n: self.createRDModel.tenure.months()
        });
      else
        month = rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.month, {
          n: self.createRDModel.tenure.months()
        });

      return rootParams.baseModel.format(self.resource.depositDetail.tenureDetail, {
        years: year,
        months: month
      });
    };
};
});
