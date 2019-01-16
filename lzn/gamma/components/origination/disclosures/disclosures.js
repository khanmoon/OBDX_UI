define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!lzn/gamma/resources/nls/disclosures",
    "ojL10n!lzn/gamma/resources/nls/federal-info-disclosure",
    "baseLogger",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, DisclosuresModel, resourceBundle, federalResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.federalResource = federalResourceBundle;
        self.disclosuresLoaded = ko.observable(false);
        var federalTruthArray = [
            {
                annualPercentageRate: self.federalResource.theCreditCost,
                financeCharge: self.federalResource.theCreditDollarAmount,
                amountFinanced: self.federalResource.creditAmount,
                totalOfPayments: self.federalResource.paidAmount
            },
            {
                annualPercentageRate: rootParams.baseModel.format(self.federalResource.aprPer, { percentage: String.fromCharCode(self.resource.generic.common.percentageAscii) }),
                financeCharge: rootParams.baseModel.format(self.federalResource.dollarCost, { dollar: String.fromCharCode(self.resource.generic.common.dollarAscii) }),
                amountFinanced: rootParams.baseModel.format(self.federalResource.loanAmountDollar, { dollar: String.fromCharCode(self.resource.generic.common.dollarAscii) }),
                totalOfPayments: rootParams.baseModel.format(self.federalResource.totalDue, { dollar: String.fromCharCode(self.resource.generic.common.dollarAscii) })
            }
        ];
        self.dataSource = new oj.ArrayTableDataSource(federalTruthArray);
        DisclosuresModel.getDisclosures(self.productDetails().submissionId.value, self.applicantDetails()[0].applicantId().value).done(function (data) {
            if (!self.productDetails().disclosures) {
                self.productDetails().disclosures = {};
            }
            self.productDetails().disclosures.documentsList = data.documentsList;
            for (var i = 0; i < data.documentsList.length; i++) {
                if (data.documentsList[i].disclosureCode === "LOANACCOUNTAGREEMENT") {
                    self.productDetails().disclosures.accountDocRefId = data.documentsList[i].referenceId;
                    self.productDetails().disclosures.accountAgreementValue = data.documentsList[i].description;
                    self.productDetails().disclosures.accountAgreementIndex = i;
                    self.productDetails().disclosures.contentIdLoanAccountAgreement = data.documentsList[i].id;
                } else if (data.documentsList[i].disclosureCode === "ESIGNDISCLOSURE") {
                    self.productDetails().disclosures.eSignDocRefId = data.documentsList[i].referenceId;
                    self.productDetails().disclosures.eSignValue = data.documentsList[i].description;
                    self.productDetails().disclosures.eSignIndex = i;
                    self.productDetails().disclosures.contentIdEsign = data.documentsList[i].id;
                } else if (data.documentsList[i].disclosureCode === "PRIVACYPOLICY") {
                    self.productDetails().disclosures.privacyDocRefId = data.documentsList[i].referenceId;
                    self.productDetails().disclosures.privacyValue = data.documentsList[i].description;
                    self.productDetails().disclosures.privacyValueIndex = i;
                    self.productDetails().disclosures.contentIdPrivacyDoc = data.documentsList[i].id;
                }
            }
            self.productDetails().disclosures.wireless = "WIRELESS";
            self.productDetails().disclosures.acceptAll = "ACCEPTALL";
            self.disclosuresLoaded(true);
        });
    };
});