/**
 * ReView Forex Deals list contains all the Forex Deals configured by the Admin which are to be saved to DB.
 *
 * @module review-forex-deal-delete-settings
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} reviewForexDealDeleteSettingsModel
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
    "ojs/ojtable"
], function(oj, ko, $, reviewForexDeleteSettingsModel, ResourceBundle) {
    "use strict";

    /**
     * Admin should see the landing page for List of Forex Deals Confirations for Currency pairs to saved to DB.
     * @param {object}  rootParams  An object which contains content of dashboard and param values
     * @return {function} function
     */
    return function(rootParams) {
        var self = this;
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
         * @memberOf review-forex-deal-delete-settings
         * @function loadColumnArray
         * @returns {void}
         */
        function loadColumnArray() {
            /** Refers to columns of the landing table */
            self.pairsdataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(pairListArray, {
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

        reviewForexDeleteSettingsModel.fetchForexDealTimerFlag().then(function(data) {
            if (data.configResponseList.length !== 0) {
                self.forexDealTimerFlag(data.configResponseList[0].propertyValue === "Y");
            }
            loadColumnArray();
        });

        var currencyPairDetails = [];
        if (self.params.mode === "approval") {
            var approvalData = self.params.data;
            currencyPairDetails = [{
                pair: approvalData.currency1() + " - " + approvalData.currency2(),
                timeFrame: rootParams.baseModel.format(self.resource.viewForexDealSettings.timeVar, {
                    mins: approvalData.mins(),
                    secs: approvalData.sec()
                })
            }];
        }

        pairListArray = $.map(currencyPairDetails, function(a) {

            return {
                "currCombo": a.pair,
                "refreshTimeFrame": a.timeFrame
            };
        });

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