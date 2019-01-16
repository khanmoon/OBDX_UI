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
    self.reviewEnable = ko.observable(false);
    self.srNo = ko.observable();
    self.replaceCardPayload = getNewKoModel().replaceModel;
    Params.baseModel.registerElement("address");
    Params.dashboard.headerName(self.resource.reissueDebitCard);
    self.addressDetails = self.params.addressDetails;
    self.accountId(self.params.accountId);
    self.currentCardNo(self.params.cardNo);
    self.dataLoaded(true);

    self.reviewTransactionName = {
      header: self.resource.reviewHeading,
      reviewHeader: self.resource.reviewHeading1
    };

    /**
     * self - description
     *
     * @return {type}  description
     */
    self.submit = function() {
      self.replaceCardPayload.address.city = self.addressDetails.city;
      self.replaceCardPayload.address.state = self.addressDetails.postalAddress.state;
      self.replaceCardPayload.address.country = self.addressDetails.postalAddress.country;
      self.replaceCardPayload.address.zipCode = self.addressDetails.zipCode;
      self.replaceCardPayload.address.line1 = self.addressDetails.postalAddress.line1;
      self.replaceCardPayload.address.line2 = self.addressDetails.postalAddress.line2;
      self.replaceCardPayload.address.line3 = self.addressDetails.postalAddress.line3;
      self.replaceCardPayload.address.line4 = self.addressDetails.postalAddress.line4;
      self.replaceCardPayload.address.zipCode = self.addressDetails.postalAddress.zipCode;
      if (self.addressDetails.modeofDelivery() === "ACC") {
        self.replaceCardPayload.deliveryOption = "COR";
      } else {
        self.replaceCardPayload.deliveryOption = self.addressDetails.modeofDelivery();
      }
      ReIssueCardModel.createReplaceCard(ko.toJSON(self.replaceCardPayload), self.accountId(), self.currentCardNo()).done(function(data, status, jqXhr) {
        if (data.serviceId) {
          self.srNo(data.serviceId);
          Params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            sr: true,
            transactionName: self.resource.transactionName,
            flagReissueCard: true,
            serviceNo: data.serviceId,
            srNo: self.srNo(),
            addressDetails: self.addressDetails,
            confirmScreenExtensions: {
              isSet: true,
              template: "confirm-screen/casa-template",
              taskCode: "CH_N_RLDC"
            }
          }, self);
        }
      });
    };
  };
});
