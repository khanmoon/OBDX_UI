define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!resources/nls/application-fees-view"
], function (oj, ko, $, ApplicationFeesViewModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.feesSummary = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.collectionTypeLoaded = ko.observable(false);
        self.sumAmount = ko.observable();
        self.currency = ko.observable("");
        self.feeCollectionTypeList = ko.observable([]);
        self.bankFees = ko.observable();
        self.applicationFees = ko.observable([]);
        self.feesConfigured = ko.observable(false);
        ApplicationFeesViewModel.fetchFundingTable(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentSubmissionId()).done(function (data) {
            self.bankFees(data);
            if (!$.isEmptyObject(self.bankFees().fees)) {
                var total = 0;
                for (var i = 0; i < self.bankFees().fees.length; i++) {
                    self.applicationFees()[i] = {
                        feeType: ko.observable(self.bankFees().fees[i].collectionType),
                        amount: ko.observable(rootParams.baseModel.formatCurrency(self.bankFees().fees[i].amount.amount, self.bankFees().fees[i].amount.currency))
                    };
                    total = total + self.bankFees().fees[i].amount.amount;
                }
                self.sumAmount(rootParams.baseModel.formatCurrency(total, self.bankFees().fees[0].amount.currency));
                self.feesConfigured(true);
                self.dataLoaded(true);
            }
        });
        self.getIndex = function (obj, key) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].fundingItemType === key) {
                    return i;
                }
            }
        };
    };
});