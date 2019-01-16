define([], function() {
  "use strict";
  return {
    URL: {
      GET_MERCHANT_TRANSFER_DATA: "payments/transfers/merchantTransferData?epiRefId={epiRefId}",
      GET_MERCHANT_DATA: "payments/merchants/{merchantCode}",
      INITIATE_EXTERNAL_PAYMENT: "payments/transfers/external",
      VERIFY_EXTERNAL_PAYMENT: "payments/transfers/external/{paymentId}",
      GET_DOMESTIC_CURRENCY: "enumerations/domesticCurrency",
      INITIATE_EXTERNAL_PAYMENT_VERIFICATION: "payments/transfers/external/verification",
      GET_EXTERNAL_PAYMENT_VERIFICATION: "payments/transfers/external/verification/{verifyId}"
    }
  };
});