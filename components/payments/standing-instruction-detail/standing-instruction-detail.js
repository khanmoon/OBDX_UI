define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/standing-instruction-detail",
    "framework/js/constants/constants",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojarraytabledatasource",
    "ojs/ojlistview",
    "ojs/ojpagingtabledatasource"
], function (oj, ko, $, standingInstructionDetailModel, ResourceBundle, Constants) {
    "use strict";
    return function (Params) {
        var self = this, baseModel = Params.baseModel;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.resource = ResourceBundle.payments.labels;
        self.details = ResourceBundle.payments.details;
        self.generic = ResourceBundle.payments.generic;
        self.common = ResourceBundle.payments.common;
        self.types = ResourceBundle.payments.types;
        self.pyTypes = ResourceBundle.payments.paymentTypes;
        self.viewSIDetailsData = ko.observable();
        self.detailsLoaded = ko.observable(false);
        self.stageCancel = ko.observable(false);
        self.stageReview = ko.observable(false);
        self.stageView = ko.observable(false);
        self.purpose = ko.observable();
        self.confirmScreenDetails = self.params.confirmScreenDetails;
        self.SIDetailsList = ko.observableArray();
        self.SIDetailsDataSource = ko.observable();
        var count = 1;
        self.count = ko.observable(0);
        self.externalReferenceId = ko.observable(Params.externalReferenceId || self.params.externalReferenceId);
        standingInstructionDetailModel.init(self.externalReferenceId());
        Params.baseModel.registerElement("confirm-screen");
        function sortTxnByDate(date1, date2) {
            if (date1.valueDate < date2.valueDate) {
                return -1;
            } else if (date1.valueDate > date2.valueDate) {
                return 1;
            } return 0;
        }
        if (self.params.isStopClicked() && baseModel.small())
            Params.dashboard.headerName(self.resource.stopSIHeader);
        else
            Params.dashboard.headerName(self.resource.headerName);
        if (self.externalReferenceId()) {
            standingInstructionDetailModel.getStandingInstructionDetails(self.externalReferenceId()).done(function (data) {
                self.viewSIDetailsData(data);
                if (self.viewSIDetailsData().instructionDetails.paymentDetailsList && self.viewSIDetailsData().instructionDetails.paymentDetailsList.length > 0) {
                    self.SIDetailsList(self.viewSIDetailsData().instructionDetails.paymentDetailsList);
                    self.SIDetailsList.sort(sortTxnByDate);
                }
                self.SIDetailsDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.SIDetailsList() || [])));
                if (self.viewSIDetailsData().instructionDetails.paymentType !== "SELFFT_SI" && self.viewSIDetailsData().instructionDetails.purpose !== "OTH") {
                    var purposeCode = self.viewSIDetailsData().instructionDetails.purpose;
                    standingInstructionDetailModel.getPurposeDesc().done(function (purposedata) {
                        if (purposedata.purposeList) {
                            for (var i = 0; i < purposedata.purposeList.length; i++) {
                                if (purposeCode === purposedata.purposeList[i].code) {
                                    self.purpose(purposedata.purposeList[i].description);
                                    break;
                                }
                            }
                        }
                    });
                }
                self.detailsLoaded(true);
                if(self.params.isStopClicked())
                    self.stageCancel(true);
                else
                    self.stageView(true);
                var confirmScreenDetailsArray = [
                    [
                        {
                            label: self.resource.transferTo,
                            value: self.viewSIDetailsData().instructionDetails.payeeNickName
                        },
                        {
                            label: self.resource.transferFrom,
                            value: self.viewSIDetailsData().instructionDetails.debitAccountId.displayValue
                        }
                    ],
                    [
                        {
                            label: self.resource.amount,
                            value: baseModel.formatCurrency(self.viewSIDetailsData().instructionDetails.amount.amount, self.viewSIDetailsData().instructionDetails.amount.currency)
                        },
                        {
                            label: self.resource.startDate,
                            value: baseModel.formatDate(self.viewSIDetailsData().instructionDetails.startDate)
                        }
                    ],
                    [
                        {
                            label: self.resource.endDate,
                            value: baseModel.formatDate(self.viewSIDetailsData().instructionDetails.endDate)
                        },
                        {
                            label: self.resource.frequency,
                            value: self.params.getRepeatData(self.viewSIDetailsData().instructionDetails)
                        }
                    ]
                ];
                if (typeof self.confirmScreenDetails === "function")
                    self.confirmScreenDetails(confirmScreenDetailsArray);
            });
        }
        self.renderSlNo = function () {
            if (count > self.SIDetailsList().length)
                count = 1;
            return count++;
        };
        self.closeWarning = function () {
            $("#Warning-StopSI").trigger("closeModal");
        };
        self.showWarning = function () {
            $("#Warning-StopSI").trigger("openModal");
        };
        self.viewDetails = function () {
            self.stageReview(false);
            if (self.params.isStopClicked()) {
                self.params.isStopClicked(true);
                self.stageCancel(true);
            } else {
                self.stageView(true);
                self.params.isStopClicked(false);
            }
        };
        self.stopRepeat = function () {
            var payload = ko.toJSON({ instructionType: "REC" });
            standingInstructionDetailModel.verifyCancelSI(payload).done(function () {
                if (self.params.isStopClicked()) {
                    self.stageCancel(false);
                    self.stageReview(true);
                    self.params.isStopClicked(true);
                } else if (self.userSegment === "CORP")
                        self.confirmCancelSI();
                    else {
                        self.stageView(false);
                        self.stageReview(true);
                        self.params.isStopClicked(false);
                    }
            });
        };
        self.confirmCancelSI = function () {
            standingInstructionDetailModel.confirmCancelSI().done(function (data, status, jqXHR) {
                var successMessage, statusMessages;
                self.httpStatus = jqXHR.status;
                if (self.userSegment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                    successMessage = self.common.confirmScreen.corpMaker;
                    statusMessages = self.common.confirmScreen.approvalMessages.PENDING_APPROVAL.statusmsg;
                } else {
                    successMessage = self.common.confirmScreen.successSI;
                    statusMessages = self.common.success;
                }
                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    eReceiptRequired: true,
                    transactionName: self.resource.stopSIHeader,
                    confirmScreenExtensions: {
                        successMessage: successMessage,
                        statusMessages: statusMessages,
                        isSet: true,
                        eReceiptRequired: true,
                        taskCode: "PC_F_PIC",
                        confirmScreenDetails: self.confirmScreenDetails(),
                        template: "confirm-screen/payments-template"
                    }
                }, self);
            });
        };
    };
});