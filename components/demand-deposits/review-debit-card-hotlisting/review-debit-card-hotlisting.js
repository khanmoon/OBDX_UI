define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/debit-card-hotlisting",
  "ojs/ojknockout",
  "ojs/ojselectcombobox",
  "ojs/ojradioset"
], function(oj, ko, $, HotlistModel, BaseLogger, locale) {
  "use strict";
  return function(Params) {
    var self = this,

    /**
     * getNewKoModel - description
     *
     * @return {type}  description
     */
    getNewKoModel = function() {
      var KoModel = HotlistModel.getNewModel();
      return ko.mapping.fromJS(KoModel);
    },
    selectedValueArray;
    ko.utils.extend(self, Params.rootModel);
    self.showAddressComponent = ko.observable(false);
    self.locale = locale;
    self.showFunction = self.loadComponent;
    self.loadConfirm = ko.observable(false);
    self.cardObject = self.params;
    self.data = self.cardObject;
    self.common = locale.common;
    Params.dashboard.headerName(self.locale.header.blockCard);
    self.replaceConfirmationType = self.replaceConfirmationType || ko.observable();
    self.addressReviewEnable = ko.observable(false);
    self.rootModelInstance = getNewKoModel();
    self.hotlistData = self.rootModelInstance.hotListModel;
    self.replaceCardPayload = self.rootModelInstance.replaceModel;
    self.addressDetails = self.addressDetails || self.rootModelInstance.addressDetails;
    self.serviceRequestNumber = ko.observable();
    self.validationTracker = ko.observable();
    self.selectedReason = self.selectedReason || ko.observable();
    self.reasonsArray = ko.observableArray();
    self.isDataLoaded = ko.observable(false);
    self.stageOne = ko.observable(true);
    self.stageTwo = ko.observable(false);
    self.stageThree = ko.observable(false);
    self.stageFour = ko.observable(false);
    self.serviceId = ko.observable();
    self.srNo = ko.observable();
    self.loadReview = ko.observable(false);
    self.reasonReview = self.reasonReview || ko.observable();
    self.currentCardNo = ko.observable();
    self.submitDisabled = ko.observable(true);
    self.accountId = ko.observable();
    self.selectBlockType = ko.observable();
    self.blockTypeList = [{
        code: "TEM",
        description: self.locale.blockType.temp
      },
      {
        code: "HOTLIST",
        description: self.locale.blockType.hotlist
      }
    ];
    self.reviewTransactionName = {
      header: self.locale.common.review,
      reviewHeader: self.locale.hotlisting.reviewHead
    };
    if (self.params.cardStatus === "ACTIVATED") {
      self.cardTypeStatus = self.locale.active;
    } else {
      self.cardTypeStatus = self.locale.inactive;
    }

    if (self.params.selectBlockType.code === "HOTLIST") {
      selectedValueArray = self.params.selectedValueArray;
      self.reasonReview(selectedValueArray[1]);
      self.replaceConfirmationType(self.params.replaceConfirmationType);
      self.addressDetails = self.params.addressDetails;
    }
    Params.dashboard.headerName(self.params.headerName);
    self.stageOne(false);
    self.loadReview(true);
    self.accountId(self.params.accountId);
    self.currentCardNo(self.params.currentCardNo);
    self.displayAccountNo = self.params.displayAccountNo;
    self.dispalyCardNo = self.cardObject.dispalyCardNo;

    Params.baseModel.registerElement("confirm-screen");
    Params.baseModel.registerElement("address");

    /**
     * self - description
     *
     * @return {type}  description
     */
    self.blockCard = function() {
      if (self.params.selectBlockType.code === "HOTLIST") {
        self.hotlistRequest();
      } else {
        self.tempBlockRequest();
      }
    };

    /**
     * self - description
     *
     * @return {type}  description
     */
    self.tempBlockRequest = function() {
      var requestdata = {
        elements: []
      };
      var elementsData = [];
      elementsData[0] = getNewKoModel().requestData;
      elementsData[0].label = "accountId";
      elementsData[0].values = [];
      elementsData[0].values[0] = self.accountId();
      elementsData[0].displayValues = [];
      elementsData[0].displayValues[0] = self.displayAccountNo;
      elementsData[0].indirectionTypes = [];
      elementsData[0].indirectionTypes[0] = self.accountId();
      elementsData[1] = getNewKoModel().requestData;
      elementsData[1].label = "cardNo";
      elementsData[1].values = [];
      elementsData[1].values[0] = self.currentCardNo();
      elementsData[1].displayValues = [];
      elementsData[1].displayValues[0] = self.dispalyCardNo;
      elementsData[1].indirectionTypes = [];
      elementsData[1].indirectionTypes[0] = self.currentCardNo();
      requestdata.elements = elementsData;
      var payload;
      self.blockDebitCardRequest = getNewKoModel().tempBlockDebitCardRequest;
      self.blockDebitCardRequest.requestType = "BLOCKED_DEBIT_CARD";
      self.blockDebitCardRequest.requestData = JSON.stringify(requestdata);
      self.blockDebitCardRequest.requestData = self.blockDebitCardRequest.requestData.replace(/"/g, "\"");
      self.blockDebitCardRequest.entityTypeIdentifier = self.currentCardNo();
      self.blockDebitCardRequest.status = "PE";
      self.blockDebitCardRequest.entityTypeIdentifierKey = "DE";
      self.blockDebitCardRequest.priorityType = "H";
      self.blockDebitCardRequest.entityType = "DE";
      self.blockDebitCardRequest.definition.id = "SRX000000021";
      payload = ko.toJSON(self.blockDebitCardRequest);
      HotlistModel.tempBlockRequest(payload).done(function(data, status, jqXhr) {
        self.loadReview(false);
        self.stageOne(false);
        self.stageTwo(!self.stageTwo());
        self.stageThree(!self.stageThree());
        self.srNo(data.serviceId);
        Params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          sr: true,
          transactionName: self.locale.hotlisting.transactionName,
          serviceNo: data.serviceId,
          srNo: self.srNo(),
          selectBlockType: {
            code: self.data.selectBlockType.code,
            description: self.data.selectBlockType.description
          },
          flagHotList: true,
          resourceBundle: locale,
          confirmScreenExtensions: {
            isSet: true,
            template: "confirm-screen/casa-template",
            taskCode: "SR_N_CRT"
          }
        }, self);
      });
    };

    /**
     * self - description
     *
     * @return {type}  description
     */
    self.reviewAddress = function() {
      if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      self.stageOne(false);
      self.stageTwo(false);
      self.stageThree(false);
      self.stageFour(false);
      self.loadReview(false);
      self.loadConfirm(false);
      self.showAddressComponent(false);
      self.addressReviewEnable(true);
      location.hash = "review";
    };

    /**
     * self - description
     *
     * @return {type}  description
     */
    self.cancel = function() {
      self.addressReviewEnable(false);
      self.showAddressComponent(true);
    };

    /**
     * self - description
     *
     * @param  {type} blockResponse description
     * @return {type}               description
     */
    self.createReplaceCardRequest = function(blockResponse) {
      if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
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
      var payload = ko.mapping.toJSON(self.replaceCardPayload);
      HotlistModel.createReplaceCard(payload, self.accountId(), self.currentCardNo()).done(function(response, status, jqXhr) {
        self.addressReviewEnable(false);
        self.loadConfirm(true);
        Params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.locale.hotlisting.transactionName,
          serviceNos: {
            items: [{
                label: Params.baseModel.format(self.locale.hotlisting.srMessage, {
                  txn: self.locale.header.blockCard
                }),
                value: blockResponse.serviceId
              },
              {
                label: Params.baseModel.format(self.locale.hotlisting.srMessage, {
                  txn: self.locale.hotlisting.replacementCard
                }),
                value: response.serviceId
              }
            ]
          },
          selectBlockType: {
            code: self.data.selectBlockType.code,
            description: self.data.selectBlockType.description
          },
          srNo: self.srNo(),
          reasonReview: self.reasonReview(),
          addressDetails: self.addressDetails,
          flagHotList: true,
          confirmScreenExtensions: {
            isSet: true,
            template: "confirm-screen/casa-template",
            taskCode: "CH_N_RLDC"
          },
          replaceConfirmationType: self.replaceConfirmationType()
        }, self);
      });
    };

    /**
     * self - description
     *
     * @return {type}  description
     */
    self.hotlistRequest = function() {
      self.hotlistData.statusUpdateReason.hotlistReason(selectedValueArray[0]);
      var payload = ko.mapping.toJSON(self.hotlistData.statusUpdateReason.hotlistReason()).replace(/"/g, "");
      HotlistModel.hotlistRequest(payload, self.accountId(), self.currentCardNo()).done(function(data1, status, jqXhr) {
        self.loadReview(false);
        self.stageOne(false);
        self.stageTwo(!self.stageTwo());
        self.stageThree(!self.stageThree());
        if (self.replaceConfirmationType() === "OPTION_YES")
          self.createReplaceCardRequest(data1);
        else {
          self.srNo(data1.serviceId);
          Params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            sr: true,
            transactionName: self.locale.hotlisting.transactionName,
            serviceNo: data1.serviceId,
            srNo: self.srNo(),
            selectBlockType: {
              code: self.data.selectBlockType.code,
              description: self.data.selectBlockType.description
            },
            reasonReview: self.reasonReview(),
            addressDetails: self.addressDetails,
            flagHotList: true,
            replaceConfirmationType: self.replaceConfirmationType(),
            confirmScreenExtensions: {
              isSet: true,
              template: "confirm-screen/casa-template",
              taskCode: "CH_N_BDC"
            }
          }, self);
        }
      });
    };
    HotlistModel.fetchHotlistReasons().done(function(data) {
      for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.reasonsArray.push({
          description: data.enumRepresentations[0].data[i].description,
          code: data.enumRepresentations[0].data[i].code
        });
      }
      self.isDataLoaded(true);
    });

    /**
     * self - description
     *
     * @return {type}  description
     */
    self.requestNewCard = function() {
      self.stageTwo(false);
      self.stageOne(false);
      self.stageThree(false);
      self.showAddressComponent(true);
    };

    /**
     * self - description
     *
     * @return {type}  description
     */
    self.redirect = function() {
      window.location.href = "demand-deposits.html";
    };

    /**
     * self - description
     *
     * @return {type}  description
     */
    self.ok = function() {
      self.stageOne(false);
      self.stageTwo(false);
      self.stageThree(false);
      self.stageFour(false);
      self.loadReview(false);
      self.loadConfirm(false);
      self.showAddressComponent(false);
      self.addressReviewEnable(false);
      history.back();
    };
  };
});
