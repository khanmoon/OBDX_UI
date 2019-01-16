define([
	"ojs/ojcore",
	"knockout",
	"jquery",
	"./model",
	"ojL10n!resources/nls/third-party-consents",
	"ojs/ojinputtext",
	"ojs/ojbutton",
	"ojs/ojtable",
	"ojs/ojdialog",
	"ojs/ojlistview",
	"ojs/ojcollapsible",
	"ojs/ojswitch",
	"ojs/ojnavigationlist",
	"ojs/ojcheckboxset"
], function (oj, ko, $, AccountAccessModel, resourceBundle) {
	"use strict";
	return function (params) {
		var self = this;
		ko.utils.extend(self, params.rootModel);
		self.nls = resourceBundle;
		self.currentDatasource = ko.observableArray([]);
		self.transactionLoaded = ko.observable(false);


		self.createDataSource = function (accountList) {
			var optionsList = [];
			ko.utils.arrayForEach(accountList, function (account) {
				var dataSourceOption = {
					accountNumber: account.accountNumber,
					displayName: account.displayName,
					checked: ko.observableArray([]),
					mapAllTransactions: ko.observableArray([]),
					accountExclusionId: account.accountExclusionId
				};
				dataSourceOption.displayId = dataSourceOption.accountNumber.displayValue.replace(/[^a-zA-Z0-9]/g, "");
				dataSourceOption.accountDisplayName = dataSourceOption.accountNumber.displayValue + " - " + dataSourceOption.displayName;
				var tasks = ko.observableArray([]);
				var numberOfCheckedTasks = 0;
				ko.utils.arrayForEach(account.tasks, function (task) {
					var taskOption = {
						name: task.name,
						checked: ko.observableArray([]),
						parentName: dataSourceOption.accountNumber.displayValue
					};
					taskOption.displayId = (taskOption.parentName + taskOption.name).replace(/[^a-zA-Z0-9]/g, "");

					var childTasks = ko.observableArray([]);
					var numberOfCheckedChildTasks = 0;
					ko.utils.arrayForEach(task.childTasks, function (obj) {
						var childTaskOption = {
							id: obj.childTask.id,
							name: obj.childTask.name,
							checked: ko.observableArray([]),
							parentName: taskOption.parentName
						};
						childTaskOption.displayId = (childTaskOption.id + childTaskOption.parentName).replace(/[^a-zA-Z0-9]/g, "");
						if (obj.isAllowed && self.accessPointSetupExists()) {
							childTaskOption.checked.push("checked");
							if (dataSourceOption.checked().length < 1)
								dataSourceOption.checked.push("checked");
							numberOfCheckedChildTasks++;
						}
						childTasks.push(childTaskOption);
					});
					if (numberOfCheckedChildTasks === task.childTasks.length) {
						taskOption.checked.push("checked");
						numberOfCheckedTasks++;
					}
					taskOption.childTasks = childTasks;
					taskOption.selectAllChildTasks = function (data) {
						if (data.detail.value.length > 0) {
							ko.utils.arrayForEach(taskOption.childTasks(), function (childTask) {
								childTask.checked.push("checked");
							});
						} else {
							ko.utils.arrayForEach(taskOption.childTasks(), function (childTask) {
								childTask.checked([]);
							});
						}
					};
					tasks.push(taskOption);
				});
				if (numberOfCheckedTasks === account.tasks.length) {
					dataSourceOption.mapAllTransactions.push("checked");
				}
				dataSourceOption.tasks = tasks;
				dataSourceOption.selectAllTasks = function (data) {
					if (data.detail.value.length > 0) {
						ko.utils.arrayForEach(dataSourceOption.tasks(), function (task) {
							task.checked.push("checked");
						});
					} else {
						ko.utils.arrayForEach(dataSourceOption.tasks(), function (task) {
							task.checked([]);
						});
					}
				};
				dataSourceOption.deselectAccount = function (data) {
					if (data.detail.value.length === 0) {
						dataSourceOption.mapAllTransactions([]);
						ko.utils.arrayForEach(dataSourceOption.tasks(), function (task) {
							task.checked([]);
							ko.utils.arrayForEach(task.childTasks(), function (childTask) {
								childTask.checked([]);
							});
						});
					}
				};
				optionsList.push(dataSourceOption);
			});
			return optionsList;
		};


		for (var accountType in self.accounts) {
			if (Object.prototype.hasOwnProperty.call(self.accounts, accountType)) {
				var optionsList = self.createDataSource(self.accounts[accountType].accountList);
				self.dataSource[accountType] = {
					accounts: optionsList
				};
				if (self.accessPointSetupExists()) {
					self.dataSource[accountType].accountAccessId = self.accounts[accountType].accountAcceessId;
				}
			}
		}

		self.currentDatasource(self.dataSource[Object.keys(self.dataSource)[0]].accounts);

		self.accountChangeHandler = function (event) {
			self.dataSource[event.detail.previousValue].accounts = self.currentDatasource();
			self.currentDatasource(self.dataSource[event.detail.value].accounts);
		};

		self.transactionLoaded(true);
	};
});
