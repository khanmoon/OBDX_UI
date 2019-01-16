define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",
  "ojL10n!resources/nls/system-configuration-menu",
  "ojs/ojlistview",
  "ojs/ojdialog",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, BaseLogger, SystemConfigurationMenu, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.menuList = ko.observableArray([]);
    self.validationTracker = ko.observable();
    self.menuLoaded = ko.observable(false);
    self.exapanded = ko.observable(false);
    self.expandStep = ko.observable();
    self.datasource = ko.observable();
    self.datasource1 = ko.observable();
    self.showConfDetailSection = ko.observable(false);
    self.detailData = ko.observable();
    self.dataLoaded = ko.observable(false);
    self.allStepsDone = ko.observable(false);
    self.allStepsData = ko.observableArray();
    self.parentStepsData = ko.observableArray();
    self.childStepsData = ko.observableArray();
    self.displayFlag = ko.observable(false);
    self.showPreviousButton = ko.observable(false);
    self.currentActiveEntity = 0;
    self.allPropertiesInModule = [];
    self.systemConfigurationStatusCurrent = "";
    self.showPayments = false;
    rootParams.baseModel.registerElement("modal-window");
    self.noOfEntitiesRemained = self.noOfEntities - 1;
    self.dynamicArray = {
      "id": ko.observable(),
      "handler": ko.observable(),
      "inputDTOs": ko.observableArray([]),
      "step": ko.observable(0)
    };
    self.configuration = {
      "id": ko.observable(),
      "name": ko.observable(),
      "order": ko.observable(),
      "configurationItemDTOs": ko.observableArray(),
      "template": ko.observable()
    };
    rootParams.baseModel.registerComponent("configuration-details", "system-configuration");
    rootParams.baseModel.registerComponent("configuration-details-view", "system-configuration");
    var newModel = function() {
      var KoModel = SystemConfigurationMenu.getNewModel();
      return ko.mapping.fromJS(KoModel);
    };
    self.expandable = ko.observable(false);
    if (self.selectedHost() === "DEFAULT") {
      self.selectedHost("UBS");
    }
    var lastOrder = 0;
    SystemConfigurationMenu.getMenuList(self.selectedHost(), self.currentEntity()).done(function(data) {
      for (var s = 0; s < data.configurationWizardDTO.configurationDTOs.length; s++) {
        if (data.configurationWizardDTO.configurationDTOs[s].parentID === "MODULE_CONFIGURATION") {
          for (var t = 0; t < data.configurationWizardDTO.configurationDTOs[s].configurationItemDTOs.length; t++) {
            for (var u = 0; u < data.configurationWizardDTO.configurationDTOs[s].configurationItemDTOs[t].inputDTOs.length; u++) {
              self.allPropertiesInModule.push(data.configurationWizardDTO.configurationDTOs[s].configurationItemDTOs[t].inputDTOs[u].fieldName);
            }
          }
        }
      }
      for (var v = 0; v < data.configurationWizardDTO.configurationDTOs.length; v++) {
        if (data.configurationWizardDTO.configurationDTOs[v].id === "PAYMENTS_MODULE_CONFIGURATION") {
          self.showPayments = true;
        }
      }
      for (var x = 0; x < data.configurationWizardDTO.configurationDTOs.length; x++) {
        if (data.configurationWizardDTO.configurationDTOs[x].parentID !== "MODULE_CONFIGURATION" && data.configurationWizardDTO.configurationDTOs[x].id !== "MODULE_CONFIGURATION") {
          self.menuList().push(data.configurationWizardDTO.configurationDTOs[x]);
          lastOrder = data.configurationWizardDTO.configurationDTOs[x].order;
        }
      }
      var extraObj = {
        version: 1,
        auditSequence: 1,
        generatedPackageId: false,
        configurationItemDTOs: [],
        id: "CONFIGURATION_DYNAMIC",
        name: self.nls.dynamicModule,
        order: lastOrder + 1
      };
      self.menuList.push(extraObj);
      var extraChildObj, order = lastOrder + 2;
      SystemConfigurationMenu.getDynamicModuleMenu(self.currentEntity()).done(function(data) {
        for (var i = 0; i < data.configVarBMandatoryResponseList.length; i++) {
          if (data.configVarBMandatoryResponseList[i].module) {
            extraChildObj = {
              version: 1,
              generatedPackageId: false,
              auditSequence: 1,
              id: data.configVarBMandatoryResponseList[i].module,
              name: data.configVarBMandatoryResponseList[i].module,
              order: order,
              parentID: "CONFIGURATION_DYNAMIC",
              configurationItemDTOs: [{
                version: 1,
                generatedPackageId: false,
                auditSequence: 1,
                id: data.configVarBMandatoryResponseList[i].module,
                handler: "DYNAMIC_CONFIGURATION_HANDLER",
                inputDTOs: [{}],
                name: data.configVarBMandatoryResponseList[i].module,
                confItemOrder: 1
              }]
            };
            var tempEntry;
            for (var j = 0; j < data.configVarBMandatoryResponseList[i].mandatoryDTOList.length; j++) {
              tempEntry = "";
              tempEntry = ko.utils.arrayFilter(self.allPropertiesInModule, function(propId) {
                if (propId === data.configVarBMandatoryResponseList[i].mandatoryDTOList[j].propertyId) {
                  return propId;
                }
              });
              if (tempEntry.length > 0 || data.configVarBMandatoryResponseList[i].module === "OTHERMODULE" || (self.showPayments && data.configVarBMandatoryResponseList[i].module.toLowerCase() === "payment") || data.configVarBMandatoryResponseList[i].module.toLowerCase() === "origination" || data.configVarBMandatoryResponseList[i].module.toLowerCase() === "forex deal" || data.configVarBMandatoryResponseList[i].module === "ServiceRequest") {
                extraChildObj.configurationItemDTOs[0].inputDTOs[j].itemOrder = j + 1;
                extraChildObj.configurationItemDTOs[0].inputDTOs[j].fieldName = data.configVarBMandatoryResponseList[i].mandatoryDTOList[j].propertyId;
                if (data.configVarBMandatoryResponseList[i].mandatoryDTOList[j].uiDefinition) {
                  extraChildObj.configurationItemDTOs[0].inputDTOs[j].uiDefinition = data.configVarBMandatoryResponseList[i].mandatoryDTOList[j].uiDefinition;
                }
                if (data.configVarBMandatoryResponseList[i].mandatoryDTOList[j].type) {
                  extraChildObj.configurationItemDTOs[0].inputDTOs[j].type = data.configVarBMandatoryResponseList[i].mandatoryDTOList[j].type;
                }
                if (data.configVarBMandatoryResponseList[i].mandatoryDTOList[j].propertyValue) {
                  extraChildObj.configurationItemDTOs[0].inputDTOs[j].inputValues = data.configVarBMandatoryResponseList[i].mandatoryDTOList[j].propertyValue;
                }
                extraChildObj.configurationItemDTOs[0].inputDTOs[j].envId = data.configVarBMandatoryResponseList[i].mandatoryDTOList[j].environmentId;
                extraChildObj.configurationItemDTOs[0].inputDTOs[j].module = data.configVarBMandatoryResponseList[i].module;
                extraChildObj.configurationItemDTOs[0].inputDTOs.push({});
              }
            }
            extraChildObj.configurationItemDTOs[0].inputDTOs.splice(-1, 1);
            if (extraChildObj.configurationItemDTOs[0].inputDTOs.length > 0) {
              self.menuList.push(extraChildObj);
              order++;
            }
          }
        }
        for (var k = 0; k < self.menuList().length; k++) {
          if (self.menuList()[k].parentID === undefined) {
            for (var l = 0; l < self.menuList().length; l++) {
              if (self.menuList()[l].parentID === self.menuList()[k].id) {
                self.expandable(true);
                break;
              }
            }
          }
          var stepObject = {
            id: self.menuList()[k].id,
            name: self.menuList()[k].name,
            configuration: self.menuList()[k],
            visited: false,
            step: self.menuList()[k].order,
            expandable: self.expandable(),
            parentID: self.menuList()[k].parentID === undefined ? null : self.menuList()[k].parentID
          };
          self.allStepsData.push(stepObject);
          self.expandable(false);
        }
        for (var m = 0; m < self.menuList().length; m++) {
          if (self.menuList()[m].parentID === undefined) {
            for (var n = 0; n < self.menuList().length; n++) {
              if (self.menuList()[n].parentID === self.menuList()[m].id) {
                self.expandable(true);
                break;
              }
            }
            var stepObject1 = {
              id: self.menuList()[m].id,
              name: self.menuList()[m].name,
              configuration: self.menuList()[m],
              visited: false,
              step: self.menuList()[m].order,
              expandable: self.expandable()
            };
            self.parentStepsData.push(stepObject1);
          }
        }
        self.openConfigurationComponent(self.parentStepsData()[0]);
        self.dataSource = new oj.ArrayTableDataSource(self.parentStepsData, {
          idAttribute: "id"
        });
        self.menuLoaded(true);
        self.entityDataLoaded(true);
      });
    });
    rootParams.baseModel.registerElement("confirm-screen");
    self.clickStep = function(data) {
      self.mode("view");
      self.openConfigurationComponent(data);
    };
    self.collapse = function(data) {
      self.exapanded(false);
      self.openConfigurationComponent(self.parentStepsData()[data.step - 1]);
    };
    self.expand = function(data) {
      self.childStepsData.removeAll();
      if (data.expandable) {
        self.expandStep(data.step);
      }
      for (var m = 0; m < self.menuList().length; m++) {
        if (self.menuList()[m].parentID === data.id) {
          var stepObject1 = {
            id: self.menuList()[m].id,
            name: self.menuList()[m].name,
            configuration: self.menuList()[m],
            visited: false,
            step: self.menuList()[m].order
          };
          self.childStepsData.push(stepObject1);
        }
      }
      self.openConfigurationComponent(self.childStepsData()[0]);
      self.dataSource1 = new oj.ArrayTableDataSource(self.childStepsData, {
        idAttribute: "id"
      });
      $("ul.listview li").each(function(index, element) {
        if (element.innerText.trim() === data.name) {
          $(element).find("a span#stepMarker").addClass("icons icon-arrow-down");
        }
      });
      self.exapanded(true);
    };
    self.openConfigurationComponent = function(data) {
      self.exapand = ko.observable(false);
      var updatedAllStepsData = $.map(self.allStepsData(), function(item) {
        if (data.name === item.name) {
          item.visited = true;
        }
        return item;
      });
      self.allStepsData(updatedAllStepsData);
      ko.utils.arrayForEach(self.parentStepsData(), function(item) {
        if (item.name === data.name && item.expandable === true) {
          self.exapand(true);
        }
      });
      if (!self.exapand()) {
        self.detailData(self.allStepsData()[data.step]);
      } else {
        self.expand(data);
      }
      self.showConfDetailSection(true);
    };
    self.edit = function() {
      self.mode("edit");
    };
    self.cancel = function() {
      if (self.mode() === "create")
        $("#cancelConfirm").trigger("openModal");
      else if (self.mode() === "edit" || self.mode() === "review") {
        $("#cancelConfirm").trigger("openModal");
      } else {
        rootParams.dashboard.openDashBoard(void 0, void 0);
      }
    };
    self.closeCancelPopup = function() {
      $("#cancelConfirm").hide();
    };
    self.redirectCancelPopup = function() {
      $("#cancelConfirm").hide();
      rootParams.dashboard.openDashBoard(void 0, void 0);
    };
    self.closeSubmissionConfirmationPopup = function() {
      rootParams.dashboard.loadComponent("system-configuration-welcome", {}, self);
      $("#confirmEntitySubmission").hide();
    };
    self.updateStepData = function(data) {
      var updatedAllStepsData = $.map(self.allStepsData(), function(item) {
        if (data.name === item.name) {
          item.configuration = data;
        }
        return item;
      });
      self.allStepsData(updatedAllStepsData);
    };
    var configurationArray = [];
    self.next = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      configurationArray = [];
      var nextStep = self.configuration.order() + 1;
      self.showPreviousButton(true);
      configurationArray.push(ko.mapping.toJS(self.configuration));
      self.updateStepData(configurationArray[0]);
      if (self.allStepsData()[nextStep].expandable) {
        self.allStepsData()[nextStep].visited = true;
        self.expandStep(nextStep);
      }
      $("ul.listview li").each(function(index, element) {
        ko.utils.arrayForEach(self.allStepsData(), function(item) {
          if (element.innerText.trim() === item.name && item.visited === true) {
            $(element).find("a.stepMarker").removeClass("icons icon-arrow-right");
            if (item.expandable) {
              $(element).find("a.stepMarker").addClass("icons icon-arrow-down");
            } else {
              $(element).find("a.stepMarker").addClass("icons icon-check");
            }
            $(element).find("a.configName").removeClass("active");
          }
        });
      });
      self.openConfigurationComponent(self.allStepsData()[nextStep]);
      if (nextStep + 1 === self.allStepsData().length) {
        self.allStepsDone(true);
      }
    };
    self.previous = function() {
      configurationArray = [];
      var previousStep = self.configuration.order() - 1;
      if (previousStep <= 0)
        self.showPreviousButton(false);
      self.allStepsDone(false);
      configurationArray.push(ko.mapping.toJS(self.configuration));
      self.updateStepData(configurationArray[0]);
      if (self.allStepsData()[previousStep].expandable) {
        self.openConfigurationComponent(self.allStepsData()[previousStep - 1]);
      } else
        self.openConfigurationComponent(self.allStepsData()[previousStep]);
    };
    self.saveOnEdit = function() {
      configurationArray = [];
      configurationArray.push(ko.mapping.toJS(self.configuration));
      self.mode("review");
      self.updateStepData(configurationArray[0]);
      self.openConfigurationComponent(self.allStepsData()[self.configuration.order()]);
    };
    self.postHandler = function(data, status, jqXhr) {
      var currentEntityIndex = 0;
      for (var j = 0; j < self.entities().length; j++) {
        if (self.entities()[j].businessUnitCode === self.currentEntity()) {
          currentEntityIndex = j;
          break;
        }
      }
      self.entities()[currentEntityIndex].temp_configurationDone(true);
      self.noOfEntitiesRemained = self.entities().length - currentEntityIndex - 1;
      if (self.noOfEntitiesRemained > 0) {
        self.currentEntity(self.entities()[currentEntityIndex + 1].businessUnitCode);
        self.currentEntityName(self.entities()[currentEntityIndex + 1].businessUnitName());
        $("#confirmEntitySubmission").trigger("openModal");
      } else {
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: rootParams.dashboard.headerName(),
          template: "system-configuration/system-configuration-confirm-screen"
        }, self);
      }
    };
    SystemConfigurationMenu.fetchSystemConfigurationDetails(self.currentEntity()).done(function(data) {
      if (data.configResponseList[0].propertyValue) {
        self.systemConfigurationStatusCurrent = data.configResponseList[0].propertyValue;
      }
    });
    self.save = function() {
      self.rootModelInstance = ko.observable(newModel());
      configurationArray = [];
      configurationArray.push(ko.mapping.toJS(self.configuration));
      self.updateStepData(configurationArray[0]);
      configurationArray = [];
      for (var j = 0; j < self.allStepsData().length; j++) {
        if (self.allStepsData()[j].configuration.configurationItemDTOs.length > 0) {
          for (var k = 0; k < self.allStepsData()[j].configuration.configurationItemDTOs.length; k++) {
            for (var i = 0; i < self.allStepsData()[j].configuration.configurationItemDTOs[k].inputDTOs.length; i++) {
              if (self.allStepsData()[j].configuration.configurationItemDTOs[k].inputDTOs[i].type === "LISTBOX") {
                if (self.allStepsData()[j].configuration.configurationItemDTOs[k].inputDTOs[i].inputValues instanceof Array)
                  self.allStepsData()[j].configuration.configurationItemDTOs[k].inputDTOs[i].inputValues = self.allStepsData()[j].configuration.configurationItemDTOs[k].inputDTOs[i].inputValues[0];
                else {
                  self.allStepsData()[j].configuration.configurationItemDTOs[k].inputDTOs[i].inputValues = self.allStepsData()[j].configuration.configurationItemDTOs[k].inputDTOs[i].inputValues;
                }
              }
              self.allStepsData()[j].configuration.configurationItemDTOs[k].inputDTOs[i].determinantValue = self.currentEntity();
              delete self.allStepsData()[j].configuration.configurationItemDTOs[k].inputDTOs[i].tempObj;
              delete self.allStepsData()[j].configuration.configurationItemDTOs[k].step;
              delete self.allStepsData()[j].configuration.configurationItemDTOs[k].name;
            }
          }
        }
        delete self.allStepsData()[j].configuration.template;
        self.rootModelInstance().finalPayLoad.configurationDTOs.push(self.allStepsData()[j].configuration);
      }
      self.rootModelInstance().finalPayLoad.determinantValue = self.currentEntity();
      self.rootModelInstance().finalPayLoad.entityName = self.currentEntityName();
      if (self.systemConfigurationStatusCurrent === "false" && self.currentEntity() === self.defaultEntityFetched()) {
        SystemConfigurationMenu.createConfiguration(self.selectedHost(), self.currentEntity(), true, ko.toJSON(self.rootModelInstance().finalPayLoad)).done(function(data, status, jqXhr) {
          self.postHandler(data, status, jqXhr);
        });
      } else if (self.systemConfigurationStatusCurrent === "false") {
        SystemConfigurationMenu.createConfiguration(self.selectedHost(), self.currentEntity(), true, ko.toJSON(self.rootModelInstance().finalPayLoad)).done(function(data, status, jqXhr) {
          self.postHandler(data, status, jqXhr);
        });
      } else if (self.systemConfigurationStatusCurrent === "true") {
        SystemConfigurationMenu.createConfiguration(self.selectedHost(), self.currentEntity(), false, ko.toJSON(self.rootModelInstance().finalPayLoad)).done(function(data, status, jqXhr) {
          self.postHandler(data, status, jqXhr);
        });
      }
    };
    self.confirmationModal = function() {
      $("#statementDialog").trigger("openModal");
    };
    self.ok = function() {
      SystemConfigurationMenu.logOut();
    };
  };
});
