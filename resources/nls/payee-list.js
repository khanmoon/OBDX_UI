define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var BeneficiaryLocale = function() {
    return {
      root: {
        beneficiaryDetails: {
          labels: {
            title: "Payees",
            create: "Add New",
            accounts: "Accounts",
            dd: "Demand Drafts",
            placeholderName: "Payee Name"
          }
        },
        tableHeaders: {
          beneficiaryName: "Payee Name",
          accountType: "Account Type",
          accountDetails: "Account Details",
          nickName: "Nickname",
          createdBy: "Created By",
          transactionType: "Transaction Type",
          draftFavour: "Draft Favouring",
          tableHeader: "Payee Details List"
        },
        networktype: {
          SWI: "SWIFT Code",
          NAC: "National Clearing Code",
          SPE: "Bank Details",
          SWIFT: "SWIFT Code",
          SORT: "SORT Code",
          BANK: "Bank Details",
          NEFT: "NEFT",
          RTGS: "RTGS",
          "Card Payment": "Card Payment",
          "Credit Transfer": "Credit Transfer"
        },
        payee: {
          deletesuccess: "{name} Account was deleted.",
          internalaccount: "Internal Account",
          myaddress: "My Address",
          branchaddress: "Branch Address",
          creatorName: "{firstName} {lastName}",
          recipientname: "Payee Name",
          accounttype: "Account Type",
          accountDetails: "Account Details",
          accountnickname: "Nickname",
          createdBy: "Created By",
          availableFor: "Access Type",
          drafttype: "Draft Type",
          draftfavouring: "Draft Favouring",
          accounts: "Accounts",
          dd: "Demand Drafts",
          linkDetails: "{name}",
          DOMESTIC: "Domestic",
          INTERNAL: "Internal",
          INTERNATIONAL: "International",
          DEMANDDRAFTINT: "International",
          DEMANDDRAFTDOM: "Domestic",
          PEERTOPEER: "Peer to peer",
          SHARED: "Public",
          NONSHARED: "Private",
          navBarDescription: "Payee List"

        },
        common: {
          create: "Create",
          cancel: "Cancel"
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
  return new BeneficiaryLocale();
});