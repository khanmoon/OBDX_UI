define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/loan-closed-listing",
    "ojs/ojfilmstrip",
    "ojs/ojmasonrylayout"
], function (ko, $, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.closedAccounts = ko.observable(rootParams.rootModel.dataToBePassed());
        var countNumber = 0;
        self.locale = locale;
        self.displayFlag = ko.observable(false);
        self.closedLoanCards = ko.observableArray();
        self.maxCardWidth = ko.observable(window.innerWidth - 40);
        rootParams.baseModel.setwebhelpID("loans-closed");
        for (var i = 0; i < self.closedAccounts().accounts.length; i++) {
            if (self.closedAccounts().accounts[i].status === "CLOSED") {
                countNumber += 1;
                self.closedLoanCards.push({
                    approvedAmount: self.closedAccounts().accounts[i].approvedAmount,
                    currencyCode: self.closedAccounts().accounts[i].currencyCode,
                    disbursedAmount: self.closedAccounts().accounts[i].disbursedAmount,
                    id: self.closedAccounts().accounts[i].id,
                    interestRate: self.closedAccounts().accounts[i].interestRate,
                    maturityDate: self.closedAccounts().accounts[i].maturityDate,
                    numberOfInstallment: self.closedAccounts().accounts[i].numberOfInstallment,
                    openingDate: self.closedAccounts().accounts[i].openingDate,
                    outstandingAmount: self.closedAccounts().accounts[i].outstandingAmount,
                    partyId: self.closedAccounts().accounts[i].partyId,
                    partyName: self.closedAccounts().accounts[i].partyName,
                    productDTO: self.closedAccounts().accounts[i].productDTO,
                    status: self.closedAccounts().accounts[i].status,
                    type: self.closedAccounts().accounts[i].type
                });
            }
        }
        if (countNumber !== 0) {
            self.displayFlag(true);
        }
        self.currentNavArrowPlacement = ko.observable("adjacent");
        self.currentNavArrowVisibility = ko.observable("auto");
        self.count = ko.observable(countNumber);
        rootParams.baseModel.registerElement("object-card");
        rootParams.baseModel.registerComponent("loan-details", "loans");
        $(window).resize(function () {
            self.maxCardWidth(window.innerWidth - 40);
        });
    };
});