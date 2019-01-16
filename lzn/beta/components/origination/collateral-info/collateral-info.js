define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/beta/resources/nls/collateral-info",
    "ojs/ojcheckboxset",
    "ojs/ojinputtext",
    "ojs/ojswitch",
    "ojs/ojknockout-validation",
    "ojs/ojdialog",
    "ojs/ojselectcombobox",
    "ojs/ojvalidation"
], function (oj, ko, $, CollateralModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, successHandlers = {}, fetchEnumsPromise;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.applicantObject = rootParams.applicantObject;
        self.vehicleModel = ko.observable();
        self.collateralCategory = ko.observable([]);
        self.collateralCategoryLoaded = ko.observable(false);
        self.displayRegistration = ko.observable(false);
        self.validationTracker = ko.observable();
        self.primaryDataLoaded = ko.observable(false);
        self.vehicleModel = ko.observable();
        self.regNum = ko.observable();
        self.vehicleMakeType = ko.observableArray();
        self.vehicleMake = ko.observable("");
        self.vehicleMakeLoaded = ko.observable(false);
        self.isUsedVehicle = ko.observable(false);
        self.vehicleYear = ko.observable();
        self.vinNum = ko.observable();
        self.collateralCategoryValue = ko.observable("");
        self.ownerEstimatedValue = ko.observable();
        self.ownerEstimatedValue.amount = ko.observable();
        self.collateralDescription = ko.observable();
        self.productDetails().fetchedCoApplicantIds = ko.observableArray([]);
        rootParams.baseModel.registerElement("amount-input");
        self.getNewKoModel = function () {
            var KoModel = CollateralModel.getNewModel();
            KoModel.collateralCategoryType = ko.observable(KoModel.collateralCategory, "");
            KoModel.ownerEstimatedValue.amount = ko.observable(KoModel.ownerEstimatedValue.amount);
            KoModel.ownerEstimatedValue.currency = self.productDetails().currency;
            return KoModel;
        };
        self.ownerEstimatedValue.currency = self.productDetails().currency;
        self.applicantObject().collateralInfo = self.getNewKoModel();
        self.productDetails().application().collateralInfo2 = self.getNewKoModel();
        successHandlers.getCollateralInfoHandler = function (data) {
            if (data.collateralRequirement.goodsVehicle[0]) {
                self.collateralCategoryValue(data.collateralRequirement.goodsVehicle[0].collateralCategoryType);
                self.ownerEstimatedValue.amount(data.collateralRequirement.goodsVehicle[0].ownerEstimatedValue.amount);
                self.vehicleModel(data.collateralRequirement.goodsVehicle[0].vehicleModel);
                self.vehicleMake(data.collateralRequirement.goodsVehicle[0].vehicleMake);
                self.vehicleYear(data.collateralRequirement.goodsVehicle[0].vehicleYear);
            } else if (data.collateralRequirement.passengerVehicle[0]) {
                self.collateralCategoryValue(data.collateralRequirement.passengerVehicle[0].collateralCategoryType);
                self.ownerEstimatedValue.amount(data.collateralRequirement.passengerVehicle[0].ownerEstimatedValue.amount);
                self.vehicleModel(data.collateralRequirement.passengerVehicle[0].vehicleModel);
                self.vehicleMake(data.collateralRequirement.passengerVehicle[0].vehicleMake);
                self.vehicleYear(data.collateralRequirement.passengerVehicle[0].vehicleYear);
            }
        };
        successHandlers.getCollateralSuccessHandler = function (data, deferredObject) {
            self.collateralCategory(data.enumRepresentations[0].data);
            self.collateralCategoryLoaded(true);
            deferredObject.resolve();
        };
        self.getCollateralList = function () {
            var deferred = $.Deferred();
            CollateralModel.fetchCollateralCategory(successHandlers.getCollateralSuccessHandler);
            return deferred.promise();
        };
        self.getCollateralInfo = function () {
            var deferred = $.Deferred();
            CollateralModel.fetchCollateralInfo(self.productDetails().submissionId.value, self.applicantObject().applicantId(), successHandlers.getCollateralInfoHandler, deferred);
            return deferred.promise();
        };
        self.showRegistration = function () {
            self.completeApplicationStageSection(rootParams.index + 1);
        };
        successHandlers.getVehicleMakeSuccessHandler = function (data, deferredObject) {
            self.vehicleMakeType(data.enumRepresentations[0].data);
            self.vehicleMakeLoaded(true);
            deferredObject.resolve();
        };
        self.getVehicleMakeList = function () {
            var deferred = $.Deferred();
            CollateralModel.fetchVehicleMake(self.getNewKoModel.collateralType, successHandlers.getVehicleMakeSuccessHandler, deferred);
            return deferred.promise();
        };
        self.getAutomobileType = function () {
            var deferred = $.Deferred();
            if (self.productDetails().requirements.purpose && self.productDetails().requirements.purpose.code === "MV_USED") {
                self.isUsedVehicle(true);
            }
            return deferred.promise();
        };
        fetchEnumsPromise = $.when(self.getCollateralList(), self.getVehicleMakeList(), self.getAutomobileType(), self.getCollateralInfo());
        fetchEnumsPromise.done();
        self.submitCollateral = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.productDetails().application().collateralInfo2.collateralCategoryType = self.collateralCategoryValue();
            self.productDetails().application().collateralInfo2.vehicleModel = self.vehicleModel();
            if (self.regNum()) {
                self.productDetails().application().collateralInfo2.regNum = self.regNum();
            }
            self.productDetails().application().collateralInfo2.vehicleMake = self.vehicleMake();
            self.productDetails().application().collateralInfo2.vehicleYear = self.vehicleYear();
            if (self.vinNum()) {
                self.productDetails().application().collateralInfo2.vinNum = self.vinNum();
            }
            self.productDetails().application().collateralInfo2.ownerEstimatedValue.amount = self.ownerEstimatedValue.amount();
            if (self.collateralDescription()) {
                self.productDetails().application().collateralInfo2.collateralDescription = self.collateralDescription();
            }
            self.productDetails().application().collateralInfo2.address.country = "AU";
            CollateralModel.synchronizeRequests(true);
            if (self.productDetails().application().collateralInfo2.collateralCategoryType === "GOODS_VEHICLE") {
                var sendData = {
                    facilityId: self.productDetails().facilityId,
                    goodsVehicle: self.productDetails().application().collateralInfo2
                };
                CollateralModel.createCollateral(self.productDetails().submissionId.value, self.applicantObject().applicantId(), sendData, successHandlers.collateralCreatedHandler);
            }
            if (self.productDetails().application().collateralInfo2.collateralCategoryType === "PASSENGER_VEHICLE") {
                var sendData1 = {
                    facilityId: self.productDetails().facilityId,
                    passengerVehicle: self.productDetails().application().collateralInfo2
                };
                CollateralModel.createCollateral(self.productDetails().submissionId.value, self.applicantObject().applicantId(), sendData1, successHandlers.collateralCreatedHandler);
            }
            self.applicantObject().collateralInfo = self.productDetails().application().collateralInfo2;
            self.applicantObject().collateralInfo.collateralCategoryType = self.collateralCategoryValue();
            self.productDetails().productStages[4].stages[0].isComplete(true);
            self.showNextComponent(rootParams.index + 1);
            CollateralModel.synchronizeRequests(false);
        };
    };
});
