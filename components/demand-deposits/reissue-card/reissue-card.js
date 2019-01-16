define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",
  "ojL10n!resources/nls/reissue-card",
  "ojs/ojinputtext",
  "ojs/ojradioset"
], function(oj, ko, $, BaseLogger, ReIssueCardModel, ResourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    /**
     * var getNewKoModel - description
     *
     * @return {type}  description
     */
    var getNewKoModel = function() {
      var KoModel = ReIssueCardModel.getNewModel();
      return KoModel;
    };
    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.dataLoaded = ko.observable(false);
    self.accountId = self.accountId ? ko.observable(self.accountId) : ko.observable(self.params.accountId.value);
    self.currentCardNo = self.currentCardNo ? ko.observable(self.currentCardNo) : ko.observable(self.params.cardNo.value);
    self.reviewEnable = ko.observable(false);
    self.srNo = ko.observable();
    self.replaceCardPayload = getNewKoModel().replaceModel;
    self.addressDetails = self.previousState && self.previousState.addressDetails ? self.previousState.addressDetails : ko.mapping.fromJS(getNewKoModel().addressDetails);
    self.debitCardDetailsObject = self.debitCardDetailsObject ? self.debitCardDetailsObject : ko.observable(self.params);
    Params.baseModel.registerElement("address");
    Params.baseModel.registerComponent("review-reissue-card", "demand-deposits");
    Params.dashboard.headerName(self.resource.reissueDebitCard);
    self.dataLoaded(true);
    self.review = function() {
      self.common = self.resource;
      var context = {};
      context.mode = "REVIEW";
      context.addressDetails = self.addressDetails;
      context.accountId = self.accountId();
      context.cardNo = self.currentCardNo();
      context.debitCardDetailsObject = self.debitCardDetailsObject();
      Params.dashboard.loadComponent("review-reissue-card", context, self);
    };
    self.showFloatingPanel = function() {
      $("#panelDebitCard2").trigger("openFloatingPanel");
    };
  };
});
