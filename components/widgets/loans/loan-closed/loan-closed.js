define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/loan-closed"
], function (ko, $, LoansClosedModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        var numberCount = 0;
        self.locale = locale;
        LoansClosedModel.fetchClosedLoans().then(function(data){
          if (data && data.accounts) {
            numberCount = data.accounts.length;
          }
        });

        self.count = ko.observable(numberCount);
        self.cardData = {
            title: self.locale.closedLoans.closed_title,
            linkText: self.locale.closedLoans.closed_viewall,
            description: self.locale.closedLoans.closed_description
        };
        self.image = "loans/closed-loans.svg";
        rootParams.baseModel.registerElement("object-card");
        rootParams.baseModel.registerComponent("loan-closed-listing", "loans");
        self.showClosedLoans = function (a, b, c) {
            if (self.count() !== 0) {
                rootParams.dashboard.loadComponent(a, b, c);
            }
        };
    };
});
