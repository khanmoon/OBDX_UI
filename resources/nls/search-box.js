define([], function() {
  "use strict";

  var SearchBoxLocale = function() {
    return {
      root: {
        searchBoxDetails: {
          labels: {
            search: "Search By {searchBy}"
          }
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
  return new SearchBoxLocale();
});