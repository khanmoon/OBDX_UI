define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/feedback",
  "ojs/ojinputtext",
  "ojs/ojknockout-validation",
  "ojs/ojbutton",
  "ojs/ojradioset",
  "ojs/ojvalidationgroup"
], function (oj, ko, $, FeedbackModel, resourceBundle) {
  "use strict";
  /**
   * File contains the view model for listing of scale realated to db table digx_fd_scale
   *
   * @property {String}   selectedScale          - scale name selected by user and find the  related scale.
   *
   * @property {Boolean}  scaleLoaded       - Initially this flag is set to false until data is fetched from server
   *                                            and ready to display on UI
   * @property {Array}    scale          - Array that maintains the list of scale fetched from the server
   *                                            property window.
   *
   *  @property {Boolean}  feedbackUserRoleLoaded       - Initially this flag is set to false until data is fetched from server
   *                                            and ready to display on UI
   *
   * @property {Array}    feedbackUserRole          - Array that maintains the list of User Role Like retail, corporate fetched from the server
   *                                            property window.
   */
  /**
   * return function - description
   *
   * @param  {Object} params parent context
   * @return {void}
   */
  return function (params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.scale = ko.observable([]);
    self.ratingValue1 = ko.observable();
    self.scaleLoaded = ko.observable(false);
    self.showSpareIcons = ko.observable(false);
    self.ratingValue2 = ko.observable(3);
    self.ratingW1 = ko.observable(1);
    self.groupValid = ko.observable();
    self.ratingW2 = ko.observable(2);
    self.ratingW3 = ko.observable(3);
    self.ratingW4 = ko.observable(4);
    self.ratingW5 = ko.observable(5);
    self.noValue = ko.observable("");
    params.baseModel.registerComponent("feedback-template-landing", "feedback");
    self.back = function () {
      var feedbackHomeDTO = {
        templateIdentifier: self.inputTemplateIdentifier(),
        templateName: self.inputTemplateName(),
        templateId: self.templateId(),
        version: self.version(),
        templateDescription: self.overallQuestion(),
        scaleDTO: {
          scaleId: self.selectedScale(),
          scaleType: self.scaleTypeText() + self.selectedScale()
        },
        roles: self.defaultRole()
      };
      params.dashboard.loadComponent("feedback-template-landing", {
        feedbackHomeDTO: feedbackHomeDTO
      }, self);
    };
    FeedbackModel.getFeedbackScale().then(function (data) {
      if (data.scaleResponseList) {
        self.scale(data.scaleResponseList.sort(function (a, b) {
          return a.scaleId - b.scaleId;
        }));

        for (var k = 0; k < self.scale().length; k++) {
          if (self.scale()[k].scaleType === undefined) {
            self.scale()[k] = self.noValue();
          }
        }
        FeedbackModel.getScaleSVGPath().then(function(item){
          Promise.all([FeedbackModel.getFeedbackScaleImage(self.scale()[0].contentId.value),
          FeedbackModel.getFeedbackScaleImage(self.scale()[1].contentId.value),
          FeedbackModel.getFeedbackScaleImage(self.scale()[2].contentId.value)]).then(function (values) {
            values.forEach(function(value, index){
              var scaleIndex = 0;
              if(value.contentDTOList[0].title === "star.svg"){
                scaleIndex = 0;
              }
              if(value.contentDTOList[0].title === "heart-fill.svg"){
                scaleIndex = 1;
              }
              if(value.contentDTOList[0].title === "thumbs-up.svg"){
                scaleIndex = 2;
              }
              self.scale()[index].dataContent = item.scaleSVG[scaleIndex].value;
            });
            self.scaleLoaded(true);
          });
        });
      }
    });
    self.showConfigFeedbackScreen = function () {
      params.baseModel.registerComponent("feedback-question-configurations", "feedback");
      params.dashboard.loadComponent("feedback-question-configurations", {}, self);
    };
  };
});
