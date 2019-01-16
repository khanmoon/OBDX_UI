define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/debit-card-pin-request",
  "ojs/ojknockout",
  "ojs/ojinputnumber",
  "ojs/ojbutton"
], function(oj, ko, $, RequestPinModel, BaseLogger, resourceBundle) {
  "use strict";
  return function(Params) {
    var self = this,

    /**
     * getNewKoModel - description
     *
     * @return {type}  description
     */
    getNewKoModel = function() {
      var KoModel = RequestPinModel.getNewModel();
      return ko.mapping.fromJS(KoModel);
    };
    ko.utils.extend(self, Params.rootModel);
    self.cardObject = self.params;
    self.data = ko.observable(Params.rootModel.viewDetailsData);
    self.locale = resourceBundle;
    self.common = self.locale.common;
    self.localModeOfdelivery = ko.observable();
    self.reviewEnable = ko.observable(false);
    self.validationTracker = ko.observable();
    self.serviceId = ko.observable();
    self.loadConfirm = ko.observable(false);
    self.rootModelInstance = getNewKoModel();
    self.addressDetails = self.previousState ? self.previousState.addressDetails : self.rootModelInstance.addressDetails;
    self.payload = self.rootModelInstance.payload;
    self.accountId = self.cardObject.accountId.value;
    self.cardNo = self.cardObject.cardNo.value;
    self.srNo = ko.observable();
    self.CardDetailsData = ko.observable();
    self.debitCardDetailsObject = ko.observable(self.params);
    Params.dashboard.headerName(self.locale.compName.debitCardPinRequest);
    self.CardDetailsData(self.cardObject);
    self.reviewEnable(true);
    self.loadConfirm(false);
    self.addressDetails = self.params.addressDetails;
    self.accountId = self.params.accountId;
    self.cardNo = self.params.cardNo;
    self.reviewTransactionName = {
      header: self.locale.review,
      reviewHeader: self.locale.reviewHeader
    };
    Params.baseModel.registerElement("confirm-screen");
    Params.baseModel.registerElement("address");

    /**
     * self - description
     *
     * @return {type}  description
     */
    self.requestPin = function() {
      if (self.addressDetails.modeofDelivery === "ACC") {
        self.localModeOfdelivery("COR");
      } else {
        self.localModeOfdelivery("BRN");
      }
      self.payload.address.line1(self.addressDetails.postalAddress.line1);
      self.payload.address.line2(self.addressDetails.postalAddress.line2);
      self.payload.address.line3(self.addressDetails.postalAddress.line3);
      self.payload.address.line4(self.addressDetails.postalAddress.line4);
      self.payload.address.city(self.addressDetails.postalAddress.city);
      self.payload.address.state(self.addressDetails.postalAddress.state);
      self.payload.address.country(self.addressDetails.postalAddress.country);
      self.payload.deliveryOption(self.localModeOfdelivery());
      RequestPinModel.requestPin(self.accountId, self.cardNo, ko.toJSON(self.payload)).done(function(data, status, jqXhr) {
        if (data.serviceId) {
          self.srNo(data.serviceId);
          self.reviewEnable(false);
          self.loadConfirm(true);
          Params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            sr: true,
            transactionName: self.locale.pinRequest.transactionName,
            serviceNo: data.serviceId,
            flagPinRequest: true,
            resourceBundle: self.locale,
            srNo: self.srNo(),
            confirmScreenExtensions: {
              isSet: true,
              template: "confirm-screen/casa-template",
              taskCode: "CH_N_RDCP"
            }
          }, self);
        }
      });
    };

    /**
     * self - description
     *
     * @return {type}  description
     */
    self.redirect = function() {
      window.location.href = "demand-deposits.html";
    };
  };
});
