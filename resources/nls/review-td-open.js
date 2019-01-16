define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";
    var ReviewTermDepositAmend = function() {
        return {
            root: {
                common: {
                    reviewHeader: "You initiated a request for New Deposit. Please review details before you confirm!",
                    review: "Review",
                    maturityInstructions: {
                        maturityInstruction: "Maturity Instruction",
                        CON: {
                            A: "Close on Maturity",
                            I: "Renew Principal and Interest",
                            P: "Renew Principal and Pay Out the Interest",
                            S: "Renew Special Amount and Pay Out the Remaining Amount",
                            T: "Renew Interest and Pay Out the Principal"
                        },
                        ISL: {
                            A: "Close on Maturity",
                            I: "Renew Principal and Profit",
                            P: "Renew Principal and Pay Out the Profit",
                            S: "Renew Special Amount and Pay Out the Remaining Amount",
                            T: "Renew Profit and Pay Out the Principal"
                        },
                        revisedMaturityInstruction: "Revised Maturity Instruction"
                    },
                    termDpositHeader: "New Deposit"
                },
                depositDetail:{
                  tenure: {
                    singular: {
                      month: "{n} Month",
                      year: " {n} Year",
                      day: " {n} Day"
                    },
                    plural: {
                      month: "{n} Months",
                      year: "{n} Years",
                      day: " {n} Days"
                    }
                  },
                  tenureDetail: "{years}, {months}, {days}"
                },
                nominationDetails: {
                    nominationDetails: "Nomination Details",
                    nomination: "Nomination",
                    nominationStatus: {
                        true: "Registered",
                        false: "Not Registered"
                    }
                },
                transactions: {
                    openTermDeposit: {
                        primaryAccHolder: "Primary Account Holder",
                        jointAccHolder: "Joint Account Holder {accountHolder}",
                        holdingPattern: "Holding Pattern",
                        holdingPatternType: {
                          SINGLE: "Single",
                          JOINT: "Joint"
                        }
                    },
                    termDepositDetails: {
                        depositDetails: {
                            revisedMaturity: "Revised Maturity Amount",
                            sourceAccount: "Source Account",
                            depositDetails: "Deposit Details",
                            depositAmount: "Deposit Amount",
                            maturityDate: "Maturity Date",
                            interestRate: "Rate of Interest",
                            profitRate: "Profit Rate",
                            maturityAmount: "Maturity Amount",
                            holdingDetails: "Holding Details",
                            tdProduct: "Term Deposit Product",
                            maturityDetails: "Maturity Details",
                            depositTenure: "Deposit Tenure"
                        },
                        payoutInstructions: {
                            payTo: "Pay To",
                            renewAmount: "Roll over Amount",
                            branch: "Branch",
                            transferTo: "Transfer Account",
                            accNumber: "Account Number",
                            payoutType: {
                                I: "Internal Account",
                                O: "Own Account",
                                E: "Domestic Bank Account"
                            }
                        }
                    }
                },
                generic: Generic
            },
            ar: true,
            fr: true,
            cs: true,
            sv: true,
            en: false,
            "en-us": false,
            el: false
        };
    };
    return new ReviewTermDepositAmend();
});
