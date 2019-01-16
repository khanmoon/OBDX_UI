define([], function() {
  "use strict";
  var LocationSearchLocale = function() {
    return {
      root: {
        pageTitle: {

        },
        fieldname: {
          select: "Select"

        },
        headings: {},
        buttons: {
          TestHost: "Check Host Availability",
          TestEmail: "Send Test Email",
          TestHostAlt: "Check Host Availability",
          TestEmailAlt: "Send Test Email"

        },
        message: {
          connectionSuccess: "Test Successful",
          connectionFailure: "Host Unreachable",
          detailsNull: "Please enter Gateway IP and Port",
          detailsNullSMTP: "Please enter Host name, port, From and To email address to test connection",
          fileUpload: "File Upload",
          payment : "Payment",
          forexDeal : "Forex Deal",
          origination : "Origination",
          common : "Common",
          brand : "Brand"
        },
        tableHeader: {
          prod_cat: "Product Category",
          prod_code: "Product Code"

        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new LocationSearchLocale();
});
