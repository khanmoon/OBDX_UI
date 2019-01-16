define([
    "knockout",
    "jquery",
    "./model",
    "framework/js/constants/constants",
    "ojL10n!resources/nls/account-nickname",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojvalidationgroup"
], function (ko, $, AccountNicknameModel, Constants, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.module = ko.observable(rootParams.module);
        self.constants = Constants;
        self.locale = locale;
        self.groupValid = ko.observable();
        self.validationTracker = ko.observable();
        self.parameters = rootParams.params;
        if (rootParams.userSegment && rootParams.userSegment === "CORP") {
            self.isCorpSegment = ko.observable(true);
        } else {
            self.isCorpSegment = ko.observable(false);
        }
        if (self.module() === "credit-cards") {
            self.displayName = ko.observable(self.parameters.creditCard.ownerName);
            self.displayValue = ko.observable(self.parameters.creditCard.creditCard.displayValue);
        } else {
            self.displayName = ko.observable(self.parameters.partyName);
            self.displayValue = ko.observable(self.parameters.id.displayValue);
        }
        var getNewKoModel = function () {
            var KoModel = AccountNicknameModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        if (rootParams.editable) {
            self.nicknameEditable = ko.observable(true);
        } else {
            self.nicknameEditable = ko.observable(false);
        }
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.accountNicknameDetails = self.rootModelInstance().AccountNickname;
        self.nickname = ko.observable();
        self.nicknameFromInput = ko.observable();
        if (self.parameters.accountNickname) {
            self.nickname(self.parameters.accountNickname);
            self.hasAccountNickname = ko.observable(true);
        } else if (self.parameters.creditCard && self.parameters.creditCard.cardNickname) {
            self.nickname(self.parameters.creditCard.cardNickname);
            self.hasAccountNickname = ko.observable(true);
        } else {
            self.hasAccountNickname = ko.observable(false);
        }
        self.showNicknameInput = ko.observable(false);
        self.addNickname = function () {
            self.showNicknameInput(true);
        };
        self.editNickname = function () {
            self.nicknameFromInput(self.nickname());
            self.showNicknameInput(true);
        };
        self.deleteNickname = function () {
            self.accountNicknameDetails = self.rootModelInstance().AccountNickname;
            self.accountNicknameDetails.accountNicknameDTOs()[0].accountNickname("");
            if (self.module() !== "credit-cards") {
                self.accountNicknameDetails.accountNicknameDTOs()[0].partyId(self.parameters.partyId.value);
                self.accountNicknameDetails.accountNicknameDTOs()[0].accountNumber(self.parameters.id.value);
                self.accountNicknameDetails.accountNicknameDTOs()[0].accountType(self.parameters.type);
            } else {
                self.accountNicknameDetails.accountNicknameDTOs()[0].partyId(self.parameters.associatedParty.value);
                self.accountNicknameDetails.accountNicknameDTOs()[0].accountNumber(self.parameters.creditCard.creditCard.value);
                self.accountNicknameDetails.accountNicknameDTOs()[0].accountType("CCA");
            }
            AccountNicknameModel.accountNickname(ko.mapping.toJSON(self.accountNicknameDetails)).done(function (data, status) {
                if (status === "success") {
                    self.nickname("");
                    self.showNicknameInput(false);
                    self.hasAccountNickname(false);
                }
                self.nicknameFromInput("");
            }).fail(function (data) {
                var msg;
                if (data.responseJSON.message) {
                    msg = data.responseJSON.message.detail;
                } else if (data.responseJSON.status.message.validationError) {
                    msg = data.responseJSON.status.message.validationError[0].errorMessage;
                } else {
                    msg = data.responseJSON.message.detail;
                }
                rootParams.baseModel.showMessages(null, [msg], "ERROR");
            });
        };
        self.goBack = function () {
            self.nicknameFromInput("");
            self.showNicknameInput(false);
        };
        self.saveNickname = function () {
            var tracker = document.getElementById("tracker");
            if (tracker.valid === "valid") {
                self.accountNicknameDetails = self.rootModelInstance().AccountNickname;
                self.accountNicknameDetails.accountNicknameDTOs()[0].accountNickname(self.nicknameFromInput());
                if (self.module() !== "credit-cards") {
                    self.accountNicknameDetails.accountNicknameDTOs()[0].partyId(self.parameters.partyId.value);
                    self.accountNicknameDetails.accountNicknameDTOs()[0].accountNumber(self.parameters.id.value);
                    self.accountNicknameDetails.accountNicknameDTOs()[0].accountType(self.parameters.type);
                } else {
                    self.accountNicknameDetails.accountNicknameDTOs()[0].partyId(self.parameters.associatedParty.value);
                    self.accountNicknameDetails.accountNicknameDTOs()[0].accountNumber(self.parameters.creditCard.creditCard.value);
                    self.accountNicknameDetails.accountNicknameDTOs()[0].accountType("CCA");
                }
                AccountNicknameModel.accountNickname(ko.mapping.toJSON(self.accountNicknameDetails)).done(function (data, status) {
                    if (status === "success") {
                        self.nickname(self.accountNicknameDetails.accountNicknameDTOs()[0].accountNickname());
                        self.showNicknameInput(false);
                        self.hasAccountNickname(true);
                    }
                }).fail(function (data) {
                    var msg;
                    if (data.responseJSON.message) {
                        msg = data.responseJSON.message.detail;
                    } else if (data.responseJSON.status.message.validationError) {
                        msg = data.responseJSON.status.message.validationError[0].errorMessage;
                    } else {
                        msg = data.responseJSON.message.detail;
                    }
                    rootParams.baseModel.showMessages(null, [msg], "ERROR");
                });
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };
    };
});