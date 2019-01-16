define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/alpha/resources/nls/card-preferences",
  "ojs/ojselectcombobox",
  "ojs/ojfilmstrip",
  "ojs/ojinputtext"
], function(oj, ko, $, CardPreferencesModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      CardPreferencesModel = new CardPreferencesModelObject(),
      getNewKoModel = function(modelData) {
        var KoModel = CardPreferencesModel.getNewModel(modelData);
        KoModel.cardHolderPreferences.selectedValues = ko.observable(KoModel.cardHolderPreferences.selectedValues);
        KoModel.cardHolderPreferences.selectedValues().temp_isSaved = ko.observable(false);
        return KoModel;
      };
    ko.utils.extend(self, rootParams.rootModel);
    rootParams.baseModel.registerElement("file-input");
    self.resource = resourceBundle;
    self.backGroundContentIds = ko.observableArray("");
    self.backGroundContentIdsLoaded = ko.observable(false);
    self.cardDesignLoaded = ko.observable(false);
    self.cardHolderPreferencesLoaded = ko.observable(false);
    self.validationTracker = ko.observable();
    rootParams.baseModel.registerComponent("card-holder-preferences", "application-tracking");
    if (self.offerDetails.offerDetails[0].offerAdditionalDetails.cardOfferDetails.standardFeature.backGroundContentId.length > 0) {
      var payLoad = {
        backGroundContentIds: self.offerDetails.offerDetails[0].offerAdditionalDetails.cardOfferDetails.standardFeature.backGroundContentId
      };
      CardPreferencesModel.fetchBgContentIds(self.applicationInfo().currentSubmissionId(), payLoad).done(function(data) {
        if (data.backGroundContentDTOs) {
          self.backGroundContentIds(data.backGroundContentDTOs);
          self.backGroundContentIdsLoaded(true);
        }
        self.primaryCardHolder().holderPreferences = getNewKoModel();
        self.primaryCardHolder().holderPreferences.cardHolderPreferences.applicantRelationshipType = "APPLICANT";
        self.primaryCardHolder().holderPreferences.cardHolderPreferences.partyId.value = self.primaryCardHolder().applicantId.value;
        for (var k = 0; k < self.addOnHolders().length; k++) {
          self.addOnHolders()[k].holderPreferences = getNewKoModel();
          self.addOnHolders()[k].holderPreferences.cardHolderPreferences.applicantRelationshipType = "ADDON_CARDHOLDER";
          self.addOnHolders()[k].holderPreferences.cardHolderPreferences.partyId.value = self.addOnHolders()[k].applicantId.value;
        }
        CardPreferencesModel.fetchCardHolderPreferences(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function(data) {
          if (data.creditCardHolderPreferencesDTO) {
            for (var i = 0; i < data.creditCardHolderPreferencesDTO.length; i++) {
              if (data.creditCardHolderPreferencesDTO[i].applicantRelationshipType === "APPLICANT") {
                self.primaryCardHolder().holderPreferences = getNewKoModel(data.creditCardHolderPreferencesDTO[i]);
              } else if (data.creditCardHolderPreferencesDTO[i].applicantRelationshipType === "ADDON_CARDHOLDER") {
                for (var j = 0; j < self.addOnHolders().length; j++) {
                  if (self.addOnHolders()[j].applicantId.value === data.creditCardHolderPreferencesDTO[i].partyId.value) {
                    self.addOnHolders()[j].holderPreferences = getNewKoModel(data.creditCardHolderPreferencesDTO[i]);
                    self.addOnHolders()[j].holderPreferences.cardHolderPreferences.selectedValues().temp_isSaved(data.creditCardHolderPreferencesDTO[i].isUserSpecifiedEmbossName);
                    break;
                  }
                }
              }
            }
          }
          self.cardHolderPreferencesLoaded(true);
        });
      });
    }
    self.deleteHolderPreferences = function(index) {
      self.addOnHolders()[index].holderPreferences.cardHolderPreferences.cardBackgroundId = null;
      self.addOnHolders()[index].holderPreferences.cardHolderPreferences.embossName = null;
      self.addOnHolders()[index].holderPreferences.cardHolderPreferences.isUserSpecifiedEmbossName = false;
      self.addOnHolders()[index].holderPreferences.cardHolderPreferences.companionCardBackgroundId = null;
      self.addOnHolders()[index].holderPreferences.cardHolderPreferences.documentId.value = null;
      self.addOnHolders()[index].holderPreferences.cardHolderPreferences.externalReferenceId.value = null;
      self.addOnHolders()[index].holderPreferences.cardHolderPreferences.selectedValues().cardImage = null;
      self.addOnHolders()[index].holderPreferences.cardHolderPreferences.selectedValues().documentName = null;
      self.addOnHolders()[index].holderPreferences.cardHolderPreferences.selectedValues().documentInfoLoaded(false);
      var payload = ko.mapping.toJSON(self.addOnHolders()[index].holderPreferences.cardHolderPreferences, {
        "ignore": ["selectedValues"]
      });
      CardPreferencesModel.updateCardHolderPreferences(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), payload).done(function() {
        self.addOnHolders()[index].showAddOnPreferences(false);
        self.addOnHolders()[index].holderPreferences.cardHolderPreferences.selectedValues().temp_isSaved(false);
      });
    };
    self.editHolderPreferences = function(index) {
      self.addOnHolders()[index].showAddOnPreferences(true);
    };
    self.expandAddOnSection = function(index) {
      self.addOnHolders()[index].showAddOnPreferences(true);
    };
    self.uploadDocument = function(data) {
      var file = document.getElementById(data.applicantId.value + "-document-upload").files[0];
      var selectedDocumenttypeId = "IMAGE_ON_CARD";
      var selectedDocumentNature = "OPTIONAL";
      var selectedOwnerId = data.applicantId.value;
      if (file === undefined) {
        self.dialogTitle(self.resource.messages.error);
        self.dialogMessage(self.resource.messages.noFile);
        self.handleOpen();
      } else {
        CardPreferencesModel.uploadDocument(file, selectedDocumenttypeId, selectedDocumentNature, selectedOwnerId).done(function() {
          self.dialogTitle(self.resource.messages.success);
          self.dialogMessage(self.resource.messages.successMessage);
        });
      }
    };
    self.updateCardPreferences = function() {
      self.uplTrackingDetails().additionalInfo.sections[0].isComplete(true);
      self.additionalInfoAccordion().open(2);
    };
  };
});
