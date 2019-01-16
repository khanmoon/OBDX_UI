define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/messages-access-management",
  "ojL10n!resources/nls/access-management-common",
  "ojL10n!resources/nls/access-management-headings"

], function(Messages, Generic, AccessMessages, AccessCommon, AccessHeadings) {
  "use strict";
  var OriginationLocale = function() {
    return {
      root: {
        pageTitle: {
          accessManagement: "{user} Account Access"
        },
        navLabels: {
          PartyLevel_description: "Account Transaction Mapping",
          UserLevel_title: "User",
          PartyLevel_title: "Party",
          UserLevel_description: "User Account Transaction Mapping",
          PartyLinkage_title: "Party to Party",
          PartyLinkage_description: "Party Linkage Account Transaction Mapping",
          CASA: "Current & Savings",
          Loans: "Loans",
          Loan:"Loan",
          TD: "Term Deposit",
          review: "Review"
        },
        info: {
          preferenceInfo: "No party preference set up done for this party",
          linkagePreferenceInfo: "No party preference set up done for the linked party",
          accountSetUp: "No accounts mapped for the linked party",
          parentSetUp: "No accounts mapped for the party",
          userParentSetUp: "Account Access not maintained for the Party",
          userLinkedParentSetUp: "Account Access not maintained for the Linked Party",
          userSetUp: "No Accounts mapped to the user",
          userLinkageSetUp: "No Accounts mapped to the user for this linked party",
          linkageParentChannelAccess: "Channel Access not maintained for the linked party",
          accountTransactionSetup: "Account Transaction not set for all modules!",
          reviewMessage: "You have initiated a account transactions mapping. Please review details before you confirm!"
        },
        headers: {
          Mappingmodules: "Account Types",
          defualtPrivacy: "Module Accessibility",
          ExceptionAccounts: "Accounts Exclusion",
          deleteConfirm: "Are you sure you want to delete?",
          headingLabel: "Corporate Account Mapping",
          newAccounts: "New Accounts",
          casaAccounts: "Current & Savings Account List",
          loanAccounts: "Loan Account List",
          tdAccounts: "Term Deposit Account List",
          existingAccounts: "Existing Accounts",
          create: "Create",
          view: "View",
          edit: "Edit",
          deleteHeader: "Delete",
          backHeader: "Back",
          continueConfirm: "Changing this mode of account mapping will reset all account mapping preferences.",
          confirm: "Do you want to continue?",
          AccountNumber: "Account Number",
          currency: "Currency",
          displayName: "Product Name",
          accountStatus: "Account Status",
          summary: "Mapping Summary",
          partyAcctSetupTransactionName: "Party Account Access",
          userAcctSetupTransactionName: "User Account Access",
          noAccountsAvailable: "There are no accounts opened for the selected party in this account type",
          ownAccount: "Own Account Mapping Summary",
          linkedpartyAccount: "Linked Party Account Mapping Summary",
          casacheckbox: "Casacheckbox",
          loancheckbox: "Loancheckbox",
          tdcheckbox: "Tdcheckbox",
          disclaimerClose: "Close the Disclaimer"
        },
        fieldname: {
          mappingType: "Type of mapping",
          partyID: "Party ID",
          partyName: "Party Name",
          casaMapping: "Current & Savings",
          tdMapping: "Term Deposits",
          loansMapping: "Loans",
          addException: "Add Exception",
          userID: "User ID",
          contact: "Contact Details",
          userName: "User Name",
          linkedParty: "Linked Party",
          fullName: "{firstName} {lastName}",
          moduleToMap: "Account Mapping",
          linkedModuleToMap: "Linked Party Account Mapping",
          ExceptionAccountNumbers: "Exception Account Number",
          totalAccts: "Total Number of Accounts",
          mappedAccts: "Number of Accounts Mapped",
          accountType: "Account Type",
          mapAccts: "Map Accounts",
          mapallAccts: "Map All Accounts",
          transMapping: "Transaction Mapping",
          linkedTransMapping: "Transaction Mapping for Linked Party Accounts",
          partyNameHeading: "{linkedPartyName}",
          linkedPartyID: "Linked Party ID",
          linkedPartyName: "Linked Party Name",
          parentPartyID: "Parent Party ID",
          parentPartyName: "Parent Party Name",
          fileUpload: "File Upload",
          payments: "Payments"
        },
        tasks: {
          Domestic_Payment: "Domestic Payment",
          Internal_Transfer: "Internal Transfer",
          International_Payment: "International Payment",
          Mixed_Payment: "Mixed Payment",
          Bill_Payment: "Bill Payment",
          Domestic_Demand_Draft: "Domestic Demand Draft",
          International_Demand_Draft: "International Demand Draft",
          Own_Account_Transfer: "Own Account Transfer"
        },
        common: AccessCommon,
        headings: AccessHeadings,
        messages: AccessMessages,
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
  return new OriginationLocale();
});
