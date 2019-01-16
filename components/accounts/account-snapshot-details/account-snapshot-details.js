define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/account-snapshot-details",
    "./model",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, ResourceBundle, Model) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.transactions = ko.observableArray();
        self.dataSourceForTransaction = new oj.ArrayTableDataSource(self.transactions, { idAttribute: "id" });
        self.accountDetails = rootParams.accountDetails || self.params.accountDetails;
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("page-section");
        Model.getTransactions(self.accountDetails.id.value).then(function (data) {
            ko.utils.arrayForEach(data.items, function (item) {
                item.id = item.key.transactionReferenceNumber;
            });
            self.transactions(data.items);
        });
    };
});