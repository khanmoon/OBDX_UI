define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/trade-instruments",
    "ojs/ojselectcombobox",
    "ojs/ojnavigationlist",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, tradeInstrumentsModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        var instruments;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.selectedItem = ko.observable();
        self.display = ko.observable("all");
        self.edge = ko.observable("start");
        self.tradeDetails = ko.observableArray();
        self.details = ko.observableArray();
        self.dataLoaded = ko.observable(false);
        self.dateFilter = ko.observable(10);

        function getDetails(element) {
            self.details.removeAll();
            if (element && element.length) {
                for (var i = 0; i < element.length && i < 5; i++) {
                    self.details.push({
                        amount: rootParams.baseModel.formatCurrency(element[i].amount.amount, element[i].amount.currency),
                        expiryDate: rootParams.baseModel.formatDate(element[i].expiryDate),
                        referenceNo: element[i].referenceNo
                    });
                }
            }
        }

        function setData(data) {
            instruments = data;
            self.tradeDetails.push({
                count: data.importLCCount,
                amount: rootParams.baseModel.formatCurrency(data.importLCTotalAmount.amount, data.importLCTotalAmount.currency),
                id: "import",
                label: self.nls.tempradeInstrumentsDetails.labels.importLC
            }, {
                count: data.exportLCCount,
                amount: rootParams.baseModel.formatCurrency(data.exportLCTotalAmount.amount, data.exportLCTotalAmount.currency),
                id: "export",
                label: self.nls.tempradeInstrumentsDetails.labels.exportLC
            }, {
                count: data.bankGuaranteeCount,
                amount: rootParams.baseModel.formatCurrency(data.bankGuaranteeTotalAmount.amount, data.bankGuaranteeTotalAmount.currency),
                id: "guarantee",
                label: self.nls.tempradeInstrumentsDetails.labels.outwardGuarantee
            });
            self.selectedItem("import");
            self.dataLoaded(true);
        }

        function fetchData(expiryDate) {
            self.dataLoaded(false);
            self.details.removeAll();
            self.tradeDetails.removeAll();
            self.selectedItem(null);
                tradeInstrumentsModel.fetchTradeInstruments(expiryDate).then(function (data) {
                    setData(data);
                });
        }
        self.selectedItem.subscribe(function (value) {
            switch (value) {
                case "import":
                    getDetails(instruments.importLetterOfCreditDTOs);
                    break;
                case "export":
                    getDetails(instruments.exportLetterOfCreditDTOs);
                    break;
                case "guarantee":
                    getDetails(instruments.bankGuaranteeDTOs);
                    break;
                default:
            }
        });
        self.dateFilter.subscribe(function (value) {
            var currentDate = rootParams.baseModel.getDate();
            currentDate.setDate(currentDate.getDate() + parseInt(value));
            fetchData(oj.IntlConverterUtils.dateToLocalIso(currentDate));
        });

        self.dateFilter("10");
    };
});
