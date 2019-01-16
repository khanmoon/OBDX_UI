define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/beta/resources/nls/card-balance-transfer",
    "ojs/ojselectcombobox",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojknockout-validation",
    "ojs/ojcheckboxset",
    "ojs/ojswitch"
], function (oj, ko, $, CardBalanceTransferModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var i = 0, getNewKoModel = function () {
                var KoModel = CardBalanceTransferModel.getNewModel();
                KoModel.transferCard.balanceTransferAmount = ko.observable("");
                KoModel.transferCard.payeeName = ko.observable(ko.utils.unwrapObservable(KoModel.transferCard.payeeName));
                KoModel.transferCard.cardId = ko.observable(ko.utils.unwrapObservable(KoModel.transferCard.cardId));
                return KoModel;
            };
        self.validationTracker = ko.observable();
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.balanceTransferFlag = ko.observable(true);
        self.cardMaxLength = ko.observable(19);
        self.transferBalance = ko.observable("OPTION_YES");
        self.dataLoaded = ko.observable(false);
        self.cardIssuerNames = ko.observableArray();
        self.promocodes = ko.observableArray();
        self.currency = rootParams.baseModel.getLocaleValue("localCurrency");
        self.transferCards = ko.observableArray();
        self.maxBalanceTransferCardsAllowed = ko.observable();
        self.usedBalanceTransferCards = ko.observable();
        self.maxBalanceTransferAmountAllowed = ko.observable();
        self.minBalanceTransferAmountAllowed = ko.observable();
        self.maxCreditLimit = ko.observable();
        self.promoCode = ko.observable();
        self.redrawCards = ko.observable(false);
        self.showAdd = ko.observable(false);
        self.tncText = self.resource.tncLine1 + "\n" + self.resource.tncLine2 + "\n" + self.resource.tncLine3;
        rootParams.baseModel.registerComponent("card-balance-transfer-input", "application-tracking");
        rootParams.baseModel.registerElement("amount-input");
        self.successHandler = function () {
            self.additionalInfoAccordion().open(3);
            self.uplTrackingDetails().additionalInfo.sections[1].isComplete(true);
        };
        self.tranferPreviousBalance = function (event, data) {
            if (data.value === "OPTION_NO") {
                self.balanceTransferFlag(false);
            }
            if (data.value === "OPTION_YES") {
                self.balanceTransferFlag(true);
            }
        };
        self.promoCode = ko.observable();
        self.initializeForm = function () {
            if (self.appDetails().balanceTransferDetails) {
                if (self.appDetails().balanceTransferDetails.transferCards[0].balanceTransferAmount > 0) {
                    self.balanceTransferFlag(true);
                    self.promoCode(self.appDetails().balanceTransferDetails.promoCode);
                    for (i = 0; i < self.usedBalanceTransferCards(); i++) {
                        self.transferCards()[i].currencyCode = self.appDetails().balanceTransferDetails.transferCards[i].currencyCode;
                        self.transferCards()[i].cardIssuerName = self.appDetails().balanceTransferDetails.transferCards[i].cardIssuerName;
                        self.transferCards()[i].cardId(self.appDetails().balanceTransferDetails.transferCards[i].cardId);
                        self.transferCards()[i].payeeName(self.appDetails().balanceTransferDetails.transferCards[i].payeeName);
                        self.transferCards()[i].balanceTransferAmount(self.appDetails().balanceTransferDetails.transferCards[i].balanceTransferAmount);
                    }
                } else {
                    self.balanceTransferFlag(false);
                    self.transferBalance("OPTION_NO");
                }
            } else {
                self.balanceTransferFlag(true);
                self.transferBalance("OPTION_YES");
            }
        };
        self.fetchIssuerNamesSuccessHandler = function (data) {
            for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.cardIssuerNames.push({
                    code: data.enumRepresentations[0].data[i].code,
                    description: data.enumRepresentations[0].data[i].description
                });
            }
            for (i = 0; i < self.offerDetails.offerDetails[0].offerAdditionalDetails.cardOfferDetails.balanceTransferAttributes.length; i++) {
                self.promocodes.push({
                    code: self.offerDetails.offerDetails[0].offerAdditionalDetails.cardOfferDetails.balanceTransferAttributes[i].balanceTransferPromoCode,
                    description: self.offerDetails.offerDetails[0].offerAdditionalDetails.cardOfferDetails.balanceTransferAttributes[i].balanceTransferPromoCode
                });
            }
            self.initializeModel();
        };
        CardBalanceTransferModel.fetchCardIssuerNames(self.fetchIssuerNamesSuccessHandler);
        self.submitFunction = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (self.balanceTransferFlag()) {
                for (i = 0; i < self.transferCards().length; i++) {
                    self.transferCards()[i].currencyCode = rootParams.baseModel.getLocaleValue("localCurrency");
                }
            } else {
                self.promoCode("");
                self.transferCards()[0].currencyCode = "";
                self.transferCards()[0].cardIssuerName = "";
                self.transferCards()[0].cardId("");
                self.transferCards()[0].payeeName("");
                self.transferCards()[0].balanceTransferAmount("");
            }
            var payload = {
                promoCode: self.promoCode(),
                transferCards: self.transferCards()
            };
            payload = ko.mapping.toJSON(payload, {
              "ignore": ["temp_isActive", "temp_maskedCardNumber", "temp_maskedNumber"]
            });
            CardBalanceTransferModel.addBalanceTransfer(self.successHandler, self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), payload);
        };
        self.initializeModel = function () {
            self.maxCreditLimit(self.offerDetails.offerDetails[0].offerAdditionalDetails.cardOfferDetails.creditCardLimitDetail[0].maximumCreditLimit);
            self.maxBalanceTransferAmountAllowed(self.offerDetails.offerDetails[0].offerAdditionalDetails.cardOfferDetails.balanceTransferAttributes[0].maximumPercentCreditLimit / 100 * self.maxCreditLimit());
            self.minBalanceTransferAmountAllowed(self.offerDetails.offerDetails[0].offerAdditionalDetails.cardOfferDetails.balanceTransferAttributes[0].minimumBalanceTransferAmount);
            self.maxBalanceTransferCardsAllowed(self.offerDetails.offerDetails[0].offerAdditionalDetails.cardOfferDetails.balanceTransferAttributes[0].maximumNumberBalanceTransfer);
            if (self.appDetails().balanceTransferDetails) {
                if (self.appDetails().balanceTransferDetails.transferCards) {
                    self.usedBalanceTransferCards(self.appDetails().balanceTransferDetails.transferCards.length);
                }
            } else {
                self.usedBalanceTransferCards(1);
            }
            for (var index = 0; index < self.usedBalanceTransferCards(); index++) {
                var card = getNewKoModel().transferCard;
                self.transferCards().push(card);
            }
            self.initializeForm();
            self.redrawCards(true);
            self.dataLoaded(true);
            if (self.usedBalanceTransferCards() < self.maxBalanceTransferCardsAllowed()) {
                self.showAdd(true);
            }
        };
        self.addCard = function () {
            self.redrawCards(false);
            self.usedBalanceTransferCards(self.usedBalanceTransferCards() + 1);
            var card = getNewKoModel().transferCard;
            self.transferCards().push(card);
            if (self.usedBalanceTransferCards() < self.maxBalanceTransferCardsAllowed()) {
                self.showAdd(true);
            } else {
                self.showAdd(false);
            }
            ko.tasks.runEarly();
            self.redrawCards(true);
        };
        self.removeCard = function (index) {
            self.redrawCards(false);
            self.usedBalanceTransferCards(self.usedBalanceTransferCards() - 1);
            self.transferCards().splice(index, 1);
            if (self.usedBalanceTransferCards() < self.maxBalanceTransferCardsAllowed()) {
                self.showAdd(true);
            } else {
                self.showAdd(false);
            }
            if (self.usedBalanceTransferCards() === 0) {
                self.balanceTransferFlag(false);
                self.transferBalance("OPTION_NO");
                self.transferCards().push(getNewKoModel().transferCard);
                self.usedBalanceTransferCards(self.usedBalanceTransferCards() + 1);
            }
            ko.tasks.runEarly();
            self.redrawCards(true);
        };
        self.showTermsAndConditions = function () {
            $("#termsAndConditions").trigger("openModal");
        };
    };
});
