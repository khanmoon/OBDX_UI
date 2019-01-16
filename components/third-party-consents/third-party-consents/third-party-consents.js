define([
	"ojs/ojcore",
	"knockout",
	"jquery",
	"./model",
	"ojL10n!resources/nls/third-party-consents",
	"promise",
	"ojs/ojinputtext",
	"ojs/ojbutton",
	"ojs/ojtable",
	"ojs/ojdialog",
	"ojs/ojlistview",
	"ojs/ojpagingcontrol",
	"ojs/ojcollapsible",
	"ojs/ojswitch",
	"ojs/ojnavigationlist"
], function (oj, ko, $, ThirdPartyConsentModel, resourceBundle, Promise) {
	"use strict";
	return function (params) {
		var self = this;
		ko.utils.extend(self, params.rootModel);
		self.nls = resourceBundle;
		self.accessPointTabs = [];
		self.selectedAccessPointTab = ko.observable();
		self.dataLoaded = ko.observable(false);
		self.applicationAccess = ko.observable(true);
		self.accessPointNotFound = ko.observable(false);
		self.displayAccounts = ko.observable(true);
		self.displayAccessPoints = ko.observable(true);
		$("#optionset").css("display", "block");

		self.applicationAccessStatus = ko.computed(function () {
			if (self.applicationAccess())
				return self.nls.labels.granted;
			return self.nls.labels.revoked;
		});

		self.disabled = ko.observable(true);
		self.accountTabLoaded = ko.observable(false);
		self.accountTab = ko.observableArray([]);
		self.accessPointSetupExists = ko.observable(false);
		self.confirmScreen = ko.observable(false);
		self.selectedAccountTab = ko.observable();
		params.baseModel.registerElement("confirm-screen");
		params.baseModel.registerElement("page-section");
		params.dashboard.headerName(self.nls.labels.headerName);
		self.selectedAccessPointName = ko.observable();
		self.httpStatus = ko.observable();
		self.transactionStatus = ko.observable();
		var payload = [];
		var userPreferencePayload = {};

		self.dataSource = {};
		self.accounts = {};
		self.accountTypes = ["CSA", "TRD", "LON"];
		self.reviewTransactionName = {};
		self.reviewTransactionName.header = self.nls.generic.common.review;
		self.reviewTransactionName.reviewHeader = self.nls.labels.confirmMessage;

		if (params.baseModel.small()) {
			self.displayAccounts(false);
			self.displayAccessPoints(true);
		}
		params.baseModel.registerComponent("account-access", "third-party-consents");
		var getNewKoModel = function () {
			var KoModel = ThirdPartyConsentModel.getNewModel();
			return ko.mapping.fromJS(KoModel);
		};

		var accessPointPromise = new Promise(function (resolve) {
			ThirdPartyConsentModel.fetchPreferences().then(function (data) {
				var batchRequestDetails = [];
				delete data.status;
				userPreferencePayload = data;
				ko.utils.arrayForEach(data.userAccessPointRelationship, function (relation) {
					var newObj = {
						id: relation.accessPointId,
						status: relation.status
					};
					self.accessPointTabs.push(newObj);
					batchRequestDetails.push({
						methodType: "GET",
						uri: {
							value: "/accessPoints/{accessPointId}",
							params: {
								"accessPointId": relation.accessPointId
							}
						},
						headers: {
							"Content-Id": relation.accessPointId,
							"Content-Type": "application/json"
						}
					});
				});
				ThirdPartyConsentModel.fireBatch({
					batchDetailRequestList: batchRequestDetails
				}).then(function (data) {
					var tempArray = [];
					ko.utils.arrayForEach(data.batchDetailResponseDTOList, function (object) {
						var filter = JSON.parse(object.responseText).accessPointDTO;

						for (var i = 0; i < self.accessPointTabs.length; i++) {
							if (filter.id === self.accessPointTabs[i].id && filter.type === "EXT") {
								var newObj = {};
								newObj.name = filter.description;
								newObj.contentId = filter.imgRefno.value;
								newObj.id = filter.id;
								newObj.status = self.accessPointTabs[i].status;
								tempArray.push(newObj);
							}
						}
					});
					self.accessPointTabs = tempArray;
					if (self.accessPointTabs.length < 1) {
						self.accessPointNotFound(true);
					}


					self.selectedAccessPointTab(self.accessPointTabs[0].id);

					self.applicationAccess(self.accessPointTabs[0].status);
					self.fetchLogo(resolve);
				});
			});
		});

		self.fetchLogo = function (resolve) {
			var batchRequestDetails = [];
			ko.utils.arrayForEach(self.accessPointTabs, function (tab) {
				if (tab.contentId) {
					batchRequestDetails.push({
						methodType: "GET",
						uri: {
							value: "/contents/{contentId}",
							params: {
								"contentId": tab.contentId
							}
						},
						headers: {
							"Content-Id": tab.contentId,
							"Content-Type": "application/json"
						}
					});
				}
			});

			if (batchRequestDetails.length > 0) {
				ThirdPartyConsentModel.fireBatch({
					batchDetailRequestList: batchRequestDetails
				}).then(function (data) {
					ko.utils.arrayForEach(data.batchDetailResponseDTOList, function (object) {
						var filter = JSON.parse(object.responseText).contentDTOList[0];
						ko.utils.arrayForEach(self.accessPointTabs, function (tab) {
							if (tab.contentId === filter.contentId.value) {
								tab.image = "data:" + $.parseHTML(filter.mimeType)[0].data + ";base64," + filter.content;
							}
						});
					});
					resolve();
				});
			}
		};

		self.setAccessPointSetup = function () {
			ThirdPartyConsentModel.fetchAccounts(self.selectedAccessPointTab()).then(function (data) {
				var fetchedAccounts = null;
				if (data.accounts) {
					fetchedAccounts = data.accounts[0];
				} else {
					fetchedAccounts = data.responseJSON.accounts[0];
				}
				ko.utils.arrayForEach(self.accountTypes, function (filter) {
					var tempArray = ko.utils.arrayFilter(fetchedAccounts.accountsList, function (account) {
						return account.accountType === filter;
					});

					var newObj = {
						id: filter
					};
					self.accounts[filter] = {
						accountList: tempArray
					};

					if (filter === "CSA") {
						newObj.name = self.nls.labels.currentAndSavings;
					} else if (filter === "TRD") {
						newObj.name = self.nls.labels.termDeposits;
					} else if (filter === "LON") {
						newObj.name = self.nls.labels.loan;
					}
					self.accountTab().push(newObj);

				});

				self.selectedAccountTab(self.accountTab()[0].id);

				if (fetchedAccounts.setupInformation === "SETUP_EXISTS" && fetchedAccounts.accessLevel === "ACCESSPOINT") {
					self.accessPointSetupExists(true);
					ThirdPartyConsentModel.fetchSetup(self.selectedAccessPointTab()).then(function (data) {

						ko.utils.arrayForEach(data.accessPointAccountDTOs, function (accountAccess) {
							self.accounts[accountAccess.accountType].accountAcceessId = accountAccess.accountAccessId;
							ko.utils.arrayForEach(accountAccess.accountExclusionDTOs, function (exclusionDTO) {
								for (var i = 0; i < self.accounts[accountAccess.accountType].accountList.length; i++) {
									var accountNumber = self.accounts[accountAccess.accountType].accountList[i].accountNumber.value;
									if (accountNumber === exclusionDTO.accountNumber.value) {
										self.accounts[accountAccess.accountType].accountList[i].accountExclusionId = exclusionDTO.accountExclusionId;
									}
								}
							});
						});

						if (self.accessPointSetupExists())
							self.accountTabLoaded(true);
					});
				}
				self.dataLoaded(true);
				if (!self.accessPointSetupExists())
					self.accountTabLoaded(true);
			});
		};

		Promise.all([accessPointPromise]).then(function () {
			if (params.baseModel.large())
				self.setAccessPointSetup();
			else
				self.dataLoaded(true);
		});


		self.accessPointTabChangeHandler = function (event) {
			self.selectedAccessPointTab(event.id);
			self.selectedAccessPointName(event.name);
			ko.utils.arrayForEach(self.accountTypes, function (accountType) {
				if (self.dataSource[accountType])
					self.dataSource[accountType].accountAccessId = null;
			});
			self.accessPointSetupExists(false);
			self.accountTab([]);
			self.setAccessPointSetup();
			self.accountTabLoaded(false);
			self.confirmScreen(false);
			var tempArray = ko.utils.arrayFilter(self.accessPointTabs, function (accessPoint) {
				return accessPoint.id === self.selectedAccessPointTab();
			});
			self.applicationAccess(tempArray[0].status);
			self.disabled(true);
			if (params.baseModel.small()) {
				self.displayAccounts(true);
				self.displayAccessPoints(false);
			}
		};


		self.preparePayload = function () {
			payload = [];
			for (var currentDatasourceObject in self.dataSource) {
				if (Object.prototype.hasOwnProperty.call(self.dataSource, currentDatasourceObject)) {
					var thirdPartyInstance = getNewKoModel().accountAccessModel;
					thirdPartyInstance.accessPointId(self.selectedAccessPointTab());
					thirdPartyInstance.accountType(currentDatasourceObject);
					thirdPartyInstance.accessLevel("ACCESSPOINT");
					thirdPartyInstance.accessStatus(false);
					thirdPartyInstance.accountAccessId(self.dataSource[currentDatasourceObject].accountAccessId);
					var accountArray = ko.utils.arrayFilter(self.dataSource[currentDatasourceObject].accounts, function (accounts) {
						return accounts.checked().length > 0;
					});
					ko.utils.arrayForEach(accountArray, function (account) {
						var accountExclusionDTO = {
							accountNumber: account.accountNumber,
							taskIds: [],
							accountExclusionId: account.accountExclusionId
						};
						ko.utils.arrayForEach(account.tasks(), function (task) {
							var childTaskArray = ko.utils.arrayFilter(task.childTasks(), function (childTask) {
								return childTask.checked().length > 0;
							});
							ko.utils.arrayForEach(childTaskArray, function (childTask) {
								accountExclusionDTO.taskIds.push(childTask.id);
							});
						});
						thirdPartyInstance.accountExclusionDTOs().push(accountExclusionDTO);
					});
					payload.push(thirdPartyInstance);
				}
			}
		};

		self.prepareUserPreferencePayload = function () {
			for (var i = 0; i < userPreferencePayload.userAccessPointRelationship.length; i++) {
				if (userPreferencePayload.userAccessPointRelationship[i].accessPointId === self.selectedAccessPointTab()) {
					userPreferencePayload.userAccessPointRelationship[i].status = self.applicationAccess();
					break;
				}
			}
		};

		self.back = function () {
			self.disabled(true);
		};
		self.confirm = function () {
			self.preparePayload();
			self.prepareUserPreferencePayload();
			var methodType = "POST";
			var transactionName = self.nls.labels.createThirdPartyConsent;
			if (self.accessPointSetupExists()) {
				methodType = "PUT";
				transactionName = self.nls.labels.updateThirdPartyConsent;
			}
			var batchRequestDetails = [];
			batchRequestDetails.push({
				methodType: "PUT",
				uri: {
					value: "/me/preferences"
				},
				payload: JSON.stringify(userPreferencePayload),
				headers: {
					"Content-Id": 0,
					"Content-Type": "application/json"
				}
			});
			if (self.applicationAccess()) {
				batchRequestDetails.push({
					methodType: methodType,
					uri: {
						value: "/me/accessPointAccount"
					},
					payload: ko.toJSON({
						accessPointAccountDTOs: payload
					}),
					headers: {
						"Content-Id": 1,
						"Content-Type": "application/json"
					}
				});
			}
			ThirdPartyConsentModel.fireBatch({
				batchDetailRequestList: batchRequestDetails
			}).then(function (data, status, jqXhr) {
				self.httpStatus(jqXhr.status);
				self.transactionStatus(data.status);
				var confirmScreenDetailsArray = [{
					label: self.nls.labels.statusLabel,
					value: self.nls.status.success
				}, {
					label: self.nls.labels.message,
					value: self.nls.messages.successMessage
				}];
				params.dashboard.loadComponent("confirm-screen", {
					jqXHR: jqXhr,
					transactionName: transactionName,
					confirmScreenExtensions: {
						successMessage: self.nls.messages.successMessage,
						isSet: true,
						confirmScreenDetails: confirmScreenDetailsArray,
						eReceiptRequired: false,
						template: "confirm-screen/third-party-consents"
					}
				}, self);

			});
		};
		self.editAccountAccess = function () {
			self.disabled(false);
			self.confirmScreen(false);
		};
		self.saveAccountAccess = function () {
			self.disabled(true);
			self.confirmScreen(true);
		};
		self.dispose = function () {
			self.applicationAccessStatus.dispose();
		};
	};
});
