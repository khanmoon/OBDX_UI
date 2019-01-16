define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/service-requests-form-builder",
  "./model",
  "framework/js/constants/constants",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojinputtext",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup",
  "ojs/ojlistview",
  "ojs/ojarraydataprovider"
], function (oj, ko, $, ResourceBundle, ServiceRequestBaseForm) {
  "use strict";
  return function (params) {
    var self = this;
    var i, j, k, mandatoryfiles = 0,
      flag = 0;
    self.resource = ResourceBundle;
    self.formArray = ko.observableArray();
    self.formData = ko.observable(false);
    self.viewId = ko.observable();
    self.userFormData = ko.observableArray();
    params.baseModel.registerComponent("header-view", "service-requests");
    params.baseModel.registerComponent("text-box-view", "service-requests");
    params.baseModel.registerComponent("sub-header-view", "service-requests");
    params.baseModel.registerComponent("section-header-view", "service-requests");
    params.baseModel.registerComponent("info-view", "service-requests");
    params.baseModel.registerComponent("radio-button-view", "service-requests");
    params.baseModel.registerComponent("check-box-view", "service-requests");
    params.baseModel.registerComponent("account-number-view", "service-requests");
    params.baseModel.registerComponent("drop-list-view", "service-requests");
    params.baseModel.registerComponent("gender-view", "service-requests");
    params.baseModel.registerComponent("salutation-view", "service-requests");
    params.baseModel.registerComponent("date-picker-view", "service-requests");
    params.baseModel.registerComponent("toggle-button-view", "service-requests");
    params.baseModel.registerComponent("account-number-debit-card-view", "service-requests");
    params.baseModel.registerComponent("multi-select-view", "service-requests");
    params.baseModel.registerComponent("file-upload-view", "service-requests");
    params.baseModel.registerComponent("country-states-view", "service-requests");
    self.contentId = ko.observable();
    self.imageData = ko.observable();
    self.viewUploaded = ko.observable(false);
    self.dataProvider = new oj.ArrayDataProvider(self.formArray);
    var responseData;
    var tracker;
    var emssg = [];
    var emname = [];
    var emlabel = [];
    self.saveData = function () {
      tracker = document.getElementById("baseFormTracker");
      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }
      if (flag === 1 && emssg.length !== 0 && document.getElementsByClassName("fileup").length !== mandatoryfiles) {
        for (var y = 0; y < document.getElementsByClassName("fileup").length; y++) {
          for (var x = 0; x < mandatoryfiles; x++) {
            if (document.getElementsByClassName("fileup")[y].id === emname[x]) {
              emssg.splice(x, 1);
              emlabel.splice(x, 1);
              emname.splice(x, 1);
            }
          }
        }
        if (document.getElementsByClassName("fileup").length === mandatoryfiles) {
          flag = 0;
        }
        for (var z = 0; z < document.getElementsByClassName("fileuperr").length; z++) {
          for (var w = 0; w < mandatoryfiles; w++) {
            if (document.getElementsByClassName("fileuperr")[z].id === emname[w]) {
              document.getElementsByClassName("fileuperr")[z].innerHTML = emssg[w];
              document.getElementsByClassName("fileuperr")[z].classList.add("errorcolor");
            }
          }
        }
      } else {
        self.savePayLoad = ko.observable({
          requestType: "OTHERS",
          entityTypeIdentifier: responseData.serviceRequestResponse[0].id,
          status: "IN",
          entityTypeIdentifierKey: "DE",
          definition: {
            id: responseData.serviceRequestResponse[0].id
          },
          priorityType: responseData.serviceRequestResponse[0].priorityType,
          entityType: "AC",
          requestData: null
        });

        self.viewId(params.rootModel.viewId());
        params.baseModel.registerComponent("service-requests-verify", "service-requests");
        params.dashboard.loadComponent("service-requests-verify", {
          SRDefinitionDTO: self.savePayLoad,
          dataArray: self.userFormData(),
          requestName: responseData.serviceRequestResponse[0].name
        }, self);
      }
    };
    self.loadFormBuilder = function () {
      params.baseModel.registerComponent("service-requests-base-main", "service-requests");
      params.dashboard.loadComponent("service-requests-base-main", {}, self);
    };
    ServiceRequestBaseForm.readData(params.rootModel.viewId()).done(
      function (data) {
        responseData = data;
        self.formHeader = responseData.serviceRequestResponse[0].form.header;
        if (responseData.serviceRequestResponse[0].form.confirmMessage) {
          self.confirmMessage = responseData.serviceRequestResponse[0].form.confirmMessage;
        } else {
          self.confirmMessage = self.resource.defaultConfirmationMessage;
        }
        params.dashboard.headerName(responseData.serviceRequestResponse[0].form.header);
        for (i = 0; i < data.serviceRequestResponse[0].form.fields.length; i++) {
          self.formArray.push(data.serviceRequestResponse[0].form.fields[i]);
          if (self.formArray()[i].type === "FFFU") {
            if (self.formArray()[i].validation.isMandatory) {
              flag = 1;
              emlabel[mandatoryfiles] = self.formArray()[i].label;
              emname[mandatoryfiles] = self.formArray()[i].name;
              emssg[mandatoryfiles] = self.formArray()[i].errorMessage;
              mandatoryfiles++;
            }
          }
        }
        self.infoNote = ko.observable({
          header: data.serviceRequestResponse[0].form.infoNote.header,
          description: data.serviceRequestResponse[0].form.infoNote.description
        });
        self.header = ko.observable(data.serviceRequestResponse[0].form.header);
        if (data.serviceRequestResponse[0].form.infoNote.icon.value) {
          self.contentId(data.serviceRequestResponse[0].form.infoNote.icon.value);
        }
        for (j = 0; j < self.formArray().length - 1; j++) {
          for (k = (j + 1); k < self.formArray().length; k++) {
            if (self.formArray()[j].sequenceNumber > self.formArray()[k].sequenceNumber) {
              var temp = self.formArray()[j];
              self.formArray()[j] = self.formArray()[k];
              self.formArray()[k] = temp;
            }
          }
        }
        for (j = 0; j < self.formArray().length; j++) {
          if (self.formArray()[j].type === "SBH" || self.formArray()[j].type === "SCH") {
            self.sectionSubHeader = ko.observableArray();
            self.sectionSubHeader().push(self.formArray()[j].values[0].description);
            self.userFormData().push({
              name: self.formArray()[j].name,
              type: self.formArray()[j].type,
              label: null,
              values: self.sectionSubHeader,
              displayValues: ko.observableArray(),
              indirectedValue: null
            });
          } else if (self.formArray()[j].type === "PDAN") {
            self.accountIndirected = ko.observableArray();
            self.accountIndirected().push("Account");
            self.userFormData().push({
              name: self.formArray()[j].name,
              type: self.formArray()[j].type,
              label: self.formArray()[j].label,
              values: ko.observableArray(),
              displayValues: ko.observableArray(),
              indirectedValue: self.accountIndirected()
            });
          } else if (self.formArray()[j].type === "FFFU") {
            self.fileIndirected = ko.observableArray();
            self.fileIndirected().push("File");
            self.userFormData().push({
              name: self.formArray()[j].name,
              type: self.formArray()[j].type,
              label: self.formArray()[j].label,
              values: ko.observableArray(),
              displayValues: ko.observableArray(),
              indirectedValue: self.fileIndirected()
            });
          } else if (self.formArray()[j].type === "PDAD") {
            self.accountDebitIndirected = ko.observableArray();
            self.accountDebitIndirected().push("Account");
            self.accountDebitIndirected().push("Debit");
            self.userFormData().push({
              name: self.formArray()[j].name,
              type: self.formArray()[j].type,
              label: self.formArray()[j].label,
              values: ko.observableArray(),
              displayValues: ko.observableArray(),
              indirectedValue: self.accountDebitIndirected()
            });
          } else {
            self.userFormData().push({
              name: self.formArray()[j].name,
              type: self.formArray()[j].type,
              label: self.formArray()[j].label,
              values: ko.observableArray(),
              displayValues: ko.observableArray(),
              indirectedValue: null
            });
          }
        }
        if (params.rootModel.displayData) {
          for (j = 0; j < self.formArray().length; j++) {
            self.userFormData()[j] = params.rootModel.displayData[j];
          }
        }
        self.formData(true);
        if (self.contentId()) {
          ServiceRequestBaseForm.getFile(self.contentId()).then(function (data) {
            self.imageData("data:" + data.contentDTOList[0].mimeType + ";base64," + data.contentDTOList[0].content);
            self.viewUploaded(true);
          });
        }
      });
  };
});
