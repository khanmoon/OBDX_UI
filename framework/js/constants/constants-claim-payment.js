define([], function() {
  "use strict";
  return {
    URL: {
      VERIFY_SECURITYCODE: "payments/transfers/peerToPeer/receiverValidation",
      CREATE_GLOBAL_PAYEE: "payments/transfers/peerToPeer/user",
      VERIFY_GLOBAL_PAYEE: "payments/transfers/peerToPeer/user/authentication",
      READ_GLOBAL_PAYEE: "payments/transfers/peerToPeer/user?type={aliasType}&value={aliasValue}",
      UPDATE_GLOBAL_PAYEE: "payments/transfers/peerToPeer/user",
      CONFIRM_P2P_PAYMENT: "payments/transfers/peerToPeer/user/{paymentId}",
      GET_BRANCHES: "locations/country/all/city/all/branchCode/",
      VERIFY_DOMESTIC_CLEARING_CODE: "financialInstitution/domesticClearingDetails/{domesticClearingCodeType}/{domesticClearingCode}"
    }
  };
});