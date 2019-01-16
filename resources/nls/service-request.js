define([], function() {
  "use strict";
  var requestPinLocale = function() {
    return {
      root: {
        serviceRequest: {
          cardHeading: "Service Request",
          card_title: "Service Request",
          card_imgDesc: "Requesting Service",
          card_description: "Pending",
          card_viewall: "View All",
          date: "Date",
          description: "Description",
          refNo: "Reference Number",
          srList: "Service Request List",
          status: "Status",
          PE: "Pending",
          ACTIVATE_CARD: "Activate Credit Card",
          DEACTIVATE_CARD: "Deactivate Credit Card",
          HOTLIST_CARD: "Hotlist Credit Card",
          CANCEL_CARD: "Cancel Credit Card",
          REGISTER_AUTO_REPAYMENT: "Register Auto Repayment",
          CREDIT_CARD_SET_CREDENTIAL: "Credit Card Set Credential",
          UPDATE_CARD_LIMIT: "Update Card Limit",
          UPDATE_BILL_CYCLE: "Update Bill Cycle",
          REPLACE_CARD: "Replace Card",
          DEREGISTER_AUTO_REPAYMENT: "Deregister Auto Repayment",
          UPDATE_AUTO_REPAYMENT: "Update Auto repayment",
          CREDIT_CARD_SUPPLIMENTARY: "Add On Card Request",
          UPDATE_CARD_STATUS: "Update Card Status",
          CREDIT_CARD_STATEMENT_DISPUTE: "Credit Card Statement Item Dispute"
        }
      }
    };
  };
  return new requestPinLocale();
});