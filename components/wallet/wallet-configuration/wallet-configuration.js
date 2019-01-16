define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/wallet-configuration",
    "ojs/ojknockout",
    "ojs/ojdatetimepicker",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset",
    "ojs/ojpopup",
    "ojs/ojknockout-validation"
], function (oj, ko, $, WalletModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this, i = 0, getNewKoModel = function () {
                var KoModel = WalletModel.getNewModel();
                KoModel.configModel.configOfferDTO = ko.mapping.fromJS(KoModel.configModel.configOfferDTO);
                KoModel.configModel.configLimitsDTO = ko.mapping.fromJS(KoModel.configModel.configLimitsDTO);
                KoModel.configModel.configGLDTO[0].ledgerCode = rootParams.baseModel.checkAndBindObservable(KoModel.configModel.configGLDTO[0].ledgerCode);
                KoModel.configModel.configGLDTO[1].ledgerCode = rootParams.baseModel.checkAndBindObservable(KoModel.configModel.configGLDTO[1].ledgerCode);
                KoModel.configModel.configGLDTO[2].ledgerCode = rootParams.baseModel.checkAndBindObservable(KoModel.configModel.configGLDTO[2].ledgerCode);
                KoModel.configModel.configGLDTO[3].ledgerCode = rootParams.baseModel.checkAndBindObservable(KoModel.configModel.configGLDTO[3].ledgerCode);
                KoModel.configModel.configGLDTO[4].ledgerCode = rootParams.baseModel.checkAndBindObservable(KoModel.configModel.configGLDTO[4].ledgerCode);
                KoModel.configModel.configGLDTO[0].ledgerDescription = self.wallet.ledgerDescription.accountgl;
                KoModel.configModel.configGLDTO[1].ledgerDescription = self.wallet.ledgerDescription.profitlossgl;
                KoModel.configModel.configGLDTO[2].ledgerDescription = self.wallet.ledgerDescription.intermediarygl;
                KoModel.configModel.configGLDTO[3].ledgerDescription = self.wallet.ledgerDescription.liabilityreportinggl;
                KoModel.configModel.configGLDTO[4].ledgerDescription = self.wallet.ledgerDescription.assetreportinggl;
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.configResponseList = ko.observable();
        self.wallet = ResourceBundle.wallet;
        self.Offerexists = ko.observable(false);
        self.loadTemplate = ko.observable(false);
        self.templateName = ko.observable("");
        self.isEditable = ko.observable(false);
        self.isConfirm = ko.observable(false);
        self.stageOne = ko.observable(false);
        self.stageTwo = ko.observable(false);
        self.currency = ko.observableArray();
        self.selectedCurrency = ko.observable();
        self.day0Details = ko.observableArray([]);
        self.validationTracker = ko.observable();
        rootParams.dashboard.backAllowed(true);
        self.details = new getNewKoModel();
        self.addDisabled = ko.observable(true);
        self.editDisabled = ko.observable(true);
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("amount-input");
        self.viewSelected = ko.observable(true);
        self.addSelected = ko.observable(false);
        self.editSelected = ko.observable(false);
        self.showOk = ko.observable(false);
        self.showBody = ko.observable(true);
        self.showProfile = ko.observable(false);
        self.selectedScreen = ko.observable("view");
        self.heading = ko.observable(self.wallet.configaration.header);
        WalletModel.init();
        WalletModel.readWalletConfigarations().done(function (data) {
            self.configResponseList(data.configResponseList);
            for (i = 0; i < self.configResponseList().length; i++) {
                if (self.configResponseList()[i].propertyId === "WALLET_OFFER_CODE" && parseInt(self.configResponseList()[i].propertyValue) !== 0) {
                    self.Offerexists(true);
                }
            }
            if (self.Offerexists()) {
                self.loadAllProperties(self.configResponseList());
            }
        });
        self.getDayZeroConfig = function () {
            WalletModel.fetchday0().done(function (data) {
                self.day0Details(data);
                self.details.configModel.configOfferDTO.productGroupId(self.day0Details().productGroupId);
                self.details.configModel.configOfferDTO.productId(self.day0Details().productCode);
            });
        };
        self.create = function () {
            self.templateName("wallet/create-configuration");
            self.getDayZeroConfig();
            self.loadTemplate(true);
            self.stageOne(true);
            self.stageTwo(false);
        };
        self.viewOfferDetails = function () {
            location.hash = "viewdetails";
            self.getDayZeroConfig();
            self.templateName("wallet/modify-configuration");
            self.stageOne(true);
            self.stageTwo(false);
            self.editDisabled(true);
            self.isEditable(false);
            self.isConfirm(false);
            self.loadTemplate(true);
        };
        self.cancel = function () {
            if (self.isEditable()) {
                self.editDisabled(true);
                self.isEditable(false);
            } else if (self.isConfirm()) {
                self.editDisabled(false);
                self.isConfirm(false);
            } else {
                self.editDisabled(true);
                self.isEditable(false);
                self.isConfirm(false);
                self.loadTemplate(false);
            }
            history.back();
        };
        self.edit = function () {
            location.hash = "edit";
            self.editDisabled(false);
            self.isEditable(true);
            self.isConfirm(false);
        };
        self.add = function () {
            self.details.configModel.configOfferDTO.offerCurrency(self.selectedCurrency());
            self.details.configModel.configLimitsDTO.balanceLimit.currency(self.selectedCurrency());
            self.details.configModel.configLimitsDTO.dailyDebitLimit.currency(self.selectedCurrency());
            self.details.configModel.configLimitsDTO.dailyCreditLimit.currency(self.selectedCurrency());
            WalletModel.fireDigXPropertyUpdater(ko.toJSON(self.details.configModel), self.day0Details()).done(function () {
                self.stageOne(false);
                self.stageTwo(true);
            });
        };
        self.modify = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            location.hash = "modify";
            self.editDisabled(true);
            self.isEditable(false);
            self.isConfirm(true);
        };
        self.confirm = function () {
            location.hash = "confirm";
            self.details.configModel.configGLDTO = null;
            self.details.configModel.configOfferDTO = null;
            WalletModel.fireDigXPropertyUpdater(ko.toJSON(self.details.configModel), self.day0Details()).done(function () {
                self.stageOne(false);
                self.stageTwo(true);
                rootParams.dashboard.backAllowed(false);
            });
        };
        self.loadAllProperties = function (configData) {
            for (i = 0; i < configData.length; i++) {
                if (configData[i].propertyId === "WALLET_OFFER_CODE") {
                    self.details.configModel.configOfferDTO.offerCode(configData[i].propertyValue);
                } else if (configData[i].propertyId === "WALLET_CURRENCY") {
                    self.selectedCurrency(configData[i].propertyValue);
                    self.details.configModel.configOfferDTO.offerCurrency(self.selectedCurrency());
                    self.details.configModel.configLimitsDTO.balanceLimit.currency(self.selectedCurrency());
                    self.details.configModel.configLimitsDTO.dailyDebitLimit.currency(self.selectedCurrency());
                    self.details.configModel.configLimitsDTO.dailyCreditLimit.currency(self.selectedCurrency());
                } else if (configData[i].propertyId === "WALLET_OFFER_NAME") {
                    self.details.configModel.configOfferDTO.offerName(configData[i].propertyValue);
                } else if (configData[i].propertyId === "WALLET_BALANCE_LIMIT") {
                    self.details.configModel.configLimitsDTO.balanceLimit.amount(configData[i].propertyValue);
                } else if (configData[i].propertyId === "WALLET_DEBIT_LIMIT") {
                    self.details.configModel.configLimitsDTO.dailyDebitLimit.amount(configData[i].propertyValue);
                } else if (configData[i].propertyId === "WALLET_CREDIT_LIMIT") {
                    self.details.configModel.configLimitsDTO.dailyCreditLimit.amount(configData[i].propertyValue);
                } else if (configData[i].propertyId === "WALLET_GL_CODE") {
                    self.details.configModel.configGLDTO[0].ledgerCode(configData[i].propertyValue);
                } else if (configData[i].propertyId === "INTERMEDIATE_GL_CODE_RECEIVE") {
                    self.details.configModel.configGLDTO[1].ledgerCode(configData[i].propertyValue);
                } else if (configData[i].propertyId === "INTERMEDIATE_GL_CODE_TRANSFER") {
                    self.details.configModel.configGLDTO[2].ledgerCode(configData[i].propertyValue);
                } else if (configData[i].propertyId === "NODE_GL_CODE_LIABILITY") {
                    self.details.configModel.configGLDTO[3].ledgerCode(configData[i].propertyValue);
                } else if (configData[i].propertyId === "NODE_GL_CODE_ASSETS") {
                    self.details.configModel.configGLDTO[4].ledgerCode(configData[i].propertyValue);
                }
            }
        };
    };
});