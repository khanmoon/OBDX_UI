define(["ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/user-management-common",
  "ojL10n!resources/nls/accessible-entity"

], function(Generic, UMCommon, AccessibleEntity) {
  "use strict";
  var UserReadLocale = function() {
    return {
      root: {
        headers: {
          view: "View",
          personalinfo: "Personal Information",
          contacts: "Contact Details",
          limitrole: "Limits & Roles",
          status: "Status",
          usermanagement: "User Management",
          role: "Roles",
          edit: "Edit",
          others: "Other Details",
          resetCredentials: "Reset Credentials",
          deviceRegistration:"Device Registraion",
          pushNotification : "Push Notification",
          download: "Download",
          downloadFile: "Download profile",
          internalAccessPoints: "Touch Points"
        },
        buttons: {
          back: "Back",
          cancel: "Cancel",
          resetpassword: "Reset Password",
          edit: "Edit",
          yes: "Yes",
          no: "No",
          delete: "Delete",
          revoke: "Revoke"
        },
        fieldname: {
          username: "User Name",
          firstname: "First Name",
          lastname: "Last Name",
          email: "Email ID",
          mobilenumber: "Mobile Number",
          partyname: "Party Name",
          partyid: "Party ID",
          emailid: "Email ID",
          middlename: "Middle Name",
          userRole: "User Role",
          title: "Title",
          address1: "Address Line 1",
          address2: "Address Line 2",
          address3: "Address Line 3",
          address4: "Address Line 4",
          city: "City",
          state: "State",
          country: "Country",
          pincode: "Zip Code",
          dob: "Date of Birth",
          contactlandline: "Contact Number (Landline)",
          contactmobile: "Contact Number (Mobile)",
          organization: "Organization",
          manager: "Manager",
          empno: "Employee Number",
          userType: "User Type",
          role: "Roles",
          limit: "Limit",
          lockUser: "Lock User",
          lock: "Locked",
          unlock: "Unlocked",
          transactionName: "Reset Password",
          uuid: "Universally Unique ID",
          deleteUser: "Delete User",
          revokeUser: "Revoke User",
          accessibleentity: "Accessible Entity",
          entityName: "Entity Name",
          androidDevice: "Android Devices",
          iOsDevice: "iOS Devices",
          retailUser: "Retail User",
          selectAccessPoints: "Select Touch Points",
          selectedAccessPoints: "Selected Touch Points"

        },
        message: {
          confirmationMessage: "Are you sure you want to cancel this transaction ?",
          resetalert: "Are you sure you want to reset the password of this user?",
          noLimitAssigned: "No Limit attached to the user",
          deleteAlert: "Are you sure you want to delete the user?",
          revokeAlert: "Are you sure you want to revoke the deleted user?"
        },
        accessibleEntity: AccessibleEntity,
        generic: Generic,
        common: UMCommon
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
  return new UserReadLocale();
});
