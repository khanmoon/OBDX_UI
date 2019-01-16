define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var UserSegmentsLocale = function() {
    return {
      root: {
        header: {
          productMapping: "Product Mapping"
        },
        tableHeader: {
          userSegments: "User Segments",
          products: "Products",
          productName: "Product Name",
          expiryDate: "Expiry Date"
        },
        productMapping: {
          productModule: "Product Module",
          userSegment: "User Segment",
          segmentTable: "Segment Table",
          productTable: "Product Table",
          selectedProducts: "Selected Products {count}",
          productType: {
            TD: "Term Deposits",
            RD: "Recurring Deposits"
          },
          noOfMapped: "{count} mapped",
          administrator: "Administrator",
          retailuser: "Retail User",
          corporateuser: "Corporate User",
          zeroMapped: "0 mapped",
          message:{
            noPrductMessage: "Please select product module",
            mapProductMapped: "Please map product"
          }
        },
        common: {
          select: "Please Select",
          review: "Review",
          view: "View",
          search: "Search",
          initiateHeader: "You initiated product maintenance. Please review details before you confirm!"
        },
        button: {
          mapProducts: "Map Products"
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
  return new UserSegmentsLocale();
});