define([], function() {
  "use strict";
  var GateWayLocale = function() {
    return {
      root: {
        merchant: {},
        wallet: {
          amount: "Amount :",
          aggregator: {
            OATlabel: "Pay By Oracle Banking",
            proceed: "Proceed"
          },
          origination: {
            details: {
              cardNumber: "Card Number",
              expiryDate: "Expiry Date",
              credit: "Credit Card",
              debit: "Debit Card",
              netbanking: "Net Banking",
              paytm: "Paytm",
              expirydate: "Expiry Date",
              cardHolderName: "Card holder Name",
              next: "Next",
              aggregators: "Aggregator",
              add: "Make Payment",
              creditDebitCard: "Credit/Debit Card",
              cancel: "Cancel",
              pay: "Pay now",
              CVV: "CVV/CVC",
              cre: "Pay by Credit Card",
              deb: "Pay by Debit Card",
              paymentdesc: "Payment Description",
              mobileNumber: "Mobile Number",
              relationshipNumber: "Relationship Number",
              emailAddr: "Email ID",
              paymentAmnt: "Payment Amount",
              ownaccount: "Oracle Banking",
              amount: "Amount"
            },

            placeholder: {
              salutation: "Salutation",
              firstName: "First Name",
              lastName: "Last Name",
              CVV: "cvv",
              gender: "Gender",
              email: "Email",
              password: "Password",
              confirmPassword: "Confirm Password",
              answer: "Answer",
              cardNumber: "Enter card number",
              cardHolderName: "Enter card holder Name",
              expiryMonth: "Month",
              expiryYear: "Year",
              selectbank: "Select Bank",
              amount: "Amount",
              month: "Month",
              year: "Year",
              username: "User Name",
              labelmonthCC: "month",
              labelyearCC: "year",
              labelmonthDC: "month",
              labelyearDC: "year"
            }
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
  return new GateWayLocale();
});