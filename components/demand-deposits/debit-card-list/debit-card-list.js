define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/debit-card-list",
    "ojs/ojfilmstrip",
    "ojs/ojswitch"
], function (ko, $, DebitCardModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.accountNumber = ko.observable();
        self.currentCardNo = ko.observable();
        self.accountId = ko.observable();
        self.cardStatusFlag = ko.observable();
        self.accountAdditionalDetails = ko.observable();
        self.debitDataFetched = ko.observable(false);
        self.debitData = ko.observable([]);
        self.viewDetailsData = ko.observable(self);
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        rootParams.dashboard.headerName(self.locale.header.debitCards);
        rootParams.baseModel.registerComponent("debit-card-apply", "demand-deposits");
        rootParams.baseModel.registerComponent("debit-card-details", "demand-deposits");
        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        rootParams.baseModel.registerComponent("debit-card", "demand-deposits");
        rootParams.baseModel.registerComponent("debit-card-hotlisting", "demand-deposits");
        rootParams.baseModel.registerElement("account-input");
        if (self.params.id) {
            self.accountNumber(self.params.id.value);
        }
        self.accountsParser = function (data) {
            var tempData = data;
            if (tempData.accounts) {
                var filteredAccounts = tempData.accounts.filter(function (account) {
                    return account.productDTO.demandDepositProductFacilitiesDTO.hasATMFacility;
                });
                tempData.accounts = filteredAccounts;
            }
            return tempData;
        };
        self.showSwitchValue = function (data, index, event, obj) {
            if (obj.option === "value" && obj.optionMetadata.writeback === "shouldWrite") {
                self.currentCardNo(data.cardNo.value);
                self.accountId(data.accountId.value);
                $("#blockCard").trigger("openModal");
            }
        };
        self.callDebitCardInfo = function () {
            if (self.accountNumber()) {
                self.debitData([]);
                DebitCardModel.fetchDebitCardInfo(self.accountNumber()).done(function (data) {
                    self.debitData(data.debitCardDetails);
                    self.debitDataFetched(true);
                });
            }
        };
        if (rootParams.baseModel.small()) {
            if (self.accountList && self.accountList.length > 0) {
                self.callDebitCardInfo();
            } else {
                self.callDebitCardInfo();
            }
        } else {
            self.callDebitCardInfo();
        }
        self.accountNumber.subscribe(function () {
            self.callDebitCardInfo();
        });
    };
});