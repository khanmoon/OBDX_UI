define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";
    var createRD = function() {
        return {
            root: {
                header: {
                    newRecurringDeposit: "New Recurring Deposit"
                },
                pageHeader: {
                    depositDetails: "Deposit Details",
                    maturityDetails: "Maturity Details",
                    nominationDetails: "Nomination Details"
                },
                nominationDetails: {
                    addNominee: "Add Nominee",
                    minorError: "Please enter guardian details since date of birth of nominee is less than 18 years.",
                    notMinorError: "Since nominee is not a minor and guardian details are not required hence please unselect the values filled in guardian details"
                },
                depositDetail: {
                    productTenureMessage: "Minimum allowed is {minTenure} and Maximum is {maxTenure}.",
                    productAmountMessage: "Minimum amount should be  {minAmount} & Maximum is {maxAmount}",
                    selectProduct: "Select Product",
                    selectAccount: "Source Account",
                    depositAmount: "Deposit Amount",
                    holdingPatternType: {
            SINGLE: "Single",
            JOINT: "Joint"
          },
                    tenure: {
                        singular: {
                            day :"{n} Day",
                            month: "{n} Month",
                            year: " {n} Year"
                        },
                        plural: {
                            day :"{n} Days",
                            month: "{n} Months",
                            year: "{n} Years"
                        }
                    },
                    tenureDetail: "{years}, {months}",
                    currentHoldingPattern:"Current Holding Pattern : Joint",
                    modifyHoldingPattern: "Click on the below option if you wish to modify it to single",
                    label: {
                        single: "Single",
                        months: " Months",
                        years: " Years"
                    },
                    maturityAmount: "Maturity Amount",
                    depositTenure: "Deposit Tenure",
                    link: {
                        viewInterestRate: "View Interest Rates",
                        calculateMaturity: "Calculate Maturity"
                    },
                    alt: {
                        viewInterestRate: "View Interest Rates",
                        calculateMaturity: "Calculate Maturity"
                    },
                    rateOfInterest: "Interest Rate"
                },
                maturityDetail: {
                    rollOverType: {
                        "A": "Close on Maturity"
                    },
                    maturityInstruction: "Maturity Instruction",
                    creditAccountNum: "Principal & Interest Credit Account Number",
                    payTo: "Pay To",
                    payoutType: {
                        I: "Internal Account",
                        O: "Own Account",
                        E: "Domestic Bank Account"
                    },
                    accountName: "Account Name",
                    bankCode: "Bank Code",
                    lookUpBankCode: "Look Up Bank Code"
                },
                validate: {
                    tenure: "Recurring deposit tenure should be between {min} to {max}.",
                    updatePanNo:"We are unable to process your request for creating a Recurring Deposit since your Pan No is not updated.Please register your Pan Card and try again.",
                    amount: "Recurring deposit amount should be between {minAmount} and {maxAmount}.",
                    product: "Please Select Product"
                },
                confirmScreenLabels:{
                    recurringDepositNumber :"Recurring Deposit Number",
                    nomineeName:"Nominee Name",
                    guardianName :"Guardian Name",
                    holdingPattern :"Holding Pattern",
                    createSuccessMessage :"Request Submitted Successfully."
                },
                updatePanNo: "Update PAN No.",
                pleaseSelect: "Please Select",
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
    return new createRD();
});