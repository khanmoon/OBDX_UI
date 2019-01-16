define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "./model",
    "ojL10n!resources/nls/audit",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojtable",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojbutton",
    "ojs/ojcheckboxset"
], function (oj, ko, $, BaseLogger, AuditLogModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("page-section");
        self.fromDateTime = ko.observable();
        self.toDateTime = ko.observable();
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        self.userid = ko.observable();
        self.partyid = ko.observable();
        self.action = ko.observable([]);
        self.partyId = ko.observable();
        self.status = ko.observable([]);
        self.partyName = ko.observable();
        self.validationTracker = ko.observable();
        self.userValidationTracker = ko.observable();
        self.partyValidationTracker = ko.observable();
        self.moreSearchOptions = ko.observable(false);
        self.indirectedParty = ko.observable();
        self.loadSearchData = ko.observable(false);
        self.searchedUserList = ko.observableArray();
        self.userList = ko.observableArray();
        self.searchedPartyList = ko.observableArray();
        self.partyList = ko.observableArray();
        self.selectedUserType = ko.observable([]);
        self.userType = ko.observable();
        self.username = ko.observable();
        self.usernamesearched = ko.observable();
        self.firstName = ko.observable();
        self.datasource = ko.observableArray();
        self.userListDetailsDataSource = ko.observableArray();
        self.partyNamesearched = ko.observable();
        self.userTypeEnums = ko.observableArray();
        self.loginUserType = ko.observable();
        self.userTypeEnumsLoaded = ko.observable(false);
        self.adminLogin = ko.observable(false);
        self.activityEnum = ko.observableArray();
        self.activityEnumLoaded = ko.observable(false);
        self.selectedActivity = ko.observable([]);
        self.showList = ko.observable(false);
        self.referenceNo = ko.observable();
        self.dateType = ko.observable();
        self.loadSearchedAudits = ko.observable(false);
        self.auditResult = ko.observable();
        self.dateFlag = ko.observable(false);
        self.actionHeaderheading = ko.observable();
        rootParams.baseModel.registerComponent("audit-log-search-results", "audit");
        rootParams.dashboard.headerName(self.nls.header.auditlogmaintenance);
        var partyId = {};
        partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
        partyId.displayValue = rootParams.dashboard.userData.userProfile.partyId.displayValue;
        if (partyId.value) {
            self.isCorpAdmin = true;
        } else {
            self.isCorpAdmin = false;
        }
        if (self.isCorpAdmin) {
            self.indirectedParty(rootParams.dashboard.userData.userProfile.partyId.value);
            AuditLogModel.fetchPreferenceForParty(self.indirectedParty()).done(function (data) {
                if (data.partyPreferencesDTOs) {
                    self.partyId(data.partyPreferencesDTOs.party.displayValue);
                }
            });
        }
        self.actionHeaderheading(self.nls.header.auditLog);
        AuditLogModel.fetchUserGroupOptions().done(function (data) {
            ko.utils.arrayForEach(data.enterpriseRoleDTOs, function (item) {
                self.userTypeEnums.push(item);
            });
            self.userTypeEnumsLoaded(true);
        });
        AuditLogModel.fetchActivities().done(function (data) {
            ko.utils.arrayForEach(data.taskList, function (item) {
                self.activityEnum.push(item);
            });
            self.activityEnumLoaded(true);
        });
            if (rootParams.dashboard.userData.userProfile.roles.indexOf("administrator") !== -1) {
                self.adminLogin(true);
            } else if(rootParams.dashboard.userData.userProfile.roles.indexOf("Administrator")!== -1){
                self.adminLogin(true);
            } else {
                self.adminLogin(false);
                ko.utils.arrayForEach(self.userTypeEnums, function (item) {
                    for(var i=0;i<rootParams.dashboard.userData.userProfile.roles.length;i++){
                      if(rootParams.dashboard.userData.userProfile.roles[i] ===item.enterpriseRoleId)
                      self.selectedUserType().push(item.enterpriseRoleId);
                    }
                });
            }
        self.showMoreSearchOptions = function () {
            self.moreSearchOptions(!self.moreSearchOptions());
        };
        self.resetForm = function () {
            self.username("reset");
            self.fromDateTime("reset");
            self.fromDate("reset");
            self.toDateTime("reset");
            self.toDate("reset");
            self.referenceNo("reset");
            self.username("");
            self.fromDateTime("");
            self.fromDate("");
            self.toDateTime("");
            self.toDate("");
            self.referenceNo("");
            if (self.isCorpAdmin === false) {
                self.partyId("reset");
                self.partyId("");
                self.selectedUserType([]);
            }
            self.dateType("today");
            self.dateRange(false);
            self.selectedActivity([]);
            self.status([]);
            self.action([]);
            self.loadSearchData(false);
            self.showList(false);
            self.loadSearchedAudits(false);
        };
        self.showUserSearch = function () {
          self.resetDialogue();
          self.showUserData(true);
          self.userList([]);
          $("#userSearch").trigger("openModal");
        };
        self.showPartySearch = function () {
            self.resetParty();
            self.showPartyData(true);
            $("#partySearch").trigger("openModal");
        };
        self.userSelected = function (data) {
            self.username(data.username);
            $("#userSearch").hide();
            self.showUserData(false);
        };
        self.partySelected = function (data) {
            self.partyId(data.displayValue);
            $("#partySearch").hide();
            self.showPartyData(false);
        };
        self.resetDialogue = function () {
            self.username("reset");
            self.username("");
            self.userList([]);
            self.loadSearchData(false);
        };
        self.resetParty = function () {
            self.partyName("reset");
            self.partyId("reset");
            self.partyName("");
            self.partyId("");
            self.showList(false);
        };
        self.userTypeOptionChangeHandler = function (event) {

                self.selectedUserType(event.detail.value);

        };
        self.fetchUsers = function () {
            self.userList([]);
            if (!rootParams.baseModel.showComponentValidationErrors(self.userValidationTracker())) {
                return;
            }
            if (self.partyId() && self.isCorpAdmin === false) {
                AuditLogModel.fetchDetails(self.partyId()).done(function (data) {
                    if (data.parties.length === 0) {
                        self.loadSearchData(false);
                        self.partyId("");
                        rootParams.baseModel.showMessages(null, [self.nls.info.incorrectInfo], "ERROR");
                    } else if (data.parties[0] !== null && data.parties[0]) {
                        self.indirectedParty(data.parties[0].id.value);
                        self.fetchUsersList();
                    }
                });
            } else {
                self.fetchUsersList();
            }
        };
        self.fetchUsersList = function () {
            if (self.username() === null || self.username() === undefined) {
                self.username("");
            }
            if (self.firstName() === null || self.firstName() === undefined) {
                self.firstName("");
            }
            var userParameters = {
                "username": self.username(),
                "firstName": self.firstName(),
                "partyId": self.indirectedParty(),
                "userType": self.selectedUserType(),
                "isAccessSetupCheckRequired": false
            };
            self.usernamesearched(self.username());
            self.loadSearchData(false);
            if (self.username() !== "") {
                AuditLogModel.fetchUsersList(userParameters).done(function (data) {
                    self.searchedUserList(data.userDTOList);
                    if (data.userDTOList) {
                        self.loadSearchData(true);
                        if (data.userDTOList.length > 0) {
                            ko.utils.arrayForEach(data.userDTOList, function (item) {
                                self.userList().push(item);
                                self.userListDetailsDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.userList(), { idAttribute: "username" })));
                            });
                        } else {
                            self.userList([]);
                            self.userListDetailsDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.userList(), { idAttribute: "username" })));
                        }
                    } else {
                        rootParams.baseModel.showMessages(null, [self.nls.info.recordNotFound], "ERROR");
                    }
                });
            } else {
                rootParams.baseModel.showMessages(null, [self.nls.info.dataRequired], "ERROR");
            }
        };
        self.fetchPartyDetailsByName = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.partyValidationTracker())) {
                return;
            }
            self.showList(false);
            AuditLogModel.fetchDetailsByName(self.partyName()).done(function (data) {
                var partyList;
                partyList = $.map(data.parties, function (party) {
                    party.partyName = party.personalDetails.firstName;
                    party.value = party.id.value;
                    party.displayValue = party.id.displayValue;
                    return party;
                });
                if (data.parties.length > 0) {
                    self.showList(true);
                    self.datasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(partyList, { idAttribute: "partyName" })));
                } else {
                    rootParams.baseModel.showMessages(null, [self.nls.info.incorrectInfo], "ERROR");
                }
            });
        };
        self.setDate = function (event) {
            if (event.detail.value) {
                var today = rootParams.baseModel.getDate();
                var index = event.detail.value;
                if (index === "today") {
                    self.dateRange(false);
                    self.fromDateTime(self.formatDateTime(today, index, true));
                    self.toDateTime(self.formatDateTime(today, index, false));
                } else if (index === "yesterday") {
                    self.dateRange(false);
                    today = rootParams.baseModel.getDate();
                    today.setDate(today.getDate() - 1);
                    self.fromDateTime(self.formatDateTime(today, index, true));
                    self.toDateTime(self.formatDateTime(today, index, false));
                } else if (index === "l3d") {
                    self.dateRange(false);
                    var date = rootParams.baseModel.getDate();
                    date.setDate(date.getDate() - 2);
                    self.fromDateTime(self.formatDateTime(date, index, true));
                    today = rootParams.baseModel.getDate();
                    self.toDateTime(self.formatDateTime(today, index, false));
                } else if (index === "dr") {
                    self.dateRange(true);
                }
            }
        };
        self.formatDateTime = function (date, index, dateFlag) {
            if (self.dateRange() === false) {
                var time = date.toTimeString();
                time = time.substring(0, time.indexOf(" "));
                date = oj.IntlConverterUtils.dateToLocalIso(date);
                if (dateFlag) {
                    if (index === "today" || index === "l3d") {
                        date = date.substring(0, date.indexOf("T"));
                        date = date + time;
                    } else {
                        date = date.substring(0, date.indexOf("T"));
                        date = date + "000000";
                    }
                } else {
                    date = date.substring(0, date.indexOf("T"));
                    date = date + "235959";
                }
            }
            date = date.replace(/T|-|:/g, "");
            return date;
        };
        self.dateType.subscribe(function (newValue) {
            if (newValue[0] === "dr" || newValue === "dr") {
                self.dateRange(true);
                if (typeof self.dateType() === "object")
                    self.dateType(self.dateType()[0]);
            } else {
                self.dateRange(false);
            }
        });
        self.searchAudit = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.loadSearchedAudits(false);
            if (self.dateRange()) {
                self.fromDateTime(self.formatDateTime(self.fromDate(), true));
                self.toDateTime(self.formatDateTime(self.toDate(), false));
            }
            AuditLogModel.searchAudit(self.username(), self.fromDateTime(), self.toDateTime(), self.selectedActivity(), self.partyId(), self.action(), self.status(), self.referenceNo(), self.selectedUserType()).done(function (data) {
                self.loadSearchedAudits(true);
                self.auditResult(data.auditList);
            });
        };
        self.cancel = function () {
            rootParams.dashboard.openDashBoard();
        };
        self.dateRange = ko.observable(false);
        self.showUserData = ko.observable(false);
        self.showPartyData = ko.observable(false);
        self.mainSearch = ko.observable(false);
    };
});
