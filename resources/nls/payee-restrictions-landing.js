define(
  [],
  function() {
    "use strict";
    var PayeeCountLimitInquire = function() {
      return {
        root: {
          resource: {

            payeeCount: {
              editConfirm: "Transaction",
              totalpyeecount: "Cumulative Payee Restriction",
              payeeRestriction: "Payee Restriction",
              INTERNAL: "Internal Payment",
              INTERNATIONAL: "International Payment",
              DOMESTIC: "Domestic Payment",
              INDIADOMESTICNEFT: "NEFT",
              INDIADOMESTICRTGS: "RTGS",
              INDIADOMESTICIMPS: "IMPS",
              title: "Payee Restriction Setup",
              effectiveDateWarning: "Changes done will be effective from next day",
              pendingApproval: "Pending Approval",
              completed: "Completed",
              DOMESTICDEMANDDRAFT: "Domestic demand draft",
              INTERNATIONALDEMANDDRAFT: "International demand draft",
              UKDOMESTICFASTER: "UK domestic faster",
              UKDOMESTICNONFASTER: "UK domestic non-faster",
              SEPADOMESTICCARDTRANSFER: "SEPA card payment",
              SEPADOMESTICCREDITTRANSFER: "SEPA credit transfer",
              totalpayeepermittedperday: "Total number of Payees permitted per day",
              payeepermittedperday: "Payees per day",

              payeetype: "Payee Type",
              header: "Payee Count Limit",
              limit: "Limit",
              enabled: "Enabled",
              successmsg: "Maintenance Saved Successfully.",

              nodata: "No data",
              effectiveDate: "Effective Date",
              INT: "Intertnal",

              messageDetail: "Invalid input",
              draftpayee: "Draft Payee",
              accountpayee: "Account Payee",
              oneType: "Choose only one type",
              initiateHeader: "You initiated a payment for payee count maintenance. Please review details before you confirm!"

            },

            common: {
              summary: "Summary",
              edit: "Edit",
              info: "Information",
              cancel: "Cancel",
              save: "Save",
              yes: "Yes",
              no: "No",
              ok: "Ok",
              review: "Review",
              confirm: "Confirm",
              back: "Back",
              sucessfull: "Successful",
              done: "Done"
            }

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
    return new PayeeCountLimitInquire();
  }
);