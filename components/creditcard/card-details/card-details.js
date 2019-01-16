define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/credit-card-details",
    "framework/js/constants/constants",
    "ojs/ojconveyorbelt",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojmenu",
    "ojs/ojswitch",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojradioset"
], function (oj, ko, $, CardDetailModel, ResourceBundle, Constants) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.cardObject = self.params;
        self.creditCardObject = self.params;
        self.resource = ResourceBundle;
        self.isActive = ko.observable(true);
        self.isPrimary = ko.observable(true);
        Params.dashboard.headerName(self.resource.creditCardDetails.cardHeading);
        Params.baseModel.registerComponent("account-nickname", "accounts");
        Params.baseModel.registerComponent("reset-pin", "creditcard");
        Params.baseModel.registerComponent("auto-pay", "creditcard");
        Params.baseModel.registerComponent("add-on-card", "creditcard");
        Params.baseModel.registerComponent("card-pay", "creditcard");
        Params.baseModel.registerComponent("card-statement", "creditcard");
        Params.baseModel.registerComponent("block-card", "creditcard");
        Params.baseModel.registerComponent("request-pin", "creditcard");
        Params.baseModel.registerElement("confirm-screen");
        Params.baseModel.registerElement("modal-window");
        Params.baseModel.registerElement("amount-input");
        Params.baseModel.registerElement("comment-box");
        self.viewDetailsLoaded = ko.observable(false);
        self.cardDataForNickname = ko.observable();
        self.cardStatus = ko.observable();
        self.limitsRewardsHeading = ko.observable();
        self.internationalTransactionsStatus = ko.observable();
        self.popupHeader = ko.observable();
        self.popupMsg = ko.observable();
        self.popupBtn = ko.observable();
        self.payload = CardDetailModel.getNewCreditCardDetailsModel();
        self.limitsDetailsObject = ko.observableArray();
        self.limitTypeLocal = ko.observable();
        self.mode = ko.observable("VIEW");
        self.creditLimitCurrency = ko.observable();
        self.validationTracker = ko.observable();
        self.isDataLoaded = ko.observable(false);
        self.initiateLimit = ko.observable(true);
        self.verifyLimit = ko.observable(false);
        self.confirmLimit = ko.observable(false);
        self.creditLimitCurrency(self.params.cardCurrency);
        self.limitsPayload = {};
        self.srNo = ko.observable();
        self.cashUpdateLimitFlag = ko.observable(false);
        self.creditUpdateLimitFlag = ko.observable(false);
        self.cashlimitErrorFlag = ko.observable(false);
        self.creditlimitErrorFlag = ko.observable(false);
        self.billcyclesArray = ko.observableArray();
        self.selectedBillCycle = ko.observable();
        self.billCycleListLoaded = ko.observable(false);
        self.additionalCardDetails = ko.observable();
        self.creditCardId = ko.observable();
        self.moduleURL = ko.observable();
        self.reasonsArray = ko.observableArray();
        self.selectedReason = ko.observable();
        self.comment = ko.observable();
        self.isCardActivated = ko.observable(false);
        self.isReasonsLoaded = ko.observable(false);
        if (self.params.id) {
            self.creditCardId(self.params.id.value);
        }
        if (self.params.jsonData) {
            self.moduleURL(self.params.jsonData.moduleURL);
        }
        self.showFloatingPanel = function () {
            $("#panelCreditCard").trigger("openFloatingPanel");
        };
        self.openRedeemPointsAndcloseFloatingPanel = function () {
            $("#redeemRewardPoints").trigger("openModal");
            $("#panelCreditCard").trigger("closeFloatingPanel");
        };
        self.closeSwitchDialog = function () {
            if (self.internationalTransactionsValue()) {
                self.internationalTransactionsValue(false);
            } else {
                self.internationalTransactionsValue(true);
            }
            $("#internationalTransactions").trigger("closeModal");
        };
        self.closeHandler = function () {
          if (self.isCardActivated()) {
              self.isCardActivated(false);
          } else {
              self.isCardActivated(true);
          }
            $("#activateCard").trigger("closeModal");
        };
        self.onSwitchChange = function() {
          if (self.internationalTransactionsValue()) {
            $("#intTransactionActiveAlert").trigger("openModal");
          } else {
            $("#intTransactionDeActiveAlert").trigger("openModal");
          }
        };
        self.closeintTransactionActiveAlert = function() {
          self.internationalTransactionsValue(false);
            $("#intTransactionActiveAlert").trigger("closeModal");
        };
        self.closeintTransactionDeActiveAlert = function() {
          self.internationalTransactionsValue(true);
            $("#intTransactionDeActiveAlert").trigger("closeModal");
        };
        self.closeintTransactionActiveAlertYes = function() {
            $("#intTransactionActiveAlert").trigger("closeModal");
        };
        self.closeintTransactionDeActiveAlertYes = function() {
            $("#intTransactionDeActiveAlert").trigger("closeModal");
        };
        self.showSwitchValue = function (data, event, obj) {
            if (obj.option === "value" && obj.optionMetadata.writeback === "shouldWrite") {
                if (self.internationalTransactionsValue()) {
                    if (!self.internationalTransactionsValue()) {
                        self.popupHeader(self.resource.creditCardDetails.internationalFlagMsgHeaderD);
                        self.popupMsg(self.resource.creditCardDetails.internationalFlagMsgD);
                        self.popupBtn(self.resource.creditCardDetails.yesD);
                    } else {
                        self.popupHeader(self.resource.creditCardDetails.internationalFlagMsgHeaderA);
                        self.popupMsg(self.resource.creditCardDetails.internationalFlagMsgA);
                        self.popupBtn(self.resource.creditCardDetails.yesA);
                    }
                }
                if (data.internationalTransactionsValue() === true) {
                    self.internationalTransactionsValue(true);
                } else {
                    self.internationalTransactionsValue(false);
                }
                $("#internationalTransactions").trigger("openModal");
            }
        };
        self.disableInternationalTransaction = function () {
            self.payload.creditCard = self.cardObject.creditCard.value;
            self.payload.isInternationalUsageAllowed = self.internationalTransactionsValue();
            CardDetailModel.updateInternationalUsage(self.cardObject.creditCard.creditCard.value, ko.toJSON(self.payload)).done(function () {
                $("#internationalTransactions").trigger("closeModal");
            }).fail(function () {
                $("#internationalTransactions").trigger("closeModal");
            });
        };
        self.fetchDetails = function () {
            CardDetailModel.fetchCreditDetails(self.creditCardId()).done(function (data) {
                self.viewDetailsLoaded(false);
                self.isDataLoaded(false);
                self.cardObject = data;
                self.cardDataForNickname(self.cardObject);
                self.internationalTransactionsValue = ko.observable(self.cardObject.creditCard.isInternationalUsageAllowed);
                self.cardDataForNickname().associatedParty = self.cardObject.associatedParty;
                if (self.cardObject.creditCard.cardType === "PRIMARY") {
                    self.isPrimary(true);
                } else {
                    self.isPrimary(false);
                }
                ko.tasks.runEarly();
                self.fetchBillCycle();
                self.viewDetailsLoaded(true);
                self.fetchLimit();
                self.isDataLoaded(true);
            });
        };
        self.fetchDetails();
        self.redeem = function () {
            if (Params.baseModel.cordovaDevice()) {
                CardDetailModel.redeemRewardPointsApp(Constants.appBaseURL, self.cardObject.creditCard.creditCard.value);
            } else {
                CardDetailModel.redeemRewardPoints(Constants.appBaseURL, self.cardObject.creditCard.creditCard.value);
            }
        };
        self.cancelCard = function () {
            self.mode("VIEW");
        };
        self.editLimit = function () {
            self.mode("EDIT");
        };
        self.editLimitConfirm = function () {
            var creditCardLimitArray = [];
            for (var i = 0; i < self.limitsDetailsObject.data.length; i++) {
                var limitDTO = {};
                if (self.limitsDetailsObject.data[i].type === "CA") {
                    if (self.limitsDetailsObject.data[i].amountType.amount() > self.limitsDetailsObject.data[i].total.amount) {
                        $("#reviewLimits").trigger("closeModal");
                        self.cashUpdateLimitFlag(false);
                        self.cashlimitErrorFlag(true);
                    } else {
                        self.cashlimitErrorFlag(false);
                        self.cashUpdateLimitFlag(true);
                    }
                }
                if (self.limitsDetailsObject.data[i].type === "CR") {
                    if (self.limitsDetailsObject.data[i].amountType.amount() > self.limitsDetailsObject.data[i].total.amount) {
                        $("#reviewLimits").trigger("closeModal");
                        self.creditUpdateLimitFlag(false);
                        self.creditlimitErrorFlag(true);
                    } else {
                        self.creditlimitErrorFlag(false);
                        self.creditUpdateLimitFlag(true);
                    }
                }
                limitDTO.available = ko.mapping.toJS(self.limitsDetailsObject.data[i].amountType);
                limitDTO.total = self.limitsDetailsObject.data[i].total;
                limitDTO.type = self.limitsDetailsObject.data[i].type;
                if (self.limitsDetailsObject.data[i].version) {
                    limitDTO.version = self.limitsDetailsObject.data[i].version;
                }
                creditCardLimitArray[i] = limitDTO;
            }
            if (self.cashlimitErrorFlag() || self.creditlimitErrorFlag()) {
                Params.baseModel.showMessages(null, [self.resource.creditCardDetails.cardLimit.limitError], "ERROR");
            }
            self.limitsPayload.limitDTO = creditCardLimitArray;
            if (!self.cashlimitErrorFlag() && !self.creditlimitErrorFlag()) {
                if (self.cashUpdateLimitFlag() && !self.creditUpdateLimitFlag()) {
                    CardDetailModel.updateLimit(ko.toJSON(self.limitsPayload), self.creditCardId(), "CA").done(function (data, status, jqXhr) {
                        self.srNo(data.serviceID);
                        if (self.srNo()) {
                            Params.dashboard.loadComponent("confirm-screen", {
                                jqXHR: jqXhr,
                                sr: true,
                                transactionName: self.resource.creditCardDetails.cardLimit.transactionName,
                                template: "confirm-screen/cc-template",
                                serviceNo: data.serviceID,
                                srNo:self.srNo(),
                                confirmScreenExtensions: {
                                  isSet: true,
                                  template: "confirm-screen/cc-template",
                                  taskCode: "CC_N_CUIU"
                                }
                            }, self);
                        } else {
                            Params.dashboard.loadComponent("confirm-screen", {
                                jqXHR: jqXhr,
                                transactionName: self.resource.creditCardDetails.cardLimit.transactionName,
                                confirmScreenExtensions: {
                                  isSet: true,
                                  template: "confirm-screen/cc-template",
                                  taskCode: "CC_N_CUIU"
                                }
                            }, self);
                        }
                    }).fail(function () {
                        $("#reviewLimits").trigger("closeModal");
                    });
                } else if (!self.cashUpdateLimitFlag() && self.creditUpdateLimitFlag()) {
                    CardDetailModel.updateLimit(ko.toJSON(self.limitsPayload), self.creditCardId(), "CR").done(function (data, status, jqXhr) {
                        self.srNo(data.serviceID);
                        if (self.srNo()) {
                            Params.dashboard.loadComponent("confirm-screen", {
                                jqXHR: jqXhr,
                                sr: true,
                                transactionName: self.resource.creditCardDetails.cardLimit.transactionName,
                                serviceNo: data.serviceID,
                                srNo:self.srNo(),
                                confirmScreenExtensions: {
                                  isSet: true,
                                  template: "confirm-screen/cc-template",
                                  taskCode: "CC_N_CUIU"
                                }
                            }, self);
                        } else {
                            Params.dashboard.loadComponent("confirm-screen", {
                                jqXHR: jqXhr,
                                transactionName: self.resource.creditCardDetails.cardLimit.transactionName,
                                confirmScreenExtensions: {
                                  isSet: true,
                                  template: "confirm-screen/cc-template",
                                  taskCode: "CC_N_CUIU"
                                }
                            }, self);
                        }
                    }).fail(function () {
                        $("#reviewLimits").trigger("closeModal");
                    });
                } else if (self.cashUpdateLimitFlag() && self.creditUpdateLimitFlag()) {
                    for (var j = 0; j < self.limitsPayload.limitDTO.length; j++) {
                        CardDetailModel.updateLimit(ko.toJSON(self.limitsPayload), self.creditCardId(), self.limitsPayload.limitDTO[j].type).done(function (data, status, jqXhr) {
                            self.srNo(data.serviceID);
                            if (self.srNo()) {
                                Params.dashboard.loadComponent("confirm-screen", {
                                    jqXHR: jqXhr,
                                    sr: true,
                                    transactionName: self.resource.creditCardDetails.cardLimit.transactionName,
                                    serviceNo: data.serviceID,
                                    srNo:self.srNo(),
                                    confirmScreenExtensions: {
                                      isSet: true,
                                      template: "confirm-screen/cc-template",
                                      taskCode: "CC_N_CUIU"
                                    }
                                }, self);
                            } else {
                                Params.dashboard.loadComponent("confirm-screen", {
                                    jqXHR: jqXhr,
                                    transactionName: self.resource.creditCardDetails.cardLimit.transactionName,
                                    confirmScreenExtensions: {
                                      isSet: true,
                                      template: "confirm-screen/cc-template",
                                      taskCode: "CC_N_CUIU"
                                    }
                                }, self);
                            }
                        }).fail(function () {
                            $("#reviewLimits").trigger("closeModal");
                        });
                    }
                }
            }
        };
        self.reviewLimit = function () {
            $("#reviewLimits").trigger("openModal");
        };
        self.fetchLimit = function () {
            var limitsDataVar = $.map(self.cardObject.creditCard.limits, function (limitsDataLocal) {
                if (limitsDataLocal.type === "CR") {
                    self.limitTypeLocal("Credit");
                } else if (limitsDataLocal.type === "CA") {
                    self.limitTypeLocal("Cash");
                }
                self.amountTypeLimit = ko.observable();
                limitsDataLocal.limitTypeLocal = self.limitTypeLocal();
                limitsDataLocal.amountType = ko.mapping.fromJS({
                    amount: limitsDataLocal.available.amount,
                    currency: limitsDataLocal.available.currency
                });
                return limitsDataLocal;
            });
            if (limitsDataVar.length > 0) {
                self.limitsDetailsObject = new oj.ArrayTableDataSource(limitsDataVar, { idAttribute: "type" });
            }
        };
        self.cancel = function (id) {
            $("#" + id).trigger("closeModal");
            self.initiateLimit(true);
            self.verifyLimit(false);
            self.confirmLimit(false);
        };
        self.fetchBillingsDays = function () {
            CardDetailModel.fetchBillingsDays().done(function (data) {
                var billcycleDate = data.enumRepresentations[0].data[0].code.split(",");
                if (self.billcyclesArray().length <= 3) {
                    for (var i = 0; i < billcycleDate.length; i++) {
                        self.billcyclesArray.push({
                            description: billcycleDate[i],
                            code: billcycleDate[i]
                        });
                    }
                }
                self.selectedBillCycle(billcycleDate[0]);
                self.billCycleListLoaded(true);
            });
        };
        self.confirmBillCycle = function () {
            $("#reviewBillCycle").trigger("openModal");
        };
        self.updateBillCycle = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            var payload = {
                "billingCycleDay": Params.baseModel.getDropDownValue(self.selectedBillCycle()),
                "reason": ""
            };
            CardDetailModel.updateBillCycle(ko.toJSON(payload), self.creditCardId()).done(function () {
                self.billCycleListLoaded(false);
                $("#reviewBillCycle").trigger("closeModal");
            }).fail(function () {
                $("#reviewBillCycle").trigger("closeModal");
            });
        };
        self.fetchBillCycle = function () {
            if (self.cardObject.creditCard.cardStatus === "ACT") {
                CardDetailModel.fetchBillCycle(self.creditCardId()).done(function (data) {
                    self.selectedBillCycle(data.billingCycleDay);
                });
            }
        };
        self.creditCardSubscription = self.creditCardId.subscribe(function () {
            ko.tasks.runEarly();
            self.fetchDetails();
        });
        self.creditCardParser = function (data) {
            data.accounts = data.creditcards;
            data.accounts.map(function (creditCard) {
                creditCard.id = creditCard.creditCard;
                creditCard.partyId = data.associatedParty;
                creditCard.accountNickname = creditCard.cardNickname;
                creditCard.associatedParty = data.associatedParty;
                return creditCard;
            });
            return data;
        };
        self.getValueFromArray = function (id, array) {
            for (var i = 0; i < array.length; i++) {
                if (id[0] === array[i].code) {
                    return array[i].description;
                }
            }

        };
        self.activateCard = function () {
          self.selectedReasonDesc = ko.observable();
          for(var i=0;i<self.reasonsArray().length;i++)
          {
            if(self.reasonsArray()[i].code === self.selectedReason())
            self.selectedReasonDesc(self.reasonsArray()[i].description);
          }
            var confirmData = {
                "statusType": "ACT",
                "statusUpdateReason": { "activateReason": self.selectedReason() }
            };
            CardDetailModel.activateCard(ko.toJSON(confirmData), self.creditCardId()).done(function (data, status, jqXhr) {
                if (typeof data.serviceID !== "undefined") {
                    self.srNo(data.serviceID);
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        sr: true,
                        transactionName: self.resource.creditCardDetails.activateCardHeader,
                        serviceNo: data.serviceID,
                        srNo:self.srNo(),
                        confirmScreenExtensions: {
                          isSet: true,
                          template: "confirm-screen/cc-template",
                          taskCode: "",
                          flagActivateCard: true,
                          activateReason: self.selectedReasonDesc(),
                          cardNumber: self.cardObject.creditCard.creditCard.displayValue,
                          comment: self.comment()
                        }
                    }, self);
                } else {
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.resource.creditCardDetails.activateCardHeader,
                        confirmScreenExtensions: {
                          isSet: true,
                          template: "confirm-screen/cc-template",
                          taskCode: "",
                          flagActivateCard: true,
                          activateReason: self.selectedReasonDesc(),
                          cardNumber: self.cardObject.creditCard.creditCard.displayValue,
                          comment: self.comment()
                        }
                    }, self);
                }
            }).fail(function () {
              if (self.isCardActivated()) {
                  self.isCardActivated(false);
              } else {
                  self.isCardActivated(true);
              }
                $("#activateCard").trigger("closeModal");
            });
        };
        self.showSwitchValueActivateCard = function (data) {
          if(!data.detail.previousValue){
                if (self.reasonsArray().length === 0) {
                    self.isReasonsLoaded(false);
                    CardDetailModel.fetchActivateReasons().done(function (data) {
                        for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                            self.reasonsArray().push({
                                code: data.enumRepresentations[0].data[i].code,
                                description: self.resource.creditCardDetails[data.enumRepresentations[0].data[i].code]
                            });
                        }
                        self.isReasonsLoaded(true);
                        $("#activateCard").trigger("openModal");
                    });
                }
                if (self.reasonsArray().length !== 0) {
                    self.isReasonsLoaded(true);
                    $("#activateCard").trigger("openModal");
                }
              }
        };

        self.dispose = function() {
          self.creditCardSubscription.dispose();
        };
    };
});
