define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/forex-deal-create",
    "ojs/ojcheckboxset",
    "ojs/ojdialog",
    "ojs/ojradioset",
    "ojs/ojknockout-validation",
    "ojs/ojbutton",
    "ojs/ojdatetimepicker",
    "ojs/ojswitch",
    "ojs/ojvalidationgroup",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox",
    "ojs/ojpopup"
], function(oj, ko, $, forexModel, ResourceBundle) {
    "use strict";
    /** New Forex Deal booking
     *
     * @param {object} rootParams  An object which contains contect of dashboard and param values
     * @return {function} function
     * @return {object} getNewKoModel
     *
     */
    return function(rootParams) {
        var self = this,
            date, getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(forexModel.getNewModel());
                return KoModel;
            };

        self.createForexDealModel = getNewKoModel().createForexDealModel;

        self.frequencyList = ko.observableArray([]);
        self.partyName = ko.observable();
        self.dealTypeArray = ko.observableArray();
        self.rateTypeArray = ko.observableArray();
        self.currComboArray = ko.observableArray();
        self.rateCurrencyArray = ko.observableArray();
        ko.utils.extend(self, rootParams.rootModel.previousState || rootParams.rootModel);
        self.nls = ResourceBundle;
        self.dealCreationAllowed = ko.observable(false);
        self.currencyForeign = ko.observable(rootParams.rootModel.previousState ? (self.createForexDealModel.forexDealDTO.buyAmount.currency() + " - " + self.createForexDealModel.forexDealDTO.sellAmount.currency()) : "");
        self.forwardFrequency = ko.observable();
        self.rateCurrency = ko.observable();
        self.selectedDealType = ko.observable();
        self.selectedRateType = ko.observable();
        self.rateAmount = ko.observable(self.params && self.params.amount ? self.params.amount : null);
        self.groupValid = ko.observable();
        self.validationTracker = ko.observable();
        self.minBookingDate = ko.observable();
        self.validity = ko.observable();
        self.minValueDate = ko.observable();
        self.forexDealLimitTaskType = ko.observable();
        self.viewLimitsFlag = ko.observable();
        rootParams.dashboard.headerName(self.nls.forexDeal.header);
        rootParams.baseModel.registerComponent("review-forex-deal-create", "forex-deal");
        rootParams.baseModel.registerComponent("view-forex-deal-limits", "forex-deal");
        rootParams.baseModel.registerComponent("transfer-view-limits", "financial-limits");
        rootParams.baseModel.registerComponent("my-limits", "limits-enquiry");

        rootParams.baseModel.registerElement([
            "modal-window",
            "amount-input"
        ]);
        var dealTypeArray = 0;
        var rateTypeArray = 0;
        var homeBranchCode = 0;
        var selectedCurrencies = 0;
        var exchangeRateData = 0;

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
        forexModel.listAccessPoint().then(function(data) {
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
        /**
         * This function will help initializing the dealType and its associated fields.
         *
         * @memberOf forex-deal-create
         * @param {object} dealTypeArray  Deal type array
         * @param {object} rateTypeArray  Rate type array
         * @function dealRateTypeInitialization
         * @returns {void}
         */
        var dealRateTypeInitialization = function(dealTypeArray, rateTypeArray) {
            self.dealTypeArray(dealTypeArray);
            self.rateTypeArray(rateTypeArray);
            self.selectedDealType(dealTypeArray[0].id);
            self.createForexDealModel.forexDealDTO.dealType(dealTypeArray[0].id);
            self.createForexDealModel.forexDealDTO.rateType(rateTypeArray[0].id);
        };

        self.amountConverter = ko.observable({
            "type": "number",
            "options": {
                "style": "currency",
                "currency": null,
                "currencyDisplay": "symbol"
            }
        });

        self.exchangeAmountConverter = ko.observable({
            "type": "number",
            "options": {
                "style": "currency",
                "currency": self.createForexDealModel.forexDealDTO.exchangeRateCurrency(),
                "currencyDisplay": "symbol",
                "maximumFractionDigits": 4,
                "roundingMode": "HALF_EVEN"
            }
        });

        /**
         * This function will help to load the exchangeRate.
         *
         * @memberOf forex-deal-create
         * @function exchangeRate
         * @returns {void}
         */
        var exchangeRate = function() {
            var exchangeCodes = ({
                branchCode: homeBranchCode,
                ccy1Code: selectedCurrencies[0],
                ccy2Code: selectedCurrencies[1]
            });

            self.createForexDealModel.forexDealDTO.exchangeRateCurrency(selectedCurrencies[1]);

            forexModel.getExchangeRate(exchangeCodes).then(function(response) {

                exchangeRateData = {
                    buyRate: response.exchangeRateDetails[0].buyRate,
                    sellRate: response.exchangeRateDetails[0].sellRate,
                    midRate: response.exchangeRateDetails[0].midRate
                };

                self.createForexDealModel.forexDealDTO.rate(exchangeRateData.midRate);

                ko.tasks.runEarly();

            });
        };

        if (rootParams.rootModel.previousState) {
            self.selectedDealType(self.createForexDealModel.forexDealDTO.dealType());

            if (self.createForexDealModel.forexDealDTO.dealType() === "F") {
                var frequency = ko.utils.arrayFirst(self.frequencyList(), function(freq) {
                    return freq.value === self.createForexDealModel.forexDealDTO.forwardPeriod();
                });
                self.forwardFrequency(frequency !== null ? self.createForexDealModel.forexDealDTO.forwardPeriod() : "0");
            }

            self.rateCurrency(self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.createForexDealModel.forexDealDTO.buyAmount.currency() : self.createForexDealModel.forexDealDTO.sellAmount.currency());
            self.currencyForeign(self.createForexDealModel.forexDealDTO.buyAmount.currency() + " - " + self.createForexDealModel.forexDealDTO.sellAmount.currency());
            self.rateAmount(self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.createForexDealModel.forexDealDTO.buyAmount.amount() : self.createForexDealModel.forexDealDTO.sellAmount.amount());
            homeBranchCode = self.homeBranchCodeParams;
            date = self.dateParams;
            self.dealCreationAllowed(true);
            ko.tasks.runEarly();
        }

        /**
         * This function will handle the updation of currency pairs
         *
         * @memberOf forex-deal-create
         * @function changeCurrencyPair
         * @returns {void}
         */

        self.changeCurrencyPair = function() {
            if (self.currencyForeign()) {
                if (!self.reviewMode) {
                    selectedCurrencies = self.currencyForeign().split(" - ");
                    self.rateCurrencyArray([]);
                    ko.tasks.runEarly();
                    self.rateCurrencyArray.push({
                        description: selectedCurrencies[0],
                        code: selectedCurrencies[0]
                    }, {
                        description: selectedCurrencies[1],
                        code: selectedCurrencies[1]
                    });
                    self.createForexDealModel.forexDealDTO.sellAmount.currency(selectedCurrencies[1]);
                    self.createForexDealModel.forexDealDTO.buyAmount.currency(selectedCurrencies[0]);
                    self.rateCurrency(selectedCurrencies[0]);
                } else {
                    selectedCurrencies = self.selectedCurrencies;
                    self.currencyForeign(selectedCurrencies[0] + " - " + selectedCurrencies[1]);
                    self.reviewMode = false;
                }


                if (self.createForexDealModel.forexDealDTO.dealType() === "S") {
                    var spotValueDate = new Date(date);
                    spotValueDate.setDate(spotValueDate.getDate() + 2);
                    self.createForexDealModel.forexDealDTO.valueDate(oj.IntlConverterUtils.dateToLocalIso(spotValueDate));
                }

                void((self.createForexDealModel.forexDealDTO.rateType() === "B" && self.selectedRateType(self.nls.forexDeal.buy)) || self.selectedRateType(self.nls.forexDeal.sell));

                self.amountConverter({
                    "type": "number",
                    "options": {
                        "style": "currency",
                        "currency": self.rateCurrency(),
                        "currencyDisplay": "symbol"
                    }
                });
                self.exchangeAmountConverter({
                    "type": "number",
                    "options": {
                        "style": "currency",
                        "currency": selectedCurrencies[1],
                        "currencyDisplay": "symbol",
                        "maximumFractionDigits": 4,
                        "roundingMode": "HALF_EVEN"
                    }
                });
                exchangeRate();
            }
        };
        void(rootParams.rootModel.previousState && self.changeCurrencyPair());

        /** All rest will be called once the component is loaded and html will be loaded only after
         * receiving the rest response.
         * Rest response can be either successful or rejected
         *
         * @instance {object} forexModel
         * param1 {forexModel.object} getHostDate
         * param2 {forexModel.object} getCurrencyPairs
         * param3 {forexModel.object} fetchDealTypeList
         * param4 {forexModel.object} fetchBankConfig
         * param5 {forexModel.object} fetchForexDealCreationFlag
         */
        if (!rootParams.rootModel.previousState) {
            Promise.all([forexModel.getHostDate(), forexModel.getCurrencyPairs(), forexModel.fetchDealTypeList(), forexModel.fetchBankConfig(), forexModel.fetchForexDealCreationFlag(), forexModel.fetchRateTypeList(), forexModel.fetchPartyDetails()]).then(function(response) {
                var dateResponse = response[0];
                var data = response[1];
                var dealTypeList = response[2];
                var forexDealCreationAllowed = response[4].partyPreferencesDTOs.dealCreationAllowed;
                homeBranchCode = response[3].bankConfigurationDTO.homeBranch;
                var rateTypeList = response[5];
                if (forexDealCreationAllowed === true)
                    self.dealCreationAllowed(true);
                else {
                    rootParams.baseModel.showMessages(null, [self.nls.info.dealCreationNotAllowedInfoMessage], "SUCCESS", function() {
                        history.back();
                    });
                }
                if (dateResponse && dateResponse.currentDate !== null) {
                    date = new Date(dateResponse.currentDate.valueDate);
                    self.createForexDealModel.forexDealDTO.bookingDate(dateResponse.currentDate.valueDate);
                }

                var ccyArray = [];
                for (var i = 0; i < data.forexDealMaintenanceDetails.length; i++) {
                    ccyArray[i] = data.forexDealMaintenanceDetails[i].currency1 + " - " + data.forexDealMaintenanceDetails[i].currency2;
                    self.currComboArray.push({
                        value: ccyArray[i],
                        text: ccyArray[i]
                    });
                }

                rateTypeArray = [{
                    id: rateTypeList.enumRepresentations[0].data[0].code,
                    label: rateTypeList.enumRepresentations[0].data[0].description
                }, {
                    id: rateTypeList.enumRepresentations[0].data[1].code,
                    label: rateTypeList.enumRepresentations[0].data[1].description
                }];

                dealTypeArray = [{
                    id: dealTypeList.enumRepresentations[0].data[0].code,
                    label: dealTypeList.enumRepresentations[0].data[0].description
                }, {
                    id: dealTypeList.enumRepresentations[0].data[1].code,
                    label: dealTypeList.enumRepresentations[0].data[1].description
                }];
                dealRateTypeInitialization(dealTypeArray, rateTypeArray);

                for (var n = 0; n < self.currComboArray().length; n++) {
                    if (self.params && ko.utils.unwrapObservable(self.params.transferCurrency)) {
                        if (self.params.transferCurrency() + " - " + self.params.currency2 === self.currComboArray()[n].value) {
                            self.currencyForeign(self.params.transferCurrency() + " - " + self.params.currency2);
                            self.createForexDealModel.forexDealDTO.rateType(self.rateTypeArray()[0].id);
                            self.createForexDealModel.forexDealDTO.buyAmount.currency(self.params.transferCurrency());
                            self.createForexDealModel.forexDealDTO.sellAmount.currency(self.params.currency2);
                        } else if ((self.params.currency2 + " - " + self.params.transferCurrency()) === self.currComboArray()[n].value) {
                            self.currencyForeign(self.params.currency2 + " - " + self.params.transferCurrency());
                            self.createForexDealModel.forexDealDTO.rateType(self.rateTypeArray()[1].id);
                            self.createForexDealModel.forexDealDTO.buyAmount.currency(self.params.currency2);
                            self.createForexDealModel.forexDealDTO.sellAmount.currency(self.params.transferCurrency());
                        }
                        self.rateCurrency(self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.createForexDealModel.forexDealDTO.buyAmount.currency() : self.createForexDealModel.forexDealDTO.sellAmount.currency());
                    }
                }

                if (!self.partyName()) {
                    self.partyName(response[6].party.personalDetails.fullName);
                }

                self.changeCurrencyPair();
                ko.tasks.runEarly();
            });
        }

        /**
         * This function will help to load the frequencyList.
         *
         * @memberOf forex-deal-create
         * @function frequencylistSelected
         * @returns {void}
         */
        var frequencylistSelected = function() {
            if (self.frequencyList().length === 0) {
                forexModel.fetchFrequencyList().then(function(frequencyListResponse) {
                    if (frequencyListResponse && frequencyListResponse.enumRepresentations[0].data !== null && frequencyListResponse.enumRepresentations[0].data.length > 0) {
                        for (var m = 0; m < frequencyListResponse.enumRepresentations[0].data.length; m++) {
                            self.frequencyList.push({
                                text: frequencyListResponse.enumRepresentations[0].data[m].description,
                                value: frequencyListResponse.enumRepresentations[0].data[m].code
                            });
                        }
                    }
                });
            }
            ko.tasks.runEarly();
        };

        /**
         * This function will handle the updation of dealType
         *
         * @memberOf forex-deal-create
         * @function dealTypeArrayChanged
         * @param {object} event  An object containing the current event of field
         * @returns {void}
         */
        self.dealTypeArrayChanged = function(event) {
            if (event.detail.value !== event.detail.previousValue) {
                if (self.selectedDealType() === self.dealTypeArray()[0].id) {
                    self.createForexDealModel.forexDealDTO.dealType(self.dealTypeArray()[0].id);
                } else if (self.selectedDealType() === self.dealTypeArray()[1].id) {
                    self.createForexDealModel.forexDealDTO.dealType(self.dealTypeArray()[1].id);
                    frequencylistSelected();
                }
            }
        };

        /**
         * This function will handle the operation of currency parser
         *
         * @memberOf forex-deal-create
         * @function currencyParser
         * @returns  {Array} currencies contains the array of currency array
         */
        self.currencyParser = function(){
            return {currencies : self.rateCurrencyArray()};
        };

        var rateCurrency = self.rateCurrency.subscribe(function(newValue){
            self.amountConverter().options.currency = newValue;
            self.exchangeAmountConverter().options.currency = selectedCurrencies[1];
            ko.tasks.runEarly();
        });

        /**
         * This function will handle the updation of dealType
         *
         * @memberOf forex-deal-create
         * @function rateCurrencyHandler
         * @param {object} event  An object containing the current event of field
         * @returns {void}
         */
        self.rateCurrencyHandler = function(event) {
            self.amountConverter().options.currency = event.detail.value;
            self.exchangeAmountConverter().options.currency = selectedCurrencies[1];
            ko.tasks.runEarly();
        };

        /**
         * This function will handle the updation of dealType
         *
         * @memberOf forex-deal-create
         * @function rateTypeChangeHandler
         * @param {object} event  An object containing the current event of field
         * @returns {void}
         */
        self.rateTypeChangeHandler = function(event) {
            if (event.detail.value !== event.detail.previousValue) {
                void((event.detail.value === "S" && self.selectedRateType(self.nls.forexDeal.sell)) || self.selectedRateType(self.nls.forexDeal.buy));
                self.rateCurrency(selectedCurrencies[0]);
            }
            self.createForexDealModel.forexDealDTO.rate(exchangeRateData.midRate);
        };

        /**
         * This function will handle the updation of forward frequency
         *
         * @memberOf forex-deal-create
         * @function forwardFreqHandler
         * @param {object} event  An object containing the current event of field
         * @returns {void}
         */
        var totalDays;
        var selectedDate, customDate;
        self.forwardFreqHandler = function(event) {
            if (event.detail.value === "0")
                customDate = event.detail.value;
            selectedDate = new Date(date);
            if (event.detail.value !== "0") {
                totalDays = event.detail.value;
                self.createForexDealModel.forexDealDTO.bookingDate(oj.IntlConverterUtils.dateToLocalIso(date));
                self.createForexDealModel.forexDealDTO.forwardPeriod(totalDays);
                selectedDate.setDate(selectedDate.getDate() + parseInt(self.createForexDealModel.forexDealDTO.forwardPeriod()));
                self.createForexDealModel.forexDealDTO.valueDate(oj.IntlConverterUtils.dateToLocalIso(selectedDate));
            } else {
                $("#custom-frequency").trigger("openModal");
                self.minBookingDate(oj.IntlConverterUtils.dateToLocalIso(date));
                selectedDate.setDate(selectedDate.getDate() + 1);
                self.minValueDate(oj.IntlConverterUtils.dateToLocalIso(selectedDate));
                self.createForexDealModel.forexDealDTO.valueDate(oj.IntlConverterUtils.dateToLocalIso(selectedDate));
                selectedDate.setDate(selectedDate.getDate() - 1);
            }
            self.forwardFrequency(event.detail.value);
        };

        /**
         * This function will handle all custom date frequency operations.
         *
         * @memberOf forex-deal-create
         * @function customDateHandler
         * @returns {void}
         */
        self.customDateHandler = function() {
            if (customDate === "0") {
                var customBookingDate = new Date(self.createForexDealModel.forexDealDTO.bookingDate());
                var customValueDate = new Date(self.createForexDealModel.forexDealDTO.valueDate());
                customBookingDate.setDate(customBookingDate.getDate() + 1);
                void((customValueDate.getTime() > customBookingDate.getTime() && self.createForexDealModel.forexDealDTO.valueDate(oj.IntlConverterUtils.dateToLocalIso(customValueDate))) || self.createForexDealModel.forexDealDTO.valueDate(oj.IntlConverterUtils.dateToLocalIso(customBookingDate)));
                self.minValueDate(oj.IntlConverterUtils.dateToLocalIso(customBookingDate));
                customBookingDate.setDate(customBookingDate.getDate() - 1);
                var timeDiff = Math.abs(customValueDate.getTime() - customBookingDate.getTime());
                var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
                self.createForexDealModel.forexDealDTO.forwardPeriod(diffDays);
            }
        };

        /**
         * This function will display the exchangeRate disclaimer
         *
         * @memberOf forex-deal-create
         * @function exchangeRateDiscPopUp
         * @param {object} open  An object containing the current event of field
         * @returns {void}
         */
        self.exchangeRateDiscPopUp = function(open) {
            var popup = document.querySelector("#exchangeRate-popup");
            if (open) {
                var listener = popup.open("exchange-rate-disclaimer");
                popup.addEventListener("ojOpen", listener);
            } else
                popup.close();
        };

        /**
         * This function will reset the frequency and close the modal window.
         *
         * @memberOf forex-deal-create
         * @function closeModal
         * @returns {void}
         */
        self.closeModal = function() {
            self.forwardFrequency(self.frequencyList()[0].value);
            $("#custom-frequency").hide();
        };

        /**
         * This function will close the after having set the custom frequency values.
         *
         * @memberOf forex-deal-create
         * @function customDateSelected
         * @returns {void}
         */
        self.customDateSelected = function() {
            $("#custom-frequency").hide();
        };

        /**
         * This function will initiate the forex deal.
         *
         * @memberOf forex-deal-create
         * @function initiateForexDeal
         * @returns {void}
         */
        self.initiateForexDeal = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker")))
                return;
            if (self.createForexDealModel.forexDealDTO.rateType() === "B") {
                self.createForexDealModel.forexDealDTO.sellAmount.currency(selectedCurrencies[selectedCurrencies.indexOf(self.rateCurrency()) ? 0 : 1]);
                self.createForexDealModel.forexDealDTO.buyAmount.currency(self.rateCurrency());
                self.createForexDealModel.forexDealDTO.buyAmount.amount(self.rateAmount());
            } else {
                self.createForexDealModel.forexDealDTO.buyAmount.currency(selectedCurrencies[selectedCurrencies.indexOf(self.rateCurrency()) ? 0 : 1]);
                self.createForexDealModel.forexDealDTO.sellAmount.currency(self.rateCurrency());
                self.createForexDealModel.forexDealDTO.sellAmount.amount(self.rateAmount());
            }

            rootParams.dashboard.loadComponent("review-forex-deal-create", {
                createForexDealModel: self.createForexDealModel,
                partyName: self.partyName,
                dealTypeArray: self.dealTypeArray,
                rateTypeArray: self.rateTypeArray,
                frequencyList: self.frequencyList,
                currComboArray: self.currComboArray,
                rateCurrencyArray: self.rateCurrencyArray,
                homeBranchCodeParams: homeBranchCode,
                selectedCurrencies: selectedCurrencies,
                dateParams: date,
                retainedData: self.params.retainedData,
                transferCurrency: self.params.transferCurrency,
                currency2: self.params.currency2,
                params: self.params,
                amount: self.params.amount,
                reviewMode: true
            });

        };

        /**
         * This function will be triggered to cleanup the memory allocated to subscribed functions.
         *
         * @memberOf forex-deal-create
         * @function dispose
         * @returns {void}
         */
        self.dispose = function() {
            rateCurrency.dispose();
        };
        self.showLimits = ko.observable(false);
        self.viewLimits = function() {
            self.showLimits(true);
            ko.tasks.runEarly();
            $("#forex-view-limit").trigger("openModal");
        };
        self.done = function() {
            self.selectedChannelIndex("");
            self.selectedChannel(false);
            ko.tasks.runEarly();
            $("#forex-view-limit").hide();
            self.showLimits(false);
        };
    };
});
