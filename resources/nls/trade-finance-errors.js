define([], function() {
  "use strict";
  var lcErrorsLocale = function() {
    return {
      root: {
        common: {
          invalidAmount: "Invalid Amount",
          fromToAmountMsg: "To amount cannot be less than from amount"
        },
        initiateLC: {
          invalidTemplateName: "Enter valid template name",
          invalidDraftName: "Enter valid draft name",
          invalidDataEntered: "Enter either latest shipment date or shipment period, not both"
        },
        lcDetails: {
          invalidBranch: "Branch Name can comprise alphabets (A-Z any case)",
          invalidBeneficiaryName: "Name can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
          invalidLCNumber: "Please enter valid LC Number",
          invalidTenure: "Please enter number of days lesser than when LC maturity is due",
          invalidAmountErrorMessage: "Amount should be greater than 0",
          addressError: "Address can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
          countryError: "Country can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
          toleranceError: "Tolerance level can be maximum 2 digits and 2 decimal places",
          invalidFrequency: "Please enter valid frequency",
          lcAmountError: "Amount should be lesser than 1 trillion",
          invalidExpiryPlace: "Invalid place of expiry",
          invalidBankName: "Drawee bank name can comprise of (A-Z any case, 0-9)&,/,-\"space"
        },
        shipmentDetails: {
          invalidShipmentPeriod: "Invalid Shipment Period",
          invalidShipmentFrom: "Invalid Shipment From",
          invalidShipmentTo: "Invalid Shipment To",
          invalidLoadingPort: "Invalid Port Of Loading",
          invalidDischargePort: "Invalid Port of Discharge",
          invalidDescription: "Invalid Description of Goods",
          invalidNameOfVessel: "Invalid Name of Vessel",
          inValidPurchaseAmount: "Purchase Amount can not be greater than Bill Amount",
          invalidUnits : "Invalid number of Goods units",
          invalidGoodsAmount : "Total goods amount should be equal to LC Contract Amount",
          invalidBillUnderLcGoodsAmount : "Total goods amount should be equal to Bill Amount"
        },
        documentDetails: {
          invalidInput: "Invalid Input",
          invalidDescription: "Entered days exceed the LC validity period.",
          invalidClauseDesc: "Enter valid clause desc"
        },
        instructionDetails: {
          invalidSwiftId: "Invalid Swift ID",
          invalidTnC: "You must accept the terms and conditions to initiate letter of credit",
          invalidCollectionTnC: "You must accept the terms and conditions to initiate bill",
          invalidBeneCharges: "Invalid Charges",
          invalidInstructions: "Invalid Instructions"
        },
        bills: {
          invalidBillNumber: "Invalid Bill Number",
          invalidDraweeName: "Invalid Drawee Name",
          invalidDrawerName: "Invalid Drawer Name",
          invalidBankRefNumber: "Invalid Bank Reference Number",
          invalidCustRefNumber: "Invalid Customer Reference Number",
          invalidLcNumber: "Enter Valid LC Number"
        },
        guarantees: {
          invalidBeneRefNo: "Invalid Beneficiary Reference Number",
          invalidExpiryPlace: "Invalid place of expiry",
          invalidTnC: "You must accept the terms and conditions to initiate Guarantee",
          addressError: "Address can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space"
        },
        diclaimers: {
          authDisclaimer: "All authorized and on hold transactions are listed here. Others will be listed once approved. Please contact the bank for details."
        },
        messages: {
          cancelOperation: "Are you sure you want to cancel the operation?",
          noDataFound: "No data available to display",
          note: "File size should not be more than 5 MB. Supported file types: .jpeg, .png, .doc, .pdf, .txt, .zip. Multiple files can be uploaded at a time.",
          noRecordFound: "No records found for the given search input.",
          noAmendments: "Currently, there are no amendments linked to this contract.",
          noGuarantees: "Currently, there are no guarantees linked to this contract.",
          noBills: "Currently, there are no bills linked to this contract.",
          noFileSelected: "Please choose a file to upload",
          noDocsAttached: "Currently, there are no documents attached to this contract.",
          noCharges: "Currently, there are no charges linked to this contract.",
          noAdditionalBanks: "Currently, there are no additional banks linked to this contract.",
          noSwiftMessages: "Currently, there are no SWIFT messages generated against this contract.",
          noAdvices: "Currently, there are no advices generated against this contract.",
          noInstruction: "Currently, no instructions have been given against this bill.",
          noDiscrepancies: "Currently, there are no discrepancies reported against this bill.",
          noAmendmentsForGuarantee: "Currently, there are no amendments linked to this guarantee.",
          noContracts: "Currently, there are no contracts linked to this guarantee.",
          amendmentWarning: "Contract cannot be amended, Please contact the bank for details.",
          attachDocWarning: "Document cannot be attached. Please contact the bank for details.",
          sourceLenValidation: "A combined length limit of 65 is permissible with comma separated values for Port of Loading and Shipment from.",
          destinationLenValidation: "A combined length limit of 65 is permissible with comma separated values for Port of Dispatch and Shipment to."
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
  return new lcErrorsLocale();
});
