define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/feedback",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup",
  "ojs/ojgauge",
  "ojs/ojselectcombobox"
], function(oj, ko, $, FeedbackModel, resourceBundle) {
  "use strict";

  return function(params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    if (!params.rootModel.params.feedbackHomeDTO) {
      params.rootModel.params.feedbackHomeDTO = params.rootModel.feedbackHomeDTO;
      params.rootModel.params.feedbackDefinitionDTO = params.rootModel.feedbackDefinitionDTO;
    }
    self.resource = resourceBundle;
    self.groupValid = ko.observable();
    self.defaultRole = ko.observableArray([]);
    self.inputTemplateIdentifier = ko.observable();
    self.inputTemplateName = ko.observable();
    self.feedbackUserRole = ko.observable([]);
    self.feedbackUserRoleLoaded = ko.observable(false);
    self.hideButtons = ko.observable(false);
    self.overallQuestion = ko.observable();
    params.dashboard.headerName(self.resource.title);
    self.applicableRoles = ko.observable();
    self.onEdit = ko.observable(false);
    params.baseModel.registerComponent("feedback-home", "feedback");
    params.baseModel.registerComponent("feedback-template-search", "feedback");
    self.back = function() {
      params.dashboard.loadComponent("feedback-template-search", {}, self);
    };
    if (params.rootModel.params.feedbackHomeDTO) {
      self.onEdit(true);
      self.hideButtons(self.reviewTemplate());
      self.inputTemplateIdentifier(params.rootModel.params.feedbackHomeDTO.templateIdentifier);
      self.inputTemplateName(params.rootModel.params.feedbackHomeDTO.templateName);
      self.defaultRole(params.rootModel.params.feedbackHomeDTO.roles);
      self.version(params.rootModel.params.feedbackHomeDTO.version);
      self.templateId(params.rootModel.params.feedbackHomeDTO.templateId);
      self.applicableRoles(self.defaultRole().join());
      self.overallQuestion(params.rootModel.params.feedbackHomeDTO.templateDescription);
    }
    FeedbackModel.getFeedbackUserRole().done(function(data) {
      for (var j = 0; j < data.enterpriseRoleDTOs.length; j++) {
        if (data.enterpriseRoleDTOs[j].enterpriseRoleId !== "administrators" && data.enterpriseRoleDTOs[j].enterpriseRoleId !== "administrator") {
          self.feedbackUserRole().push(data.enterpriseRoleDTOs[j]);
        }
      }
      self.feedbackUserRoleLoaded(true);
    });
    self.showGlobalscreenNext = function() {
      var tracker = document.getElementById("tracker");
      if (tracker.valid === "valid") {
        self.applicableRoles(self.defaultRole().join());
        if (self.fromReview && self.fromReview()) {
          self.reviewTemplate(true);
          var feedbackHomeDTO = {
            templateIdentifier: self.inputTemplateIdentifier(),
            templateName: self.inputTemplateName(),
            templateDescription: self.overallQuestion(),
            templateId: self.templateId(),
            version: self.version(),
            scaleDTO: {
              scaleId: self.selectedScale(),
              scaleType: self.scaleTypeText() + self.selectedScale()
            },
            roles: self.defaultRole()
          };
          params.dashboard.loadComponent("feedback-home", {
            feedbackHomeDTO: feedbackHomeDTO,
            feedbackDefinitionDTO: self.feedbackDefinitionDTO(),
            fromLanding: true
          }, self);
        } else {
          params.dashboard.loadComponent("feedback-home", {}, self);
        }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
    self.showGlobalscreenSave = function() {
      var tracker = document.getElementById("tracker");
      if (tracker.valid === "valid") {
        self.applicableRoles(self.defaultRole().join());
        if (self.fromReview && self.fromReview()) {
          self.reviewTemplate(true);
          var feedbackHomeDTO = {
            templateIdentifier: self.inputTemplateIdentifier(),
            templateName: self.inputTemplateName(),
            templateDescription: self.overallQuestion(),
            templateId: self.templateId(),
            version: self.version(),
            scaleDTO: {
              scaleId: self.selectedScale(),
              scaleType: self.scaleTypeText() + self.selectedScale()
            },
            roles: self.defaultRole()
          };
          params.dashboard.loadComponent("feedback-template-create", {
            feedbackHomeDTO: feedbackHomeDTO,
            feedbackDefinitionDTO: self.feedbackDefinitionDTO()
          }, self);
        }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
  };
});
