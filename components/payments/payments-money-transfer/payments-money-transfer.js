define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payments-money-transfer",
    "framework/js/constants/constants",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojcheckboxset",
    "ojs/ojdatetimepicker",
    "ojs/ojdialog",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation",
    "ojs/ojpopup"
], function(oj, ko, $, MoneyTransferModel, ResourceBundle, Constants) {
    "use strict";
    return function(rootParams) {
        var self = this,
            i = 0,
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(MoneyTransferModel.getNewModel());
                return KoModel;
            };
        self.defaultData = rootParams.options ? rootParams.options.data : rootParams.rootModel.params;
        if (rootParams.rootModel && rootParams.rootModel.isMultiplePayment) {
            ko.utils.extend(self, rootParams.referenceHandle.autoPopulationData);
            self.referenceHandel = rootParams.referenceHandle;
            self.isStandingInstruction = ko.observable(false);
        } else {
            self.purpose = ko.observable();
            self.otherPurposeValue = ko.observable();
            self.charges = ko.observable();
            self.otherDetails = ko.observable();
            self.oinNumber = ko.observable();
            self.oinDescription = ko.observable();
            self.instances = ko.observable();
            self.isEndDateRequired = ko.observable(true);
            self.transferMode = ko.observable("");
            self.otherPurpose = ko.observable(false);
            self.urlAttribute1 = ko.observable();
            self.urlAttribute2 = ko.observable();
            self.peerToPeerModel = getNewKoModel().P2PPayment;
            self.frequency = ko.observable();
            self.valuedate = ko.observable();
            self.selectedPayee = ko.observable();
            self.groupId = ko.observable();
            self.customTransferComponent = ko.observable();
            self.transferAmount = ko.observable();
            self.transferCurrency = ko.observable();
            self.srcAccount = ko.observable();
            self.note = ko.observable();
            self.siEnd = ko.observable("PAYLATER");
            self.transferOn = ko.observable();
            self.transferLater = ko.observable(false);
            self.siEndDate = ko.observable();
            self.siStartDate = ko.observable();
            self.customPayeeId = ko.observable(rootParams.rootModel.params.payeeId);
            self.domesticPayeeType = ko.observable(null);
            self.customCurrencyURL = ko.observable(null);
            self.adhoc = ko.observable(rootParams.rootModel.params.mode === "PAY_TO_CONTACTS");
            self.transferTo = ko.observable();
            self.confirmTransferValue = ko.observable();
            self.payeeDetails = ko.observable("");
            self.validationTracker = ko.observable();
            self.confirmScreenDetails = ko.observable();
            self.customPayeeName = ko.observable(rootParams.rootModel.params.nickName);
            self.domesticNetworkTypes = ko.observableArray();
            self.region = ko.observable();
            self.network = ko.observable();
            self.isNetworkTypesLoaded = ko.observable(false);
            self.paynowWithSI = ko.observableArray();
            self.currentExchangeRate = ko.observable();
            self.dealId = ko.observable();
            self.usePreBookedDeal = ko.observableArray([]);
            self.showList = ko.observable(false);
            self.dealDetails = ko.observable(false);
            self.dealsAvailable = ko.observable();
            self.isStandingInstruction = ko.observable();
            if (Constants.userSegment === "CORP") {
                self.isStandingInstruction(rootParams.rootModel.params.isStandingInstruction);
            } else {
                self.isStandingInstruction(rootParams.options && rootParams.options.metaData && rootParams.options.metaData.data ? rootParams.options.metaData.data.isStandingInstruction : rootParams.rootModel.params ? rootParams.rootModel.params.isStandingInstruction || rootParams.isStandingInstruction : null);
            }
        }
        self.AdhocFlag = ko.observable(false);
        self.currentTask = ko.observable("PC_F_INTRNL");
        ko.utils.extend(self, rootParams.rootModel.previousState ? rootParams.rootModel.previousState.retainedData : rootParams.rootModel);
        function checkisStandingInstruction(){
            if(rootParams.dashboard.isConfirmScreenVisited())
            self.isStandingInstruction(rootParams.rootModel.params.isStandingInstruction);
        }
        checkisStandingInstruction();

        if (rootParams.rootModel && rootParams.rootModel.isMultiplePayment)
            self.validationTracker = rootParams.referenceHandle.validationTracker;
        self.userSegment = Constants.userSegment;
        rootParams.baseModel.registerComponent("payment-self", "payments");
        rootParams.baseModel.registerComponent("payment-internal", "payments");
        rootParams.baseModel.registerComponent("payment-domestic", "payments");
        rootParams.baseModel.registerComponent("payment-international", "payments");
        rootParams.baseModel.registerComponent("payment-uk", "payments");
        rootParams.baseModel.registerComponent("payment-sepa", "payments");
        rootParams.baseModel.registerComponent("transfer-view-limits", "financial-limits");
        rootParams.baseModel.registerComponent("my-limits", "limits-enquiry");

        rootParams.baseModel.registerComponent("payment-peer-to-peer-existing", "payments");
        rootParams.baseModel.registerComponent("payment-peer-to-peer", "payments");
        rootParams.baseModel.registerComponent("standing-instructions-landing", "payments");
        rootParams.baseModel.registerComponent("payee-main", "payee");
        rootParams.baseModel.registerComponent("bank-account-payee", "payee");
        rootParams.baseModel.registerComponent("warning-message-dialog", "payee");
        rootParams.baseModel.registerComponent("payments-payee-list", "payee");
        rootParams.baseModel.registerComponent("multiple-payments", "payments");
        rootParams.baseModel.registerComponent("adhoc-payments", "payments");
        rootParams.baseModel.registerComponent("forex-deal-utilization", "payments");
        rootParams.baseModel.registerComponent("forex-deal-create", "forex-deal");
        rootParams.baseModel.registerElement([
            "modal-window",
            "confirm-screen",
            "row",
            "comment-box",
            "amount-input",
            "account-input",
            "internal-account-input"
        ]);

        function isTransferMode(mode) {
            return self.transferMode().toUpperCase() === mode.toUpperCase();
        }
        self.payments = ResourceBundle.payments;
        if (!rootParams.rootModel.isMultiplePayment) {
            if (self.userSegment === "CORP") {
                rootParams.dashboard.headerName(self.payments.moneytransfer_header);
            } else {
                rootParams.dashboard.headerName(self.payments.moneytransfer_header_retail);
            }
        }
        rootParams.dashboard.headerCaption("");
        rootParams.dashboard.isConfirmScreenVisited(false);
        self.currentDate = ko.observable();
        self.tomorrow = ko.observable();
        self.dayAfterTomorrow = ko.observable();
        self.oneMonthLater = ko.observable();
        self.formattedToday = ko.observable();
        self.formattedTomorrow = ko.observable();
        self.formattedDayAfterTomorrow = ko.observable();
        self.requestPageLoad = ko.observable(false);
        self.data = ko.observable(rootParams.rootModel.params);
        self.transferObject = ko.observable();
        self.purposeDescription = ko.observable();
        self.chargesDescription = ko.observable();
        self.shareMessage = ko.observable(self.payments.shareMessage);
        self.paymentDetails = ko.observable(self.params && self.params.transferDetails ? self.params.transferDetails :"");
        self.additionalDetailsFrom = ko.observable();
        self.isDataLoaded = ko.observable(true);
        self.frequencyDescription = ko.observable();
        self.domesticPaymentPayload = getNewKoModel().domesticPaymentModel;
        self.domesticPayLaterPayload = getNewKoModel().domesticPayLaterModel;
        self.internationalPaymentPayload = getNewKoModel().internationalPaymentModel;
        self.internationalPayLaterPayload = getNewKoModel().internationalPayLaterModel;
        self.selfPaymentPayload = getNewKoModel().selfPaymentModel;
        self.selfPayLaterPayload = getNewKoModel().selfPayLaterModel;
        self.internalPaymentPayload = getNewKoModel().internalPaymentModel;
        self.internalPayLaterPayload = getNewKoModel().internalPayLaterModel;
        self.domesticAuthenticationModel = getNewKoModel().domesticAuthenticationModel;
        self.favoritesPayLoad = getNewKoModel().favoritesModel;
        self.finaldate = ko.observable();
        self.localCurrency = ko.observable();
        self.isPayeeListEmpty = ko.observable(false);
        self.noteComponentLoaded = ko.observable(true);
        self.creditAccountDisplayValue = ko.observable();
        self.customLimitType = ko.observable("");
        self.model = ko.observable();
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.frequencyArray = ko.observableArray();
        self.purposeDescription = ko.observable();
        self.externalReferenceId = ko.observable();
        self.securityCode = ko.observable();
        self.transactionType = ko.observable();
        self.additionalDetails = ko.observable();
        self.moneyTransferheader = ko.observable(true);
        self.removeFavouriteFlag = ko.observable(false);
        self.fromFavourites = ko.observable(false);
        self.refreshAccountInputTF = ko.observable(true);
        self.loadAccessPointList = ko.observable(false);
        self.selectedChannelTypeName = ko.observable();
        self.selectedChannelType = ko.observable();
        self.selectedChannelIndex = ko.observable();
        self.selectedChannel = ko.observable(false);

        self.channelTypeChangeHandler = function() {
            if (self.selectedChannelIndex() !== null && self.selectedChannelIndex() !== "") {
                self.selectedChannel(false);
                ko.tasks.runEarly();
                self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
                self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
                self.selectedChannel(true);
            }
        };
        self.channelList = ko.observableArray();
        MoneyTransferModel.listAccessPoint().done(function(data) {
            self.channelList(data.accessPointListDTO);
            self.loadAccessPointList(true);
        });
        self.channelPopup = function() {
            var popup1 = document.querySelector("#channel-popup");

            if (popup1.isOpen()) {
                popup1.close();
            } else {
                popup1.open("channel-disclaimer");
            }
        };

        self.moneyTransferheader(rootParams.rootModel.params.mode !== "PAY_TO_CONTACTS");

        self.selectedPayeeName = ko.observable();
        self.domesticPayeeSubType = ko.observable();
        self.selectedTabData = rootParams.metaData;
        self.ispeerToPeer = ko.observable(false);
        self.paymentId = ko.observable(self.params ? (self.params.paymentId||""):"");
        self.payeeListExpandAll = ko.observableArray();
        self.payeeSubListExpandAll = ko.observableArray();
        self.payeeSubList = ko.observableArray();
        self.dropdownLevelOne = ko.observable(false);
        self.dropDownActive = ko.observable();
        self.frequencyLoaded = ko.observable(false);
        self.viewlimits = ko.observable(false);
        var transferObject = self.params && self.params.transferObject ? self.params.transferObject() : self.defaultData && self.defaultData.transferObject ? self.defaultData.transferObject() : null;
        self.transferOnArray = [{
                id: "now",
                label: self.payments.moneytransfer.now
            },
            {
                id: "later",
                label: self.payments.moneytransfer.later
            }
        ];

        var transferModeDetails = {
            "INTERNAL": {
                component: "payment-internal",
                attr1: "transfers",
                attr2: "internal",
                batchType: {
                    create: "CPNWSII",
                    update: "PNWSII"
                },
                taskCode: "PC_F_INTRNL"
            },
            "INTERNATIONAL": {
                component: "payment-international",
                attr1: "payouts",
                attr2: "international",
                currencyUrl: "payments/currencies?type=PC_F_IT",
                taskCode: "PC_F_IT"
            },
            "DOMESTIC": {
                INDIA: {
                    component: "payment-domestic",
                    payeeSubTypeKey: "network",
                    payeeKey: "indiaDomesticPayee"
                },
                SEPA: {
                    component: "payment-sepa",
                    payeeSubTypeKey: "sepaType",
                    payeeKey: "sepaDomesticPayee"
                },
                UK: {
                    component: "payment-uk",
                    payeeSubTypeKey: "paymentType",
                    payeeKey: "ukDomesticPayee"
                },
                attr1: "payouts",
                attr2: "domestic",
                currencyUrl: "payments/currencies?type=DOMESTICFT",
                taskCode: "PC_F_DOM",
                batchType: {
                    create: "CPNWSID",
                    update: "PNWSID"
                }
            },
            "PEERTOPEER": {
                component: "payment-peer-to-peer-existing",
                attr1: "transfers",
                attr2: "peerToPeer",
                currencyUrl: "payments/currencies?type=PEER_TO_PEER"
            },
            "SELF": {
                taskCode: "PC_F_SELF",
                batchType: {
                    create: "CPNWSIS",
                    update: "PNWSIS"
                }
            }
        };
        self.isCommentRequired = ko.observable();
        MoneyTransferModel.fetchBankConfig().then(function(data) {
            self.isCommentRequired(data.bankConfigurationDTO.region === "INDIA");
        });

        self.transferOn(self.transferOn() || self.transferOnArray[0].id);
        self.networkTypesMap = {};

        function setTaskCode() {
            self.refreshAccountInputTF(false);
            self.currentTask(transferModeDetails[self.transferMode().toUpperCase()].taskCode);
            self.refreshAccountInputTF(true);
        }
        self.paynowWithSIChangeHandler = function(event) {
            if (event.detail && event.detail.value.length)
                $("#pay-now-with-si-msg").trigger("openModal");

        };
        self.closePaynowWithSIMsgModal = function(isProceed) {
            if (!isProceed)
                self.paynowWithSI.removeAll();
            $("#pay-now-with-si-msg").hide();
        };
        self.togglePaynowWithSIPopup = function() {
            var popup = document.querySelector("#paynowwithsi-popup");
            if (popup.isOpen()) {
                popup.close();
            } else {
                popup.open("pay-now-with-si-know-more");
            }
        };

        self.setPayee = function(data) {
            self.transferCurrency(self.transferCurrency() || "");
            self.groupId(data.groupId);
            self.customPayeeName(data.nickName);
            self.customPayeeId(data.payeeId ? data.payeeId : data.payeeData ? data.payeeData.id : data.id);
            self.transferMode(data.domesticPayeeType ? "DOMESTIC" : data.payeeType);
            if (!self.region() && data.domesticPayeeType === "INDIA") {
                self.region(data.domesticPayeeType);
                MoneyTransferModel.getNetworkTypes().then(function(data) {
                    self.domesticNetworkTypes.removeAll();
                    for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        self.domesticNetworkTypes.push({
                            text: data.enumRepresentations[0].data[i].description,
                            value: data.enumRepresentations[0].data[i].code
                        });
                        self.networkTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
                    }
                    self.network(self.network() || data.enumRepresentations[0].data[0].code);
                    self.isNetworkTypesLoaded(true);
                });
            }
            if (self.domesticNetworkTypes().length && data.domesticPayeeType === "INDIA") {
                self.isNetworkTypesLoaded(true);
            }
            if (!self.transferOn()) {
                self.transferOn(data.startDate ? self.transferOnArray[1].id : self.transferOnArray[0].id);
            }
            self.domesticPayeeType(data.domesticPayeeType);
            if (data.payeeData) {
                if (data.payeeType.toUpperCase() === "INTERNAL") {
                    self.payeeDetails({
                        accountType: data.payeeType,
                        accountNumber: data.payeeData.accountNumber,
                        accountName: data.payeeData.accountName
                    });
                } else if (data.payeeType.toUpperCase() !== "PEERTOPEER") {
                    self.payeeDetails({
                        accountType: data.payeeType,
                        accountNumber: data.payeeData.accountNumber || data.payeeData.iban || "",
                        accountName: data.payeeData.accountName,
                        accountBranch: data.payeeData.bankDetails
                    });
                }
            }
            transferModeDetails.INTERNAL.currencyUrl = "payments/currencies?type=INTERNALFT&currency=" + data.currency;
            self.customTransferComponent(transferModeDetails[self.transferMode().toUpperCase()].component || transferModeDetails[self.transferMode().toUpperCase()][self.domesticPayeeType().toUpperCase()].component);
            self.urlAttribute1(transferModeDetails[self.transferMode().toUpperCase()].attr1);
            self.urlAttribute2(transferModeDetails[self.transferMode().toUpperCase()].attr2);
            self.customCurrencyURL(transferModeDetails[self.transferMode().toUpperCase()].currencyUrl);
            if (isTransferMode("DOMESTIC")) {
                if (!data.nickName) {
                    self.customPayeeName(data[transferModeDetails.DOMESTIC[self.domesticPayeeType().toUpperCase()].payeeKey].nickName);
                }
                self.domesticPayeeSubType(data.payeeData[transferModeDetails.DOMESTIC[self.domesticPayeeType().toUpperCase()].payeeSubTypeKey]);
            } else if (isTransferMode("PEERTOPEER")) {
                if (self.transferOn() === "now") {
                    self.model(self.peerToPeerModel);
                }
                self.peerToPeerModel.transferValue(data.transferValue);
                self.peerToPeerModel.transferMode(data.transferMode);
                self.ispeerToPeer(true);
            }
            setTaskCode();
            self.dropDownActive(false);
        };
        var accountsCount;
        self.accountsParser = function(data) {
            accountsCount = data.accounts.length;
            return data;
        };
        self.loadSelf = function() {
            if ((accountsCount && accountsCount >= 2) || self.fromFavourites()) {
                self.transferMode("SELF");
                self.model(self.selfPaymentPayload);
                self.urlAttribute1("transfers");
                self.urlAttribute2("self");
                self.customTransferComponent("payment-self");
                self.customPayeeName("SELF");
                self.transactionType("SELFFT");
            } else if (accountsCount && accountsCount < 2) {
                self.stageOne(false);
                rootParams.baseModel.showMessages(null, [self.payments.selfError], "ERROR", function() {
                    self.transferTo(self.transferToArray[0].id);
                    self.stageOne(true);
                });
            }
        };
        var customLimitType = {
            "INTERNAL": "PC_F_INTRNL",
            "INTERNATIONAL": "PC_F_IT",

            "INDIA": "PC_F_DOM_",
            "UK": "PC_F_UK_",
            "SEPA": "PC_F_SEPA_",

            "CAT": "CARD",
            "CRT": "CREDIT",

            "PEERTOPEER": "PC_F_PRTOPR"
        };
        self.viewLimitsModalId = Date.now().toString();
        self.viewLimits = function() {
            self.viewlimits(false);
            self.customLimitType("");
            if (self.customPayeeName() && self.customPayeeName() !== null) {
                if (self.transferTo() === "self") {
                    self.customLimitType("PC_F_SELF");
                } else if (self.transferTo() === "existing") {
                    self.customLimitType(customLimitType[self.transferMode().toUpperCase()] || (customLimitType[self.domesticPayeeType()] + (customLimitType[self.domesticPayeeSubType()] || self.domesticPayeeSubType() || self.network())));
                }
            }
            ko.tasks.runEarly();
            $("#" + self.viewLimitsModalId).trigger("openModal");
            self.viewlimits(true);
        };
        self.done = function() {
            self.selectedChannelIndex("");
            self.selectedChannel(false);
            ko.tasks.runEarly();
            $("#" + self.viewLimitsModalId).hide();
        };
        self.currentDateLoaded = ko.observable(false);
        var today, checkUpcomingPayment, checkUpcomingPaymentTill, checkUpcomingDays;

        function hostDateHandler(data) {
            self.requestPageLoad(false);
            today = new Date(data.currentDate.valueDate);
            self.formattedToday(today);
            self.currentDate(rootParams.baseModel.formatDate(today));
            var tomorrow = new Date(data.currentDate.valueDate);
            tomorrow.setDate(today.getDate() + 1);
            self.formattedTomorrow(tomorrow);
            self.tomorrow(rootParams.baseModel.formatDate(tomorrow));
            var dayAfterTomorrow = new Date(data.currentDate.valueDate);
            dayAfterTomorrow.setDate(tomorrow.getDate() + 1);
            self.formattedDayAfterTomorrow(dayAfterTomorrow);
            self.dayAfterTomorrow(rootParams.baseModel.formatDate(dayAfterTomorrow));
            self.currentDateLoaded(true);
            self.requestPageLoad(true);
        }
        self.transferOnChange = function(event) {
            if (event.detail.value === "now" && event.detail.value !== event.detail.previousValue) {
                self.transferLater(false);
                self.valuedate(self.formattedToday());
            } else {
                self.valuedate(null);
                self.transferLater(true);
                if (self.transferTo() === "self") {
                    self.model(self.selfPayLaterPayload);
                }
            }
        };
        if ((self.isStandingInstruction() && rootParams.dashboard.headerName(self.payments.setstandinginstruction_header)) || self.userSegment === "CORP") {

            self.transferToArray = [{
                    id: "existing",
                    label: self.payments.moneytransfer.existingPayee
                },
                {
                    id: "self",
                    label: self.payments.moneytransfer.myAccounts
                }
            ];
        } else {
            self.transferToArray = [{
                    id: "existing",
                    label: self.payments.moneytransfer.existingPayee
                },
                {
                    id: "adhoc",
                    label: self.payments.moneytransfer.newPayee
                },
                {
                    id: "self",
                    label: self.payments.moneytransfer.myAccounts
                }
            ];
        }
        self.getSubPayeeList = function(groupName) {
            for (i = 0; i < self.payeeListExpandAll().length; i++) {
                if (self.payeeListExpandAll()[i].payeeGroupName === groupName) {
                    return self.payeeListExpandAll()[i];
                }
            }
        };
        self.payeeChanged = function(event) {
            if ((event.detail && event.detail.value) || self.selectedPayee()) {
                self.payeeSubList().length = 0;
                var transactingPayeeIndex = -1;
                self.payeeSubListExpandAll(self.getSubPayeeList(event.detail ? event.detail.value : self.selectedPayee()));
                for (i = 0; i < self.payeeSubListExpandAll().payeeList.length; i++) {
                    var payeeSublist = ko.toJS(self.payeeSubListExpandAll().payeeList[i]);
                    if (payeeSublist.id === self.customPayeeId() || (transferObject && transferObject.isFavoriteTransaction && payeeSublist.id === transferObject.payeeId)) {
                        transactingPayeeIndex = i;
                    }
                    self.payeeSubList.push({
                        groupId: self.payeeSubListExpandAll().groupId,
                        payeeId: payeeSublist.id,
                        payeeData: payeeSublist.indiaDomesticPayee || payeeSublist.ukDomesticPayee || payeeSublist.sepaDomesticPayee || payeeSublist,
                        nickName: payeeSublist.nickName,
                        payeeType: payeeSublist.payeeType,
                        transferMode: payeeSublist.transferMode ? payeeSublist.transferMode : "",
                        transferValue: payeeSublist.transferValue ? payeeSublist.transferValue : "",
                        domesticPayeeType: payeeSublist.domesticPayeeType ? payeeSublist.domesticPayeeType : "",
                        currency: payeeSublist.currency ? payeeSublist.currency : ""
                    });
                }
                self.selectedPayeeName(event.detail ? event.detail.value : self.selectedPayee());
                self.customPayeeName(self.selectedPayee());
                self.dropDownActive(true);
                self.dropdownLevelOne(false);
                if (self.selectedPayee() && transactingPayeeIndex !== -1) {
                    self.setPayee(self.payeeSubList()[transactingPayeeIndex]);
                }
            }
        };
        self.refreshDropDown = function() {
            self.dropdownLevelOne(false);
            self.otherPurpose(false);
            self.customPayeeName(null);
            self.charges("");
            self.purpose("");
            self.srcAccount(undefined);
            self.frequency(undefined);
            self.refreshAccountInputTF(false);
            self.selectedPayee("");
            if (!(transferObject && transferObject.isFavoriteTransaction))
                self.emptyFields();
            self.customTransferComponent(undefined);
            self.isNetworkTypesLoaded(false);
            self.model(null);
            self.dropDownActive(false);
            self.payeeDetails("");
            self.customPayeeId("");
            self.ispeerToPeer(false);
            self.customCurrencyURL(null);
            self.currentExchangeRate(null);
            self.transferMode(null);
            self.dealId(null);
            self.dealDetails(false);
            self.dealsAvailable();
            self.usePreBookedDeal([]);
            self.showList(false);
            ko.tasks.runEarly();
            self.dropdownLevelOne(true);
            self.refreshAccountInputTF(true);
        };
        self.corporatePayeeChange = function(event) {
            if (event.detail.value) {
                self.refreshDropDown();
                for (var i = 0; i < self.payeeListExpandAll().length; i++) {
                    if (event.detail.value === self.payeeListExpandAll()[i].payeeId) {
                        self.selectedPayee(self.payeeListExpandAll()[i].payeeId);
                        self.setPayee(self.payeeListExpandAll()[i]);
                        break;
                    }
                }
            }
        };

        function payeeListHandler(data) {
            for (var i = 0; i < data.payeeGroups.length; i++) {
                if (self.userSegment === "CORP") {
                    if (transferObject && transferObject.isFavoriteTransaction && transferObject.payeeId === data.payeeGroups[i].listPayees[0].id) {
                        self.selectedPayee(data.payeeGroups[i].listPayees[0].id);
                    }
                    self.payeeListExpandAll.push({
                        groupId: data.payeeGroups[i].groupId,
                        payeeGroupName: data.payeeGroups[i].name,
                        nickName: data.payeeGroups[i].listPayees[0].nickName,
                        payeeId: data.payeeGroups[i].listPayees[0].id,
                        payeeData: data.payeeGroups[i].listPayees[0].indiaDomesticPayee || data.payeeGroups[i].listPayees[0].ukDomesticPayee || data.payeeGroups[i].listPayees[0].sepaDomesticPayee || data.payeeGroups[i].listPayees[0],
                        payeeType: data.payeeGroups[i].listPayees[0].payeeType,
                        transferMode: data.payeeGroups[i].listPayees[0].transferMode ? data.payeeGroups[i].listPayees[0].transferMode : "",
                        transferValue: data.payeeGroups[i].listPayees[0].transferValue ? data.payeeGroups[i].listPayees[0].transferValue : "",
                        domesticPayeeType: data.payeeGroups[i].listPayees[0].domesticPayeeType ? data.payeeGroups[i].listPayees[0].domesticPayeeType : "",
                        currency: data.payeeGroups[i].listPayees[0].currency ? data.payeeGroups[i].listPayees[0].currency : ""
                    });
                } else {
                    if (transferObject && transferObject.isFavoriteTransaction && transferObject.groupId === data.payeeGroups[i].groupId) {
                        self.selectedPayee(data.payeeGroups[i].name);
                    }
                    self.payeeListExpandAll.push({
                        payeeGroupName: data.payeeGroups[i].name,
                        payeeList: data.payeeGroups[i].listPayees,
                        groupId: data.payeeGroups[i].groupId
                    });
                }
            }
            if (data.payeeGroups.length === 0) {
                self.isPayeeListEmpty(true);
            }
            ko.tasks.runEarly();
            self.dropdownLevelOne(true);
            self.requestPageLoad(true);
            if (self.selectedPayee()) {
                if (self.userSegment !== "CORP") {
                    self.payeeChanged({}, {
                        option: "value",
                        optionMetadata: { trigger: true }
                    });
                } else if (transferObject && transferObject.isFavoriteTransaction) {
                    self.corporatePayeeChange({ detail: { value: transferObject.payeeId } });
                }
            }
        }
        self.emptyFields = function() {
            if (self.isStandingInstruction()) {
                self.frequencyLoaded(false);
            }
            self.transferAmount("");
            self.transferCurrency("");
            self.valuedate("");
            self.otherPurposeValue("");
            self.purpose("");
            self.siStartDate("");
            self.otherDetails("");
            self.siEndDate("");
            self.instances("");
            self.note("");
            ko.tasks.runEarly();
            if (self.isStandingInstruction()) {
                self.frequencyLoaded(true);
            }
        };

        function emptyPeertoPeer() {
            self.peerToPeerModel.amount.amount("");
            self.peerToPeerModel.transferValue("");
            self.confirmTransferValue("");
            self.peerToPeerModel.remarks("");
        }

        var transferCurrency = self.transferCurrency.subscribe(function() {
            if (self.userSegment === "CORP" && !self.isMultiplePayment && !self.isStandingInstruction()) {
                self.dealsAvailable(true);
                self.usePreBookedDeal([]);
                self.showList(false);
            }
        });

        self.transferToChange = function(event) {
            if (event) {
                if (event.detail.value) {
                    self.transferOn("now");
                    self.noteComponentLoaded(false);
                    self.refreshDropDown();
                    if (event.detail.value === "adhoc") {
                        self.adhoc(true);
                        emptyPeertoPeer();
                    } else {
                        self.adhoc(false);
                        if (event.detail.value === "self") {
                            self.currentTask("PC_F_SELF");
                            self.loadSelf();
                        }
                    }
                    self.noteComponentLoaded(true);
                    self.transferOn(self.transferOnArray[0].id);
                }
            } else {
                self.adhoc(false);
                self.currentTask("PC_F_SELF");
                self.loadSelf();
                self.noteComponentLoaded(true);
                self.transferOn(self.transferOnArray[0].id);
            }
        };
        function checkSelfTransfer(){
          if(self.params){
              if (self.params === "ownAccountTransfer" || (self.params.transferObject && self.params.transferObject().payeeType === "SELF")) {
                  self.transferTo("self");
                  self.transferToChange(null, { option: "checked" });
                  if (self.params.transferObject) {
                      self.transferAmount(self.params.transferObject().amount);
                      self.transferCurrency(self.params.transferObject().currency);
                      self.note(self.params.transferObject().note);
                  }
              } else {
                  self.transferTo();
              }
          }
        }
        checkSelfTransfer();
        self.transferTo(self.transferTo() ? self.transferTo() : self.transferToArray[0].id);
        self.getPayLoad = function(paymentMode) {
            var model;
            if (isTransferMode("INTERNAL")) {
                if (paymentMode === "now") {
                    model = self.internalPaymentPayload;
                    self.transactionType("INTERNALFT");
                } else {
                    model = self.internalPayLaterPayload;
                    self.transactionType("INTERNALFT_PAYLATER");
                }
            } else if (isTransferMode("INTERNATIONAL")) {
                if (paymentMode === "now") {
                    model = self.internationalPaymentPayload;
                    self.transactionType("INTERNATIONALFT");
                } else {
                    model = self.internationalPayLaterPayload;
                    self.transactionType("INTERNATIONALFT_PAYLATER");
                }
            } else if (isTransferMode("DOMESTIC")) {
                if (paymentMode === "now") {
                    model = self.domesticPaymentPayload;
                    self.transactionType("DOMESTICFT");
                } else {
                    model = self.domesticPayLaterPayload;
                    self.transactionType("DOMESTICFT_PAYLATER");
                }
                if (self.domesticPayeeType() === "INDIA")
                    model.network = null;

                if (self.domesticPayeeType() === "INDIA" || self.domesticPayeeType() === "UK") {
                    if (model.sepaDomestic) {
                        model.sepaDomestic = null;
                    }
                    if (model.sepaDomesticPayout) {
                        model.sepaDomesticPayout = null;
                    }
                } else if (self.domesticPayeeType() === "SEPA") {
                    if (model.sepaDomestic) {
                        model.sepaDomestic.oinNumber(self.oinNumber());
                        model.sepaDomestic.oinDescription(self.oinDescription());
                        model.sepaDomestic.amount.amount(self.transferAmount());
                        model.sepaDomestic.amount.currency(self.transferCurrency());
                        model.sepaDomestic.payeeId(self.customPayeeId());
                    }
                    if (model.sepaDomesticPayout) {
                        model.sepaDomesticPayout.oinNumber(self.oinNumber());
                        model.sepaDomesticPayout.oinDescription(self.oinDescription());
                        model.sepaDomesticPayout.amount.amount(self.transferAmount());
                        model.sepaDomesticPayout.amount.currency(self.transferCurrency());
                        model.sepaDomesticPayout.payeeId(self.customPayeeId());
                    }
                }
            } else if (isTransferMode("PEERTOPEER")) {
                model = self.peerToPeerModel;
                self.ispeerToPeer(true);
            } else if (self.transferMode("SELF")) {
                if (paymentMode === "now") {
                    model = self.selfPaymentPayload;
                    self.transactionType("SELFFT");
                } else {
                    model = self.selfPayLaterPayload;
                    self.transactionType("SELFFT_PAYLATER");
                }
            }

            return model;
        };

        if (self.isMultiplePayment) {
            hostDateHandler(self.supportingData.currentDate);
            payeeListHandler(self.supportingData.payeeList);
        } else {
            MoneyTransferModel.getHostDate().done(function(data) {
                hostDateHandler(data);
                if (self.userSegment === "RETAIL") {
                    checkUpcomingPaymentTill = new Date(today);
                    MoneyTransferModel.getMaintenances().then(function(maintenances) {
                        checkUpcomingPayment = (ko.utils.arrayFirst(maintenances.configurationDetails, function(config) {
                            return config.propertyId === "CHECK_UPCOMING_PAYMENT";
                        }).propertyValue) === "Y";
                        checkUpcomingPayment = true;
                        if (checkUpcomingPayment) {
                            checkUpcomingDays = Number(ko.utils.arrayFirst(maintenances.configurationDetails, function(config) {
                                return config.propertyId === "CHECK_UPCOMING_PAYMENT_FOR_DAYS";
                            }).propertyValue);
                            checkUpcomingDays = 30;
                            checkUpcomingPaymentTill.setDate(checkUpcomingPaymentTill.getDate() + checkUpcomingDays);
                        }
                    });
                }
            });
            MoneyTransferModel.getPayeeList(self.isStandingInstruction()).done(function(data) {
                payeeListHandler(data);
            });
        }

        function multiplePaymentHandler(payload, makeAcopy) {
            self.referenceHandel.payload = payload;
            self.referenceHandel.uri.value = self.transferOn() === "now" ? "/payments/{paymentType}/{transferType}" : "/payments/instructions/{paymentType}/{transferType}";
            self.referenceHandel.uri.params = {
                paymentType: self.urlAttribute1(),
                transferType: self.urlAttribute2()
            };
            var sourceAccountDetails = self.additionalDetailsFrom().account;
            self.overviewDetails({
                nickName: self.customPayeeName(),
                dbtAccount: sourceAccountDetails.id.displayValue,
                dbtAccountBalance: rootParams.baseModel.formatCurrency(sourceAccountDetails.equivalentAvailableBalance.amount, sourceAccountDetails.equivalentAvailableBalance.currency),
                amount: rootParams.baseModel.formatCurrency(self.transferAmount(), self.transferCurrency()),
                crtAccount: self.payeeDetails().accountNumber,
                valueDate: rootParams.baseModel.formatDate(self.valuedate() || oj.IntlConverterUtils.dateToLocalIso(self.formattedToday()))
            });
            self.showPaymentOverview(true);
            void(makeAcopy && self.addPayment(self.referenceHandel.id));
        }

        function prepareModel(model, isStandingInstruction) {
            if (isTransferMode("INTERNATIONAL")) {
                self.chargesDescription(self.charges().split("_")[1]);
                model.charges(self.charges().split("_")[0]);
            } else if (isTransferMode("DOMESTIC") && self.domesticPayeeType() === "INDIA") {
                model.network = self.network();
            } else if (isTransferMode("DOMESTIC") && self.domesticPayeeType() === "UK") {
                self.chargesDescription(self.charges().split("_")[1]);
                model.charges(self.charges().split("_")[0]);
            }
            model.amount.amount(self.transferAmount());
            model.amount.currency(self.transferCurrency());
            if (self.otherPurpose()) {
                model.purpose("OTH");
                model.purposeText(self.otherPurposeValue());
                self.purposeDescription(self.otherPurposeValue());
            } else if (model.purpose && typeof self.purpose() === "undefined") {
                if (model.purpose() === null) {
                    self.purposeDescription("");
                } else if (self.purpose()) {
                    self.purposeDescription(self.purpose().split("_")[1]);
                }
                model.purpose(null);
            } else if (self.purpose()) {
                model.purpose(self.purpose().split("_")[0]);
            }
            if (self.srcAccount() && self.srcAccount() !== null) {
                model.debitAccountId.displayValue(self.srcAccount().split("-")[1]);
                model.debitAccountId.value(self.srcAccount().split("-")[0]);
            }
            if (model.payeeId) {
                model.payeeId(self.customPayeeId());
            }
            if (model.startDate) {
                model.startDate(self.valuedate());
            }
            if (model.endDate) {
                model.endDate(self.valuedate());
            }
            if (model.creditAccountId) {
                model.creditAccountId.value(self.customPayeeId());
                model.creditAccountId.displayValue(self.customPayeeName());
            }
            if (model.otherDetails) {
                model.otherDetails.line1(self.otherDetails());
            }
            if (model.remarks) {
                model.remarks(self.note());
            }
            if (isStandingInstruction) {
                model.type("REC");
                model.frequency(self.frequency().split("_")[0]);
                self.frequencyDescription(self.frequency().split("_")[1]);
                model.startDate(self.siStartDate());
                if (self.siEnd() === "PAYLATER") {
                    model.endDate(self.siEndDate());
                } else {
                    model.instances(self.instances());
                    model.endDate(null);
                }
            }
            if (self.dealId()) {
                model.dealId(self.dealId());
            }
            return model;
        }
        var paynowWithSIpaymentId;

        function checkUpcomingPaymentsList() {
            MoneyTransferModel.getUpcomingPaymentsList(oj.IntlConverterUtils.dateToLocalIso(today), oj.IntlConverterUtils.dateToLocalIso(checkUpcomingPaymentTill), self.payeeDetails().accountNumber).then(function(upcomingPaymentsList) {
                if (upcomingPaymentsList && upcomingPaymentsList.instructionsList && upcomingPaymentsList.instructionsList.length > 0) {
                    rootParams.baseModel.showMessages(null, [rootParams.baseModel.format(self.payments.warningMessage, { X: checkUpcomingDays })], "INFO");
                }
            });
        }

        function showMessages(status) {
            for (var i = 0; i < status.length; i++) {
                if (status[i].detail || status[i].errorMessage)
                    rootParams.baseModel.showMessages(null, [status[i].detail || status[i].errorMessage], status[i].type || "ERROR");
            }
        }

        function analyzeResponse(responseJSON) {
            if (responseJSON.message) {
                if (responseJSON.message.validationError) {
                    showMessages(responseJSON.message.validationError);
                } else {
                    showMessages([responseJSON.message]);
                }
            }
            if (responseJSON.status && responseJSON.status.message) {
                showMessages([responseJSON.status.message]);
            }
        }
        self.initiatePayment = function(makeAcopy) {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("paymentsTracker" + (self.referenceHandel ? self.referenceHandel.id : ""))))
                return;
            void(self.defaultData && self.defaultData.transferObject && self.defaultData.transferObject(null));
            if (self.isStandingInstruction() !== null && self.isStandingInstruction()) {
                self.transferOn("later");
            }
            self.model(prepareModel(self.getPayLoad(self.transferOn()), self.isStandingInstruction()));
            var payload = ko.toJSON(self.model());
            if (self.isMultiplePayment)
                multiplePaymentHandler(payload, makeAcopy);
            else if (self.paynowWithSI().length) {
                MoneyTransferModel.fireBatch({
                    batchDetailRequestList: [{
                        methodType: "POST",
                        uri: {
                            value: "/payments/instructions/{paymentType}/{transferType}",
                            params: {
                                paymentType: self.urlAttribute1(),
                                transferType: self.urlAttribute2()
                            }
                        },
                        payload: payload,
                        headers: {
                            "Content-Id": 1,
                            "Content-Type": "application/json"
                        }
                    }, {
                        methodType: "POST",
                        uri: {
                            value: "/payments/{paymentType}/{transferType}",
                            params: {
                                paymentType: self.urlAttribute1(),
                                transferType: self.urlAttribute2()
                            }
                        },
                        payload: ko.toJSON(prepareModel(self.getPayLoad("now"), false)),
                        headers: {
                            "Content-Id": 2,
                            "Content-Type": "application/json"
                        }
                    }]
                }, transferModeDetails[self.transferMode().toUpperCase()].batchType.create).done(function(data) {
                    document.getElementById("message-box").closeAll();
                    var atLeastOneFailure;
                    for (var i = 0; i < data.batchDetailResponseDTOList.length; i++) {
                        switch (Number(data.batchDetailResponseDTOList[i].sequenceId)) {
                            case 1:
                                self.paymentId(data.batchDetailResponseDTOList[i].responseObj.instructionId);
                                break;
                            case 2:
                                paynowWithSIpaymentId = data.batchDetailResponseDTOList[i].responseObj.paymentId;
                        }
                        if (!atLeastOneFailure) {
                            atLeastOneFailure = data.batchDetailResponseDTOList[i].status > 202;
                        }
                        analyzeResponse(data.batchDetailResponseDTOList[i].responseObj);
                    }
                    if (!atLeastOneFailure && checkUpcomingPayment && self.transferMode() !== "SELF") {
                        checkUpcomingPaymentsList();
                    }
                    self.stageOne(atLeastOneFailure);
                    self.stageTwo(!atLeastOneFailure);
                });
            } else {
                MoneyTransferModel.initiatePayment(payload, self.urlAttribute1(), self.urlAttribute2(), self.transferOn()).done(function(data) {
                    if (checkUpcomingPayment && self.transferMode() !== "SELF") {
                        checkUpcomingPaymentsList();
                    }
                    self.paymentId(data.paymentId ? data.paymentId : data.instructionId);
                    self.stageOne(false);
                    self.stageTwo(true);
                }).fail(function() {
                    self.cancelPayment();
                });
            }
        };

        var masterBatchArray = [];
        self.viewPaymentStatus = function() {
            rootParams.baseModel.registerComponent("multiple-payments-status", "payments");
            rootParams.dashboard.loadComponent("multiple-payments-status", { statusData: masterBatchArray }, self);
        };
        self.paymentData = ko.observable();
        self.isInitAuth = ko.observable(false);
        self.verifyPayment = function() {
            if (self.paynowWithSI().length) {
                MoneyTransferModel.fireBatch({
                    batchDetailRequestList: [{
                        methodType: "PATCH",
                        uri: {
                            value: "/payments/instructions/{paymentType}/{transferType}/{paymentId}",
                            params: {
                                paymentType: self.urlAttribute1(),
                                transferType: self.urlAttribute2(),
                                paymentId: self.paymentId()
                            }
                        },
                        headers: {
                            "Content-Id": 1,
                            "Content-Type": "application/json"
                        }
                    }, {
                        methodType: "PATCH",
                        uri: {
                            value: "/payments/{paymentType}/{transferType}/{paymentId}",
                            params: {
                                paymentType: self.urlAttribute1(),
                                transferType: self.urlAttribute2(),
                                paymentId: paynowWithSIpaymentId
                            }
                        },
                        headers: {
                            "Content-Id": 2,
                            "Content-Type": "application/json"
                        }
                    }, {
                        methodType: "GET",
                        uri: {
                            value: "/payments/{paymentType}/{transferType}/{paymentId}",
                            params: {
                                paymentType: self.urlAttribute1(),
                                transferType: self.urlAttribute2(),
                                paymentId: paynowWithSIpaymentId
                            }
                        },
                        headers: {
                            "Content-Id": 3,
                            "Content-Type": "application/json"
                        }
                    }]
                }, transferModeDetails[self.transferMode().toUpperCase()].batchType.update).done(function(data, status, jqXHR) {
                    document.getElementById("message-box").closeAll();
                    for (var i = 0; i < data.batchDetailResponseDTOList.length; i++) {
                        if (data.batchDetailResponseDTOList[i].sequenceId === "3") {
                            self.paymentData().payNowDate = data.batchDetailResponseDTOList[i].responseObj.payoutDetails ? data.batchDetailResponseDTOList[i].responseObj.payoutDetails.valueDate : data.batchDetailResponseDTOList[i].responseObj.transferDetails.valueDate;
                            self.paymentData().payeeDetails = self.payeeDetails();
                        } else if (data.batchDetailResponseDTOList[i].sequenceId === "1") {
                            self.paymentData().SIexternalRefId = data.batchDetailResponseDTOList[i].responseObj.externalReferenceId;
                        } else if (data.batchDetailResponseDTOList[i].sequenceId === "2") {
                            self.paymentData().payNowExternalRefId = data.batchDetailResponseDTOList[i].responseObj.externalReferenceId;
                        }
                    }
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        transactionName: self.payments.setstandinginstruction_header,
                        confirmScreenExtensions: {
                            confirmScreenMsgEval: function(data) {
                                if (data.sequenceId === "1") {
                                    return data.status > 202 ? self.payments.common.confirmScreen.SI.fail : self.payments.common.confirmScreen.SI.success;
                                } else if (data.sequenceId === "2") {
                                    return data.status > 202 ? self.payments.common.confirmScreen.paynow.fail : self.payments.common.confirmScreen.paynow.success;
                                }
                            },
                            isSet: true,
                            resource: self.payments,
                            data: self.paymentData(),
                            confirmScreenDetails: self.confirmScreenDetails(),
                            template: "confirm-screen/standing-instruction-" + self.transferMode().toLowerCase()
                        }
                    });
                });
            } else {
                MoneyTransferModel.verifyPayment(self.urlAttribute1(), self.urlAttribute2(), self.paymentId(), self.transferOn()).done(function(data, status, jqXHR) {
                    document.getElementById("message-box").closeAll();
                    self.externalReferenceId(data.externalReferenceId);
                    self.securityCode(data.securityCode);
                    self.transactionName = self.payments.moneytransfer.transactionMessage[self.urlAttribute2()];
                    self.stageTwo(false);
                    self.httpStatus = jqXHR.status;
                    var successMessage, statusMessages;
                    if (self.userSegment === "CORP" && self.httpStatus && self.httpStatus !== 202) {
                        successMessage = self.payments.common.confirmScreen.successMessage;
                        statusMessages = self.payments.common.completed;
                    } else if (self.userSegment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                        successMessage = self.payments.common.confirmScreen.corpMaker;
                        statusMessages = self.payments.moneytransfer.pendingApproval;
                    } else if (self.userSegment !== "CORP" && !self.isStandingInstruction()) {
                        successMessage = self.payments.common.confirmScreen.successMessage;
                        statusMessages = self.payments.common.success;
                    } else {
                        successMessage = self.payments.common.confirmScreen.successSI;
                        statusMessages = self.payments.common.success;
                    }
                    var header = self.payments.moneytransfer_header_retail;
                    if (self.isStandingInstruction()) {
                        header = self.payments.setstandinginstruction_header;
                    }
                    var shareMessage;
                    if ($.inArray(self.currentTask(), [
                            "PC_F_SELF",
                            "PC_F_IT",
                            "PC_F_DOM",
                            "PC_F_INTRNL"
                        ]) > -1) {
                        shareMessage = rootParams.baseModel.format(self.shareMessage(), {
                            transactionName: header,
                            referenceNumber: data.externalReferenceId
                        });
                    }
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        hostReferenceNumber: data.externalReferenceId,
                        transactionName: header,
                        shareMessage: shareMessage,
                        isMoneyTransfer: true,
                        favorite: !self.isStandingInstruction() && !data.securityCode,
                        repeat: !self.isStandingInstruction() && (self.transferTo() === "self" || isTransferMode("INTERNAL") || (isTransferMode("DOMESTIC") && self.domesticPayeeType().toUpperCase() === "INDIA")),
                        confirmScreenExtensions: {
                            successMessage: successMessage,
                            statusMessages: statusMessages,
                            isSet: true,
                            taskCode: self.currentTask(),
                            eReceiptRequired: true,
                            confirmScreenDetails: self.confirmScreenDetails(),
                            template: "confirm-screen/payments-template"
                        },
                        additionalDetails: data.securityCode ? {
                            items: [{
                                label: self.payments.moneytransfer.securityCode,
                                value: data.securityCode
                            }]
                        } : false
                    }, self);
                }).fail(function() {
                    self.cancelPayment();
                });
            }
        };
        self.cancelPayment = function() {
            self.stageTwo(false);
            self.stageOne(true);
        };
        var payeetypesMap = {
            DEMANDDRAFT: "demandDraft",
            INTERNAL: "internal",
            DOMESTIC: "domestic",
            INTERNATIONAL: "international",
            PEERTOPEER: "peerToPeer"
        };

        function checkSI() {
            if ((self.data() && self.data().transferDataPayee) || (self.defaultData && self.defaultData.transferDataPayee)) {
                var payeeId, groupId, payeeTransferData = self.data().transferDataPayee || self.defaultData.transferDataPayee;
                payeeId = payeeTransferData.id;
                groupId = payeeTransferData.groupId;
                self.selectedPayee(self.userSegment === "CORP" ? payeeId : payeeTransferData.name);
                if ((payeeId && payeeId !== null) || (groupId && groupId !== null)) {
                    MoneyTransferModel.getPayeeData(payeeId, groupId, payeetypesMap[payeeTransferData.payeeType]).done(function(data) {
                        var obj = {};
                        if (data.internalPayee) {
                            obj = ko.toJS(data.internalPayee);
                            obj.payeeType = self.payments.payee.type[obj.payeeType];
                            data.internalPayee.payeeData = obj;
                            data.internalPayee.startDate = transferObject ? transferObject.valueDate : null;
                            self.setPayee(data.internalPayee);
                        } else if (data.internationalPayee) {
                            obj = ko.toJS(data.internationalPayee);
                            obj.payeeType = self.payments.payee.type[obj.payeeType];
                            data.internationalPayee.payeeData = obj;
                            data.internationalPayee.startDate = transferObject ? transferObject.valueDate : null;
                            self.setPayee(data.internationalPayee);
                        } else if (data.domesticPayee) {
                            if (data.domesticPayee.indiaDomesticPayee) {
                                obj = ko.toJS(data.domesticPayee.indiaDomesticPayee);
                                data.domesticPayee = data.domesticPayee.indiaDomesticPayee;
                                data.domesticPayee.domesticPayeeType = "INDIA";
                            } else if (data.domesticPayee.ukDomesticPayee) {
                                obj = ko.toJS(data.domesticPayee.ukDomesticPayee);
                                data.domesticPayee = data.domesticPayee.ukDomesticPayee;
                                data.domesticPayee.domesticPayeeType = "UK";
                            } else if (data.domesticPayee.sepaDomesticPayee) {
                                obj = ko.toJS(data.domesticPayee.sepaDomesticPayee);
                                data.domesticPayee = data.domesticPayee.sepaDomesticPayee;
                                data.domesticPayee.domesticPayeeType = "SEPA";
                            }
                            obj.payeeType = self.payments.payee.type[obj.payeeType];
                            data.domesticPayee.payeeData = obj;
                            data.domesticPayee.startDate = transferObject ? transferObject.valueDate : null;
                            self.setPayee(data.domesticPayee);
                        } else if (data.peerToPeerPayee) {
                            obj = ko.toJS(data.peerToPeerPayee);
                            obj.payeeType = self.payments.payee.type[data.peerToPeerPayee.payeeType];
                            data.peerToPeerPayee.payeeData = obj;
                            self.setPayee(data.peerToPeerPayee);
                        }
                    });
                }
            }
        }
        checkSI();

        /**
         * This function will help to load the exchangeRate.
         *
         * @memberOf payments-money-transfer
         * @function exchangeRate
         * @param {object} exchangeCodes Sets the Exchange Codes
         * @param {object} swap Flag to swap currencies
         * @returns {void}
         */
        self.exchangeRate = function(exchangeCodes, swap) {
            MoneyTransferModel.getExchangeRate(exchangeCodes).then(function(response) {
                if (response.exchangeRateDetails && self.transferCurrency() === response.exchangeRateKey.ccy2Code) {
                    self.currentExchangeRate(rootParams.baseModel.formatCurrency(response.exchangeRateDetails[0].buyRate, self.transferCurrency()));
                } else if (response.exchangeRateDetails && self.transferCurrency() === response.exchangeRateKey.ccy1Code) {
                    self.currentExchangeRate(rootParams.baseModel.formatCurrency(response.exchangeRateDetails[0].sellRate, self.transferCurrency()));
                } else if (swap) {
                    self.exchangeRate({
                        branchCode: exchangeCodes.branchCode,
                        ccy1Code: exchangeCodes.ccy2Code,
                        ccy2Code: exchangeCodes.ccy1Code
                    }, false);
                }
            });
        };

        function fromFavorite() {
            if ((transferObject && transferObject.isFavoriteTransaction) || (self.defaultData && ko.utils.unwrapObservable(self.defaultData.transferObject))) {
                var data = transferObject ? transferObject : self.defaultData.transferObject;
                self.fromFavourites(true);
                if (data.creditAccountId !== null) {
                    self.transferTo("self");
                    self.customPayeeId(data.creditAccountId);
                    self.creditAccountDisplayValue(data.creditAccountDisplayValue);
                    self.transferCurrency("");
                    self.loadSelf();
                    self.customCurrencyURL("payments/currencies?type=SELFFT&currency=" + data.currency);
                    setTaskCode();
                }
                if (data.transactionType.indexOf("PAYLATER") > -1) {
                    self.valuedate(null);
                    self.transferLater(true);
                    self.transferOn(self.transferOnArray[1].id);
                    if (self.transferTo() === "self") {
                        self.model(self.selfPayLaterPayload);
                    }
                } else {
                    self.transferLater(false);
                    self.transferOn(self.transferOnArray[0].id);
                }
                self.transferAmount(data.amount);
                self.transferCurrency(data.currency);
                self.srcAccount(data.debitAccountId);
                self.note(data.remarks);
                self.otherDetails(data.paymentDetails);
            }
        }
        fromFavorite();
        if (self.isStandingInstruction()) {
            MoneyTransferModel.getRepeateIntervals().done(function(data) {
                if (data.enumRepresentations !== null) {
                    for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        self.frequencyArray.push({
                            code: data.enumRepresentations[0].data[i].code,
                            description: self.payments.moneytransfer.frequencyLabel[data.enumRepresentations[0].data[i].description]
                        });
                    }
                    self.frequencyLoaded(true);
                }
            });
        }
        self.cancel = function() {
            rootParams.dashboard.openDashBoard(self.payments.common.cancelConfirm);
        };
        self.openAdhocTransfer = function() {
            if (self.userSegment !== "CORP")
                rootParams.changeView("adhoc-payments");
            else
                rootParams.dashboard.loadComponent("adhoc-payments", {}, self);
        };
        self.openMultipleTransfer = function() {
            if (self.userSegment !== "CORP")
                rootParams.changeView("multiple-payments");
            else
                rootParams.dashboard.loadComponent("multiple-payments", {}, self);
        };
        var favoritePersistedSuccessfully = false;
        self.persistFavorites = function() {
            self.favoritesPayLoad.id(self.paymentId());
            self.favoritesPayLoad.transctionType(self.transactionType());
            self.favoritesPayLoad.payeeId(self.customPayeeId());
            self.favoritesPayLoad.amount.currency(self.model().amount.currency());
            self.favoritesPayLoad.amount.amount(self.model().amount.amount());
            self.favoritesPayLoad.debitAccountId.value(self.model().debitAccountId.value());
            if (self.model().creditAccountId)
                self.favoritesPayLoad.creditAccountId.value(self.model().creditAccountId.value());
            else
                self.favoritesPayLoad.creditAccountId = null;

            if (self.domesticPayeeType() === "INDIA")
                self.favoritesPayLoad.network(self.network());

            self.favoritesPayLoad.purpose(self.model().purpose ? self.model().purpose() : null);
            self.favoritesPayLoad.remarks(self.model().remarks());
            self.favoritesPayLoad.payeeGroupId(self.groupId());
            self.favoritesPayLoad.valueDate(self.model().startDate);
            self.favoritesPayLoad.payeeAccountName(self.transactionType() === "SELFFT" || self.transactionType() === "SELFFT_PAYLATER" ? self.payments.selfPayeeName : self.payeeDetails().accountName);
            self.favoritesPayLoad.payeeNickName(self.transactionType() === "SELFFT" || self.transactionType() === "SELFFT_PAYLATER" ? null : self.customPayeeName());
            self.favoritesPayLoad.charges(self.model().charges ? self.model().charges() : null);
            self.favoritesPayLoad.internationalPaymentDetails(self.otherDetails());
            self.favoritesPayLoad.otherPurposeText(self.otherPurposeValue());
            MoneyTransferModel.addFavorites(ko.toJSON(self.favoritesPayLoad)).done(function() {
                self.favoriteSuccess();
            }).fail(function() {
                self.closeFavoriteModal();
            });
        };
        self.stageFavoriteSuccess = ko.observable(false);
        self.stageFavoriteAdd = ko.observable(true);
        self.addToFavorites = function() {
            if (!favoritePersistedSuccessfully) {
                self.stageFavoriteAdd(true);
                $("#favoritesDialog").trigger("openModal");
            }
        };
        self.favoriteSuccess = function() {
            self.stageFavoriteAdd(false);
            self.stageFavoriteSuccess(true);
            favoritePersistedSuccessfully = true;
        };
        self.closeFavoriteModal = function() {
            $("#favoritesDialog").trigger("closeModal");
            self.stageFavoriteSuccess(false);
            self.stageFavoriteAdd(true);
        };
        self.currencyParser = function(data) {
            var output = {};
            output.currencies = [];
            if (data) {
                if (data.currencyList && data.currencyList !== null) {
                    for (var i = 0; i < data.currencyList.length; i++) {
                        output.currencies.push({
                            code: data.currencyList[i].code,
                            description: data.currencyList[i].code
                        });
                    }
                }
            }
            return output;
        };
        var additionalDetails = self.additionalDetails.subscribe(function(newValue) {
            if (self.transferTo() === "self") {
                self.customPayeeId(newValue.account.id.value);
                self.customCurrencyURL(null);
                if (!self.dealDetails()) {
                    self.currentExchangeRate(null);
                    self.dealDetails(false);
                    self.usePreBookedDeal([]);
                    self.showList(false);
                }
                self.loadSelf();
                self.customCurrencyURL("payments/currencies?type=SELFFT&currency=" + newValue.account.currencyCode);
            }
        });

        var additionalDetailsFrom = self.additionalDetailsFrom.subscribe(function() {
            if (self.transferTo() === "self") {
                if (!self.dealDetails()) {
                    self.currentExchangeRate(null);
                    self.dealDetails(false);
                    self.dealsAvailable(true);
                    self.usePreBookedDeal([]);
                    self.showList(false);
                }
            }
        });

        /**
         * This function will be triggered to cleanup the memory allocated to subscribed functions.
         *
         * @memberOf payments-money-transfer
         * @function dispose
         * @returns {void}
         */
        self.dispose = function() {
            transferCurrency.dispose();
            additionalDetails.dispose();
            additionalDetailsFrom.dispose();
        };

        self.instanceOptionChangeHandler = function(event) {
            if (event.detail.value)
                self.isEndDateRequired(event.detail.value === "PAYLATER");
        };
        self.confirmDeleteFavourite = function() {
            MoneyTransferModel.deleteFavourite(transferObject.paymentId, transferObject.transactionType).done(function(data, status, jqXHR) {
                self.removeFavouriteFlag(false);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    template: "confirm-screen/payments-template",
                    transactionName: self.payments.moneytransfer.successmsg5
                }, self);
            });
        };
        self.removeFavourite = function() {
            self.stageOne(false);
            self.removeFavouriteFlag(true);
        };
        self.setupRepeatTransfer = function() {
            self.transferObject({
                isStandingInstruction: true,
                payeeId: self.customPayeeId(),
                nickName: self.customPayeeName(),
                payeeType: self.transferMode(),
                domesticPayeeType: self.domesticPayeeType(),
                amount: self.model().amount.amount(),
                currency: self.model().amount.currency(),
                srcAccount: self.model().debitAccountId.value(),
                purpose: ko.utils.unwrapObservable(self.model().purpose()),
                purposeDescription: self.purposeDescription(),
                note: self.note(),
                charges: self.charges(),
                otherPurpose: self.otherPurposeValue(),
                oinNumber: self.oinNumber(),
                oinDescription: self.oinDescription()
            });
            if (self.userSegment === "CORP") {
                rootParams.dashboard.loadComponent("payments-money-transfer", {
                    isStandingInstruction: true,
                    transferObject: self.transferObject
                }, self);
            } else {
                self.selectedTab = "";
                rootParams.dashboard.loadComponent("manage-accounts", {
                    applicationType: "standing-instructions",
                    defaultTab: "payments-money-transfer",
                    isStandingInstruction: true,
                    transferObject: self.transferObject
                }, self);
            }
        };
        self.cancelDeletion = function() {
            self.removeFavouriteFlag(false);
            self.stageOne(true);
        };
        self.editSavedPayment = function() {
            self.showPaymentOverview(false);
        };
        self.filterBranchDetails = function(accountBranch) {
            var branchAddress = [ko.utils.unwrapObservable(accountBranch.code), ko.utils.unwrapObservable(accountBranch.name)].concat(ko.utils.unwrapObservable(accountBranch.name) === ko.utils.unwrapObservable(accountBranch.branch) ? [] : [ko.utils.unwrapObservable(accountBranch.branch)]).concat([ko.utils.unwrapObservable(accountBranch.address), ko.utils.unwrapObservable(accountBranch.city), ko.utils.unwrapObservable(accountBranch.country)]);
            return branchAddress.filter(function(n) { return (n && n.trim() !== ""); }).join(", ");
        };
    };
});
