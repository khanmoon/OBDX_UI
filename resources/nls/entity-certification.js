define([], function() {
  "use strict";
  var entitycertificationLocale = function() {
    return {
      root: {
        entityPopupText1: "If the entity falls under this category, each controlling person of the entity is required to complete and sign the Controlling Person Tax Residency Self-Certification Form.",
        entityPopupText2: "This form is available at any of the bank's branches and can also be downloaded from the bank's official website.",
        entityPopupTextHeader: "Please Note",
        EntityCertification: {
          entityInfoText: "Please provide the Entity's status by completing the following section.",
          Pleaseselectacategorytowhichtheentitybelongs: "Please select a category to which the entity belongs",
          FinancialInstitution: "Financial Institution",
          NonFinancialInstitution: "Non-Financial Institution",
          AnInvestmentEntity: "An Investment Entity",
          DepositoryInstitutionCustodialInstitutionorSpecifiedInsuranceCompany: "Depository Institution, Custodial Institution or Specified Insurance Company",
          InvestmentEntityType: "Investment Entity Type",
          AnInvestmentEntitylocatedinaNonParticipatingJurisdictionandmanagedbyanotherFinancialInstitution: "An Investment Entity located in a Non-Participating Jurisdiction and managed by another Financial Institution",
          OtherInvestmentEntity: "Other Investment Entity",
          GIINAvailable: "GIIN Available",
          Yes: "Yes",
          No: "No",
          EnterGIIN: "Enter GIIN",
          ReasonForNA: "Reason for Non Availability",
          ActiveNonFinancialEntity: "Active Non-Financial Entity (NFE)",
          PassiveNonFinancialEntity: "Passive Non-Financial Entity (NFE)",
          ActiveNFEType: "Active NFE Type",
          regularlyTradedCorporation: "A corporation, the stock of which is regularly traded on an established securities market",
          Entityisrelatedtoacorporationwhosestockisregularlytradedonanestablishedsecuritiesmarket: "Entity is related to a corporation whose stock is regularly traded on an established securities market",
          AGovernmentalEntityorCentralBank: "A Governmental Entity or Central Bank",
          AnInternationalOrganization: "An International Organization",
          otherNFE: "Other e.g. a start-up NFE or a non-profit NFE",
          Nameoftheestablishedsecuritiesmarketonwhichthecorporationisregularlytraded: "Name of the established securities market on which the corporation is regularly traded",
          Nameoftherelatedcorporationwhosestockistraded: "Name of the related corporation whose stock is traded",
          Nameoftheestablishedsecuritiesmarketonwhichthestockoftherelatedcorporationisregularlytraded: "Name of the established securities market on which the stock of the related corporation is regularly traded",
          Natureofrelation: "Nature of relation",
          Subsidiaryofthelistedcompany: "Subsidiary of the listed company",
          Controlledbyalistedcompany: "Controlled by a listed company",
          Commoncontrolaslistedcompany: "Common control as listed company",
          SubCategoryofActiveNFE: "Sub-Category of Active NFE",
          giinInfo: "Account Holder's Global Intermediary Identification Number (GIIN) obtained for FATCA purposes",
          giinInfoTitle: "Click here to know more about GIIN",
          giinInfoAlt: "Link to view information about GIIN"
        },
        messages: {
          subCategoryOfActiveNFE: "Please enter a valid sub category",
          nameOfEstablishedSecuritiesMarket: "Please enter a valid name of established securities market",
          nameoftherelatedcorporation: "Please enter a valid name of related corporation",
          giin: "Please enter a valid GIIN",
          ReasonForNA: "Please enter reason in a valid format"
        },
        heading: {
          EntityCertification: "Entity Certification"
        },
        buttons: {
          "cancel": "Cancel",
          "reset": "Reset"
        }
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: true
    };
  };
  return new entitycertificationLocale();
});
