define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/document-details", "ojL10n!resources/nls/lc-details", "ojL10n!resources/nls/instruction-details",
    "ojL10n!resources/nls/shipment-details", "ojL10n!resources/nls/trade-finance-errors", "ojL10n!resources/nls/trade-finance-common"
  ],
  function(Generic, documentDetails, lcDetails, instructionsDetails, shipmentDetails, tradeFinanceErrors, tradeFinanceCommon) {
    "use strict";
    var InitiateCollectionLocale = function() {
      return {
        root: {
          common: tradeFinanceCommon,
          labels: {
            initiateCollection: "Initiate Collection",
            applicationDate: "Application Date",
            custRefNo: "Customer Reference Number",
            bankRefNo: "Bank Reference Number",
            draweeDetails: "Drawee Details",
            drawerDetails: "Drawer Details",
            draweeName: "Drawee Name",
            drawerName: "Drawer Name",
            collectingBankDetails: "Collecting Bank Details",
            swiftCode: "SWIFT Code",
            draweeBankName: "Drawee Bank Name",
            lcNumber: "LC Number",
            paymentDetails: "Payment Details",
            selectPaymentType: "Select Payment Type",
            paymentType: "Payment Type",
            lcDetails: "LC Details",
            lcLinkage: "LC Linkage",
            continueInitiate: "Do you want to continue initiating Collection?"
          },
          generic: Generic,
          heading: {
            attachments: "Attachments",
            documents: "Documents",
            collectionInitiation: "Initiate Collection",
            instructions: "Instructions",
            parties: "Collection Details",
            shipmentDetails: "Shipment Details",
            confirmCollection: "You initiated a request for Collection Initiation. Please review details before you confirm."
          },
          lcDetails: lcDetails,
          instructionsDetails: instructionsDetails,
          shipmentDetails: shipmentDetails,
          tradeFinanceErrors: tradeFinanceErrors,
          documents: documentDetails,
          tnc: {
            tncContent: "<div><p>The User accepts that he/she will be responsible for keying in the correct account number/other particulars of the beneficiary for the application. In no case, the Bank will be held liable for any erroneous transactions incurred arising out of or relating to the User entering wrong / incorrect / incomplete account number, information of the beneficiary and/or any other particulars.The User unconditionally agrees that he/she shall not hold the Bank liable for:</p><ol>  <li>Such transactions that are carried out on his/her instructions by the Bank in good faith.</li><br><li>Not carrying out such instructions where the Bank has reason to believe (which decision of the Bank he/she shall not question/dispute) that the instructions are not genuine or are otherwise unclear, improper, vague or doubtful.</li><br><li>Accepting instructions given by any one of the Users in case customer having multiple users.</li><br><li>For any loss or damage incurred or suffered by him/her due to any error, defect, failure or interruption in the provision of bill payment services arising from or caused by any reason whatsoever.</li><br><li>Withdrawing/suspending the facility wholly/partially. However the Bank will endeavor to notify the User through its website or through any legally recognized medium of communication or otherwise as found suitable by the Bank.</li><br></div><div>The User agrees that the record of instructions given and transactions with the Bank shall be conclusive proof and binding for all purposes and can be used as evidence in any proceedings. The Applicant shall pay the Bank on demand its fees, in respect of the Credit or in respect of services in relation to the Credit in such amounts or at such rates as are established and as may be varied from time to time by the Bank and as are set out in the Bank's schedule of charges current at the time of the Bank's demand for its fees or as may be otherwise agreed in writing between the Bank and the Applicant and in such currency as the Bank may determine to be appropriate.<br></div>"
          }
        },
        ar: false,
        en: false,
        "en-us": false
      };
    };
    return new InitiateCollectionLocale();
  });
