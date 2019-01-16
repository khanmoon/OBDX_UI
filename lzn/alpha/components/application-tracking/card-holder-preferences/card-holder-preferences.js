define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/alpha/resources/nls/card-holder-preferences",
  "ojs/ojselectcombobox",
  "ojs/ojfilmstrip",
  "ojs/ojinputtext"
], function(oj, ko, $, CardPreferencesModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      cardImage, CardPreferencesModel = new CardPreferencesModelObject();
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.validationTracker = ko.observable();
    self.holderPreferences = rootParams.cardPreferences.holderPreferences;
    self.holderPreferences.cardHolderPreferences.selectedValues().documentInfoLoaded = ko.observable(false);
    if (self.holderPreferences.cardHolderPreferences.cardBackgroundId) {
      for (var i = 0; i < self.backGroundContentIds().length; i++) {
        if (self.backGroundContentIds()[i].contentId === self.holderPreferences.cardHolderPreferences.cardBackgroundId) {
          cardImage = self.backGroundContentIds()[i].contentValue;
          cardImage = "card-" + cardImage;
          cardImage = cardImage.toLowerCase();
          self.holderPreferences.cardHolderPreferences.selectedValues().cardImage = cardImage;
          self.cardDesignLoaded(true);
          break;
        }
      }
    }
    self.imageChange = function(event, data) {
      if (data.option === "value") {
        self.cardDesignLoaded(false);
        self.holderPreferences.cardHolderPreferences.cardBackgroundId = ko.utils.unwrapObservable(self.holderPreferences.cardHolderPreferences.cardBackgroundId);
        for (var i = 0; i < self.backGroundContentIds().length; i++) {
          if (self.backGroundContentIds()[i].contentId === self.holderPreferences.cardHolderPreferences.cardBackgroundId) {
            cardImage = self.backGroundContentIds()[i].contentValue;
            cardImage = "card-" + cardImage;
            cardImage = cardImage.toLowerCase();
            self.holderPreferences.cardHolderPreferences.selectedValues().cardImage = cardImage;
            break;
          }
        }
        ko.tasks.runEarly();
        self.cardDesignLoaded(true);
      }
    };
    self.downloadImage = function() {
      CardPreferencesModel.fetchDocumentsByteArray(self.holderPreferences.cardHolderPreferences.externalReferenceId.value, self.holderPreferences.cardHolderPreferences.partyId.value);
    };
    self.getDocumentName = function() {
      CardPreferencesModel.getDocumentInfo(self.holderPreferences.cardHolderPreferences.documentId.value, self.holderPreferences.cardHolderPreferences.partyId.value).done(function(data) {
        self.holderPreferences.cardHolderPreferences.selectedValues().documentInfoLoaded(false);
        self.holderPreferences.cardHolderPreferences.selectedValues().documentName = data.contentDTOList[0].title;
        ko.tasks.runEarly();
        self.holderPreferences.cardHolderPreferences.selectedValues().documentInfoLoaded(true);
      });
    };
    if (self.holderPreferences.cardHolderPreferences.documentId && self.holderPreferences.cardHolderPreferences.documentId.value) {
      self.getDocumentName();
    } else {
      self.holderPreferences.cardHolderPreferences.selectedValues().documentInfoLoaded(true);
    }
    self.updateCardHolderPreferences = function(index) {
      self.holderPreferences.cardHolderPreferences.cardBackgroundId = ko.utils.unwrapObservable(self.holderPreferences.cardHolderPreferences.cardBackgroundId);
      self.holderPreferences.cardHolderPreferences.isUserSpecifiedEmbossName = true;
      var payload = ko.mapping.toJSON(self.holderPreferences.cardHolderPreferences, {
        "ignore": ["selectedValues", "temp_isSaved", "documentInfoLoaded", "documentName"]
      });
      CardPreferencesModel.updateCardHolderPreferences(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), payload).done(function() {
        if (self.holderPreferences.cardHolderPreferences.applicantRelationshipType === "ADDON_CARDHOLDER") {
          self.addOnHolders()[index].showAddOnPreferences(false);
          self.holderPreferences.cardHolderPreferences.selectedValues().temp_isSaved(true);
        }
      });
    };
    self.uploadDocument = function(data) {
      var file = document.getElementById(data.partyId.value + "-document-upload").files[0];
      var selectedDocumenttypeId = self.resource.docTypeIdForImageUpload;
      var documentCategoryId = self.resource.docTypeIdForImageUpload;
      var selectedDocumentNature = "OPTIONAL";
      var selectedOwnerId = data.partyId.value;
      var formData = new FormData();
      formData.append("file", file);
      formData.append("documentTypeId", selectedDocumenttypeId);
      formData.append("documentCategoryId", documentCategoryId);
      formData.append("documentNatureType", selectedDocumentNature);
      formData.append("ownerId", selectedOwnerId);
      formData.append("transactionType", "OR");
      formData.append("moduleIdentifier", "ORIGINATION");
      if (file) {
        CardPreferencesModel.uploadDocument(formData).done(function(data) {
          if (data.contentDTOList && data.contentDTOList.length > 0) {
            self.holderPreferences.cardHolderPreferences.externalReferenceId.value = data.contentDTOList[0].contentId.value;
            self.holderPreferences.cardHolderPreferences.documentId.value = data.contentDTOList[0].documentId.value;
            self.getDocumentName();
          }
        });
      }
    };
  };
});
