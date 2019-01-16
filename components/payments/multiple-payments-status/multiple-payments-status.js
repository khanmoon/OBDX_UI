define([
    "ojs/ojcore",
    "knockout",

    "ojL10n!resources/nls/multiple-payments-status",
    "./model",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojarraydataprovider",
    "ojs/ojtable",
    "ojs/ojbutton"
], function (oj, ko, ResourceBundle, Model, Constants) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle;
        Params.dashboard.headerName(Params.baseModel.small() ? self.resource.headerSmall : self.resource.header);
        self.statusDataSource = new oj.ArrayDataProvider(self.params.statusData);
        self.userSegment = Constants.userSegment;
        self.isSuccessful = ko.observable(false);
        for (var i = 0; i < self.statusDataSource.data.length; i++) {
            if (self.statusDataSource.data[i].isSuccess)
                self.isSuccessful(true);
        }
        self.firstFailedPayment = ko.utils.arrayFirst(self.params.statusData, function (element) {
            return !element.isSuccess;
        });
        self.firstSuccessfulPayment = ko.utils.arrayFirst(self.params.statusData, function (element) {
            return element.isSuccess;
        });
        self.downloadAllEreceipts = function () {
            ko.utils.arrayForEach(self.params.statusData, function (data) {
                if (data.isSuccess)
                    Model.downloadEreceipt(data.response.status.referenceNumber);
            });
        };
        self.downloadEreceipt = function (transactionRefNumber) {
            Model.downloadEreceipt(transactionRefNumber);
        };
    };
});