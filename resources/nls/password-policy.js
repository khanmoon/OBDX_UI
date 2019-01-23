define([], function() {
  "use strict";
  var LocationSearchLocale = function() {
    return {
      root: {
        pageTitle: {
          header: "Password Policy Maintenance",
          deleteHeader: "Delete Password Policy"
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
          days: "Days",
          addTitle: "Add New",
          specialCharAllowed: "Allowed Special Characters",
          expiryDays: "{expiryDays} days",
          updateReviewHeaderMsg:"You Initiated a request for updating the Password Policy. Please review details before you confirm!",
          addReviewHeaderMsg:"You Initiated a request for creating the Password Policy. Please review details before you confirm!"
        },
        buttons: {
          cancel: "Cancel",
          clear: "Clear",
          search: "Search",
          create: "Create",
          edit: "Edit",
          delete: "Delete",
          back: "Back",
          save: "Save",
          yes: "Yes",
          no: "No",
          confirm: "Confirm",
          ok: "Ok"
        },
        exclusionDetail: {
          dob: "Date of Birth",
          firstname: "First Name",
          lastname: "Last Name",
          userid: "User Id",
          partyid: "Party Id",
          dobDisplay: "dob",
          firstnameDisplay: "firstname",
          lastnameDisplay: "lastname",
          useridDisplay: "userid",
          partyidDisplay: "partyid"
        },
        message: {
          noRecordFound: "No record found matching the criteria",
          deletePasswordPolicy: "Are you sure you want to delete this password policy?",
          invalidEntry: "Enter only one character at a time",
          invalidTextLength: "Enter a shorter word",
          enterGreaterValue: "Enter a value greater than or equal to {min}",
          enterMinimumValue: "Enter a value less than or equal to {max}",
          invalidListEntry: "Enter a value from list",
          unsupportedOperation: "This operation is not supported",
          allowedChar : "Please allow at least one of the character type.",
          onlyNumeric : "Please enter only numeric values",
          upperMandatoryCount : "Upper Case character count should be greater than 0",
          lowerMandatoryCount : "Lower Case character count should be greater than 0",
          specialCharMandatoryCount : "Special character count should be greater than 0",
          numberMandatoryCount : "Numbers count should be greater than 0",
          specialCharListError : "Please enter at least one value for allowed special character.",
          pwdExpiryPeriodCheck: "Password Expiry Period should be greater than Password Expiry Warning Period"
        },
        header: {
          details: "Password Policy Search Results",
          transactionName: "Password Policy",
          view: "View Password Policy",
          pwdValidators: "Password Validators",
          pwdExpiryParams: "Password Expiry Parameters",
          createPolicy: "Create New Password Policy",
          updatePolicy: "Edit Password Policy",
          reviewPwdPolicy: "Review Password Policy"
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new LocationSearchLocale();
});
