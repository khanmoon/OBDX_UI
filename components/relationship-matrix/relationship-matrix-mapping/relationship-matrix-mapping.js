define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/relationship-matrix",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojtable",
  "ojs/ojrowexpander",
  "ojs/ojflattenedtreetabledatasource",
  "ojs/ojjsontreedatasource",
  "ojs/ojnavigationlist",
  "ojs/ojtabs",
  "ojs/ojknockout",
  "promise",
  "ojs/ojgauge",
  "ojs/ojarraydataprovider"
], function(oj, ko, $, RelationshipMatrixMappingModel, BaseLogger, ResourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    var i, j, k, l;

    var getNewKoModel = function() {
      var KoModel = RelationshipMatrixMappingModel.getNewModel();
      return KoModel;
    };
    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.relationshipMatrixMaintenance);
    self.clicked = ko.observable(false);
    self.selectedItem = ko.observable("CSA");
    self.previousSelectedItem = ko.observable("");
    self.createOrUpdate = ko.observable();
    self.taskListLoaded = ko.observable(false);
    self.screen = ko.observable("unsaved");
    self.disableCheckboxes = ko.observable(false);
    self.expanded = ko.observable(false);
    self.datasource = ko.observable();
    self.matrixCheckboxSet = ko.observableArray();
    self.columns = ko.observableArray();
    self.taskTreeData = ko.observableArray([]);
    self.relationships = [];

    self.reviewTransactionName = {
      header: self.resource.reviewHeader,
      reviewHeader: self.resource.reviewHeader1
    };
    self.tasksArray = {
      "CSA": [],
      "LON": [],
      "TRD": [],
      "CCA": []
    };
    self.checkboxCount = {
      "CSA": "",
      "LON": "",
      "TRD": "",
      "CCA": ""
    };

    var options = [];
    var checked;

    self.tabChangeHandler = function(event) {
      self.previousSelectedItem(event.detail.previousValue);
      self.datasource(new oj.FlattenedTreeTableDataSource(
        new oj.FlattenedTreeDataSource(
          new oj.JsonTreeDataSource(self.tasksArray[self.selectedItem()]), options)
      ));
    };

    var selectedItemSubscription = self.selectedItem.subscribe(function() {
      self.datasource(new oj.FlattenedTreeTableDataSource(
        new oj.FlattenedTreeDataSource(
          new oj.JsonTreeDataSource(self.tasksArray[self.selectedItem()]), options)
      ));
    });

    self.uiOptions = {
      "menuFloat": "left",
      "fullWidth": false,
      "defaultOption": self.selectedItem
    };
    self.menuOptions = ko.observableArray([{
      id: "CSA",
      label: self.resource.casa
    }, {
      id: "TRD",
      label: self.resource.td
    }, {
      id: "LON",
      label: self.resource.loans
    }, {
      id: "CCA",
      label: self.resource.cc
    }]);

    var getIndex = function(arr, key) {
      for (i = 0; i < arr.length; i++) {
        if (arr[i].accountType === key) {
          return i;
        }
      }
    };

    var getTaskCount = function(arr) {
      var taskCount = 0;
      for (i = 0; i < arr.length; i++) {
        taskCount++;
        for (k = 0; k < arr[i].children.length; k++) {
          taskCount++;
          for (j = 0; j < arr[i].children[k].children.length; j++) {
            taskCount++;
          }
        }
      }
      return taskCount;
    };

    self.saveDetails = function() {
      if (self.screen() === "unsaved") {
        self.createOrUpdate("create");
      } else {
        self.createOrUpdate("update");
      }
      self.screen("review");
      self.disableCheckboxes(true);
    };

    self.editDetails = function() {
      self.screen("edit");
      self.disableCheckboxes(false);
    };

    self.back = function() {
      if (self.screen() === "review") {
        if (self.createOrUpdate() === "create") {
          self.screen("unsaved");
          self.disableCheckboxes(false);
        } else {
          self.screen("edit");
          self.disableCheckboxes(false);
        }
      } else if (self.screen() === "edit") {
        self.screen("view");
        self.disableCheckboxes(true);
      }
    };

    self.cancel = function() {
      Params.dashboard.switchModule("default");
    };

    self.confirm = function() {
      self.clicked(true);
      self.taskToAccountRelationshipMapping = getNewKoModel().taskToAccountRelationshipMapping;
      var mappingObj = JSON.parse(JSON.stringify(self.taskToAccountRelationshipMapping.taskToAccountRelationshipDTOs[0]));
      self.taskToAccountRelationshipMapping.taskToAccountRelationshipDTOs.splice(0);
      for (var accountType in self.tasksArray) {
        if (accountType) {
          for (i = 0; i < self.tasksArray[accountType].length; i++) {
            for (l = 0; l < self.tasksArray[accountType][i].children.length; l++) {
              for (j = 0; j < self.tasksArray[accountType][i].children[l].children.length; j++) {
                if (self.tasksArray[accountType][i].children[l].children[j].attr.selectionMap) {
                  for (k = 0; k < self.tasksArray[accountType][i].children[l].children[j].attr.selectionMap.length; k++) {
                    if (self.tasksArray[accountType][i].children[l].children[j].attr.selectionMap[k] && $.inArray("true", self.tasksArray[accountType][i].children[l].children[j].attr.selectionMap[k].selected()) > -1) {
                      mappingObj.taskId = self.tasksArray[accountType][i].children[l].children[j].attr.id;
                      mappingObj.accountRelationshipCode = self.tasksArray[accountType][i].children[l].children[j].attr.selectionMap[k].rel;
                      mappingObj.accountType = accountType;
                      self.taskToAccountRelationshipMapping.taskToAccountRelationshipDTOs.push(JSON.parse(JSON.stringify(mappingObj)));
                    }
                  }
                }
              }
            }
          }
        }
      }
      RelationshipMatrixMappingModel.createMapping(JSON.stringify(self.taskToAccountRelationshipMapping)).done(function(data, status, jqXhr) {
        Params.baseModel.registerElement("confirm-screen");
        Params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          status: status,
          data: data,
          transactionName: self.resource.relationshipMatrixMaintenance,
          transactionStatus: "ok",
          confirmScreenExtensions: {
            isSet: true,
            taskCode: "AR_N_CMP",
            resourceBundle: self.resource
          }
        }, self);
      });
    };

    var isTransactionType = function(id, arr) {
      for (i = 0; i < arr.length; i++) {
        if (arr[i].attr.id === id) {
          return i;
        }
      }
      return -1;
    };

    var parentIndObj = {
      transactionTypeIndex: "",
      parentIndex: ""
    };
    var isParent = function(id, arr) {
      for (i = 0; i < arr.length; i++) {
        for (l = 0; l < arr[i].children.length; l++) {
          if (arr[i].children[l].attr.id === id) {
            parentIndObj.transactionTypeIndex = i;
            parentIndObj.parentIndex = l;
            return parentIndObj;
          }
        }
      }
      return -1;
    };

    var relationshipPresent = function(val, arr) {
      for (var n = 0; n < arr.length; n++) {
        if (val === arr[n].relationshipCode) {
          return n;
        }
      }
      return -1;
    };

    var parentIndexObj, transactionIndex, relIndex;
    self.checkboxOptionChangeHandler = function(taskId, relationship, event) {
      if (event.detail && event.detail.value && event.detail.previousValue) {
        relIndex = relationshipPresent(relationship, self.relationships);
        if (event.detail.value.length > 0) {
          if ((transactionIndex = isTransactionType(taskId, self.tasksArray[self.selectedItem()])) > -1) {
            for (i = 0; i < self.tasksArray[self.selectedItem()][transactionIndex].children.length; i++) {
              self.tasksArray[self.selectedItem()][transactionIndex].children[i].attr.selectionMap[relIndex].selected.push("true");
              for (j = 0; j < self.tasksArray[self.selectedItem()][transactionIndex].children[i].children.length; j++) {
                self.tasksArray[self.selectedItem()][transactionIndex].children[i].children[j].attr.selectionMap[relIndex].selected.push("true");
              }
            }
          } else {
            parentIndexObj = isParent(taskId, self.tasksArray[self.selectedItem()]);
            if (parentIndexObj.parentIndex > -1) {
              for (i = 0; i < self.tasksArray[self.selectedItem()][parentIndexObj.transactionTypeIndex].children[parentIndexObj.parentIndex].children.length; i++) {
                self.tasksArray[self.selectedItem()][parentIndexObj.transactionTypeIndex].children[parentIndexObj.parentIndex].children[i].attr.selectionMap[relIndex].selected.push("true");
              }
            }
          }
        } else if (event.detail.previousValue.length > 0) {
          if ((transactionIndex = isTransactionType(taskId, self.tasksArray[self.selectedItem()])) > -1) {
            for (i = 0; i < self.tasksArray[self.selectedItem()][transactionIndex].children.length; i++) {
              self.tasksArray[self.selectedItem()][transactionIndex].children[i].attr.selectionMap[relIndex].selected([]);
              for (j = 0; j < self.tasksArray[self.selectedItem()][transactionIndex].children[i].children.length; j++) {
                self.tasksArray[self.selectedItem()][transactionIndex].children[i].children[j].attr.selectionMap[relIndex].selected([]);
              }
            }
          } else {
            parentIndexObj = isParent(taskId, self.tasksArray[self.selectedItem()]);
            if (parentIndexObj.parentIndex > -1) {
              for (i = 0; i < self.tasksArray[self.selectedItem()][parentIndexObj.transactionTypeIndex].children[parentIndexObj.parentIndex].children.length; i++) {
                self.tasksArray[self.selectedItem()][parentIndexObj.transactionTypeIndex].children[parentIndexObj.parentIndex].children[i].attr.selectionMap[relIndex].selected([]);
              }
            }
          }
        }
      }
    };

    if (Params.rootModel && Params.rootModel.params && Params.rootModel.params.data) {
      self.createPayloadToReview = ko.mapping.toJS(Params.rootModel.params.data);
    }
    RelationshipMatrixMappingModel.fetchTasks().done(function(data) {
      self.mappingExist = data.mappingExist;
      self.tasksArrayAll = data.taskRelationshipMappingDTOs;
      RelationshipMatrixMappingModel.fetchRelationships().done(function(data) {
        self.relationships = data.accountRelationshipMaintenaceDTOs;
        RelationshipMatrixMappingModel.fetchRelationshipEnum().done(function(data) {
          self.relationshipEnum = data.enumRepresentations[0].data;
          var columnObj = {
            "headerText": self.resource.transactions,
            "columnId": "transactions",
            "columnText": self.resource.transactions,
            "resizable": "enabled"
          };
          self.columns.push(JSON.parse(JSON.stringify(columnObj)));
          for (k = 0; k < self.relationships.length; k++) {
            delete columnObj.headerText;
            columnObj.columnText = Params.baseModel.format(self.resource.relationshipHeading, {
              relationshipName: Params.baseModel.getDescriptionFromCode(self.relationshipEnum, self.relationships[k].relationshipCode),
              relationshipCode: self.relationships[k].relationshipCode
            });
            columnObj.columnId = self.relationships[k].relationshipCode;
            self.columns.push(JSON.parse(JSON.stringify(columnObj)));
          }
          for (k = 0; k < self.columns().length; k++) {
            self.columns()[k].headerRenderer = oj.KnockoutTemplateUtils.getRenderer("relationship_header", true);
          }

          var casaIndex = getIndex(self.tasksArrayAll, "CSA");
          self.tasksArray.CSA = self.initializeMatrix(casaIndex);
          self.checkboxCount.CSA = getTaskCount(self.tasksArray.CSA) * self.relationships.length;
          var loanIndex = getIndex(self.tasksArrayAll, "LON");
          self.tasksArray.LON = self.initializeMatrix(loanIndex);
          self.checkboxCount.LON = getTaskCount(self.tasksArray.LON) * self.relationships.length;
          var tdIndex = getIndex(self.tasksArrayAll, "TRD");
          self.tasksArray.TRD = self.initializeMatrix(tdIndex);
          self.checkboxCount.TRD = getTaskCount(self.tasksArray.TRD) * self.relationships.length;
          var ccIndex = getIndex(self.tasksArrayAll, "CCA");
          self.tasksArray.CCA = self.initializeMatrix(ccIndex);
          self.checkboxCount.CCA = getTaskCount(self.tasksArray.CCA) * self.relationships.length;

          self.datasource(new oj.FlattenedTreeTableDataSource(
            new oj.FlattenedTreeDataSource(
              new oj.JsonTreeDataSource(self.tasksArray.CSA), options)
          ));
          self.taskListLoaded(true);
          ko.tasks.runEarly();
          if (self.mappingExist) {
            self.screen("view");
            self.disableCheckboxes(true);
          }
        });
      });
    });

    var checkTransaction = function(arr, rel) {
      for (i = 0; i < arr.length; i++) {
        for (j = 0; j < arr[i].taskAccountRelationships.length; j++) {
          if ($.inArray(rel, arr[i].taskAccountRelationships[j].accountRelationshipType) === -1) {
            return false;
          }
        }
      }
      return true;
    };
    var checkTransactionFromList = function(rel, taskId, accountType) {
      for (var m = 0; m < self.createPayloadToReview.taskToAccountRelationshipDTOs.length; m++) {
        if ((self.createPayloadToReview.taskToAccountRelationshipDTOs[m].accountRelationshipCode === rel) && (self.createPayloadToReview.taskToAccountRelationshipDTOs[m].taskId === taskId) && (self.createPayloadToReview.taskToAccountRelationshipDTOs[m].accountType === accountType)) {
          return true;
        }
      }
      return false;
    };

    var checkParentTransaction = function(arr, rel) {
      for (j = 0; j < arr.length; j++) {
        if ($.inArray(rel, arr[j].accountRelationshipType) === -1) {
          return false;
        }
      }
      return true;
    };

    var initializeTransactions = function(taskGroupsArrayFormatted, index, transactionType) {
      for (i = 0; i < self.tasksArrayAll[index][transactionType].length; i++) {
        taskGroupsArrayFormatted.children[i] = {};
        taskGroupsArrayFormatted.children[i].attr = {
          id: self.tasksArrayAll[index][transactionType][i].id,
          name: self.tasksArrayAll[index][transactionType][i].name,
          selectionMap: []
        };
        if (self.tasksArrayAll[index][transactionType][i].accountRelationshipType) {
          for (k = 0; k < self.tasksArrayAll[index][transactionType][i].accountRelationshipType.length; k++) {
            if (relationshipPresent(self.tasksArrayAll[index][transactionType][i].accountRelationshipType[k], self.relationships) > -1) {
              taskGroupsArrayFormatted.children[i].attr.accountRelationshipType.push(JSON.parse(JSON.stringify(self.tasksArrayAll[index][transactionType][i].accountRelationshipType[k])));
            }
          }
        }
        for (l = 0; l < self.relationships.length; l++) {
          taskGroupsArrayFormatted.children[i].attr.selectionMap[l] = {
            rel: self.relationships[l].relationshipCode,
            selected: ko.observableArray()
          };
          if (!self.createPayloadToReview) {
            if (checkParentTransaction(self.tasksArrayAll[index][transactionType][i].taskAccountRelationships, taskGroupsArrayFormatted.children[i].attr.selectionMap[l].rel)) {
              taskGroupsArrayFormatted.children[i].attr.selectionMap[l].selected().push("true");
            }
          }
        }
        taskGroupsArrayFormatted.children[i].children = [];
        for (j = 0; j < self.tasksArrayAll[index][transactionType][i].taskAccountRelationships.length; j++) {
          taskGroupsArrayFormatted.children[i].children[j] = {};
          taskGroupsArrayFormatted.children[i].children[j].attr = {
            id: self.tasksArrayAll[index][transactionType][i].taskAccountRelationships[j].id,
            name: self.tasksArrayAll[index][transactionType][i].taskAccountRelationships[j].name,
            accountRelationshipType: [],
            selectionMap: []
          };
          if (self.tasksArrayAll[index][transactionType][i].taskAccountRelationships[j].accountRelationshipType) {
            for (k = 0; k < self.tasksArrayAll[index][transactionType][i].taskAccountRelationships[j].accountRelationshipType.length; k++) {
              if (relationshipPresent(self.tasksArrayAll[index][transactionType][i].taskAccountRelationships[j].accountRelationshipType[k], self.relationships) > -1) {
                taskGroupsArrayFormatted.children[i].children[j].attr.accountRelationshipType.push(JSON.parse(JSON.stringify(self.tasksArrayAll[index][transactionType][i].taskAccountRelationships[j].accountRelationshipType[k])));
              }
            }
          }
          for (l = 0; l < self.relationships.length; l++) {
            taskGroupsArrayFormatted.children[i].children[j].attr.selectionMap[l] = {
              rel: self.relationships[l].relationshipCode,
              selected: ko.observableArray()
            };
            if (self.createPayloadToReview) {
              if (checkTransactionFromList(taskGroupsArrayFormatted.children[i].children[j].attr.selectionMap[l].rel, taskGroupsArrayFormatted.children[i].children[j].attr.id, self.tasksArrayAll[index].accountType)) {
                taskGroupsArrayFormatted.children[i].children[j].attr.selectionMap[l].selected().push("true");
              }
            } else if ($.inArray(taskGroupsArrayFormatted.children[i].children[j].attr.selectionMap[l].rel, taskGroupsArrayFormatted.children[i].children[j].attr.accountRelationshipType) > -1) {
              taskGroupsArrayFormatted.children[i].children[j].attr.selectionMap[l].selected().push("true");
            }
          }
        }
      }
      if (self.createPayloadToReview) {
        for (i = 0; i < taskGroupsArrayFormatted.children.length; i++) {
          for (l = 0; l < self.relationships.length; l++) {
            checked = true;
            for (j = 0; j < taskGroupsArrayFormatted.children[i].children.length; j++) {
              if ($.isEmptyObject(taskGroupsArrayFormatted.children[i].children[j].attr.selectionMap[l].selected())) {
                checked = false;
                break;
              }
            }
            if (checked) {
              taskGroupsArrayFormatted.children[i].attr.selectionMap[l].selected().push("true");
            }
          }
        }
        for (l = 0; l < self.relationships.length; l++) {
          checked = true;
          for (i = 0; i < taskGroupsArrayFormatted.children.length; i++) {
            if ($.isEmptyObject(taskGroupsArrayFormatted.children[i].attr.selectionMap[l].selected())) {
              checked = false;
              break;
            }
          }
          if (checked) {
            taskGroupsArrayFormatted.attr.selectionMap[l].selected().push("true");
          }
        }
      }
    };

    self.initializeMatrix = function(index) {
      var taskGroupsArrayFormatted = {
        attr: {
          id: "",
          name: self.resource.transactionGroup,
          selectionMap: []
        },
        children: []
      };
      var inquirytaskGroupsArrayFormatted = {
        attr: {
          id: "",
          name: self.resource.inquiry,
          selectionMap: []
        },
        children: []
      };
      for (l = 0; l < self.relationships.length; l++) {
        taskGroupsArrayFormatted.attr.selectionMap[l] = {
          rel: self.relationships[l].relationshipCode,
          selected: ko.observableArray()
        };
        inquirytaskGroupsArrayFormatted.attr.selectionMap[l] = {
          rel: self.relationships[l].relationshipCode,
          selected: ko.observableArray()
        };
        if (!self.createPayloadToReview) {
          if (checkTransaction(self.tasksArrayAll[index].taskGroups, taskGroupsArrayFormatted.attr.selectionMap[l].rel, self.tasksArrayAll[index].taskGroups.id)) {
            taskGroupsArrayFormatted.attr.selectionMap[l].selected.push("true");
          }
          if (checkTransaction(self.tasksArrayAll[index].inquiryTaskGroups, inquirytaskGroupsArrayFormatted.attr.selectionMap[l].rel)) {
            inquirytaskGroupsArrayFormatted.attr.selectionMap[l].selected.push("true");
          }
        }
      }
      self.taskTreeData([]);
      if (self.tasksArrayAll && self.tasksArrayAll[index] && ((self.tasksArrayAll[index].taskGroups && self.tasksArrayAll[index].taskGroups.length > 0) || (self.tasksArrayAll[index].inquiryTaskGroups && self.tasksArrayAll[index].inquiryTaskGroups.length > 0))) {
        taskGroupsArrayFormatted.attr.id = "transaction" + self.tasksArrayAll[index].accountType;
        inquirytaskGroupsArrayFormatted.attr.id = "inquiry" + self.tasksArrayAll[index].accountType;
        taskGroupsArrayFormatted.children = [];
        initializeTransactions(taskGroupsArrayFormatted, index, "taskGroups");

        inquirytaskGroupsArrayFormatted.children = [];
        initializeTransactions(inquirytaskGroupsArrayFormatted, index, "inquiryTaskGroups");
      }
      self.taskTreeData.push(inquirytaskGroupsArrayFormatted);
      self.taskTreeData.push(taskGroupsArrayFormatted);
      return self.taskTreeData();
    };

    self.dispose = function() {
      selectedItemSubscription.dispose();
    };
  };
});
