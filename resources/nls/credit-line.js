define([], function() {
  "use strict";
  var CasaAccountOverviewLocale = function() {
    return {
      root: {
        utilizedAmount: "Utilized Amount",
        remainingAmount: "Remaining Amount",
        viewDetails: "View Details",
        all: "All Parties",
        creditLineHeader: "Credit Line Usage",
        noData: "No Credit Lines Available",
        tooltip: {
          series: "Series: {seriesType}",
          group: "Group: {groupType}",
          value: "Value: {value}"
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
  return new CasaAccountOverviewLocale();
});
