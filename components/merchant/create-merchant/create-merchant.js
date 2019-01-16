define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/merchant",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojknockout-validation",
    "ojs/ojbutton",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, merchantModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(merchantModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.createMode = ko.observable(rootParams.rootModel.params.createMode);
        self.editMode = ko.observable(rootParams.rootModel.params.editMode);
        self.validationTracker = ko.observable();
        self.searchValue = ko.observable();
        self.stageReview = ko.observable(false);
        self.userAccountFlagArray=ko.observableArray();
        self.commissionAccountFlagArray=ko.observableArray();
        self.stageEdit = ko.observable(false);
        self.isBranchesLoaded = ko.observable(true);
        self.branches = ko.observableArray();
        self.branchesMap = {};
        rootParams.dashboard.headerName(self.resource.merchant.header);
        self.componentName = ko.observable(self.resource.merchant.merchant_header);
        self.viewMode = ko.observable(true);
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.merchants = [];
        self.merchantsList = ko.observableArray();
        self.merchantDetails = ko.observable();
        self.merchantId = ko.observable();
        self.merchantDescription = ko.observable();
        self.componentId = ko.observable();
        self.merchantPayload = ko.observable();
        self.checksumAlgorithmList = ko.observableArray("");
        self.checksumTypeList = ko.observableArray("");
        self.checksumAlgorithm = self.checksumAlgorithm || ko.observable();
        self.checksumType = self.checksumType || ko.observable();
        self.commissionAccountFlag = self.commissionAccountFlag || ko.observable(false);
        self.userAccountFlag = self.userAccountFlag || ko.observable(false);
        self.static_success_url = self.static_success_url || ko.observable();
        self.static_failure_url = self.static_failure_url || ko.observable();
        self.dynamic_failure_url = self.dynamic_failure_url || ko.observable();
        self.dynamic_success_url = self.dynamic_success_url || ko.observable();
        self.code = self.code || ko.observable();
        self.description = self.description || ko.observable();
        self.branch = self.branch || ko.observable();
        self.commissionBranch = self.commissionBranch || ko.observable();
        self.accountType = self.accountType || ko.observable();
        self.commissionAccount = self.commissionAccount || ko.observable();
        self.merchantAccount = self.merchantAccount || ko.observable();
        self.commissionAccountType = self.commissionAccountType || ko.observable();
        self.securityKey = self.securityKey || ko.observable("");
        self.merchantPayload(getNewKoModel().merchantModel);
        rootParams.baseModel.registerElement([
            "confirm-screen",
            "action-header",
            "modal-window"
        ]);
        rootParams.baseModel.registerComponent("view-merchant", "merchant");
        self.isChecksumAlgo = ko.observable(false);
        self.goToDashoard = function () {
            rootParams.dashboard.switchModule();
        };
         self.commissionAccountFlagChangeHandler = function() {
             if(self.commissionAccountFlag()===true)
                self.commissionAccountFlag(false);
            else
                self.commissionAccountFlag(true);
        };
         self.userAccountFlagChangeHandler = function() {
             if(self.userAccountFlag()===true)
                self.userAccountFlag(false);
            else
                self.userAccountFlag(true);
        };
        self.confirmEditMerchant = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("merchantTracker"))) {
                return;
            }
            self.merchantPayload().code(self.code());
            self.merchantPayload().description(self.description());
            self.merchantPayload().merchantAccount(self.merchantAccount());
            self.merchantPayload().accountType(self.accountType());
            if (self.commissionAccountFlag()) {
                self.merchantPayload().commissionAccountFlag("ENABLED");
                self.merchantPayload().commissionAccount(self.commissionAccount());
                self.merchantPayload().commissionAccountType(self.commissionAccountType().length > 1 ? self.commissionAccountType() : self.commissionAccountType());
            } else {
                self.merchantPayload().commissionAccountFlag("DISABLED");
                self.merchantPayload().commissionAccount(null);
                self.merchantPayload().commissionAccountType(null);
            }
            if (self.checksumType() !== "none") {
                self.merchantPayload().checksumType(self.checksumType());
            }
            self.merchantPayload().static_failure_url(self.static_failure_url());
            self.merchantPayload().static_success_url(self.static_success_url());
            self.merchantPayload().dynamic_success_url(self.dynamic_success_url());
            self.merchantPayload().dynamic_failure_url(self.dynamic_failure_url());
            self.merchantPayload().userAccountFlag(self.userAccountFlag());
            self.merchantPayload().checksumAlgorithm(self.checksumAlgorithm() === "none" ? null : self.checksumAlgorithm());
            void((self.merchantPayload().checksumAlgorithm() && self.merchantPayload().securityKey(self.securityKey())) || self.merchantPayload().securityKey(""));
            var payload = ko.toJSON(self.merchantPayload());
            merchantModel.updateMerchant(payload, self.code()).done(function (data, status, jqXHR) {
                self.stageOne(false);
                self.stageReview(false);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.resource.merchant.header,
                    template: "merchant/confirm-screen-templates/edit-merchant"
                }, self);
            });
        };
        self.createMerchant = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.merchantPayload().code(self.code());
            self.merchantPayload().description(self.description());
            self.merchantPayload().merchantAccount(self.merchantAccount());
            self.merchantPayload().userAccountFlag(!!self.userAccountFlag());
            self.merchantPayload().accountType(self.accountType());
            if (self.commissionAccountFlag()) {
                self.merchantPayload().commissionAccountFlag("ENABLED");
                self.merchantPayload().commissionAccount(self.commissionAccount());
                self.merchantPayload().commissionAccountType(self.commissionAccountType());
            } else {
                self.merchantPayload().commissionAccountFlag("DISABLED");
                self.merchantPayload().commissionAccount(self.commissionAccount());
                self.merchantPayload().commissionAccountType(self.commissionAccountType());
            }
            self.merchantPayload().static_success_url(self.static_success_url());
            self.merchantPayload().static_failure_url(self.static_failure_url());
            self.merchantPayload().dynamic_success_url(self.dynamic_success_url());
            self.merchantPayload().dynamic_failure_url(self.dynamic_failure_url());
            if (self.checksumType() !== "none") {
                self.merchantPayload().checksumType(self.checksumType());
            }
            if (self.checksumAlgorithm() !== "none") {
                self.merchantPayload().checksumAlgorithm(self.checksumAlgorithm());
                self.merchantPayload().securityKey(self.securityKey());
            }
            var payload = ko.toJSON(self.merchantPayload());
            merchantModel.createMerchant(payload).done(function (data, status, jqXHR) {
                self.stageReview(false);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.resource.merchant.header,
                    template: "merchant/confirm-screen-templates/create-merchant"
                }, self);
            });
        };
        self.cancelEditMerchant = function () {
            location.replace("dashboard.html");
        };
        self.confirmFlag = ko.observable(false);
        self.reviewMerchant = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("merchantTracker"))) {
                return;
            }
            self.stageOne(false);
            self.stageReview(true);
            self.confirmFlag(true);
        };
        self.reviewBack = function () {
            self.stageReview(false);
            self.stageOne(true);
        };
        self.back = function () {
            history.back();
        };
        self.checksumAlgorithmList.push({
            text: self.resource.merchant.none,
            value: "none"
        }, {
            text: "CRC32",
            value: "CRC32"
        });
        self.checksumTypeList.push({
            text: self.resource.merchant.none,
            value: "none"
        });
        self.checksumTypeChanged = function () {
            if (self.checksumType() !== "none") {
                self.checksumType(self.checksumType());
            } else {
                self.checksumType("none");
            }
        };
        self.algoChanged = function (event) {
                if (event.detail.value !== "none") {
                    self.isChecksumAlgo(true);
                } else {
                    self.securityKey(null);
                    self.isChecksumAlgo(false);
                }
        };
    };
});
