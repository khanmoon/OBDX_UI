define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";
    var rdDeposit = function() {
        return {
            root: {
                rdDepositDetails: {
                    header: {
                        depositDetails: "Deposit Details"
                    },
                    pageHeader: {
                        accountDetails: "Account Details",
                        depositDetails: "Deposit Details",
                        maturityDetails: "Maturity Details"
                    },
                    accountDetails: {
                        custId: "Customer ID",
                        holdingPattern: "Holding Pattern",
                        jointAccHolder: "Joint Account Holder {count}",
                        status: "Status",
                        cardStatus: {
                            ACTIVE: "Active",
                            CLOSED: "Closed"
                        },
                        holdingPatternStatus: {
                            SINGLE: "Single",
                            JOINT: "Joint"
                        },
                        branch: "Branch",
                        nomination: "Nomination",
                        nomineeStatus: {
                            true: "Registered",
                            false: "Not Registered"
                        }
                    },
                    depositDetails: {
                        tenure: {
                            singular: {
                                month: "{n} Month",
                                year: "{n} Year"
                            },
                            plural: {
                                month: "{n} Months",
                                year: "{n} Years"
                            }
                        },
                        tenureDetail: "{years}, {months}",
                        depositStartDate: "Deposit Start Date",
                        depositTerm: "Deposit Term",
                        valueDate: "Value Date",
                        rateOfInterest: "Rate of Interest",
                        installmentAmount: "Installment Amount",
                        totalInstallments: "Total no. of Installments paid",
                        nextInstallmentDate: "Next installment Date",
                        penalty: "Penalty (If any)"
                    },
                    maturityDetails: {
                        rollOverType: {
                            A: "Close on Maturity"
                        },
                        maturityDate: "Maturity Date",
                        closeMaturityAmount :"Final Amount",
                        closingDate:"Closed Date",
                        maturityAmount: "Maturity Amount",
                        maturityInstruction: "Maturity Instruction",
                        payToMessage: "{percentage}% of {amountType} Amount",
                        payTo: "Pay to",
                        creditAccountNum: "Principal & Interest Credit Account Number",
                        payOutOption: {
            O: "Own Account",
            I: "Internal Account",
            E: "Domestic Bank Account"
          },
          amountType: {
            P: "Principal",
            I: "Interest"
          }
                    },
                    generic: Generic
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
    return new rdDeposit();
});