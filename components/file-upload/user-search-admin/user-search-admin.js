define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "jquery",
  "baseLogger",

  "framework/js/constants/constants",
  "ojL10n!resources/nls/user-search-admin",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation"
], function(oj, ko, UsersSearchAdminModel, $, BaseLogger, constants, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    rootParams.baseModel.registerComponent("user-map", "file-upload");
    self.showOptionRecords = ko.observable(false);
    self.username = ko.observable();
    self.lastName = ko.observable();
    self.firstName = ko.observable();
    self.emailId = ko.observable();
    self.mobileNumber = ko.observable();
    self.usersList = ko.observableArray();
    self.userDataLoaded = ko.observable(false);
    self.datasource = ko.observable();
    self.selectedUser = ko.observable();
    self.mappedUsersList = ko.observableArray();
    self.mappedList = ko.observableArray();
    self.userType = self.resource.userSearchAdmin.admin;
    self.userListSuccesshandler = function(data) {
      self.user().loadSearchData(false);
      self.user().searchedUserList(data.userDTOList);
      self.isLoading(false);
      self.user().loadSearchData(true);
    };
    self.userListErrorHandler = function(data) {
      var msg = data.responseJSON.message.detail;
      self.user().loadSearchData(false);
      self.user().loadSearchData(true);
      self.isLoading(false);
      rootParams.baseModel.showMessages(null, [msg], "ERROR");
    };
    self.resetForm = function() {
      self.username("reset");
      self.firstName("reset");
      self.lastName("reset");
      self.emailId("reset");
      self.mobileNumber("reset");
      self.partyName("reset");
      self.username("");
      self.firstName("");
      self.lastName("");
      self.emailId("");
      self.mobileNumber("");
      self.partyName("");
      self.showOptionRecords(false);
      self.user().loadSearchData(false);
      self.cancelButtonFlag(true);
    };
    self.showMoreOptions = function() {
      self.showOptionRecords(true);
    };
    self.showLessOptions = function() {
      self.showOptionRecords(false);
    };
    self.fetchedUsers = function() {
      UsersSearchAdminModel.listMappedUsers().done(function(data) {
        self.mappedList.removeAll();
        self.mappedUsersList(data.mappedUsersList);
      });
      if (self.username() === null || self.username() === undefined) {
        self.username("");
      }
      if (self.firstName() === null || self.firstName() === undefined) {
        self.firstName("");
      }
      if (self.lastName() === null || self.lastName() === undefined) {
        self.lastName("");
      }
      if (self.emailId() === null || self.emailId() === undefined) {
        self.emailId("");
      }
      if (self.mobileNumber() === null || self.mobileNumber() === undefined) {
        self.mobileNumber("");
      }
      var userParameters = {
        "username": self.username(),
        "firstName": self.firstName(),
        "lastName": self.lastName(),
        "emailId": self.emailId().toLowerCase(),
        "mobileNumber": self.mobileNumber(),
        "isAccessSetupCheckRequired": false,
        "userType": self.userType
      };
      if (self.username() !== "" || self.firstName() !== "" || self.lastName() !== "" || self.emailId() !== "" || self.mobileNumber() !== "") {
        UsersSearchAdminModel.fetchUsersList(userParameters).done(function(data) {
          self.usersList.removeAll();
          if (data.userDTOList) {
            if (data.userDTOList.length < 0) {
              rootParams.baseModel.showMessages(null, [self.resource.userSearchAdmin.recordNotFound], "ERROR");
            }
          } else {
            rootParams.baseModel.showMessages(null, [self.resource.userSearchAdmin.recordNotFound], "ERROR");
          }
          for (var i = 0; i < data.userDTOList.length; i++) {
            var userData = data.userDTOList[i];
            userData.isMapped = false;
            for (var j = 0; j < self.mappedUsersList().length; j++) {
              if (data.userDTOList[i].username === self.mappedUsersList()[j].userId) {
                userData.isMapped = true;
                self.mappedUsersList.remove(self.mappedUsersList()[j]);
                break;
              }
            }
            self.mappedList.push(userData);
          }
          self.datasource(new oj.ArrayTableDataSource(self.mappedList(), {
            idAttribute: "username"
          }));
          self.userDataLoaded(true);
        });
      } else {
        rootParams.baseModel.showMessages(null, [self.resource.userSearchAdmin.dataRequired], "ERROR");
      }
    };
    self.placeInitials = function(firstName, lastName) {
      var initial = firstName.charAt(0) + lastName.charAt(0);
      return initial.toUpperCase();
    };
    self.onUserSelectedInTable = function(event) {
      if (event.detail.value) {
        self.selectedUser(self.mappedList()[event.detail.value[0].startIndex.row]);
        rootParams.dashboard.loadComponent("user-map", {}, self);
      }
    };
    self.submitIfEnter = function(data, event) {
      if (event.keyCode === 13) {
        self.fetchUsersList();
      }
    };
    self.cancel = function() {
      rootParams.dashboard.openDashBoard();
    };
  };
});
