define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/feedback",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojcheckboxset",
  "ojs/ojarraydataprovider",
  "ojs/ojtable",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup",
  "ojs/ojgauge",
  "ojs/ojselectcombobox"
], function(oj, ko, $, FeedbackModel, resourceBundle) {
  "use strict";
  return function(params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.inputTemplateIdentifier = ko.observable();
    self.inputTemplateName = ko.observable();
    self.feedbackUserRole = ko.observable([]);
    self.feedbackTemplateList = ko.observable([]);
    self.feedbackTemplateListLoaded = ko.observable(false);
    self.feedbackReviewHeader = ko.observable(false);
    self.feedbackUserRoleLoaded = ko.observable(false);
    self.viewTable = ko.observable(false);
    self.viewTemplate = ko.observable();
    self.dataSource = ko.observable();
    self.overallQuestion = ko.observable();
    self.defaultRole = ko.observableArray([]);
    self.applicableRoles = ko.observable();
    params.dashboard.headerName(self.resource.title);
    self.templateList = ko.observable();
    params.baseModel.registerComponent("feedback-home", "feedback");
    params.baseModel.registerComponent("feedback-template-landing", "feedback");
    params.baseModel.registerComponent("feedback-template-create", "feedback");
    params.baseModel.registerComponent("feedback-home", "feedback");
    self.headerText = ko.observableArray([{
        "headerText": self.resource.templateIdentifier,
        "renderer": oj.KnockoutTemplateUtils.getRenderer("templateIdentifier", true)
      },
      {
        "headerText": self.resource.templateName,
        "field": "templateName"
      },
      {
        "headerText": self.resource.applicableToRole,
        "field": "enterpriseRoles"
      }
    ]);
    FeedbackModel.getFeedbackUserRole().done(function(data) {
      if (data.enterpriseRoleDTOs) {
        self.feedbackUserRole(data.enterpriseRoleDTOs);
        self.feedbackUserRoleLoaded(true);
      }
    });
    self.onSelectedInTable = function(data) {
      if (data.templateId) {
        self.feedbackReviewHeader(false);
        var tempEntity = ko.utils.arrayFilter(self.templateList(), function(entity) {
          if (entity.templateId === data.templateId) {
            return entity;
          }
        });
        if (tempEntity[0].templateId) {
          var templateDetails = {
            templateId : tempEntity[0].templateId,
            templateName : tempEntity[0].templateName,
            isView : true
          };
          params.dashboard.loadComponent("feedback-home", {
            templateDetails : templateDetails
          }, self);
        }
      }
    };
    self.openCreate = function() {
      params.dashboard.loadComponent("feedback-template-landing", {}, self);
    };
    self.searchResult = function() {
      FeedbackModel.fetchTemplateList(self.inputTemplateIdentifier(),self.inputTemplateName(),self.defaultRole()).done(function(data) {
        if (data.feedbackTemplateDTO) {
          self.templateList(data.feedbackTemplateDTO);
          self.feedbackTemplateListLoaded(true);
        }
        var tempData = null;
        tempData = $.map(data.feedbackTemplateDTO, function(v) {
          var newObj = {};
          newObj.templateIdentifier = v.templateIdentifier;
          newObj.templateName = v.templateName;
          newObj.enterpriseRoles = v.enterpriseRoles[0];
          newObj.templateId = v.templateId;
          return newObj;
        });
        self.dataSource(new oj.ArrayDataProvider(tempData, {
          idAttribute: "templateId"
        }));
        self.viewTable(true);
      });
    };
    self.clearFields = function() {
      self.feedbackUserRoleLoaded(false);
      ko.tasks.runEarly();
      self.inputTemplateIdentifier("");
      self.inputTemplateName("");
      self.defaultRole().splice(0, self.defaultRole().length);
      self.feedbackUserRoleLoaded(true);
    };
  };
});
