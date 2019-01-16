define([
	"ojL10n!resources/nls/messages",
	"ojL10n!resources/nls/generic"
], function(Messages, Generic) {
	"use strict";
	var CodeGenerationLocale = function() {
		return {
			root: {
				labels: {
					headerName: "Code Generation",
					restUrl: "Uri",
					methodType: "Method Type",
					businessPolicy: "Business Policy",
					extension: "Extension",
					serviceId:"Service Id",
					restId:"Rest Id",
					repoId:"Repo Id",
					domain: "Domain",
					read:"Read",
					repositoryAdapter: "Reposiory Adapter",
					businessPolicyList: "Business Policy List",
					add: "Add",
					new: "New",
					policyName: "Business Policy Name",
					view: "View",
					confirmScreenheader: "You initiated a request for script generation. Please click on the link to download the script!",
					downloadScripts: "Download Scripts",
					invalidURI: "Invalid uri",
					invalidMethodType: "Invalid Method Type"
				},
				messages: Messages,

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
	return new CodeGenerationLocale();
});
