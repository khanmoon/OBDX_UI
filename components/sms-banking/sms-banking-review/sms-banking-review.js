define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",
  "ojL10n!resources/nls/sms-banking",
  "ojs/ojselectcombobox",
  "ojs/ojvalidation",
  "ojs/ojbutton",
  "ojs/ojknockout-validation",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojlistview",
  "ojs/ojswitch"
], function(oj, ko, $, BaseLogger, SMSBankingReviewModel, resourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.nls = resourceBundle;
    self.payload = ko.observable();
    self.menuSelection = ko.observable();
    self.menuOptions = ko.observableArray();
    self.disabledState = ko.observable(true);
    self.eventTemplateMap = ko.observableArray();
    self.transactionStatus = ko.observable();
    self.transactionName = ko.observable();
    self.httpStatus = ko.observable();
    self.mode = ko.observable();
    self.smsMenuEnable = ko.observable(false);
    self.menuSelected = ko.observable();
    self.missedCallEnable = ko.observable(false);
    self.smsSelected = ko.observable();
    self.missedCallSelected = ko.observable();
    self.isEventTemplateMapLoaded = ko.observable(false);
    self.datasource = new oj.ArrayTableDataSource([]);
    Params.baseModel.registerElement("action-widget");
    Params.baseModel.registerElement("confirm-screen");
    Params.baseModel.registerComponent("sms-banking-edit", "sms-banking");
    Params.dashboard.headerName(self.nls.events.labels.smsHeading);
    self.eventTemplateMap = ko.observable(self.params.eventTemplateMap);
    self.eventTempUpdate = ko.observable(self.params.eventTempUpdate);
    self.editReviewMessage = ko.observable();
    self.resDataAttr = ko.observable(self.eventTempUpdate().dto.responseTemplate.responseDataAttributes());
    self.transactionName = ko.observable();
    var eventId = self.eventTemplateMap().event.eventId;
    var locale = self.eventTemplateMap().locale;
    self.currentTask = ko.observable();
    if (self.params.menuSelected !== "S") {
      self.smsMenuEnable(true);
      self.missedCallEnable(false);
      self.transactionName(self.nls.events.labels.missedCallConfirmScreen);
      self.editReviewMessage(self.nls.events.labels.editReviewMessageMissedCall);
    }
    if (self.params.menuSelected !== "M") {
      self.missedCallEnable(true);
      self.smsMenuEnable(false);
      self.transactionName(self.nls.events.labels.smsConfirmScreen);
      self.editReviewMessage(self.nls.events.labels.editReviewMessageSMS);
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
    var eventMap = $.map(self.resDataAttr(), function(eventMap) {
      var obj = {
        "responseDataAttributes": eventMap.attribute.attributeID()
      };
      return obj;
    });
    self.datasource.reset(eventMap, {
      idAttribute: "responseDataAttributes"
    });
    self.confirm = function() {
      SMSBankingReviewModel.updateEvent(ko.mapping.toJSON(self.eventTempUpdate()), eventId, locale, self.params.menuSelected).done(function(data, status, jqXhr) {
        self.httpStatus(jqXhr.status);
        self.transactionStatus(data.status);
        Params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.transactionName()
        }, self);
      });
    };
    self.cancel = function() {
      Params.dashboard.openDashBoard();
    };
    self.back = function() {
      var context = {};
      context.mode = "REVIEW";
      var parameters = {
        id: eventId,
        eventTempUpdate: self.eventTempUpdate(),
        eventTemplateMap: self.eventTemplateMap(),
        menuSelected: self.params.menuSelected
      };
      Params.dashboard.loadComponent("sms-banking-edit", parameters, context, self);
    };
  };
});
