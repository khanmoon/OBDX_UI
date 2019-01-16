define([
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var LocatorLocale = function() {
    return {
      root: {
        headings: {
          locator: "ATM / Branch Locator",
          branch: "Branch",
          atm: "ATM",
          findATMBranch: "Find an ATM / Branch",
          viewDetails: "View Details",
          count: "{nearbycount} {filter} in this area",
          refine: "Refine",
          services: "Services",
          hideDetails: "Hide Details",
          getDirection: "Get Direction",
          nearestLocation: "Show nearest ATM / Branches",
          address: "Address",
          phoneno: "Phone Number",
          showhidelists: "Hide",
          nearestLocationAlt: "Nearest Location",
          closeAlt: "Exit",
          close: "Close",
          workTimings: "Work Timings",
          noRecord: "No {selectedCritera} found.",
          refineSearch: "Refine Services",
          showSearchResult: "Show List",
          addressDisplay: "{add1} {separator} {add2}",
          timingDisplay: "{timing1} : {timing11} - {timing22}",
          atmMarker: "{name},<br/>{line1}, {line2},<br/>{city}",
          callMe: "Click to call",
          resizeCircle: "Drag to resize the circle!",
          mapForuse: "Map",
          tablesource: "Table"
        },
        errors: {
          locationNotFound: "Unable to fetch the current location, only secure origins are allowed.",
          noATMBranchFound: "No ATM / Branches found for the search criteria entered."
        },
        generic: Generic

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
  return new LocatorLocale();
});
