define([], function() {
  "use strict";
  var Address = function() {
    return {
      root: {
        locator: {
          locator_title: "Locator",
          locator_description: "Find Branch",
          searchByLocation: "Search By Location",
          useCurrentLocation: "Use Current Location",
          branch: "Branch",
          atm: "ATM",
          hours: "Hours",
          sunday: "Sunday",
          saturday: "Saturday",
          monday: "Monday",
          tuesday: "Tuesday",
          wednesday: "Wednesday",
          thursday: "Thursday",
          friday: "Friday",
          current: "Current Location",
          showAll: "Show All",
          noBranch: "No Branch Found"

        }
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
  return new Address();
});