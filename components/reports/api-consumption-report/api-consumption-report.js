define(["ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/api-consumption-report",
  "framework/js/constants/constants",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojlabel",
  "ojs/ojselectcombobox"
], function(oj, ko, $, apiConsumptionReportModel, resourceBundle, Constants) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.frequencyTypes = ko.observableArray([]);
    self.fromDate = ko.observable();
    self.loadFrequencies = ko.observable(false);
    self.validationTracker = rootParams.validationTracker;
    self.partyDetailsFetched = ko.observable(false);
    self.partyId = ko.observable();
    self.partyName = ko.observable();
    self.userType = ko.observable();
    self.userType(Constants.userSegment);
    self.accessPoints = ko.observableArray();
    self.accesPointsLoaded = ko.observable(false);
    self.isEnterpriseRolesLoaded = ko.observable(false);
    self.enterpriseRoles = ko.observableArray();
    apiConsumptionReportModel.fetchUserSegment().done(function(data) {
      self.enterpriseRoles(data.enterpriseRoleDTOs);
      self.isEnterpriseRolesLoaded(true);
    });
    apiConsumptionReportModel.fetchMe().done(function(data) {
      if (data.userProfile.partyId.value) {
        self.partyId(data.userProfile.partyId.displayValue);
        apiConsumptionReportModel.fetchMeWithParty().done(function(dataName) {
          self.partyName(dataName.party.personalDetails.fullName);
          self.partyDetailsFetched(true);
        });
      }
    });

    apiConsumptionReportModel.fetchAccessPoints().done(function(data) {
      if (data.accessPointListDTO.length > 0) {

        self.accessPoints(data.accessPointListDTO);
        self.accesPointsLoaded(true);


      }
    });
    apiConsumptionReportModel.fetchFrequencies().done(function(data) {
      if (data && data.enumRepresentations[0].data.length > 0) {
        for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.frequencyTypes.push({
            value: data.enumRepresentations[0].data[i].code,
            label: data.enumRepresentations[0].data[i].description
          });
        }
        self.loadFrequencies(true);
      }
    });
    self.frequencyTypeSelected = function(event) {
      if (event.detail.value) {
        $("#apiFrequency").val(event.detail.value);
      }
    };
     $("#fromScheduledDate").val(self.today());
     $("#toScheduledDate").val(self.today()+1);


    self.accessPointSelected = function(event) {
      if (event.detail.value) {
        $("#accessPoint").val(event.detail.value);
      }
    };
    self.userSegmentSelected = function(event) {
      if (event.detail.value) {
        $("#userType").val(event.detail.value);
      }
    };

  };

});
