define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/transaction-summary-report",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox"
], function (oj, ko, $, transactionSummaryModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle.transactionSummary;
        self.validationTracker = rootParams.validationTracker;
        self.accountBranchList = ko.observable();
        self.accountMap = {};
        self.isAccountListLoaded = ko.observable(false);
        self.accountList = ko.observableArray();
        transactionSummaryModel.fetchAccounts().done(function (data) {
            self.accountList(data.accounts);
              if(data.accounts.length === 0){
                rootParams.baseModel.showMessages(null, [self.Nls.noAccount], "ERROR");
              }
            for (var i = 0; i < data.accounts.length; i++) {
                self.accountMap[data.accounts[i].id.value] = data.accounts[i].id.displayValue;
            }

            self.isAccountListLoaded(true);
        });
        self.onAccountNumberSelected = function (event) {
            self.reportGenerationPayload.accountId(event.detail.value);
            if (event.detail.value) {
                $("#accountDisplayNumber").val(self.accountMap[event.detail.value]);
            }
        };
        self.fromDateChanged = function (event) {
            if (event.detail.value) {
                var fromDate = new Date(event.detail.value);
                fromDate.setHours(0);
                fromDate.setMinutes(0);
                var toDate = new Date(event.detail.value);
                toDate.setHours(23);
                toDate.setMinutes(59);
                toDate.setDate(fromDate.getDate() + 180);
                if (toDate > new Date(self.today))
                    toDate = new Date(self.today);
                $("#tDt").ojInputDate("option", "min", oj.IntlConverterUtils.dateToLocalIso(fromDate));
                $("#tDt").ojInputDate("option", "max", oj.IntlConverterUtils.dateToLocalIso(toDate));
            }
        };
    };
});