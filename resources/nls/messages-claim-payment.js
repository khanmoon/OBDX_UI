define([], function() {
  "use strict";
  var MessagesClaimPaymentLocale = function() {
    return {
      root: {
        peertopeer: {
          email: "Please enter a valid email ID",
          mobileNumber: "Please enter valid mobile number",
          securityCode: "Please enter valid security code",
          placeHolderEmail: "Enter Email id",
          placeHolderMobile: "Enter mobile number",
          placeHolderAmount: "Enter Amount",
          placeHolderPurpose: "Enter Purpose",
          placeHolderRemarks: "Enter Remarks",
          firstName: "Enter valid first name",
          lastName: "Enter valid last name",
          phoneNumber: "Enter valid phone number",
          userName: "Enter valid user name",
          password: "Enter valid password",
          passwordPolicy: "Password should contain at least 1 uppercase letter,1 lowercase letter,1 numeric,1 special character and minimum 8 character",
          otp: "Please enter valid OTP",
          accountId: "Please enter valid account number",
          bankCode: "Please enter valid bank code"
        },
        blank: {
          mobile: "Please enter mobile number",
          email: "Please enter email id",
          securityCode: "Please enter security code",
          aliasType: "Please select Alias Type",
          firstName: "Please enter first name",
          lastName: "Please enter last name",
          mobileNumber: "Please enter mobile number",
          phoneNumber: "Please enter Phone number",
          userName: "Please enter user name",
          password: "Please enter password",
          accountId: "Please enter account number",
          bankCode: "Please enter bank code",
          payeeType: "Please select Payee Type"
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
  return new MessagesClaimPaymentLocale();
});