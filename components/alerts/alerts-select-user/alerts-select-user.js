define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/alerts-subscription",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, AlertsUserSelectModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = ResourceBundle;
        self.backLabel = self.nls.subscription.genericAlert.back;
        self.cancel = self.nls.subscription.genericAlert.cancel;
        self.cancelButtonFlag = ko.observable(true);
self.partyIdAvailable=null;
self.partyIdDisplayValue=null;
        rootParams.dashboard.headerName(self.nls.subscription.headers.subscriptionHeading);
        rootParams.baseModel.registerElement("page-section");
        self.selectedUserType = ko.observable();
        rootParams.baseModel.registerComponent("user-type", "user-management");
        rootParams.baseModel.registerComponent("users-search", "user-management");
        rootParams.baseModel.registerComponent("user-search-list", "user-management");
        self.username = ko.observable();
        self.firstName = ko.observable();
        self.lastName = ko.observable();
        self.emailId = ko.observable();
        self.mobileNumber = ko.observable();
        self.userTypeSelectionIdle = ko.observable(true);
self.isCorpAdmin=null;
        var partyId = {};
        partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
        partyId.displayValue = rootParams.dashboard.userData.userProfile.displayValue;
        if (partyId.value) {
            self.isCorpAdmin = true;
        } else {
            self.isCorpAdmin = false;
        }
        if (rootParams.rootModel.usernamesearched) {
            self.username(rootParams.rootModel.usernamesearched());
            self.firstName(rootParams.rootModel.firstNamesearched());
            self.lastName(rootParams.rootModel.lastNamesearched());
            self.emailId(rootParams.rootModel.emailIdsearched());
            self.mobileNumber(rootParams.rootModel.mobileNumbersearched());
            self.usernamesearched = rootParams.rootModel.usernamesearched;
            self.firstNamesearched = rootParams.rootModel.firstNamesearched;
            self.lastNamesearched = rootParams.rootModel.lastNamesearched;
            self.emailIdsearched = rootParams.rootModel.emailIdsearched;
            self.mobileNumbersearched = rootParams.rootModel.mobileNumbersearched;
            self.user = ko.observable({
                showCreateUser: ko.observable(false),
                searchedUserList: rootParams.rootModel.userList,
                loadSearchData: ko.observable(true)
            });
        } else {
            self.usernamesearched = ko.observable();
            self.firstNamesearched = ko.observable();
            self.lastNamesearched = ko.observable();
            self.emailIdsearched = ko.observable();
            self.mobileNumbersearched = ko.observable();
            self.user = ko.observable({
                showCreateUser: ko.observable(false),
                searchedUserList: ko.observableArray([]),
                loadSearchData: ko.observable(false)
            });
        }
        self.fetchMeData = function () {
            if (self.partyIdAvailable) {
                self.rootModelInstance().partyDetails.party.value(self.partyIdAvailable);
                AlertsUserSelectModel.fetchMeWithParty().done(function (dataName) {
                    if (dataName.party.personalDetails.fullName) {
                        self.partyIdFetched(true);
                        self.rootModelInstance().partyDetails.partyName(dataName.party.personalDetails.fullName);
                        self.rootModelInstance().partyDetails.party.displayValue(self.partyIdDisplayValue);
                        self.rootModelInstance().partyDetails.partyDetailsFetched(true);
                    }
                });
            } else {
                self.rootModelInstance().partyDetails.party.value(null);
                self.rootModelInstance().partyDetails.party.displayValue(null);
                self.rootModelInstance().partyDetails.partyName(null);
            }
        };
        self.dataLoaded = ko.observable(false);
        self.datasource = {};
        self.validationTracker = ko.observable();
        rootParams.dashboard.backAllowed(false);
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerComponent("manage-alerts-subscription", "alerts");
        var getNewKoModel = function () {
            var KoModel = AlertsUserSelectModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.partyDetails = self.rootModelInstance().partyDetails;
        self.partyIdFetched = ko.observable(false);
        self.loadPartyValidate = ko.observable(true);

        var partyDetailsFetchedsubscription = self.rootModelInstance().partyDetails.partyDetailsFetched.subscribe(function (newValue) {
            if (newValue === true) {
                rootParams.dashboard.loadComponent("manage-alerts-subscription", {}, self);
                self.partyIdFetched(true);
            }
        });
        self.dispose = function () {
            partyDetailsFetchedsubscription.dispose();
        };
        self.reset = function () {
            self.partyDetails.partyDetailsFetched(false);
        };
        self.back = function () {
            self.partyDetails.partyDetailsFetched(false);
            self.rootModelInstance().partyDetails.partyDetailsFetched(false);
            self.rootModelInstance().partyDetails.party.value("");
            self.rootModelInstance().partyDetails.partyName("");
            self.rootModelInstance().partyDetails.additionalDetails("");
        };
        self.openSubscribeAlert = function () {
            rootParams.dashboard.loadComponent("manage-alerts-subscription", {}, self);
        };
    };
});
