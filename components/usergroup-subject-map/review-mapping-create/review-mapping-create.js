define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",

    "ojL10n!resources/nls/review-mapping-create",
    "ojs/ojinputtext",
    "ojs/ojpopup"
], function (oj, ko, $, BaseLogger, UserGroupSubjectMapCreateModel, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerComponent("list-mail-categories", "usergroup-subject-map");
        self.categoryOptionList = ko.observableArray();
        self.validationTracker = ko.observable();
        self.mailCategoryDTOs = ko.observableArray();
        self.categoryDTOArray = ko.observableArray();
        self.selectedSubjectIds = ko.observableArray();
        self.selectedUserGroupName = self.selectedUserGroupName ? self.selectedUserGroupName : ko.observable();
        self.approval = ko.observable(false);
        self.mailCategoriesListLoaded = ko.observable(false);
        self.disableState = ko.observable(true);
        self.areAllOptionsSelected = ko.observable(false);
        rootParams.dashboard.headerName(self.nls.pageTitle.userGroupSubjectMap);
        self.fetchGroupCode = function (selectedUserGroupId) {
            UserGroupSubjectMapCreateModel.fetchUserGroupList().done(function (userGroupData) {
                ko.utils.arrayForEach(userGroupData.userGroupDTOs, function (item) {
                    if (item.id === selectedUserGroupId)
                        self.selectedUserGroupName(item.name + "-" + item.description);
                });
            });
        };
        self.parseCategoryData = function (data) {
            ko.utils.arrayForEach(data, function (item) {
                var categoryDTO = {
                    "categoryId": "",
                    "name": "",
                    "subjects": []
                };
                categoryDTO.categoryId = item.subjectDTO.mailCategoryDTO.categoryId;
                categoryDTO.name = item.subjectDTO.mailCategoryDTO.name;
                if (!(self.categoryDTOArray().filter(function (e) {
                        return e.categoryId === item.subjectDTO.mailCategoryDTO.categoryId;
                    }).length > 0)) {
                    self.categoryDTOArray.push(categoryDTO);
                }
                if (item.selectionStatus === true)
                    self.selectedSubjectIds.push(item.subjectDTO.subjectId);
            });
            ko.utils.arrayForEach(data, function (subjectItem) {
                ko.utils.arrayForEach(self.categoryDTOArray(), function (categoryItem) {
                    if (categoryItem.categoryId === subjectItem.subjectDTO.mailCategoryDTO.categoryId) {
                        var nestedSubjectDTO = {
                            subject: "",
                            subjectId: "",
                            userGroupId: "",
                            subjectMapId: "",
                            version: ""
                        };
                        nestedSubjectDTO.subject = subjectItem.subjectDTO.subject;
                        nestedSubjectDTO.subjectId = subjectItem.subjectDTO.subjectId;
                        nestedSubjectDTO.userGroupId = subjectItem.subjectDTO.userGroupId;
                        nestedSubjectDTO.subjectMapId = subjectItem.subjectMapId;
                        nestedSubjectDTO.version = subjectItem.version;
                        categoryItem.subjects.push(nestedSubjectDTO);
                        if (!(self.mailCategoryDTOs().filter(function (e) {
                                return e.categoryId === categoryItem.categoryId;
                            }).length > 0)) {
                            self.mailCategoryDTOs.push(categoryItem);
                        }
                    }
                });
            });
        };
        if (rootParams.rootModel.transactionDetails) {
            self.fetchGroupCode(rootParams.rootModel.transactionDetails().transactionSnapshot.userGroupId);
            self.parseCategoryData(rootParams.rootModel.transactionDetails().transactionSnapshot.subjects);
            self.mappingCode = rootParams.rootModel.transactionDetails().transactionSnapshot.mappingCode;
            self.mappingDesc = rootParams.rootModel.transactionDetails().transactionSnapshot.mappingDescription;
            self.approval(true);
        } else {
            self.mappingCode = rootParams.rootModel.mappingCode();
            self.mappingDesc = rootParams.rootModel.mappingDesc();
            self.categoryOptionValue = rootParams.rootModel.categoryOptionValue();
            self.categoryOptionList = rootParams.rootModel.categoryOptionList;
            self.categoryOptionValueName = rootParams.rootModel.categoryOptionValueName();
            self.mailCategoriesListLoaded = rootParams.rootModel.mailCategoriesListLoaded();
            self.areAllOptionsSelected = rootParams.rootModel.areAllOptionsSelected;
            self.selectedSubjectIds = rootParams.rootModel.selectedSubjectIds;
            self.nestedSubjectObjectsList = rootParams.rootModel.nestedSubjectObjectsList;
            self.createMode = rootParams.rootModel.createMode;
        }
    };
});
