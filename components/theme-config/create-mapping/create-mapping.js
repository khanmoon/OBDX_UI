define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/create-mapping",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojinputnumber",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, model, locale) {
    "use strict";
    return function (params) {
        var self = this;
        self.resourceBundle = locale;
        self.validationTracker = ko.observable();
        self.validationTrackerID = "validationTrackerID" + params.baseModel.incrementIdCount();
        self.mappedValues = ko.observableArray();
        self.entities = ko.observableArray();
        self.parameters = params.rootModel.params;
        params.dashboard.headerName(self.resourceBundle.heading.create);
        params.baseModel.registerComponent("party-name-search", "common");
        self.showPartySearch = ko.observable(true);
        self.partyId = ko.observable();
        var getTargetLinkageModel = function (brandId, mappedValue, mappedType) {
            var KoModel = model.getTargetLinkageModel(brandId, mappedValue, mappedType);
            return ko.mapping.fromJS(KoModel);
        };
        self.mappingData = ko.observable(getTargetLinkageModel(null, null, self.parameters.selectedOption));
        self.saveMapping = function () {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById(self.validationTrackerID))) {
                return;
            }
            if (self.mappingData().mappedType() === "USER") {
                model.checkUserExists(self.mappingData().mappedValue()).then(function () {
                    model.createMapping(ko.mapping.toJSON(self.mappingData())).done(function (data, status, jqXhr) {
                        params.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXhr,
                            transactionName: self.resourceBundle.mappingTransaction
                        }, self);
                    });
                }, function () {
                    self.mappingData().mappedValue(null);
                    params.baseModel.showMessages({}, [self.resourceBundle.userWarning], "WARNING");
                    setTimeout(function () {
                        params.baseModel.showComponentValidationErrors(document.getElementById(self.validationTrackerID));
                    }, 200);
                });
            } else {
                model.createMapping(ko.mapping.toJSON(self.mappingData())).done(function (data, status, jqXhr) {
                    params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.resourceBundle.mappingTransaction
                    }, self);
                });
            }
        };
        model.fetchEntities().done(function (data) {
            self.entities(data.data);
        });
        var mappedTypeSubscription = self.mappingData().mappedType.subscribe(function (newValue) {
            self.mappedValues.removeAll();
            ko.tasks.runEarly();
            self.mappingData().mappedValue(null);
            if (newValue === "ROLE") {
                model.getEnterpriseRoles().done(function (data) {
                    data.enterpriseRoleDTOs.forEach(function (key) {
                        self.mappedValues.push({
                            value: key.enterpriseRoleId,
                            text: key.enterpriseRoleName
                        });
                    });
                });
            } else if (newValue === "BANK") {
                if (params.dashboard.userData.userProfile.accessibleEntityDTOs && params.dashboard.userData.userProfile.accessibleEntityDTOs.length) {
                    params.dashboard.userData.userProfile.accessibleEntityDTOs.forEach(function (key) {
                        self.mappedValues.push({
                            text: key.entityName,
                            value: key.entityId
                        });
                    });
                }
            }
        });
        self.mappingData().mappedType.valueHasMutated();
        self.updateMapping = function (data) {
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            model.updateDocument(ko.mapping.toJS(self.mappingData()), data.brandId).done(function (data, status, jqXhr) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resourceBundle.updateTransaction
                }, self);
            });
        };

        self.partyId.subscribe(function (newValue) {
            self.mappingData().mappedValue(newValue);
            self.showPartySearch(false);
        });
        self.showParty = function () {
            self.showPartySearch(true);
        };

        self.dispose = function () {
            mappedTypeSubscription.dispose();
        };
    };
});