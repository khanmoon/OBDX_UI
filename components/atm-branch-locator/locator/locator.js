define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/locator",
    "ojs/ojlistview",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojcheckboxset",
    "ojs/ojarraytabledatasource",
    "ojs/ojselectcombobox",
    "ojs/ojmenu",
    "baseLogger"
], function (oj, ko, $, ATMBranchLocatorModel, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerComponent("map", "inputs");
        self.userCurrentLocation = ko.observable();
        self.servicesOffered = ko.observableArray([]);
        self.servicesOfferedLoaded = ko.observable(false);
        rootParams.dashboard.headerName(self.nls.headings.locator);
        self.branchCode = ko.observable();
        self.nearbycount = ko.observable();
        self.isLocationFetched = ko.observable();
        self.searchTypeSelected = ko.observable();
        self.selectedServices = ko.observableArray([]);
        self.selectedServiceId = ko.observableArray([]);
        self.supportedServicesShown = ko.observableArray();
        self.radius = ko.observable(0);
        self.addressDTO = ko.observableArray();
        self.addressDTOs = ko.observable();
        self.isDistanceDataFetched = ko.observable(false);
        self.polesData = ko.observable();
        self.responseDTO = ko.observable();
        self.searchTypeSelected("ATM");
        self.phoneNumber = ko.observableArray();
        self.currentLocation = ko.observable();
        self.searchDone = ko.observable(false);
        self.noRecord = ko.observable();
        self.workDays = ko.observableArray();
        self.hideList = ko.observable(false);
        self.workTimings = ko.observableArray();
        self.additionalDetails = ko.observable();
        self.alternatePhoneNumber = ko.observable();
        self.primaryphoneNumber = ko.observable();
        self.mainTiming = ko.observableArray();
    self.additionalTiming = ko.observableArray();
        self.launch = function (model, event) {
            $("#myMenu").ojMenu("open", event);
        };
        self.menuClose = function () {
            $("#myLauncher").removeClass("bold");
        };
        self.viewDetails = function (data) {
            self.supportedServicesShown([]);
            ko.utils.arrayForEach(data.supportedServices, function (item) {
                self.supportedServicesShown.push(item.name);
            });
            self.branchCode(data.id);
            $("#block_" + data.id).show();
            $("#blockdetails_" + data.id).show();
            $("#blocktoshow_" + data.id).hide();
            ATMBranchLocatorModel.getDetails(self.branchCode(), self.searchTypeSelected().toUpperCase()).done(function (data) {
                if (self.searchTypeSelected() === "ATM") {
                    self.supportedServicesShown([]);
                    ko.utils.arrayForEach(data.atmLocatorDTO.supportedServices, function (item) {
                        self.supportedServicesShown.push(item.name);
                    });
                } else if (self.searchTypeSelected().toUpperCase() === "BRANCH") {
                    self.phoneNumber([]);
                    self.alternatePhoneNumber();
                    self.primaryphoneNumber();
                    self.supportedServicesShown([]);
                    self.workDays([]);
                    self.workTimings([]);
                    self.additionalDetails(data.branchDTO.additionalDetails[0]);
                    self.primaryphoneNumber(data.branchDTO.branchPhone[0].number);
                    if (data.branchDTO.branchPhone[1].number)
                        self.alternatePhoneNumber(data.branchDTO.branchPhone[1].number);
                    ko.utils.arrayForEach(data.branchDTO.branchPhone, function (item) {
                        if (item.number)
                            self.phoneNumber.push(item.number);
                    });
                    ko.utils.arrayForEach(data.branchDTO.supportedServices, function (item) {
                        self.supportedServicesShown.push(item.name);
                    });
                    ko.utils.arrayForEach(data.branchDTO.workDays, function (item) {
                        self.workDays.push(item);
                    });
                    self.workDays(data.branchDTO.workDays);
                    self.workTimings(data.branchDTO.workTimings);
                    var timeArray;
                    if (self.workTimings()[0].indexOf("-") !== -1) {
                      timeArray = self.workTimings()[0].split("-");
            self.mainTiming()[0] = timeArray[0];
            self.mainTiming()[1] = timeArray[1];
                    }
                      if(self.workTimings()[1] !== null){
                    if (self.workTimings()[1].indexOf("-") !== -1) {
                      timeArray = self.workTimings()[1].split("-");
            self.additionalTiming()[0] = timeArray[0];
            self.additionalTiming()[1] = timeArray[1];
                    }
                  }
                }
            });
        };
        self.menuItemSelect = function (event) {
          self.searchTypeSelected(event.target.id);
        };
        self.hideLoadedDetails = function (data) {
            $("#block_" + data.id).hide();
            $("#blockdetails_" + data.id).hide();
            $("#blocktoshow_" + data.id).show();
        };
        self.closeWindow = function () {
            self.searchDone(false);
        };
        self.refineSearch = function (event) {
            if (event.detail.value) {
                self.selectedServiceId([]);
                for (var i = 0; i < self.servicesOffered().length; i++) {
                    for (var j = 0; j < self.selectedServices().length; j++) {
                        if (self.selectedServices()[j] === self.servicesOffered()[i].name)
                            self.selectedServiceId().push(self.servicesOffered()[i].id);
                    }
                }
                self.isLocationFetched(false);
                ATMBranchLocatorModel.refineServiceSearch(self.searchTypeSelected().toUpperCase(), self.selectedServiceId(), self.userCurrentLocation().lat(), self.userCurrentLocation().lng(), self.radius()).done(function (data) {
                    self.responseDTO(data.addressDTO);
                    self.nearbycount(data.addressDTO.length);
                    self.isLocationFetched(true);
                    self.isDistanceDataFetched(false);
                    self.addressDTO([]);
                }).fail();
            }
        };
        self.hidelists = function () {
            self.hideList(true);
            if (!rootParams.baseModel.large())
                self.isDistanceDataFetched(false);
        };
        self.showlists = function () {
            self.hideList(false);
            self.isDistanceDataFetched(true);
        };
        self.searchLocation = function () {
            self.noRecord(false);
            self.isLocationFetched(false);
            self.addressDTO([]);
            self.searchDone(true);
            self.hideList(false);
            if (self.userCurrentLocation()) {
                if (self.selectedServiceId().length === 0) {
                    ATMBranchLocatorModel.getLocations(self.userCurrentLocation().lat(), self.userCurrentLocation().lng(), self.searchTypeSelected().toUpperCase(), self.radius()).done(function (data) {
                        if (data.addressDTO.length > 0) {
                            self.responseDTO(data.addressDTO);
                            self.branchCode(data.addressDTO[0].id);
                            self.radius(data.addressDTO[0].radius);
                            self.nearbycount(data.addressDTO.length);
                            self.isLocationFetched(true);
                        } else {
                            self.noRecord(true);
                            self.nearbycount(data.addressDTO.length);
                        }
                    });
                } else {
                    ATMBranchLocatorModel.refineServiceSearch(self.searchTypeSelected().toUpperCase(), self.selectedServiceId(), self.userCurrentLocation().lat(), self.userCurrentLocation().lng(), self.radius()).done(function (data) {
                        self.responseDTO(data.addressDTO);
                        self.nearbycount(data.addressDTO.length);
                        self.isLocationFetched(true);
                        self.isDistanceDataFetched(false);
                        self.addressDTO([]);
                    }).fail();
                }
            }
        };
        self.searchNearestLocation = function () {
            document.getElementById("pac-input").value = "";
            self.isLocationFetched(false);
            self.addressDTO([]);
            self.searchDone(true);
            self.nearbycount(0);
            if (self.userCurrentLocation()) {
                self.userCurrentLocation(self.currentLocation());
                ATMBranchLocatorModel.getLocations(self.currentLocation().lat(), self.currentLocation().lng(), self.searchTypeSelected().toUpperCase(), self.radius()).done(function (data) {
                    if (data.addressDTO.length > 0) {
                        self.responseDTO(data.addressDTO);
                        self.branchCode(data.addressDTO[0].id);
                        self.radius(data.addressDTO[0].radius);
                        self.nearbycount(data.addressDTO.length);
                        self.isLocationFetched(true);
                        self.noRecord(false);
                    } else {
                        self.nearbycount(data.addressDTO.length);
                        self.noRecord(true);
                    }
                });
            }
        };
        self.radius.subscribe(function () {
            if (self.radius() !== 0)
                self.searchLocation();
        });
        self.getDirection = function (selectedRowData) {
            var location = selectedRowData.geoCoordinate.latitude + "," + selectedRowData.geoCoordinate.longitude;
            var address = selectedRowData.name.trim() + ", " + selectedRowData.postalAddress.line1.trim() + ", " + selectedRowData.postalAddress.line2.trim() + ", " + (selectedRowData.postalAddress.line3 ? selectedRowData.postalAddress.line3.trim() : "") + ", " + selectedRowData.postalAddress.city.trim() + ", " + selectedRowData.postalAddress.country.trim();
             if (rootParams.baseModel.cordovaDevice() === "IOS") {
                window.uriAvailability.checkBool("comgooglemaps://", function (availability) {
                    if (availability) {
                        window.open("comgooglemaps://?q=" + location + "(" + address + ")", "_system");
                    } else {
                        window.open("maps://?daddr=" + location, "_self");
                    }
                });
            } else if (rootParams.baseModel.small()) {
                window.open("@@GOOGLE_MAP_URL?q=" + location + "(" + address + ")", "_system");
            } else {
                self.hideList(true);
                if (!rootParams.baseModel.large())
                    self.isDistanceDataFetched(false);
                self.polesData([]);
                self.polesData(selectedRowData);
            }
        };
        self.searchTypeSelected.subscribe(function () {
            self.servicesOfferedLoaded(false);
            ATMBranchLocatorModel.showAllServices(self.searchTypeSelected().toUpperCase()).done(function (data) {
                self.servicesOffered(data.serviceDTOs);
                self.servicesOfferedLoaded(true);
            }).fail();
            if (self.searchDone())
                self.searchLocation();
        });
        self.addressDTOs.subscribe(function (addressDTOResponse) {
            self.isDistanceDataFetched(false);
            self.tableDataSource = null;
            self.tableDataSource = new oj.ArrayTableDataSource(addressDTOResponse, { idAttribute: "id" });
            $("#listView").ojListView("refresh");
            self.isDistanceDataFetched(true);
        });
    };
});
