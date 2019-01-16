define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/location-update",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "@@GOOGLE_MAP_SDK"
], function (oj, ko, $, LocationUpdateModel, locale) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.nls = locale;
        var input = document.getElementById("pac-input");
        var autocomplete = new google.maps.places.Autocomplete(input);
        var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById("infowindow-content");
        infowindow.setContent(infowindowContent);
        autocomplete.addListener("place_changed", function () {
            infowindow.close();
            var place = autocomplete.getPlace();
            self.latitude(place.geometry.location.lat().toFixed(7));
            self.longitude(place.geometry.location.lng().toFixed(7));
            $("#searchLocation").hide();
            if (!place.geometry) {
                return false;
            }
        });
        params.dashboard.headerName(self.nls.headings.transactionName);
        params.baseModel.registerElement("action-header");
        params.baseModel.registerElement("row");
        params.baseModel.registerComponent("location-search", "location-maintenance");
        params.baseModel.registerComponent("review-location-update", "location-maintenance");
        self.hours = ko.observableArray();
        self.days = ko.observableArray();
        self.validationTracker = ko.observable();
        self.showAddInfo = params.rootModel.showAddInfo ? params.rootModel.showAddInfo : ko.observable([self.showAddInfo()]);
        self.selectedFrom = params.rootModel.hrsFrom ? params.rootModel.hrsFrom : ko.observable([self.hrsFrom()]);
        self.selectedTo = params.rootModel.hrsTo ? params.rootModel.hrsTo : ko.observable([self.hrsTo()]);
        self.startDay = params.rootModel.startDay ? params.rootModel.startDay : ko.observable([self.startDay()]);
        self.endDay = params.rootModel.endDay ? params.rootModel.endDay : ko.observable([self.endDay()]);
        self.hoursSelectedFrom = self.hoursSelectedFrom ? params.rootModel.hoursSelectedFrom : ko.observable([self.hoursSelectedFrom()]);
        self.hoursSelectedTo = self.hoursSelectedTo ? params.rootModel.hoursSelectedTo : ko.observable([self.hoursSelectedTo()]);
        self.weekendStartDay = self.weekendStartDay ? params.rootModel.weekendStartDay : ko.observable([self.weekendStartDay()]);
        self.weekendEndDay = self.weekendEndDay ? params.rootModel.weekendEndDay : ko.observable([self.weekendEndDay()]);
        self.payload = params.rootModel.payload ? params.rootModel.payload : ko.observable();
        self.alternatephoneNo = params.rootModel.alternatephoneNo ? params.rootModel.alternatephoneNo : ko.observable();
        self.preparedSelectedServices = ko.observableArray();
        self.constructedPhoneNum = ko.observableArray();
        self.addline3 = params.rootModel.addline3 ? params.rootModel.addline3 : ko.observable(self.postalAddress().line3);
        self.addline4 = params.rootModel.addline4 ? params.rootModel.addline4 : ko.observable(self.postalAddress().line4);
        function preparePhoneNum(phoneNum) {
            var a = phoneNum.split(", ");
            self.constructedPhoneNum([]);
            for (var i = 0; i < a.length; i++) {
                var phoneObj = {
                    "areaCode": "",
                    "extension": "",
                    "number": ""
                };
                phoneObj.number = a[i];
                self.constructedPhoneNum.push(phoneObj);
            }
            self.phoneNo(self.constructedPhoneNum()[0].number);
            if (a.length > 1)
                self.alternatephoneNo(self.constructedPhoneNum()[1].number);
        }
        var back;
        if (self.back) {
            back = self.back();
        } else
            back = false;
        for (var i = 0; i < 24; i++) {
            var obj = { value: "" };
            obj.value = i.toFixed(2);
            self.hours.push(obj);
        }
        for (var a = 0; a < 7; a++) {
            self.days.push({ value: oj.LocaleData.getDayNames("abbreviated")[a] });
        }
        var newModel = function () {
            var KoModel = LocationUpdateModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.showAdditionalTimings = ko.observable(false);
        self.additionalTimings = function () {
            self.showAdditionalTimings(true);
        };
        self.searchLocation = function () {
            document.getElementById("pac-input").value = "";
            $("#searchLocation").trigger("openModal");
        };
        self.backOnUpdate = function() {
          params.dashboard.loadComponent("location-read", {}, self);
        };
        if (!back) {
            if (self.type() === "ATM") {
                self.payload(newModel().atmPayload);
            } else {
                preparePhoneNum(self.phoneNo());
                self.payload(newModel().branchPayload);
            }
        }
        self.save = function () {
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.payload().id = self.id();
            if (typeof self.postalAddress().country === "object") {
                self.postalAddress().country = self.postalAddress().country[0];
            }
            self.postalAddress().line3 = self.addline3();
            self.postalAddress().line4 = self.addline4();
            self.payload().postalAddress(self.postalAddress());
            ko.utils.arrayForEach(self.selectedServices(), function (item) {
                ko.utils.arrayForEach(self.supportedServices(), function (serviceItem) {
                    if (item === serviceItem.name) {
                        self.preparedSelectedServices.push(serviceItem);
                    }
                });
            });
            self.payload().geoCoordinate.latitude = self.latitude();
            self.payload().geoCoordinate.longitude = self.longitude();
            self.payload().name = self.atmBranchName();
            self.payload().supportedServices(self.preparedSelectedServices());
            self.payload().version = self.version();
            if (self.type() !== "ATM") {
                self.payload().additionalDetails()[0] = self.showAddInfo();
                self.payload().additionalDetails()[1] = null;
                if (self.alternatephoneNo() === undefined)
                    self.alternatephoneNo("");
                preparePhoneNum(self.phoneNo() + ", " + self.alternatephoneNo());
                self.payload().workTimings()[0] = self.selectedFrom()[0] + "-" + self.selectedTo()[0];
                self.payload().workDays()[0] = self.startDay()[0] + "-" + self.endDay()[0];
                if (self.hoursSelectedFrom()) {
                    if (self.hoursSelectedFrom()[0] || self.hoursSelectedTo()[0]) {
                        self.payload().workTimings()[1] = self.hoursSelectedFrom()[0] + "-" + self.hoursSelectedTo()[0];
                    } else {
                        self.payload().workTimings()[1] = null;
                    }
                } else {
                    self.payload().workTimings()[1] = null;
                }
                if (self.weekendStartDay()) {
                    if (self.weekendStartDay()[0] || self.weekendEndDay()[0]) {
                        if (self.weekendStartDay()[0] === self.weekendEndDay()[0] || (self.weekendStartDay()[0] !== null && self.weekendEndDay()[0] === undefined)) {
                            self.payload().workDays()[1] = self.weekendStartDay()[0];
                        } else {
                            self.payload().workDays()[1] = self.weekendStartDay()[0] + "-" + self.weekendEndDay()[0];
                        }
                    } else {
                        self.payload().workDays()[1] = null;
                    }
                } else {
                    self.payload().workDays()[1] = null;
                }
                self.payload().branchPhone(self.constructedPhoneNum());
            }
            params.dashboard.loadComponent("review-location-update", { updateData: self.payload() }, self);
        };
        self.confirm = function () {
            if (self.type() !== "ATM") {
                LocationUpdateModel.updateBranchDetails(self.id(), ko.mapping.toJSON(self.payload())).done(function (data, status, jqXhr) {
                    params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.headings.transactionName
                    }, self);
                });
            } else {
                LocationUpdateModel.updateAtmDetails(self.id(), ko.mapping.toJSON(self.payload())).done(function (data, status, jqXhr) {
                    params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.headings.transactionName
                    }, self);
                });
            }
        };
    };
});
