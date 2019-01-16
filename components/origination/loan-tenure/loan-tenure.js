define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "ojL10n!resources/nls/loan-tenure",
  "ojs/ojinputtext"
], function(oj, ko, $, resourceBundle) {
  "use strict";

  return function(params) {
    var self = this,
      i = 0;
    ko.utils.extend(self, params);
    self.resource = resourceBundle;
    /* in case of amount is changes, automatically format amount.
     * and keep an unformatted copy in self.unformattedAmount.
     */
    self.optionYears = ko.observableArray([]);
    self.optionMonths = ko.observableArray([]);
    for (i = 0; i <= self.maxVal; i++) {
      self.optionYears.push({
        label: i,
        value: i.toString()
      });
    }
    for (i = 0; i <= 11; i++) {
      self.optionMonths.push({
        label: i,
        value: i.toString()
      });
    }
    self.validateTenure = {
      validate: function() {
        var parseYear = parseInt(self.tenureYears(), 10),
          years = isNaN(parseYear) ? 0 : parseYear,
          parseMonths = parseInt(self.tenureMonths(), 10),
          months = isNaN(parseMonths) ? 0 : parseMonths,
          validateMe = years + months;
        self.tenureMonths(months.toString());
        self.tenureYears(years.toString());
        if (isNaN(validateMe) || validateMe === 0) {
          throw new Error(self.resource.messages.loanTenure);
        }
      }
    };
  };
});
