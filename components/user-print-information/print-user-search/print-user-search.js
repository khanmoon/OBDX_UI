define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "jquery",
  "baseLogger",
  "ojL10n!resources/nls/user-print-information",
  "ojs/ojinputtext",
  "ojs/ojdatetimepicker",
  "ojs/ojknockout-validation",
  "ojs/ojvalidation",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingtabledatasource",
  "ojs/ojcheckboxset"
], function(oj, ko, PrintUserSearchModel, $, BaseLogger, resourceBundle) {
  "use strict";
  return function(params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    self.showOptionRecords = ko.observable(false);
    self.search = ko.observable(false);
    params.baseModel.registerComponent("user-type", "user-management");
    params.baseModel.registerElement("confirm-screen");
    self.selectedUserType = ko.observable();
    self.userType = ko.observable();
    self.userName = ko.observable();
    self.firstName = ko.observable();
    self.lastName = ko.observable();
    self.emailId = ko.observable();
    self.mobileNumber = ko.observable();
    self.partyId = ko.observable();
    self.passwordGenerationType = ko.observable("CREATE");
    self.passwordgenerationFromDate = ko.observable();
    self.passwordGenerationToDate = ko.observable();
    self.mappingDatasource = new oj.ArrayTableDataSource([]);
    self.selectedUsers = ko.observableArray();
    self.userList = ko.observableArray();
    self.printList = ko.observableArray();
    self.showList = ko.observable(false);
    self.userTypeSelectionIdle = ko.observable(true);
    self.selectedDocuments = ko.observableArray();
    self.documentListLoaded = ko.observable(false);
    self.selectedUserId = ko.observableArray();
    self.isAllSelected = ko.observable(false);
    self.validationTracker = ko.observable();
    self.indirectedParty = ko.observable();
    self.enablePrint = ko.observable(false);
    params.dashboard.headerName(self.nls.pageTitle.printPwd);
    self.userTypeEnums = ko.observableArray();
    self.userTypeEnumsLoaded = ko.observable(false);
    self.selectedUserType = params.rootModel.selectedUserType !== undefined ? params.rootModel.selectedUserType : ko.observable();
    self.rolePreferencesList = ko.observable();
    self.filter = ko.observable();
    self.diableUserType = ko.observable(false);
    var getNewKoModel = function() {
      var KoModel = ko.mapping.fromJS(PrintUserSearchModel.getNewModel());
      return KoModel;
    };
    if (params.filter) {
      self.filter(params.filter);
    }
    PrintUserSearchModel.fetchUserGroupOptions().done(function(data) {
      ko.utils.arrayForEach(data.enterpriseRoleDTOs, function(data) {
        if (data.enterpriseRoleId !== null && (data.enterpriseRoleId.toLowerCase() !== (self.filter() !== undefined ? self.filter().toLowerCase() : self.filter()))) {
          self.userTypeEnums.push(data);
        }
      });
      self.userTypeEnumsLoaded(true);
    });
    self.userTypeOptionChangeHandler = function(event) {
      var value = event.detail.value;
      self.selectedUserType(value);
      self.userTypeSelectionIdle(false);
    };
    if (self.isCorpAdmin) {
      self.selectedUserType("corporateuser");
      self.diableUserType(true);
      self.diableUserType(true);
      self.userTypeSelectionIdle(false);
    } else {
      self.diableUserType(false);
    }

    self.createPayload = getNewKoModel().userprintModel;
    self.onSearch = function() {
      self.search(true);
    };
    self.filterResults = function(event) {
      if (event.detail.value) {
        self.passwordGenerationType(event.detail.value);
      }
    };
    self.clearForm = function() {
      self.selectedUserType("");
      self.userName("");
      self.firstName("");
      self.lastName("");
      self.emailId("");
      self.mobileNumber("");
      self.partyId("");
      self.indirectedParty("");
      self.passwordgenerationFromDate("");
      self.passwordGenerationToDate("");
      self.showList(false);
    };
    self.cancel = function() {
      params.dashboard.openDashBoard();
    };
    self.showOptions = function() {
      self.showOptionRecords(true);
    };
    self.showLessOptions = function() {
      self.showOptionRecords(false);
    };
    self.renderCheckBox = function(context) {
      var checkBox = $(document.createElement("input"));
      var label = $(document.createElement("label"));
      checkBox.attr("type", "checkbox");
      checkBox.attr("value", context.row.userID);
      checkBox.attr("name", "selection");
      label.attr("class", "oj-checkbox-label hide-label");
      checkBox.attr("id", context.row.userID + "_labelID");
      label.attr("for", context.row.userID + "_labelID");
      label.text(self.nls.fieldname.userlist);
      $(context.cellContext.parentElement).append(checkBox);
      $(context.cellContext.parentElement).append(label);
      $("#headerbox_labelID").prop("checked", false);
    };
    self.renderHeadCheckBox = function(context) {
      var checkBox = $(document.createElement("input"));
      var label = $(document.createElement("label"));
      checkBox.attr("type", "checkbox");
      checkBox.attr("value", "selectAll");
      checkBox.attr("name", "selectionParent");
      checkBox.attr("id", "headerbox_labelID");
      label.attr("class", "oj-checkbox-label hide-label");
      label.attr("for", "headerbox_labelID");
      label.text(self.nls.fieldname.userlist);
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(checkBox);
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(label);
    };
    $(document).ready(function() {
      $(document).on("change", "input[name=selection]", function() {
        $("input[name=selectionParent]").prop("checked", $("input[name=selection]:checked").length === $("input[name=selection]").length);
        self.userList($("input[name=selection]:checked").map(function() {
          return this.value;
        }).get());
        if (self.userList().length !== 0) {
          self.enablePrint(true);
        } else {
          self.enablePrint(false);
        }
      });
      $(document).on("change", "input[name=selectionParent]", function() {
        $("input[name=selection]").prop("checked", $("input[name=selectionParent]").prop("checked"));
        self.userList([]);
        self.userList($("input[name=selection]:checked").map(function() {
          return this.value;
        }).get());
        if (self.userList().length !== 0) {
          self.enablePrint(true);
        } else {
          self.enablePrint(false);
        }
      });
    });
    self.hideModalWindow = function() {
      self.documentListLoaded(false);
      self.selectedDocuments([]);
      $("#printDocs").trigger("closeModal");
    };
    self.printUsersList = function() {
      self.documentListLoaded(false);
      self.selectedDocuments([]);
      PrintUserSearchModel.printUsersList().done(function(data) {
        if (data.enumRepresentations) {
          self.printList(data.enumRepresentations[0].data);
          self.documentListLoaded(true);
          $("#printDocs").trigger("openModal");
        }
      });
      if (self.printList().length === 0) {
        self.print();
      }
    };
    self.print = function() {
      self.createPayload.userID(self.userList());
      self.createPayload.userPrintDocs(self.selectedDocuments());
      PrintUserSearchModel.printUsers(ko.toJSON(self.createPayload)).done(function(data, status, jqXhr) {
        self.createPayload.userID(self.userList());
        self.createPayload.userPrintDocs(self.selectedDocuments());
        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.nls.messages.transactionName
        }, self);
      });
    };
    self.fetchUsers = function() {
      if (self.selectedUserType() === undefined || self.selectedUserType().length === 0) {
        params.baseModel.showMessages(null, [self.nls.messages.userTypeMandatory], "INFO");
        return;
      }
      if (self.partyId()) {
        PrintUserSearchModel.fetchDetails(self.partyId()).done(function(data) {
          if (data.parties.length === 0) {
            self.partyId("");
            params.baseModel.showMessages(null, [self.nls.messages.invalidInfo], "ERROR");
          } else if (data.parties[0] !== null && data.parties[0]) {
            self.indirectedParty(data.parties[0].id.value);
            self.fetchUsersList();
          }
        });
      } else {
        self.fetchUsersList();
      }
    };
    self.fetchUsersList = function() {
      var userParameters = {
        "userName": self.userName(),
        "emailId": self.emailId(),
        "mobileNumber": self.mobileNumber(),
        "userType": self.selectedUserType(),
        "partyId": self.indirectedParty(),
        "firstName": self.firstName(),
        "lastName": self.lastName(),
        "passwordgenerationFromDate": self.passwordgenerationFromDate(),
        "passwordGenerationToDate": self.passwordGenerationToDate(),
        "passwordGenerationType": self.passwordGenerationType()
      };
      PrintUserSearchModel.fetchUsersList(userParameters).done(function(data) {
        self.showList(false);
        self.userList(data.userPrintInformationDTOList);
        self.showList(true);
        self.mappingDatasource.reset(self.userList(), {
          idAttribute: "userID"
        });
        self.paginationDataSource = new oj.PagingTableDataSource(self.mappingDatasource);
      });
    };
    self.passwordGenerationType.subscribe(function() {
      if (self.showList()) {
        if (self.selectedUserType() === undefined) {
          params.baseModel.showMessages(null, [self.nls.messages.userTypeMandatory], "INFO");
          return;
        }
        var userParameters = {
          "userName": self.userName(),
          "emailId": self.emailId(),
          "mobileNumber": self.mobileNumber(),
          "userType": self.selectedUserType(),
          "partyId": self.indirectedParty(),
          "firstName": self.firstName(),
          "lastName": self.lastName(),
          "passwordgenerationFromDate": self.passwordgenerationFromDate(),
          "passwordGenerationToDate": self.passwordGenerationToDate(),
          "passwordGenerationType": self.passwordGenerationType()
        };
        PrintUserSearchModel.fetchUsersList(userParameters).done(function(data) {
          self.showList(false);
          self.userList(data.userPrintInformationDTOList);
          self.showList(true);
          self.mappingDatasource.reset(self.userList(), {
            idAttribute: "userID"
          });
          self.paginationDataSource = new oj.PagingTableDataSource(self.mappingDatasource);
        });
      }
    });
  };
});
