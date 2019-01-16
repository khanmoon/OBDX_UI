define([], function() {
  "use strict";
  var EditMailerLocale = function() {
    return {
      root: {
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
          deleteAlertMsg: "Are you sure you want to delete this Alert ?",
          successDeleteMessage: "Mailer Deleted successfully.",
          description: "Description",
          code: "Code",
          usersList: "List of User ID",
          partyList: "List of Party ID",
          emailContent: "Email Message",
          sendTo: "Send To",
          hour: "hh",
          minute: "mm",
          mailerNameValidation: "Please enter valid Mailer Name",
          mailerIdValidation: "Please enter valid Mailer ID"
        },
		roles: {
          corp: "All Corporate Users",
          retail: "All Retail Users",
          admin: "All Bank Admin",
          user: "List of User ID",
          party: "List of Party ID"

        },
		headers: {
          edit: "Edit",
          Mail: "Mail",
          recepients: "Recipients",
          View: "View",
          review: "Review",
          transactionName: "Edit Mailer",
          heading: "Mailers"
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
  return new EditMailerLocale();
});
