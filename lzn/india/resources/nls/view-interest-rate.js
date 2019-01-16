define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";
    var TermDepositOpen = function() {
        return {
            root: {
                openTermDeposit: {
                    tenure: {
                        day: " {day} Day",
                        month: " {month} Month",
                        year: "{year} Year",
                        Days: " {day} Days",
                        Months: " {month} Months",
                        Years: "{year} Years",
                        days: "Days",
                        months: "Months",
                        years: "Years"
                    },
                    depositDetails: {
                        viewInterestRate: "View Interest Rates",
                        alt: {
                            viewInterestRate: "View Interest Rates"
                        }
                    },
                    interestslab: {
                        tenure: "Tenure",
                        rate: "Rate of interest (% Per Annum)",
                        caption: "Interest rate slabs",
                        andabove: "{value} & Above",
                        fromto: "{from} to {to}",
                        percent: "{percent}%",
                        amount: "Amount ({currency})"
                    },
                    validate: {
                        emptyProduct: "Please select a Product"
                    }
                },
                common: {
                    successful: "Successful!"
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
    return new TermDepositOpen();
});
