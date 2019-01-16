/**
 * review forex-deal-create contains all the methods to review the creation of a forex deal booking
 *
 * @module forex-deal
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} reviewForexDealModel
 * @requires {object} ResourceBundle
 */
define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/review-forex-deal-create",
    "ojs/ojcheckboxset",
    "ojs/ojgauge",
    "ojs/ojbutton"
], function(oj, ko, $, reviewForexDealModel, ResourceBundle) {
    "use strict";

    /** Review Forex Deal Initiation.
     *
     * This component will allow the user to review the forex deal booking if he has access to forex deal booking.
     *
     * @param {object} rootParams  An object which contains contect of dashboard and param values
     * @return {function} function
     *
     */
    return function(rootParams) {
        var self = this,
            confirmScreenDetailsArray;
        ko.utils.extend(self, rootParams.rootModel);

        self.nls = ResourceBundle;
        self.createForexDealModel = self.params.createForexDealModel || self.params.data;
        self.currencyCombo = ko.observable(self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.createForexDealModel.forexDealDTO.buyAmount.currency() + " - " + self.createForexDealModel.forexDealDTO.sellAmount.currency() : self.createForexDealModel.forexDealDTO.sellAmount.currency() + " - " + self.createForexDealModel.forexDealDTO.buyAmount.currency());
        void(self.params.reviewMode && rootParams.dashboard.headerName(self.nls.forexDeal.header));
        self.selectedRateType = ko.observable(self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.nls.forexDeal.buy : self.nls.forexDeal.sell);
        self.rateCurrency = ko.observable(self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.createForexDealModel.forexDealDTO.buyAmount.currency() : self.createForexDealModel.forexDealDTO.sellAmount.currency());
        self.rateAmount = ko.observable(self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.createForexDealModel.forexDealDTO.buyAmount.amount() : self.createForexDealModel.forexDealDTO.sellAmount.amount());
        self.dealType = ko.observable(self.createForexDealModel.forexDealDTO.dealType() === "S" ? self.nls.forexDeal.spot : self.nls.forexDeal.forward);
        self.forward = ko.observable(self.createForexDealModel.forexDealDTO.dealType() === "S" ? 0 : 1);
        self.partyName = ko.observable();
        self.refreshScreen = ko.observable(false);
        self.timeHandler = ko.observable();
        self.totalWaitTimeInMilliseconds = ko.observable();
        self.exchangeRateValidTime = ko.observable();
        self.remainingTime = ko.observable();
        self.totalWaitTimeInSeconds = ko.observable();
        self.remainingTimeInSeconds = ko.observable();
        self.currentTask = ko.observable("FX_M_CFX");
        rootParams.baseModel.registerComponent("forex-deal-create", "forex-deal");
        rootParams.baseModel.registerElement("confirm-screen");
        /**
         *  This function is to fetch the time value for the user's chosen currency combination.
         *  @memberOf review-forex-deal-create
         *  @function getTimeDuration
         *  @returns {void}
         */
        function getTimeDuration() {
            var currCombinationValue = ({
                curr1: self.currencyCombo().split(" - ")[0],
                curr2: self.currencyCombo().split(" - ")[1]
            });
            reviewForexDealModel.getCurrencyPairs(currCombinationValue).then(function(response) {
                self.exchangeRateValidTime(response.forexDealMaintenanceDetails[0].hours + "-" + response.forexDealMaintenanceDetails[0].mins + "-" + response.forexDealMaintenanceDetails[0].sec);
                self.exchangeRateValidTime(self.exchangeRateValidTime().split("-"));
                self.totalWaitTimeInMilliseconds((self.exchangeRateValidTime()[0] * 60 * 60 * 1000) + (self.exchangeRateValidTime()[1] * 60 * 1000) + (self.exchangeRateValidTime()[2] * 1000));
                self.totalWaitTimeInSeconds(self.totalWaitTimeInMilliseconds() / 1000);
                self.remainingTimeInSeconds(self.totalWaitTimeInMilliseconds() / 1000);
            });
        }

        getTimeDuration();

        var exchangeCodes = ({
            branchCode: self.params.homeBranchCodeParams,
            ccy1Code: self.currencyCombo().split(" - ")[0],
            ccy2Code: self.currencyCombo().split(" - ")[1]
        });

        /**
         *  This function is to fetch the exchange Rate
         *  @memberOf review-forex-deal-create
         *  @function fetchExchangeRate
         *  @returns {void}
         */
        function fetchExchangeRate() {
            reviewForexDealModel.getExchangeRate(exchangeCodes).then(function(response) {
                if (self.createForexDealModel.forexDealDTO.rateType() === "B")
                    self.createForexDealModel.forexDealDTO.rate(response.exchangeRateDetails[0].sellRate);
                else
                    self.createForexDealModel.forexDealDTO.rate(response.exchangeRateDetails[0].buyRate);
                self.refreshScreen(false);
                ko.tasks.runEarly();
                self.refreshScreen(true);
            });
        }

        fetchExchangeRate();

        var seconds, minutes, hours, timerId;
        /**
         *  This function is to start the timer to confirm the intiated transaction with in that timer.
         *  If the checker doesn't confirm the transaction with in that timer then exchange rate will
         be fetch again for the chosen currency combination.
         *  @memberOf review-forex-deal-create
         *  @function printDuration
         *  @returns {void}
         */
        function printDuration() {
            timerId = setInterval(function() {
                if (self.totalWaitTimeInMilliseconds() > 0) {
                    self.totalWaitTimeInMilliseconds(self.totalWaitTimeInMilliseconds() - 1000);
                    self.remainingTime(self.totalWaitTimeInMilliseconds());
                    seconds = Math.floor(self.remainingTime() / 1000);
                    minutes = Math.floor(seconds / 60);
                    seconds = seconds % 60;
                    hours = Math.floor(minutes / 60);
                    if (seconds < 10)
                        seconds = "0" + seconds;
                    if (minutes < 10)
                        minutes = "0" + minutes;
                    if (hours < 10)
                        hours = "0" + hours;
                    self.timeHandler({ text: hours + ":" + minutes + ":" + seconds });
                    if (self.remainingTimeInSeconds() !== 0)
                        self.remainingTimeInSeconds(self.remainingTimeInSeconds() - 1);
                    else {
                        clearInterval(timerId);
                    }
                } else if (self.totalWaitTimeInMilliseconds() <= 0) {
                    clearInterval(timerId);
                    $("#rate-expired").trigger("openModal");
                }
            }, 1000);
        }

        var successMessage, statusMessages;

        confirmScreenDetailsArray = [
            [{
                label: self.nls.forexDeal.dealType,
                value: self.dealType
            }, {
                label: self.createForexDealModel.forexDealDTO.dealType() === "F" ? self.nls.forexDeal.validity : "",
                value: self.createForexDealModel.forexDealDTO.dealType() === "F" ? rootParams.baseModel.format(self.nls.forexDeal.totalNoDays, {
                    bookingDate: rootParams.baseModel.formatDate(self.createForexDealModel.forexDealDTO.bookingDate()),
                    valueDate: rootParams.baseModel.formatDate(self.createForexDealModel.forexDealDTO.valueDate()),
                    noOfDays: parseInt(self.createForexDealModel.forexDealDTO.forwardPeriod())
                }) : ""
            }],
            [{
                label: self.selectedRateType,
                value: rootParams.baseModel.formatCurrency(self.rateAmount(), self.rateCurrency())
            }],
            [{
                label: self.nls.forexDeal.exchangeRate,
                value: rootParams.baseModel.formatCurrency(self.createForexDealModel.forexDealDTO.rate(), self.createForexDealModel.forexDealDTO.exchangeRateCurrency())
            }]
        ];


        if (!self.params.partyName) {
            reviewForexDealModel.fetchPartyDetails().then(function(data) {
                self.partyName(data.party.personalDetails.fullName);
            });
        } else {
            self.partyName(self.params.partyName);
        }

        /**
         *  This function will call while going back.
         *  Before going back first it will stop the timer if running then will land the user on the initiated page of the forex deal.
         *  @memberOf review-forex-deal-create
         *  @function onBack
         *  @returns {void}
         */
        self.onBack = function() {
            clearInterval(timerId);
            rootParams.dashboard.hideDetails();
        };

        /**
         *  This function will close the modal window.
         *  Before going back first it will stop the timer if running then will land the user on the initiated page of the forex deal.
         *  @memberOf review-forex-deal-create
         *  @function closeModal
         *  @returns {void}
         */
        self.closeModal = function() {
            $("#confirm-deal").trigger("closeModal");
        };

        /**
         *  This function will allow the user to create a forex deal booking when the user is either a Maker or .
         *  AutoAuth
         *  @memberOf review-forex-deal-create
         * @param {String} data  An object containing the current event of field
         * @param {String} status  An object containing the current event of field
         * @param {String} jqXHR  An object containing the current event of field
         *  @function confirmForexDeal
         *  @returns {void}
         */
        function confirmForexDeal(data, status, jqXHR) {
            self.httpStatus = jqXHR.status;
            if (self.httpStatus && self.httpStatus === 202) {
                successMessage = self.nls.common.confirmScreen.approvalMessages.PENDING_APPROVAL.successmsg;
                statusMessages = self.nls.common.confirmScreen.approvalMessages.PENDING_APPROVAL.statusmsg;
                confirmScreenDetailsArray[2][0].value = rootParams.baseModel.formatCurrency(self.createForexDealModel.forexDealDTO.rate(), self.createForexDealModel.forexDealDTO.exchangeRateCurrency());
            } else if (self.httpStatus && self.httpStatus === 201) {
                successMessage = self.nls.common.confirmScreen.successMessage;
                statusMessages = self.nls.common.confirmScreen.approvalMessages.APPROVED.statusmsg;
                confirmScreenDetailsArray[2][0].value = rootParams.baseModel.formatCurrency(data.forexDealDTO.rate, self.createForexDealModel.forexDealDTO.exchangeRateCurrency());
            }

            rootParams.dashboard.loadComponent("confirm-screen", {
                jqXHR: jqXHR,
                hostReferenceNumber: data.forexDealDTO ? data.forexDealDTO.dealId : null,
                transactionName: self.nls.forexDeal.header,
                confirmScreenExtensions: {
                    successMessage: successMessage,
                    statusMessages: statusMessages,
                    isSet: true,
                    taskCode: self.currentTask(),
                    confirmScreenDetails: confirmScreenDetailsArray,
                    template: "confirm-screen/forex-deal-template"
                }
            });
        }

        /**
         *  This function will allow the user to confirm the deal if the timer flag is true
         *
         *  @memberOf review-forex-deal-create
         *  @function forexDealBooking
         *  @returns {void}
         */
        var id;
        self.forexDealBooking = function() {
            reviewForexDealModel.forexDealBooking(id).done(function(data, status, jqXHR) {
                confirmForexDeal(data, status, jqXHR);
            });
        };

        /**
         *  This function will allow the user to create a forex deal booking when the user is either a Maker or .
         *  AutoAuth
         *
         *  @memberOf review-forex-deal-create
         *  @function confirmForexDealBooking
         *  @returns {void}
         */
        self.confirmForexDealBooking = function() {
            clearInterval(timerId);
            var forexDealPayload = ko.toJSON(self.createForexDealModel);
            reviewForexDealModel.confirmForexDeal(forexDealPayload).done(function(data, status, jqXHR) {
                if (data.forexDealDTO && data.forexDealDTO.confirmationRequired) {
                    id = data.forexDealDTO.dealId;
                    $("#confirm-deal").trigger("openModal");
                    printDuration();
                } else {
                    confirmForexDeal(data, status, jqXHR);
                }
            });
        };

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.nls.common.confirmScreen.approvalMessages.FAILED.successmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.nls.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
        };
        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.nls.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.nls.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
        };

        /**
         *  This function will allow the user to approve the forex deal when the user is either a Approver.
         *
         *  @memberOf review-forex-deal-create
         *  @returns {void}
         */
        if (self.confirmScreenExtensions) {
            ko.utils.extend(self.confirmScreenExtensions, {
                isSet: true,
                taskCode: self.currentTask(),
                confirmScreenDetails: confirmScreenDetailsArray,
                confirmScreenMsgEval: self.getConfirmScreenMsg,
                confirmScreenStatusEval: self.getConfirmScreenStatus,
                template: "confirm-screen/forex-deal-template"
            });
        }
    };
});