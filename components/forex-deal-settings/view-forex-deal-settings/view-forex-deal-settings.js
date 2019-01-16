/**
 * View Forex Deals list contains all the Forex Deals booked for the User , Active as well as Inactive.
 *
 * @module forex-deal-settings
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} viewForexDealSettingsModel
 * @requires {object} ResourceBundle
 */
define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/view-forex-deal-settings",
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
    "ojs/ojvalidationgroup",
    "ojs/ojswitch",
    "ojs/ojinputtext"
], function(oj, ko, $, viewForexDealSettingsModel, ResourceBundle) {
    "use strict";

    /**
     * Admin should see the landing page to set up Refresh Time Frame for Forex Deal Currencies.
     * Admin will select the Foreign Currency from the Drop down.
     * Set Up the Time Frame for various currency combos at once and also mark them as active or inactive.
     * @param {object}  rootParams  An object which contains content of dashboard and param values
     * @return {function} function
     */
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.dataSourceLoaded = ko.observable(false);
        self.pairsdataSource = ko.observable();
        self.stageTwo = ko.observable(false);
        self.CurrencyCodes = ko.observableArray();
        self.currComboArray = ko.observableArray();
        rootParams.baseModel.registerComponent("review-forex-deal-settings", "forex-deal-settings");
        rootParams.baseModel.registerComponent("edit-forex-deal-settings", "forex-deal-settings");
        self.selectedCurrency = ko.observable();
        self.isCurrLoaded = ko.observable(false);
        self.minsValue = ko.observable();
        self.secsValue = ko.observable();
        self.currPairArray = ko.observableArray([]);
        self.payloadArray = ko.observableArray([]);
        self.forexDealTimerFlag = ko.observable(false);
        self.edit = ko.observable(false);
        self.groupValid = ko.observable();

        rootParams.dashboard.headerName(self.resource.viewForexDealSettings.header);

        viewForexDealSettingsModel.fetchForexDealTimerFlag().then(function(data) {
            if (data.configResponseList.length !== 0) {
                self.forexDealTimerFlag(data.configResponseList[0].propertyValue === "Y");
            }
        });

        Promise.all([viewForexDealSettingsModel.fetchCurrency(), viewForexDealSettingsModel.fetchCurrencyPairs()]).then(function(response) {

            var k = 0;
            for (var i = 0; i < response[0].exchangeRateCurrency.length; i++) {
                var ccy2Array = response[0].exchangeRateCurrency[i].ccy2;
                for (var j = 0; j < ccy2Array.length; j++) {
                    self.currComboArray()[k] = {
                        value: response[0].exchangeRateCurrency[i].ccy1 + " - " + ccy2Array[j],
                        text: response[0].exchangeRateCurrency[i].ccy1 + " - " + ccy2Array[j]
                    };
                    k++;
                }
            }

            if (response[1].forexDealMaintenanceDetails.length !== 0) {
                for (var f = 0; f < response[1].forexDealMaintenanceDetails.length; f++) {
                    var pair = response[1].forexDealMaintenanceDetails[f].currency1 + " - " + response[1].forexDealMaintenanceDetails[f].currency2;
                    for (var m = 0; m < self.currComboArray().length; m++) {
                        if (self.currComboArray()[m].value === pair) {
                            self.currComboArray.splice(m, 1);
                            break;
                        }
                    }
                }
            }

            self.isCurrLoaded(true);

        });

        /**
         * This function is triggered when added pair is deleted before saving to DB.
         *
         * @memberOf view-forex-deal-settings
         * @param {Object} data it contains the row data
         * @function deletePair
         * @returns {void}
         */
        self.deletePair = function(data) {
            self.isCurrLoaded(false);
            for (var a = 0; a < self.currPairArray().length; a++) {
                if (self.currPairArray()[a].pair === data.pair) {
                    self.currComboArray.push({
                        value: data.pair,
                        text: data.pair
                    });
                    self.currPairArray.splice(a, 1);
                }
            }
            ko.tasks.runEarly();
            self.isCurrLoaded(true);
            self.pairsdataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.currPairArray(), {
                idAttribute: ["pair"]
            }) || []));
        };

        /**
         * This function is triggered when the added list of Currency Pairs is to be saved to DB
         *
         * @memberOf view-forex-deal-settings
         * @function save
         * @returns {void}
         */
        self.save = function() {
            if (self.currPairArray().length === 0) {
                rootParams.baseModel.showMessages(null, [self.resource.viewForexDealSettings.errorMessage.noCurrSelectedToSave], "ERROR");
            } else {

                for (var l = 0; l < self.currPairArray().length; l++) {
                    self.payloadArray.push({
                        currency1: self.currPairArray()[l].pair.split("-")[0].trim(),
                        currency2: self.currPairArray()[l].pair.split("-")[1].trim(),
                        hours: 0,
                        mins: self.currPairArray()[l].timeFrame.split("min(s)")[0].trim(),
                        sec: (self.currPairArray()[l].timeFrame.split("min(s) :")[1].trim()).split("sec(s)")[0].trim()
                    });
                }

                var parameters = {
                    mode: "REVIEW",
                    currPairArray: self.currPairArray(),
                    payloadArray: self.payloadArray()
                };
                rootParams.dashboard.loadComponent("review-forex-deal-settings", parameters);
            }
        };

        /**
         * This function is triggered when the add button is clicked to add the configuration of the Currency pair to the list
         *
         * @memberOf view-forex-deal-settings
         * @function addPair
         * @returns {void}
         */
        self.addPair = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker")))
                return;

            self.currPairArray.push({
                pair: self.selectedCurrency(),
                timeFrame: rootParams.baseModel.format(self.resource.viewForexDealSettings.timeVar, {
                    mins: self.minsValue(),
                    secs: self.secsValue()
                }),
                mins: ko.observable(self.minsValue()),
                secs: ko.observable(self.secsValue()),
                action: false
            });

            self.isCurrLoaded(false);
            for (var m = 0; m < self.currComboArray().length; m++) {
                if (self.currComboArray()[m].value === self.selectedCurrency()) {
                    self.currComboArray.splice(m, 1);
                    break;
                }
            }

            self.minsValue(null);
            self.secsValue(null);
            ko.tasks.runEarly();
            self.isCurrLoaded(true);
            self.pairsdataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.currPairArray(), {
                idAttribute: ["pair"]
            }) || []));
            self.selectedCurrency([]);
            self.dataSourceLoaded(true);
            self.stageTwo(true);

        };

        /** Refers to columns of the landing table */
        self.columnArray = [{
                "headerText": self.resource.viewForexDealSettings.currCombo,
                "field": "currCombo"
            },
            {
                "headerText": self.resource.viewForexDealSettings.refreshTimeFrame,
                "field": "refreshTimeFrame"
            },
            {
                "headerText": self.resource.viewForexDealSettings.deleteAction,
                "renderer": oj.KnockoutTemplateUtils.getRenderer("rowtemplate", true)
            }
        ];

        /**
         * This function is triggered when the Edit Deal Button is clicked on UI and takes to the Edit Deal Settings Page
         *
         * @memberOf view-forex-deal-settings
         * @function openEditDeal
         * @returns {void}
         */
        self.openEditDeal = function() {
            rootParams.dashboard.loadComponent("edit-forex-deal-settings");
        };
        /**
         * This function is triggered when the Edit icon is clicked in the Table row to being able to edit the Refresh Time Frame values.
         *
         * @memberOf edit-forex-deal-settings
         * @param {Object} data it contains the row data
         * @function editPair
         * @returns {void}
         */
        self.editPair = function(data) {

            for (var b = 0; b < self.currPairArray().length; b++) {
                if (self.currPairArray()[b].pair === data.pair) {
                    self.currPairArray()[b].action = true;
                }
            }
            self.pairsdataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.currPairArray(), {
                idAttribute: ["pair"]
            }) || []));
        };

        /**
         * This function is triggered the save icon is clicked in table array row to save the edit values of the Refresh Time frame.
         *
         * @memberOf view-forex-deal-settings
         * @param {Object} data it contains the row data
         * @function saveEdited
         * @returns {void}
         */
        self.saveEdited = function(data) {

            for (var d = 0; d < self.currPairArray().length; d++) {

                if (self.currPairArray()[d].pair === data.pair) {
                    self.currPairArray()[d].timeFrame = rootParams.baseModel.format(self.resource.viewForexDealSettings.timeVar, {
                        mins: ko.utils.unwrapObservable(data.mins),
                        secs: ko.utils.unwrapObservable(data.secs)
                    });
                    self.currPairArray()[d].mins = ko.utils.unwrapObservable(data.mins);
                    self.currPairArray()[d].secs = ko.utils.unwrapObservable(data.secs);
                    self.currPairArray()[d].action = false;
                }

            }
            self.pairsdataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.currPairArray(), {
                idAttribute: ["pair"]
            }) || []));
        };

    };
});