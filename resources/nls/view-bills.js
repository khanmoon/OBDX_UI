define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/document-details", "ojL10n!resources/nls/shipment-details",
    "ojL10n!resources/nls/instruction-details", "ojL10n!resources/nls/trade-finance-errors",
    "ojL10n!resources/nls/trade-finance-common", "ojL10n!resources/nls/lc-details"
  ],
  function(Generic, documentDetails, shipmentDetails, instructionsDetails, tradeFinanceErrors, tradeFinanceCommon, lcDetails) {
    "use strict";
    var ViewBillDetailsLocale = function() {
      return {
        root: {
          common: tradeFinanceCommon,
          general: {
            address: "Address",
            baseDate: "Base Date",
            billOperation: "Bill Operation",
            collectingBank: "Collecting Bank",
            contractStatus: "Contract Status",
            country: "Country",
            dateRecieved: "Date Received",
            daysFrom: "Days From",
            draweeName: "Drawee Name",
            drawerName: "Drawer Name",
            lcNo: "LC Number {lcNumber}",
            linkedTo: "Linked To",
            lodgementDate: "Lodgement Date",
            outstandingAmount: "Outstanding Amount",
            product: "Product",
            remittingBank: "Remitting Bank",
            tenor: "Tenor",
            billTables: "Searched List for Bills"
          },
          discrepancies: {
            receivedDate: "Received Date",
            resolvedDate: "Resolved Date",
            approvedDate: "Approved Date",
            resolved: "Resolved",
            unresolved: "Unresolved",
            listOfDiscrepancies: "List Of Discrepancies"
          },
          labels: {
            billRefNo: "Bill Reference Number",
            drawee: "Drawee",
            drawer: "Drawer",
            description: "Description",
            billAmount: "Bill Amount",
            billDate: "Bill Date",
            releaseAgainst: "Release Against",
            transactionDate: "Transaction Date",
            liquidated: "Liquidated",
            billNumber: "Bill Number {billNumber}",
            billNo: "Bill Number",
            fromToAmountMsg: "From amount can not be greater than to amount",
            draweeDetails: "Drawee Details",
            drawerDetails: "Drawer Details",
            paymentType: "Payment Type",
            draweeName: "Drawee Name",
            drawerName: "Drawer Name",
            custRefNo: "Customer Reference Number",
            bankRefNo: "Bank Reference Number",
            searchImportBills: "Search Import Bills",
            searchExportBills: "Search Export Bills"
          },
          postShipmentFinance: {
            refNo: "Reference Number",
            type: "Type",
            amountRaised: "Amount Raised",
            outstandingAmount: "Outstanding Amount"
          },
          leftMenu: {
            viewBillMenu: "View Bill Menu",
            postShipmentFinance: "Post Shipment Finance",
            viewAdvice: "Advice",
            viewAttachedDocuments: "Attached Documents",
            viewBillDetails: "View Bill Details",
            viewSwiftMessages: "SWIFT Messages",
            discrepancies: "Discrepancies"
          },
          heading: {
            exportBills: "View Export Bill",
            general: "General Bill Details",
            generalLinkedWithOutLC: "General Bill Details (Status:{status})",
            generalLinkedWithLC: "General Bill Details (Linked To LC Number {lcNumber}, Status: {status})",
            importBills: "View Import Bill",
            documents: "Documents",
            shipmentDetails: "Shipment Details",
            instructions: "Instructions"
          },
          instructionsDetails: instructionsDetails,
          statusDate: {
            acceptanceDate: "Acceptance Date",
            maturityDate: "Maturity Date",
            settlementDate: "Settlement Date"
          },
          lcDetails: lcDetails,
          shipmentDetails: shipmentDetails,
          documents: documentDetails,
          generic: Generic,
          tradeFinanceErrors: tradeFinanceErrors
        },
        en: false,
        "en-us": false
      };
    };
    return new ViewBillDetailsLocale();
  });