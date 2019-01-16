/**
 * ReView Forex Deals list contains all the Forex Deals configured by the Admin which are to be saved to DB.
 *
 * @module forex-deal-settings
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} reviewForexDealSettingsModel
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
    "ojs/ojswitch",
    "ojs/ojinputtext"
], function(oj, ko, $, reviewForexDealSettingsModel, ResourceBundle) {
    "use strict";

    /**
     * Admin should see the landing page for List of Forex Deals Confirations for Currency pairs to saved to DB.
     * @param {object}  rootParams  An object which contains content of dashboard and param values
     * @return {function} function
     */
    return function(rootParams) {
        var self = this,
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(reviewForexDealSettingsModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.dataSourceLoaded = ko.observable(false);
        self.forexDealTimerFlag = ko.observable(false);
        self.pairsdataSource = ko.observable();
        self.columnArray = ko.observable();
        rootParams.dashboard.headerName(self.resource.viewForexDealSettings.header);
        rootParams.baseModel.registerElement([
            "confirm-screen",
            "modal-window"
        ]);
        var pairListArray = [];

        /**
         * This function loads the colum array
         *
         * @memberOf review-forex-deal-settings
         * @function loadColumnArray
         * @returns {void}
         */
        function loadColumnArray() {
            /** Refers to columns of the landing table */
            self.pairsdataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(pairListArray,{
                idAttribute: ["currCombo"]
            }) || []));
            self.columnArray(self.forexDealTimerFlag() ? [{
                    "headerText": self.resource.viewForexDealSettings.currCombo,
                    "field": "currCombo"
                },
                {
                    "headerText": self.resource.viewForexDealSettings.refreshTimeFrame,
                    "field": "refreshTimeFrame"
                }
            ] : [{
                "headerText": self.resource.viewForexDealSettings.currCombo,
                "field": "currCombo"
            }]);

            self.dataSourceLoaded(true);
        }

        reviewForexDealSettingsModel.fetchForexDealTimerFlag().then(function(data) {
            if (data.configResponseList.length !== 0) {
                self.forexDealTimerFlag(data.configResponseList[0].propertyValue === "Y");
            }
            loadColumnArray();
        });

        var currencyPairDetails = [];
        if (self.params.mode === "approval") {
            var approvalData = self.params.data.forexDealMaintenanceList();
            for (var k = 0; k < self.params.data.forexDealMaintenanceList().length; k++) {
                currencyPairDetails[k] = {
                    pair: approvalData[k].currency1() + " - " + approvalData[k].currency2(),
                    timeFrame: rootParams.baseModel.format(self.resource.viewForexDealSettings.timeVar, {
                        mins: approvalData[k].mins(),
                        secs: approvalData[k].sec()
                    })
                };
            }
        } else {
            currencyPairDetails = self.params.currPairArray;
        }

        pairListArray = $.map(currencyPairDetails, function(a) {

            return {
                "currCombo": a.pair,
                "refreshTimeFrame": a.timeFrame
            };
        });

        /**
         * This function is triggered when the Back Button is clicked before saving the list to DB.
         *
         * @memberOf review-forex-deal-settings
         * @function back
         * @returns {void}
         */
        self.back = function() {
            rootParams.dashboard.loadComponent("view-forex-deal-settings", "forex-deal-settings", self);
        };

        /**
         *  This function will be Triggered when the Admin has reviewed the list of Forex Currency Configuration
         *  and is sure about saving them to DB.
         *
         *  @memberOf review-forex-deal-settings
         *  @function submit
         *  @returns {void}
         */
        self.submit = function() {
            self.settingsModel = getNewKoModel().settingsModel;
            for (var i = 0; i < self.params.payloadArray.length; i++) {
                self.settingsModel.forexDealMaintenanceList().push({
                    hours: self.params.payloadArray[i].hours,
                    mins: self.params.payloadArray[i].mins,
                    sec: self.params.payloadArray[i].sec,
                    currency1: self.params.payloadArray[i].currency1,
                    currency2: self.params.payloadArray[i].currency2
                });
            }

            var payload = ko.toJSON(self.settingsModel);
            reviewForexDealSettingsModel.confirmSettings(payload).done(function(data, status, jqXHR) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.resource.viewForexDealSettings.header,
                    template: "forex-deal/confirm-screen-templates/forex-deal-settings"
                }, self);

            });
        };

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.resource.common.confirmScreen.approvalMessages.FAILED.successmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
        };
        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.resource.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
        };

        /**
         *  This function will allow the user to approve the forex deal settings when the user is an Approver.
         *
         *  @memberOf review-forex-deal-settings
         *  @returns {void}
         */
        if (self.confirmScreenExtensions) {
            ko.utils.extend(self.confirmScreenExtensions, {
                isSet: true,
                confirmScreenMsgEval: self.getConfirmScreenMsg,
                confirmScreenStatusEval: self.getConfirmScreenStatus,
                template: "forex-deal/confirm-screen-templates/forex-deal-settings"
            });
        }
    };
});