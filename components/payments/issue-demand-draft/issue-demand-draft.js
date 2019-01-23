define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/issue-demand-draft",
    "framework/js/constants/constants",
    "ojs/ojselectcombobox",
    "ojs/ojradioset",
    "ojs/ojdatetimepicker",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation"
], function(oj, ko, $, DemandDraftModel, BaseLogger, ResourceBundle, Constants) {
    "use strict";
    return function(rootParams) {
        var self = this,
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(DemandDraftModel.getNewModel());
                return KoModel;
            };
        self.payments = ResourceBundle.payments;
        self.transferOnArray = [{
                id: "NOW",
                label: self.payments.demanddraft.now
            },
            {
                id: "LATER",
                label: self.payments.demanddraft.later
            }
        ];
        self.issueDate = ko.observable(self.transferOnArray[0].id);
        self.addressDetailsFetched = ko.observable(false);
        self.demandDraftPayload = getNewKoModel().demandDraftModel;
        self.addressDetails = ko.toJS(getNewKoModel().addressDetails);
        self.currentTask = ko.observable("PC_F_DOMDRAFT");
        self.customCurrencyURL = ko.observable(null);
        self.transferCurrency = ko.observable();
        self.payeeReceiverDetailsLoaded = ko.observable(false);
        self.payeeData = ko.observable();
        self.paymentId = ko.observable();
        self.selectedPayee = ko.observable();
        self.payeeId = ko.observable(self.params ? self.params.payeeId || null : null);
        self.groupId = ko.observable(self.params ? self.params.groupId || null : null);
        self.payee = ko.observable();
        ko.utils.extend(self, rootParams.rootModel.previousState ? rootParams.rootModel.previousState.retainedData : rootParams.rootModel);
        self.defaultData = rootParams.options ? rootParams.options.data : rootParams.rootModel.params;
        self.userSegment = Constants.userSegment;
        rootParams.dashboard.headerCaption("");
        rootParams.dashboard.isConfirmScreenVisited(false);
        self.userSegment = Constants.userSegment;
        self.common = ResourceBundle.payments.common;
        if (self.userSegment === "CORP") {
            rootParams.dashboard.headerName(self.payments.demanddraft_header);
        } else {
            rootParams.dashboard.headerName(self.payments.demanddraft_header_retail);
        }
        self.confirmScreenDetails = ko.observable();
        self.currentDate = ko.observable();
        self.tomorrow = ko.observable();
        self.additionalDetails = ko.observable();
        self.fromFavourites = ko.observable(false);
        self.removeFavouriteFlag = ko.observable(false);
        rootParams.baseModel.registerElement([
            "comment-box",
            "amount-input",
            "account-input",
            "confirm-screen"
        ]);
        rootParams.baseModel.registerComponent("transfer-view-limits", "financial-limits");
        rootParams.baseModel.registerComponent("my-limits", "limits-enquiry");
        self.validationTracker = ko.observable();
        self.model = ko.observable();
        self.isDataLoaded = ko.observable(true);
        self.verificationCode = ko.observable();
        self.invalidVerificationCode = ko.observable(false);
        self.readSuccess = ko.observable(false);
        self.transactionType = ko.observable();
        self.minSelectableDate = ko.observable();
        self.currentDateLoaded = ko.observable(false);
        self.demandDraftInstructionPayload = getNewKoModel().demandDraftInstructionModel;
        self.favoritesPayLoad = getNewKoModel().favoritesModel;
        self.formattedToday = ko.observable();
        self.payeeType = ko.observable();
        self.refreshAmountComponent = ko.observable(true);
        self.isPayeeListEmpty = ko.observable(false);
        self.formattedTomorrow = ko.observable();
        DemandDraftModel.init();
        if (self.currentDate() === undefined) {
            self.currentDateLoaded(false);
            DemandDraftModel.getHostDate().done(function(data) {
                var today = new Date(data.currentDate.valueDate);
                self.formattedToday(today);
                self.currentDate(rootParams.baseModel.formatDate(today));
                var tomorrow = new Date(data.currentDate.valueDate);
                tomorrow.setDate(today.getDate() + 1);
                self.formattedTomorrow(tomorrow);
                self.tomorrow(rootParams.baseModel.formatDate(tomorrow));
                self.currentDateLoaded(true);
            });
        }
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageTwoPointTwo = ko.observable(false);
        self.isLaterDateRequired = ko.observable(false);
        self.externalReferenceId = ko.observable();
        self.payeeList = ko.observableArray();
        self.isPayeeListLoaded = ko.observable(false);
        self.payeeSubList = ko.observableArray();
        self.isPayeeSubListLoaded = ko.observable(false);
        self.isPayeeDropdownActive = ko.observable(false);
        self.dropDownActive = ko.observable(false);
        self.payeeListRefresh = ko.observable(true);
        self.currencyCode = ko.observableArray();
        self.isCurrencyLoaded = ko.observable(false);
        self.accountList = ko.observableArray();
        self.isAccLoaded = ko.observable(true);
        self.refreshTransferOn = ko.observable(true);
        self.accountListMap = {};
        self.refreshAccounts = ko.observable(true);
        rootParams.baseModel.registerComponent("warning-message-dialog", "payee");
        rootParams.baseModel.registerComponent("review-domestic-demand-draft", "payments");
        rootParams.baseModel.registerComponent("review-international-demand-draft", "payments");
        self.isPayeeSelected = ko.observable(false);
        self.showMessage = ko.observable(false);
        self.demandDraftPayment = ko.observable();
        self.customPayeeName = ko.observable();
        self.payeeGroupId = ko.observable(self.params ? self.params.payeeGroupId || null : null);
        self.type = ko.observable(self.params ? self.params.type || null : null);
        rootParams.baseModel.registerComponent("demand-draft-payee", "payee");
        DemandDraftModel.init();
        self.loadAccessPointList = ko.observable(false);
        self.selectedChannelTypeName = ko.observable();
        self.selectedChannelType = ko.observable();
        self.selectedChannelIndex = ko.observable();
        self.selectedChannel = ko.observable(false);
        self.isCommentRequired = ko.observable();
        DemandDraftModel.fetchBankConfig().then(function(data){
            self.isCommentRequired(data.bankConfigurationDTO.region === "INDIA");
        });

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
        DemandDraftModel.listAccessPoint().done(function(data) {
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
        self.loadPayees = function() {
            self.isPayeeDropdownActive(true);
        };
        self.refreshPayeeList = function() {
            self.payeeListRefresh(false);
            self.isPayeeListLoaded(true);
            self.payeeListRefresh(true);
        };
        self.setPayee = function(data) {
            self.customPayeeName(data.nickName);
            self.dropDownActive(false);
            self.isPayeeSelected(true);
            self.payeeId(data.id);
            self.groupId(data.groupId);
            self.readPayee();
        };
        self.getBranchAddress = function() {
            DemandDraftModel.getBranchAddress(self.payeeData().demandDraftDeliveryDTO.branch).done(function(data) {
                self.addressDetails.postalAddress = data.addressDTO[0] ? data.addressDTO[0].branchAddress.postalAddress : "";
                if(!self.addressDetails.postalAddress.branchName){
                    self.addressDetails.postalAddress.branchName = data.addressDTO[0].branchName;
                }
                self.addressDetailsFetched(true);
            });
        };
        self.getMyAddress = function() {
            DemandDraftModel.fetchCourierAddress(self.payeeData().demandDraftDeliveryDTO.addressType).done(function(data) {
                if (data.party) {
                    for (var i = 0; i < data.party.addresses.length; i++) {
                        if (data.party.addresses[i].type === self.payeeData().demandDraftDeliveryDTO.addressType) {
                            self.addressDetails.postalAddress = data.party.addresses[i].postalAddress ? data.party.addresses[i].postalAddress : "";
                            self.addressDetailsFetched(true);
                            break;
                        }
                    }
                }
            });
        };
        self.refreshDropDown = function() {
            self.refreshAmountComponent(false);
            self.demandDraftPayload.remarks("");
            self.issueDate("NOW");
            self.setTaskCodeForIssueNow();
            self.demandDraftPayload.valueDate(self.today);
            self.isLaterDateRequired(false);
            self.payeeId(null);
            self.isPayeeSelected(false);
            self.isPayeeListLoaded(true);
            self.addressDetailsFetched(false);
            self.customPayeeName(null);
            self.selectedPayee("");
            self.dropDownActive(false);
            self.isPayeeSubListLoaded(false);
            self.payeeReceiverDetailsLoaded(false);
            if (self.userSegment !== "CORP") {
                self.payee(null);
            }
            self.demandDraftPayload.amount.amount("");
            self.customCurrencyURL(null);
            self.refreshAmountComponent(true);
            self.customLimitType(undefined);
            self.payeeType(undefined);
        };
        self.setTaskCodeForIssueNow = function() {
            self.refreshAccounts(false);
            if (self.payeeType() === "DOM") {
                self.currentTask("PC_F_DOMDRAFT");
            } else if (self.payeeType() === "INT") {
                self.currentTask("PC_F_ID");
            }
            self.refreshAccounts(true);
        };
        self.setTaskCodeForIssueLater = function() {
            self.refreshAccounts(false);
            if (self.payeeType() === "DOM") {
                self.currentTask("PC_F_DOMDRAFT");
            } else if (self.payeeType() === "INT") {
                self.currentTask("PC_F_ID");
            }
            self.refreshAccounts(true);
        };
        self.dateChanged = function(event) {
            if (event.detail.value) {
                if (event.detail.value === "NOW") {
                    self.setTaskCodeForIssueNow();
                    self.isLaterDateRequired(false);
                    self.demandDraftPayload.valueDate(self.today);
                } else {
                    self.demandDraftPayload.valueDate("");
                    self.setTaskCodeForIssueLater();
                    self.isLaterDateRequired(true);
                }
            }
        };
        self.filterBranchDetails = function(){
            var branchAddress = [ko.utils.unwrapObservable(self.addressDetails.postalAddress.branchName),ko.utils.unwrapObservable(self.addressDetails.postalAddress.line1),ko.utils.unwrapObservable(self.addressDetails.postalAddress.line2),ko.utils.unwrapObservable(self.addressDetails.postalAddress.line3),ko.utils.unwrapObservable(self.addressDetails.postalAddress.line4),ko.utils.unwrapObservable(self.addressDetails.postalAddress.city),ko.utils.unwrapObservable(self.addressDetails.postalAddress.country),ko.utils.unwrapObservable(self.addressDetails.postalAddress.zipCode)];
            return branchAddress.filter(function(n){ return (n && n.trim() !== "");}).join(", ");
        };
        self.payeeChanged = function(event) {
            if (event.detail.value) {
                var index = -1;
                self.selectedPayee(event.detail.value.split("-")[0]);
                self.groupId(event.detail.value.split("-")[1]);
                DemandDraftModel.getPayeeSubList(self.groupId()).done(function(data) {
                    self.payeeSubList.removeAll();
                    for (var i = 0; i < data.listPayees.length; i++) {
                        if (self.payeeId() && self.payeeId() === data.listPayees[i].id) {
                            index = i;
                        }
                        self.payeeSubList.push(data.listPayees[i]);
                    }
                    if (data.listPayees.length === 0) {
                        self.isPayeeListEmpty(true);
                    }
                    self.isPayeeListLoaded(false);
                    self.isPayeeSubListLoaded(true);
                    self.dropDownActive(true);
                    if (index !== -1) {
                        self.setPayee(self.payeeSubList()[index]);
                    }
                });

            }
        };
        self.readPayee = function() {
            DemandDraftModel.getDemandDraftPayee(self.payeeId(), self.groupId()).done(function(data) {
                self.refreshAmountComponent(false);
                self.payeeType(data.demandDraftPayeeDTO.demandDraftPayeeType);
                self.payeeData(data.demandDraftPayeeDTO);
                self.refreshTransferOn(false);
                self.payeeReceiverDetailsLoaded(false);
                self.demandDraftPayload.payeeId(self.payeeId() + "");
                self.demandDraftPayload.inFavourOf(self.payeeData().nickName);
                self.customPayeeName(self.payeeData().nickName);
                if (self.payeeData().demandDraftDeliveryDTO.deliveryMode === "MAI") {
                    self.getMyAddress();
                } else {
                    self.getBranchAddress();
                }
                if (self.payeeType() === "DOM") {
                    self.setTaskCodeForIssueNow();
                    self.customCurrencyURL("payments/currencies?type=DOMESTICDRAFT");
                } else if (self.payeeType() === "INT") {
                    self.setTaskCodeForIssueNow();
                    self.customCurrencyURL("payments/currencies?type=PC_F_ID");
                }
                if (self.params && self.params.isFavoriteTransaction) {
                    self.demandDraftPayload.amount.amount(self.params.amount);
                    self.demandDraftPayload.debitAccountId.value(self.params.debitAccountId);
                    self.demandDraftPayload.remarks(self.params.remarks);
                    self.transferCurrency(self.params.currency);
                    self.fromFavourites(true);
                    if (self.params.valueDate) {
                        self.issueDate("LATER");
                        self.demandDraftPayload.valueDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.params.valueDate)));
                    }
                }
                self.payeeReceiverDetailsLoaded(true);
                self.refreshTransferOn(true);
                self.refreshAmountComponent(true);
            });
        };
        self.removeFavourite = function() {
            self.stageOne(false);
            self.removeFavouriteFlag(true);
        };
        self.cancelDeletion = function() {
            self.removeFavouriteFlag(false);
            self.stageOne(true);
        };
        self.confirmDeleteFavourite = function() {
            DemandDraftModel.deleteFavourite(self.params.paymentId, self.params.transactionType).done(function(data, status, jqXHR) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: self.payments.confirm,
                    template: "confirm-screen/payments-template"
                }, self);
                self.removeFavouriteFlag(false);
            });
        };
        self.subPayeeChanged = function(data, event) {
            $("#content").html(event.target.innerHTML);
            $("#content").find("#cancel").css("display", "inline");
            $("#content").find("#cancel").click(function() {
                self.payeeListRefresh(false);
                self.isPayeeListLoaded(true);
                self.isPayeeDropdownActive(false);
                self.payeeListRefresh(true);
            });
            self.payeeId(data.id);
            if (self.payeeId() !== null) {
                self.isPayeeSubListLoaded(false);
                DemandDraftModel.getDemandDraftPayee(self.payeeId(), self.groupId()).done(function(data) {
                    self.payeeData(data.demandDraftPayeeDTO);
                    self.payeeReceiverDetailsLoaded(false);
                    self.demandDraftPayload.payeeId(self.payeeId() + "");
                    self.demandDraftPayload.inFavourOf(self.payeeData().name);
                    self.payeeReceiverDetailsLoaded(true);
                });
            }
        };
        self.cancel = function() {
            rootParams.dashboard.openDashBoard(self.payments.common.cancelConfirm);
        };
        self.cancelDDIssue = function() {
            history.go(-1);
        };
        self.initiateDDIssue = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("drafttracker"))) {
                return;
            }
            self.demandDraftPayload.amount.currency(self.transferCurrency());
            if (self.today === self.demandDraftPayload.valueDate() || self.demandDraftPayload.valueDate() === null) {
                self.demandDraftPayload.amount.currency(self.transferCurrency());
                self.demandDraftPayload.payeeId(self.demandDraftPayload.payeeId());
                self.demandDraftPayload.debitAccountId.value(self.demandDraftPayload.debitAccountId.value());
                var demandDraftPayload = ko.toJSON(self.demandDraftPayload);
                if (self.payeeData().demandDraftPayeeType === "DOM") {
                    DemandDraftModel.initiateDomesticDDIssue(demandDraftPayload).done(function(data) {
                        self.paymentId(data.paymentId);
                        rootParams.dashboard.loadComponent("review-domestic-demand-draft", {
                            reviewMode: true,
                            header: rootParams.dashboard.headerName(),
                            paymentId: self.paymentId(),
                            retainedData: self
                        }, self);
                    });
                    self.transactionType("DOMESTICDRAFT");
                } else if (self.payeeData().demandDraftPayeeType === "INT") {
                    DemandDraftModel.initiateInternationalDDIssue(demandDraftPayload).done(function(data) {
                        self.paymentId(data.paymentId);
                        rootParams.dashboard.loadComponent("review-international-demand-draft", {
                            reviewMode: true,
                            header: rootParams.dashboard.headerName(),
                            paymentId: self.paymentId(),
                            retainedData: self
                        }, self);
                    });
                    self.transactionType("INTERNATIONALDRAFT");
                }
            } else {
                self.demandDraftInstructionPayload.amount.currency(self.transferCurrency());
                self.demandDraftInstructionPayload.payeeId(self.demandDraftPayload.payeeId());
                self.demandDraftInstructionPayload.debitAccountId.value(self.demandDraftPayload.debitAccountId.value());
                self.demandDraftInstructionPayload.startDate(self.demandDraftPayload.valueDate());
                self.demandDraftInstructionPayload.endDate(self.demandDraftPayload.valueDate());
                self.demandDraftInstructionPayload.remarks(self.demandDraftPayload.remarks());
                self.demandDraftInstructionPayload.amount.amount(self.demandDraftPayload.amount.amount());
                self.demandDraftInstructionPayload.inFavourOf(self.demandDraftPayload.inFavourOf());
                var payload = ko.toJSON(self.demandDraftInstructionPayload);
                if (self.payeeData().demandDraftPayeeType === "DOM") {
                    DemandDraftModel.initiateDomesticDDInstructionIssue(payload).done(function(data) {
                        self.paymentId(data.instructionId);
                        rootParams.dashboard.loadComponent("review-domestic-demand-draft", {
                            reviewMode: true,
                            header: rootParams.dashboard.headerName(),
                            instructionId: self.paymentId(),
                            retainedData: self
                        }, self);
                    });
                    self.transactionType("DOMESTICDRAFT_PAYLATER");
                } else if (self.payeeData().demandDraftPayeeType === "INT") {
                    DemandDraftModel.initiateInternationalDDInstructionIssue(payload).done(function(data) {
                        self.paymentId(data.instructionId);
                        rootParams.dashboard.loadComponent("review-international-demand-draft", {
                            reviewMode: true,
                            header: rootParams.dashboard.headerName(),
                            instructionId: self.paymentId(),
                            retainedData: self
                        }, self);
                    });
                    self.transactionType("INTERNATIONALDRAFT_PAYLATER");
                }
            }
        };
        self.demandDraftPayee = ko.observable();
        self.paymentType = ko.observable();

        function callbackFunction(data, status, jqXHR) {
            var successMessage, statusMessages;
            self.httpStatus = jqXHR.status;
            if (self.userSegment === "CORP" && self.httpStatus && self.httpStatus !== 202) {
                successMessage = self.payments.common.confirmScreen.successMessage;
                statusMessages = self.payments.common.completed;
            } else if (self.userSegment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                successMessage = self.payments.common.confirmScreen.corpMaker;
                statusMessages = self.payments.demanddraft.pendingApproval;
            } else {
                successMessage = self.payments.common.confirmScreen.successSI;
                statusMessages = self.payments.common.success;
            }
            self.externalReferenceId(data.externalReferenceId);
            self.stageTwo(false);
            rootParams.dashboard.loadComponent("confirm-screen", {
                jqXHR: jqXHR,
                favorite: self.userSegment === "CORP",
                hostReferenceNumber: data.externalReferenceId,
                transactionName: self.payments[self.today === self.demandDraftPayload.valueDate() || self.demandDraftPayload.valueDate() === null ? self.payeeData().demandDraftPayeeType === "DOM" ? "domddheader" : "intddheader" : self.payeeData().demandDraftPayeeType === "DOM" ? "domddinheader" : "intddinheader"],
                confirmScreenExtensions: {
                    successMessage: successMessage,
                    statusMessages: statusMessages,
                    isSet: true,
                    eReceiptRequired: true,
                    taskCode: self.currentTask(),
                    confirmScreenDetails: self.confirmScreenDetails(),
                    template: "confirm-screen/payments-template"
                }
            }, self);
        }
        self.confirmDDIssue = function() {
            if (self.today === self.demandDraftPayload.valueDate() || self.demandDraftPayload.valueDate() === null) {
                if (self.payeeData().demandDraftPayeeType === "DOM") {
                    DemandDraftModel.confirmDomesticDDIssue(self.paymentId()).done(callbackFunction);
                } else if (self.payeeData().demandDraftPayeeType === "INT") {
                    DemandDraftModel.confirmInternationalDDIssue(self.paymentId()).done(callbackFunction);
                }
            } else if (self.payeeData().demandDraftPayeeType === "DOM") {
                    DemandDraftModel.confirmDomesticDDInstructionIssue(self.paymentId()).done(callbackFunction);
                } else if (self.payeeData().demandDraftPayeeType === "INT") {
                    DemandDraftModel.confirmInternationalDDInstructionIssue(self.paymentId()).done(callbackFunction);
                }
            if (self.today === self.demandDraftPayload.valueDate() || self.demandDraftPayload.valueDate() === null) {
                if (self.payeeData().demandDraftPayeeType === "DOM") {
                    self.baseURL = "payments/drafts/domestic/" + self.paymentId();
                } else if (self.payeeData().demandDraftPayeeType === "INT") {
                    self.baseURL = "payments/drafts/international/" + self.paymentId();
                }
            } else if (self.payeeData().demandDraftPayeeType === "DOM") {
                    self.baseURL = "payments/instructions/drafts/domestic/" + self.paymentId();
                } else if (self.payeeData().demandDraftPayeeType === "INT") {
                    self.baseURL = "payments/instructions/drafts/international/" + self.paymentId();
                }
        };
        self.corporatePayeeChange = function(event) {
            if (self.groupId() || event.detail.value) {
                for (var i = 0; i < self.payeeList().length; i++) {
                    if ((self.groupId() || event.detail.value) === self.payeeList()[i].id) {
                        self.refreshDropDown();
                        self.setPayee(self.payeeList()[i]);
                        break;
                    }
                }
            }
        };
        if ((self.params && self.params.transferDataPayee) || (self.defaultData && self.defaultData.transferDataPayee)) {
            var payeeTransferData = (self.params && self.params.transferDataPayee) ? self.params.transferDataPayee : (self.defaultData ? self.defaultData.transferDataPayee : null);
            self.payeeId(payeeTransferData.id);
            self.groupId(payeeTransferData.groupId);
            if (self.userSegment !== "CORP")
                self.payee(payeeTransferData.name + "-" + payeeTransferData.groupId);
            else
                self.payee(payeeTransferData.id);
        }
        self.getPayeeList = function() {
            DemandDraftModel.getPayeeList().done(function(data) {
                self.isPayeeListLoaded(false);
                if (self.userSegment === "CORP") {
                    self.payeeList.removeAll();
                    for (var i = 0; i < data.payeeGroups.length; i++) {
                        self.payeeList.push(data.payeeGroups[i].listPayees[0]);
                    }
                    if (self.params && self.params.isFavoriteTransaction) {
                        self.payee(self.params.payeeId);
                        self.corporatePayeeChange({detail:{value: self.params.payeeId}});
                    } else if (self.payeeId() && !self.paymentId()) {
                        self.corporatePayeeChange(null, {
                            option: "value",
                            value: [self.payeeId()]
                        });
                    }
                } else {
                    for (var j = 0; j < data.payeeGroups.length; j++) {
                        self.payeeList.push(data.payeeGroups[j]);
                    }
                    if (self.payee && self.payee()) {
                        self.payeeChanged({ detail: { value: self.payee() } });
                    }
                }
                ko.tasks.runEarly();
                self.isPayeeListLoaded(true);
            }).fail(function() {
                self.isDataLoaded(false);
            });
        };
        self.getPayeeList();
        var favoritePersistedSuccessfully = false;
        self.persistFavorites = function() {
            self.favoritesPayLoad.id(self.paymentId());
            self.favoritesPayLoad.transctionType(self.transactionType());
            self.favoritesPayLoad.payeeId(self.payeeId());
            self.favoritesPayLoad.amount.amount(self.demandDraftPayload.amount.amount());
            self.favoritesPayLoad.amount.currency(self.transferCurrency());
            self.favoritesPayLoad.debitAccountId.value(self.demandDraftPayload.debitAccountId.value());
            self.favoritesPayLoad.remarks(self.demandDraftPayload.remarks());
            self.favoritesPayLoad.payeeGroupId(self.groupId());
            self.favoritesPayLoad.valueDate(self.today !== self.demandDraftPayload.valueDate() ? self.demandDraftPayload.valueDate() : null);
            self.favoritesPayLoad.payeeNickName(self.demandDraftPayload.inFavourOf());
            self.favoritesPayLoad.payeeAccountName(self.payeeData().name);
            var favoritesPayLoad = ko.toJSON(self.favoritesPayLoad);
            DemandDraftModel.addFavorites(favoritesPayLoad).done(function() {
                self.favoriteSuccess();
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
                if (data.currencyList !== null) {
                    if (self.payeeType() === "DOM") {
                        output.currencies.push({
                            code: data.currencyList[0].code,
                            description: data.currencyList[0].code
                        });
                    } else {
                        for (var i = 0; i < data.currencyList.length; i++) {
                            output.currencies.push({
                                code: data.currencyList[i].code,
                                description: data.currencyList[i].code
                            });
                        }
                    }
                    if (!self.transferCurrency())
                        self.transferCurrency(output.currencies[0].code);
                }
            }
            return output;
        };
        self.customLimitType = ko.observable();
        self.viewlimitsFlag = ko.observable(false);
        self.viewLimits = function() {
            self.viewlimitsFlag(false);
            self.customLimitType(undefined);
            if (self.payeeType() === "DOM") {
                self.customLimitType("PC_F_DOMDRAFT");
            } else if (self.payeeType() === "INT") {
                self.customLimitType("PC_F_ID");
            }
            ko.tasks.runEarly();
            $("#viewlimits-DD").trigger("openModal");
            self.viewlimitsFlag(true);
        };
        self.closeModal = function() {
            $("#viewlimits-DD").trigger("closeModal");
        };
    };
});
