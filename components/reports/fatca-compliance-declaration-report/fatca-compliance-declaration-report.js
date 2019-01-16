define(["ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/fatca-compliance-declaration-report",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojlabel",
  "ojs/ojselectcombobox"
], function(oj, ko, $, fatcaComplianceDeclerationModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.currentSelection = ko.observable();
    self.showPartyDetails = ko.observable();
    self.showFormTypeDetails = ko.observable();
    self.selectedPartyId = ko.observable();
    self.formTypes = ko.observableArray([]);
    self.fromDate = ko.observable();
    self.loadForm = ko.observable(false);
    self.fromDateValue = ko.observable();
    self.toDateValue = ko.observable();
    fatcaComplianceDeclerationModel.fetchEnumeration().done(function(data) {
      if (data && data.enumRepresentations[0].data.length > 0) {
        for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.formTypes.push({
            value: data.enumRepresentations[0].data[i].code,
            label: data.enumRepresentations[0].data[i].description
          });
        }
        self.loadForm(true);
      }
    });
    self.formTypeSelected = function(event) {
      if (event.detail.value) {
        $("#formType").val(event.detail.value);
      }
    };
    self.generateByValueChanged = function(event) {
      if (event.detail.value === "partyIdSelected") {
        self.showPartyDetails(true);
        self.showFormTypeDetails(false);
      } else {
        self.showFormTypeDetails(true);
        self.showPartyDetails(false);
      }
    };
  };
});
