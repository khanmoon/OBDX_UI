define([], function() {
  "use strict";
  var ReviewMailerEditLocale = function() {
    return {
      root: {
        pageTitle: {
          header: "Mailer"
        },
        headers: {
          mail: "Mail",
          recepients: "Recipients",
          review: "Review",
          transactionName: "Mailer",
          heading: "Mailers"
        },
        errorMsg: {
          placeHolderAddUser: "Enter list of User ID",
          placeHolderAddParty: "Enter list of Party ID",
          message: "Enter commas (,) to separate"
        },
        fieldname: {
          mailerName: "Mailer Description",
          mailerId: "Mailer Code",
          activationDate: "Send Date",
          sendTime: "Send Time",
          immediately: "Immediately",
          setTime: "Set Time",
          priority: "Priority",
          low: "Low",
          medium: "Medium",
          high: "High",
          subject: "Subject",
          theme: "Theme",
          mailBody: "Mail Body",
          dateCreated: "Date Created",
          sendTo: "Send To",
          usersList: "List of User ID",
          partyList: "List of Party ID",
          emailContent: "Email Message",
          manualTrigger: "{hour} Hour(s) & {minute} Minute(s)",
          listofuserid: "List of User to send",
          listofpartyid: "List of Party to send"
        },
        roles: {
          corp: "All Corporate Users",
          retail: "All Retail Users",
          admin: "All Bank Admin"
        },
        buttons: {
          cancel: "Cancel",
          confirm: "Confirm",
          edit: "Edit",
          ok: "Ok"
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new ReviewMailerEditLocale();
});