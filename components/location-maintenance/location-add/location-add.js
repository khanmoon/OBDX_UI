define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/location-add",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset",
    "ojs/ojradioset",
    "ojs/ojbutton",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "@@GOOGLE_MAP_SDK"
], function (oj, ko, $, LocationAddModel, locale) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.nls = locale;
        self.hours = ko.observableArray();
        self.days = ko.observableArray();
        self.showOptionToUpload = self.showOptionToUpload ? self.showOptionToUpload : ko.observable(false);
        self.selectedType = self.selectedType ? self.selectedType : ko.observable();
        self.inputType = self.inputType ? self.inputType : ko.observable();
        self.showForSingle = self.showForSingle ? self.showForSingle : ko.observable(false);
        self.showForMultipleUpload = self.showForMultipleUpload ? self.showForMultipleUpload : ko.observable(false);
        self.selectedType = self.selectedType ? self.selectedType : ko.observable();
        self.selectedFrom = self.selectedFrom ? self.selectedFrom : ko.observable([]);
        self.hoursSelectedFrom = self.hoursSelectedFrom ? self.hoursSelectedFrom : ko.observable([]);
        self.selectedTo = self.selectedTo ? self.selectedTo : ko.observable([]);
        self.hoursSelectedTo = self.hoursSelectedTo ? self.hoursSelectedTo : ko.observable([]);
        self.startDay = self.startDay ? self.startDay : ko.observable([]);
        self.weekendStartDay = self.weekendStartDay ? self.weekendStartDay : ko.observable([]);
        self.weekendEndDay = self.weekendEndDay ? self.weekendEndDay : ko.observable([]);
        self.endDay = self.endDay ? self.endDay : ko.observable([]);
        self.payload = self.payload ? self.payload : ko.observable();
        self.phoneNum = self.phoneNum ? self.phoneNum : ko.observable();
        self.alternatephoneNum = self.alternatephoneNum ? self.alternatephoneNum : ko.observable();
        self.supportedServicesLoaded = self.supportedServicesLoaded ? self.supportedServicesLoaded : ko.observable(false);
        self.supportedServices = self.supportedServices ? self.supportedServices : ko.observableArray();
        self.selectedServices = self.selectedServices ? self.selectedServices : ko.observableArray();
        self.preparedSelectedServices = ko.observableArray();
        self.additionalDetails1 = self.additionalDetails1 ? self.additionalDetails1 : ko.observable();
        self.constructedPhoneNum = self.constructedPhoneNum ? self.constructedPhoneNum : ko.observableArray();
        self.showAdditionalTimings = ko.observable(false);
        var back;
        if (self.back) {
            back = self.back();
        } else
            back = false;
        var newModel = function () {
            var KoModel = LocationAddModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.addressInstance = self.addressInstance ? self.addressInstance : newModel().address.postalAddress;
        params.dashboard.headerName(self.nls.pageTitle.header);
        self.validationTracker = ko.observable();
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerElement("modal-window");
        params.baseModel.registerComponent("review-location-add", "location-maintenance");
        params.baseModel.registerComponent("atm-branch-file-upload", "location-maintenance");
        params.baseModel.registerComponent("review-atm-branch-upload", "location-maintenance");
        for (var i = 0; i < 24; i++) {
            var obj = { value: "" };
            obj.value = i.toFixed(2).replace(".", ":");
            self.hours.push(obj);
        }
        for (var a = 0; a < 7; a++) {
            self.days.push({ value: oj.LocaleData.getDayNames("abbreviated")[a] });
        }
        self.additionalTimings = function () {
            self.showAdditionalTimings(true);
        };
        self.backOnCreate = function(){
          params.dashboard.loadComponent("location-search", {}, self);
        };
        self.typeChangehandler = function (event) {
            if (event.detail.value) {
                self.showOptionToUpload(false);
                self.supportedServicesLoaded(false);
                ko.tasks.runEarly();
                self.selectedType(event.detail.value);
                self.showOptionToUpload(true);
                if (self.showForSingle() === true) {
                    LocationAddModel.fetchSupportedServices(self.selectedType()).done(function (data) {
                        self.supportedServices(data.serviceDTOs);
                        self.supportedServicesLoaded(true);
                    });
                }
            }
        };
        self.changehandler = function (event) {
            if (event.detail.value === "Single") {
                self.showForSingle(true);
                self.showForMultipleUpload(false);
            } else {
                self.showForMultipleUpload(true);
                self.showForSingle(false);
            }

            if (event.detail.value === "Single") {
                self.supportedServicesLoaded(false);
                LocationAddModel.fetchSupportedServices(self.selectedType()).done(function (data) {
                    self.supportedServices(data.serviceDTOs);
                    self.supportedServicesLoaded(true);
                });
                if (!back) {
                    if (self.selectedType() === "ATM") {
                        self.payload(newModel().locationAddAtmPayload);
                    } else {
                        self.payload(newModel().locationAddBranchPayload);
                    }
                }
            }
        };
        function preparePhoneNum(phoneNums) {
            for (var i = 0; i < phoneNums.length; i++) {
                var phoneObj = {
                    "areaCode": "",
                    "extension": "",
                    "number": ""
                };
                phoneObj.number = phoneNums[i];
                self.constructedPhoneNum.push(phoneObj);
            }
        }
        self.searchLocation = function () {
            document.getElementById("pac-input").value = "";
            $("#searchLocation").trigger("openModal");
            var input = document.getElementById("pac-input");
            var autocomplete = new google.maps.places.Autocomplete(input);
            var infowindow = new google.maps.InfoWindow();
            var infowindowContent = document.getElementById("infowindow-content");
            infowindow.setContent(infowindowContent);
            autocomplete.addListener("place_changed", function () {
                infowindow.close();
                var place = autocomplete.getPlace();
                self.payload().geoCoordinate.latitude(place.geometry.location.lat().toFixed(7));
                self.payload().geoCoordinate.longitude(place.geometry.location.lng().toFixed(7));
                $("#searchLocation").hide();
                if (!place.geometry) {
                    return false;
                }
            });
        };
        self.add = function () {
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (typeof self.addressInstance.country === "function")
                self.addressInstance.country = self.addressInstance.country();
            else
                self.addressInstance.country = self.addressInstance.country[0];
            self.payload().postalAddress(self.addressInstance);
            ko.utils.arrayForEach(self.selectedServices(), function (item) {
                ko.utils.arrayForEach(self.supportedServices(), function (serviceItem) {
                    if (item === serviceItem.name) {
                        self.preparedSelectedServices.push(serviceItem);
                    }
                });
            });
            self.payload().supportedServices(self.preparedSelectedServices());
            if (self.selectedType() !== "ATM") {
                self.payload().additionalDetails()[0] = self.additionalDetails1();
                self.payload().additionalDetails()[1] = null;
                self.payload().workTimings()[0] = self.selectedFrom() + "-" + self.selectedTo();
                if (self.hoursSelectedFrom() || self.hoursSelectedTo()) {
                    self.payload().workTimings()[1] = self.hoursSelectedFrom() + "-" + self.hoursSelectedTo();
                } else {
                    self.payload().workTimings()[1] = null;
                }
                self.payload().workDays()[0] = self.startDay() + "-" + self.endDay();
                if (self.weekendStartDay() || self.weekendEndDay()) {
                    if (self.weekendStartDay() === self.weekendEndDay() || (self.weekendStartDay() !== null && self.weekendEndDay() === undefined)) {
                        self.payload().workDays()[1] = self.weekendStartDay();
                    } else {
                        self.payload().workDays()[1] = self.weekendStartDay() + "-" + self.weekendEndDay();
                    }
                } else {
                    self.payload().workDays()[1] = null;
                }
                preparePhoneNum([
                    self.phoneNum(),
                    self.alternatephoneNum()
                ]);
                self.payload().branchPhone(self.constructedPhoneNum());
            }
            params.dashboard.loadComponent("review-location-add", { createData: self.payload() }, self);
        };
        self.confirm = function () {
            if (self.selectedType() !== "ATM") {
                LocationAddModel.addBranchLocation(ko.mapping.toJSON(self.payload())).done(function (data, status, jqXhr) {
                    params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.headings.transactionName
                    }, self);
                });
            } else {
                LocationAddModel.addAtmLocation(ko.mapping.toJSON(self.payload())).done(function (data, status, jqXhr) {
                    params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.headings.transactionName
                    }, self);
                });
            }
        };
    };
});
