define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/compliance",
  "ojL10n!resources/nls/compliance-entity",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function(oj, ko, $, ReviewFatcaComplianceModel, BaseLogger, ResourceBundle, ResourceBundleEntity) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.entityResource = ResourceBundleEntity;
    if (self.formType === "INDIVIDUAL") {
      Params.dashboard.headerName(self.resource.fatcaHeader);
    } else if (self.formType === "ENTITY") {
      Params.dashboard.headerName(self.entityResource.fatcaHeader);
    }
    Params.baseModel.registerComponent("fatca-compliance", "compliance");
    Params.baseModel.registerElement("confirm-screen");

    var getSuccessMessage = function() {
      return self.resource.confirmationSuccessMessage;
    };

    self.editSection = function(sectionId) {
      self.sectionBeingEdited(sectionId);
      self.backFromReview = ko.observable(true);
      if (self.formType === "ENTITY") {
        Params.dashboard.loadComponent("entity-fatca-compliance", {}, self);
      }
      if (self.formType === "INDIVIDUAL") {
        Params.dashboard.loadComponent("fatca-compliance", {}, self);
      }
    };

    /**
     * this function is called on the click of confirm button to post fatca compliance data to the server
     *
     * @return {void}  description
     */
    self.confirmFatcaCompliance = function() {
      if (self.formType === "INDIVIDUAL") {
        self.fatcaComplianceData.kycInfo.grossAnnualIncome = Number(self.fatcaComplianceData.kycInfo.grossAnnualIncome);
        self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity((self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity() === "true"));
        self.fatcaComplianceData.taxResidencyInfoDTO.domesticTaxResident((self.fatcaComplianceData.taxResidencyInfoDTO.domesticTaxResident() === "true"));
        self.fatcaComplianceData.taxResidencyInfoDTO.usCitizen((self.fatcaComplianceData.taxResidencyInfoDTO.usCitizen() === "true"));
        self.fatcaComplianceData.taxResidencyInfoDTO.sptStatus((self.fatcaComplianceData.taxResidencyInfoDTO.sptStatus() === "true"));
        self.fatcaComplianceData.taxResidencyInfoDTO.usGreenCardOwner((self.fatcaComplianceData.taxResidencyInfoDTO.usGreenCardOwner() === "true"));
        self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable((self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable() === "true"));
      }
      if (self.formType === "ENTITY") {
        self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity((self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity() === "true"));
        self.fatcaComplianceData.taxResidencyInfoDTO.usIncorporatedEntity((self.fatcaComplianceData.taxResidencyInfoDTO.usIncorporatedEntity() === "true"));
        self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticBenificialOwners((self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticBenificialOwners() === "true"));
        self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable((self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable() === "true"));
        self.fatcaComplianceData.entityCertification.entityFinancialInstitution((self.fatcaComplianceData.entityCertification.entityFinancialInstitution() === "true"));
        self.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.activeNFE((self.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.activeNFE() === "true"));
        self.fatcaComplianceData.entityCertification.financialInstitutionDetails.investmentEntity((self.fatcaComplianceData.entityCertification.financialInstitutionDetails.investmentEntity() === "true"));
        self.fatcaComplianceData.entityCertification.financialInstitutionDetails.locatedInNonParticipating((self.fatcaComplianceData.entityCertification.financialInstitutionDetails.locatedInNonParticipating() === "true"));
        self.fatcaComplianceData.entityCertification.financialInstitutionDetails.giinAvailable((self.fatcaComplianceData.entityCertification.financialInstitutionDetails.giinAvailable() === "true"));
      }
      ReviewFatcaComplianceModel.submitFatcaCompliance(ko.mapping.toJSON(self.fatcaComplianceData, {
        "ignore": ["selectedValues"]
      })).done(function(jqXhr) {
        Params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.formType === "INDIVIDUAL" ? self.resource.fatcaHeader : self.entityResource.fatcaHeader,
          confirmScreenExtensions: {
            confirmScreenMsgEval: getSuccessMessage,
            template: "confirm-screen/fatca-compliance",
            isSet: true,
            taskCode: "AR_N_CMP"
          }
        }, self);
      }).fail(function(){
        if (self.formType === "INDIVIDUAL") {
          self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity((self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity().toString()));
          self.fatcaComplianceData.taxResidencyInfoDTO.domesticTaxResident((self.fatcaComplianceData.taxResidencyInfoDTO.domesticTaxResident().toString()));
          self.fatcaComplianceData.taxResidencyInfoDTO.usCitizen((self.fatcaComplianceData.taxResidencyInfoDTO.usCitizen().toString()));
          self.fatcaComplianceData.taxResidencyInfoDTO.sptStatus((self.fatcaComplianceData.taxResidencyInfoDTO.sptStatus().toString()));
          self.fatcaComplianceData.taxResidencyInfoDTO.usGreenCardOwner((self.fatcaComplianceData.taxResidencyInfoDTO.usGreenCardOwner().toString()));
          self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable((self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable().toString()));
        }
        if (self.formType === "ENTITY") {
          self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity((self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity().toString()));
          self.fatcaComplianceData.taxResidencyInfoDTO.usIncorporatedEntity((self.fatcaComplianceData.taxResidencyInfoDTO.usIncorporatedEntity().toString()));
          self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticBenificialOwners((self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticBenificialOwners().toString()));
          self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable((self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable().toString()));
          self.fatcaComplianceData.entityCertification.entityFinancialInstitution((self.fatcaComplianceData.entityCertification.entityFinancialInstitution().toString()));
          self.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.activeNFE((self.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.activeNFE().toString()));
          self.fatcaComplianceData.entityCertification.financialInstitutionDetails.investmentEntity((self.fatcaComplianceData.entityCertification.financialInstitutionDetails.investmentEntity().toString()));
          self.fatcaComplianceData.entityCertification.financialInstitutionDetails.locatedInNonParticipating((self.fatcaComplianceData.entityCertification.financialInstitutionDetails.locatedInNonParticipating().toString()));
          self.fatcaComplianceData.entityCertification.financialInstitutionDetails.giinAvailable((self.fatcaComplianceData.entityCertification.financialInstitutionDetails.giinAvailable().toString()));
        }
      });
    };

    self.back = function() {
      self.backFromReview = ko.observable(true);
      if (self.formType === "ENTITY") {
        Params.dashboard.loadComponent("entity-fatca-compliance", {}, self);
      }
      if (self.formType === "INDIVIDUAL") {
        Params.dashboard.loadComponent("fatca-compliance", {}, self);
      }
    };
  };
});
