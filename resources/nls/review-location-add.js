define([], function() {
  "use strict";
  var ReviewLocationAddLocale = function() {
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
          atmBranchId: "ATM/Branch ID",
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
          atmBranchName: "ATM/Branch Name",
          alternatephoneNum: "Alternate Phone Number",
          hrs: "hrs",
          days: "days",
          coordinates: "Coordinates",
          searchLocation: "Search Location",
          location: "Enter Location",
          search: "Search",
          additionalDetails: "Additional Details",
          addNew: "Add New",
          inputType: "Input Type",
          file: "File",
          inputTypeDescAtm: "Multiple ATM via file upload",
          inputTypeDescBranch: "Multiple Branches via file upload",
          addReviewHeaderMsg: "You Initiated a request to update an existing ATM/Branch. Please review details before you confirm!"
        },
        headings: {
          reviewAtmBranch: "Review",
          transactionName: "ATM/Branch Maintenance",
          emptyFileErrorMsg: "The uploaded file is empty. Please upload a valid file.",
          fileSizeErrorMsg: "The uploaded file exceeds the maximum permissible size of 10 MB. Please reduce the file size and try again.",
          downloadFile: "Download File"
        },
        buttons: {
          cancel: "Cancel",
          confirm: "Confirm",
          edit: "Edit",
          ok: "Ok",
          back : "Back"
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new ReviewLocationAddLocale();
});
