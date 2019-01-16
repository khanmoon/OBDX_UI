/**
 * Edit Forex Deals list contains all the Forex Deals booked for the User , Active as well as Inactive.
 *
 * @module forex-deal-settings
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} editForexDealSettingsModel
 * @requires {object} ResourceBundle
 */
define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/edit-forex-deal-settings",
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
    "ojs/ojswitch",
    "ojs/ojinputtext"
], function(oj, ko, $, editForexDealSettingsModel, ResourceBundle) {
    "use strict";

    /**
     * User should see the landing page for List of Forex Deals .On clicking search , the deals will be enlisted.
     * Filter criteria is available above to filter the fetched records. Clicking search without any criteria will fetch
     * all the deals available for that user Active as well as Inactive.
     * @param {object}  rootParams  An object which contains content of dashboard and param values
     * @return {function} function
     */
    return function(rootParams) {
        var self = this,
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(editForexDealSettingsModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.dataSourceLoaded = ko.observable(false);
        self.pairsdataSource = ko.observable();
        self.stageTwo = ko.observable(true);
        rootParams.baseModel.registerComponent("review-forex-deal-settings", "forex-deal-settings");
        rootParams.baseModel.registerElement("confirm-screen");
        self.listOfCurrencyPairs = ko.observableArray([]);
        self.isError = ko.observable(false);
        self.deleteModalHeader = ko.observable("");
        self.deleteModalMessage = ko.observable("");
        self.currPairToBeDeleted = ko.observable("");
        self.forexDealTimerFlag = ko.observable(false);
        self.edit = ko.observable(true);
        self.columnArray = ko.observable();
        self.groupValid = ko.observable();

        rootParams.dashboard.headerName(self.resource.editForexDealSettings.header);

        editForexDealSettingsModel.fetchForexDealTimerFlag().then(function(data) {
            if (data.configResponseList.length !== 0) {
                self.forexDealTimerFlag(data.configResponseList[0].propertyValue === "Y");
            }
            /** Refers to columns of the landing table */
            self.columnArray(self.forexDealTimerFlag() ? [{
                    "headerText": self.resource.editForexDealSettings.currCombo,
                    "field": "currencyPair"
                },
                {
                    "headerText": self.resource.editForexDealSettings.refreshTimeFrame,
                    "field": "timeFrame"
                },
                {
                    "headerText": self.resource.editForexDealSettings.deleteAction,
                    "renderer": oj.KnockoutTemplateUtils.getRenderer("rowtemplate", true)
                }
            ] : [{
                    "headerText": self.resource.editForexDealSettings.currCombo,
                    "field": "currencyPair"
                },
                {
                    "headerText": self.resource.editForexDealSettings.deleteAction,
                    "renderer": oj.KnockoutTemplateUtils.getRenderer("rowtemplate", true)
                }
            ]);
        });

        /**
         * This function is triggered to fetch the Currency Pairs List from DB.
         *
         * @memberOf edit-forex-deal-settings
         * @function getCurrencyPairs
         * @returns {void}
         */
        self.getCurrencyPairs = function() {
            editForexDealSettingsModel.fetchCurrencyPairs().then(function(data) {
                self.populate(data.forexDealMaintenanceDetails);
            });
        };

        self.getCurrencyPairs();

        /**
         * This function is triggered when the Edit icon is clicked in the Table row to being able to edit the Refresh Time Frame values.
         *
         * @memberOf edit-forex-deal-settings
         * @param {Object} data it contains the row data
         * @function editPair
         * @returns {void}
         */
        self.editPair = function(data) {

            for (var b = 0; b < self.listOfCurrencyPairs().length; b++) {
                if (self.listOfCurrencyPairs()[b].currencyPair === data.currencyPair) {
                    self.listOfCurrencyPairs()[b].action = true;
                }
            }
            self.pairsdataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listOfCurrencyPairs(), {
                idAttribute: ["currencyPair"]
            }) || []));
        };

        /**
         * This function is triggered to save the Edited Currency Pair to DB
         *
         * @memberOf edit-forex-deal-settings
         * @function save
         * @returns {void}
         */
        self.save = function() {

            self.isError(false);

            self.settingsModel = getNewKoModel().settingsModel;
            for (var k = 0; k < self.listOfCurrencyPairs().length; k++) {
                if (self.listOfCurrencyPairs()[k].action === true) {
                    rootParams.baseModel.showMessages(null, [self.resource.editForexDealSettings.errorMessage.invalidSave], "ERROR");
                    self.isError(true);
                    break;
                }

                self.settingsModel.forexDealMaintenanceList().push({
                    hours: parseInt(0),
                    mins: self.listOfCurrencyPairs()[k].timeFrame.split("min(s)")[0].trim(),
                    sec: (self.listOfCurrencyPairs()[k].timeFrame.split("min(s) :")[1].trim()).split("sec(s)")[0].trim(),
                    currency1: self.listOfCurrencyPairs()[k].currencyPair.split("-")[0].trim(),
                    currency2: self.listOfCurrencyPairs()[k].currencyPair.split("-")[1].trim()
                });
            }

            if (!self.isError()) {
                var payload = ko.toJSON(self.settingsModel);
                editForexDealSettingsModel.updateCurrencyPairs(payload).done(function(data, status, jqXHR) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        transactionName: self.resource.editForexDealSettings.header,
                        template: "forex-deal/confirm-screen-templates/forex-deal-settings"
                    }, self);

                });
            }
        };

        /**
         * This function is triggered to reset the list Table on UI by fetching the Currency Pair list from DB.
         *
         * @memberOf edit-forex-deal-settings
         * @function reset
         * @returns {void}
         */
        self.reset = function() {
            self.getCurrencyPairs();
        };

        /**
         * This function is triggered the save icon is clicked in table array row to save the edit values of the Refresh Time frame.
         *
         * @memberOf edit-forex-deal-settings
         * @param {Object} data it contains the row data
         * @function saveEdited
         * @returns {void}
         */
        self.saveEdited = function(data) {

            self.isError(false);

            for (var d = 0; d < self.listOfCurrencyPairs().length; d++) {

                if (!self.listOfCurrencyPairs()[d].mins() && !self.listOfCurrencyPairs()[d].secs()) {
                    rootParams.baseModel.showMessages(null, [self.resource.editForexDealSettings.errorMessage.noTimeFrame], "ERROR");
                    self.isError(true);
                } else if ((self.listOfCurrencyPairs()[d].mins() && parseInt(self.listOfCurrencyPairs()[d].mins()) === 0) && (self.listOfCurrencyPairs()[d].secs() && parseInt(self.listOfCurrencyPairs()[d].secs()) === 0)) {
                    rootParams.baseModel.showMessages(null, [self.resource.editForexDealSettings.errorMessage.validTimeFrame], "ERROR");
                    self.isError(true);
                }

                if (!self.isError()) {
                    if (!self.listOfCurrencyPairs()[d].mins()) {
                        self.listOfCurrencyPairs()[d].mins(parseInt(0));
                    }

                    if (!self.listOfCurrencyPairs()[d].secs()) {
                        self.listOfCurrencyPairs()[d].secs(parseInt(0));
                    }

                    if (self.listOfCurrencyPairs()[d].currencyPair === data.currencyPair) {
                        self.listOfCurrencyPairs()[d].timeFrame = rootParams.baseModel.format(self.resource.editForexDealSettings.timeVar, {
                            mins: self.listOfCurrencyPairs()[d].mins(),
                            secs: self.listOfCurrencyPairs()[d].secs()
                        });
                        self.listOfCurrencyPairs()[d].action = false;
                    }

                }
            }

            self.pairsdataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listOfCurrencyPairs(), {
                idAttribute: ["currencyPair"]
            }) || []));
        };

        /**
         * This function is triggered to populate the list of Currency Pairs in the Landing Array Table
         *
         * @memberOf edit-forex-deal-settings
         * @param {Object} data it contains the rest response
         * @function populate
         * @returns {void}
         */
        self.populate = function(data) {

            self.listOfCurrencyPairs.removeAll();

            for (var a = 0; a < data.length; a++) {
                var pair = {
                    currencyPair: data[a].currency1 + " - " + data[a].currency2,
                    timeFrame: rootParams.baseModel.format(self.resource.editForexDealSettings.timeVar, {
                        mins: (data[a].mins).toString(),
                        secs: (data[a].sec).toString()
                    }),
                    action: false,
                    mins: ko.observable(data[a].mins),
                    secs: ko.observable(data[a].sec)
                };
                self.listOfCurrencyPairs.push(pair);
            }

            self.pairsdataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listOfCurrencyPairs(), {
                idAttribute: ["currencyPair"]
            }) || []));
            self.dataSourceLoaded(true);
            self.stageTwo(true);

        };

        /**
         * This function is triggered when the delete icon is triggered in the list to delete that particular Currency pair Config from DB.
         *
         * @memberOf edit-forex-deal-settings
         * @param {Object} data it contains the row data
         * @function deletePair
         * @returns {void}
         */
        self.deletePair = function(data) {
            self.currPairToBeDeleted = data;
            $("#panelDD").trigger("closeFloatingPanel");
            self.deleteModalHeader(self.resource.editForexDealSettings.errorMessage.deleteTemplateHeader);
            self.deleteModalMessage(self.resource.editForexDealSettings.errorMessage.deleteTemplateMessage);
            $("#deleteTemplate").trigger("openModal");
        };

        /**
         * This function is triggered when the Yes Button is clicked on the Pop-up that asks for the confirmation of Delete.
         *
         * @memberOf edit-forex-deal-settings
         * @function delete
         * @returns {void}
         */
        self.delete = function() {
            $("#deleteTemplate").hide();
            var currency1 = self.currPairToBeDeleted.currencyPair.split("-")[0].trim(),
                currency2 = self.currPairToBeDeleted.currencyPair.split("-")[1].trim();
            editForexDealSettingsModel.deleteCurrencyPair(currency1, currency2).then(function() {
                self.getCurrencyPairs();
            });
        };
        /**
         * This function is triggered when the No Button is clicked on the Pop-up that asks for the confirmation of Delete.
         *
         * @memberOf edit-forex-deal-settings
         * @function closePopup
         * @returns {void}
         */
        self.closePopup = function() {
            $("#deleteTemplate").hide();
        };
    };
});