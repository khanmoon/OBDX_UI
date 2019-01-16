define([
	"ojs/ojcore",
	"knockout",
	"jquery",

	"./model",
	"ojL10n!resources/nls/mailbox",
	"framework/js/constants/constants",
	"ojs/ojtoolbar",
	"ojs/ojnavigationlist",
	"ojs/ojtabs",
	"ojs/ojpagingcontrol",
	"ojs/ojpagingtabledatasource",
	"ojs/ojarraytabledatasource"
], function (oj, ko, $, MailboxBaseModel, resourceBundle, Constants) {
	"use strict";
	return function (params) {
		var self = this;
		ko.utils.extend(self, params.rootModel);
		self.nls = resourceBundle;
		params.dashboard.headerName(self.nls.mailbox.headers.mailboxHeader);
		this.navigationLevel = ko.observable("page");
		self.loadedComponent = ko.observable("inbox");
		self.isAdminMailBox = ko.observable(true);
		self.showDetailedMessage = ko.observable(false);
		self.reloadComponent = ko.observable(true);
		self.messageDetails = ko.observable();
		self.replyMessage = ko.observable(false);
		self.toShow = ko.observable(false);
		self.updatePayload = ko.observableArray();
		self.unreadCount = ko.observable(0);
		self.showInboxCount = ko.observable(true);
		self.selectedMenuItem = ko.observable();
		self.isRetailUser = ko.observable(false);
		self.moreThanOnePartyExist = ko.observable(false);
		self.partyOptionList = ko.observableArray();
		self.partyOptionValue = ko.observable();
		self.attachments = ko.observableArray([]);
		self.selectMailAllowed = ko.observable(true);

		if (Constants.userSegment === "RETAIL") {
			self.isRetailUser(true);
		}
		if (!self.unreadmailCount) {
			self.unreadmailCount = ko.observable(0);
		}

		self.showFloatingPanel = function () {
			$("#panelViewStatement").trigger("openFloatingPanel");
		};
		self.launch = function (model, event) {
			$("#myMenu").ojMenu("open", event);
		};

		self.menuClose = function () {
			$("#mailFolderOptions").removeClass("bold");
		};
		self.menuItemSelect = function (event, ui) {
			self.selectedMenuItem(ui.item.children("a").text());
		};
		var unreadcountcheck;
		self.unReadCountCall = function (count) {
			self.unreadCount(count);
		};

		self.formatMailsForCustomerID = function (mails, flag, deletedMailFlag) {
			if (flag === "F") {
				unreadcountcheck = 0;
			}

			for (var i = 0; i < mails.length; i++) {
				var MessageUserMappings = mails[i].messageUserMappings;
				for (var j = 0; j < MessageUserMappings.length; j++) {
					var messageUserMapping = MessageUserMappings[j];
					if (flag === "F") {
						if (messageUserMapping.userId === params.dashboard.userData.userProfile.userName) {
							if (messageUserMapping.msgFlag === "T" && messageUserMapping.status === "U") {
								unreadcountcheck++;
							}
						}
					}
					if (messageUserMapping.msgFlag === flag) {
						if (flag === "F") {
							if (self.isAdminMailBox()) {
								mails[i].userName = messageUserMapping.username;
								mails[i].customerID = messageUserMapping.userId;

							} else {
								mails[i].userName = messageUserMapping.userGroupName;
								if (!messageUserMapping.userGroupName)
									mails[i].senderName = messageUserMapping.username;
								else {
									mails[i].senderName = messageUserMapping.userGroupName;
								}
								mails[i].customerID = messageUserMapping.userId;

							}
						}
					}
					if (self.isAdminMailBox() && flag === "T") {
						if (messageUserMapping.msgFlag === flag && !messageUserMapping.userGroupName) {
							mails[i].customerID = messageUserMapping.userId;
							mails[i].userName = messageUserMapping.username;
						}
					}

					if (messageUserMapping.userId === params.dashboard.userData.userProfile.userName) {
						if (messageUserMapping.status === "U")
							mails[i].readStatus = true;
						else
							mails[i].readStatus = false;
					}

					if (messageUserMapping.userGroupName) {
						mails[i].userGroupName = messageUserMapping.userGroupName;

					}
				}
				if (mails[i].customerID === undefined)
					mails[i].customerID = "";
			}
			if (!deletedMailFlag) {
				self.unReadCountCall(unreadcountcheck);
				self.unreadmailCount(unreadcountcheck);
			}
			return mails;
		};
		$(document).on("change", "#mailBoxPaging_nav_input", function () {
			$("#headerbox_labelID").prop("checked", false);
		});

		if (Constants.userSegment === "ADMIN" || Constants.userSegment === "CORPADMIN") {
			self.isAdminMailBox(true);
		} else {
			self.isAdminMailBox(false);
		}

		params.baseModel.registerElement("date-time");
		params.baseModel.registerComponent("inbox", "mailbox");
		params.baseModel.registerComponent("sent-mails", "mailbox");
		params.baseModel.registerComponent("deleted-mails", "mailbox");
		params.baseModel.registerComponent("compose-mail", "mailbox");
		params.baseModel.registerComponent("message-detail", "mailbox");

		$(document).ready(function () {
			$(document).on("change", "input[name=selection]", function () {
				self.toShow(!!$("input[name=selection]:checked").length);
				$("input[name=selectionParent]").prop("checked", $("input[name=selection]:checked").length === $("input[name=selection]").length);

			});
			$(document).on("change", "input[name=selectionParent]", function () {
				$("input[name=selection]").prop("checked", $("input[name=selectionParent]").prop("checked"));
				self.toShow(!!$("input[name=selection]").length && !!$("input[name=selectionParent]").prop("checked"));

			});
		});

		self.loadMailComponent = function (key) {
			if (key === "composeMail") {
				self.showDetailedMessage(false);
				self.reloadComponent(false);
				self.loadedComponent("compose-mail");
				$("#panelViewStatement").trigger("closeFloatingPanel");
				self.reloadComponent(true);
			} else if (key === "inbox") {
				self.showDetailedMessage(false);
				self.reloadComponent(false);
				self.loadedComponent("");
				self.loadedComponent("inbox");
				$("#panelViewStatement").trigger("closeFloatingPanel");
				self.reloadComponent(true);
			} else if (key === "sentMail") {
				self.showDetailedMessage(false);
				self.reloadComponent(false);
				self.loadedComponent("sent-mails");
				$("#panelViewStatement").trigger("closeFloatingPanel");
				self.reloadComponent(true);
			} else if (key === "deletedMail") {
				self.showDetailedMessage(false);
				self.reloadComponent(false);
				self.loadedComponent("deleted-mails");
				$("#panelViewStatement").trigger("closeFloatingPanel");
				self.reloadComponent(true);
			}
		};
	};
});
