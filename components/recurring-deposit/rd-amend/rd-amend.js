/**
 * Recurring Deposit Edit Maturity Instruction.
 *
 * @module recurring-deposit
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} ResourceBundle
 */
define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/rd-amend",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton"
], function(oj, ko, $, amendRDModel, ResourceBundle) {
    "use strict";
    /** Reccuring Deposit Edit Maturity Instruction.
     *
     *It allows user to edit maturity Instruction for booked recurring deposit.
     * @param {object} rootParams  An object which contains contect of dashboard and param values
     * @return {function} function
     * @return {object} getNewKoModel
     *
     */
    return function(rootParams) {
        var self = this,

            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(amendRDModel.getNewModel());
                return KoModel;
            };

        self.amendModel = getNewKoModel().amendModel;
        self.selectedAccountValue = ko.observable();
        self.selectedAccountDisplayValue = ko.observable();
        ko.utils.extend(self, rootParams.rootModel.previousState || rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.baseModel.registerElement(["page-section", "row", "account-input", "bank-look-up"]);
        rootParams.dashboard.headerName(self.resource.header.amend);
        self.additionalDetails = ko.observable();
        self.payOutOptionsLoaded = ko.observable(false);
        self.payOutOptionList = ko.observableArray();
        self.additionalDetailsTransfer = ko.observable();
        self.branchDetailsLoaded = ko.observable(false);
        self.additionalBankDetails = ko.observable();
        self.validationTracker = ko.observable();
        self.groupValid = ko.observable();
        self.codeValid = ko.observable();
        rootParams.baseModel.registerComponent("review-rd-amend", "recurring-deposit");
        if (self.params && self.params.id) {
            self.selectedAccountValue(self.params.id.value);
            self.selectedAccountDisplayValue(self.params.id.displayValue);
        }
        /** The rest will be called once the component is loaded and html will be loaded only after
         * receiving the rest response.
         * Rest response can be either successful or rejected
         *
         * @instance {object} amendRDModel
         * @returns {object} data  It represent list of all payout options.
         */
        amendRDModel.getPayOutOptionList().then(function(response) {
            if (response) {
                self.payOutOptionList(response.enumRepresentations[0].data);
                self.payOutOptionsLoaded(true);
            }
        });
        /**
         * This function will open bank lookup modal which allows user to get complete bank details based on clearing code and some bank details.
         *
         * @memberOf rd-amend
         * @function bankLookupHandler
         * @returns {void}
         */
        self.bankLookupHandler = function() {
            $("#menuButtonDialog").trigger("openModal");
        };
        /**
         * This function will be triggered when payout option is selected by user.
         *
         * @memberOf rd-amend
         * @function payOutOptionChanged
         * @param {object} event  An object containing the current event of field
         * @returns {void}
         */
        self.payOutOptionChanged = function(event) {
            self.amendModel.payoutInstructions()[0].type(event.detail.value);
            if(self.amendModel.payoutInstructions()[0].type()==="E")
                  self.amendModel.payoutInstructions()[0].networkType("NEFT");
              else
                self.amendModel.payoutInstructions()[0].networkType(null);
            self.branchDetailsLoaded(false);
            self.amendModel.payoutInstructions()[0].accountId.value(null);
            self.amendModel.payoutInstructions()[0].accountId.displayValue(null);
             self.amendModel.payoutInstructions()[0].account(null);
            self.amendModel.payoutInstructions()[0].branchId(null);
            self.amendModel.payoutInstructions()[0].beneficiaryName(null);
            self.amendModel.payoutInstructions()[0].bankName(null);
            self.amendModel.payoutInstructions()[0].address.line1(null);
            self.amendModel.payoutInstructions()[0].address.line2(null);
            self.amendModel.payoutInstructions()[0].address.city(null);
            self.amendModel.payoutInstructions()[0].address.country(null);
            self.amendModel.payoutInstructions()[0].clearingCode(null);
        };
        /**
         * This function will be triggered when account is selected by user.
         *
         * @memberOf rd-amend
         * @function additionalDetailsSubscribe
         * param1 {object} additionalDetails An object containing the details of current account
         * @returns {void}
         */
        var additionalDetailsSubscribe = self.additionalDetails.subscribe(function(value) {
                self.amendModel.module(value.account.module);
            }),
            /**
             * This function will be triggered when account for Payout is selected by user.
             *
             * @memberOf rd-amend
             * @function subscriptionAdditionalDetailsTransfer
             * param1 {object} additionalDetailsTransfer An object containing the details of current account
             * @returns {void}
             */
            subscriptionAdditionalDetailsTransfer = self.additionalDetailsTransfer.subscribe(function(newValue) {
                if (newValue) {
                    self.amendModel.payoutInstructions()[0].accountId.displayValue(self.additionalDetailsTransfer().account.id.displayValue);
                    self.amendModel.payoutInstructions()[0].beneficiaryName(self.additionalDetailsTransfer().account.partyName);
                    self.amendModel.payoutInstructions()[0].branchId(self.additionalDetailsTransfer().account.branchCode);
                    self.amendModel.payoutInstructions()[0].bankName(self.additionalDetailsTransfer().address.branchName);
                    self.amendModel.payoutInstructions()[0].address.line1(self.additionalDetailsTransfer().address.branchAddress.postalAddress.line1);
                    self.amendModel.payoutInstructions()[0].address.line2(self.additionalDetailsTransfer().address.branchAddress.postalAddress.line2);
                    self.amendModel.payoutInstructions()[0].address.city(self.additionalDetailsTransfer().address.branchAddress.postalAddress.city);
                    self.amendModel.payoutInstructions()[0].address.country(self.additionalDetailsTransfer().address.branchAddress.postalAddress.country);
                }
            });
        /**
         * This function will be triggered to fetch bank details based on clearing code and network type.
         *
         * @memberOf rd-amend
         * @function  bankDetails
         * @returns {void}
         */
        self.bankDetails = function() {
            self.branchDetailsLoaded(false);
            var codeTracker = document.getElementById("codeTracker");
            if (codeTracker.valid === "valid") {
                amendRDModel.fetchBranch(self.amendModel.payoutInstructions()[0].networkType(), self.amendModel.payoutInstructions()[0].clearingCode()).then(function(data) {
                    self.amendModel.payoutInstructions()[0].address.line1(data.branchAddress.line1);
                    self.amendModel.payoutInstructions()[0].address.line2(data.branchAddress.line2);
                    self.amendModel.payoutInstructions()[0].address.city(data.branchAddress.city);
                    self.amendModel.payoutInstructions()[0].address.country(data.branchAddress.country);
                    self.amendModel.payoutInstructions()[0].bankName(data.name);
                    self.branchDetailsLoaded(true);
                });
            }
            else{
                codeTracker.showMessages();
                codeTracker.focusOn("@firstInvalidShown");

            }
        };
        /**
         * This function will validate all the details entered by user  for amend if all credentials are correct then
         *user is prompted to next screen for further processing.
         *
         * @memberOf rd-amend
         * @function  amendRD
         * @returns {void}
         */
        self.amendRD = function() {
            var tracker = document.getElementById("tracker123");

            if (tracker.valid !== "valid") {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
                return;
            }
            rootParams.dashboard.loadComponent("review-rd-amend", {
                amendModel: self.amendModel,
                selectedAccountValue: self.selectedAccountValue,
                selectedAccountDisplayValue:self.selectedAccountDisplayValue
            });
        };
        /**
         * This function will be triggered to cleanup the memory allocated to subscribed functions.
         *
         * @memberOf rd-amend
         * @function dispose
         * @returns {void}
         */
        self.dispose = function() {
            additionalDetailsSubscribe.dispose();
            subscriptionAdditionalDetailsTransfer.dispose();
        };
    };
});