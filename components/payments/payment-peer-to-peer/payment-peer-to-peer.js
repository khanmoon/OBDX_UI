define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/payment-peer-to-peer",
    "framework/js/constants/constants",
    "platform",
    "ojs/ojinputnumber",
    "ojs/ojradioset",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojdatetimepicker",
    "ojs/ojdialog",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojavatar"
], function(oj, ko, $, PeerToPeerModel, BaseLogger, ResourceBundle, Constants, Platform) {
    "use strict";
    return function(rootParams) {
        var self = this,
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(PeerToPeerModel.getNewModel());
                return KoModel;
            };
        self.confirmValue = ko.observable();
        ko.utils.extend(self, rootParams.rootModel);
        self.userSegment = Constants.userSegment;
        self.payments = ResourceBundle.payments;
        self.common = ResourceBundle.common;
        self.peerToPeerModel = self.peerToPeerModel || getNewKoModel().P2PPaymentModel;
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageThree = ko.observable(false);
        self.additionalDetails = ko.observable();
        self.validationTracker = ko.observable();
        self.paymentId = ko.observable();
        self.p2ppaymentData = ko.observable();
        self.isPeerToPeer = ko.observable(true);
        self.invalidOtpEntered = ko.observable(false);
        self.securityCode = ko.observable();
        self.transferMode = self.transferMode || ko.observable();
        self.externalRefId = ko.observable();
        self.otpEntered = ko.observable();
        self.header = rootParams.header;
        self.friendsList = ko.observableArray();
        self.friendListMap = {};
        self.friendsListLoaded = ko.observable(false);
        self.isFacebook = self.isFacebook || ko.observable(false);
        self.isTwitter = ko.observable(false);
        self.shareMessage = ko.observable(self.payments.shareMessage);
        self.isPayToContacts = ko.observable(false);
        self.checkFriendList = self.checkFriendList || ko.observable(false);
        if (self.data && self.data().mode === "PAY_TO_CONTACTS") {
            self.isPayToContacts(true);
            rootParams.dashboard.headerName(self.payments.peertopeer.payToContacts);
        }
        self.p2pAddPayeeAs = ko.observable("existing-payee");
        self.addPayeeInGroup = ko.observable();
        self.confirmScreenDetails = ko.observable();
        rootParams.baseModel.registerComponent("peer-to-peer-payee", "payee");
        rootParams.baseModel.registerComponent("transfer-view-limits", "financial-limits");
        rootParams.baseModel.registerComponent("review-payment-peer-to-peer", "payments");
        rootParams.baseModel.registerComponent("social-media", "social-media");
        rootParams.baseModel.registerElement([
            "modal-window",
            "confirm-screen",
            "comment-box",
            "amount-input",
            "account-input"
        ]);
        self.localCurrency = ko.observable();

        self.loadAccessPointList = ko.observable(false);
        self.selectedChannelTypeName = ko.observable();
        self.selectedChannelType = ko.observable();
        self.selectedChannelIndex = ko.observable();
        self.selectedChannel = ko.observable(false);
        self.viewlimits = ko.observable(false);
        self.customPayeeId = ko.observable();
        self.customLimitType = ko.observable("");
        self.channelTypeChangeHandler = function() {
            if (self.selectedChannelIndex() !== null && self.selectedChannelIndex() >= 0 && self.selectedChannelIndex() !== "") {
                self.selectedChannel(false);
                ko.tasks.runEarly();
                self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
                self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
                self.selectedChannel(true);
            }
        };
        self.channelList = ko.observableArray();
        PeerToPeerModel.listAccessPoint().done(function(data) {
            self.channelList(data.accessPointListDTO);
            self.loadAccessPointList(true);
        });

        PeerToPeerModel.init();
        self.isCommentRequired = ko.observable();
        PeerToPeerModel.fetchBankConfig().then(function(data){
            self.isCommentRequired(data.bankConfigurationDTO.region === "INDIA");
        });
        self.peerToPeerModel.amount.currency(self.localCurrency());
        self.initiatePayment = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("peerToPeerTracker"))) {
                return;
            }
            if ((self.transferMode()) === "email/mobile") {
                if (/^\d+$/.test(self.peerToPeerModel.transferValue()))
                    self.peerToPeerModel.transferMode("MOBILE");

                else if (/[a-zA-z@.0-9]+$/.test(self.peerToPeerModel.transferValue()))
                    self.peerToPeerModel.transferMode("EMAIL");
            } else {
                self.peerToPeerModel.transferMode((self.transferMode()));
            }
            self.peerToPeerModel.transferValue((self.peerToPeerModel.transferValue()).toLowerCase());
            var payload = ko.toJSON(self.peerToPeerModel);
            PeerToPeerModel.initiateP2P(payload).done(function(data) {
                self.paymentId(data.paymentId);
                self.baseURL = "payments/transfers/peerToPeer/" + self.paymentId();
                rootParams.dashboard.loadComponent("review-payment-peer-to-peer", {
                    paymentId: self.paymentId(),
                    header: rootParams.dashboard.headerName(),
                    retainedData: self
                }, self);
            });
        };
        self.readP2P = function() {
            PeerToPeerModel.readP2P(self.paymentId()).done(function(data) {
                self.p2ppaymentData(data);
                self.header(false);
                self.stageOne(false);
                self.stageTwo(true);
            });
        };
        self.cancelPayment = function() {
            self.stageOne(true);
            self.header(true);
            self.stageTwo(false);
            self.stageThree(false);
        };
        self.handleFacebookChecks = function() {
            if (self.isFacebook()) {
                window.setTimeout(self.openFacebookWindow, 3000);
            }
        };

        var cnftransferValue;
        var transferValue;

        function transferValueValidator_fn(value) {
            transferValue = value;
            if (value) {
                if (cnftransferValue) {
                    if (value === cnftransferValue)
                        document.getElementById("confirmTransferValueEmail").validate();
                    else
                        throw new oj.ValidatorError("ERROR", self.payments.peertopeer.transferValuemsg);
                } else if (self.confirmValue()) {
                    if (value !== self.confirmValue())
                        throw new oj.ValidatorError("ERROR", self.payments.peertopeer.transferValuemsg);
                }
            }
        }

        function cnfTransferValueValidator_fn(value) {
            if ((self.peerToPeerModel.transferValue() && self.peerToPeerModel.transferValue() !== "") || value) {
                cnftransferValue = value;
                if (transferValue !== cnftransferValue) {
                    if (self.peerToPeerModel.transferValue() !== value) {
                        self.peerToPeerModel.transferValue("");
                        throw new oj.ValidatorError("ERROR", self.payments.peertopeer.transferValuemsg);
                    }
                } else if (transferValue === cnftransferValue) {
                    self.confirmValue(cnftransferValue);
                    cnftransferValue = "";
                    transferValueValidator_fn(transferValue);
                    document.getElementById("transferValueEmail").validate();
                }
            } else
                throw new oj.ValidatorError("ERROR", self.payments.peertopeer.p2pMessage);
        }

        self.transferValueValidator = [{
            "validate": transferValueValidator_fn
        }];
        self.confirmTransferValueValidator = [{
            "validate": cnfTransferValueValidator_fn
        }];
        self.restrictedEvent = function() {
            $("#transferValueEmail").bind("copy paste cut", function(e) {
                e.preventDefault();
            });
            $("#confirmTransferValueEmail").bind("copy paste cut", function(e) {
                e.preventDefault();
            });
        };
        self.verifyPayment = function() {
            PeerToPeerModel.verifyP2P(self.paymentId()).done(function(data, status, jqXHR) {
                self.stageTwo(false);
                self.securityCode(data.securityCode);
                if (data.tokenAvailable) {
                    self.stageThree(true);
                } else {
                    var shareMessage = rootParams.baseModel.format(self.shareMessage(), {
                        transactionName: self.payments.verifyP2PPayment,
                        referenceNumber: data.externalReferenceId
                    });
                    self.externalRefId(data.externalReferenceId);
                    self.securityCode(data.securityCode);
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        hostReferenceNumber: data.externalReferenceId,
                        transactionName: self.payments.verifyP2PPayment,
                        p2p: true,
                        facebookPayment: self.isFacebook(),
                        shareMessage: shareMessage,
                        confirmScreenExtensions: {
                            successMessage: self.common.confirmScreen.successMessage,
                            statusMessages: self.common.success,
                            isSet: true,
                            confirmScreenDetails: self.confirmScreenDetails(),
                            template: "confirm-screen/payments-template"
                        },
                        additionalDetails: {
                            items: [{
                                label: self.payments.securityCode,
                                value: data.securityCode
                            }]
                        }
                    }, self);
                    self.handleFacebookChecks();
                }
            });
        };
        self.confirmPayment = function(data, status, jqXHR) {
            self.externalRefId(data.externalReferenceId);
            self.securityCode(data.securityCode);
            self.stageThree(false);
            rootParams.dashboard.loadComponent("confirm-screen", {
                jqXHR: jqXHR,
                hostReferenceNumber: data.externalReferenceId,
                securityCode: data.securityCode,
                transactionName: self.payments.confirmP2PPayment,
                template: "payments/confirm-screen-templates/payment-peer-to-peer"
            }, self);
            self.handleFacebookChecks();
        };
        self.paymentDone = function() {
            history.go(-1);
        };
        self.goToDashboard = function() {
            window.location.reload();
        };
        self.selectedFriend = self.selectedFriend || ko.observable();
        self.peerToPeerData = ko.observable({ "transferValue": "" });
        self.existingPayee = function() {
            var groupId = (self.addPayeeInGroup());
            var obj = ko.utils.arrayFirst(self.payeeListExpandAll(), function(element) {
                return element.groupId === groupId;
            });
            self.peerToPeerData({
                transferValue: self.peerToPeerModel.transferValue().toLowerCase(),
                groupId: groupId,
                name: obj.payeeGroupName,
                isNew: false
            });
            rootParams.dashboard.loadComponent("peer-to-peer-payee", self.peerToPeerData(), self);
        };
        self.newPayee = function() {
            self.peerToPeerData({
                "transferValue": self.peerToPeerModel.transferValue().toLowerCase(),
                "isNew": true
            });
            rootParams.dashboard.loadComponent("peer-to-peer-payee", self.peerToPeerData(), self);
        };
        self.createPayee = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("createpayee")))
                return;
            void((self.p2pAddPayeeAs() === "existing-payee" && self.existingPayee()) || self.newPayee());
        };
        self.enableP2PpayeeOptions = function() {
            $("#p2p-payee").trigger("openModal");
        };
        self.transferModeArray = ko.observableArray([{
                code: "email/mobile",
                description: self.payments.peertopeer.transferValue
            },
            {
                code: "BANKACCOUNT",
                description: self.payments.bankaccount
            },
            {
                code: "FACEBOOK",
                description: self.payments.peertopeer.facebookPayment
            }
        ]);
        if (self.isPayToContacts()) {
            self.transferModeArray.remove(function(item) {
                return item.code === "BANKACCOUNT";
            });
        }
        if (!self.transferMode())
            self.transferMode(self.transferModeArray()[0].code);
        self.transferModeChange = function(event) {
            if (event.detail.value && (event.detail.value === "email/mobile" || event.detail.value === "FACEBOOK" || event.detail.value === "TWITTER")) {
                self.isPeerToPeer(true);
                self.isFacebook(false);
                self.isTwitter(false);
                self.peerToPeerModel.transferValue(null);
                if (event.detail.value === "FACEBOOK")
                    self.isFacebook(true);
            } else if (event.detail.value === "BANKACCOUNT") {
                self.isPeerToPeer(false);
            }
        };
        self.currencyParser = function(data) {
            var output = {};
            output.currencies = [];
            for (var i = 0; i < data.currencyList.length; i++) {
                output.currencies.push({
                    code: data.currencyList[i].code,
                    description: data.currencyList[i].code
                });
            }
            return output;
        };
        self.viewLimits = function() {
            self.viewlimits(false);
            self.customLimitType("");
            self.customLimitType("PC_F_PRTOPR");
            ko.tasks.runEarly();
            $("#viewlimits-P2P").trigger("openModal");
            self.viewlimits(true);

        };
        self.closeLimitsModal = function() {
            self.selectedChannelIndex("");
            self.selectedChannel(false);
            ko.tasks.runEarly();
            $("#viewlimits-P2P").trigger("closeModal");
        };
        self.openFacebookWindow = function() {
            var params = {
                "app_id": "@@FB_API_KEY",
                "caption": self.payments.verifyP2PPayment,
                "link": window.location.origin + "?homeModule=claim-payment&homeComponent=claim-payment-dashboard",
                "to": self.peerToPeerModel.transferValue(),
                "redirect_uri": window.location.href
            };
            var url = "@@FB_SEND_MESSAGE_API?" + $.param(params);
            if (rootParams.baseModel.cordovaDevice()) {
                Platform.getInstance().then(function(platform) {
                    var server_url = platform("getServerURL");
                    url = server_url + "?homeModule=claim-payment&homeComponent=claim-payment-dashboard";
                    window.facebookConnectPlugin.showDialog({
                        method: "send",
                        link: url
                    });
                });
            } else {
                window.open(url, "PAYMENT", "width=900,height=400");
            }
        };
        self.expandList = function() {
            if (!rootParams.baseModel.large() && self.friendsList().length > 0) {
                self.loadFriendListComponent();
            }
        };
        self.loadFriendListComponent = function() {
            rootParams.baseModel.registerComponent("facebook-friend-list", "payments");
            rootParams.dashboard.loadComponent("facebook-friend-list", {
                dataList: self.friendsList,
                selectedValue: self.selectedFriend,
                retainedData: self
            }, self);
        };
        self.loadFriendList = function(response) {
            self.friendsList.removeAll();
            for (var i = 0; i < response.data.length; i++) {
                self.friendsList.push(response.data[i]);
                self.friendListMap[response.data[i].id] = response.data[i].name;
            }
            self.friendsListLoaded(true);
            self.peerToPeerModel.transferValue(self.selectedFriend());
            if (!rootParams.baseModel.large() && response.data.length === 0) {
                rootParams.baseModel.showMessages(null, [self.payments.peertopeer.noFriendsFound], "INFO");
            } else if (!rootParams.baseModel.large() && !self.selectedFriend() && !self.checkFriendList()) {
                self.loadFriendListComponent();
                self.checkFriendList(true);
            }
        };
        // eslint-disable-next-line no-empty-function
        self.dispose = function(){};
    };
});
