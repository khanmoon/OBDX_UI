define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/transaction-journey"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("page-section");
        self.nls = resourceBundle;
        self.transactionJourneyDetails = ko.observable(rootParams.rootModel.transactionDetails());
        self.approvedDetails = ko.observableArray([]);
        self.dividerWidth = ko.observable();
        self.dividerPosition = ko.observable();
        self.processedDetails = ko.observableArray([]);
        self.currentState = ko.observable();
        var temp = {};
        var processPending = {};
        function setTempData(data,msg,icon,currentState){
            temp.updatedByDetails = data.updatedByDetails || "";
            temp.lastUpdatedDate = data.lastUpdatedDate || "";
            temp.customMsg = msg;
            temp.icon = icon;
            self.currentState(currentState);
        }
        function setTransactionJourney() {
            if (self.transactionJourneyDetails().approvalDetails.status === "APPROVED" && self.transactionJourneyDetails().approvalDetails.action === "CREATE" && self.transactionJourneyDetails().processingDetails.currentStep === "exec" && self.transactionJourneyDetails().processingDetails.status === "S") {
                setTempData(self.transactionJourneyDetails(),self.nls.transactionJourney.customMsg.processed,"check","AUTO_APPROVED");
                temp.remarks = null;
                temp.reference = self.transactionJourneyDetails().processingDetails.referenceNumber || "";
                $(".transaction-journey > .transaction-journey__train-box:nth-child(3) .transaction-journey-train-box__block").addClass("transaction-journey-train-box__state-current");
                self.processedDetails.push(temp);
            } else if (self.transactionJourneyDetails().approvalDetails.status === "REJECTED" && self.transactionJourneyDetails().approvalDetails.action === "REJECT") {
                setTempData(self.transactionJourneyDetails(),null,"close","REJECTED");
                temp.remarks = self.transactionJourneyDetails().approvalDetails.remarks || "";
                self.approvedDetails.push(temp);
                $(".transaction-journey > .transaction-journey__train-box:nth-child(2) .transaction-journey-train-box__block").addClass("transaction-journey-train-box__state-current");
                $(".transaction-journey > .transaction-journey__train-box:nth-child(3) .transaction-journey-train-box__block").addClass("transaction-journey-train-box__disable");
            } else if (self.transactionJourneyDetails().approvalDetails.status === "PENDING_APPROVAL" && !self.transactionJourneyDetails().transactionHistoryDTOs) {
                self.currentState("INITIATED");
                $(".transaction-journey > .transaction-journey__train-box:nth-child(1) .transaction-journey-train-box__block").addClass("transaction-journey-train-box__state-current");
                $(".transaction-journey > .transaction-journey__train-box:nth-child(2) .transaction-journey-train-box__block").addClass("transaction-journey-train-box__disable");
                $(".transaction-journey > .transaction-journey__train-box:nth-child(3) .transaction-journey-train-box__block").addClass("transaction-journey-train-box__disable");
            } else if (self.transactionJourneyDetails().approvalDetails.status === "APPROVED" && self.transactionJourneyDetails().approvalDetails.action === "APPROVE" && self.transactionJourneyDetails().processingDetails.currentStep === "exec" && self.transactionJourneyDetails().processingDetails.status === "S") {
                setTempData(self.transactionJourneyDetails(),self.nls.transactionJourney.customMsg.processed,"check","PROCESSED_SUCCESSFULLY");
                temp.remarks = null;
                temp.reference = self.transactionJourneyDetails().processingDetails.referenceNumber || "";
                $(".transaction-journey > .transaction-journey__train-box:nth-child(3) .transaction-journey-train-box__block").addClass("transaction-journey-train-box__state-current");
                self.processedDetails.push(temp);
            } else if (self.transactionJourneyDetails().approvalDetails.status === "APPROVED" && self.transactionJourneyDetails().processingDetails.currentStep === "exec" && self.transactionJourneyDetails().processingDetails.status === "F") {
                temp.remarks = "";
                for (var i = 0; i < self.transactionJourneyDetails().errors.length; i++) {
                    temp.remarks = temp.remarks + self.transactionJourneyDetails().errors[i].errorMessage + "<br/>";
                }
                setTempData(self.transactionJourneyDetails(),self.nls.transactionJourney.customMsg.failedAtHost,"close","HOST_FAILURE");
                temp.reference = self.transactionJourneyDetails().processingDetails.referenceNumber || "";
                $(".transaction-journey > .transaction-journey__train-box:nth-child(3) .transaction-journey-train-box__block").addClass("transaction-journey-train-box__state-current");
                self.processedDetails.push(temp);
            } else if (self.transactionJourneyDetails().approvalDetails.status === "APPROVED" && self.transactionJourneyDetails().processingDetails.currentStep === "exec" && self.transactionJourneyDetails().processingDetails.status === "P") {
                processPending.remarks = "";
                for (var j = 0; j < self.transactionJourneyDetails().errors.length; j++) {
                    processPending.remarks = processPending.remarks + self.transactionJourneyDetails().errors[j].errorMessage + "<br/>";
                }
                setTempData(self.transactionJourneyDetails(),self.nls.transactionJourney.customMsg.executionPending,"close","EXECUTION_PENDING");
                processPending.reference = self.transactionJourneyDetails().processingDetails.referenceNumber || "";
                $(".transaction-journey > .transaction-journey__train-box:nth-child(3) .transaction-journey-train-box__block").addClass("transaction-journey-train-box__state-current");
            } else if (self.transactionJourneyDetails().approvalDetails.action === "APPROVE" && self.transactionJourneyDetails().processingDetails.currentStep === "approval") {
                setTempData(self.transactionJourneyDetails(),null,"check","PENDING_APPROVAL");
                temp.remarks = self.transactionJourneyDetails().approvalDetails.remarks || "";
                self.approvedDetails.push(temp);
                $(".transaction-journey > .transaction-journey__train-box:nth-child(3) .transaction-journey-train-box__block").addClass("transaction-journey-train-box__disable");
                $(".transaction-journey > .transaction-journey__train-box:nth-child(2) .transaction-journey-train-box__block").addClass("transaction-journey-train-box__state-current");
            }
        }
        setTransactionJourney();
        $(self.transactionJourneyDetails().transactionHistoryDTOs).each(function (k, v) {
            if (v.processingDetailDTO.currentStep === "exec" && v.processingDetailDTO.status === "S") {
                if (!v.remarks) {
                    v.remarks = null;
                }
                v.customMsg = null;
                v.reference = self.transactionJourneyDetails().processingDetails.referenceNumber || "";
                v.icon = "check";
                self.currentState("PROCESSED_SUCCESSFULLY");
                $(".transaction-journey > .transaction-journey__train-box:nth-child(3) .transaction-journey-train-box__block").addClass("transaction-journey-train-box__state-current");
                self.processedDetails.push(v);
            } else if (v.processingDetailDTO.currentStep === "exec" && v.processingDetailDTO.status === "F") {
                if (!v.remarks) {
                    v.remarks = null;
                }
                v.customMsg = null;
                v.reference = self.transactionJourneyDetails().processingDetails.referenceNumber || "";
                self.currentState("HOST_FAILURE");
                $(".transaction-journey > .transaction-journey__train-box:nth-child(3) .transaction-journey-train-box__block").addClass("transaction-journey-train-box__state-current");
                v.icon = "close";
                self.processedDetails.push(v);
            } else if (v.processingDetailDTO.currentStep === "exec" && v.processingDetailDTO.status === "P") {
                processPending.remarks = "";
                for (var j = 0; j < self.transactionJourneyDetails().errors.length; j++) {
                    processPending.remarks = processPending.remarks + self.transactionJourneyDetails().errors[j].errorMessage + "<br/>";
                }
                processPending.updatedByDetails = self.transactionJourneyDetails().updatedByDetails || "";
                processPending.lastUpdatedDate = self.transactionJourneyDetails().lastUpdatedDate || "";
                processPending.customMsg = self.nls.transactionJourney.customMsg.executionPending;
                processPending.reference = self.transactionJourneyDetails().processingDetails.referenceNumber || "";
                processPending.icon = "check";
                $(".transaction-journey > .transaction-journey__train-box:nth-child(3) .transaction-journey-train-box__block").addClass("transaction-journey-train-box__state-current");
            } else if (v.approvalDetails.action === "APPROVE" && v.processingDetailDTO.currentStep === "approval") {
                if (v.approvalDetails.remarks) {
                    v.remarks = v.approvalDetails.remarks;
                } else {
                    v.remarks = null;
                }
                v.customMsg = null;
                v.icon = "check";
                self.approvedDetails.push(v);
            }
        });
        if (!self.processedDetails().length && processPending.icon) {
            self.processedDetails.push(processPending);
        }
        if (rootParams.baseModel.small()) {
            $(".transaction-journey__train-box").find("div:nth-child(3)").css("display", "none");
        }
        if (!self.approvedDetails().length) {
            $("#approvedDetailsIcon").toggleClass("icon-arrow-up icon-arrow-down");
        }
        if (!self.processedDetails().length) {
            $("#processedDetailsIcon").toggleClass("icon-arrow-up icon-arrow-down");
        }
        function dividerWidth() {
            var myContainerWidth = $(".form-main-container").width();
            var usableWidth = 100;
            if (!rootParams.baseModel.small()) {
                myContainerWidth = myContainerWidth * usableWidth / 100;
            }
            self.dividerWidth("66.66%");
            self.dividerPosition(((myContainerWidth / 3) / 2) -15 + "px");
        }
        $(window).resize(function () {
            if (rootParams.baseModel.small()) {
                $(".transaction-journey__train-box").find("div:nth-child(3)").css("display", "none");
                $(".transaction-journey .transaction-journey__train-box:nth-child(1)").find("div.transaction-journey-train-box__block").trigger("click").find("i").addClass("icon-sort-desc").removeClass("icon-sort-asc");
            }
            dividerWidth();
        });
        self.toggleTransactionDetails = function (model, uiEvent) {
            if (!$(uiEvent.currentTarget).hasClass("transaction-journey-train-box__disable")) {
                if (rootParams.baseModel.small()) {
                    $(".transaction-journey__train-box").find("div:nth-child(3)").css("display", "none");
                    $(".transaction-journey__train-box").find("div.transaction-journey-train-box__block span.icons").addClass("icon-arrow-up").removeClass("icon-arrow-down");
                    $(uiEvent.currentTarget).find("span.icons").removeClass("icon-arrow-up").addClass("icon-arrow-down");
                    var journeyBox = $(uiEvent.currentTarget).parent().nextAll().clone();
                    $(journeyBox).toggle();
                    $(".smallOnlyJourney__train-box").empty().append(journeyBox);
                    $(".smallOnlyJourney .transaction-journey-train-box__block-container__block-details .transaction-journey-train-box__details div:nth-child(3)").css("display", "block");
                } else {
                    $(uiEvent.currentTarget).parent().nextAll().toggle();
                    $(uiEvent.currentTarget).find("span.icons").toggleClass("icon-arrow-up icon-arrow-down");
                }
            }
        };
        dividerWidth();
    };
});