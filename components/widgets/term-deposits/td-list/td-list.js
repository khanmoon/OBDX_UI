define([
    "knockout",
    "jquery",
    "./model",
    "promise",

    "ojL10n!resources/nls/td-list",
    "ojs/ojfilmstrip"
], function (ko, $, MyDepositModel, promise, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.tdCards = ko.observableArray();
        self.maxCardWidth = ko.observable($(window).width() - 40);
        self.cardObject = ko.observable();
        self.dataFetched = ko.observable(false);
        self.multipleModulesPresent = ko.observable();
        self.resource = ResourceBundle;
        var activeCardCount = 0;
        rootParams.baseModel.registerElement("card");
        rootParams.baseModel.registerComponent("td-redeem", "term-deposits");
        rootParams.baseModel.registerComponent("td-details", "term-deposits");
        rootParams.baseModel.registerComponent("td-topup", "term-deposits");
        self.loadDetails = function (params) {
            rootParams.dashboard.loadComponent("td-details", params);
        };
        MyDepositModel.fetchBankConfig().then(function (data) {
            if (data.bankConfigurationDTO.moduleList.length > 1) {
                self.multipleModulesPresent(true);
            } else {
                self.multipleModulesPresent(false);
            }
            MyDepositModel.fetchAccounts().then(function(data){
              if (data && data.accounts) {
                  self.tdCards(data.accounts);
                  self.tdCards.sort(function (left, right) {
                      return left.maturityDate === right.maturityDate ? 0 : left.maturityDate < right.maturityDate ? -1 : 1;
                  });
                  if (self.tdCards()) {
                      for (var i = 0; i < self.tdCards().length; i++) {
                          if (self.tdCards()[i].status === "ACTIVE") {
                              activeCardCount++;
                          }
                      }
                      $(window).resize(function () {
                          self.maxCardWidth($(window).width() - 50);
                      });
                  }
                  if (activeCardCount > 0) {
                      self.dataFetched(true);
                  }
              }
            });
        });
    };
});
