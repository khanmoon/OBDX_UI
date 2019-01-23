define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";
    var DashboardLocale = function() {
        return {
            root: {
                bankName: "ZigBank",
                backImage: "Go back",
                skipToMainContent: "Skip to main content",
                noDashboardFound: "No Dashboards are mapped to the user. Please Contact Bank Administrator",
                headers: {
                    approver: "Approver",
                    loans: "Loans",
                    maker: "Maker",
                    "demand-deposits": "Savings & Current",
                    "term-deposits": "Term Deposits",
                    viewer: "Viewer",
                    bulkFileUpload: "File Upload",
                    alerts: "Alerts Subscription",
                    overview: "Overview",
                    payments: "Payments",
                    creditCard: "Credit Cards",
                    systemDashboard: "Dashboard",
                    dashboard: "Dashboard",
                    dashboardnStatistics: "Dashboard and Statistics"
                },
                sessionExpiredHeader: "Session Expired",
                sessionExpired: "Your session has expired and will need to start filling in the application again.",
                passwordWarningMessage: "Your password is about to expire in {pwdExpiryWarningDays} days, please change your password at the earliest.",
                fatcaWarningMessage: "You are required to submit FATCA & CRS related information. Please click the link to open the form.",
                fatcaForm: "FATCA & CRS form",
                fatcaFormTitle: "Click to open FATCA & CRS form",
                changePasswordTitle: "Click to Change Password",
                changePassword: "Change Password.",
                backTop: "Back To Top",
                systemConfigPending: "You cannot do any transaction since System Configuration is not set yet.",
                generic: Generic
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
    return new DashboardLocale();
});