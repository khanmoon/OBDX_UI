define([], function() {
  "use strict";
  var LocationSearchLocale = function() {
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
          addAdditionalTiming: "Add Additional Work Timings",
          additionalDetails: "Additional Details",
          IDValidation: "Please enter valid ATM/Branch ID",
          nameValidation: "Please enter valid ATM/Branch name",
          addNew: "Add New",
          inputType: "Input Type",
          addSingle: "Single {selectedType}",
          addMultipleATM: "ATM List via file upload",
          addMultipleBranch: "Multiple Branches via file upload",
          uploadFile: "Upload File",
          file: "File",
          format: "(.xml format only)",
          maxSize: "(Less than 10 MB)",
          noDetailsFound: "No details available for input:",
          newAdd: "Add new Atm or Branch",
          inputype: "Input type",
          ServicesOff: "Services Offered"
        },
        headings: {
          addAtmBranch: "Add ATM/Branch Details",
          transactionName: "ATM/Branch Maintenance",
          noFileFoundErrorMessage: "Please choose a file to upload.",
          downloadFile: "View Record Status",
          download: "Download File",
          emptyFileErrorMsg: "The uploaded file is empty. Please upload a valid file.",
          fileSizeErrorMsg: "The uploaded file exceeds the maximum permissible size of 10 MB. Please reduce the file size and try again."
        },
        buttons: {
          cancel: "Cancel",
          clear: "Clear",
          add: "Add",
          ok: "Ok",
          back : "Back"
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new LocationSearchLocale();
});
