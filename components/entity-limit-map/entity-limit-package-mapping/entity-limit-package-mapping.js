define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",
    "ojL10n!resources/nls/entity-limit-package-mapping",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojswitch",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton"
], function (oj, ko, $, BaseLogger, EntityLimitPackageModel, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle;
        self.packageDataLoaded = ko.observable(false);
        self.packageLoaded = ko.observable(true);
        self.prevEntitySelection = ko.observable();
        self.limitPackageDisabled = ko.observable(true);
        self.entityLimitPackageDetails = Params.entityDetails;
        self.limitPackageArray = ko.observableArray();
        self.getMappedLimitPackages = function (event) {
            if ((event.detail.value && event.detail.trigger === "option_selected") || self.entityLimitPackageDetails.entityPopulated()) {
                self.packageLoaded(false);
                EntityLimitPackageModel.fetchUserLimitOptions(self.entityLimitPackageDetails.entityId()[0]).done(function (data1) {
                    self.limitPackageArray(data1.limitPackageDTOList);
                    self.limitPackageDisabled(false);
                    self.packageLoaded(true);
                    if (self.entityLimitPackageDetails.entityPopulated()) {
                        self.entityList.remove(function (entity) {
                            return entity.code === self.entityLimitPackageDetails.entityId()[0];
                        });
                        if (self.entityList().length === 0)
                            self.addEnable(false);
                        else
                            self.addEnable(true);
                    }
                });
            }
        };
        self.limitPackageChangeHandler = function (event) {
            if (event.detail.value && event.detail.trigger === "option_selected") {
                self.entityLimitInfo = {
                    "entityId": event.detail.value.entityId(),
                    "packageId": event.detail.value.packageId()
                };
                self.entityLimitPackageMapArray()[self.entityLimitPackageMapArray().length - 1] = self.entityLimitInfo;
            }
        };
    };
});
