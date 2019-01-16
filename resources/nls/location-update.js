define([], function() {
  "use strict";
  var LocationUpdateLocale = function() {
    return {
      root: {
        headers: {
          edit: "Edit"
        },
        fieldname: {
          atmId: "ATM ID",
          branchId: "Branch ID",
          workTimings: "Work Timings",
          phoneNo: "Phone Number",
          to: "to",
          supportedservices: "Services Offered",
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
          alternatephoneNo: "Alternate Phone Number",
          services: "Services Offered",
          hrs: "hrs",
          days: "days",
          coordinates: "Coordinates",
          searchLocation: "Search Location",
          location: "Enter Location",
          search: "Search",
          addAdditionalTiming: "Add Additional Work Timings",
          additionalDetails: "Additional Details",
          nameValidation: "Please enter valid ATM/Branch name",
          noDetailsFound: "No details available for input:",
          addReviewHeaderMsg: "You Initiated a request for maintaining ATM/Branch . Please review details before you confirm!"
        },
        buttons: {
          cancel: "Cancel",
          save: "Save",
          back : "Back"
        },
        headings: {
          transactionName: "ATM/Branch Maintenance"
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new LocationUpdateLocale();
});
