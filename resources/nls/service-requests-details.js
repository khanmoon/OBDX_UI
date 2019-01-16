define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var OriginationLocale = function() {
    return {
      root: {
        detail: {
          address: "Address",
          branchaddress: "Branch Address",
          reqDetails: "Request Details",
          userDetails: "User Details",
          statusHistory: "Transaction Journey",
          refNumber: "Reference No",
          dateRequested: "Date Requested",
          reqType: "Request Type",
          numberOfLeaves: "Number of Leaves",
          quantity: "Quantity",
          sendTo: "Send to",
          accountId: "Account Id",
          debitCardId: "Debit Card Id",
          reason: "Reason",
          userName: "Username",
          userId: "User ID",
          partyName: "Party ID",
          nameOnCard: "Name Embossed on Card",
          deliveryOption: "Delivery Option",
          dateOfBirth: "Date Of Birth",
          creditCardId: "Credit Card Id",
          repayMode: "Repay Mode",
          repaymentAmountType: "Repayment Amount Type",
          referenceId: "Reference Id",
          statementItemHash: "Statement ID",
          disputeReason: "Dispute Reason",
          CreditCardLimitType: "Credit Card Limit Type",
          reviewAddress: "{line1} {line2} {city}",
          reviewAddress2: "{line1}, {city}",
          reviewAddressStateZip: "{state} {zip}",
          reviewAddressCountryZip: "{state} {country} {zip}",
          reviewAddressRetail: "{line1} {line2} {city} {state} {zip}",
          bankCode: "Bank Code",
          nameBranch: "Branch Name",
          cashLimit: "Cash Limit",
          creditLimit: "Credit Limit",
          primaryCardNo: "Primary Credit Card No",
          supplementaryCardHolderRelationship: "Supplementary Card Holder Relationship",
          disbursementDate: "Disbursement Date",
          topUpAmount: "Top Up Amount",
          billingCycleDay: "Billing Cycle Day",
          embossingName: "Embossing Name",
          cardType: "Card Type",
          deliveryOptions: {
            COR: "Courier",
            BRN: "Branch"
          },
          debitCardApplyReason: {
            NC: "New Card",
            PCH: "Previous card was hotlisted",
            PCW: "Previous card not working"
          },
          repayModes: {
            A: "Auto",
            M: "Manual"
          },
          CreditCardLimitTypes: {
            CA: "Cash",
            CR: "Credit"
          },
          repaymentAmountTypes: {
            TOTALAMOUNTDUE: "Total Amount Due",
            MINIMUMAMOUNTDUE: "Minimum Amount Due",
            TAD: "Total Amount Due",
            MAD: "Minimum Amount Due"
          }
        },

        common: Generic
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
  return new OriginationLocale();
});
