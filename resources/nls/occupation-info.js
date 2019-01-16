define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var occupationInfoLocale = function() {
    return {
      root: {
        primaryOccupation: "Primary Employment",
        additionalOccupation: "Additional Employment",
        primaryEmployment: "Please specify details of your employment for the past {months} months",
        employmentdtls: "Please specify details of your employment for the last 3 years",
        occupationType: "Employment Type",
        occupationStatus: "Employment Status",
        employerName: "Employer Name",
        companyOrEmployerName: "Company or Employer Name",
        startDate: "Start Date",
        endDate: "End Date",
        isPrimary: "Primary Employment",
        designation: "Designation",
        grossAnnSalary: "Gross Annual Salary",
        addOccupation: "Add Employment",
        addAnotherOccupation: "Add another Employment",
        address: "Address",
        empDeleteOccupationClick: "Click here to delete an employment record",
        empDeleteOccupationClickTitle: "Click here to delete an employment record",
        empEditOccupationClick: "Click here to edit an employment record",
        empAddOccupationClick: "Click here to add an employment record",
        grossAnnualSalary: "Gross Annual Salary",
        reviewAddress: "{line1}, {line2}, {city}",
        reviewAddress2: "{line1}, {city}",
        reviewAddressCountryZip: "{state} {country} {zip}",
        generic: Generic,
        messages: {
          occupationType: "Please select an employment type",
          occupationStatus: "Please select an employment status",
          employerName: "Please enter valid employer name",
          startDate: "Please provide start date",
          endDate: "Please provide end date",
          employmentStartdateError: "Employment start date cannot be greater than {currdate}"
        },
        submitOccupation: "Click here to Submit Employment Information"
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
  return new occupationInfoLocale();
});