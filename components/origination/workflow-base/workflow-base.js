define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",

  "ojL10n!resources/nls/workflow-configuration",
  "./model",
  "jqueryui-amd/widgets/sortable",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, BaseLogger, ResourceBundle, WorkflowConfigurationModel) {
  "use strict";

  return function(Params) {
    var self = this,
      i = 0,
      j = 0;
    ko.utils.extend(self, Params.rootModel);
    self.preLoadRootModel = Params.rootModel;
    self.model = Params.model;
    self.validationTracker = Params.validator;
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.productConfiguration);
    self.transactionName = ko.observable(self.resource.maintenance);

    self.headInputArray = ko.observableArray();
    self.productsArray = ko.observableArray();
    self.currentProductsArray = ko.observableArray();
    self.currentProduct = ko.observable();
    self.currentProductName = ko.observable();
    self.currentProductClass = ko.observable();
    self.isDefault = ko.observable();

    self.referenceNumber = ko.observable();

    self.headInputArrayLoaded = ko.observable(false);
    self.flowsLoaded = ko.observable(false);

    self.loadSecondScreen = ko.observable(false);

    self.customFlowExists = ko.observable();
    self.customFlowNA = ko.observable();

    self.selectedProductClass = ko.observable();
    self.showProductSelction = ko.observable(false);

    self.loadDefaultFlowDisplay = ko.observable(false);

    self.loadViewScreen = ko.observable(false);
    self.loadCustomViewScreen = ko.observable(false);
    self.loadCreateScreen = ko.observable(false);
    self.loadEditScreen = ko.observable(false);
    self.loadReviewScreen = ko.observable(false);
    self.loadReviewButton = ko.observable(false);

    self.defaultWorkflowId = ko.observable();
    self.customWorkflowId = ko.observable();

    self.defaultWorkflowIdIndex = ko.observable();
    self.customWorkflowIdIndex = ko.observable();

    self.activationWorkflowId = ko.observable();

    Params.baseModel.registerElement("confirm-screen");
    Params.baseModel.registerComponent("workflow-configuration", "origination");

    self.headArray = ko.observableArray();
    self.bodyArray = ko.observableArray();
    self.tailArray = ko.observableArray();

    self.payload = ko.observable();
    self.customHeadArray = ko.observableArray();
    self.customBodyArray = ko.observableArray();
    self.customTailArray = ko.observableArray();

    self.defaultWorkflowIdIndex = ko.observable(0);
    self.customWorkflowIdIndex = ko.observable(0);

    if (self.preLoadRootModel.headInputArray) {

      ko.utils.extend(self, self.preLoadRootModel);
      self.headInputArrayLoaded(false);

    }

    self.goToViewScreen = function() {

      self.loadViewScreen(true);
      self.loadCustomViewScreen(false);
      self.loadCreateScreen(false);
      self.loadEditScreen(false);
      self.loadReviewScreen(false);

      Params.dashboard.loadComponent("workflow-configuration", {}, self);
    };
    self.goToCreateScreen = function() {
      self.loadViewScreen(false);
      self.loadCustomViewScreen(false);
      self.loadCreateScreen(true);
      self.loadEditScreen(true);
      self.loadReviewScreen(false);

      Params.dashboard.loadComponent("workflow-configuration", {}, self);
    };

    self.gotoMainScreen = function() {

      Params.dashboard.loadComponent("workflow-base", {}, self);
    };
    self.goBack = function() {
      self.loadSecondScreen(true);
      Params.dashboard.loadComponent("workflow-base", {}, self);
    };
    self.goToCustomViewScreen = function() {
      if (!self.customFlowExists()) {

        self.goBack();
      } else {
        self.loadDefaultFlowDisplay(false);
        self.loadViewScreen(false);
        self.loadCustomViewScreen(true);
        self.loadCreateScreen(false);
        self.loadEditScreen(false);
        self.loadReviewScreen(false);

        Params.dashboard.loadComponent("workflow-configuration", {}, self);
      }
    };
    self.goToEditScreen = function() {
      self.loadDefaultFlowDisplay(false);
      self.loadViewScreen(false);
      self.loadCustomViewScreen(false);
      self.loadCreateScreen(false);
      self.loadEditScreen(true);
      self.loadReviewScreen(false);

      Params.dashboard.loadComponent("workflow-configuration", {}, self);
    };

    self.goToReviewScreen = function() {
      $("#sortable").sortable("disable");
      self.loadDefaultFlowDisplay(true);
      self.loadReviewButton(true);
      $("#sortable").removeClass("movable");
      var i;
      if (self.customBodyArray().length > 0) {
        for (i = 0; i < self.customBodyArray().length; i++) {
          $("#movable" + i).removeClass("icon-move");
        }
      } else {
        for (i = 0; i < self.bodyArray().length; i++) {
          $("#movable" + i).removeClass("icon-move");
        }
      }
    };
    self.goBackToEditScreen = function() {
      $("#sortable").sortable("enable");
      $("#sortable").addClass("movable");
      var i;
      if (self.customBodyArray().length > 0) {
        for (i = 0; i < self.customBodyArray().length; i++) {
          $("#movable" + i).addClass("icon-move");
        }
      } else {
        for (i = 0; i < self.bodyArray().length; i++) {
          $("#movable" + i).addClass("icon-move");
        }
      }
      self.loadDefaultFlowDisplay(false);
      self.loadReviewButton(false);
    };

    self.goToActivateConfirmScreen = function() {
      if (!self.isDefault())
        self.activationWorkflowId(self.defaultWorkflowId());
      else
        self.activationWorkflowId(self.customWorkflowId());

      WorkflowConfigurationModel.activateWorkflow(self.activationWorkflowId()).done(function(data, status, jqXhr) {
        self.referenceNumber(data.status.referenceNumber);
        self.loadViewScreen(false);
        self.loadCustomViewScreen(false);
        self.loadCreateScreen(false);
        self.loadEditScreen(false);
        self.loadReviewScreen(false);

        Params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.transactionName()
        }, self);
      });
    };

    self.goToConfirmScreen = function() {
      if (self.customFlowExists()) {

        WorkflowConfigurationModel.updateWorkflow(self.payload().workflowId, ko.toJSON(self.payload())).done(function(data, status, jqXhr) {
          self.referenceNumber(data.status.referenceNumber);
          self.loadViewScreen(false);
          self.loadCustomViewScreen(false);
          self.loadCreateScreen(false);
          self.loadEditScreen(false);
          self.loadReviewScreen(false);

          Params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.transactionName()
          }, self);
        });
      } else {

        WorkflowConfigurationModel.saveWorkflow(ko.toJSON(self.payload())).done(function(data, status, jqXhr) {
          self.referenceNumber(data.status.referenceNumber);
          self.loadViewScreen(false);
          self.loadCustomViewScreen(false);
          self.loadCreateScreen(false);
          self.loadEditScreen(false);
          self.loadReviewScreen(false);

          Params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.transactionName()
          }, self);
        });
      }
    };

    self.showView = function() {
      self.showProductSelction(true);
    };

    WorkflowConfigurationModel.fetchProducts().done(function(data) {
      self.headInputArrayLoaded(false);
      self.headInputArray.removeAll();
      self.productsArray.removeAll();
      for (i = 0; i < data.products.length; i++) {
        self.headInputArray.push(data.products[i].productClass);
        for (j = 0; j < data.products[i].productSubClass.length; j++) {
          self.productsArray.push({
            "class": data.products[i].productClass.code,
            "products": data.products[i].productSubClass[j]
          });

        }
      }
      if (data.products.length === 1) {
        self.currentProductsArray.removeAll();
        for (i = 0; i < self.productsArray().length; i++) {

          self.currentProductsArray.push(self.productsArray()[i].products);

        }

        self.currentProductClass(data.products[0].productClass.code);
        self.showProductSelction(true);

      }

      self.headInputArrayLoaded(true);
    });

    self.changeProductClass = function(event) {
      if (event.type === "valueChanged") {

        self.loadSecondScreen(false);
        self.showProductSelction(false);
        ko.tasks.runEarly();
        self.currentProductsArray.removeAll();

        for (i = 0; i < self.productsArray().length; i++) {
          if (self.productsArray()[i].class === event.detail.value) {
            self.currentProductsArray.push(self.productsArray()[i].products);
          }
        }
        self.showProductSelction(true);
      }
    };

    self.changeProduct = function(event) {
      if (event.type === "valueChanged") {
        self.loadSecondScreen(false);
        self.currentProductName("");
        WorkflowConfigurationModel.fetchWorkflow(self.currentProductClass(), self.currentProduct().substring(0, self.currentProduct().indexOf("|"))).done(function(data) {
          if (data.workflows[0] === undefined)
            return;

          for (i = 0; i < data.workflows.length; i++) {
            if (data.workflows[i].default) {
              self.defaultWorkflowIdIndex(i);
              self.defaultWorkflowId(data.workflows[i].workflowId);

            }
            if (!data.workflows[i].default) {
              self.customWorkflowIdIndex(i);
              self.customWorkflowId(data.workflows[i].workflowId);

            }
          }

          self.isDefault(data.workflows[self.defaultWorkflowIdIndex()].activeStatus);
          self.headArray.removeAll();
          self.bodyArray.removeAll();
          self.tailArray.removeAll();

          self.customHeadArray.removeAll();
          self.customBodyArray.removeAll();
          self.customTailArray.removeAll();

          if (data.workflows.length === 1) {
            self.customFlowExists(false);
            self.customFlowNA(true);

            self.payload(data.workflows[self.defaultWorkflowIdIndex()]);
          } else if (data.workflows.length > 1) {
            self.customFlowExists(true);
            self.customFlowNA(false);

            self.payload(data.workflows[self.customWorkflowIdIndex()]);
          }

          for (i = 0; i < data.workflows[self.defaultWorkflowIdIndex()].head.steps.length; i++) {
            self.headArray.push(data.workflows[self.defaultWorkflowIdIndex()].head.steps[i]);
          }

          for (i = 0; i < data.workflows[self.defaultWorkflowIdIndex()].body.steps[0].steps.length; i++) {
            self.bodyArray.push(data.workflows[self.defaultWorkflowIdIndex()].body.steps[0].steps[i]);
          }

          for (i = 0; i < data.workflows[self.defaultWorkflowIdIndex()].tail.steps.length; i++) {
            self.tailArray.push(data.workflows[self.defaultWorkflowIdIndex()].tail.steps[i]);
          }

          if (data.workflows.length > 1) {

            for (i = 0; i < data.workflows[self.customWorkflowIdIndex()].head.steps.length; i++) {
              self.customHeadArray.push(data.workflows[self.customWorkflowIdIndex()].head.steps[i]);
            }

            for (i = 0; i < data.workflows[self.customWorkflowIdIndex()].body.steps[0].steps.length; i++) {
              self.customBodyArray.push(data.workflows[self.customWorkflowIdIndex()].body.steps[0].steps[i]);
            }

            for (i = 0; i < data.workflows[self.customWorkflowIdIndex()].tail.steps.length; i++) {
              self.customTailArray.push(data.workflows[self.customWorkflowIdIndex()].tail.steps[i]);
            }
          }

          self.flowsLoaded(true);
          self.loadSecondScreen(true);
        });

      }
    };
  };
});
