/**
 * Fetches the Details of a particular Deal selected.
 *
 * @module nominee
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} viewForexDealDetailsModel
 * @requires {object} ResourceBundle
 */
define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",
    "ojL10n!resources/nls/view-forex-deal-list",
    "promise",
    "ojs/ojlistview",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojdatacollection-utils",
    "ojs/ojarraytabledatasource",
    "ojs/ojknockout-validation",
    "ojs/ojbutton"
], function(oj, ko, $, BaseLogger, viewForexDealDetailsModel, ResourceBundle) {
    "use strict";

    /**
     * User should see the landing page with Details of particular deal selected from the list
     * @param {object}  rootParams  An object which contains content of dashboard and param values
     * @return {function} function
     */
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.viewForexDeal.header);
        self.dataSourceLoaded = ko.observable(false);
        self.dealsdataSource = ko.observable();
        self.tasksLoaded = ko.observable(true);
        self.dealNumber = ko.observable();
        self.currCombo = ko.observable();
        self.dealTyAndVal = ko.observable();
        self.duration = ko.observable();
        self.bookingDate = ko.observable();
        self.expiryDate = ko.observable();
        self.rateType = ko.observable();
        self.exchgRate = ko.observable();
        self.dealNumHeader = ko.observable();
        self.dealAmount = ko.observable();
        self.bookedAmount = ko.observable();
        self.utilizedAmount = ko.observable();
        self.availableAmount = ko.observable();
        self.settlementAccount = ko.observable();
        self.partyName = ko.observable();
        self.isPartyName = ko.observable(false);
        self.status = ko.observable();
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerComponent("view-forex-deal", "forex-deal");

        var statusTypeMap = {};
        var dealTypeMap = {};
        var rateTypeMap = {};


        /**
         * This function will be called when back button is clicked to traverse to previous page.
         *
         * @memberof viewForexDealDetailsModel an instance of viewForexDealDetailsModel
         * @function back
         * @returns {void}
         */
        self.back = function() {
            rootParams.dashboard.hideDetails();
        };
        self.getNewKoModel = function() {
            var KoModel = viewForexDealDetailsModel.getNewModel();
            return KoModel;
        };

        /**
         * This function will convert Expiry Date and Booking Date in Time to find the difference between both
         * and then calculate the validity period of the Deal.
         *
         * @memberOf view-forex-deal-details
         * @param {String} bkDate booking date
         * @param {String} expDate expiry date
         * @function customDateHandler
         * @returns {diffDays} validity period
         */
        self.customDateHandler = function(bkDate, expDate) {

            var customBookingDate = new Date(bkDate);
            var customValueDate = new Date(expDate);
            var timeDiff = Math.abs(customValueDate.getTime() - customBookingDate.getTime());
            var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
            return diffDays;
        };

        /**
         * This function will makes a rest call to fetch the details
         * of the fiorex deal pertaining to the specific dealID.
         *
         * @memberOf view-forex-deal-details
         * @function view
         * @returns {void}
         */
        self.view = function() {

            Promise.all([viewForexDealDetailsModel.fetchStatusTypeList(), viewForexDealDetailsModel.fetchDealTypeList(), viewForexDealDetailsModel.fetchRateTypeList(), viewForexDealDetailsModel.fetchPartyDetails(), viewForexDealDetailsModel.fetchForexDeal(self.params.dealId)]).then(function(data) {

                for (var i = 0; i < data[0].enumRepresentations[0].data.length; i++) {
                    statusTypeMap[data[0].enumRepresentations[0].data[i].code] = data[0].enumRepresentations[0].data[i].description;
                }

                for (var j = 0; j < data[1].enumRepresentations[0].data.length; j++) {
                    dealTypeMap[data[1].enumRepresentations[0].data[j].code] = data[1].enumRepresentations[0].data[j].description;
                }

                for (var k = 0; k < data[2].enumRepresentations[0].data.length; k++) {
                    rateTypeMap[data[2].enumRepresentations[0].data[k].code] = data[2].enumRepresentations[0].data[k].description;
                }

                self.partyName(data[3].party.personalDetails.fullName);
                self.isPartyName(true);

                var validity = self.customDateHandler(rootParams.baseModel.formatDate(data[4].forexDealDTO.bookingDate),
                    rootParams.baseModel.formatDate(data[4].forexDealDTO.valueDate));

                self.dealNumber(data[4].forexDealDTO.dealId);
                self.currCombo(data[4].forexDealDTO.buyAmount.currency + " - " + data[4].forexDealDTO.sellAmount.currency);
                self.dealTyAndVal(dealTypeMap[data[4].forexDealDTO.dealType]);
                self.duration(rootParams.baseModel.format(self.resource.viewForexDeal.dealDuration, {
                    validity: validity
                }));
                self.bookingDate(rootParams.baseModel.formatDate(data[4].forexDealDTO.bookingDate));
                self.expiryDate(rootParams.baseModel.formatDate(data[4].forexDealDTO.valueDate));
                self.rateType(rateTypeMap[data[4].forexDealDTO.rateType]);
                var dealAmount = data[4].forexDealDTO.rateType === "B" ? data[4].forexDealDTO.buyAmount.amount : data[4].forexDealDTO.sellAmount.amount;
                self.dealAmount(rootParams.baseModel.formatCurrency(dealAmount,
                    data[4].forexDealDTO.rateType === "B" ? data[4].forexDealDTO.buyAmount.currency : data[4].forexDealDTO.sellAmount.currency
                ));
                var availableAmount = data[4].forexDealDTO.avalAmt.amount;
                self.availableAmount(rootParams.baseModel.formatCurrency(
                    data[4].forexDealDTO.avalAmt.amount,
                    data[4].forexDealDTO.rateType === "B" ? data[4].forexDealDTO.buyAmount.currency : data[4].forexDealDTO.sellAmount.currency
                ));
                self.bookedAmount(self.dealAmount());
                self.utilizedAmount(rootParams.baseModel.formatCurrency((parseInt(dealAmount) - parseInt(availableAmount)),
                    data[4].forexDealDTO.rateType === "B" ? data[4].forexDealDTO.buyAmount.currency : data[4].forexDealDTO.sellAmount.currency
                ));
                self.status(statusTypeMap[data[4].forexDealDTO.statusType]);
                self.exchgRate(data[4].forexDealDTO.rate);
                self.dealNumHeader(rootParams.baseModel.format(self.resource.viewForexDeal.dealIdHeader, {
                    dealNumber: self.dealNumber()
                }));
                self.dataSourceLoaded(true);

            });

        };

        if (self.params.mode === "VIEW") {
            self.view();
        }
    };
});