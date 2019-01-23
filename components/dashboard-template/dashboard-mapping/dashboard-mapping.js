define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/dashboard-mapping",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojinputnumber", "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation"
], function (oj, ko, $, model, locale) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;
        self.validationTracker = ko.observable();
        self.partyId = ko.observable(true);
        self.showPartySearch = ko.observable(true);
        self.selectedPartyView=ko.observable(false);
        params.dashboard.headerName(self.resourceBundle.heading.create);
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("review-dashboard-mapping", "dashboard-template");
        params.baseModel.registerComponent("party-validate", "common");
        self.segmentRoles = ko.observableArray();
        self.refreshRoles=ko.observable(true);
        self.selectedPartyName=ko.observable();
        self.partyDetails = {
            partyId: ko.observable(null),
            partyName: ko.observable(null),
            partyDetailsFetched: ko.observable(false),
            partyFirstName: ko.observable(null),
            partyLastName: ko.observable(null),
            party: {
                value: ko.observable(null),
                displayValue: ko.observable(null)
            }
        };
        self.partyDetails.party.displayValue.extend({
            notify: "always"
        });
        self.additionalDetails = ko.observable();
        var userType = {
            "RETAIL": "retailuser",
            "CORPORATE": "corporateuser"
        };
        var selectedSegment,selectedModule;
        var getTargetLinkageModel = function (dashboardId, mappedValue, mappedType, module) {
            var KoModel = model.getTargetLinkageModel(dashboardId, mappedValue, mappedType, module);
            return ko.mapping.fromJS(KoModel);
        };
        /**
         * The model function called to fetch the roles
         * @function getRoles
         * @returns {void}
         */
        function getRoles() {
            self.segmentRoles.removeAll();
            model.getSegmentRoles(selectedSegment).then(function (data) {
                data.applicationRoleDTOs.forEach(function(role){
                    if(role.applicationRoleName.toLowerCase()===selectedModule.toLowerCase()){
                        self.segmentRoles.push(role);
                    }
                });
                if(!self.segmentRoles().length){
                    self.segmentRoles(data.applicationRoleDTOs);
                }
            });
        }
        if (params.rootModel.previousState && params.rootModel.previousState.data) {
            selectedSegment = (userType[params.rootModel.previousState.data.dashboardId.substring(params.rootModel.previousState.data.dashboardId.indexOf("=") + 1)]);
            getRoles();
            self.mappingData = ko.observable(getTargetLinkageModel(params.rootModel.previousState.data.dashboardId, params.rootModel.previousState.data.mappedValue, params.rootModel.previousState.data.mappedType));
            self.showPartySearch(false);
        } else {
            self.mappingData = ko.observable(getTargetLinkageModel());
			getRoles();
        }
        self.saveMapping = function () {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }
            if (self.mappingData().mappedType() === "USER") {
                model.checkUserExists(self.mappingData().mappedValue()).then(function () {
                    var temp = JSON.parse(ko.mapping.toJSON(self.mappingData()));
                    temp.isDefault = "N";
                    params.dashboard.loadComponent("review-dashboard-mapping", {
                        data: temp
                    });
                }, function () {
                    self.mappingData().mappedValue(null);
                    params.baseModel.showMessages({}, [self.resourceBundle.userWarning], "WARNING");
                    setTimeout(function () {
                        params.baseModel.showComponentValidationErrors(document.getElementById("tracker"));
                    }, 200);
                });
            } else if (self.mappingData().mappedValue() !== null) {
                var temp = JSON.parse(ko.mapping.toJSON(self.mappingData()));
                if (self.mappingData().mappedType() === "ROLE") {
                    temp.enterpriseRole = selectedSegment;
                }
                temp.isDefault = "N";
                params.dashboard.loadComponent("review-dashboard-mapping", {
                    data: temp
                });
            } else if (self.mappingData().mappedValue() === null) {
                params.baseModel.showMessages({}, [self.resourceBundle.mappingValueWarning], "WARNING");
            }
        };
        self.entities = ko.observableArray();
        require(["json!entities"], function (data) {
            self.entities(data.dashboardData);
        });
        self.arrayDataSource = ko.observableArray(self.params.data.dashboards);
        self.datasource = new oj.ArrayTableDataSource(self.arrayDataSource, {
            idAttribute: "dashboardId"
        });
        /**
         * The model function called to fetch the dashboard list
         * @function getDashboardList
         * @returns {void}
         */
        function getDashboardList() {
            model.getDashboardList().done(function (data) {
                self.arrayDataSource(data.dashboardDTOs);
                if (!data.dashboardDTOs.length) {
                    $("#noTemplate").trigger("openModal");
                }
            });
        }
        if (!self.arrayDataSource().length) {
            getDashboardList();
        }
        var partyIdSubscribe = self.partyDetails.party.displayValue.subscribe(function (newValue) {
            if (newValue.length) {
                self.selectedPartyView(false);
                self.partyId(true);
                self.mappingData().mappedValue(newValue);
                self.showPartySearch(false);
                ko.tasks.runEarly();
                self.selectedPartyName(self.additionalDetails().party.personalDetails.fullName);
                self.selectedPartyView(true);
            } else {
                self.mappingData().mappedValue(null);
                self.selectedPartyView(false);
            }
        });
        self.showParty = function () {
            self.partyDetails.partyDetailsFetched(false);
            self.partyDetails.partyName(null);
            self.showPartySearch(true);
            self.mappingData().mappedValue(null);
            self.partyId(false);
            self.selectedPartyView(false);
        };

        var dashboardIdSubscribe = self.mappingData().dashboardId.subscribe(function (newValue) {
            selectedModule=newValue.substring(newValue.indexOf(".")+1,newValue.indexOf("="));
            selectedSegment = (userType[newValue.substring(newValue.indexOf("=") + 1)]);
            if(self.mappingData().mappedType()==="ROLE"){
                self.refreshRoles(false);
                getRoles();
                self.refreshRoles(true);
            }
        });
        var mappedTypeSubscribe = self.mappingData().mappedType.subscribe(function (newValue) {
            self.mappingData().mappedValue(null);
            if (newValue === "ROLE" && selectedSegment) {
                self.segmentRoles.removeAll();
                getRoles();
            } else if (newValue === "PARTY") {
                self.partyId(false);
            }
        });
        self.createDashboard = function () {
            params.dashboard.loadComponent("select-persona", {
                mode: "create"
            });
        };
        self.dispose = function () {
            partyIdSubscribe.dispose();
            dashboardIdSubscribe.dispose();
            mappedTypeSubscribe.dispose();
        };
    };
});