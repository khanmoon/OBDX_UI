define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/service-request-create",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojselectcombobox",
  "ojs/ojswitch",
  "ojs/ojlistview",
  "ojs/ojarraydataprovider"
], function (oj, ko, $, ServiceRequestVerifyView, BaseLogger, resourceBundle) {
  "use strict";
  return function (params) {

    var self = this;
    var i;
    self.resource = resourceBundle;
    ko.utils.extend(self, params.rootModel.params);
    self.getMessage = function () {
      var message;
      if (params.rootModel.confirmMessage) {
        message = params.rootModel.confirmMessage;
      } else {
        message = self.resource.defaultMessage;
      }
      return message;
    };
    self.formArray = ko.observableArray();
    self.transactionName = ko.observable(params.rootModel.params.requestName);
    params.dashboard.headerName(params.rootModel.formHeader);
    params.baseModel.registerElement("confirm-screen");
    if (params.rootModel.formHeader) {
      self.transactionName(params.rootModel.formHeader);
    }
    self.displayData = ko.observableArray();
    self.viewId = ko.observable();
    self.displayData = params.rootModel.userFormData();
    for (i = 0; i < params.rootModel.userFormData().length; i++) {
      if (params.rootModel.userFormData()[i].type === "PDDP") {
        self.formArray().push({
          id: params.rootModel.userFormData()[i].name,
          type: params.rootModel.userFormData()[i].type,
          label: params.rootModel.userFormData()[i].label,
          values: params.rootModel.userFormData()[i].displayValues(),
          displayValues: params.rootModel.userFormData()[i].displayValues(),
          indirectionTypes: params.rootModel.userFormData()[i].indirectedValue
        });
      } else {
        self.formArray().push({
          id: params.rootModel.userFormData()[i].name,
          type: params.rootModel.userFormData()[i].type,
          label: params.rootModel.userFormData()[i].label,
          values: params.rootModel.userFormData()[i].values(),
          displayValues: params.rootModel.userFormData()[i].displayValues(),
          indirectionTypes: params.rootModel.userFormData()[i].indirectedValue
        });
      }
    }
    self.createRequest = function () {
      var payloadString = "{\"elements\":" + ko.toJSON(self.formArray()) + "}";
      payloadString.replace(/"/g, /\"/);

      params.rootModel.params.SRDefinitionDTO().requestData = payloadString;
      ServiceRequestVerifyView.addServiceRequestVerify(ko.toJSON(params.rootModel.params.SRDefinitionDTO())).done(function (data, status, jqXhr) {
        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.transactionName(),
          confirmScreenExtensions: {
            confirmScreenMsgEval: self.getMessage,
            taskCode: "SR_N_CRT",
            isSet: true,
            template: "service-request/service-request-confirm"
          }
        }, self);
      });
    };
    self.onBack = function () {
      self.goToPreview = ko.observable(true);
      self.viewId(params.rootModel.viewId());
      params.baseModel.registerComponent("service-requests-base-form", "service-requests");
      params.dashboard.loadComponent("service-requests-base-form", {}, self);
    };
  };
});