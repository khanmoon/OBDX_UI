define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/document-details", "ojL10n!resources/nls/lc-details",
    "ojL10n!resources/nls/instruction-details", "ojL10n!resources/nls/shipment-details",
    "ojL10n!resources/nls/trade-finance-errors", "ojL10n!resources/nls/trade-finance-common"
  ],
  function(Generic, documentDetails, lcDetails, instructionsDetails, shipmentDetails, tradeFinanceErrors, tradeFinanceCommon) {
    "use strict";
    var LCViewDetailsLocale = function() {
      return {
        root: {
          common: tradeFinanceCommon,
          labels: {
            searchImportLC: "Search Import LC",
            searchExportLC: "Search Export LC",
            lcDrawingStatus: "LC Drawing Status",
            lcStatus: "LC Status",
            lcNo: "LC Number",
            outstandingAmount: "Outstanding LC Amount",
            availments: "Availments",
            availment: "Availment Number",
            availmentWithNumber: "Availment Number {availmentNumber}",
            description: "Description",
            newAmount: "Amount(New)",
            prevValueLabel: "Previous value: {prevValueLabel}",
            expiryStatus: "Expiry Status",
            confirmingBank: "Confirming Bank",
            lcNumber: "LC Number {lcNumber}",
            reimbursingBank: "Reimbursing Bank",
            LcType: "LC Type",
            outstandingLcBalance: "LC outstanding Balance",
            swiftCode: "Swift",
            bankName: "Name",
            account: "Account",
            lcCommision: "Commission",
            comissionWithPercent: "{comission} %",
            lcCommitment: "Commitment",
            total: "Total",
            totalCharges: "Total Charges",
            totalCommission: "Total Commission",
            advisingThroughBank: "Advising Through Bank",
            advisingBank: "Advising Bank",
            percentage: "Percentage",
            reversed: "Reversed",
            initiateAmendment: "Initiate Amendment",
            initiate: "Initiate",
            lcNoWithAmendNoStatus: "LC Number {lcNumber} [Amendment Number:{amendmentNumber}, Status:{status}]",
            lcNoWithAmendNo: "LC Number {lcNumber} [Amendment Number:{amendmentNumber}]",
            exportTable: "Export LC Table",
            importTable: "Import LC Table",
            billTable: "Bill Table",
            initiateBill: "Initiate Bill",
            amendmentNumber: "Amendment Number {amendmentNumber}",
            bgNumber: "Guarantee Number {lcNumber}"
          },
          drawingStatusArray: {
            Partial: "Partial",
            Full: "Full",
            Undrawn: "Undrawn",
            expired: "Expired"
          },
          expiryStatusArray: {
            notexpired: "Not Expired"
          },
          leftMenu: {
            amendments: "Amendments",
            viewAttachedDocuments: "Attached Documents",
            viewLCDetails: "View LC Details",
            viewSwiftMessages: "Swift Messages",
            bills: "Bills",
            charges: "Charges",
            guarantee: "Guarantee",
            viewAdvice: "Advice",
            banks: "Banks"
          },
          heading: {
            importLC: "View Import LC",
            exportLC: "View Export LC",
            initiateLC: "Initiate Letter Of Credit",
            customerAcceptance: "Customer Acceptance",
            documents: "Documents",
            instructions: "Instructions",
            general: "General",
            shipment: "Shipment",
            resolution: "Resolution",
            importLCAmendment: "View Import LC Amendment",
            exportLCAmendment:"View Export LC Amendment",
            initiateLCAmendment: "Initiate Import LC Amendment",
            reviewMsg: "You initiated a request for LC Amendment. Please review details before you confirm.",
            amendLC: "You initiated a LC Amendment Initiation request. Please review details before you confirm."
          },
          bills: {
            inwardBillNo: "Inward Bill Number",
            dateReceived: "Date Received",
            negoRefNo: "Negotiation Ref No",
            negoDate: "Negotiation Date",
            billAmount: "Bill Amount",
            viewLCBills: "View LC Bills"
          },
          guarentee: {
            refNo: "Guarantee Reference No",
            date: "Date of Guarantee",
            amount: "Amount",
            awbNo: "B/L (AWB) Number",
            guaranteeTable: "Guarantee Table"
          },
          resolution: {
            accept: "Accept",
            reject: "Reject"
          },
          documents: documentDetails,
          generic: Generic,
          lcDetails: lcDetails,
          instructionsDetails: instructionsDetails,
          shipmentDetails: shipmentDetails,
          tradeFinanceErrors: tradeFinanceErrors,
          tnc: {
            tncContent: "<div><p>The User accepts that he/she will be responsible for keying in the correct account number/other particulars of the beneficiary for the application. In no case, the Bank will be held liable for any erroneous transactions incurred arising out of or relating to the User entering wrong / incorrect / incomplete account number, information of the beneficiary and/or any other particulars.The User unconditionally agrees that he/she shall not hold the Bank liable for:</p><ol>  <li>Such transactions that are carried out on his/her instructions by the Bank in good faith.</li><br><li>Not carrying out such instructions where the Bank has reason to believe (which decision of the Bank he/she shall not question/dispute) that the instructions are not genuine or are otherwise unclear, improper, vague or doubtful.</li><br><li>Accepting instructions given by any one of the Users in case customer having multiple users.</li><br><li>For any loss or damage incurred or suffered by him/her due to any error, defect, failure or interruption in the provision of bill payment services arising from or caused by any reason whatsoever.</li><br><li>Withdrawing/suspending the facility wholly/partially. However the Bank will endeavor to notify the User through its website or through any legally recognized medium of communication or otherwise as found suitable by the Bank.</li><br></div><div>The User agrees that the record of instructions given and transactions with the Bank shall be conclusive proof and binding for all purposes and can be used as evidence in any proceedings. The Applicant shall pay the Bank on demand its fees, in respect of the Credit or in respect of services in relation to the Credit in such amounts or at such rates as are established and as may be varied from time to time by the Bank and as are set out in the Bank's schedule of charges current at the time of the Bank's demand for its fees or as may be otherwise agreed in writing between the Bank and the Applicant and in such currency as the Bank may determine to be appropriate.<br></div>"
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
    return new LCViewDetailsLocale();
  });
