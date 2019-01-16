define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/customer-preference-common",
  "ojL10n!resources/nls/customer-preference-field-name"
], function(Messages, Generic, Customer_Preference_Common, Customer_Preference_Fieldname) {
  "use strict";
  var CustomerPreferenceLocale = function() {
    return {
      root: {
        party: {
          partyID: "Party ID",
          partyName: "Party Name",
          UserLevel: "User Limits",
          CumulativeLevel: "Cumulative Limits",
          ApprovalType: "Approval Flow",
          channelAccess: "Channel Access",
          dealCreationAllowed: "Forex Deal Creation",
          GracePeriod: "Grace Period",
          Branding: "Corporate Branding",
          Approval: "Approval",
          Others: "Others",
          status: "Status",
          prefMaintained: "Preferences Maintained",
          enableCorpAdministrator: "Corporate Administrator Facility",
          maxUsers: "Allowed number of user creation",
          allowedRoles: "Accessible Roles",
          maxDays: "Maximum Allowed {maxGracePeriod}",
          days: "Days",
          gracePeriodDays: "{gracePeriod} Days",
          validPeriod: "Please enter valid period",
          noLimitsAssigned: "No Limit Packages have been assigned.",
          accessPointGroup: "Touch Points / Group",
          limitPackage: "Package"
    },
        info:{
          searchInfoHeader:"Note",
          searchInfoMessage:"User can search a party for which user preferences are to be viewed or edited. Parties can have different accesses, daily and cumulative limits and approval patterns. The limit packages mapped can also be accessed.",
          editInfoHeader:"Note",
          editInfoMessage:"Parties can have different accesses, daily and cumulative limits and approval patterns which can be set and modified here. Various limit packages are available which are mapped to a party. These preferences are set at party level and applicable for all users of the party. Various limit packages are available which are mapped to a party.",
          reviewCreateMessage:"You initaited a request for creating party preferences. Please review details before you confirm!",
          reviewEditMessage:"You initaited a request for editing party Preferences. Please review details before you confirm!"
        },
        headings: {
          details: "Details",
          changePreference: "Change Preferences",
          cpNotExist: "Party Preference Does Not Exist. Do you want to create it now?",
          createPreference: "Create Preferences",
          disableConfirm: "Are you sure you want to disable?",
          enableConfirm: "Are you sure you want to enable?",
          deleteConfirm: "Are you sure you want to delete?",
          savedSuccessfully: "Party Preferences Maintenance saved successfully.",
          transactionName: "Corporate Preferences",
          createtransactionName: "Create Party Preferences",
          modifytransactionName: "Update Party Preferences",
          partyPreferences: "Party Preferences",
          noApproval: "No Approval",
          sequential: "Sequential",
          parallel: "Parallel",
          noLimitGroupSelected: "No Limit Group Selected",
          nonSequential: "Non-Sequential",
          limitMessage: "Please ensure to map limit package for Touch Points applicable for this party."
        },
        placeHolders: {
          select: "Please Select"
        },
        common: Customer_Preference_Common,
        fieldname: Customer_Preference_Fieldname,
        messages: Messages,
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
  return new CustomerPreferenceLocale();
});
