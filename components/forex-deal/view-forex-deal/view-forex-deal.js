/**
 * View Forex Deals list contains all the Forex Deals booked for the User , Active as well as Inactive.
 *
 * @module nominee
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} viewForexDealModel
 * @requires {object} ResourceBundle
 */
define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/view-forex-deal-list",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojlistview",
    "ojs/ojpopup",
    "ojs/ojbutton",
    "ojs/ojdatetimepicker",
    "ojs/ojtimezonedata",
    "ojs/ojtable",
    "ojs/ojradioset"
], function(oj, ko, $, viewForexDealModel, ResourceBundle) {
    "use strict";

    /**
     * User should see the landing page for List of Forex Deals .On clicking search , the deals will be enlisted.
     * Filter criteria is available above to filter the fetched records. Clicking search without any criteria will fetch
     * all the deals available for that user Active as well as Inactive.
     * @param {object}  rootParams  An object which contains content of dashboard and param values
     * @return {function} function
     */
    return function(rootParams) {
        var self = this;
        self.resource = ResourceBundle;
        self.dataSourceLoaded = ko.observable(false);
        self.dealsdataSource = ko.observable();
        self.stageTwo = ko.observable(false);
        self.moreSearchOptions = ko.observable(false);
        self.dealID = ko.observable(null);
        self.bookingDate = ko.observable(null);
        self.expiryDate = ko.observable(null);
        self.CurrencyCodes = ko.observableArray();
        self.StatusCodes = ko.observableArray();
        self.currentDate = ko.observable();
        self.isDateLoaded = ko.observable(false);
        self.isSearchClicked = ko.observable(false);
        self.productCount = ko.observable(true);
        rootParams.baseModel.registerComponent("view-forex-deal-details", "forex-deal");
        rootParams.baseModel.registerComponent("forex-deal-create", "forex-deal");
        rootParams.baseModel.registerElement(["search-box", "date-time"]);
        self.selectedDealType = ko.observable();
        self.selectedRateType = ko.observable();
        self.selectedStatus = ko.observable();
        self.selectedCurrency = ko.observable();
        self.isCurrLoaded = ko.observable(false);
        self.lookUpDealNumber = ko.observable();
        self.selectedDeal = ko.observable();
        self.isStatusLoaded = ko.observable(false);
        self.isDealTypesLoaded = ko.observable(false);
        self.isRateTypesLoaded = ko.observable(false);
        self.DealTypesCodes = ko.observableArray();
        self.RateTypeCodes = ko.observableArray();
        self.mode = ko.observable(false);
        ko.utils.extend(self, rootParams.rootModel.previousState || rootParams.rootModel);
        rootParams.dashboard.headerName(self.resource.viewForexDeal.header);

        if (!self.params.transferCurrency && !ko.utils.unwrapObservable(self.mode)) {
            viewForexDealModel.fetchCurrency().then(function(data) {
                for (var i = 0; i < data.exchangeRateCurrency.length; i++) {
                    if (self.CurrencyCodes().length === 0) {
                        self.CurrencyCodes.push({
                            id: data.exchangeRateCurrency[i].ccy1,
                            label: data.exchangeRateCurrency[i].ccy1
                        });
                        for (var k = 0; k < data.exchangeRateCurrency[i].ccy2.length; k++) {
                            self.CurrencyCodes.push({
                                id: data.exchangeRateCurrency[i].ccy2[k],
                                label: data.exchangeRateCurrency[i].ccy2[k]
                            });
                        }
                    } else {
                        var isFlag = false,
                            isFlag2 = false;
                        for (var j = 0; j < self.CurrencyCodes().length; j++) {
                            if (self.CurrencyCodes()[j].id === data.exchangeRateCurrency[i].ccy1) {
                                isFlag = true;
                            }
                        }
                        if (!isFlag) {
                            self.CurrencyCodes.push({
                                id: data.exchangeRateCurrency[i].ccy1,
                                label: data.exchangeRateCurrency[i].ccy1
                            });
                        }

                        for (var m = 0; m < data.exchangeRateCurrency[i].ccy2.length; m++) {
                            isFlag2 = false;
                            for (var n = 0; n < self.CurrencyCodes().length; n++) {
                                if (self.CurrencyCodes()[n].id === data.exchangeRateCurrency[i].ccy2[m]) {
                                    isFlag2 = true;
                                }
                            }
                            if (!isFlag2) {
                                self.CurrencyCodes.push({
                                    id: data.exchangeRateCurrency[i].ccy2[m],
                                    label: data.exchangeRateCurrency[i].ccy2[m]
                                });
                            }

                        }
                    }
                }

            });
            self.isCurrLoaded(true);
        }

        /**
         * This function will convert Expiry Date and Booking Date in Time to find the difference between both
         * and then calculate the validity period of the Deal.
         *
         * @memberOf view-forex-deal
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
         * This function will be called when User selects a particular deal from the list to
         * to see its details in the next page. The dealNumber and View Mode is been passed to the next page.
         *
         * @memberOf view-forex-deal
         * @param {object} data containd row data
         * @function onDealSelected
         * @returns {void}
         */
        self.onDealSelected = function(data) {
            var tempDealNum = rootParams.baseModel.large() === true ? data.dealNumber : data;
            self.mode = "VIEW";
            self.dealId = tempDealNum;
            rootParams.dashboard.loadComponent("view-forex-deal-details", self);
        };


        /**
         * This function will be called when User clicks on Initiate Deal Button to create a New Forex Deal.
         *
         * @memberOf view-forex-deal
         * @function openCreateDeal
         * @returns {void}
         */
        self.openCreateDeal = function() {
            rootParams.dashboard.loadComponent("forex-deal-create");
        };

        if (!self.params.transferCurrency) {
            viewForexDealModel.getHostDate().then(function(data) {
                var date = new Date(data.currentDate.valueDate);
                self.currentDate(rootParams.baseModel.formatDate(date));
                self.isDateLoaded(true);
            });
        }

        /**
         * This function will be called when User clicks on the show More option link on UI.
         * This function changes reverses the value every time it is clicked to show or not to show the more filter options.
         *
         * @memberOf view-forex-deal
         * @function showMoreSearchOptions
         * @returns {void}
         */
        self.showMoreSearchOptions = function() {
            self.moreSearchOptions(!self.moreSearchOptions());
        };

        /**
         * All rest will be called once the component is loaded and html will be loaded only after
         * receiving the rest response. The rest will fetch all the deals.
         * Rest response can be either successful or rejected.
         *
         * @memberOf view-forex-deal
         * @function fetchDeals
         * @param {String} selectedDealType contains selected deal type as sprot or forward
         * @param {String} selectedRateType contains rate type as Buy or Sell
         * @param {String} selectedCurrency contains selected currency for filter
         * @param {String} dealID contains Deal Number
         * @param {String} bookingDate contains booking Date
         * @param {String} expiryDate contains Expiry Date
         * @param {String} selectedStatus conatins status as active or inactive
         * @returns {void}
         **/
        var dealListArray = [];
        var dealDetailsMap = {};
        var statusTypeMap = {};
        var dealTypeMap = {};
        var rateTypeMap = {};
        var dealList, deal;
        var fetchDeals = function(currency1, currency2, selectedDealType, selectedRateType,
            dealID, bookingDate, expiryDate, selectedStatus) {
            viewForexDealModel.fetchForexDealList(selectedDealType, selectedRateType,
                currency1, currency2, dealID, bookingDate, expiryDate, selectedStatus).then(function(data) {
                if (data.forexDealDTO.length === 0) {
                    rootParams.baseModel.showMessages(null, [self.resource.viewForexDeal.errorMessage.noDealsAvailable], "ERROR");
                    if (self.params.transferCurrency) {
                        self.params.dealsAvailable(false);
                        self.dealsdataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([])));
                        self.params.dealPresent(0);
                        return;
                    }
                }
                dealListArray = $.map(data.forexDealDTO, function(a) {
                    var validity = self.customDateHandler(rootParams.baseModel.formatDate(a.bookingDate),
                        rootParams.baseModel.formatDate(a.valueDate));

                    var dealdetailsObj = {
                        "selectedDeal": {
                            "dealNumber": a.dealId,
                            "dealType": dealTypeMap[a.dealType],
                            "exchangeRate": rootParams.baseModel.formatCurrency(a.rate, self.params.transferCurrency ? self.params.transferCurrency() : a.sellAmount.currency)
                        },
                        "dealNumber": a.dealId,
                        "currCombo": a.buyAmount.currency + " - " + a.sellAmount.currency,
                        "dealTyAndVal": rootParams.baseModel.format(self.resource.viewForexDeal.dealTyAndValcomposition, {
                            dealpatterntype: dealTypeMap[a.dealType],
                            validity: validity
                        }),
                        "bookingDate": a.bookingDate,
                        "expiryDate": a.valueDate,
                        "exchangeRate": rootParams.baseModel.formatCurrency(a.rate, self.params.transferCurrency ? self.params.transferCurrency() : a.sellAmount.currency),
                        "rateType": rateTypeMap[a.rateType],
                        "dealAmount": rootParams.baseModel.formatCurrency(a.rateType === "B" ? a.buyAmount.amount : a.sellAmount.amount, a.rateType === "B" ? a.buyAmount.currency : a.sellAmount.currency),
                        "avalAmt": rootParams.baseModel.formatCurrency(a.avalAmt.amount, a.rateType === "B" ? a.buyAmount.currency : a.sellAmount.currency),
                        "availableAmount": a.avalAmt.amount,
                        "currency": a.rateType === "B" ? a.buyAmount.currency : a.sellAmount.currency,
                        "status": statusTypeMap[a.statusType]
                    };

                    dealDetailsMap[a.dealId] = dealdetailsObj.selectedDeal;
                    return dealdetailsObj;
                });

                if (self.params.transferCurrency) {
                    self.params.dealPresent(true);
                    dealList = ko.utils.arrayFilter(dealListArray, function(deal) {
                        return deal.availableAmount >= self.params.transferAmount();
                    });
                    if (dealList.length === 0) {
                        rootParams.baseModel.showMessages(null, [self.resource.viewForexDeal.errorMessage.noDealsAvailable], "ERROR");
                        self.params.dealPresent(0);
                        deal = dealListArray[0].selectedDeal;
                        self.params.firstRowDealId(deal.dealNumber);
                        self.params.selectedDealId(deal.dealNumber);
                    } else {
                        deal = dealList[0].selectedDeal;
                        self.params.firstRowDealId(deal.dealNumber);
                        self.params.selectedDealId(deal.dealNumber);
                    }
                }

                self.dealsdataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(dealList ? dealList : dealListArray, {
                    idAttribute: ["dealNumber"]
                }) || []));

                ko.tasks.runEarly();
                self.dataSourceLoaded(true);
            });
        };

        var transferAmount;
        if (self.params.transferAmount) {
            transferAmount = self.params.transferAmount.subscribe(function(value) {
                var filteredDeals = ko.utils.arrayFilter(dealListArray, function(deal) {
                    return deal.availableAmount >= value;
                });
                if (filteredDeals.length === 0) {
                    rootParams.baseModel.showMessages(null, [self.resource.viewForexDeal.errorMessage.noDealsAvailable], "ERROR");
                    self.dealsdataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([]) || []));
                } else {
                    self.params.firstRowDealId(filteredDeals[0].selectedDeal.dealNumber);
                    self.params.selectedDealId(filteredDeals[0].selectedDeal.dealNumber);
                    self.dealsdataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(filteredDeals, {
                        idAttribute: ["dealNumber"]
                    }) || []));
                }
                self.params.dealPresent(self.dealsdataSource().totalSize());
            });
        }

        /**
         * This function will be triggered to cleanup the memory allocated to subscribed functions.
         *
         * @memberOf view-forex-deal
         * @param {object} size contains size of the table data source
         * @function lookUpAllDeals
         * @returns {void}
         */
        self.lookUpAllDeals = function(size) {
            if (self.params.transferCurrency() && self.dataSourceLoaded() && !size) {
                self.dataSourceLoaded(false);
                self.dealsdataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(dealListArray, {
                    idAttribute: ["dealNumber"]
                }) || []));
                self.params.firstRowDealId(dealListArray[0].selectedDeal.dealNumber);
                self.params.selectedDealId(dealListArray[0].selectedDeal.dealNumber);
                self.params.dealPresent(1);
                self.dataSourceLoaded(true);
            }
        };

        /**
         * This function will be triggered to cleanup the memory allocated to subscribed functions.
         *
         * @memberOf view-forex-deal
         * @function dispose
         * @returns {void}
         */
        self.dispose = function() {
            if (self.params.transferCurrency) {
                transferAmount.dispose();
            }
        };


        /**
         * This function changes the deal details every time the radioset options change.
         *
         * @memberOf view-forex-deal
         * @param {String} event  An object containing the current event of field
         * @function forexDealChangeHandler
         * @returns {void}
         */
        self.forexDealChangeHandler = function(event) {
            if (self.params.lookUp() && event.detail.value) {
                deal = dealDetailsMap[event.detail.value];
                self.params.selectedDealId(deal.dealNumber);
            }
        };

        /** This function will be called when reset button is clicked to empty out all the selected search criteria.
         *
         * @memberof view-forex-deal
         * @function reset
         * @returns {void}
         */
        self.reset = function() {
            self.selectedDealType([]);
            self.selectedRateType([]);
            self.selectedCurrency([]);
            self.dealID("");
            self.bookingDate(null);
            self.expiryDate(null);
            self.selectedStatus([]);
            self.stageTwo(false);
            self.isSearchClicked(false);
        };

        /** This function will close the popup on either clicking cancel icon of popup or clicking anywhere
         *
         * @memberof view-forex-deal
         * @function closePopup
         * @returns {void}
         */
        self.closePopup = function() {
            var popup = document.querySelector("#popup");
            popup.close();
        };

        /**
         * This function will set the Deal Details and close the modal window.
         *
         * @memberOf view-forex-deal
         * @function proceed
         * @returns {void}
         */
        self.proceed = function() {
            self.params.selectedDealDetails.dealNumber(deal.dealNumber);
            self.params.selectedDealDetails.dealType(deal.dealType);
            self.params.selectedDealDetails.exchangeRate(deal.exchangeRate);
            self.params.selectedDealId(self.params.firstRowDealId());
            self.params.dealDetails(true);
            self.params.lookUp(false);
            if (rootParams.baseModel.large()) {
                $("#lookUpDealNumber").hide();
            } else {
                rootParams.dashboard.hideDetails();
            }
        };

        /** This function will be called when search button is clicked.
         *
         * @memberof view-forex-deal
         * @function search
         * @returns {void}
         */
        self.search = function() {
            self.stageTwo(true);
            self.isSearchClicked(true);
            fetchDeals(
                self.selectedCurrency(),
                null,
                self.selectedDealType(),
                self.selectedRateType(),
                self.dealID(),
                self.bookingDate(),
                self.expiryDate(),
                self.selectedStatus());
        };


        Promise.all([viewForexDealModel.fetchDealTypeList(), viewForexDealModel.fetchRateTypeList()]).then(function(response) {
            if (!ko.utils.unwrapObservable(self.mode)) {
                var dealData = response[0];
                var rateData = response[1];

                self.DealTypesCodes.push({
                    id: dealData.enumRepresentations[0].data[0].code,
                    label: dealData.enumRepresentations[0].data[0].description
                }, {
                    id: dealData.enumRepresentations[0].data[1].code,
                    label: dealData.enumRepresentations[0].data[1].description
                });

                self.RateTypeCodes.push({
                    id: rateData.enumRepresentations[0].data[0].code,
                    label: rateData.enumRepresentations[0].data[0].description
                }, {
                    id: rateData.enumRepresentations[0].data[1].code,
                    label: rateData.enumRepresentations[0].data[1].description
                });

            }
            for (var j = 0; j < self.DealTypesCodes().length; j++) {
                dealTypeMap[self.DealTypesCodes()[j].id] = self.DealTypesCodes()[j].label;
            }
            for (var k = 0; k < self.RateTypeCodes().length; k++) {
                rateTypeMap[self.RateTypeCodes()[k].id] = self.RateTypeCodes()[k].label;
            }
            self.isDealTypesLoaded(true);
            self.isRateTypesLoaded(true);

            if (self.params.transferCurrency) {
                fetchDeals(self.params.transferCurrency(), self.params.currency2, "F", "B");
            }
        });


        if (!self.params.transferCurrency) {
            viewForexDealModel.fetchStatusTypeList().then(function(data) {
                if (!ko.utils.unwrapObservable(self.mode)) {
                    for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        self.StatusCodes.push({
                            id: data.enumRepresentations[0].data[i].code,
                            label: data.enumRepresentations[0].data[i].description
                        });
                    }
                }

                for (var l = 0; l < self.StatusCodes().length; l++) {
                    statusTypeMap[self.StatusCodes()[l].id] = self.StatusCodes()[l].label;
                }
                self.isStatusLoaded(true);
            });
        }
    };
});