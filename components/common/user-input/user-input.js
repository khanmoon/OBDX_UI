define([
  "knockout",
  "jquery",
  "./model",
  "framework/js/constants/constants",

  "ojL10n!resources/nls/user-input",
  "ojs/ojbutton",
  "ojs/ojradioset",
  "ojs/ojselectcombobox",
  "ojs/ojknockout"
], function(ko, $, UserInputModel, Constants, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.userInputModel = rootParams.userInputModel;
    self.nodeId = rootParams.nodeId;
    self.useCase = ko.observable();
    self.partyId = ko.observable();
    self.userType = ko.observable();
    self.menuSelection = self.menuSelection || ko.observable();
    self.useMode = ko.observable();
    self.Nls = resourceBundle;
    self.customLabel = ko.observable();
    self.approvalUser = self.approvalUser || ko.observable();
    self.labelDisplay = ko.observable();
    self.validationTracker = rootParams.validationTracker;
    self.additionalDetails = ko.observable({
      name: null,
      userList: null,
      userGroupList: null
    });
    if (rootParams.multipleCall) {
      self.userInputModel.additionalDetails = self.additionalDetails();
      self.useCase(self.userInputModel.useCase);
      self.partyId(self.userInputModel.partyId);
      self.userType(self.userInputModel.userType);
      self.useMode(self.userInputModel.useMode);
      self.customLabel(self.userInputModel.customLabel);
      self.labelDisplay(self.userInputModel.labelDisplay);
    } else {
      self.userInputModel.additionalDetails = self.additionalDetails();
      self.useCase(self.userInputModel.useCase);
      self.partyId(self.userInputModel.partyId);
      self.userType(self.userInputModel.userType);
      self.useMode(self.userInputModel.useMode);
      self.customLabel(self.userInputModel.customLabel);
      self.labelDisplay(self.userInputModel.labelDisplay);
    }
    self.selectedUser = ko.observable();
    self.selectedUserGroup = ko.observable();
    self.userListLoaded = ko.observable(false);
    self.userGroupLoaded = ko.observable(false);
    self.userList = ko.observable();
    self.userGroupList = ko.observable();
    self.buttonSet = ko.observable("USER");
    self.initialiseUser = ko.observable(false);
    self.initialiseUserGroup = ko.observable(false);
    self.initialiseButtonSet = ko.observable(false);
    self.conditions = function(){
      if (Constants.userSegment === "ADMIN" && !rootParams.dashboard.userData.userProfile.partyId.value) {
        switch (self.useCase()) {
          case "SU":
            if (self.approvalUser() === "AdminUser") {
              UserInputModel.fetchAdminUserList().done(function(userData) {
                self.userList(userData.userDTOList);
                self.userListLoaded(true);
              });
            } else if (self.approvalUser() === "CorporateUser") {
              UserInputModel.fetchUserList(self.partyId()).done(function(userData) {
                self.userList(userData.userDTOList);
                self.userListLoaded(true);
              });
            }
            break;
          case "UG":
            UserInputModel.fetchAdminUserGroupList(self.userType()).done(function(userGroupData) {
              self.userGroupList(userGroupData.userGroupDTOs);
              self.userGroupLoaded(true);
            });
            break;
          case "DEFAULT":
            if (self.approvalUser() === "AdminUser" || self.menuSelection() === "ADMIN_MAINTENANCE_PENDING") {
              UserInputModel.fetchAdminUserList().done(function(userData) {
                self.userList(userData.userDTOList);
                if (rootParams.multipleCall) {
                  if (self.useMode() === "modify" && self.userInputModel.buttonSet === "USER") {
                    for (var i = 0; i < self.userList().length; i++) {
                      if (self.userList()[i].username === self.userInputModel.selectedUser) {
                        self.additionalDetails().name = self.userList()[i].username;
                        self.additionalDetails().firstName = self.userList()[i].firstName;
                        self.additionalDetails().lastName = self.userList()[i].lastName;
                        break;
                      }
                    }
                  }
                } else if (self.useMode() === "modify" && self.userInputModel.buttonSet === "USER") {
                    for (var j = 0; j < self.userList().length; j++) {
                      if (self.userList()[j].username === self.userInputModel.selectedUser) {
                        self.additionalDetails().name = self.userList()[j].username;
                        self.additionalDetails().firstName = self.userList()[j].firstName;
                        self.additionalDetails().lastName = self.userList()[j].lastName;
                        break;
                      }
                    }
                  }
                self.userListLoaded(true);
              });
            } else if (self.approvalUser() === "CorporateUser" || self.menuSelection() === "PARTY_MAINTENANCE_PENDING") {
              if (self.menuSelection() === "PARTY_MAINTENANCE_PENDING") {
                self.partyId = self.params.data.party.value;
              }
              UserInputModel.fetchUserList(self.partyId()).done(function(userData) {
                self.userList(userData.userDTOList);
                if (rootParams.multipleCall) {
                  if (self.useMode() === "modify" && self.userInputModel.buttonSet === "USER") {
                    for (var i = 0; i < self.userList().length; i++) {
                      if (self.userList()[i].username === self.userInputModel.selectedUser) {
                        self.additionalDetails().name = self.userList()[i].username;
                        self.additionalDetails().firstName = self.userList()[i].firstName;
                        self.additionalDetails().lastName = self.userList()[i].lastName;
                        break;
                      }
                    }
                  }
                } else if (self.useMode() === "modify" && self.userInputModel.buttonSet === "USER") {
                    for (var j = 0; j < self.userList().length; j++) {
                      if (self.userList()[j].username === self.userInputModel.selectedUser) {
                        self.additionalDetails().name = self.userList()[j].username;
                        self.additionalDetails().firstName = self.userList()[j].firstName;
                        self.additionalDetails().lastName = self.userList()[j].lastName;
                        break;
                      }
                    }
                  }
                self.userListLoaded(true);
              });
            }
            if (self.approvalUser() === "AdminUser" || self.menuSelection() === "ADMIN_MAINTENANCE_PENDING") {
              UserInputModel.fetchAdminUserGroupList(self.userType()).done(function(userGroupData) {
                self.userGroupList(userGroupData.userGroupDTOs);
                if (rootParams.multipleCall) {
                  if (self.useMode() === "modify" && self.userInputModel.buttonSet === "USERGROUP") {
                    for (var i = 0; i < self.userGroupList().length; i++) {
                      if (self.userGroupList()[i].id === self.userInputModel.selectedUserGroup) {
                        self.additionalDetails().name = self.userGroupList()[i].name;
                        break;
                      }
                    }
                  }
                } else if (self.useMode() === "modify") {
                    for (var j = 0; j < self.userGroupList().length; j++) {
                      if (self.userGroupList()[j].id === self.userInputModel.selectedUserGroup) {
                        self.additionalDetails().name = self.userGroupList()[j].name;
                        break;
                      }
                    }
                  }
                self.userGroupLoaded(true);
              });
            } else if (self.approvalUser() === "CorporateUser" || self.menuSelection() === "PARTY_MAINTENANCE_PENDING") {
              if (self.menuSelection() === "PARTY_MAINTENANCE_PENDING") {
                self.partyId = self.params.data.party.value;
              }
              UserInputModel.fetchUserGroupList(self.partyId(), self.userType()).done(function(userGroupData) {
                self.userGroupList(userGroupData.userGroupDTOs);
                if (rootParams.multipleCall) {
                  if (self.useMode() === "modify" && self.userInputModel.buttonSet === "USERGROUP") {
                    for (var i = 0; i < self.userGroupList().length; i++) {
                      if (self.userGroupList()[i].id === self.userInputModel.selectedUserGroup) {
                        self.additionalDetails().name = self.userGroupList()[i].name;
                        break;
                      }
                    }
                  }
                } else if (self.useMode() === "modify") {
                    for (var j = 0; j < self.userGroupList().length; j++) {
                      if (self.userGroupList()[j].id === self.userInputModel.selectedUserGroup) {
                        self.additionalDetails().name = self.userGroupList()[j].name;
                        break;
                      }
                    }
                  }
                self.userGroupLoaded(true);
              });
            }
            break;
          default:
            break;
        }
      } else {
        switch (self.useCase()) {
          case "SU":
            UserInputModel.fetchUserList(self.params.partyDetails.party.value()).done(function(userData) {
              self.userList(userData.userDTOList);
              self.userListLoaded(true);
            });
            break;
          case "UG":
            UserInputModel.fetchUserGroupList(self.params.partyDetails.party.value(), self.userType()).done(function(userGroupData) {
              self.userGroupList(userGroupData.userGroupDTOs);
              self.userGroupLoaded(true);
            });
            break;
          case "DEFAULT":
            if (self.menuSelection() === "PARTY_MAINTENANCE") {
              if (self.userInputModel.partyId) {
                self.partyId(self.userInputModel.partyId);
              }
            }
            UserInputModel.fetchUserList(self.partyId()).done(function(userData) {
              self.userList(userData.userDTOList);
              if (rootParams.multipleCall) {
                if (self.useMode() === "modify" && self.userInputModel.buttonSet === "USER") {
                  for (var i = 0; i < self.userList().length; i++) {
                    if (self.userList()[i].username === self.userInputModel.selectedUser) {
                      self.additionalDetails().name = self.userList()[i].username;
                      self.additionalDetails().firstName = self.userList()[i].firstName;
                      self.additionalDetails().lastName = self.userList()[i].lastName;
                      break;
                    }
                  }
                }
              } else if (self.useMode() === "modify" && self.userInputModel.buttonSet === "USER") {
                  for (var j = 0; j < self.userList().length; j++) {
                    if (self.userList()[j].username === self.userInputModel.selectedUser) {
                      self.additionalDetails().name = self.userList()[j].username;
                      self.additionalDetails().firstName = self.userList()[j].firstName;
                      self.additionalDetails().lastName = self.userList()[j].lastName;
                      break;
                    }
                  }
                }
              self.userListLoaded(true);
            });
            UserInputModel.fetchUserGroupList(self.partyId(), self.userType()).done(function(userGroupData) {
              self.userGroupList(userGroupData.userGroupDTOs);
              if (rootParams.multipleCall) {
                if (self.useMode() === "modify" && self.userInputModel.buttonSet === "USERGROUP") {
                  for (var i = 0; i < self.userGroupList().length; i++) {
                    if (self.userGroupList()[i].id === self.userInputModel.selectedUserGroup) {
                      self.additionalDetails().name = self.userGroupList()[i].name;
                      break;
                    }
                  }
                }
              } else if (self.useMode() === "modify" && self.userInputModel.buttonSet === "USERGROUP") {
                  for (var j = 0; j < self.userGroupList().length; j++) {
                    if (self.userGroupList()[j].id === self.userInputModel.selectedUserGroup) {
                      self.additionalDetails().name = self.userGroupList()[j].name;
                      break;
                    }
                  }
                }
              self.userGroupLoaded(true);
            });
            break;
          default:
            break;
        }
      }
    };
    self.conditions();
    self.buttonSet.subscribe(function(newValue) {
      if (newValue && rootParams.multipleCall) {
        if (newValue === "USER") {
          self.userInputModel.buttonSet = "USER";
          self.userInputModel.selectedUserGroup = null;
          self.selectedUserGroup("");
        } else if (newValue === "USERGROUP") {
          self.userInputModel.buttonSet = "USERGROUP";
          self.userInputModel.selectedUser = null;
          self.selectedUser("");
        }
      } else if (newValue && !rootParams.multipleCall) {
        if (newValue === "USER") {
          self.userInputModel.buttonSet = "USER";
          self.userInputModel.selectedUserGroup = null;
          self.selectedUserGroup("");
        } else if (newValue === "USERGROUP") {
          self.userInputModel.buttonSet = "USERGROUP";
          self.userInputModel.selectedUser = null;
          self.selectedUser("");
        }
      }
    });
    self.selectedUser.subscribe(function(newValue) {
      if (newValue && rootParams.multipleCall) {
        if (!self.initialiseUser()) {
          self.userInputModel.selectedUser = newValue;
          for (var i = 0; i < self.userList().length; i++) {
            if (self.userList()[i].username === newValue) {
              self.additionalDetails().name = self.userList()[i].username;
              self.additionalDetails().firstName = self.userList()[i].firstName;
              self.additionalDetails().lastName = self.userList()[i].lastName;
              break;
            }
          }
        } else {
          self.initialiseUser(false);
        }
      } else if (newValue && !rootParams.multipleCall) {
        if (!self.initialiseUser()) {
          self.userInputModel.selectedUser = newValue;
          for (var j = 0; j < self.userList().length; j++) {
            if (self.userList()[j].id === newValue) {
              self.additionalDetails().name = self.userList()[j].name;
              self.additionalDetails().firstName = self.userList()[j].firstName;
              self.additionalDetails().lastName = self.userList()[j].lastName;
              break;
            }
          }
        } else {
          self.initialiseUser(false);
        }
      }
    });
    self.selectedUserGroup.subscribe(function(newValue) {
      if (newValue && rootParams.multipleCall) {
        if (!self.initialiseUserGroup()) {
          self.userInputModel.selectedUserGroup = newValue;
          for (var i = 0; i < self.userGroupList().length; i++) {
            if (self.userGroupList()[i].id === newValue) {
              self.additionalDetails().name = self.userGroupList()[i].name;
              break;
            }
          }
        } else {
          self.initialiseUserGroup(false);
        }
      } else if (newValue && !rootParams.multipleCall) {
        if (!self.initialiseUserGroup()) {
          self.userInputModel.selectedUserGroup = newValue;
          for (var j = 0; j < self.userGroupList().length; j++) {
            if (self.userGroupList()[j].id === newValue) {
              self.additionalDetails().name = self.userGroupList()[j].name;
              break;
            }
          }
        } else {
          self.initialiseUserGroup(false);
        }
      }
    });
    if (self.useMode() === "modify" && rootParams.multipleCall) {
      if (self.userInputModel.buttonSet === "USER") {
        self.buttonSet("USER");
        self.selectedUser(self.userInputModel.selectedUser);
        self.initialiseUser(true);
      } else if (self.userInputModel.buttonSet === "USERGROUP") {
        self.buttonSet("USERGROUP");
        self.selectedUserGroup(self.userInputModel.selectedUserGroup);
        self.initialiseUserGroup(true);
      }
    } else if (self.useMode() === "modify" && !rootParams.multipleCall) {
      if (self.userInputModel.buttonSet === "USER") {
        self.buttonSet("USER");
        self.selectedUser(self.userInputModel.selectedUser);
        self.initialiseUser(true);
      } else if (self.userInputModel.buttonSet === "USERGROUP") {
        self.buttonSet("USERGROUP");
        if (self.userInputModel.userType === "ADMIN") {
          if (self.userInputModel.mode) {
            self.selectedUserGroup(self.userInputModel.selectedUserGroup);
          } else {
            self.selectedUserGroup(self.userInputModel.selectedUserGroup());
          }
        } else {
          self.selectedUserGroup(self.userInputModel.selectedUserGroup);
        }
        self.initialiseUserGroup(true);
      }
    }
  };
});
