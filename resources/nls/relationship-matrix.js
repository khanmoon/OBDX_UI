define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var RelationshipMatrixLocale = function() {
    return {
      root: {
        relationshipMatrixMaintenance: "Relationship Matrix Maintenance",
        reviewHeader: "Review",
        reviewHeader1: "You initiated a request for Relationship Matrix. Please review details before you confirm!",
        reviewHeader2: "Relationship Matrix maintenance for each transaction can be viewed by visiting respective account type tabs.",
        taskTable: "Task Table",
        transactions: "Transactions",
        casa: "Current and Savings",
        td: "Deposits",
        loans: "Loans",
        cc: "Credit Cards",
        relationshipHeading: "{relationshipName}<br>({relationshipCode})",
        inquiry: "Inquiry",
        transactionGroup: "Transactions",
        back: "Back",
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
  return new RelationshipMatrixLocale();
});
