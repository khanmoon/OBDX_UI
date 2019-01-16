define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var TransactionDetailLocale = function() {
    return {
      root: {
        common: {
          DeliveryLocation: "Delivery Location"
        },
        transaction: {
          refNo: "Ref No",
          name: "Transaction Name",
          status: "Status",
          valueDate: "Value Date",
          maker: "Maker",
          creationDate: "Creation Date",
          approve: "Approve",
          reject: "Reject",
          modificationRequest: "Request Modification",
          referenceNumber: "Ref No",
          approved_message: "Approved Successfully.",
          rejected_message: "Rejected Successfully.",
          modified_message: "Request Modified Successfully.",
          select: "Select"
        },
        track: {
          status: "Track Status"
        },
        auditDetails: "Audit Details",
        generic: Generic,
        info: {
          noData: "No data to display."
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
  return new TransactionDetailLocale();
});