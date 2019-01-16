define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/help-desk-user",
  "framework/js/constants/constants",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojknockout",
  "promise",
  "ojs/ojarraydataprovider"
], function(oj, ko, $, HelpDeskUserSearchModel, resourceBundle, Constants) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerComponent("user-type", "user-management");
    rootParams.dashboard.headerName(self.nls.helpDeskUser.headerName);
    rootParams.dashboard.helpComponent.componentName("help-desk-user-search");
    self.validationTracker = ko.observable();
    self.userName = ko.observable();
    self.partyID = ko.observable();
    self.userDataLoaded = ko.observable(false);
    self.indirectedParty = ko.observable();
    self.pagingDatasource = ko.observable();
    self.selectedUserType = ko.observable();
    self.userTypeSelectionIdle = ko.observable(true);
    self.isHelpDeskAdmin = ko.observable(true);
    self.userNameFlag = ko.observable(false);
    self.partyIdFlag = ko.observable(false);

    self.fetchUsersList = function() {
      if (self.userName() === null || self.userName() === undefined) {
        self.userName("");
      }
      if (self.partyID() === null || self.partyID() === undefined) {
        self.partyID("");
      }
      if (self.selectedUserType() === null || self.selectedUserType() === undefined) {
        self.selectedUserType("");
      }
      var userParameters = {
        "username": self.userName(),
        "partyId": self.indirectedParty(),
        "userType": self.selectedUserType()
      };
      if (self.userName() !== "" || self.indirectedParty() !== undefined) {
        HelpDeskUserSearchModel.fetchUsersList(userParameters).then(function(data) {
          if (data.userDTOList && data.userDTOList.length > 0) {
            self.userDataLoaded(true);
            self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(data.userDTOList, {
              idAttribute: ["username"]
            })));
          } else {
            rootParams.baseModel.showMessages(null, [self.nls.helpDeskUser.recordNotFound], "ERROR");
          }
        });
      } else if (self.selectedUserType() === undefined) {
        rootParams.baseModel.showMessages(null, [self.nls.helpDeskUser.noUserType], "ERROR");
      } else {
        rootParams.baseModel.showMessages(null, [self.nls.helpDeskUser.dataRequired], "ERROR");
      }
    };

    self.fetchUsers = function() {
      if (self.selectedUserType() === undefined || self.selectedUserType().length === 0) {
        rootParams.baseModel.showMessages(null, [self.nls.helpDeskUser.userTypeMandatory], "INFO");
        return;
      }
      if (self.partyID()) {
        HelpDeskUserSearchModel.fetchPartyDetails(self.partyID()).then(function(data) {
          if (data.parties.length === 0) {
            self.partyID("");
            rootParams.baseModel.showMessages(null, [self.nls.helpDeskUser.invalidInfo], "ERROR");
          } else if (data.parties[0] !== null && data.parties[0]) {
            self.indirectedParty(data.parties[0].id.value);
            self.fetchUsersList();
          }
        });
      } else {
        self.fetchUsersList();
      }
    };

    self.logIn = function(rootData, data) {

      if (data.lockStatus === "LOCK") {
        $("#createSessionError").trigger("openModal");
        return;
      }

      var payload = {
        "transactionalUserId": data.username,
        "transactionalParty": {
          "value": data.partyId.value
        }
      };

      HelpDeskUserSearchModel.helpDeskUserSessionCreate(JSON.stringify(payload)).done(function(dataProxyCreate) {
        self.isHelpDeskAdmin(false);
        if (dataProxyCreate.helpDeskSessionDTO.sessionKey) {
          Constants.helpDeskSessionKey = dataProxyCreate.helpDeskSessionDTO.sessionKey;
          HelpDeskUserSearchModel.fetchMeDetails().then(function(dataMeFetch) {
            rootData.changeSegment(null, dataMeFetch.userProfile.roles);
            rootData.changeUser(dataMeFetch);
          });
        }
      });
    };

    self.clear = function() {
      self.partyID("");
      self.userName("");
      self.userDataLoaded(false);
      self.selectedUserType([]);
      self.indirectedParty("");
      self.partyIdFlag(false);
      self.userNameFlag(false);
    };

    self.userNameFocusOut = function(event) {
      if (event.target.value.length > 0)
        self.partyIdFlag(true);
    };

    self.partyIdFocusOut = function(event) {
      if (event.target.value.length > 0)
        self.userNameFlag(true);
    };

    self.closeDialogBox = function() {
      $("#createSessionError").hide();
    };

  };
});
