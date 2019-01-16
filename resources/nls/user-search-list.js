define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var UserSearchListLocale = function() {
    return {
      root: {
        header: {
          userList: "Search Results",
          fullName: "Full Name",
          userName: "User Name",
          contact: "Email / Mobile Phone",
          status: "Status",
          partyData: "Party ID / Name",
          details: "User List",
          channelAccess: "Channel Access",
          granted: "Granted",
          revoked: "Revoked",
          unlock: "Unlocked",
          lock: "Locked",
          userStatus: "User Status Maintenance",
          lockStatus: "Lock Status",
          reason: "Reason",
          userChannelAccess: "User Channel Access",
          reviewChannelAccess: "Review Channel Access",
          reviewUserStatus: "Review Lock Status",
          ariaLabel: "User Search Result List"
        },
        info: {
          channelAccessReviewHeaderMsg: "You Initiated a request for updating the channel access for the user. Please review details before you confirm!",
          lockStatusReviewHeaderMsg: "You Initiated a request for updating the lock status for the user. Please review details before you confirm!"
        },
        buttons: {
          submit: "Submit",
          cancel: "Cancel",
          confirm: "Confirm"
        },
        fieldname: {
          fullName: "Full Name",
          email: "Email",
          mobNumber: "Mobile Number",
          partyId: "Party ID",
          displayFullName: "{firstname} {lastname}"
        },
        generic: Generic
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
  return new UserSearchListLocale();
});
