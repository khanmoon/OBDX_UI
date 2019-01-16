define([], function() {
  "use strict";
  var ReportsLogLocale = function() {
    return {
      root: {
        reportsDetails: {
          labels: {
            title: "Reports",
            viewAll: "View All",
            reportList: "Report Details",
            noData: "New Reports Not Available",
            subData: "Access your recently generated reports form here",
            status: {
              PROCESSED: "Processed",
              PENDING: "Pending",
              ERROR: "Error"
            }
          },
          reportDescription: {
            A16: "Epi Payment reconciliation Report",
            A11: "File Identifier wise Party User Mapping Report",
            A12: "Party User wise File Identifiers Mapping Report",
            A13: "Party wise User Groups Report",
            A7: "Party wise Approval Rules Report",
            A9: "Party wise File Identifiers Mapping Report",
            A10: "Party wise Payee Maintenance Report",
            C6: "Party User wise File Identifiers Mapping Report",
            C4: "Party wise Payee Maintenance Report",
            C3: "Party wise File Identifiers Mapping Report",
            C7: "Party wise User Groups Report",
            A6: "Wallet Transaction Activity Report",
            C1: "Party wise Workflows Report",
            C2: "Party wise pending Approvals list Report",
            A1: "Date wise User creation Report",
            A2: "Resources Child Role Mapping Report",
            A3: "Wallets KYC Report",
            A4: "Wallets creation for a Date Range Report",
            A8: "Party wise pending Approvals list Report",
            A14: "Party wise Workflows Report",
            U3: "Daily Balance Position Report",
            U4: "Transaction Summary Report",
            U1: "Party wise pending Approvals list Report",
            U2: "Party wise Payee Maintenance Report"
          },
          transactionTypes: {
              RT_N_CAC: "Create Corporate Admin Report",
              RT_N_CAD: "Delete Corporate Admin Report",
              RT_N_CAR: "Request Admin Report",
              RT_N_CAU: "Update Corporate Admin Report",
              RT_N_CUR: "Request User Report",
              RT_N_DAR: "Cancel Admin Report",
              RT_N_DUR: "Cancel User Report",
              RT_N_UAR: "Update Admin Report",
              RT_N_UUM: "Update User Report Mapping",
              RT_N_UUR: "Update User Report"

         }
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
  return new ReportsLogLocale();
});
