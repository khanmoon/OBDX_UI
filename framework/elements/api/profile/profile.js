define([
    "knockout",
    "jquery",
    "./model",
    "framework/js/constants/constants",
    "ojL10n!resources/nls/profile",
    "ojs/ojbutton",
    "ojs/ojmenu",
    "ojs/ojcore"
], function(ko, $, PartyModel, Constants, resourceBundle) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.address = ko.observable();
        self.phoneNumber = ko.observable();
        self.dataFetched1 = ko.observable(false);
        self.partyData = ko.observable();
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement([
            "page-section",
            "row"
        ]);
        self.serializer = function(object) {
            var str = "";
            if (object.line1) {
                var line1 = object.line1;
                if (line1.charAt(line1.length - 1) === ",")
                    str += line1;
                else
                    str += line1 + ", ";
            }
            if (object.line2) {
                var line2 = object.line2;
                if (line2.charAt(line2.length - 1) === ",")
                    str += line2;
                else
                    str += line2 + ", ";
            }
            if (object.line3) {
                var line3 = object.line3;
                if (line3.charAt(line3.length - 1) === ",")
                    str += line3;
                else
                    str += line3 + ", ";
            }
            if (object.line4) {
                var line4 = object.line4;
                if (line4.charAt(line4.length - 1) === ",")
                    str += line4;
                else
                    str += line4 + ", ";
            }
            if (object.city) {
                var city = object.city;
                if (city.charAt(city.length - 1) === ",")
                    str += city;
                else
                    str += city + ", ";
            }
            if (object.state) {
                var state = object.state;
                if (state.charAt(state.length - 1) === ",")
                    str += state;
                else
                    str += state + ", ";
            }
            if (object.country) {
                var country = object.country;
                if (country.charAt(country.length - 1) === ",")
                    str += country;
                else
                    str += country + ", ";
            }
            if (object.postalCode) {
                str = str + object.postalCode + ". ";
            } else if (object.zipCode) {
                str = str + object.zipCode + ". ";
            }
            return str;
        };
        if (Constants.userSegment === "RETAIL") {
            PartyModel.fetchParty().done(function(data) {
                self.partyData(data.party.personalDetails);
                var i;
                for (i = 0; i < data.party.contacts.length; i++) {
                    if (data.party.contacts[i].contactType === "WMO") {
                        self.phoneNumber(data.party.contacts[i].phone.number);
                    }
                }
                for (i = 0; i < data.party.addresses.length; i++) {
                    if (data.party.addresses[i].type === "PST") {
                        self.address(self.serializer(data.party.addresses[i].postalAddress));
                    }
                }
                self.dataFetched1(true);
            });
        } else {
            self.partyData({});
            self.partyData().fullName = rootParams.baseModel.format(self.nls.name, {
                firstName: rootParams.dashboard.userData.userProfile.firstName,
                lastName: rootParams.dashboard.userData.userProfile.lastName
            });
            self.partyData().email = rootParams.dashboard.userData.userProfile.emailId.displayValue;
            self.phoneNumber(rootParams.dashboard.userData.userProfile.phoneNumber.displayValue);
            self.partyData().birthDate = rootParams.dashboard.userData.userProfile.dateOfBirth;
            self.address(self.serializer(rootParams.dashboard.userData.userProfile.address));
            self.dataFetched1(true);
        }
        rootParams.dashboard.headerName(self.nls.heading);
        self.downloadPartyDetails = function() {
            PartyModel.downloadPartyDetails(Constants.userSegment);
        };
    };
});