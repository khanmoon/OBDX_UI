define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!resources/nls/sms-banking",
  "jqueryui-amd/widgets/sortable",
  "ojs/ojselectcombobox",
  "ojs/ojvalidation",
  "ojs/ojbutton",
  "ojs/ojknockout-validation",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojlistview",
  "ojs/ojswitch",
  "ojs/ojinputtext",
  "ojs/ojknockout",
  "ojs/ojpopup",
  "ojs/ojdialog",
  "ojs/ojcheckboxset"
], function(oj, ko, $, SMSBankingEditModel, BaseLogger, resourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.nls = resourceBundle;
    self.payload = ko.observable();
    self.menuSelection = ko.observable();
    self.menuOptions = ko.observableArray();
    self.disabledState = ko.observable(true);
    self.pinRequired = ko.observable();
    self.requestTemplate = ko.observableArray();
    self.responseTemplate = ko.observableArray();
    self.buttonToDropDownSms = ko.observable(false);
    self.addRequestAttributes = ko.observable(false);
    self.dataAttributeList = ko.observableArray();
    self.requestDataAttributeList = ko.observableArray();
    self.smsAttributes = ko.observableArray();
    self.smsAttributeList = ko.observableArray();
    self.smsAttributeId = ko.observableArray();
    self.requestAttributeId = ko.observableArray();
    self.smsAttributeMask = ko.observableArray();
    self.attributeMaskEnable = ko.observableArray();
    self.sortedRequestAttributes = ko.observableArray();
    self.attributeSelectionOrder = -1;
    self.index = Params.index;
    self.smsSelected = ko.observable();
    self.menuSelected = ko.observable();
    self.missedCallSelected = ko.observable();
    self.smsMenuEnable = ko.observable(false);
    self.missedCallEnable = ko.observable(false);
    self.eventTemplateMap = ko.observable(self.params.eventTemplateMap);
    Params.baseModel.registerElement("action-widget");
    Params.baseModel.registerElement("action-header");
    Params.baseModel.registerElement("text-editor");
    Params.baseModel.registerComponent("sms-banking-view", "sms-banking");
    Params.baseModel.registerComponent("sms-banking-review", "sms-banking");
    Params.dashboard.headerName(self.nls.events.labels.smsHeading);
    self.valid = ko.observable();
    var tracker;
    self.validate = ko.observable(true);
    var getNewKoModel = function() {
      var KoModel = ko.mapping.fromJS(SMSBankingEditModel.getNewModel());
      return KoModel;
    };

    self.loadSortable = function() {
      $("#sortable").sortable();
    };
    self.sortList = function(sortedRequestDataAttributes) {

      sortedRequestDataAttributes(sortedRequestDataAttributes.sort(function(a, b) {
        return a.dataAttrOrder > b.dataAttrOrder;
      }));
    };

    self.eventTempUpdate = self.params.eventTempUpdate || getNewKoModel().eventTempUpdate;


    if (!self.params.eventTempUpdate) {
      self.eventTempUpdate.dto.pinRequired(self.pinRequired);
      self.eventTempUpdate.dto.event.eventName(self.eventTemplateMap().event.eventName);
      self.requestDataAttribute = getNewKoModel().requestDataAttribute;
      self.responseDataAttribute = getNewKoModel().responseDataAttribute;
      self.eventTempUpdate.dto.pinRequired(self.eventTemplateMap().pinRequired);
      self.eventTempUpdate.dto.requestTemplate.id(self.eventTemplateMap().requestTemplate.id);

      self.eventTempUpdate.dto.responseTemplate.id(self.eventTemplateMap().responseTemplate.id);
      self.eventTempUpdate.dto.requestTemplate.message(self.eventTemplateMap().requestTemplate.message);
      self.eventTempUpdate.dto.responseTemplate.message(self.eventTemplateMap().responseTemplate.message);

      var eventId = self.eventTemplateMap().event.eventId;
      for (var i = 0; i < self.eventTemplateMap().responseTemplate.responseDataAttributes.length; i++) {
        var attribute = self.eventTemplateMap().responseTemplate.responseDataAttributes[i];
        self.responseDataAttribute = getNewKoModel().responseDataAttribute;

        self.responseDataAttribute.attribute.attributeID(attribute.attribute.attributeID);
        self.responseDataAttribute.attribute.attributeName(attribute.attribute.attributeID);
        self.eventTempUpdate.dto.responseTemplate.responseDataAttributes.push(self.responseDataAttribute);
        self.attributeSelectionOrder = self.attributeSelectionOrder + 1;
      }
      var sortedRequestDataAttributes = ko.observableArray(self.eventTemplateMap().requestTemplate.requestDataAttributes);
      self.sortList(sortedRequestDataAttributes);
      for (var j = 0; j < self.eventTemplateMap().requestTemplate.requestDataAttributes.length; j++) {
        var attributes = self.eventTemplateMap().requestTemplate.requestDataAttributes[j];
        self.requestDataAttribute = getNewKoModel().requestDataAttribute;
        self.requestDataAttribute.dataAttrOrder(attributes.dataAttrOrder);
        self.requestDataAttribute.attribute.attributeID(attributes.attribute.attributeID);
        self.requestDataAttribute.attribute.attributeName(attributes.attribute.attributeID);


        self.eventTempUpdate.dto.requestTemplate.requestDataAttributes.push(self.requestDataAttribute);
      }
    }


    var sortedIDs;
      $(document).on("sortstop", "#sortable", function(){
      sortedIDs = $("#sortable").sortable("toArray");
      for (var i = 0; i <= sortedIDs.length; i++) {
        for (var j = 0; j < self.eventTempUpdate.dto.requestTemplate.requestDataAttributes().length; j++) {
          if (self.eventTempUpdate.dto.requestTemplate.requestDataAttributes()[j].attribute.attributeID() === sortedIDs[i])
            self.eventTempUpdate.dto.requestTemplate.requestDataAttributes()[j].dataAttrOrder(i + 1);
        }
      }

      self.eventTempUpdate.dto.requestTemplate.requestDataAttributes().sort(function(left, right) {
        return (left.dataAttrOrder < right.dataAttrOrder ? -1 : 1);
      });

    });
    if (!eventId)
      eventId = self.params.id;
    SMSBankingEditModel.fetchRequestAttributeList(eventId).then(function(data) {
      self.requestDataAttributeList(data.attributeListDTO);
    });
    SMSBankingEditModel.fetchResponseAttributeList(eventId).then(function(data) {
      self.dataAttributeList(data.attributeListDTO);
    });
    self.removeAttribute = function(index, data) {
      self.eventTempUpdate.dto.requestTemplate.requestDataAttributes.remove(function(serviceAttribute) {
        return serviceAttribute === data;
      });
    };
    self.addRow = function() {
      self.responseDataAttribute = getNewKoModel().responseDataAttribute;

      self.responseDataAttribute.attribute.attributeID(self.smsAttributeId());
      self.responseDataAttribute.attribute.attributeName(self.smsAttributeId());
      if (self.smsAttributeId().length !== 0)
        self.eventTempUpdate.dto.responseTemplate.responseDataAttributes.push(self.responseDataAttribute);
      self.buttonToDropDownSms(true);
      self.attributeSelectionOrder = self.attributeSelectionOrder + 1;
    };
    self.addAttribute = function() {
      self.requestDataAttribute = getNewKoModel().requestDataAttribute;
      self.requestDataAttribute.attribute.attributeID(self.requestAttributeId());
      self.requestDataAttribute.attribute.attributeName(self.requestAttributeId());

      self.requestDataAttribute.dataAttrOrder(self.eventTempUpdate.dto.requestTemplate.requestDataAttributes().length + 1);
      if (self.requestAttributeId().length !== 0)
        self.eventTempUpdate.dto.requestTemplate.requestDataAttributes.push(self.requestDataAttribute);

      self.addRequestAttributes(true);
    };

    self.deleteAttribute = function(index, data) {
      self.eventTempUpdate.dto.responseTemplate.responseDataAttributes.remove(function(serviceAttribute) {
        return serviceAttribute === data;
      });
    };
    if (self.params.menuSelected !== "S") {
      self.smsMenuEnable(true);
      self.missedCallEnable(false);
    }
    if (self.params.menuSelected !== "M") {
      self.missedCallEnable(true);
      self.smsMenuEnable(false);
    }
    self.menuOptions([{
      id: "S",
      label: self.nls.events.labels.smsTabHeading,
      disabled: self.smsMenuEnable()
    }, {
      id: "M",
      label: self.nls.events.labels.missedCallHeading,
      disabled: self.missedCallEnable()
    }]);


    self.uiOptions = {
      "menuFloat": "left",
      "fullWidth": false,
      "defaultOption": self.menuSelection
    };

    self.menuSelection.subscribe(function(newValue) {
      ko.utils.extend(self.params, {
        defaultTab: newValue
      });
      self.menuSelected(newValue);
      if (newValue === "S") {
        self.smsSelected(true);
        self.missedCallSelected(false);
        Params.dashboard.headerName(self.nls.events.labels.smsHeading);
      }

      if (newValue === "M") {
        self.missedCallSelected(true);
        self.smsSelected(false);
        Params.dashboard.headerName(self.nls.events.labels.missedCallHeading);
      }
    });
    if (self.params.menuSelected === "S")
      self.menuSelection(self.menuOptions()[0].id);
    if (self.params.menuSelected === "M")
      self.menuSelection(self.menuOptions()[1].id);

    self.save = function() {
      tracker = document.getElementById("eventtracker");
      if (!Params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }
      var context = {};
      context.mode = "SAVE";
      var parameters = {
        eventTempUpdate: self.eventTempUpdate,
        eventTemplateMap: self.eventTemplateMap(),
        menuSelected: self.params.menuSelected
      };
      Params.dashboard.loadComponent("sms-banking-review", parameters, self);
    };
    self.cancel = function() {
      Params.dashboard.openDashBoard();
    };
    self.back = function() {
      var parameters = {
        id: eventId,
        locale: self.eventTemplateMap().locale,
        menuSelected: self.params.menuSelected
      };
      Params.dashboard.loadComponent("sms-banking-view", parameters, self);
    };
  };
});
