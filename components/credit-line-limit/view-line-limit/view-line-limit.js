define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/view-line-limit",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojtable"
], function (oj, ko, $, ViewLineLimitModel, locale) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;
        self.dataSource = ko.observable();
        self.partyName = ko.observable();
        self.subLineLimitList = ko.observableArray();
        params.dashboard.headerName(self.resourceBundle.heading.lineLimit);
        if (self.params.lineLimitDetails) {
            self.headerDetails = self.params.lineLimitDetails.header;
            var sublineList = self.params.lineLimitDetails.sublineList;
            ViewLineLimitModel.fetchPartyDetails(self.headerDetails.partyId.value).done(function (data) {
                self.partyName(data.party.personalDetails.fullName);
            });
            for (var i = 0; i < sublineList.length; i++) {
                self.subLineLimitList.push({
                    referenceNo: sublineList[i].referenceNo,
                    partyId: sublineList[i].partyId.displayValue,
                    lineId: sublineList[i].productDescription,
                    maturityDate: sublineList[i].maturityDate ? params.baseModel.formatDate(sublineList[i].maturityDate) : sublineList[i].maturityDate,
                    currency: sublineList[i].currencyCode,
                    amountUtilized: sublineList[i].amountUtilized ? params.baseModel.formatCurrency(sublineList[i].amountUtilized.amount, sublineList[i].amountUtilized.currency) : sublineList[i].amountUtilized,
                    amountUtilizedCcy: sublineList[i].amountUtilizedCcy ? params.baseModel.formatCurrency(sublineList[i].amountUtilizedCcy.amount, sublineList[i].amountUtilizedCcy.currency) : sublineList[i].amountUtilizedCcy
                });
            }
        }
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.subLineLimitList(), { idAttribute: "referenceNo" })));
        self.goBack = function () {
            history.back();
        };
    };
});