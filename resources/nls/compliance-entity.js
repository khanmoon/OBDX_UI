define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var ComplianceLocale = function() {
    return {
      root: {
        fatcaHeader: "FATCA & CRS Self-Certification Form for Entities",
        fatcaText: "Tax regulations require the collection of certain information about each account holder’s tax residency and citizenship status. Please complete the following relevant sections and provide any additional information that may be required. In certain circumstances there may be a requirement to share this information with relevant tax authorities. Please refer to the accompanying guidance notes when completing this form. Please consult your professional tax advisor if you have any questions regarding this form.",
        entityPopupText1: "If the entity falls under this category, each controlling person of the entity is required to complete and sign the Controlling Person Tax Residency Self-Certification Form.",
        entityPopupText2: "This form is available at any of the bank's branches and can also be downloaded from the bank's official website.",
        entityPopupTextHeader: "Please Note",
        formCompletionError: "Please complete the form",
        heading: {
          entityIdentification: "Identification of the Entity",
          taxResidencyInfo: "Tax Residency",
          entityCertification: "Entity Certification",
          declaration: "Declaration"
        },
        entityIdentificationInfo: {
          entityName: "Legal Name of Entity or Organization",
          currentLegalAddress: "Current Legal Address",
          orgCountry: "Country of Incorporation or Organization",
          mailingAddress: "Mailing Address",
          sameAsAbove: "Same as above"
        },
        taxResidencyInfo: {
          ques1: "Is the entity a tax resident of any country other than <country name>?",
          ques2: "Is the entity incorporated in the United States of America?",
          ques3: "Does the entity have any ultimate beneficial owners (incl. controlling persons) who are tax residents (incl. U.S. citizens/green card holders) of countries other than <country name>?",
          countryOfTaxResidence: "Country of Tax Residence",
          tinAvailable: "TIN Available",
          reasonForNonAvailability: "Reason for Non Availability",
          taxIdentificationType: "Tax Identification Type",
          TIN: "TIN/TIN Equivalent",
          addAnotherCountry: "Add Another Country",
          removeCountry: "Remove Country",
          removeCountryClick: "Click to remove added country of residence",
          addAnotherCountryClick: "Click to add another country of residence",
          tinInfo: "A Taxpayer Identification Number (TIN) is an identifying number used for tax purposes that is issued by the government. A TIN is known by different terms in different countries.",
          tinInfoAlt: "Link to view more information about TIN",
          tinInfoTitle: "Click here to view more information about TIN",
          otherTaxIdentificationType: "Other Tax Identification Type",
          other: "Other"
        },
        entityCertification: {
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
          ReasonForNA: "Reason For NA",
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
          SubCategoryofActiveNFE: "Sub-Category of Active NFE"
        },
        declaration: {
          declarationText1: "I acknowledge and agree that information contained in this form and information regarding income above may be reported to the tax authorities of the country in which such income arises and that those tax authorities may provide the information to the country or countries in which I am a resident for tax purposes.",
          declarationText2: "Zigbank is not able to offer any tax advice on FATCA or CRS or its impact on me. I shall seek advice from a professional tax advisor for any tax related questions.I undertake to notify Zigbank of any change in circumstances that causes any information on this form to become incorrect and to provide Zigbank with updated information within 30 days of said change.",
          declarationText3: "I authorize Zigbank to close or suspend my account(s) without any obligation of advising me of the same if any information provided by me in this form or hereafter is found to be false, untrue or misleading. I have understood the FATCA and CRS instructions and the requirement of information collected through this form and hereby confirm that the information provided by me in this form is true, correct and complete to the best of my knowledge.",
          representativeFullName: "Full Name of Representative",
          representativeDesignation: "Designation",
          declarationAccept: "Zig International Services declare acceptance of all statements above",
          declarationCheckbox: "Please indicate that you accept the above statements"
        },
        messages: {
          entityName: "Please enter the entity or organization name",
          orgCountry: "Please select organization country",
          designation: "Please enter your designation",
          fullName: "Please enter your full name",
          line2: "Please enter valid address",
          reasonForNonAvailability: "Please enter the reason for non availability",
          otherTaxIdentificationType: "Please enter your other tax identification type",
          country: "Please select country",
          state: "Please select state",
          city: "Please enter your city",
          zipcode: "Please enter zipcode",
          line1: "Please enter the 1st line of address",
          countryOfTaxResidence: "Please select your country of tax residence",
          taxIdentificationType: "Please select tax identification type",
          tinAvailable: "Please select if your TIN is available",
          TIN: "Please enter your TIN",
          declarationCheckbox: "Please indicate that you accept the above statements"
        },
        alt: "Image for FATCA & CRS Note",
        continue: "Continue",
        viewMore: "View More",
        viewLess: "View Less",
        country: "Country",
        state: "State",
        city: "City",
        address: "Address",
        zip: "Zip Code",
        editSection: "Edit {sectionName} section",
        editSectionTitle: "Edit {sectionName} section",
        generic: Generic
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
  return new ComplianceLocale();
});
