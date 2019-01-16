define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",

    "ojL10n!resources/nls/user-group-subject-map-search",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojpopup",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation"
], function (oj, ko, $, BaseLogger, UserGroupSubjectMapSearchModel, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.validationTracker = ko.observable();
        self.mappingCode = ko.observable();
        self.mappingDesc = ko.observable();
        self.groupCodeEnums = ko.observableArray();
        self.selectedUserGroupId = ko.observable("");
        self.mappingDatasource = new oj.ArrayTableDataSource([]);
        self.groupCodeEnumsLoaded = ko.observable(false);
        self.mappingDataLoaded = ko.observable(false);
        self.mappingId = ko.observable();
        self.selectedUserGroupName = ko.observable();
        self.mappingVersionNumber = ko.observable();
        self.createdBy = ko.observable();
        self.creationDate = ko.observable();
        self.subjectCount = ko.observable();
        self.subjectSelectionCount = ko.observable();
        self.listUserGroups = function () {
            UserGroupSubjectMapSearchModel.fetchUserGroupList().done(function (userGroupData) {
                ko.utils.arrayForEach(userGroupData.userGroupDTOs, function (item) {
                    self.groupCodeObject = {
                        "groupCodeId": "",
                        "groupCodeName": "",
                        "groupCodeDescription": ""
                    };
                    self.groupCodeObject.groupCodeId = item.id;
                    self.groupCodeObject.groupCodeName = item.name + "-" + item.description;
                    self.groupCodeObject.groupCodeDescription = item.description;
                    self.groupCodeEnums.push(self.groupCodeObject);
                });
                self.groupCodeEnumsLoaded(true);
            });
        };
        self.groupCodeName = function () {
            ko.utils.arrayForEach(self.groupCodeEnums(), function (item) {
                if (self.selectedUserGroupId() === item.groupCodeId)
                    self.selectedUserGroupName(item.groupCodeName);
            });
        };
        self.listUserGroups();
        self.resetForm = function () {
            self.mappingCode("");
            self.mappingDesc("");
            self.mappingDataLoaded(false);
        };
        self.fetchMapping = function () {
            if (!self.mappingCode() && !self.mappingDesc() && !self.selectedUserGroupId()) {
                rootParams.baseModel.showMessages(null, [self.nls.info.inputRequired], "ERROR");
            } else {
                var parameters = {
                    "mappingCode": self.mappingCode(),
                    "mappingDesc": self.mappingDesc(),
                    "groupId": self.selectedUserGroupId()
                };
                UserGroupSubjectMapSearchModel.fetchMappinList(parameters).done(function (data) {
                    var mappingList = data.userGroupSubjectMapDTO;
                    mappingList = $.map(data.userGroupSubjectMapDTO, function (mapping) {

                        mapping.mappingDesc = mapping.mappingDescription;


                        return mapping;
                    });
                    self.mappingDatasource.reset(mappingList, { idAttribute: "mappingId" });
                    self.mappingDatasource.data = mappingList;
                    self.mappingDataLoaded(true);
                });
            }
        };
        self.fetchMappingDetails = function (data) {
            self.mappingId(data.mappingId);
            self.mappingCode(data.mappingCode);
            self.mappingDesc(data.mappingDesc);
            self.selectedUserGroupId(data.userGroupId);
            self.mappingVersionNumber(data.version);
            self.createdBy(data.createdBy);
            self.creationDate(data.creationDate);
            self.groupCodeName();
            self.updateMode(true);
            var count = 0, statusCount = 0;
            ko.utils.arrayForEach(data.subjects, function (item) {
                if (item.selectionStatus === true) {
                    statusCount++;
                }
                count++;
            });
            self.subjectSelectionCount(statusCount);
            self.subjectCount(count);
            rootParams.dashboard.loadComponent("mapping-update", {}, self);
        };
    };
});
