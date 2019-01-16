define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/compliance-entity",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojaccordion",
  "ojs/ojvalidationgroup"
], function (oj, ko, $, FatcaComplianceModel, BaseLogger, ResourceBundle) {
  "use strict";
  return function (Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.fatcaHeader);
    self.stagesLoaded = ko.observable(false);
    self.showMoreText = ko.observable(false);
    self.countries = ko.observableArray([]);
    self.states = ko.observableArray([]);
    self.statesMailing = ko.observableArray([]);
    self.identificationTypes = ko.observableArray([]);
    self.occupations = ko.observableArray([]);
    self.incomeRanges = ko.observableArray([]);
    Params.baseModel.registerComponent("review-fatca-compliance", "compliance");
    Params.baseModel.registerComponent("entity-identification-info", "compliance");
    Params.baseModel.registerComponent("entity-tax-residency-info", "compliance");
    Params.baseModel.registerComponent("fatca-declaration", "compliance");
    Params.baseModel.registerComponent("entity-certification", "compliance");

    var getNewKoModel = function () {
      var KoModel = FatcaComplianceModel.getNewModel();
      KoModel.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo = ko.observableArray(KoModel.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo);
      KoModel.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable = ko.observable("true");
      KoModel.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity = ko.observable("true");
      KoModel.fatcaComplianceData.taxResidencyInfoDTO.usIncorporatedEntity = ko.observable("false");
      KoModel.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticBenificialOwners = ko.observable("false");
      KoModel.fatcaComplianceData.entityCertification.entityFinancialInstitution = ko.observable();
      KoModel.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.activeNFE = ko.observable("");
      KoModel.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.activeNonFinancialEntityType = ko.observable();
      KoModel.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.stockTradedCorporation = ko.observable();
      KoModel.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.nameOfEstablishedSecuritiesMarket = ko.observable();
      KoModel.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.subCategoryOfActiveNFE = ko.observable();
      KoModel.fatcaComplianceData.entityCertification.financialInstitutionDetails.investmentEntity = ko.observable();
      KoModel.fatcaComplianceData.entityCertification.financialInstitutionDetails.locatedInNonParticipating = ko.observable();
      KoModel.fatcaComplianceData.entityCertification.financialInstitutionDetails.giinAvailable = ko.observable("true");
      KoModel.fatcaComplianceData.selectedValues = ko.observable(KoModel.fatcaComplianceData.selectedValues);
      return KoModel;
    };

    if (!self.backFromReview) {
      self.fatcaComplianceData = getNewKoModel().fatcaComplianceData;
      self.stages = ko.observableArray([]);
      self.sectionBeingEdited = ko.observable();
      self.declaration = ko.observableArray([]);
      self.taxIdentificationTypes = ko.observableArray([]);
      self.taxResidenceCountriesLoaded = ko.observable(false);
      self.isMailingAddressSame = ko.observableArray(["same"]);
      self.fillMailingAddress = ko.observable(false);
      self.taxIdentificationType = ko.observableArray([]);
      self.taxIdentificationType()[0] = ko.observable();
      self.disableFullName = ko.observable(false);
      self.fatcaComplianceData.identificationInfo.fullName = self.params.personalDetails.fullName ? self.params.personalDetails.fullName : Params.baseModel.format(self.resource.fullName, {
        firstName: self.params.personalDetails.firstName,
        middleName: self.params.personalDetails.middleName ? self.params.personalDetails.middleName : "",
        lastName: self.params.personalDetails.lastName
      });
      if (self.fatcaComplianceData.identificationInfo.fullName) {
        self.disableFullName(true);
      }
    }

    self.showMoreTextClick = function () {
      self.showMoreText(!self.showMoreText());
    };

    self.stages([{
        stageName: self.resource.heading.entityIdentification,
        moduleName: "entity-identification-info",
        validated: ko.observable(),
        expanded: ko.observable(true)
      },
      {
        stageName: self.resource.heading.taxResidencyInfo,
        moduleName: "entity-tax-residency-info",
        validated: ko.observable(),
        expanded: ko.observable(false)
      },
      {
        stageName: self.resource.heading.entityCertification,
        moduleName: "entity-certification",
        validated: ko.observable(),
        expanded: ko.observable(false)
      },
      {
        stageName: self.resource.heading.declaration,
        moduleName: "fatca-declaration",
        validated: ko.observable(),
        expanded: ko.observable(false)
      }
    ]);

    if (self.backFromReview && self.sectionBeingEdited()) {
      for (var i = 0; i < self.stages().length; i++) {
        if (self.stages()[i].moduleName === self.sectionBeingEdited()) {
          self.stages()[i].expanded(true);
        } else {
          self.stages()[i].expanded(false);
        }
      }
    }

    self.stagesLoaded(true);

    self.natureOfRelationList = [{
      code: "SUB",
      description: self.resource.entityCertification.Subsidiaryofthelistedcompany
    }, {
      code: "CON",
      description: self.resource.entityCertification.Controlledbyalistedcompany
    }, {
      code: "CCO",
      description: self.resource.entityCertification.Commoncontrolaslistedcompany
    }];

    self.submitFatcaCompliance = function () {
      var entityInfoTracker = document.getElementById("entityInfoTracker");
      var taxResidencyInfoTracker = document.getElementById("taxResidencyInfoTracker");
      var entityCertificationTracker = document.getElementById("entityCertificationTracker");
      var declarationTracker = document.getElementById("declarationTracker");
      if (entityInfoTracker && entityInfoTracker.valid !== "valid") {
        entityInfoTracker.showMessages();
        Params.baseModel.showMessages(null, [self.resource.formCompletionError], "ERROR");
        entityInfoTracker.focusOn("@firstInvalidShown");
        return false;
      }
      if (taxResidencyInfoTracker && taxResidencyInfoTracker.valid !== "valid") {
        taxResidencyInfoTracker.showMessages();
        Params.baseModel.showMessages(null, [self.resource.formCompletionError], "ERROR");
        taxResidencyInfoTracker.focusOn("@firstInvalidShown");
        return false;
      }
      if (entityCertificationTracker && entityCertificationTracker.valid !== "valid") {
        entityCertificationTracker.showMessages();
        Params.baseModel.showMessages(null, [self.resource.formCompletionError], "ERROR");
        entityCertificationTracker.focusOn("@firstInvalidShown");
        return false;
      }
      if (declarationTracker && declarationTracker.valid !== "valid") {
        declarationTracker.showMessages();
        Params.baseModel.showMessages(null, [self.resource.formCompletionError], "ERROR");
        declarationTracker.focusOn("@firstInvalidShown");
        return false;
      }
      if (!self.fillMailingAddress()) {
        self.fatcaComplianceData.identificationInfo.mailingAddress = JSON.parse(JSON.stringify(self.fatcaComplianceData.identificationInfo.addressDetails));
      }
      if (self.declaration && self.declaration().length > 0 && self.declaration()[0] === "accept") {
        self.fatcaComplianceData.statementTruthDeclaration = true;
      }
      self.fatcaComplianceData.selectedValues().taxResidenceCountry = [];
      for (var i = 0; i < self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo().length; i++) {
        self.fatcaComplianceData.selectedValues().taxIdentificationType = ko.observableArray([]);
        if (self.taxIdentificationType()[i]() && self.taxIdentificationType()[i]() !== "OTHER") {
          self.fatcaComplianceData.selectedValues().taxIdentificationType()[i] = Params.baseModel.getDescriptionFromCode(self.taxIdentificationTypes()[i](), self.taxIdentificationType()[i]);
          self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[i].taxIdentifierType = ko.utils.unwrapObservable(self.taxIdentificationType()[i]);
        } else {
          self.fatcaComplianceData.selectedValues().taxIdentificationType()[i] = self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[i].taxIdentifierType;
        }
        self.fatcaComplianceData.selectedValues().taxResidenceCountry.push(Params.baseModel.getDescriptionFromCode(self.countries(), self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[i].taxResidenceCountry));
      }
      self.fatcaComplianceData.selectedValues().country = Params.baseModel.getDescriptionFromCode(self.countries(), self.fatcaComplianceData.identificationInfo.addressDetails.country);
      self.fatcaComplianceData.selectedValues().state = Params.baseModel.getDescriptionFromCode(self.states(), self.fatcaComplianceData.identificationInfo.addressDetails.state);
      self.fatcaComplianceData.selectedValues().countryMailing = Params.baseModel.getDescriptionFromCode(self.countries(), self.fatcaComplianceData.identificationInfo.mailingAddress.country);
      self.fatcaComplianceData.selectedValues().statesMailing = Params.baseModel.getDescriptionFromCode(self.states(), self.fatcaComplianceData.identificationInfo.mailingAddress.state);
      self.fatcaComplianceData.selectedValues().countryOfIncorporation = Params.baseModel.getDescriptionFromCode(self.countries(), self.fatcaComplianceData.identificationInfo.countryOfIncorporation);
      self.fatcaComplianceData.selectedValues().natureOfRelation = Params.baseModel.getDescriptionFromCode(self.natureOfRelationList, self.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.natureOfRelation);
      Params.dashboard.loadComponent("review-fatca-compliance", {}, self);
    };
  };
});
