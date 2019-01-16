define([], function () {
    "use strict";
    var ModuleListLocale = function () {
        return {
            root: {
                CORPORATE: {
                    approver: "Corporate Approver",
                    "demand-deposits": "Demand Deposits",
                    maker: "Corporate Maker",
                    loans: "Loans",
                    "term-deposits": "Term Deposits",
                    viewer: "Corporate Viewer",
                    "account-snapshot":"Account Snapshot",
                    "corporateadminchecker":"Corporate Admin Maker",
                    "corporateadminmaker":"Corporate Admin Checker",
                    "checker":"Corporate Checker"
                  },
                  ADMIN: {
                    dashboard: "Dashboard",
                    authadmin: "System Administartor",
                    adminmaker: "Admin Maker",
                    adminchecker: "Admin Checker"
                  },
                  RETAIL: {
                    "customer":"Customer",
                    "loans":"Loans",
                    "term-deposits":"Term Deposits",
                    "demand-deposits":"Demand Deposits",
                    "payments":"Payments",
                    "trends":"Trends",
                    "cards":"Cards",
                    "origination":"Origination",
                    "application-tracking":"Application Tracking",
                    "account-snapshot":"Account Snapshot",
                    "home":"Home",
                    "scan-to-pay":"Sacn To Pay",
                    "payday":"Payday",
					"link-account-dashboard":"Link Account"
                  }
            },
            ar: false,
            fr: true,
            cs: false,
            sv: false,
            en: false,
            "en-us": false,
            el: false
        };
    };
    return new ModuleListLocale();
});