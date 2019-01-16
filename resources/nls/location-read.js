define([], function() {
  "use strict";
  var LocationReadLocale = function() {
    return {
      root: {
        headers: {
          view: "View",
          deleteHeader: "Delete"
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
          additionalDetails: "Additional Details"
        },
        buttons: {
          cancel: "Cancel",
          edit: "Edit",
          delete: "Delete",
          no: "No",
          yes: "Yes",
          back: "Back"
        },
        messages: {
          deleteLocation: "Are you sure you want to delete the maintenance?"
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
  return new LocationReadLocale();
});
