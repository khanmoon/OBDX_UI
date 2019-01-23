define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/bill-payments",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, billPaymentModel, BaseLogger, ResourceBundle, Constants) {
    "use strict";
    return function (Params) {
        var self = this, baseModel = Params.baseModel, autopopulate = false, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(billPaymentModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, Params.rootModel);
        self.defaultData = ko.utils.unwrapObservable(Params.options ? Params.options.data : Params.rootModel.params);
        self.forModification = self.params && self.params.transactionId;
        if (self.params && Object.keys(self.params).length > 0 && (self.params.autopopulate || self.params.isFavoriteTransaction)) {
            self.paymentData = self.params;
            autopopulate = true;
        } else if (self.defaultData && self.defaultData.autopopulate) {
            self.paymentData = self.defaultData;
            autopopulate = true;
        } else if (self.forModification) {
            self.paymentData = self.params;
            self.transactionId = self.params.transactionId + "#" + self.params.versionId;
        }
        self.userSegment = Constants.userSegment;
        self.resource = ResourceBundle;
        void (!self.isMultipleBillPayment && Params.dashboard.headerName(self.resource.billPayment[self.userSegment === "CORP" ? "title" : "titleRetail"]));
        if (self.isMultipleBillPayment) {
            ko.utils.extend(self, Params.referenceHandle.autoPopulationData);
            self.referenceHandle = Params.referenceHandle;
            self.validationTracker = Params.referenceHandle.validationTracker;
        } else {
            self.billerId = Params.rootModel.previousState? Params.rootModel.previousState.retainedData.billerId :(self.billerId || ko.observable(""));
            self.payBillModel = self.params && self.params.isSuccess ? getNewKoModel().payBillModel : (Params.rootModel.previousState ? Params.rootModel.previousState.retainedData : self.payBillModel) || getNewKoModel().payBillModel;
            self.validationTracker = ko.observable();
        }
        self.favoritesPayLoad = getNewKoModel().favoritesModel;
        self.selectedBillerName = ko.observable();
        self.billerList = ko.observableArray();
        self.isBillerListLoaded = ko.observable(false);
        self.accountList = ko.observableArray();
        self.isAccountListLoaded = ko.observable(false);
        self.stageOne = ko.observable(false);
        self.accounts = ko.observableArray();
        self.billers = ko.observableArray();
        self.billerName = ko.observableArray();
        self.relationshipNumbers = ko.observableArray();
        self.paymentId = ko.observable();
        self.transferFrom = ko.observable(self.payBillModel ? self.payBillModel.debitAccountId.value() : undefined);
        self.addnewbillerLoad = ko.observable(false);
        self.isRelationshipNumbersLoaded = ko.observable(false);
        self.authKey = ko.observable();
        self.invalidOtpEntered = ko.observable(false);
        self.additionalDetails = ko.observable("");
        self.showError = ko.observable(false);
        self.currency = ko.observable();
        self.showRelationShipNumberDetails = ko.observable(false);
        self.externalReferenceId = ko.observable();
        self.currencyLoaded = ko.observable(false);
        self.currentDate = ko.observable();
        self.dropDownActive = ko.observable(false);
        self.customBillerName = ko.observable(null);
        self.customRelationshipNumber = ko.observable(null);
        self.maxbillDate = ko.observable();
        self.selectedBillerCategory = ko.observable();
        self.billPaymentDetails = ko.observable();
        self.removeFavouriteFlag = ko.observable(false);
        self.fromFavourites = ko.observable(false);
        self.isDateLoaded = ko.observable(false);
        self.confirmScreenDetails = ko.observable();
        self.billerMap = {};
        self.currentTask = ko.observable("PC_F_BLPMT");
        baseModel.registerElement([
            "modal-window",
            "confirm-screen",
            "row",
            "amount-input",
            "account-input",
            "comment-box"
        ]);
        baseModel.registerComponent("warning-message-dialog", "payee");
        baseModel.registerComponent("review-bill-payments", "payments");
        baseModel.registerComponent("transfer-view-limits", "financial-limits");
        baseModel.registerComponent("multiple-bill-payments", "payments");
        baseModel.registerComponent("my-limits", "limits-enquiry");

        self.viewLimitsFlag = ko.observable(false);
        self.selectedChannelTypeName = ko.observable();
        self.selectedChannelType = ko.observable();
        self.selectedChannelIndex = ko.observable();
        self.selectedChannel = ko.observable(false);
        self.loadAccessPointList = ko.observable(false);

        self.channelTypeChangeHandler = function() {
            if (self.selectedChannelIndex() !== null) {
                self.selectedChannel(false);
                ko.tasks.runEarly();
                self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
                self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
                self.selectedChannel(true);
            }
        };
        self.channelList = ko.observableArray();
        billPaymentModel.listAccessPoint().done(function(data) {
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

        self.incrementId = baseModel.incrementIdCount();
        function currencyHandler(data) {
            self.currency(data.currencyList[0].code);
            self.currencyLoaded(true);
        }
        if (self.isMultipleBillPayment)
            currencyHandler(self.supportingData.currencies);
        else
            billPaymentModel.getCurrency().done(function (data) {
                currencyHandler(data);
            });

        self.isCommentRequired = ko.observable();
        billPaymentModel.fetchBankConfig().then(function(data){
            self.isCommentRequired(data.bankConfigurationDTO.region === "INDIA");
        });

        self.getBillPaymentDetails = function () {
            billPaymentModel.getBillPaymentDetails(self.paymentData.paymentId()).done(function (data) {
                self.billPaymentDetails(data.transferDetails);
                self.payBillModel.amount.amount(data.transferDetails.amount.amount);
                self.currency(data.transferDetails.amount.currency);
                self.transferFrom(data.transferDetails.debitAccountId.value);
                self.payBillModel.billDate(data.transferDetails.billDate.substr(0, data.transferDetails.billDate.indexOf("T")));
                self.payBillModel.billNumber(data.transferDetails.billNumber);
                self.payBillModel.remarks(data.transferDetails.remarks);
                self.getBillerNames();
            });
        };
        self.setBiller = function (data) {
            self.customRelationshipNumber(data.text);
            self.selectedBillerCategory(data.category);
            self.showError(false);
            self.payBillModel.consumerNumber(data.consumerNumber);
            self.dropDownActive(false);
        };
        self.refreshDropDown = function () {
            self.customBillerName(null);
            self.forModification = false;
            autopopulate = false;
            self.payBillModel.amount.amount("");
            self.selectedBillerName(undefined);
            self.payBillModel.remarks("");
            self.payBillModel.billNumber("");
            self.payBillModel.relationshipNumber();
            self.payBillModel.billDate();
            self.fromFavourites(false);
            self.getBillerNames();
        };
        function hostDateHandler(data) {
            var date = new Date(data.currentDate.valueDate);
            self.maxbillDate(date);
            self.currentDate(baseModel.formatDate(date));
            self.isDateLoaded(true);
        }
        if (!self.currentDate() && !self.isMultipleBillPayment)
            billPaymentModel.getHostDate().done(function (data) {
                hostDateHandler(data);
            });
        else if (self.isMultipleBillPayment)
            hostDateHandler(self.supportingData.currentDate);
        self.paymentFromFavourites = function () {
            if (autopopulate) {
                self.billerId(self.paymentData.billerId ? ko.utils.unwrapObservable(self.paymentData.billerId) : self.paymentData.payeeId);
                self.customBillerName(self.billerMap[self.billerId()]);
                self.payBillModel.relationshipNumber(ko.utils.unwrapObservable(self.paymentData.relationshipNumber));
                if (self.paymentData.payeeId) {
                    self.transferFrom(self.paymentData.debitAccountId);
                    self.payBillModel.amount.amount(self.paymentData.amount);
                    self.currency(self.paymentData.currency);
                    self.payBillModel.remarks(self.paymentData.remarks);
                    self.fromFavourites(true);
                }
            }
        };
        function billerListHandler(data) {
            self.isBillerListLoaded(false);
            self.billerList.removeAll();
            self.billerName.removeAll();
            self.billers.removeAll();
            var firstElement = 0;
            for (var i = 0; i < data.partyBillerDetails.length; i++)
                self.billerList.push(data.partyBillerDetails[i]);
            for (var j = 0; j < self.billerList().length; j++)
                self.billers.push(self.billerList()[j]);
            for (var k = 0; k < self.billers().length; k++)
                self.billerName.push({
                    text: self.billerMap[self.billers()[k][firstElement].billerId],
                    value: self.billers()[k][firstElement].billerId
                });
            self.stageOne(true);
            self.paymentFromFavourites();
            self.isBillerListLoaded(true);
            if (data.partyBillerDetails.length)
                self.isBillerListLoaded(true);
            if (self.forModification) {
                self.payBillModel.billerId(self.billPaymentDetails().billerId);
                self.getRelationshipNumbers({detail: {value: true}});
            } else if (autopopulate) {
                self.payBillModel.billerId(self.billerId());
                self.getRelationshipNumbers({detail: {value: true}});
            } else if (self.payBillModel.billerId())
                self.getRelationshipNumbers({detail: {value: self.payBillModel.billerId()}});
        }
        function billerNamesHandler(data) {
            self.billerMap = {};
            for (var i = 0; i < data.billers.length; i++)
                self.billerMap[data.billers[i].id] = data.billers[i].description;
            if (self.isMultipleBillPayment)
                billerListHandler(self.supportingData.billerList);
            else
                billPaymentModel.getBillers().done(function (data) {
                    billerListHandler(data);
                });
        }
        self.getBillerNames = function () {
            if (self.isMultipleBillPayment)
                billerNamesHandler(self.supportingData.billerNames);
            else
                billPaymentModel.getBillerNames().done(function (data) {
                    billerNamesHandler(data);
                });
        };
        self.getRelationshipNumbers = function (event) {
            if (event.detail.value) {
                self.dropDownActive(false);
                self.isRelationshipNumbersLoaded(false);
                var firstElement = 0;
                var billerId = self.forModification ? self.payBillModel.billerId() : autopopulate ? self.billerId() : event.detail.value;
                self.billerId(billerId);
                self.relationshipNumbers.removeAll();
                for (var i = 0; i < self.billers().length; i++) {
                    if (self.billers()[i][firstElement].billerId === billerId) {
                        var j = i;
                        for (var k = 0; k < self.billers()[j].length; k++) {
                            self.relationshipNumbers.push({
                                text: self.billers()[j][k].relationshipNumber,
                                value: self.billers()[j][k].relationshipNumber,
                                consumerNumber: self.billers()[j][k].consumerNumber,
                                category: self.billers()[j][k].categoryType
                            });
                        }
                    }
                }
                if (!self.fromFavourites() && !self.payBillModel.relationshipNumber()) {
                    var relationshipNo = null;
                    self.payBillModel.relationshipNumber(relationshipNo);
                    $("#relationship").ojSelect("refresh");
                } else if (event.detail.trigger)
                    self.payBillModel.relationshipNumber(null);
                if (self.forModification)
                    self.setBiller({
                        text: self.billPaymentDetails().relationshipNumber,
                        value: self.billPaymentDetails().relationshipNumber,
                        consumerNumber: self.billPaymentDetails().consumerNumber
                    });
                else if (autopopulate)
                    self.setBiller({
                        text: self.paymentData.relationshipNumber,
                        value: self.paymentData.relationshipNumber
                    });
                else if (self.payBillModel.billerId())
                    self.setBiller({
                        text: self.payBillModel.relationshipNumber(),
                        value: self.payBillModel.relationshipNumber()
                    });
                ko.tasks.runEarly();
                self.isRelationshipNumbersLoaded(true);
                self.dropDownActive(true);
            }
        };
        if (self.forModification)
            self.getBillPaymentDetails();
        else
            self.getBillerNames();
        self.getAccounts = function () {
            billPaymentModel.getAccounts().done(function (data) {
                self.isAccountListLoaded(false);
                self.accountList.removeAll();
                self.accountList(data.accounts);
                for (var i = 0; i < self.accountList().length; i++) {
                    self.accounts.push({
                        code: self.accountList()[i].id.value + "-" + self.accountList()[i].currentBalance.amount + "-" + self.accountList()[i].currentBalance.currency + "-" + self.accountList()[i].id.displayValue,
                        description: self.accountList()[i].id.displayValue
                    });
                }
                self.isAccountListLoaded(true);
            });
        };
        self.verifyPayment = function (makeAcopy) {
             if (!baseModel.showComponentValidationErrors(document.getElementById("billPaymentsTracker" + (self.referenceHandle ? self.referenceHandle.id : ""))))
                return;
            self.payBillModel.billerId(self.billerId());
            self.selectedBillerName(self.billerMap[self.billerId()]);
            self.customBillerName(self.billerMap[self.billerId()]);
            self.payBillModel.relationshipNumber(self.fromFavourites() ? self.customRelationshipNumber() : self.payBillModel.relationshipNumber());
            if (self.additionalDetails())
                self.payBillModel.debitAccountId.displayValue(self.additionalDetails().account.id.displayValue);
            self.payBillModel.debitAccountId.value(self.transferFrom());
            self.payBillModel.amount.currency = self.currency();
            var relationshipNumber = self.payBillModel.relationshipNumber();
            var billPaymentPayload = ko.toJSON(self.payBillModel);
            if (self.isMultipleBillPayment) {
                self.referenceHandle.payload = billPaymentPayload;
                self.referenceHandle.uri.value = "/payments/transfers/bill";
                self.referenceHandle.uri.params = {};
                self.overviewDetails({
                    billerName: self.selectedBillerName(),
                    relationshipNumber: self.payBillModel.relationshipNumber(),
                    amount: baseModel.formatCurrency(self.payBillModel.amount.amount(), self.payBillModel.amount.currency),
                    billNumber: self.payBillModel.billNumber(),
                    note: self.payBillModel.remarks(),
                    debitAccountId: self.payBillModel.debitAccountId.displayValue,
                    billDate: baseModel.formatDate(self.payBillModel.billDate())
                });
                self.showPaymentOverview(true);
                void (makeAcopy && self.addPayment(self.referenceHandle.id));
            } else if (self.payBillModel.relationshipNumber() !== null) {
                self.showError(false);
                billPaymentModel.paybill(billPaymentPayload).done(function (data) {
                    self.paymentId(data.paymentId);
                    self.payBillModel.relationshipNumber(relationshipNumber);
                    Params.dashboard.loadComponent("review-bill-payments", {
                        reviewMode: true,
                        header: Params.dashboard.headerName(),
                        paymentId: data.paymentId,
                        confirmScreenDetails: self.confirmScreenDetails(),
                        retainedData: self.payBillModel
                    }, self);
                });
            } else
                self.showError(true);
        };
        self.confirmPayment = function () {
            billPaymentModel.confirmPayment(self.paymentId(), self.transactionId).done(function (data, status, jqXHR) {
                self.baseURL = "payments/transfers/bill/" + self.paymentId();
                self.externalReferenceId(data.externalReferenceId);
                self.httpStatus = jqXHR.status;
                var successMessage, statusMessages, shareMessage;
                if (self.userSegment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                    successMessage = self.resource.common.confirmScreen.corpMaker;
                    statusMessages = self.resource.common.confirmScreen.approvalMessages.PENDING_APPROVAL.statusmsg;
                } else {
                    successMessage = self.resource.billPayment.successMessage;
                    statusMessages = self.resource.billPayment.sucessfull;
                }
                shareMessage = baseModel.format(self.resource.billPayment.shareMessage, {
                    biller: self.selectedBillerName(),
                    amount: baseModel.formatCurrency(self.payBillModel.amount.amount(), self.payBillModel.amount.currency),
                    account: self.payBillModel.debitAccountId.displayValue()
                });
                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    eReceiptRequired: true,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: self.resource.billPayment.titleRetail,
                    shareMessage: shareMessage,
                    confirmScreenExtensions: {
                        successMessage: successMessage,
                        statusMessages: statusMessages,
                        taskCode: self.currentTask(),
                        eReceiptRequired: true,
                        isSet: true,
                        confirmScreenDetails: self.confirmScreenDetails(),
                        template: "confirm-screen/payments-template"
                    },
                    favorite: true
                }, self);
            });
        };
        self.stageFavoriteSuccess = ko.observable(false);
        self.stageFavoriteAdd = ko.observable(true);
        var favoritePersistedSuccessfully = false;
        self.persistFavorites = function () {
            self.favoritesPayLoad.id(self.paymentId());
            self.favoritesPayLoad.payeeId(self.billerId());
            self.favoritesPayLoad.amount.amount(ko.utils.unwrapObservable(self.payBillModel.amount.amount));
            self.favoritesPayLoad.amount.currency(self.currency());
            self.favoritesPayLoad.debitAccountId.value(self.transferFrom());
            self.favoritesPayLoad.remarks(self.payBillModel.remarks());
            self.favoritesPayLoad.payeeAccountName(self.billerMap[self.billerId()]);
            self.favoritesPayLoad.relationshipNumber(self.payBillModel.relationshipNumber());
            for (var i = 0; i < self.relationshipNumbers().length; i++) {
                if (self.relationshipNumbers()[i].value === self.payBillModel.relationshipNumber()) {
                    self.favoritesPayLoad.billerCategory(self.relationshipNumbers()[i].category);
                    break;
                }
            }
            var favoritesPayLoad = ko.toJSON(self.favoritesPayLoad);
            billPaymentModel.addFavorites(favoritesPayLoad).done(function () {
                self.favoriteSuccess();
            }).fail(function () {
                self.closeFavoriteModal();
            });
        };
        self.favoriteSuccess = function () {
            self.stageFavoriteAdd(false);
            self.stageFavoriteSuccess(true);
            favoritePersistedSuccessfully = true;
        };
        self.cancel = function () {
            Params.dashboard.openDashBoard(self.resource.billPayment.cancelConfirm);
        };
        self.closeFavoriteModal = function () {
            $("#favoritesDialog").trigger("closeModal");
            self.stageFavoriteSuccess(false);
            self.stageFavoriteAdd(true);
        };
        self.addToFavorites = function () {
            if (!favoritePersistedSuccessfully) {
                self.stageFavoriteAdd(true);
                $("#favoritesDialog").trigger("openModal");
            }
        };
        self.refreshlist = function (event) {
            if (event.detail.value) {
                var relationshipNumber = self.payBillModel.relationshipNumber();
                if (relationshipNumber === "back") {
                    self.isBillerListLoaded(true);
                    self.isRelationshipNumbersLoaded(false);
                } else {
                    for (var i = 0; i < self.relationshipNumbers().length; i++) {
                        if (relationshipNumber === self.relationshipNumbers()[i].text)
                            self.payBillModel.consumerNumber(self.relationshipNumbers()[i].consumerNumber);
                    }
                }
            }
        };
        self.cancelPayment = function () {
            self.stageOne(true);
        };
        self.confirmDeleteFavourite = function () {
            billPaymentModel.deleteFavourite(self.params.paymentId, self.params.transactionType).done(function (data, status, jqXHR) {
                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: self.resource.billPayment.DeleteFavourites,
                    template: "confirm-screen/payments-template"
                }, self);
                self.removeFavouriteFlag(false);
            });
        };
        self.removeFavourite = function () {
            self.stageOne(false);
            self.removeFavouriteFlag(true);
        };
        self.cancelDeletion = function () {
            self.removeFavouriteFlag(false);
            self.stageOne(true);
        };
        self.openMultipleBillPayments = function () {
            if (self.userSegment === "CORP")
                Params.dashboard.loadComponent("multiple-bill-payments", {}, self);
            else
                Params.changeView("multiple-bill-payments");
        };
        self.viewLimits = function () {
            $("#viewlimits-bill-payment" + self.incrementId).trigger("openModal");
            self.viewLimitsFlag(true);
        };
        self.closeLimitsModal = function () {
            $("#viewlimits-bill-payment" + self.incrementId).trigger("closeModal");
        };
        self.editSavedPayment = function () {
            self.showPaymentOverview(false);
        };
    };
});
