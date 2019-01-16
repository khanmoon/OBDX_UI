define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var occupationInfoLocale = function() {
    return {
      root: {
        compName: "oaccupation-info",
        addOccupation: "Add Employment",
        occupationType: "Employment Type",
        occupationStatus: "Employment Status",
        employerName: "Company Name or Employer",
        startDate: "Start Date",
        primaryEmployment: "Please specify details of your employment for the past {months} months",
        currentEmployment: "Please specify details of your current primary employment",
        primaryOccupation: "Primary Employment",
        additionalOccupation: "Additional Employment",
        previousEmployment: "Previous Employment",
        timeEmployed: "Time Employed",
        employmentdtls: "Please specify details of your employment for the last 3 years",
        endDate: "End Date",
        isPrimary: "Primary Employment",
        designation: "Designation",
        grossAnnSalary: "Gross Annual Salary",
        addAnotherOccupation: "Add another Employment",
        deleteOccupationClick: "Click here to delete an employment record",
        deleteOccupationInfoClick: "Click here to delete an employment record",
        editOccupationClick: "Click here to edit an employment record",
        editOccupationInfoClick: "Click here to edit an employment record",
        addOccupationClick: "Click here to add an employment record",
        addOccupationInfoClick: "Click here to add an employment record",
        address: "Address",
        grossAnnualSalary: "Gross Annual Salary",
        reviewAddress: "{line1}, {line2}, {city}",
        reviewAddress2: "{line1}, {city}",
        reviewAddressCountryZip: "{state} {country} {zip}",
        employmentStatus: "I am currently employed",
        notEmployedStatus: "I am currently not employed",
        WorkPhone: "Work phone number",
        yes: "Yes",
        no: "No",
        date: "{yyyy}-{mm}-{dd}",
        aboutEmployment: "Enter information regarding your employment. If you are currently not employed, please select the option provided.",
        messages: {
          occupationType: "Please select an employment type",
          occupationStatus: "Please select an employment status",
          employerName: "Please enter valid employer name",
          startDate: "Please provide start date",
          endDate: "Please provide end date",
          designation: "Please enter designation",
          employmentStartdateError: "Employment start date cannot be greater than {currdate}",
          mobileNumber: "Please enter a valid phone number"
        },
        submitOccupation: "Click here to submit employment information",
        generic: Generic
      },
      "ar": true,
      "fr": true,
      "cs": true,
      "sv": true,
      "en": false,
      "en-us": false,
      "el": true
    };
  };
  return new occupationInfoLocale();
});
