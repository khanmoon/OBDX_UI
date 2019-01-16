define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/beta/resources/nls/account-holder",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, AccountHolderModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      AccountHolderModel = new AccountHolderModelObject(),
      batchRequestData = {
        batchDetailRequestList: []
      },
      getNewKoModel = function() {
        var KoModel = AccountHolderModel.getNewModel();
        KoModel.answer = ko.observable("");
        return KoModel;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.applicantObject = ko.observable(rootParams.applicantObject);
    self.cardTypeList = ko.observableArray();
    self.cardTypeListLoaded = ko.observable(false);
    self.isMultipleStatesUseofATM = ko.observable(false);
    self.embossNamelength = ko.observable();
    self.cardDesignList = ko.observableArray();
    self.existingAccountConfig = ko.observable();
    self.existingAccountConfigLoaded = ko.observable(false);
    self.existingDebitPreferences = ko.observable(false);
    self.cardType = ko.observable();
    self.cardTypeLoaded = ko.observable(false);
    self.batchRequestList = ko.observableArray([]);
    self.questionsList = ko.observableArray([]);
    self.answerDataType = ko.observableArray([]);
    self.dialogTitle = ko.observable("");
    self.dialogMessage = ko.observable("");
    self.applicantDocuments = ko.observable("");
    self.checkListId = "";
    self.validationTracker = ko.observable();
    self.documentChecklist = ko.observableArray();
    rootParams.baseModel.registerElement("file-input");
    self.showActivityProfile = ko.observable(false);
    self.showDebitCardConfig = ko.observable(false);
    self.selectedCard = ko.observable();
    self.cardDesignLoaded = ko.observable(false);
    self.productGroupErrorImage = ko.observable();
    self.cardImage = ko.observable();
    self.isDocumentName = ko.observable(false);
    self.multipleATMs = ko.observable("OPTION_NO");
    self.answerList = ko.observableArray([]);
    self.validateNumber = ko.pureComputed(function() {
      return [{
        type: "regExp",
        options: {
          pattern: "[0-9]{1,4}",
          messageDetail: self.resource.messages.validNumber
        }
      }];
    });

    self.initializeModel = function() {
      AccountHolderModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);
      AccountHolderModel.getCardDesignList().done(function(data) {
        self.cardDesignList(ko.mapping.toJS(ko.mapping.fromJS(data.enumRepresentations[0].data)));
        AccountHolderModel.getExistingAccountConfig(self.productDetails().submissionId.value, self.applicantObject().applicantId().value).then(function(data) {
          if (data.accountConfigDTO) {
            self.existingAccountConfig(data.accountConfigDTO);
            if (self.productDetails().offers.offerAdditionalDetails.questionSetDTOs) {
              if (self.existingAccountConfig().activityProfileRequestDTO) {
                if (!self.applicantObject().accountHolder) {
                  self.applicantObject().accountHolder = getNewKoModel();
                }
                for (var i = 0; i < self.existingAccountConfig().activityProfileRequestDTO.activityProfileDetails.activityProfileQuestionList.length; i++) {
                  self.questionsList.push(self.existingAccountConfig().activityProfileRequestDTO.activityProfileDetails.activityProfileQuestionList[i]);
                  self.answerList()[i] = self.existingAccountConfig().activityProfileRequestDTO.activityProfileDetails.activityProfileQuestionList[i].answer;
                  if (self.existingAccountConfig().activityProfileRequestDTO.activityProfileDetails.activityProfileQuestionList[i].answerDataType === "BOOLEAN") {
                    if (self.existingAccountConfig().activityProfileRequestDTO.activityProfileDetails.activityProfileQuestionList[i].answer) {
                      self.answerList()[i] = true;
                      self.multipleATMs("OPTION_YES");
                    } else {
                      self.answerList()[i] = false;
                      self.multipleATMs("OPTION_NO");
                    }
                  }
                }
              }
              self.showActivityProfile(true);
              self.applicantObject().accountHolder.questionsList = self.questionsList;
            }
            if (self.productDetails().offers.offerAdditionalDetails.debitCardParameter && self.existingAccountConfig().accountHolderPreferenceDTO) {
              AccountHolderModel.getCardTypeList(self.productDetails().submissionId.value, self.applicantObject().applicantId().value).then(function(data) {
                self.cardTypeList(data.debitCardFeatureList);
                self.cardType(data.debitCardFeatureList[0].cardType);
                self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[0].selectedValues.cardType = data.debitCardFeatureList[0].cardType;
                if (self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[1]) {
                  self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[1].selectedValues.cardType = data.debitCardFeatureList[0].cardType;
                }
                self.cardTypeLoaded(true);
                $("#cardName1").attr("maxlength", data.debitCardFeatureList[0].maxLengthToEmboss);
                self.cardTypeListLoaded(true);
                for (var j = 0; j < self.existingAccountConfig().accountHolderPreferenceDTO.length; j++) {
                  if (self.existingAccountConfig().accountHolderPreferenceDTO[j].productIdent) {
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].temp_isDocumentName = ko.observable(false);
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].temp_cardType = ko.observable("");
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].temp_cardImage = ko.observable("");
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].temp_ApplicantId = self.applicantDetails()[j].applicantId().value;
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].temp_ApplicantName = rootParams.baseModel.format(self.resource.generic.common.name, {
                      firstName: self.applicantDetails()[j].primaryInfo.primaryInfo.firstName(),
                      lastName: self.applicantDetails()[j].primaryInfo.primaryInfo.lastName()
                    });
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].embossName = self.existingAccountConfig().accountHolderPreferenceDTO[j].embossName;
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].productIdent = self.existingAccountConfig().accountHolderPreferenceDTO[j].productIdent;
                    if (self.existingAccountConfig().accountHolderPreferenceDTO[j].documentId && self.existingAccountConfig().accountHolderPreferenceDTO[j].documentId.value) {
                      self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].documentId.value = self.existingAccountConfig().accountHolderPreferenceDTO[j].documentId.value;
                      self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].documentContentRefId.value = self.existingAccountConfig().accountHolderPreferenceDTO[j].documentContentRefId.value;
                      AccountHolderModel.getDocumentInfo(self.existingAccountConfig().accountHolderPreferenceDTO[j].documentId.value, j).done(function(data, index) {
                        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].selectedValues.documentName = data.contentDTOList[0].title;
                        ko.tasks.runEarly();
                        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].temp_isDocumentName(true);
                      });
                    }
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].temp_ApplicantId = self.applicantDetails()[j].applicantId().value;
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].backGroundImg = self.existingAccountConfig().accountHolderPreferenceDTO[j].backGroundImg;
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].selectedValues.cardDesign = rootParams.baseModel.getDescriptionFromCode(self.cardDesignList(), self.existingAccountConfig().accountHolderPreferenceDTO[j].backGroundImg);
                    var cardtype = "";
                    for (var f = 0; f < self.cardTypeList().length; f++) {
                      if (self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].productIdent === self.cardTypeList()[f].debitCardFeatureId) {
                        cardtype = self.cardTypeList()[f].cardType;
                        break;
                      }
                    }
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].temp_cardType(cardtype);
                    self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].temp_cardImage(self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].temp_cardType() + "_" + rootParams.baseModel.getDescriptionFromCode(self.cardDesignList(), self.existingAccountConfig().accountHolderPreferenceDTO[j].backGroundImg));
                    if (self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].temp_cardImage()) {
                      self.cardDesignLoaded(true);
                    }
                  }
                }
                self.existingAccountConfigLoaded(true);
              });
              self.showDebitCardConfig(true);
            }
          }
          self.existingDebitPreferences(true);
          if (!(self.showDebitCardConfig() || self.showActivityProfile()) && !self.productDetails().sectionBeingEdited()) {
            self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
          }
        });
      });
    };
    self.initializeModel();
    if (!self.applicantObject().accountHolder) {
      self.applicantObject().accountHolder = getNewKoModel();
      var cardReq = {
        productIdent: "",
        cardDesign: "",
        embossName: "",
        backGroundImg: "",
        documentId: {
          value: ""
        },
        documentContentRefId: {
          value: ""
        },
        selectedValues: {
          cardType: "",
          cardDesign: "",
          documentName: ""
        },
        temp_isDocumentName: "",
        temp_ApplicantId: "",
        temp_cardType: "",
        temp_cardImage: "",
        temp_ApplicantName: ""
      };
      for (var k = 0; k < self.applicantDetails().length; k++) {
        if (k !== 0) {
          self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO.push(cardReq);
        }
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[k].temp_ApplicantId = self.applicantDetails()[k].applicantId().value;
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[k].temp_isDocumentName = ko.observable(false);
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[k].temp_cardType = ko.observable("");
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[k].temp_cardImage = ko.observable("");
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[k].temp_ApplicantName = rootParams.baseModel.format(self.resource.generic.common.name, {
          firstName: self.applicantDetails()[k].primaryInfo.primaryInfo.firstName(),
          lastName: self.applicantDetails()[k].primaryInfo.primaryInfo.lastName()
        });
      }
    }
    self.savemultipleATMs = function(index, event) {
      if (event.detail.value === "OPTION_NO") {
        self.answerList()[index] = false;
      }
      if (event.detail.value === "OPTION_YES") {
        self.answerList()[index] = true;
      }
    };
    self.changeCardType = function(index, event) {
      if (event.detail.value) {
        if (event.detail.value.length > 0) {
          ko.tasks.runEarly();
          self.cardTypeLoaded(true);
        } else {
          self.cardTypeLoaded(false);
        }
        var cardtype = "";
        for (var i = 0; i < self.cardTypeList().length; i++) {
          if (event.detail.value === self.cardTypeList()[i].debitCardFeatureId) {
            cardtype = self.cardTypeList()[i].cardType;
            break;
          }
        }
        self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].temp_cardType(cardtype);
      }
    };
    self.changeCardDesign = function(index, event) {
      if (event.detail.value) {
        if (self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].temp_cardType() === "VISA" || self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].temp_cardType() === "MASTER_CARD") {
          if (event.detail.value === "C5410") {
            self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].temp_cardImage(self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].temp_cardType() + "_" + rootParams.baseModel.getDescriptionFromCode(self.cardDesignList(), event.detail.value));
          } else if (event.detail.value === "C54P4") {
            self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].temp_cardImage(self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].temp_cardType() + "_" + rootParams.baseModel.getDescriptionFromCode(self.cardDesignList(), event.detail.value));
          } else if (event.detail.value === "C54P5") {
            self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].temp_cardImage(self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].temp_cardType() + "_" + rootParams.baseModel.getDescriptionFromCode(self.cardDesignList(), event.detail.value));
          }
        } else {
          self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].temp_cardImage("default");
        }
        self.cardDesignLoaded(true);
      }
    };
    self.saveAccountHolderInfo = function() {
      var tracker = document.getElementById("tracker");
      if (tracker===null || tracker.valid === "valid")
      {
        if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      self.batchRequestList([]);
      batchRequestData.batchDetailRequestList = [];
      self.applicantObject().accountHolder.savingsHolderConfiguration.partyId.value = self.applicantObject().applicantId().value;
      self.applicantObject().accountHolder.savingsHolderConfiguration.offerId = self.productDetails().offers.offerId;
      self.applicantObject().accountHolder.savingsHolderConfiguration.productGroupSerialNumber = self.productDetails().requirements.productGroupSerialNumber;
      self.applicantObject().accountHolder.savingsHolderConfiguration.submissionId = self.productDetails().submissionId.value;
      self.applicantObject().accountHolder.savingsHolderConfiguration.offerCurrency = self.productDetails().requirements.currency;
      self.applicantObject().accountHolder.savingsHolderConfiguration.accountTitle = ko.utils.unwrapObservable(self.applicantObject().primaryInfo.primaryInfo.firstName);
      if (self.showActivityProfile()) {
        for (var i = 0; i < self.questionsList().length; i++) {
          self.applicantObject().accountHolder.savingsHolderConfiguration.activityProfileRequestDTO.activityProfileDetails.activityProfileQuestionList.push(getNewKoModel().savingsHolderConfiguration.activityProfileRequestDTO.activityProfileDetails.activityProfileQuestionList[0]);
          self.applicantObject().accountHolder.savingsHolderConfiguration.activityProfileRequestDTO.activityProfileDetails.activityProfileQuestionList[i].answer = self.answerList()[i];
          self.applicantObject().accountHolder.savingsHolderConfiguration.activityProfileRequestDTO.activityProfileDetails.activityProfileQuestionList[i].questionId = self.questionsList()[i].questionId;
          self.applicantObject().accountHolder.savingsHolderConfiguration.activityProfileRequestDTO.activityProfileDetails.activityProfileQuestionList[i].answerDataType = self.questionsList()[i].answerDataType;
        }
        self.applicantObject().accountHolder.savingsHolderConfiguration.activityProfileRequestDTO.activityProfileDetails.activityProfileQuestionList.splice(-1, 1);
      }
      if (self.showDebitCardConfig()) {
        for (var j = 0; j < self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO.length; j++) {
          self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].cardDesign = self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].productIdent;
          self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].productIdent = self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].productIdent;
          if (self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].backGroundImg) {
            self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].backGroundImg = self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].backGroundImg;
            self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].selectedValues.cardDesign = rootParams.baseModel.getDescriptionFromCode(self.cardDesignList(), self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[j].backGroundImg);
          }
        }
      }
      if (!self.showActivityProfile()) {
        delete self.applicantObject().accountHolder.savingsHolderConfiguration.activityProfileRequestDTO;
      }
      self.saveAccountConfig();
    }
      else{
  tracker.showMessages();
              tracker.focusOn("@firstInvalidShown");
      }
    };
    self.saveAccountConfig = function() {
      AccountHolderModel.saveAccountConfig(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, ko.mapping.toJSON(self.applicantObject().accountHolder.savingsHolderConfiguration, {
        "ignore": ["temp_ApplicantId", "temp_ApplicantName", "temp_cardImage", "temp_cardType", "temp_isDocumentName", "simulationId", "selectedValues"]
      })).done(function() {
        self.completeAccountHolderSection();
      });
    };
    self.downloadImage = function(index, documentContentRefId, applicantId) {
      AccountHolderModel.fetchDocumentsByteArray(documentContentRefId, applicantId);
    };
    self.uploadDocument = function(applicantIndex, index, applicantId) {
      var file = document.getElementById(applicantIndex + "-" + index + "-document-upload").files[0];
      var selectedDocumenttypeId = self.resource.docTypeIdForImageUpload;
      var selectedDocumentNature = "OPTIONAL";
      var selectedOwnerId = applicantId;
      if (file === undefined) {
        self.dialogTitle(self.resource.error);
        self.dialogMessage(self.resource.noFile);
        self.handleOpen();
      } else {
        AccountHolderModel.uploadDocument(file, selectedDocumenttypeId, selectedDocumentNature, selectedOwnerId, index, self.documentUploadSuccessHandler, self.errorHandler);
      }
    };
    self.documentUploadSuccessHandler = function(data, index, ownerId) {
      self.dialogTitle(self.resource.success);
      self.dialogMessage(self.resource.successMessage);
      self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].documentId.value = data.contentDTOList[0].documentId.value;
      self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].documentContentRefId.value = data.contentDTOList[0].contentId.value;
      self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].temp_isDocumentName(false);
      if (self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].documentId.value) {
        AccountHolderModel.getDocumentInfo(self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].documentId.value, index, ownerId).done(function(data, index) {
          self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].selectedValues.documentName = data.contentDTOList[0].title;
          ko.tasks.runEarly();
          self.applicantObject().accountHolder.savingsHolderConfiguration.accountHolderPreferenceDTO[index].temp_isDocumentName(true);
        });
      }
      self.handleOpen();
    };
    self.errorHandler = function() {
      self.dialogTitle(self.resource.error);
      self.dialogMessage(self.resource.errorContacting);
      self.handleOpen();
    };
    self.handleOpen = function() {
      $("#dialog").ojDialog("open");
    };
    self.completeAccountHolderSection = function() {
      self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
    };
  };
});
