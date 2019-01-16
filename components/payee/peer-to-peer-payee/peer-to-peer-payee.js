define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/peer-to-peer-payee",
    "framework/js/constants/constants",
    "ojs/ojinputnumber",
    "ojs/ojinputtext"
], function (oj, ko, $, P2PPayeeModel, BaseLogger, ResourceBundle, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this, payload, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(P2PPayeeModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.userSegment = Constants.userSegment;
        self.validationTracker = ko.observable();
        self.common = ResourceBundle.common;
        self.payments = ResourceBundle.payments;
        self.p2pPayeeModel = getNewKoModel().p2pPayee;
        self.p2pPayeeGroup = getNewKoModel().payeeGroup;
        self.otpEntered = ko.observable();
        self.invalidOtpEntered = ko.observable(false);
        self.externalReferenceId = ko.observable();
        rootParams.dashboard.headerName(self.payments.addrecipient_header);
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageThree = ko.observable(false);
        self.p2pData = ko.observable();
        self.groupId = ko.observable(self.params.groupId);
        self.payeeId = ko.observable();
        self.type = ko.observable("peerToPeer");
        self.payeeType = ko.observable();
        self.p2pPayeeModel.transferValue(self.params.transferValue);
        self.p2pPayeeModel.name(self.params.name);
        self.isNew = ko.observable("isNew" in self.params ? self.params.isNew : true);
        P2PPayeeModel.init();
        self.createPayeeGroup = function () {
            if (!self.isNew()) {
                self.addPayee();
                return;
            }
            self.p2pPayeeGroup.name(self.p2pPayeeModel.name());
            var payload = ko.toJSON(self.p2pPayeeGroup);
            P2PPayeeModel.createPayeeGroup(payload).done(function (data) {
                self.groupId(data.payeeGroup.groupId);
                self.addPayee();
            });
        };
        self.addPayee = function () {
            if (self.p2pPayeeModel.transferValue().indexOf("@") > -1) {
                self.p2pPayeeModel.transferMode("EMAIL");
                self.payeeType("email");
            } else {
                self.p2pPayeeModel.transferMode("MOBILE");
                self.payeeType("mobile");
            }
            self.p2pPayeeModel.groupId(self.groupId());
            payload = ko.toJSON(self.p2pPayeeModel);
            P2PPayeeModel.addPayee(self.groupId(), self.type(), payload).done(function (data) {
                self.payeeId(data.peerToPeerPayee.id);
                P2PPayeeModel.readPayee(self.groupId(), self.payeeId(), self.type()).done(function (data) {
                    self.p2pData(data.peerToPeerPayee);
                    self.stageOne(false);
                    self.stageTwo(true);
                });
            });
        };
        self.verifyPayee = function () {
            P2PPayeeModel.verifyPayee(self.groupId(), self.payeeId(), self.type()).done(function (data, status, jqXHR) {
                self.baseURL = "payments/payeeGroup/" + self.groupId() + "/payees/" + self.type() + "/" + self.payeeId();
                self.stageTwo(false);
                if (data.tokenAvailable) {
                    self.stageThree(true);
                } else {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        hostReferenceNumber: data.externalReferenceId,
                        transactionName: self.payments.newPayee,
                        template: "confirm-screen/payments-template"
                    }, self);
                }
            });
        };
        self.cancelPayee = function () {
            self.stageOne(true);
            self.stageTwo(false);
        };
        self.cancel = function () {
            history.go(-1);
        };
    };
});