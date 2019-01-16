define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/trade-finance-common", "ojL10n!resources/nls/trade-finance-errors"], function(Generic, TradeFinanceCommon, TradeFinanceErrors) {
  "use strict";
  var BeneficiaryMaintenanceLocale = function() {
    return {
      root: {

        button: {
          create: "Create",
          editAll: "Edit All"
        },

        heading: {
          createBeneMaintenance: "Create Beneficiary",
          viewBeneMaintenance: "View Beneficiary",
          editBeneMaintenance: "Edit Beneficiary",
          transactionDeleteName: "Delete Beneficiary",
          beneficiaryDetails: "Beneficiary / Drawee Details",
          bankDetails: "Bank Details",
          beneMaintenance: "Beneficiary Maintenance",
          createConfirmBeneficiary: "You initiated a request for Create Beneficiary. Please review details before you confirm.",
          editConfirmBeneficiary: "You initiated a request for Edit Beneficiary. Please review details before you confirm."
        },

        confirmScreen: {
          deleteSuccessMessage: "Beneficiary has been deleted.",
          updateSuccessMessage: "Beneficiary details updated successfully.",
          createSuccessMessage: "Beneficiary added successfully.",
          corpMaker: "Create beneficiary submitted successfully.",
          pendingApproval: "Pending Approval",
          completed: "Completed",
          initiated: "Initiated"
        },

        labels: {
          beneficiaryName: "Beneficiary / Drawee Name",
          address: "Address",
          swiftCode: "Beneficiary / Drawee Bank Swift Code",
          bankName: "Bank Name",
          bankAddress: "Bank Address",
          nickName: "Nickname",
          accessType: "Access Type",
          applicability: "Applicability",
          LETTEROFCREDIT: "Letter Of Credit",
          COLLECTIONS: "Collections",
          GUARANTEE: "Guarantee",
          PRIVATE: "Private",
          PUBLIC: "Public",
          country: "Country",
          templateName: "Template Name",
          listofTemplates: "Template List Table",
          beneficiarySearchName: "Name or Nickname",
          swiftId: "Swift Code",
          deleteBeneficiaryMsg: "Are you sure you want to delete this Beneficiary ?"
        },

        generic: Generic,
        common: TradeFinanceCommon,
        tradeFinanceErrors: TradeFinanceErrors

      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new BeneficiaryMaintenanceLocale();
});
