define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",
    "baseLogger",

    "framework/js/constants/constants",
    "ojL10n!resources/nls/user-management",
    "ojs/ojinputtext"
], function (oj, ko, UsersModel, $, BaseLogger, constants, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.resource = resourceBundle;
        self.cancelButtonFlag = ko.observable(true);
        self.isNewUser = ko.observable(true);
        self.isDisabled = ko.observable(false);
        self.userGroupsList = ko.observableArray();
        self.transactionName = ko.observable();
        if (rootParams.rootModel.userTypeSelectionIdle === undefined) {
            self.userTypeSelectionIdle = ko.observable(true);
        } else {
            self.userTypeSelectionIdle = rootParams.rootModel.userTypeSelectionIdle;
        }
        self.dataSource = ko.observableArray();
        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("user-type", "user-management");
        rootParams.baseModel.registerComponent("user-search-list", "user-management");
        self.deleteConfrimFlag = ko.observable(false);
        self.username = ko.observable();
        self.firstName = ko.observable();
        self.lastName = ko.observable();
        self.emailId = ko.observable();
        self.mobileNumber = ko.observable();
        self.selectedUserType = ko.observable();
        self.isCorpAdmin = ko.observable(false);
        var partyId = {};
        partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
        partyId.displayValue = rootParams.dashboard.userData.userProfile.partyId.displayValue;
        if (partyId.value !== null && partyId.value.trim() !== "") {
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
            if (self.userFullData)
                self.selectedUserType(self.userFullData().userType.enterpriseRoleId);
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
        rootParams.dashboard.headerName(self.nls.headers.userManagement);
        self.validateButtonPressed = ko.observable(false);
        self.showUpdateButton = ko.observable(false);
        self.isCountryFetched = ko.observable(false);
        self.countries = ko.observableArray();
        self.countriesMap = {};
        self.childRoleEnums = ko.observableArray([]);
        self.childRoleEnumsLoaded = ko.observable(false);
        self.selectedChildRole = ko.observableArray([]);
        self.salutationList = ko.observableArray([
            {
                "code": self.nls.fieldname.mr,
                "description": self.nls.fieldname.mr
            },
            {
                "code": self.nls.fieldname.mrs,
                "description": self.nls.fieldname.mrs
            },
            {
                "code": self.nls.fieldname.ms,
                "description": self.nls.fieldname.ms
            },
            {
                "code": self.nls.fieldname.miss,
                "description": self.nls.fieldname.miss
            },
            {
                "code": self.nls.fieldname.dr,
                "description": self.nls.fieldname.dr
            },
            {
                "code": self.nls.fieldname.master,
                "description": self.nls.fieldname.master
            }
        ]);
        self.todayDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
        UsersModel.fetchCountry().done(function (data) {
            if (data.enumRepresentations) {
                for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    self.countries.push({
                        text: data.enumRepresentations[0].data[i].description,
                        value: data.enumRepresentations[0].data[i].code
                    });
                    self.countriesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
                }
                self.isCountryFetched(true);
            }
        });
        self.uData = {
            username: "",
            firstName: "",
            lastName: "",
            middleName: "",
            dateOfBirth: "",
            mobileNumber: "",
            emailId: "",
            phoneNumber: "",
            employeeNumber: "",
            employeeType: "",
            organization: "",
            manager: "",
            userType: "",
            parentRole: "",
            userGroups: "",
            address: {
                line1: "",
                line2: "",
                line3: "",
                line4: "",
                city: "",
                state: "",
                country: "",
                zipCode: ""
            },
            homeBranch: "",
            homeEntity: "",
            accessibleEntity: "",
            partyId: "",
            partyName: "",
            title: ""
        };
        self.isLoading = ko.observable(false);
        rootParams.baseModel.registerComponent("users-search", "user-management");
        rootParams.baseModel.registerComponent("users-create", "user-management");
        rootParams.baseModel.registerComponent("users-search-results", "user-management");
        rootParams.baseModel.registerElement("address");
        rootParams.baseModel.registerElement("action-header");
        self.openCreatePanel = function () {
            self.isLoading(false);
            self.user().showCreateUser(true);
            self.user().searchedUserList([]);
            self.user().loadSearchData(false);
            rootParams.dashboard.loadComponent("users-create", {}, self);
        };
        self.done = function () {
            location.reload();
        };
        self.fetchUserGroups = function () {
            UsersModel.fetchUserGroupOptions().done(function (userGroupdata) {
                self.userGroupsList(userGroupdata.enterpriseRoleDTOs);
            });
        };
        self.fetchUserGroups();
    };
});
