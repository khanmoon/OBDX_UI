define([], function() {
  "use strict";
  return {
    URL: {
      GET_CATEGORY_LIST: "goals/categories?categoryName={categoryName}&categoryCode={categoryCode}&status={status}",
      CREATE_CATEGORY: "goals/categories",
      READ_CATEGORY: "goals/categories/{categoryId}",
      UPDATE_CATEGORY: "goals/categories/{categoryId}",
      GET_PRODUCTS: "goals/products",
      READ_PRODUCT: "goals/products/{productId}",
      CALCULATE: "goals/calculator",
      FETCH_CALCULATION: "goals/calculator/calculations/{calculationId}",
      SAVE_CALCULATION: "goals/calculator/calculations",
      GET_BRANCHES: "locations/country/all/city/all/branchCode/",
      GET_DOMESTIC_REGION: "enumerations/domesticRegion",
      GET_NETWORK_TYPE: "enumerations/networkType?REGION={region}",
      VERIFY_DOMESTIC_CLEARING_CODE: "financialInstitution/domesticClearingDetails/{domesticClearingCodeType}/{domesticClearingCode}",
      CREATE_GOAL_ACCOUNT: "goals"
    }
  };
});