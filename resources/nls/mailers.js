define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var MailboxLocale = function() {
    return {
      root: {
        pageTitle: {
          userGroupSubjectMap: "Mailers"
        },
        buttons: {
          createNew: "Create New",
          save: "Save",
          cancel: "Cancel",
          back: "Back",
          search: "Search",
          edit: "Edit",
          confirm: "Confirm",
          delete: "Delete",
          addUser: "Add List of User ID",
          addParty: "Add List of Party ID",
          close: "Close"
        },
        errorMsg: {
          noRecipient: "Select at least one Recepient",
          placeHolderAddUser: "Enter list of User ID",
          placeHolderAddParty: "Enter list of Party ID",
          message: "Enter commas (,) to separate"
        },
        fieldname: {
          mailerName: "Mailer Description",
          mailerId: "Mailer Code",
          sendDate: "Send Date",
          sendTime: "Send Time",
          immediately: "Immediately",
          setTime: "Set Time",
          sendTo: "Send To",
          priority: "Priority",
          low: "Low",
          medium: "Medium",
          high: "High",
          subject: "Subject",
          theme: "Theme",
          mailBody: "Mail Body",
          dateCreated: "Date Created",
          status: "Status",
          immediate: "Immediate",
          manual: "Manual",
          deleteMailerMsg: "Are you sure you want to delete this Mailer ?",
          deleteSuccessMessage: "Mailer deleted successfully",
          completed: "Completed",
          description: "Description",
          code: "Code",
          usersList: "List of User ID",
          partyList: "List of Party ID",
          emailContent: "Email Message",
          hour: "hh",
          minute: "mm",
          mailerNameValidation: "Please enter valid Mailer Name",
          mailerIdValidation: "Please enter valid Mailer Code",
          manualTrigger: "{hour} Hour(s) & {minute} Minute(s)",
          table: "Display table",
          SendDatettobe: "Send Date to be applied"
        },
        roles: {
          corp: "All Corporate Users",
          retail: "All Retail Users",
          admin: "All Bank Admin",
          user: "List of User ID",
          party: "List of Party ID"
        },
        headers: {
          Create: "Create",
          Mail: "Mail",
          recepients: "Recipients",
          View: "View",
          review: "Review",
          transactionName: "Mailer",
          transactionDeleteName: "Mailers",
          heading: "Mailers",
          deleteHeader: "Delete"
        },
        genericMailer: Generic.common
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
  return new MailboxLocale();
});