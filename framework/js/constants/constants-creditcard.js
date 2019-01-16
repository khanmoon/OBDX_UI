define([], function() {
  "use strict";
  return {
    CREDIT_CARD_CONSTANT: {
      CREDITCARD_MASKING_FORMAT: "NNNN NNXX XXXX NNNN"
    },
    CARD_SERVICE_URL: {
      URL: {
        CREDIT_CARDS: "accounts/cards/credit?expand=ALL",
        CREDIT_CARD_UNBILLED_STATEMENT: "accounts/cards/credit/{cardId}/statements?type=UNBILLED",
        CREDIT_CARD_BILLED_STATEMENT: "accounts/cards/credit/{cardId}/statements",
        CREDIT_CARD_BILLED_STATEMENT_MONTH: "accounts/cards/credit/{cardId}/statements?statementYear={year}&statementMonth={month}",
        VERIFY_CREDIT_CARD_PAYMENT: "payments/transfers/creditCard",
        CONFIRM_CREDIT_CARD_PAYMENT: "payments/transfers/creditCard/{paymentId}",
        CONFIRM_CREDIT_CARD_PAYMENT_WITHAUTH: "payments/transfers/creditCard/{paymentId}/authentication",
        CREDIT_BILLCYCLE_DATES: "enumerations/billcycles",
        CREDIT_LIMIT: "accounts/cards/credit/{creditCardId}/limit",
        CREDIT_BLOCK: "accounts/cards/credit/{creditCardId}/status",
        CREDIT_CANCEL: "accounts/cards/credit/{creditCardId}/status",
        CREDIT_ACTIVATE: "accounts/cards/credit/{creditCardId}/status",
        CREDIT_RELATION: "parties/{partyId}/relations",
        CREDIT_ADDON: "accounts/cards/credit/{creditCardId}/supplementary",
        CREDIT_REPLACE: "accounts/cards/credit/{creditCardId}/replace",
        CREDIT_BILLCYCLE: "accounts/cards/credit/{creditCardId}/billcycle",
        CREDIT_SERVICE_REQUEST: "servicerequest?status=PE&entity=CR",
        BANK_CONF: "bankConfiguration",
        CREDIT_PIN_REQUEST: "accounts/cards/credit/{creditCardId}/credentials"
      }
    }
  };
});