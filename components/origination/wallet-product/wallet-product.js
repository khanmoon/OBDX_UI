define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojs/ojknockout-validation"
], function(oj, ko, $, walletProductModel) {
  "use strict";

  return function(rootParams) {
    /**
     * Instantiating logger
     *
     * @private
     */
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.productCurrentStage = ko.observable();
    self.currentIndex = ko.observable(0);
    self.stages = ko.observableArray();
    self.isDataLoaded = ko.observable(false);
    self.label = ko.observable();
    self.isBackAllowed = ko.observable(false);
    rootParams.baseModel.registerComponent("wallet-header", "origination");
    rootParams.baseModel.registerElement("page-section");
    walletProductModel.fetchFlow().done(function(data) {
      self.stages(data.productDetails.productStages);
      self.productCurrentStage(self.stages()[0].id);
      rootParams.baseModel.registerComponent(self.stages()[self.currentIndex()].id, "origination");
      self.isDataLoaded(true);
    });
    self.getCurrentStage = function() {
      return self.stages[self.currentIndex()].id;
    };
    self.getNextStage = function() {
      $("se-pre-con").show();
      self.isBackAllowed(true);
      self.isDataLoaded(false);
      var nextIndex = self.currentIndex() + 1;
      if (nextIndex < self.stages().length) {
        if (nextIndex === self.stages().length - 1) {
          self.isBackAllowed(false);
        }
        self.currentIndex(nextIndex);
        self.productCurrentStage(self.stages()[self.currentIndex()].id);
        rootParams.baseModel.registerComponent(self.stages()[self.currentIndex()].id, "origination");
        location.hash = self.stages()[self.currentIndex()].id;
      }
      self.isDataLoaded(true);
      $("se-pre-con").fadeOut("slow");
    };
    self.showDashboard = function() {
      window.location = "wallet-signup.html";
    };
    self.previousStage = function() {
      $("se-pre-con").show();
      self.isDataLoaded(false);
      var prevIndex = self.currentIndex() - 1;
      if (prevIndex >= 0) {
        if (prevIndex === 0) {
          self.isBackAllowed(false);
        }
        if (prevIndex < self.stages().length) {
          self.currentIndex(prevIndex);
          self.productCurrentStage(self.stages()[self.currentIndex()].id);
        }
        location.hash = self.stages()[self.currentIndex()].id;
      }
      self.isDataLoaded(true);
      $("se-pre-con").fadeOut("slow");
    };
    $(window).on("hashchange", function() {
      if (location.hash !== "#" + self.stages()[self.currentIndex()].id) {
        self.previousStage();
      }
    });
  };
});
