define(["ojL10n!resources/nls/generic"], function(Generic) {
	"use strict";
	var thirdpartyconsentsLocale = function() {
		return {
			root: {
				labels: {
					applicationAccess: "Application Access",
					revoked: "Revoked",
					granted: "Granted",
					mapAllTransactions: "Map All Transactions",
					createThirdPartyConsent: "Create Third Party Consent",
					updateThirdPartyConsent: "Update Third Party Consent",
					headerName: "Third Party Consents",
					currentAndSavings: "Current & Savings",
					termDeposits: "Term Deposits",
					loan: "Loans",
					confirmMessage: "You initiated a request for Third Party Consents. Please review details before you confirm!",
					statusLabel: "Status",
					message: "Message",
					noAccountsMessage: "No accounts available.",
					accessPointNotAvailable: "You don't have any active third party applications to manage.",
					mappedAccessPoints: "Touch Points mapped.",
					accountTypes: "Account types."
				},
				status: {
					error: "Error",
					success: "Successful"
				},
				messages: {
					successMessage: "Third party consents initiated successfully.",
					failureMessage: "Transfers initiated successfully. Some transfers seem to have failed."
				},
				generic: Generic,
				info: {
					noData: "No data to display."
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
	return new thirdpartyconsentsLocale();
});
