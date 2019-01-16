define([], function() {

  "use strict";
  var UserPrintInformationLocale = function() {
    return {
      root: {

        pageTitle: {
          userPrintInformation: "User Print Information",
          printPwd: "Print Password"
        },

        fieldname: {
          userType: "User Type",
          userName: "User Name",
          firstName: "First Name",
          lastName: "Last Name",
          emailId: "Email ID",
          mobileNumber: "Mobile Number",
          passwordType: "Password Type",
          showMoreOptions: "More Search Options",
          showLessOptions: "Less Search Options",
          partyId: "Party ID",
          passwordGenerationFromDate: "Password Generation From",
          passwordGenerationToDate: "Password Generation To",
          newpasswords: "New",
          resetPasswords: "Reset",
          allPasswords: "All",
          selectDocs: "Selected Documents",
          userlist: "Users"
        },
        messages: {
          userTypeMandatory: "Please select a User Type",
          invalidInfo: "Please provide the correct details",
          transactionName:"Password Print"
        },
        buttons: {
          search: "Search",
          cancel: "Cancel",
          clear: "Clear",
          print: "Print",
          ok: "Ok"
        },

        header: {
          userList: "User List",
          fullName: "Full Name",
          userName: "User Name",
          emailormobile: "Email/ Mobile",
          printStatus: "Print Status",
          ariaLabelName: "User Search Result List",
          documentList: "Select Documents"
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
  return new UserPrintInformationLocale();

});
