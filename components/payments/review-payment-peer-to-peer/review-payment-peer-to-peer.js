define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/review-payment-peer-to-peer",
    "ojs/ojknockout"
], function (oj, ko, $, P2PModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.dataLoaded = ko.observable(false);
        self.p2ppaymentData = ko.observable();
        self.facebookDataLoaded = ko.observable(false);
        rootParams.dashboard.headerName(self.params.header);
        self.confirmScreenDetails = rootParams.rootModel.confirmScreenDetails;
        P2PModel.readP2P(self.params.paymentId).done(function (data) {
            self.p2ppaymentData(data);
            self.dataLoaded(true);
            var confirmScreenDetailsArray = [
                [
                    {
                        label: self.resource.payvia,
                        value: data.transferMode
                    },
                    {
                        label: self.resource.transferto,
                        value: data.transferValue
                    }
                ],
                [
                    {
                        label: self.resource.amount,
                        value: rootParams.baseModel.formatCurrency(data.transferDetails.amount.amount, data.transferDetails.amount.currency)
                    },
                    {
                        label: self.resource.transferfrom,
                        value: data.transferDetails.debitAccountId.displayValue
                    }
                ]
            ];
            if (self.shareMessage) {
                self.shareMessage(rootParams.baseModel.format(self.shareMessage(), {
                    amount: rootParams.baseModel.formatCurrency(data.transferDetails.amount.amount, data.transferDetails.amount.currency),
                    transferTo: data.transferValue,
                    valueDate: rootParams.baseModel.formatDate(data.transferDetails.valueDate)
                }));
            }
            if (typeof self.confirmScreenDetails === "function")
                self.confirmScreenDetails(confirmScreenDetailsArray);
        });
        self.loadFriendList = function (response) {
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].id === self.p2ppaymentData().transferValue) {
                    self.p2ppaymentData().transferValue = response.data[i].name;
                    self.confirmScreenDetails()[0][1].value = response.data[i].name;
                    break;
                }
            }
            self.facebookDataLoaded(true);
        };
    };
});