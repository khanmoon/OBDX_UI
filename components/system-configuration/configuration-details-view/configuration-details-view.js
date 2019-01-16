define([
  "knockout",
  "jquery",

  "ojL10n!resources/nls/configuration-details",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojcheckboxset"
], function(ko, $, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.data = ko.mapping.fromJS(rootParams.data);
    self.configuration.id = "";
    self.configuration.name = "";
    self.configuration.configurationItemDTOs.removeAll();
    rootParams.baseModel.registerElement("action-header");
    self.tabLists = ko.observableArray([{
        id: "HOST_CONFIGURATION",
        template: "configuration-default-view"
      },
      {
        id: "OBP_HOST_CONFIGURATION",
        template: "configuration-default-view"
      },
      {
        id: "OBP_BANK_CONFIGURATION",
        template: "configuration-default-view"
      },
      {
        id: "BANK_CONFIGURATION",
        template: "configuration-default-view"
      },
      {
        id: "BRANCH_CONFIGURATION",
        template: "configuration-default-view"
      },
      {
        id: "MODULE_CONFIGURATION",
        template: "configuration-default-view"
      },
      {
        id: "PAYMENTS_MODULE_CONFIGURATION",
        template: "configure-payments-view"
      },
      {
        id: "FILEUPLOAD_CONFIGURATION",
        template: "configuration-row-view"
      },
      {
        id: "ALERTS_MODULE_CONFIGURATION",
        template: "configuration-row-view"
      },
      {
        id: "BRAND_MODULE_CONFIGURATION",
        template: "configuration-row-view"
      },
      {
        id: "ORIGINATION_MODULE_LZN_CONFIGURATION",
        template: "configuration-row-view"
      },
      {
        id: "ORIGINATION_MODULE_BASE_CONFIGURATION",
        template: "configuration-row-view"
      },
      {
        id: "COMMON_CONFIGURATION",
        template: "configuration-row-view"
      },
      {
        id: "BASIC_CONFIGURATION",
        template: "configuration-default-view"
      },
      {
        id: "MODULE_CONFIGURATION_DYNAMIC",
        template: "configuration-default-view"
      },
      {
        id: "CURRENCY_LINKAGE_MODULE_CONFIGURATION",
        template: "configure-payments-view"
      },
      {
        id: "OTHERMODULE",
        template: "configuration-default-view"
      },
      {
        id: "ServiceRequest",
        template: "configuration-default-view"
      },
      {
        id: "Forex Deal",
        template: "configuration-default-view"
      },
      {
        id: "THIRD_PARTY_HOST_DETAILS",
        template: "host-details"
      }
    ]);
    self.loadData = function() {
      self.dataLoaded(false);
      self.configuration.id = self.data.configuration.id;
      self.configuration.name = self.data.configuration.name;
      self.configuration.order = self.data.configuration.order;
      ko.utils.arrayForEach(self.tabLists(), function(item) {
        if (item.id === self.configuration.id()) {
          self.configuration.template = item.template;
        }
      });
      for (var i = 0; i < self.data.configuration.configurationItemDTOs().length; i++) {
        self.dynamicArray.id = "";
        self.dynamicArray.handler = "";
        self.dynamicArray.inputDTOs.removeAll();
        self.inputDTOs = ko.observableArray(self.data.configuration.configurationItemDTOs()[i].inputDTOs());
        for (var k = 0; k < self.inputDTOs().length; k++) {
          if (!self.inputDTOs()[k].inputValues) {
            if (self.data.configuration.configurationItemDTOs()[i].id() === "PRODUCT_TRANS_CONFIGURATION_ITEM") {
              self.inputDTOs()[k].inputValues = ko.observable([
                "",
                ""
              ]);
            } else {
              self.inputDTOs()[k].inputValues = ko.observable();
            }
          }
          if (self.inputDTOs()[k].type() === "CHB") {
            self.tempObj = {
              "options": ko.observableArray([])
            };
            for (var w = 0; w < self.inputDTOs()[k].uiDefinition.value().length; w++) {
              self.tempObj.options.push({
                key: self.inputDTOs()[k].inputValues() === undefined ? "" : self.inputDTOs()[k].uiDefinition.key()[w],
                description: self.inputDTOs()[k].uiDefinition.value()[w]
              });
              self.inputDTOs()[k].tempObj = self.tempObj;
            }
          }
          self.dynamicArray.inputDTOs.push(self.inputDTOs()[k]);
        }
        self.dynamicArray.id = self.data.configuration.configurationItemDTOs()[i].id();
        self.dynamicArray.handler = self.data.configuration.configurationItemDTOs()[i].handler();
        self.dynamicArray.step = self.data.step;
        self.dynamicArray.name = self.data.configuration.configurationItemDTOs()[i].name;
        self.configuration.configurationItemDTOs.push(ko.mapping.toJS(self.dynamicArray));
      }
      self.dataLoaded(true);
    };
    self.loadData();
    $(document).ready(function() {
      $("ul.listview li").each(function(index, element) {
        if (index === self.configuration.order()) {
          $(element).find("a").addClass("active");
          $(element).find("a.configName").addClass("active");
        } else {
          $(element).find("a").removeClass("active");
          $(element).find("a.configName").removeClass("active");
        }
      });
    });
  };
});
