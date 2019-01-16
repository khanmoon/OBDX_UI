define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var RecordViewNonFinancialLocale = function() {
    return {
      root: {
        recordViewNonFinancial: {
          recordView: "Record View",
          recordDetails: "Record Details",
          fileName: "File Name",
          recordRefNo: "Record Ref No",
          rStatus: "Record Status",
          payeeDetails: "Payee Details",
          payeeType: "Payee Type",
          payeeName: "Payee Name",
          accountType: "Account Type",
          accountName: "Account Name",
          accountNumber: "Account Number",
          branch: "Branch",
          nickName: "Nickname",
          accessType: "Access Type",
          payVia: "Pay Via",
          ifscCode: "IFSC Code",
          swiftCode: "Swift/NCC Code",
          bankName: "Bank Name",
          bankAddress: "Bank Address",
          country: "Country",
          city: "City",
          back: "Back",
          draftType: "Draft Type",
          draftFavouring: "Draft Favouring",
          draftPayableAt: "Draft Payable at",
          deliverDraftTo: "Deliver Draft to",
          deliveryLoc: "Delivery Location"

        },
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
  return new RecordViewNonFinancialLocale();
});