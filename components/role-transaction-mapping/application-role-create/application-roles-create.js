define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",
    "ojL10n!resources/nls/authorization",
    "ojs/ojswitch",
    "ojs/ojselectcombobox",
    "ojs/ojtrain",
    "ojs/ojinputtext", "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation"
], function(oj, ko, $, BaseLogger, ApplicationRolesCreateModel, resourceBundle) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        /**
         * setObservable - Define an observable if variable is undefined.
         *
         * @param  {type} value variable to be set
         * @param  {String|Boolean|Number} rootParams defult value of variable
         * @return {Function}       observable returned
         */
        function setObservable(value, rootParams) {
            if (!value) {
                return ko.observable(rootParams);
            }
            return value;
        }
        self.selectedUser = setObservable(self.selectedUser);
        self.selectedAccessType = setObservable(self.selectedAccessType);
        self.selectedScopeType = setObservable(self.selectedScopeType);
        self.accessPointType = ko.observableArray();
        self.isAccessTypeFetched = ko.observable(false);
        self.isScopeFetched = ko.observable(false);
        self.selectedAccessPoint = setObservable(self.selectedAccessPoint);
        self.selectedModuleName = setObservable(self.selectedModuleName);
        self.accessPoint = ko.observableArray();
        self.roleAccessPointMap = ko.observableArray();
        self.isNext = ko.observable(false);
        self.disabled = ko.observable(false);
        self.dataSourceLoaded = ko.observable(false);
        self.accessPointTabs = ko.observableArray();
        self.dataSourceToBePassed = ko.observable();
        self.scopes = ko.observableArray();
        self.isAccessPointFetched = ko.observable(false);
        self.isUserFetched = ko.observable(false);
        self.isMapTransaction = ko.observable(false);
        self.appRoleName = setObservable(self.appRoleName);
        self.appDescription = setObservable(self.appDescription);
        self.validationTracker = ko.observable();
        self.userSegment = ko.observableArray();
        self.selectedStepValue = ko.observable("appRoleCreate");
        self.selectedStepLabel = ko.observable(self.nls.common.appRoleCreation);
        rootParams.baseModel.registerComponent("application-role-search", "role-transaction-mapping");
        rootParams.baseModel.registerComponent("map-transaction", "role-transaction-mapping");
        if (self.verifyAndEdit() === true) {
            self.stepArray =
                ko.observableArray(
                    [{
                            label: self.nls.common.appRoleCreation,
                            id: "appRoleCreate",
                            visited: true
                        },
                        {
                            label: self.nls.common.mapTransaction,
                            id: "mapTransaction",
                            visited: true
                        }
                    ]);
        } else {
            self.stepArray = ko.observableArray([{
                label: self.nls.common.appRoleCreation,
                id: "appRoleCreate",
                visited: false
            }, {
                label: self.nls.common.mapTransaction,
                id: "mapTransaction",
                visited: false,
                disabled: true
            }]);
        }
        self.trainHandler = function(event) {

            if (event.detail.fromStep.id === "appRoleCreate") {
                self.stepArray()[0].visited = true;
                self.stepArray()[0].disabled = false;
                self.mapTrans();
            } else if (event.detail.fromStep.id === "mapTransaction") {
                self.stepArray()[1].visited = true;
                self.stepArray()[1].disabled = false;

            }
        };

        rootParams.dashboard.headerName(self.nls.common.roleTransactionMapping);
        ApplicationRolesCreateModel.fetchUserGroupOptions().done(function(data) {
            if (data.enterpriseRoleDTOs) {
                for (var i = 0; i < data.enterpriseRoleDTOs.length; i++) {
                    self.userSegment().push({
                        text: data.enterpriseRoleDTOs[i].enterpriseRoleName,
                        value: data.enterpriseRoleDTOs[i].enterpriseRoleId
                    });
                }
                self.isUserFetched(true);
            }
        });
        ApplicationRolesCreateModel.fetchAccessPointType().done(function(data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.accessPointType().push({
                    text: data.enumRepresentations[0].data[i].description,
                    value: data.enumRepresentations[0].data[i].code
                });
                self.isAccessTypeFetched(true);
            }
        });
        ApplicationRolesCreateModel.fetchScopes().done(function(data) {
            for (var j = 0; j < data.accessPointScopeListDTO.length; j++)
                self.scopes().push({
                    text: data.accessPointScopeListDTO[j].description,
                    value: data.accessPointScopeListDTO[j].id
                });
            self.isScopeFetched(true);
        });
        self.back = function() {
            self.selectedUser("");
            self.selectedAccessType("");
            self.selectedScopeType("");
            self.appRoleName("");
            self.appDescription("");
            self.selectedAccessPoint([]);
            self.selectedModuleName([]);
            self.selectedStepValue = ko.observable("appRoleCreate");
            self.selectedStepLabel = ko.observable(self.nls.common.appRoleCreation);
            rootParams.dashboard.loadComponent("application-role-base", {}, self);
        };
        self.mapTrans = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }
            self.selectedStepValue("mapTransaction");
            self.selectedStepLabel(self.nls.common.mapTransaction);
            rootParams.dashboard.loadComponent("map-transaction", {}, self);
            var searchParameters = {
                "accessType": self.selectedAccessType()
            };
            ApplicationRolesCreateModel.fetchAccess(searchParameters).done(function(data) {
                self.accessPoint([]);
                for (var i = 0; i < data.accessPointListDTO.length; i++) {
                    self.accessPoint().push({
                        text: data.accessPointListDTO[i].description,
                        value: data.accessPointListDTO[i].id
                    });
                    self.isAccessPointFetched(true);
                }
            });
        };
    };
});
