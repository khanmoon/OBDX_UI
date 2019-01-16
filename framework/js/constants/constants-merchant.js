define([], function() {
  "use strict";
  return {
    URL: {
      CREATE_MERCHANT: "payments/merchants",
      UPDATE_MERCHANT: "payments/merchants/{merchantCode}",
      LIST_MERCHANT: "payments/merchants",
      DELETE_MERCHANT: "payments/merchants/{merchantCode}",
      GET_MERCHANT: "payments/merchants/{merchantCode}",
      GET_BRANCHES: "locations/country/all/city/all/branchCode"
    }
  };
});