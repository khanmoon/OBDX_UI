define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ChequeBookRequest = function() {
    return {
      root: {
        compName: {
          compName: "Cheque Book Request"
        },
        chequeBookRequest: {
          selectAccount: "Select Account",
          chequeBookType: "Type of Cheque Book",
          NumberOfCheques: "Number of Cheque Books",
          NumberOfLeaves: "Number of Leaves per Book",
          select: "Please Select",
          DeliveryLocation: "Delivery Location",
          referenceNumber: "Reference Number is {refNo}",
          chequeBookRequestConfirm: "Your cheque book will be delivered at the desired location!",
          chequeBookLeaveOption: "Cheque Book with {leavesCount} Leaves",
          transactionName: "Cheque Book Request",
          invalidInput: "Invalid Input",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          REJECTED: "Rejected"
        },
        common: {
          DeliveryLocation: "Delivery Location",
          successful: "Successful!"
        },
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new ChequeBookRequest();
});