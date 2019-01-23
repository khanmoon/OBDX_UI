define([], function() {
  "use strict";
  var LocationSearchLocale = function() {
    return {
      root: {
        pageTitle: {
          header: "Password Policy Maintenance"
        },
        fieldname: {
          policyName: "Policy Name",
          policyDesc: "Policy Description",
          userType: "User Type",
          pwdValidators: "Password Validators",
          passwordLength: "Password Length",
          allowedChar: "Allowed Characters",
          upperCase: "Upper Case",
          lowerCase: "Lower Case",
          number: "Numbers",
          specialChar: "Special Characters",
          allowed: "Allowed",
          mandatory: "Mandatory",
          specialCharList: "Allowed Special Characters",
          exclusionDetail: "Exclusion Details in Password",
          restrictedPwd: "Restricted Passwords",
          repetitiveChar: "Repetitive Characters Allowed",
          successiveChar: "Successive Characters Allowed",
          previousPwdDisallowed: "Previous Password Disallowed",
          successiveInvalid: "Successive Invalid Login Allowed",
          pwdExpiryPeriod: "Password Expiry Period in Days",
          firstPwdExpiry: "First Password Expiry Period in Days",
          pwdExpiryWarning: "Password Expiry Warning Period in Days",
          forcePwdChange: "Force Password Change with Policy Change",
          min: "min",
          max: "max",
          Days: "Days",
          expiryDays: "{expiryDays} days"
        },
        hintMessages: {
          enterGreaterValue: "Enter a value greater than or equal to {min}",
          enterMinimumValue: "Enter a value less than or equal to {max}",
          invalidEntry: "Enter only 1 character at a time",
          invalidTextLength: "Enter word of shorter length",
          invalidListEntry: "Enter value from list"
        },
        buttons: {
          cancel: "Cancel",
          create: "Create",
          save: "Save",
          back: "Back",
          confirm: "Confirm",
          edit: "Edit"
        },
        exclusionDetail: {
          dob: "Date of Birth",
          firstname: "First Name",
          lastname: "Last Name",
          userid: "User Id",
          partyid: "Party Id"
        },
        header: {
          transactionName: "Password Policy",
          pwdValidators: "Password Validators",
          pwdExpiryParams: "Password Expiry Parameters",
          createPolicy: "Create New Password Policy",
          reviewPwdPolicy: "Review Password Policy"
        },
        error: {
          minimumLength: "Policy minimum length can not be greater than maximum length!",
          expiryPeriod: "Policy expiry warning period can not be greater than expiry period!",
          allowedChar: "Please allow at least one of the character type.",
          onlyNumeric: "Please enter only numeric values",
          upperMandatoryCount: "Upper Case character count should be greater than 0",
          lowerMandatoryCount: "Lower Case character count should be greater than 0",
          specialCharMandatoryCount: "Special character count should be greater than 0",
          numberMandatoryCount: "Numbers count should be greater than 0",
          specialCharListError: "Please enter at least one value for allowed special character.",
          pwdExpiryPeriodCheck:"Password Expiry Period should be greater than Password Expiry Warning Period"
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new LocationSearchLocale();
});
