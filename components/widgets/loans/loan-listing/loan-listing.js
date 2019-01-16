define([
    "knockout",
    "jquery",
    "promise",
    "./model",
    "ojL10n!resources/nls/loan-listing",
    "ojs/ojfilmstrip"
], function (ko, $, promise, LoanListingModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        self.dataFetched = ko.observable(false);
        self.loansCards = ko.observableArray();
        self.maxCardWidth = ko.observable(window.innerWidth - 40);
        self.currentNavArrowPlacement = ko.observable("adjacent");
        self.currentNavArrowVisibility = ko.observable("auto");
        rootParams.baseModel.registerElement("card");
        rootParams.baseModel.registerComponent("loan-details", "loans");
        LoanListingModel.fetchLoans().then(function (data) {
          if (data && data.accounts) {
              self.loansCards.push(data.accounts);
              self.loansCards.sort(function (left, right) {
                  return left.outstandingAmount.amount === right.outstandingAmount.amount ? 0 : left.outstandingAmount.amount > right.outstandingAmount.amount ? -1 : 1;
              });
              self.dataFetched(true);
          }
        });
        $(window).resize(function () {
            self.maxCardWidth(window.innerWidth - 40);
        });
    };
});
