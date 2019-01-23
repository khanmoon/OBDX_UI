define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";
    var createRD = function() {
        return {
            root: {
                header: {
                    newRecurringDeposit: "New Recurring Deposit"
                },
                depositDetail: {
                    maturityInformation: "Are you saving with a goal in mind or do you have an amount you want to save every month?",
                    knowMonthlyInstall: "I know my installments",
                    installmentsInformation: "Hi ! We have Accounts to help you meet your goals. Let's get you started.",
                    notknownMonthlyInstall: "Calculate my installments",
                    productTenureMessage: "Minimum allowed is {minTenure} and Maximum allowed is {maxTenure}.",
                    productAmountMessage: "Min amount should be  {minAmount} & max is {maxAmount}",
                    selectProduct: "Product",
                    depositAmount: "Target Amount",
                    tenure: {
                        singular: {
                            day: "{n} Day",
                            month: "{n} Month",
                            year: " {n} Year"
                        },
                        plural: {
                            day: "{n} Days",
                            month: "{n} Months",
                            year: "{n} Years"
                        }
                    },
                    tenureDetail: "{years}, {months}",
                    label: {
                        months: " Months",
                        years: " Years"
                    },
                    monthlyInstallment: "Installment :<span class=\"calculator__calculated-amount\">{amount}/Month</span>",
                    depositTenure: "Deposit Tenure",
                    calculateInstallment: "Calculate",
                    link: {
                        proceedForRd: "Proceed to Recurring Deposit Booking",
                        reduceInterest: "Click here to reduce Inflation Rate",
                        increaseInterest: "Click here to increase Inflation Rate"
                    },
                    alt: {
                        proceedForRd: "Proceed to Recurring Deposit Booking",
                        reduceInterest: "Click here to reduce Inflation Rate",
                        increaseInterest: "Click here to increase Inflation Rate"

                    },
                    emptyInterest: "Please enter valid Inflation Rate",
                    rateOfInflation: "Inflation Rate"
                },
                validate: {
                    targetAmount:"Installment amount for the selected Recurring Deposit Product should be between {minAmount} to {maxAmount}. Please modify your details and try again.",
                    product: "Please Select Product"
                },
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