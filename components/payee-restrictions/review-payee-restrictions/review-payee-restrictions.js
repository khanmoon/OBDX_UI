define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/payee-restrictions-landing",
    "promise",
    "ojs/ojinputnumber",
    "ojs/ojknockout-validation",
    "ojs/ojbutton"
], function (oj, ko, $, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this, j = 1;
        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle.resource;
        self.persistedData = self.params.data ? self.params.data.payeeCountLimitList() : self.params.payeeCountLimitList();
        self.sortedData = ko.observable();
        self.searchResultLoaded = ko.observable(false);
        Params.baseModel.registerElement("action-header");
        self.internal = {
            payeeType: "",
            accountPayee: [],
            draftpayee: []
        };
        self.international = {
            payeeType: "",
            accountPayee: [],
            draftpayee: []
        };
        self.domestic = {
            payeeType: "",
            accountPayee: [],
            draftpayee: []
        };
        self.allTypes = {
            payeeType: "",
            accountPayee: [],
            draftpayee: []
        };
        for (var i = 0; i < self.persistedData.length; i++) {
            var payeeType = self.persistedData[i].payeeType();
            self.responseElement = {};
            self.responseElement.payeeType = payeeType;
            self.responseElement.payeesPerDay = self.persistedData[i].payeesPerDay();
            self.responseElement.payeeCountLimitStatus = self.persistedData[i].payeeCountLimitStatus() ? "Y" : "N";
            switch (payeeType) {
            case "ALL":
                self.allTypes.payeeType = payeeType;
                self.allTypes.accountPayee = [self.responseElement];
                self.allTypes.draftpayee = [];
                break;
            case "INTERNAL":
                self.internal.payeeType = payeeType;
                self.internal.accountPayee = [self.responseElement];
                self.internal.draftpayee = [];
                break;
            case "INTERNATIONAL":
                self.international.payeeType = payeeType;
                self.international.accountPayee = [self.responseElement];
                break;
            case "INTERNATIONALDEMANDDRAFT":
                self.international.payeeType = "INTERNATIONAL";
                self.international.draftpayee = [self.responseElement];
                break;
            case "INDIADOMESTICIMPS":
            case "INDIADOMESTICNEFT":
            case "INDIADOMESTICRTGS":
            case "UKDOMESTICFASTER":
            case "UKDOMESTICNONFASTER":
            case "SEPADOMESTICCARDTRANSFER":
            case "SEPADOMESTICCREDITTRANSFER":
                if (self.domestic.accountPayee.length > 0) {
                    self.domestic.accountPayee[j++] = self.responseElement;
                } else {
                    self.domestic.payeeType = "DOMESTIC";
                    self.domestic.accountPayee = [self.responseElement];
                }
                break;
            case "DOMESTICDEMANDDRAFT":
                self.domestic.payeeType = "DOMESTIC";
                self.domestic.draftpayee = [self.responseElement];
                break;
            default:
                break;
            }
        }
        self.searchResult = [
            self.allTypes,
            self.internal,
            self.domestic,
            self.international
        ];
        self.searchResultLoaded(true);
    };
});