define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/authorization",
  "ojs/ojdatagrid",
  "ojs/ojcheckboxset",
  "ojs/ojflattenedtreedatagriddatasource",
  "ojs/ojtable",
  "ojs/ojrowexpander",
  "ojs/ojflattenedtreetabledatasource",
  "ojs/ojjsontreedatasource"
], function(oj, ko, $, RoleTransactionMappingModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.dataSource = ko.observable();
    rootParams.dashboard.headerName(self.nls.common.roleTransactionMapping);
    var countActions, currentActionCount;
    if(rootParams.datasource !== undefined && rootParams.datasource.countActions !== undefined){
    countActions =rootParams.datasource.countActions;
    currentActionCount = rootParams.datasource.currentActionCount;
    }
    else{
    countActions = [0,0,0];
    currentActionCount = [0,0,0];
    }
    var actionsIndex = [self.nls.headings.perform, self.nls.headings.approve, self.nls.headings.view];
    self.actionCheckbox = [];
    for (var i = 0; i < 3; i++) {
      if (countActions[i] > 0 && (countActions[i] === currentActionCount[i]))
        self.actionCheckbox[i] = ko.observableArray(["true"]);
      else
        self.actionCheckbox[i] = ko.observableArray([]);
    }
    self.readMode = ko.observable(true);
    if (!rootParams.readMode)
      self.readMode(false);
    var expectedDataSource = rootParams.datasource !== undefined ? rootParams.datasource.expectedDataSource : [];
    self.row1expanded=ko.observable(true);
    var option = {};
    self.dataSource(new oj.FlattenedTreeTableDataSource(
      new oj.FlattenedTreeDataSource(
        new oj.JsonTreeDataSource(expectedDataSource), option)
    ));
    var parentIndex = {};
    self.selectParent = function(columnIndex) {
      if (parentIndex.j >= 0) {
        var tempCount = 0,
          totalCount = 0;
        if (columnIndex) {
          if (expectedDataSource[parentIndex.l].children[parentIndex.i].children[parentIndex.j].actionTypeMap[columnIndex - 1].selected()[0] === "true")
            expectedDataSource[parentIndex.l].children[parentIndex.i].children[parentIndex.j].actionTypeMap[columnIndex - 1].selected()[0] = "false";
          else
            expectedDataSource[parentIndex.l].children[parentIndex.i].children[parentIndex.j].actionTypeMap[columnIndex - 1].selected()[0] = "true";
        }
        for (var a = 0; a < expectedDataSource[parentIndex.l].children[parentIndex.i].children[parentIndex.j].actionTypeMap.length; a++) {
          if (expectedDataSource[parentIndex.l].children[parentIndex.i].children[parentIndex.j].actionTypeMap[a].disable() === "false") {
            totalCount += 1;
            if (expectedDataSource[parentIndex.l].children[parentIndex.i].children[parentIndex.j].actionTypeMap[a].selected()[0] === "true")
              tempCount += 1;
          }
        }
        if (tempCount === totalCount) {
          expectedDataSource[parentIndex.l].children[parentIndex.i].children[parentIndex.j].attr.selected([]);
          expectedDataSource[parentIndex.l].children[parentIndex.i].children[parentIndex.j].attr.selected().push("true");
        } else {
          expectedDataSource[parentIndex.l].children[parentIndex.i].children[parentIndex.j].attr.selected([]);
          expectedDataSource[parentIndex.l].children[parentIndex.i].children[parentIndex.j].attr.selected().push("false");
        }
      }
      if (parentIndex.i >= 0) {
        tempCount = 0;
        for (a = 0; a < expectedDataSource[parentIndex.l].children[parentIndex.i].children.length; a++) {
          if (expectedDataSource[parentIndex.l].children[parentIndex.i].children[a].attr.selected()[0] === "true")
            tempCount += 1;
        }
        if (tempCount === expectedDataSource[parentIndex.l].children[parentIndex.i].children.length) {
          expectedDataSource[parentIndex.l].children[parentIndex.i].attr.selected([]);
          expectedDataSource[parentIndex.l].children[parentIndex.i].attr.selected().push("true");
        } else {
          expectedDataSource[parentIndex.l].children[parentIndex.i].attr.selected([]);
          expectedDataSource[parentIndex.l].children[parentIndex.i].attr.selected().push("false");
        }
      }
      if (parentIndex.l >= 0) {
        tempCount = 0;
        for (a = 0; a < expectedDataSource[parentIndex.l].children.length; a++) {
          if (expectedDataSource[parentIndex.l].children[a].attr.selected()[0] === "true")
            tempCount += 1;
        }
        if (tempCount === expectedDataSource[parentIndex.l].children.length) {
          expectedDataSource[parentIndex.l].attr.selected([]);
          expectedDataSource[parentIndex.l].attr.selected().push("true");
        } else {
          expectedDataSource[parentIndex.l].attr.selected([]);
          expectedDataSource[parentIndex.l].attr.selected().push("false");
        }
      }

    };
    self.manipulateCurrentChild = function() {
      var context = this;
      var checkboxid = context.cellContext.key;
      var depth = context.cellContext.depth;
      var parentKey = context.cellContext.parentKey;
      var columnIndex = context.columnIndex;
      var checkBoxValue = "";
      var i, j, l, m;
      parentIndex = {};
      var checkboxData = context.row.selected();
      self.checkActions = function(m) {
        if (countActions[m] === currentActionCount[m]) {
          self.actionCheckbox[m]([]);
          self.actionCheckbox[m]().push("true");
        } else {
          self.actionCheckbox[m]([]);
        }
      };
      self.checkChild = function() {
        if ((depth === 1 && expectedDataSource[l].attr.id === checkboxid) || (depth === 2 && expectedDataSource[l].attr.id === parentKey && expectedDataSource[l].children[i].attr.id === checkboxid) || (depth === 3 && columnIndex === 0 && expectedDataSource[l].children[i].attr.id === parentKey && expectedDataSource[l].children[i].children[j].attr.id === checkboxid)) {
          expectedDataSource[l].children[i].children[j].attr.selected([]);
          expectedDataSource[l].children[i].children[j].attr.selected().push(checkBoxValue);
          if (depth === 3)
            parentIndex = {
              l: l,
              i: i,
              j: -1
            };
          for (m = 0; m < expectedDataSource[l].children[i].children[j].actionTypeMap.length; m++) {
            if (expectedDataSource[l].children[i].children[j].actionTypeMap[m].disable() === "false") {
              if (checkBoxValue === "true" && (expectedDataSource[l].children[i].children[j].actionTypeMap[m].selected()[0] === "false" || expectedDataSource[l].children[i].children[j].actionTypeMap[m].selected().length === 0)) {
                currentActionCount[m]++;
                self.checkActions(m);
              } else if (checkBoxValue === "false" && expectedDataSource[l].children[i].children[j].actionTypeMap[m].selected()[0] === "true") {
                currentActionCount[m]--;
                self.checkActions(m);
              }
              expectedDataSource[l].children[i].children[j].actionTypeMap[m].selected([]);
              expectedDataSource[l].children[i].children[j].actionTypeMap[m].selected().push(checkBoxValue);

            }
          }
        } else if (depth === 3 && columnIndex !== 0 && expectedDataSource[l].children[i].attr.id === parentKey && expectedDataSource[l].children[i].children[j].attr.id === checkboxid) {
          if (expectedDataSource[l].children[i].children[j].actionTypeMap[columnIndex - 1].selected()[0] === "true") {
            currentActionCount[columnIndex - 1]--;
            self.checkActions(columnIndex - 1);
          } else {
            currentActionCount[columnIndex - 1]++;
            self.checkActions(columnIndex - 1);
          }
          parentIndex = {
            l: l,
            i: i,
            j: j
          };
        }
      };
      self.checkUpDown = function() {
        for (l = 0; l < expectedDataSource.length; l++) {
          if (depth === 1 && expectedDataSource[l].attr.id === checkboxid) {
            expectedDataSource[l].attr.selected([]);
            expectedDataSource[l].attr.selected().push(checkBoxValue);
            parentIndex = {
              l: -1,
              i: -1,
              j: -1
            };
          }
          for (i = 0; i < expectedDataSource[l].children.length; i++) {
            if ((depth === 1 && expectedDataSource[l].attr.id === checkboxid) || (depth === 2 && expectedDataSource[l].children[i].attr.id === checkboxid && expectedDataSource[l].attr.id === parentKey)) {
              expectedDataSource[l].children[i].attr.selected([]);
              expectedDataSource[l].children[i].attr.selected().push(checkBoxValue);
              if (depth === 2)
                parentIndex = {
                  l: l,
                  i: -1,
                  j: -1
                };

            }
            for (j = 0; j < expectedDataSource[l].children[i].children.length; j++) {
              self.checkChild();
            }
          }
        }
      };


      if (checkboxData !== null) {
        if (checkboxData.length === 0 || checkboxData[0] === "false") {
          checkBoxValue = "true";
          self.checkUpDown();
          self.selectParent(columnIndex);
        } else {
          checkBoxValue = "false";
          self.checkUpDown();
          self.selectParent(columnIndex);
        }
      }
    };

    self.selectAllListener = function(event, data) {
      var i, j, l, m;
      var checkboxData = event.target.checked;
      var checkBoxValue = "";
      parentIndex = {};
      self.actionListener = function() {
        for (l = 0; l < expectedDataSource.length; l++) {
          for (i = 0; i < expectedDataSource[l].children.length; i++) {
            for (j = 0; j < expectedDataSource[l].children[i].children.length; j++) {
              for (m = 0; m < expectedDataSource[l].children[i].children[j].actionTypeMap.length; m++) {
                if (expectedDataSource[l].children[i].children[j].actionTypeMap[m].action === data && expectedDataSource[l].children[i].children[j].actionTypeMap[m].disable() === "false") {
                  expectedDataSource[l].children[i].children[j].actionTypeMap[m].selected([]);
                  expectedDataSource[l].children[i].children[j].actionTypeMap[m].selected().push(checkBoxValue);
                  parentIndex = {
                    l: l,
                    i: i,
                    j: j
                  };
                  self.selectParent();
                }
              }
            }
          }
        }
      };
      if (checkboxData !== null) {
        if (checkboxData) {
          currentActionCount[actionsIndex.indexOf(data)] = countActions[actionsIndex.indexOf(data)];
          checkBoxValue = "true";
          self.actionListener();
        } else {
          currentActionCount[actionsIndex.indexOf(data)] = 0;
          checkBoxValue = "false";
          self.actionListener();
        }
      }
    };
    self.columnArray = [{
        "headerText": self.nls.headings.transactions,
        "renderer": oj.KnockoutTemplateUtils.getRenderer("row_template", true)
      },
      {
        "headerText": self.nls.headings.perform,
        "headerRenderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
        "renderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl", true),
        "id": self.nls.headings.perform
      },
      {
        "headerText": self.nls.headings.approve,
        "headerRenderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
        "renderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl", true),
        "id": self.nls.headings.approve
      },
      {
        "headerText": self.nls.headings.view,
        "id": self.nls.headings.view,
        "headerRenderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
        "renderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl", true)
      }
    ];
  };
});
