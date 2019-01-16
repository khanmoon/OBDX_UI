define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojinputtext"
], function (oj, ko, $) {
    "use strict";
    var self, vm = function (params) {
        var i;
        self = this;
        var incotermLabel;
        ko.utils.extend(self, params.rootModel);
        self.documentDaysValue = ko.observable();
        self.incotermValue = ko.observable("");
        self.stageIndex = params.index;
        self.datasourceForDoc = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.docArray, { idAttribute: "id" }));
        self.clauseModalHeading = ko.observable();
        self.selectedClauses = ko.observable();
        self.selectedClausesLength = ko.observable(0);
        if (self.mode() === "EDIT") {
            if(self.letterOfCreditDetails.incoterm.code()){
              self.incotermValue(self.letterOfCreditDetails.incoterm.code());
              incotermLabel = self.incotermTypeOptions().filter(function (data) {
                  return data.value === self.letterOfCreditDetails.incoterm.code();
              });
              if (incotermLabel && incotermLabel.length > 0) {
                  self.dropdownLabels.incoterm(incotermLabel[0].label);
                  self.letterOfCreditDetails.incoterm.description(incotermLabel[0].label);
              }
            }
        }
        self.letterOfCreditDetails.incoterm.code = ko.computed(function () {
            return self.incotermValue();
        });
        self.selectAllDocListener = function(event){
          var allDocsSelected = "false";
          if(event.detail.value.length > 0 && event.detail.value[0] === "true"){
            allDocsSelected = "true";
          }
          for (i = 0; i < self.docArray().length; i++) {
              self.docArray()[i].docSelected([allDocsSelected]);
          }
        };
        self.selectAllClauseListener = function(data, event){
          var allClauseSelected = "false";
          if(event.detail.value.length > 0 && event.detail.value[0] === "true"){
            allClauseSelected = "true";
          }
          for (i = 0; i < self.docArray().length; i++) {
            if (self.docArray()[i].id === data) {
              for (var j = 0; j < self.docArray()[i].clause.length; j++) {
                self.docArray()[i].clause[j].selected([allClauseSelected]);
              }
            }
          }
        };
        self.incotermChangeHandler = function (event) {
            if (event.detail.value) {
                var incoterm = event.detail.value;
                incotermLabel = self.incotermTypeOptions().filter(function (data) {
                    return data.value === incoterm;
                });
                if (incotermLabel && incotermLabel.length > 0) {
                    self.dropdownLabels.incoterm(incotermLabel[0].label);
                    self.letterOfCreditDetails.incoterm.description(incotermLabel[0].label);
                }
            }
        };
        self.viewClauses = function (selectedDoc) {
            self.clausePushFlag = true;
            self.selectedClausesLength(selectedDoc.clause.length);
            for (i = 0; i < self.clauseTableArray().length; i++) {
                if (self.clauseTableArray()[i].docId === selectedDoc.id) {
                    self.selectedClauses(self.clauseTableArray()[i]);
                    self.clausePushFlag = false;
                    break;
                }
            }
            if (self.clausePushFlag && selectedDoc.clause) {
                self.clauseTableArray.push({
                    docId: selectedDoc.id,
                    docName: selectedDoc.name + " Clauses",
                    datasourceForClause: new oj.PagingTableDataSource(new oj.ArrayTableDataSource(selectedDoc.clause, { idAttribute: "rowId" }))
                });
                self.selectedClauses(self.clauseTableArray()[self.clauseTableArray().length - 1]);
            }
            if (!params.baseModel.large()) {
                self.clauseModalHeading(self.selectedClauses().docName);
                $("#documentClauses").trigger("openModal");
            }
        };
        self.hideDocumentClauses =function(){
          $("#documentClauses").hide();
        };
        self.continueFunc = function () {
          var tracker = document.getElementById("documentTracker");
          if (tracker.valid === "valid") {
            self.stages[self.stageIndex()].expanded(false);
            self.stages[self.stageIndex()].validated(true);
            self.stages[self.stageIndex() + 1].expanded(true);
          }else {
              self.stages[self.stageIndex()].validated(false);
              tracker.showMessages();
              tracker.focusOn("@firstInvalidShown");
          }
        };
        self.docSelectionHandler = function (event) {
            if (event.detail.value) {
                var docId = event.target.id.split("_")[1];
                self.docArray().forEach(function (entry) {
                    if (entry.id === docId) {
                        entry.copies(0);
                        entry.originals(0);
                        entry.originalsOutOff(0);
                        entry.clause.forEach(function (clause) {
                            clause.selected([false]);
                        });
                    }
                });
                self.clauseTableArray.remove(function (clauseData) {
                    if (clauseData.docId === docId) {
                        return true;
                    }
                        return false;

                });
            }
        };
    };
    vm.prototype.dispose = function () {
        self.letterOfCreditDetails.incoterm.code.dispose();
    };
    return vm;
});
