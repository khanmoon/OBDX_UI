define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",

  "ojL10n!resources/nls/user-group-subject-map-update",
  "ojs/ojinputtext",
  "ojs/ojpopup"
], function(oj, ko, $, BaseLogger, UserGroupSubjectMapUpdateModel, resourceBundle) {
  "use strict";
  return function viewModel(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerComponent("list-mail-categories", "usergroup-subject-map");
    rootParams.baseModel.registerComponent("review-mapping-update", "usergroup-subject-map");
    rootParams.baseModel.registerElement("confirm-screen");
    self.createMode = ko.observable(false);
    self.categoryOptionValue = ko.observable();
    self.categoryOptionList = ko.observableArray();
    self.categoryOptionValueName = ko.observable();
    self.mailCategoriesListLoaded = ko.observable(false);
    self.areAllOptionsSelected = ko.observable(false);
    self.selectedSubjectIds = ko.observableArray();
    self.nestedSubjectObjectsList = ko.observableArray();
    self.disableState = ko.observable(true);
    self.loadReviewComponent = ko.observable(false);
    self.showConfirmation = ko.observable(false);
    self.mappingCode(rootParams.rootModel.mappingCode());
    self.mappingDesc(rootParams.rootModel.mappingDesc());
    self.mappingId(rootParams.rootModel.mappingId());
    self.transactionStatus = ko.observable();
    self.transactionName = ko.observable(self.nls.headers.transactionName);
    rootParams.dashboard.headerName(self.nls.pageTitle.userGroupSubjectMap);
    self.enableEditMode = function() {
      self.disableState(false);
    };
    self.updateMappings = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      self.updatePayload();
      var userGroupId;
      if (typeof self.selectedUserGroupId() === "string")
        userGroupId = self.selectedUserGroupId();
      else
        userGroupId = self.selectedUserGroupId()[0];
      var actualPayload = {
        mappingCode: self.mappingCode(),
        mappingDescription: self.mappingDesc(),
        userGroupId: userGroupId,
        subjects: self.nestedSubjectObjectsList(),
        version: self.mappingVersionNumber(),
        createdBy: self.createdBy(),
        creationDate: self.creationDate()
      };
      UserGroupSubjectMapUpdateModel.updateMappings(ko.toJSON(actualPayload), self.mappingId()).done(function(data, status, jqXhr) {
        self.transactionStatus(data);
        self.showConfirmation(true);
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.transactionName()
        }, self);
      });
    };
    self.groupCodeChangeHandler = function(event) {
      if (event.detail.value) {
        self.selectedUserGroupId(event.detail.value);
        ko.utils.arrayForEach(self.groupCodeEnums(), function(item) {
          if (self.selectedUserGroupId() === item.groupCodeId)
            self.selectedUserGroupName(item.groupCodeName);
        });
      }
    };
    self.updatePayload = function() {
      ko.utils.arrayForEach(self.categoryOptionList(), function(item) {
        ko.utils.arrayForEach(item.children, function(childItem) {
          var subjectObject;
          if (!(self.selectedSubjectIds().filter(function(e) {
              return e === childItem.value;
            }).length > 0)) {
            subjectObject = {
              selectionStatus: false,
              userGroupSubjectMapDTOObject: null,
              subjectDTO: {
                subjectId: childItem.value,
                subject: childItem.name,
                mailCategoryDTO: {
                  name: item.name,
                  categoryId: item.categoryId
                }
              },
              subjectMapId: childItem.subjectMapId,
              version: childItem.version
            };
            self.nestedSubjectObjectsList().push(subjectObject);
          } else {
            subjectObject = {
              selectionStatus: true,
              userGroupSubjectMapDTOObject: null,
              subjectDTO: {
                subjectId: childItem.value,
                subject: childItem.name,
                mailCategoryDTO: {
                  name: item.name,
                  categoryId: item.categoryId
                }
              },
              subjectMapId: childItem.subjectMapId,
              version: childItem.version
            };
            self.nestedSubjectObjectsList().push(subjectObject);
          }
        });
      });
    };
    self.cancel = function() {
      rootParams.dashboard.openDashBoard(self.nls.common.cancelConfirm);
    };
    self.back = function() {
      rootParams.dashboard.hideDetails();
    };
    self.saveForReview = function() {
      self.loadReviewComponent(true);
      self.disableState(true);
      self.createMode(false);
      self.updateMode(false);
    };
    self.edit = function() {
      self.loadReviewComponent(false);
      self.disableState(false);
      self.createMode(false);
    };
  };
});
