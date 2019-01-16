define([], function() {
  "use strict";
  var ReviewLocationUpdateLocale = function() {
    return {
      root: {
        pageTitle: {
          header: "ATM/Branch Maintenance"
        },
        fieldname: {
          select: "Select",
          id: "Search by ATM/Branch ID",
          atm: "ATM",
          branch: "Branch",
          atmId: "ATM ID",
          branchId: "Branch ID",
          workTimings: "Work Timings",
          phoneNum: "Phone Number",
          servicesOffered: "Services Offered",
          cashWithdrawl: "Cash Withdrawal",
          cashDeposit: "Cash Deposit",
          lockers: "Lockers",
          to: "To",
          line1: "Address Line 1",
          line2: "Address Line 2",
          line3: "Address Line 3",
          line4: "Address Line 4",
          city: "City",
          country: "Country",
          latitude: "Latitude",
          longitude: "Longitude",
          atmName: "ATM Name",
          branchName: "Branch Name",
          alternatephoneNum: "Alternate Phone Number",
          hrs: "hrs",
          days: "days",
          coordinates: "Coordinates",
          searchLocation: "Search Location",
          location: "Enter Location",
          search: "Search",
          additionalDetails: "Additional Details",
          addReviewHeaderMsg: "You Initiated a request for maintaining ATM/Branch . Please review details before you confirm!"
        },
        headings: {
          reviewAtmBranch: "Review",
          transactionName: "ATM/Branch Maintenance"
        },
        buttons: {
          cancel: "Cancel",
          confirm: "Confirm",
          edit: "Edit",
          back : "Back"
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new ReviewLocationUpdateLocale();
});
