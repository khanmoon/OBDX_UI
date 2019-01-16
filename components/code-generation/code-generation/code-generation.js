define([
	"ojs/ojcore",
	"knockout",
	"jquery",
	"./model",
	"ojL10n!resources/nls/code-generation",
	"ojs/ojinputtext",
	"ojs/ojbutton",
	"ojs/ojlabel",
	"ojs/ojcheckboxset",
	"ojs/ojaccordion",
	"ojs/ojtable",
	"ojs/ojarraydataprovider",
	"ojs/ojvalidationgroup"
], function(oj, ko, $, CodeGenerationModel, resourceBundle) {
	"use strict";
	return function(rootParams) {
		var self = this;
		ko.utils.extend(self, rootParams.rootModel);
		self.nls = resourceBundle;
		rootParams.baseModel.registerElement("action-header");
		rootParams.baseModel.registerElement("page-section");
		rootParams.baseModel.registerComponent("code-generation-search", "code-generation");
		rootParams.dashboard.headerName(self.nls.labels.headerName);
		self.pagingDatasource = ko.observable();
		var businessPolicies = null;
		self.addNewPolicy = ko.observable(false);
		self.newPolicyName = ko.observable();
		self.restUrl = ko.observable(self.params.data.restDetails.uri);
		self.methodType = ko.observable(self.params.data.restDetails.methodType);
		self.extension = ko.observable(self.params.data.serviceDetails.extension);
		self.repoId = ko.observable(self.params.data.repoDetails.repoId);
		self.serviceId = ko.observable(self.params.data.serviceDetails.serviceId);
		self.restId = ko.observable(self.params.data.restDetails.restId);
		self.domain = ko.observable(self.params.data.domainDetails.domainId);
		self.repositoryAdapter = ko.observable(self.params.data.remoteRepoDetails.remoteRepoId);
		self.removeNewPolicy = function() {
			self.newPolicyName("");
			self.addNewPolicy(false);
		};
		self.groupValid = ko.observable();

		self.mode = ko.observable("view");
		self.scriptsGenerated = ko.observable(false);
		var payload = self.params.data;
		self.prepareDatasource = function(data) {
			self.pagingDatasource(new oj.ArrayDataProvider(data, {
				idAttribute: "id"
			}));
		};

		self.columnArray = [{
			"headerText": self.nls.labels.policyName,
			"field": "id"
		}, {
			"template": "deleteBusinessPolicy"
		}];


		businessPolicies = $.map(self.params.data.serviceDetails.businessPolicyIds, function(v) {
			var newObj = {};
			newObj.id = v;
			return newObj;
		});
		self.prepareDatasource(businessPolicies);

		self.new = function() {
			self.addNewPolicy(true);
		};
		self.add = function() {
			self.addNewPolicy(false);
			businessPolicies.push({
				id: self.newPolicyName()
			});
			self.prepareDatasource(businessPolicies);
			self.newPolicyName("");
		};
		self.removeBusinessPolicy = function(data) {
			businessPolicies.splice(data.index, 1);
			self.prepareDatasource(businessPolicies);
		};

		self.submit = function() {

			self.mode("review");
		};
		self.preparePayLoad = function() {
			payload.domainDetails.domainId = self.domain();
			payload.methodType = self.methodType();
			payload.uri = self.restUrl();
			payload.restDetails.uri = self.restUrl();
			payload.restDetails.methodType = self.methodType();
			payload.serviceDetails.businessPolicyIds = [];
			ko.utils.arrayForEach(businessPolicies, function(policy) {
				payload.serviceDetails.businessPolicyIds.push(policy.id);
			});
			payload.serviceDetails.extension = self.extension();
			payload.remoteRepoDetails.remoteRepoId = self.repositoryAdapter();
			payload.repoDetails.repoId = self.repoId();
			payload.serviceDetails.serviceId = self.serviceId();
			payload.restDetails.restId = self.restId();

		};
		self.confirm = function() {
			var tracker = document.getElementById("tracker");
			if (tracker.valid === "valid") {
				self.preparePayLoad();
				CodeGenerationModel.fetchCodeGen(JSON.stringify(payload));
				rootParams.dashboard.loadComponent("code-generation-search", {}, self);
				self.mode("download");

			} else {
				tracker.showMessages();
				tracker.focusOn("@firstInvalidShown");
			}
		};
		self.edit = function() {
			self.mode("create");
		};
		self.cancel = function() {
			rootParams.dashboard.loadComponent("code-generation-search", {}, self);
		};
	};
});
