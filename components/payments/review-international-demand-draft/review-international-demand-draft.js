define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/issue-demand-draft",
    "framework/js/constants/constants",
    "ojs/ojknockout"
], function (oj, ko, $, draftModel, ResourceBundle, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.userSegment = Constants.userSegment;
        self.payments = ResourceBundle.payments;
        self.common = ResourceBundle.payments.common;
        self.paymentType = ko.observable();
        self.details = ko.observable(rootParams.data);
        self.stageTwo = ko.observable(false);
        self.transferNow = ko.observable(true);
        self.mode = ko.observable();
        self.paymentId = ko.observable();
        self.demandDraftPayment = ko.observable();
        self.demandDraftPayee = ko.observable();
        self.demandDraftDelivery = ko.observable();
        self.confirmScreenDetails = rootParams.rootModel.confirmScreenDetails;
        void(self.params.reviewMode && rootParams.dashboard.headerName(self.params.header));
        self.addressDetails = {
            modeofDelivery: null,
            addressType: null,
            addressTypeDescription: null
        };
        if (self.params.instructionId) {
            self.paymentId(ko.utils.unwrapObservable(self.params.instructionId));
            self.transferNow(false);
        } else if (self.params.paymentId) {
            self.paymentId(ko.utils.unwrapObservable(self.params.paymentId));
        } else if (self.params.data) {
            self.paymentId(ko.utils.unwrapObservable(self.params.data.paymentId || self.params.data.instructionId));
            self.transferNow(!self.params.data.instructionId);
        }
        draftModel.getDraftData(self.paymentId(), "drafts", "international", self.transferNow()).done(function (data) {
            self.paymentType(data);
            if (self.transferNow()) {
                data.draftDetails.inFavourOf = data.inFavourOf;
                data.draftDetails.startDate = data.draftDetails.valueDate;
                self.demandDraftPayment(data.draftDetails);
                self.demandDraftPayee(data.payeeDetails);
                self.mode(data.payeeDetails.demandDraftDeliveryDTO.deliveryMode);
                self.demandDraftDelivery(data.payeeDetails.demandDraftDeliveryDTO);
            } else {
                self.demandDraftPayment(data.draftDetails.instructionDetails);
                self.demandDraftPayee(data.draftDetails.payeeDetails);
                self.mode(data.draftDetails.payeeDetails.demandDraftDeliveryDTO.deliveryMode);
                self.demandDraftDelivery(data.draftDetails.payeeDetails.demandDraftDeliveryDTO);
            }
            if (self.mode() === "BRN") {
                self.getBranchAddress(data);
            } else {
                self.getMyAddress(data);
            }
        });
        self.getConfirmScreenMsg = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
        };
        self.getConfirmScreenStatus = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
        };
        function populateConfirmScreenDetails(data, addresses) {
            var confirmScreenDetailsArray = [
                [
                    {
                        label: self.payments.demanddraft.infavourof,
                        value: data.draftDetails.instructionDetails ? data.draftDetails.instructionDetails.inFavourOf : data.inFavourOf
                    },
                    {
                        label: self.payments.demanddraft.amount,
                        value: rootParams.baseModel.formatCurrency(self.demandDraftPayment().amount.amount, self.demandDraftPayment().amount.currency)
                    }
                ],
                [
                    {
                        label: self.payments.demanddraft.scheduledon,
                        value: data.draftDetails.instructionDetails ? rootParams.baseModel.formatDate(data.draftDetails.instructionDetails.startDate) : rootParams.baseModel.formatDate(data.draftDetails.valueDate)
                    },
                    {
                        label: self.payments.demanddraft.transferfrom,
                        value: self.demandDraftPayment().debitAccountId.displayValue
                    }
                ],
                [{
                        label: self.payments.common.DeliveryLocation,
                        value: [
                            addresses.branchName,
                            addresses.city,
                            addresses.country,
                            addresses.line1,
                            addresses.line2
                        ]
                    }]
            ];
            if (typeof self.confirmScreenDetails === "function")
                self.confirmScreenDetails(confirmScreenDetailsArray);
            else if (self.confirmScreenExtensions) {
                $.extend(self.confirmScreenExtensions, {
                    isSet: true,
                    eReceiptRequired: true,
                    taskCode: "PC_F_ID",
                    confirmScreenDetails: confirmScreenDetailsArray,
                    template: "confirm-screen/payments-template",
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus
                });
            }
        }
        self.getBranchAddress = function (draftDetails) {
            draftModel.getBranchAddress(self.demandDraftPayee().demandDraftDeliveryDTO.branch).done(function (data) {
                self.addressDetails.postalAddress = data.addressDTO[0] ? data.addressDTO[0].branchAddress.postalAddress : "";
                self.addressDetails.postalAddress.branchName = data.addressDTO[0] ? data.addressDTO[0].branchName : "";
                populateConfirmScreenDetails(draftDetails, self.addressDetails.postalAddress);
                self.stageTwo(true);
            });
        };
        self.getMyAddress = function (draftDetails) {
            draftModel.fetchCourierAddress(self.demandDraftPayee().demandDraftDeliveryDTO.addressType ? self.demandDraftPayee().demandDraftDeliveryDTO.addressType : "PST").done(function (data) {
                if (data.party) {
                    for (var i = 0; i < data.party.addresses.length; i++) {
                        if (data.party.addresses[i].type === self.demandDraftPayee().demandDraftDeliveryDTO.addressType) {
                            self.addressDetails.postalAddress = data.party.addresses[i].postalAddress ? data.party.addresses[i].postalAddress : "";
                            break;
                        }
                    }
                }
                populateConfirmScreenDetails(draftDetails, self.addressDetails.postalAddress);
                self.stageTwo(true);
            });
        };
    };
});