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
    "ojs/ojbutton"
], function (oj, ko, $, merchantModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle;
        self.viewMode = ko.observable(Params.rootModel.params.viewMode);
        self.reviewMode = ko.observable(Params.rootModel.params.reviewMode);
        self.stageReview = ko.observable(false);
        self.refresh = ko.observable(true);
        self.stageOne = ko.observable(false);
        self.merchantCode = self.params.merchantCode;
        Params.dashboard.headerName(self.resource.merchant.header);
        Params.baseModel.registerElement([
            "action-header",
            "confirm-screen"
        ]);
        Params.baseModel.registerComponent("merchant-dashboard", "merchant");
        Params.baseModel.registerComponent("create-merchant", "merchant");
        Params.baseModel.registerComponent("view-qr-code", "merchant");
        self.editMerchant = function () {
            self.viewMode(false);
            self.reviewMode(false);
            self.stageOne(true);
            Params.dashboard.loadComponent("create-merchant", { editMode: true }, self);
        };
        self.deleteMerchant = function () {
            merchantModel.deleteMerchant(self.merchantCode).done(function (data, status, jqXhr) {
                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: Params.baseModel.format(self.resource.merchant.deleteaccountsuccess, { name: self.merchantCode }),
                    template: "merchant/confirm-screen-templates/delete-merchant"
                }, self);
            }).fail(function () {
                $("#deleteMerchant").hide();
            });
        };
        self.back = function () {
            history.back();
        };
        self.goToDashoard = function () {
            Params.dashboard.switchModule();
        };
        self.showQRCode = function () {
            $("#qrCode").trigger("openModal");
        };
        self.hidePopup = function() {
            $("#deleteMerchant").hide();
        };
        self.openPopup = function(){
            $("#deleteMerchant").trigger("openModal");
        };
    };
});
