define([
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/wallet-external",
    "ojs/ojfilmstrip",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojdatetimepicker"
], function (ko, $, WalletAddFundModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(WalletAddFundModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.merchantPayment = getNewKoModel().merchantPaymentModel;
        self.wallet = ResourceBundle.wallet;
        self.merchantCode = ko.observable(self.wallet.merchant.code);
        self.successStaticFlag = ko.observable(null);
        self.failureStaticFlag = ko.observable(null);
        self.transactionDate = ko.observable(null);
        self.accNoRequestFlag = ko.observable(null);
        self.merchantAccountNumber = ko.observable(null);
        self.merchantRefNumber = ko.observable(null);
        self.transactionAmt = ko.observable("123");
        self.serviceCharges = ko.observable(0);
        self.checksumValue = ko.observable(null);
        self.txnCurrency = ko.observable("GBP");
        rootParams.baseModel.registerElement("page-section");
        self.isLoaded = ko.observable(false);
        WalletAddFundModel.init();
        self.submitMerchantData = function () {
            var form = $("<form method='POST' action='@@OBDX_BASE_PATH/payments/transfers/merchantTransferData' enctype='application/x-www-form-urlencoded'></form>");
            form.append("<input type=\"hidden\" name=\"merchantCode\" value=\"" + self.merchantCode() + "\">");
            form.append("<input type=\"hidden\" name=\"failureStaticFlag\" value=\"" + self.failureStaticFlag() + "\">");
            form.append("<input type=\"hidden\" name=\"userAccountNumber\" value=\"" + self.merchantAccountNumber() + "\">");
            form.append("<input type=\"hidden\" name=\"accNoRequestFlag\" value=\"" + self.accNoRequestFlag() + "\">");
            form.append("<input type=\"hidden\" name=\"successStaticFlag\" value=\"" + self.successStaticFlag() + "\">");
            form.append("<input type=\"hidden\" name=\"transactionAmt\" value=\"" + self.transactionAmt() + "\">");
            form.append("<input type=\"hidden\" name=\"merchantRefNumber\" value=\"" + self.merchantRefNumber() + "\">");
            form.append("<input type=\"hidden\" name=\"serviceCharges\" value=\"" + self.serviceCharges() + "\">");
            form.append("<input type=\"hidden\" name=\"checksumValue\" value=\"" + self.checksumValue() + "\">");
            form.append("<input type=\"hidden\" name=\"txnCurrency\" value=\"" + self.txnCurrency() + "\">");
            $("body").append(form);
            form.submit();
        };
    };
});