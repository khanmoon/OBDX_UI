define([
	"ojs/ojcore",
	"knockout",
	"jquery",
	"./model",
	"ojL10n!resources/nls/code-generation",
	"ojs/ojinputtext",
	"ojs/ojbutton",
	"ojs/ojlabel",
	"ojs/ojvalidationgroup"

], function(oj, ko, $, CodeGenerationSearchModel, resourceBundle) {
	"use strict";
	return function(rootParams) {
		var self = this;
		ko.utils.extend(self, rootParams.rootModel);
		self.nls = resourceBundle;
		self.uri = ko.observable();
		self.methodType = ko.observable();
		rootParams.baseModel.registerElement("action-header");
		rootParams.baseModel.registerElement("page-section");
		rootParams.baseModel.registerComponent("code-generation", "code-generation");
		rootParams.dashboard.headerName(self.nls.labels.headerName);
		self.businessPolicy = ko.observableArray([]);
		self.groupValid = ko.observable();
		self.search = function() {
			var tracker = document.getElementById("tracker");
			if (tracker.valid === "valid") {
				CodeGenerationSearchModel.fetchTierDetails(self.methodType(), self.uri()).then(function(data) {
					rootParams.dashboard.loadComponent("code-generation", {
						data: data.tierDetailsDTO
					}, self);
				});
			} else {
				tracker.showMessages();
				tracker.focusOn("@firstInvalidShown");
			}
		};
	};
});
