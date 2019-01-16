define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",

  "ojL10n!resources/nls/sms-banking",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojbutton",
  "ojs/ojknockout-validation",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojlistview"
], function(oj, ko, $, BaseLogger, SMSBankingSearchModel, resourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.nls = resourceBundle;
    self.showDropDown = ko.observable();
    self.showDropDownLocale = ko.observable();
    self.dataSource = ko.observable();
    self.eventId = ko.observable();
    self.localeId = ko.observable();
    self.eventActivityList = ko.observableArray();
    self.localeList = ko.observableArray();
    self.localeListData = ko.observableArray();
    self.eventLocaleList = ko.observableArray();
    self.menuSelection = ko.observable();
    self.menuOptions = ko.observableArray();
    self.menuSelected = ko.observable();
    self.enableOptions = ko.observable();
    self.actionAndEventId = ko.observable();
    self.smsSelected = ko.observable(false);
    self.value = ko.observable();
    self.readCode = ko.observable();
    self.missedCallSelected = ko.observable(false);
    Params.baseModel.registerElement("action-widget");
    self.valid = ko.observable();
    var tracker;
    var eventMap;
    Params.baseModel.registerComponent("sms-banking-view", "sms-banking");
    Params.dashboard.headerName(self.nls.events.labels.smsHeading);
    SMSBankingSearchModel.fetchEventDescriptionList().then(function(data) {
      self.eventActivityList(data.eventListDTO);
      self.showDropDown(true);
      self.eventId(self.eventActivityList()[0].eventId);
    }).catch(function() {
      self.showDropDown(true);
    });
    SMSBankingSearchModel.fetchLocaleDescriptionList().then(function(data) {
      self.localeList(data.enumRepresentations);
      self.localeListData(self.localeList()[0].data);

      self.showDropDownLocale(true);
    }).catch(function() {
      self.showDropDownLocale(true);
    });

    self.setDatasource = function() {
      eventMap = $.map(self.eventLocaleList(), function(eventMap) {
        eventMap.eventName = eventMap.event.eventName;
        eventMap.locale = eventMap.responseTemplate.locale;
        return eventMap;
      });
      self.datasource = new oj.ArrayTableDataSource(eventMap, {
        key: "locale"
      });
    };
    self.onLocaleSelected = function() {
      self.openSearch();
    };
    self.menuOptions([{
      id: "S",
      label: self.nls.events.labels.smsTabHeading,
      disabled: false
    }, {
      id: "M",
      label: self.nls.events.labels.missedCallHeading,
      disabled: false
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

      if (newValue === "S") {
        self.menuSelected(newValue);
        self.smsSelected(true);
        Params.dashboard.headerName(self.nls.events.labels.smsHeading);
      }

      if (newValue === "M") {
        self.menuSelected(newValue);
        self.missedCallSelected(true);
        Params.dashboard.headerName(self.nls.events.labels.missedCallHeading);
      }
    });
    self.menuSelection(self.menuOptions()[0].id);
    self.search = function() {
      self.readCode(self.value());
      self.openSearch();
    };
    self.openSearch = function() {
      tracker = document.getElementById("eventtracker");
      if (!Params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }
    SMSBankingSearchModel.fetcheventTemplateMappings(self.actionAndEventId(), self.readCode(), self.menuSelected()).then(function() {
        var context = {};
        var parameters = {
          id: self.actionAndEventId(),
          locale: self.readCode(),
          menuSelected: self.menuSelected()
        };
        context.mode = "SEARCH";
        Params.dashboard.loadComponent("sms-banking-view", parameters, self);
      });

    };
    self.cancel = function() {
      Params.dashboard.openDashBoard();
    };
  };
});
