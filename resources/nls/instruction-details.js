define([], function() {
  "use strict";
  var InstructionDetailsLocale = function() {
    return {
      root: {
        labels: {
          collectingBank: "Collecting Bank",
          remittingBank: "Remitting Bank",
          negotiatingBank: "Negotiating bank",
          remarks: "Remarks",
          instructionNo: "Instruction No",
          charges: "Charges",
          modeOfDelivery : "Mode of Delivery for Advice",
          SWIFT:"Swift",
          MAIL:"Mail",
          chargesAccount: "Charges Account",
          chargesBorneBy: "Charges Borne By",
          chargesFromBeneficiary: "Charges Borne By Beneficiary",
          chargesRefusedInstruction: "If Charges/Interest refused collecting bank can wavier",
          interestInstrucution: "Interest Instruction",
          dishonourOfDocs: "Incase of Dishonour of Documents",
          otherInstruction: "Other Instruction",
          description: "Description",
          instructionCheckStatement: "This collection and any further relevant advice are subject to Uniform Rules for Collection ( 1995 Revision) ICC Publication Number 522",
          instructionUntilDateOfPayment: "Collect Interest rate at {InterestRate} from {DateOfPresentation} until {DateOfPayment}",
          instructionDateOfAcceptance: "Collect Interest rate at {InterestRate} from {DateOfPresentation} until {DateOfAcceptance} and from {DueDate} until {DateOfPayment}",
          protestNonPayment: "Protest for non payment",
          protestNonAcceptance: "Protest for non acceptance",
          advBankSwiftCode: "Advising Bank SWIFT ID",
          issueBank: "Issuing Bank",
          availableBalance: "Balance: {availableBalance}",
          BYAPPLICANT: "Applicant",
          BYCOUNTERPARTY: "Beneficiary",
          select: "Select",
          instructionsToBank: "Instructions to the Bank: Not forming part of LC",
          advicesTable: "Advices Table",
          swiftTable: "Swift Table",
          guaranteeTable: "Guarantee Table",
          commissionTable: "Commission Table",
          chargesTable: "Charges Table",
          documentTable: "Documents Table",
          deletedDocTable: "Deleted Documents Table"
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
  return new InstructionDetailsLocale();
});
