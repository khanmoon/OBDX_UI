define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/registration",
    "ojs/ojinputtext",
    "ojs/ojdatetimepicker",
    "ojs/ojcheckboxset",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojdialog"
], function (oj, ko, $, UserCredentialModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.response = ko.observable();
        self.nls = resourceBundle;
        self.accountEnumLoaded = ko.observable(false);
        var today = rootParams.baseModel.getDate();
        var currentYear = today.getFullYear();
        self.accountEnumList = ko.observableArray();
        rootParams.dashboard.headerName(self.nls.registration.headerName);

        self.monthEnumList = ko.observableArray([
            {
                "code": "01",
                "description": "01"
            },
            {
                "code": "02",
                "description": "02"
            },
            {
                "code": "03",
                "description": "03"
            },
            {
                "code": "04",
                "description": "04"
            },
            {
                "code": "05",
                "description": "05"
            },
            {
                "code": "06",
                "description": "06"
            },
            {
                "code": "07",
                "description": "07"
            },
            {
                "code": "08",
                "description": "08"
            },
            {
                "code": "09",
                "description": "09"
            },
            {
                "code": "10",
                "description": "10"
            },
            {
                "code": "11",
                "description": "11"
            },
            {
                "code": "12",
                "description": "12"
            }
        ]);
        self.yearEnumList = ko.observableArray([
            {
                "code": currentYear,
                "description": currentYear
            },
            {
                "code": currentYear + 1,
                "description": currentYear + 1
            },
            {
                "code": currentYear + 2,
                "description": currentYear + 2
            },
            {
                "code": currentYear + 3,
                "description": currentYear + 3
            },
            {
                "code": currentYear + 4,
                "description": currentYear + 4
            },
            {
                "code": currentYear + 5,
                "description": currentYear + 5
            }
        ]);
        rootParams.baseModel.registerElement("internal-account-input");
        rootParams.baseModel.registerComponent("otp-verification", "base-components");
        rootParams.baseModel.registerComponent("user-creation", "registration");
        rootParams.dashboard.headerName(self.nls.registration.headerName);
        self.accountType = ko.observable("CSA");
        self.accountNumber = ko.observable();
        self.userCredentials = ko.observable(true);
        self.verification = ko.observable(false);
        self.clickedCreditCard = ko.observable(false);
        self.clickedTermDeposit = ko.observable(false);
        self.clickedDemandDeposit = ko.observable(false);
        self.clickedLoanAccount = ko.observable(false);
        self.expiryMonth = ko.observable("01");
        self.expiryYear = ko.observable();
        self.invalidTracker = ko.observable();
        self.message = ko.observable();
        self.minYear = ko.observable();
        self.minMonth = ko.observable();
        self.minYear = currentYear;
        self.minMonth = 1;
        UserCredentialModel.getAccounts().done(function (data) {
            self.accountEnumList(data.enumRepresentations[0].data);
            self.accountEnumLoaded(true);
            self.clickedDemandDeposit(true);
        });
        var getNewKoModel = function () {
            var KoModel = UserCredentialModel.getNewModel();
            return KoModel;
        };
        self.payload = ko.observable(getNewKoModel());
        self.optionChangedHandler = function (event) {
            if (event.detail.value === "LON") {
                self.resetPayload();
                self.clickedLoanAccount(true);
                self.clickedTermDeposit(false);
                self.clickedCreditCard(false);
                self.clickedDemandDeposit(false);
            }
            if (event.detail.value === "CCA") {
                self.resetPayload();
                self.clickedLoanAccount(false);
                self.clickedTermDeposit(false);
                self.clickedCreditCard(true);
                self.clickedDemandDeposit(false);
            }
            if (event.detail.value === "CSA") {
                self.resetPayload();
                self.clickedLoanAccount(false);
                self.clickedTermDeposit(false);
                self.clickedCreditCard(false);
                self.clickedDemandDeposit(true);
            }
            if (event.detail.value === "TRD") {
                self.resetPayload();
                self.clickedLoanAccount(false);
                self.clickedTermDeposit(true);
                self.clickedCreditCard(false);
                self.clickedDemandDeposit(false);
            }
        };
        self.validation = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTracker())) {
                return;
            }
            if (typeof self.accountType() === "object") {
                self.payload().accountType = self.accountType()[0];
            } else {
                self.payload().accountType = self.accountType();
            }
            self.payload().accountNumber = self.accountNumber();
            if (self.clickedDemandDeposit()) {
                if (self.payload().debitCardNumber) {
                    self.payload().debitCardNumber = self.payload().debitCardNumber.replace(/\s/g, "");
                  } else {
                    rootParams.baseModel.showMessages(null, [self.nls.registration.messages.mandatoryDebitCardNumber], "ERROR");
                  }
                  if (!self.payload().debitCardPin) {
                    rootParams.baseModel.showMessages(null, [self.nls.registration.messages.mandatoryDebitPin], "ERROR");
                  }
            }
            if (self.clickedCreditCard()) {
                if (self.expiryYear()) {
                    self.expiryYear(currentYear);
                }
                var date = rootParams.baseModel.getDate();
                date.setMonth(self.expiryMonth() + 1);
                date.setYear(self.expiryYear());
                self.payload().creditCardExpiryDate = date;
                self.payload().creditCardExpiryDate = self.payload().creditCardNumber = self.payload().creditCardNumber.replace(/\s/g, "");
            }
            UserCredentialModel.createRequest(ko.toJSON(self.payload())).done(function (data) {
                self.payload().customer = true;
                self.response(data);
                if (self.response().partyVerificationResponse.verificationStatus && self.response().accountVerificationResponse.verificationStatus) {
                    if (self.clickedDemandDeposit()) {
                        if (self.response().debitCardVerificationResponse.verificationStatus && self.response().registrationDTO && self.response().registrationDTO.registrationId) {
                            self.baseURL = "registration/" + self.response().registrationDTO.registrationId;
                            self.userCredentials(false);
                            self.verification(true);
                        }
                    } else if (self.response().registrationDTO && self.response().registrationDTO.registrationId) {
                            self.baseURL = "registration/" + self.response().registrationDTO.registrationId;
                            self.userCredentials(false);
                            self.verification(true);
                        }
                }
            });
        };
        self.OtpAuthentication = function (data) {
            if (data.tokenValid) {
                rootParams.dashboard.loadComponent("user-creation", {}, self);
            }
        };
        self.cancel = function () {
            location.replace("index.html");
        };
        self.resetPayload = function () {
            self.payload().accountType = self.accountType();
            self.payload().firstName = "";
            self.payload().lastName = "";
            self.payload().emailId = "";
            self.payload().partyId = "";
            self.payload().dateOfBirth = "";
            self.payload().accountNumber = "";
            self.payload().creditCardNumber = "";
            self.payload().creditCardNameOnCard = "";
            self.payload().creditCardExpiryDate = "";
            self.payload().creditCardCVVNumber = "";
            self.payload().debitCardNumber = "";
            self.payload().debitCardPin = "";
        };
        $(document).on("keyup", "#cardNumber", function () {
            var foo = $(this).val().split(" ").join("");
            if (foo.length > 0) {
                foo = foo.match(new RegExp(".{1,4}", "g")).join(" ");
            }
            $(this).val(foo);
        });
    };
});
