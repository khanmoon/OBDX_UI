define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "base-models/validations/obdx-locale",
    "ojL10n!resources/nls/gateway",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojoffcanvas",
    "ojs/ojbutton",
    "ojs/ojpopup",
    "ojs/ojlistview",
    "ojs/ojtabs",
    "ojs/ojconveyorbelt",
    "ojs/ojradioset",
    "ojs/ojknockout-validation",
    "ojs/ojselectcombobox"
], function (oj, ko, $, BaseLogger, validator, ResourceBundle) {
    "use strict";
    return function viewModel(params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.componentId = ko.observable();
        self.isRequired = ko.observable();
        self.wallet = ResourceBundle.wallet;
        self.cvvcc = ko.observable("");
        self.cvvdc = ko.observable("");
        self.validationTracker = ko.observable();
        self.accountHolderNamecc = ko.observable();
        self.cardNumcc = ko.observable("");
        self.accountHolderNamedc = ko.observable();
        self.cardNumdc = ko.observable("");
        self.monthdc = ko.observable();
        self.yeardc = ko.observable();
        self.isCredit = ko.observable(false);
        self.isDebit = ko.observable(false);
        self.monthcc = ko.observable();
        self.yearcc = ko.observable();
        this.val = ko.observableArray([self.wallet.origination.placeholder.month]);
        this.val1 = ko.observableArray([self.wallet.origination.placeholder.year]);
        this.val2 = ko.observableArray([self.wallet.origination.placeholder.selectbank]);
        self.dataLoaded = ko.observable(false);
        self.mobileNumber = ko.observable();
        self.emailId = ko.observable();
        self.amount = ko.observable();
        self.txnCurrency = ko.observable();
        self.transactionReferenceNo = ko.observable();
        self.returnURL = ko.observable();
        self.tabChangehandler = function (event) {
            if (event.detail.value === "credit") {
                self.isCredit(true);
                self.isDebit(false);
            } else if (event.detail.value === "debit") {
                self.isDebit(true);
                self.isCredit(false);
            }
            self.dataLoaded(false);
            self.cardNumcc("");
            self.cvvcc("");
            self.monthcc(null);
            self.accountHolderNamecc("");
            self.cardNumdc("");
            self.cvvdc("");
            self.monthdc(null);
            self.accountHolderNamedc("");
            self.dataLoaded(true);
        };
        self.setComponent = function () {
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            var f = document.createElement("form");
            f.setAttribute("method", "get");
            f.setAttribute("action", self.returnURL());
            var i = document.createElement("input");
            i.setAttribute("type", "hidden");
            i.setAttribute("name", "transactionStatus");
            i.setAttribute("value", "SUCCESSFUL");
            f.appendChild(i);
            i = document.createElement("input");
            i.setAttribute("type", "hidden");
            i.setAttribute("name", "bankReferenceNo");
            i.setAttribute("value", self.bankReferenceNo());
            f.appendChild(i);
            i = document.createElement("input");
            i.setAttribute("type", "hidden");
            i.setAttribute("name", "transactionReferenceNo");
            i.setAttribute("value", self.transactionReferenceNo());
            f.appendChild(i);
            document.body.appendChild(f);
            f.submit();
        };
        self.merchantCode = ko.observable("FirstMerchant");
        self.successStaticFlag = ko.observable("yes");
        self.failureStaticFlag = ko.observable("yes");
        self.transactionDate = ko.observable("20150101000000");
        self.accNoRequestFlag = ko.observable("yes");
        self.merchantAccountNumber = ko.observable("AT4005723019");
        self.serviceCharges = ko.observable("0");
        self.checksumValue = ko.observable(0);
        self.initiateOAT = function () {
            var form = $("<form method='POST' action='http://obdxappbah:7777/digx/v1/payments/transfers/merchantTransferData' enctype='application/x-www-form-urlencoded'></form>");
            form.append("<input type=\"hidden\" name=\"merchantCode\" value=\"" + self.merchantCode() + "\">");
            form.append("<input type=\"hidden\" name=\"failureStaticFlag\" value=\"" + self.failureStaticFlag() + "\">");
            form.append("<input type=\"hidden\" name=\"userAccountNumber\" value=\"" + self.merchantAccountNumber() + "\">");
            form.append("<input type=\"hidden\" name=\"accNoRequestFlag\" value=\"" + self.accNoRequestFlag() + "\">");
            form.append("<input type=\"hidden\" name=\"successStaticFlag\" value=\"" + self.successStaticFlag() + "\">");
            form.append("<input type=\"hidden\" name=\"transactionAmt\" value=\"" + self.amount() + "\">");
            form.append("<input type=\"hidden\" name=\"merchantRefNumber\" value=\"" + self.transactionReferenceNo() + "\">");
            form.append("<input type=\"hidden\" name=\"serviceCharges\" value=\"" + self.serviceCharges() + "\">");
            form.append("<input type=\"hidden\" name=\"checksumValue\" value=\"" + self.checksumValue() + "\">");
            form.append("<input type=\"hidden\" name=\"txnCurrency\" value=\"" + self.txnCurrency() + "\">");
            $("body").append(form);
            form.submit();
        };
        self.month = ko.observableArray([
            {
                "code": "01",
                "description": "JAN"
            },
            {
                "code": "02",
                "description": "FEB"
            },
            {
                "code": "03",
                "description": "MAR"
            },
            {
                "code": "04",
                "description": "APR"
            },
            {
                "code": "05",
                "description": "MAY"
            },
            {
                "code": "06",
                "description": "JUN"
            },
            {
                "code": "07",
                "description": "JUL"
            },
            {
                "code": "08",
                "description": "AUG"
            },
            {
                "code": "09",
                "description": "SEP"
            },
            {
                "code": "10",
                "description": "OCT"
            },
            {
                "code": "11",
                "description": "NOV"
            },
            {
                "code": "12",
                "description": "DEC"
            }
        ]);
        self.year = ko.observableArray();
        self.currentYear = params.baseModel.getDate().toJSON().slice(0, 4);
        for (var i = 0; i < 10; i++) {
            self.year().push({
                "code": parseInt(self.currentYear) + parseInt(i),
                "description": parseInt(self.currentYear) + parseInt(i)
            });
        }
        function chkRegex(regex, str) {
            var patt = new RegExp(regex);
            return patt.test(str);
        }
        self.validateUsername = {
            validate: function () {
                if (self.showPayee() || !self.payeeNotSelected()) {
                    return true;
                }
                if (isNaN(self.walletPayee())) {
                    if (!chkRegex(decodeURIComponent(validator.validationMessages.EMAIL[0].options.pattern), self.walletPayee())) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString("messages.wallet.invalidemail"));
                    }
                    self.transactionDetails.emailId = self.walletPayee();
                    self.transactionDetails.transferMode = "EMAIL";
                } else {
                    if (!chkRegex(decodeURIComponent(validator.validationMessages.MOBILE_NO[0].options.pattern), self.walletPayee())) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString("messages.wallet.invalidmobile"));
                    }
                    self.transactionDetails.mobileNo = self.walletPayee();
                    self.transactionDetails.transferMode = "MOBILE";
                }
                return true;
            }
        };
        self.validateCardNumber = {
            validate: function () {
                if (isNaN(self.cardNumcc())) {
                    if (!chkRegex(decodeURIComponent(validator.validationMessages.CARD_NUMBER[0].options.pattern), self.cardNum())) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString("messages.wallet.invalidcardnum"));
                    }
                }
                if (isNaN(self.cardNumdc())) {
                    if (!chkRegex(decodeURIComponent(validator.validationMessages.CARD_NUMBER[0].options.pattern), self.cardNum())) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString("messages.wallet.invalidcardnum"));
                    }
                }
                return true;
            }
        };
        this.currentEdge = ko.observable("top");
        self.validateCVV = {
            validate: function () {
                if (isNaN(self.cvvcc())) {
                    if (!chkRegex(decodeURIComponent(validator.validationMessages.CVV[0].options.pattern), self.cvv())) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString("messages.wallet.invalidcvv"));
                    }
                }
                if (isNaN(self.cvvdc())) {
                    if (!chkRegex(decodeURIComponent(validator.validationMessages.CVV[0].options.pattern), self.cvv())) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString("messages.wallet.invalidcvv"));
                    }
                }
                return true;
            }
        };
        this.optionChangedHandler = function (event) {
            if (event.detail.value) {
                var value = event.detail.value;
                if (value !== $("#vtabs").ojTabs("option", "edge"))
                    $("#vtabs").ojTabs("option", "edge", value);
            }
        };
    };
});