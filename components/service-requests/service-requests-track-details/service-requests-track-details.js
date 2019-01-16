define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "ojL10n!resources/nls/service-requests-track",
  "./model",
  "jqueryui-amd/widgets/sortable",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function(oj, ko, $, BaseLogger, ResourceBundle, ServiceRequestTrackDetails) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.validationTracker = Params.validator;
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.requestDetailsHeader);
    self.requestType = ko.observable();
    self.creationDate = ko.observable();
    self.status = ko.observable(self.params.status);
    self.refNo = ko.observable(self.params.referenceNo);
    self.comments = ko.observable();
    self.showComments = ko.observable(false);
    var i;
    self.displayData = ko.observableArray();
    ServiceRequestTrackDetails.readData(self.params.referenceNo).done(
      function(data) {
        self.requestType(data.response.requestType);
        self.creationDate(Params.baseModel.formatDate(data.response.creationDate));
        var parseData = $.parseHTML(data.response.requestData);
        self.formData = JSON.parse(parseData[0].data);
        for (i = 0; i < self.formData.elements.length; i++) {
          if (self.formData.elements[i].displayValues[0]) {
            self.displayData.push(self.formData.elements[i]);
          }
        }
        if (data.response.status === "CO") {
          self.comments(data.response.comments);
          self.showComments(true);
        }
      }
    );
    self.getFile = function(data) {
      ServiceRequestTrackDetails.readFile(data.values[0]);
    };
    self.trackScreen = function() {
      Params.baseModel.registerComponent("service-requests-track", "service-requests");
      Params.dashboard.loadComponent("service-requests-track", {}, self);
    };
  };
});
