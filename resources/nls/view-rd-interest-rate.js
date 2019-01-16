define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";
    var createRD = function() {
        return {
            root: {
                interestslab: {
                    title: "View Interest Rates",
                    header: {
                        tenure: "Tenure",
                        rate: "Rate of interest (% Per Annum)"
                    },
                    caption: "Interest rate slabs",
                    andabove: "{value} & Above",
                    fromtotenure: "{from} to {to}",
                    percent: "{percent}%",
                    ok: "Ok",
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
    return new createRD();
});