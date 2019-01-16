define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/comment-box",
  "ojs/ojinputtext"
], function(oj, ko, $, Constants, locale) {
  "use strict";
  return function(params) {
    var self = this;

    self.locale = locale;
    self.comment = params.comment;
    self.label = params.label;
    self.rootId = params.rootId;
    self.required = params.required;
    self.commentVar = ko.observable("");
    self.validationTracker = params.validator;
    var validator = params.baseModel.getValidator("COMMENTS");
    for (var i = 0; i < validator.length; i++) {
      if (validator[i].type === "length") {
        self.maxlength = validator[i].options.max;
      }
    }
    self.disclaimer = ko.observable(params.baseModel.format(self.locale.charactersLeft, {
      number: (self.maxlength)
    }));
    if (ko.utils.unwrapObservable(this.comment) !== null) {
      self.commentVar(ko.utils.unwrapObservable(this.comment));
    }
    var subscriptions = self.comment.subscribe(function(newValue) {
      var availableLength = self.maxlength - newValue.length;
      if(availableLength < 0){
          self.disclaimer("");
      }else{
        self.disclaimer(params.baseModel.format(self.locale.charactersLeft, {
          number: (self.maxlength - newValue.length)
        }));
      }

      if (newValue === "") {
        self.commentVar("");
      }
    }, self);

    if (!self.commentVar()) {
      self.commentVar("");
    }
    self.elementHasFocus = ko.observable(true);
    self.comments = ko.computed(function() {
      if (!self.elementHasFocus()) {
        if (params.baseModel.showComponentValidationErrors(self.validationTracker())) {
          self.comment(self.commentVar());
        }
      }
    });
    self.dispose = function() {
      self.comments.dispose();
      subscriptions.dispose();
    };
    self.getTemplate = function() {
      if (Constants.module === "WALLET" && Constants.userSegment !== "ADMIN") {
        return "walletTemplate";
      }
      return "templateDefault";
    };
  };
});
