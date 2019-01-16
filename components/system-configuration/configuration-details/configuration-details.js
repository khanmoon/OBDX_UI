define([
  "knockout",
  "jquery",

  "./model",
  "ojL10n!resources/nls/configuration-details",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojcheckboxset",
  "ojs/ojdatetimepicker",
  "ojs/ojknockout-validation"
], function(ko, $, SystemConfigurationDetails, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.data = ko.mapping.fromJS(rootParams.data);
    self.configuration.id = "";
    self.configuration.name = "";
    self.configuration.configurationItemDTOs.removeAll();
    self.inputvaluesSet = ko.observable(false);
    self.host = ko.observable();
    self.host(self.selectedHost());
    var pageRendered = 0,
      count1 = 0;
    var getNewKoModel = function() {
      var KoModel = SystemConfigurationDetails.getNewModel();
      return KoModel;
    };
    self.payload = ko.observable(getNewKoModel());
    if (self.data.configuration.id() === "PAYMENTS_MODULE_CONFIGURATION") {
      pageRendered = 1;
    }
    rootParams.baseModel.registerElement("action-header");
    self.tabLists = ko.observableArray([{
        id: "HOST_CONFIGURATION",
        template: "host-details"
      },
      {
        id: "OBP_HOST_CONFIGURATION",
        template: "host-details"
      },
      {
        id: "OBP_BANK_CONFIGURATION",
        template: "configuration-default"
      },
      {
        id: "BANK_CONFIGURATION",
        template: "configuration-default"
      },
      {
        id: "BRANCH_CONFIGURATION",
        template: "configuration-default"
      },
      {
        id: "MODULE_CONFIGURATION",
        template: "configuration-default"
      },
      {
        id: "PAYMENTS_MODULE_CONFIGURATION",
        template: "configure-payments"
      },
      {
        id: "FILEUPLOAD_CONFIGURATION",
        template: "configuration-row"
      },
      {
        id: "ALERTS_MODULE_CONFIGURATION",
        template: "smtp-server-details"
      },
      {
        id: "BRAND_MODULE_CONFIGURATION",
        template: "configuration-row"
      },
      {
        id: "ORIGINATION_MODULE_LZN_CONFIGURATION",
        template: "configuration-row"
      },
      {
        id: "ORIGINATION_MODULE_BASE_CONFIGURATION",
        template: "configuration-row"
      },
      {
        id: "BASIC_CONFIGURATION",
        template: "configuration-default"
      },
      {
        id: "COMMON_CONFIGURATION",
        template: "configuration-row"
      },
      {
        id: "SMTP",
        template: "configuration-default"
      },
      {
        id: self.nls.message.brand,
        template: "configuration-default"
      },
      {
        id: "OTHER",
        template: "configuration-default"
      },
      {
        id: self.nls.message.payment,
        template: "configuration-default"
      },
      {
        id: "OTHERMODULE",
        template: "configuration-default"
      },
      {
        id: "ServiceRequest",
        template: "configuration-default"
      },
      {
        id: self.nls.message.forexDeal,
        template: "configuration-default"
      },
      {
        id: self.nls.message.fileUpload,
        template: "configuration-default"
      },
      {
        id: self.nls.message.origination,
        template: "configuration-default"
      },
      {
        id: self.nls.message.common,
        template: "configuration-default"
      },
      {
        id: "CURRENCY_LINKAGE_MODULE_CONFIGURATION",
        template: "configure-payments"
      }
    ]);
    self.disableUsernamePasswordHandler = function(data,event) {
      if (data.inputValues && data.inputValues.length>0 && data.inputValues[0] === "true") {
        for (var i = 0; i < event.length; i++) {
          if (event[i].fieldName === "userName" || event[i].fieldName === "password")
            event[i].uiDefinition.required = true;
        }
        self.displayFlag(true);
      } else {
        self.displayFlag(false);
        for (var j = 0; j < event.length; j++) {
          if (event[j].fieldName === "userName" || event[j].fieldName === "password")
            event[j].inputValues = "";
          event[j].uiDefinition.required = false;
        }
      }
    };
    self.populateItem = function(index, inputArray) {
      if (inputArray()[index].fieldName() === "host_name" || inputArray()[index].fieldName() === "BANK.DEFAULT.HOST") {
        if (inputArray()[index].inputValues) {
          self.host(inputArray()[index].inputValues());
        } else {
          if (!inputArray()[index].inputValues) {
            inputArray()[index].inputValues = ko.observable();
          }
          inputArray()[index].inputValues(self.host());
        }
      }
      if (inputArray().length > index) {
        if (!inputArray()[index].inputValues) {
          if (self.data.configuration.configurationItemDTOs()[count1].id() === "PRODUCT_TRANS_CONFIGURATION_ITEM") {
            inputArray()[index].inputValues = ko.observable([
              "",
              ""
            ]);
          } else {
            inputArray()[index].inputValues = ko.observable();
          }
        }
        if (inputArray()[index].type() === "CHB") {
          self.tempObj = {
            "options": ko.observableArray([])
          };
          for (var w = 0; w < inputArray()[index].uiDefinition.value().length; w++) {
            self.tempObj.options.push({
              key: inputArray()[index].uiDefinition.key()[w],
              description: inputArray()[index].uiDefinition.value()[w]
            });
            inputArray()[index].tempObj = self.tempObj;
          }
        }
        if (inputArray()[index].type() !== "LISTBOX" && inputArray()[index].type() !== "RDB" && inputArray()[index].type() !== "MSELECT") {
          self.dynamicArray.inputDTOs.push(inputArray()[index]);
          index = index + 1;
          if (inputArray().length > index) {
            self.populateItem(index, self.inputDTOs);
          }
        } else if (inputArray()[index].type() === "LISTBOX" || inputArray()[index].type() === "RDB" || inputArray()[index].type() === "MSELECT") {
          if (inputArray()[index].uiDefinition.data === undefined || inputArray()[index].uiDefinition.data.url === undefined) {
            self.tempObj = {
              "options": ko.observableArray([])
            };
            for (var v = 0; v < inputArray()[index].uiDefinition.value().length; v++) {
              self.tempObj.options.push({
                key: inputArray()[index].uiDefinition.value()[v],
                description: inputArray()[index].uiDefinition.value()[v]
              });
              inputArray()[index].tempObj = self.tempObj;
            }
            self.dynamicArray.inputDTOs.push(inputArray()[index]);
            index = index + 1;
            if (inputArray().length > index) {
              self.populateItem(index, self.inputDTOs);
            }
          } else if (inputArray()[index].uiDefinition.data !== undefined && inputArray()[index].uiDefinition.data.url !== undefined) {
            var tempURL = "";
            if (inputArray()[index].fieldName() === "version") {
              tempURL = inputArray()[index].uiDefinition.data.url();
              inputArray()[index].uiDefinition.data.url(tempURL + self.host());
            }
            SystemConfigurationDetails.fireUrl(inputArray()[index].uiDefinition.data.url(), self.host).done(function(data) {
              if (inputArray()[index].fieldName() === "version") {
                inputArray()[index].uiDefinition.data.url(tempURL);
              }
              self.tempObj = {
                "options": ko.observableArray([])
              };
              var listName = inputArray()[index].uiDefinition.data.key();
              var value = inputArray()[index].uiDefinition.data.value();
              var description = inputArray()[index].uiDefinition.data.description();
              if (!(data[listName].length > 1)) {
                var lstData = data[listName][0];
                for (var v = 0; v < lstData.data.length; v++) {
                  self.tempObj.options.push({
                    key: lstData.data[v][value],
                    description: lstData.data[v][description]
                  });
                  inputArray()[index].tempObj = self.tempObj;
                }
              } else {
                var lstData1 = data[listName];
                for (var v1 = 0; v1 < lstData1.length; v1++) {
                  self.tempObj.options.push({
                    key: lstData1[v1][value],
                    description: lstData1[v1][description]
                  });
                  inputArray()[index].tempObj = self.tempObj;
                }
              }
              self.dynamicArray.inputDTOs.push(inputArray()[index]);
              index = index + 1;
              if (inputArray().length > index && self.data.configuration.configurationItemDTOs().length > pageRendered) {
                self.populateItem(index, self.inputDTOs);
              }
              if (index === inputArray().length) {
                self.inputvaluesSet(true);
                self.inputvaluesSetValues();
                count1 = count1 + 1;
                if (count1 < self.data.configuration.configurationItemDTOs().length)
                  self.setItem(count1);
              }
            });
          }
        }
        if (index === inputArray().length) {
          self.inputvaluesSet(true);
          self.inputvaluesSetValues();
          count1 = count1 + 1;
          if (count1 < self.data.configuration.configurationItemDTOs().length)
            self.setItem(count1);
        }
      }
    };
    self.validateHostConnectivity = function() {
      if (document.getElementById("gateway_ip").value && document.getElementById("port").value && self.host()) {
        SystemConfigurationDetails.validateHostConnectivity(document.getElementById("gateway_ip").value, document.getElementById("port").value, self.host()).done(function(data) {
          if (data.status === true) {
            rootParams.baseModel.showMessages(null, [self.nls.message.connectionSuccess], "INFO");
          }
          if (data.status === false) {
            rootParams.baseModel.showMessages(null, [self.nls.message.connectionFailure], "ERROR");
          }
        });
      } else {
        rootParams.baseModel.showMessages(null, [self.nls.message.detailsNull], "ERROR");
      }
    };
    self.validateSmtpServerConnectivity = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      if (document.getElementById("server_name").value && document.getElementById("port").value && document.getElementById("from_email").value && document.getElementById("to_email").value) {
        self.payload().serverName = document.getElementById("server_name").value;
        self.payload().fromEmailAddress = document.getElementById("from_email").value;
        self.payload().port = document.getElementById("port").value;
        self.payload().recipientAddress = document.getElementById("to_email").value;
        if (document.getElementById("authFlag0").value) {
          self.payload().userName = document.getElementById("userName").value;
          self.payload().password = document.getElementById("password").value;
        } else {
          self.payload().userName = null;
          self.payload().password = null;
        }
        self.payload().authenticationFlag = document.getElementById("authFlag0").checked;
        SystemConfigurationDetails.validateSmtpServerConnectivity(ko.toJSON(self.payload())).done(function(data) {
          if (data.status === true) {
            rootParams.baseModel.showMessages(null, [self.nls.message.connectionSuccess], "INFO");
          }
          if (data.status === false) {
            rootParams.baseModel.showMessages(null, [self.nls.message.connectionFailure], "ERROR");
          }
        });
      } else {
        rootParams.baseModel.showMessages(null, [self.nls.message.detailsNullSMTP], "ERROR");
      }
    };
    count1 = 0;
    self.setItem = function(count1) {
      self.dynamicArray.id = "";
      self.dynamicArray.handler = "";
      self.dynamicArray.inputDTOs.removeAll();
      self.dynamicArray.step = self.data.step;
      if (self.data.configuration.configurationItemDTOs().length > 0) {
        self.inputDTOs = ko.observableArray(self.data.configuration.configurationItemDTOs()[count1].inputDTOs());
        self.dynamicArray.id = self.data.configuration.configurationItemDTOs()[count1].id();
        self.dynamicArray.handler = self.data.configuration.configurationItemDTOs()[count1].handler();
        self.dynamicArray.name = self.data.configuration.configurationItemDTOs()[count1].name;
        self.inputvaluesSet(false);
        var count = 0;
        self.populateItem(count, self.inputDTOs);
      }
    };
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
      self.setItem(count1);
      self.dataLoaded(true);
    };
    self.inputvaluesSetValues = function() {
      self.configuration.configurationItemDTOs.push(ko.mapping.toJS(self.dynamicArray));
      pageRendered++;
    };
    self.loadData();
    $(document).ready(function() {
      if (self.mode() === "create") {
        $("ul.listview li").each(function(index, element) {
          ko.utils.arrayForEach(self.allStepsData(), function(item) {
            if (element.id === item.name && item.visited === false) {
              $(element).find("a").addClass("deactive");
            } else if (element.id === item.name && item.visited === true) {
              $(element).find("a").removeClass("deactive");
            }
          });
        });
      }
      $("ul.listview li").each(function(index, element) {
        if (index === self.configuration.order()) {
          $(element).find("a.stepMarker").addClass("active");
          $(element).find("a.configName").addClass("active");
        } else {
          $(element).find("a.stepMarker").removeClass("active");
          $(element).find("a.configName").removeClass("active");
        }
      });
    });
  };
});
