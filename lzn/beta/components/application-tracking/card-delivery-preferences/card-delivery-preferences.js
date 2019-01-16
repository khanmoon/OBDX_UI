define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/beta/resources/nls/card-delivery-preferences",
  "ojs/ojselectcombobox",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojknockout-validation",
  "ojs/ojcheckboxset",
  "ojs/ojswitch"
], function(oj, ko, $, CardDeliveryPreferencesModel, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      CardDeliveryPreferencesModelObject = new CardDeliveryPreferencesModel(),
      getNewKoModel = function(modelData) {
        var KoModel = CardDeliveryPreferencesModelObject.getNewModel(modelData);
        KoModel.cardDeliveryPreferences.selectedValues = ko.observable(KoModel.cardDeliveryPreferences.selectedValues);
        return KoModel;
      };
    self.validationTracker = ko.observable();
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.deliveryPreferencesLoaded = ko.observable(false);
    self.primaryCardHolder().preferences = getNewKoModel();
    self.partyAddresses = ko.observable({
      HOME: {},
      POSTAL: {}
    });
    self.branchAddresses = ko.observableArray([]);
    self.cardDeliveryAddressRefreshed = ko.observable(false);
    self.pinDeliveryAddressRefreshed = ko.observable(false);
    self.statementDeliveryAddressRefreshed = ko.observable(false);
    self.stateOptions = ko.observable([]);
    self.statesChanged = ko.observable(false);
    self.cardDeliveryModes = ko.observableArray([{
        key: "HOME",
        description: self.resource.home
      },
      {
        key: "BRANCH",
        description: self.resource.branch
      },
      {
        key: "CURRENT_ADDRESS",
        description: self.resource.tempAddress
      }
    ]);
    self.pinDeliveryModes = ko.observableArray([{
        key: "HOME",
        description: self.resource.home
      },
      {
        key: "BRANCH",
        description: self.resource.branch
      },
      {
        key: "CURRENT_ADDRESS",
        description: self.resource.tempAddress
      }
    ]);
    self.statementDeliveryModes = ko.observableArray([{
        key: "ONLINE",
        description: self.resource.online
      },
      {
        key: "POST",
        description: self.resource.post
      },
      {
        key: "BOTH",
        description: self.resource.both
      }
    ]);
    self.updateDeliveryPreferences = function() {
      self.primaryCardHolder().preferences.cardDeliveryPreferences.selectedValues().cardDeliveryAddress.state = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress.state);
      self.primaryCardHolder().preferences.cardDeliveryPreferences.selectedValues().pinDeliveryAddress.state = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress.state);
      self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryMode = ko.utils.unwrapObservable(self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryMode);
      self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryMode = ko.utils.unwrapObservable(self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryMode);
      self.primaryCardHolder().preferences.cardDeliveryPreferences.statementDeliveryMode = ko.utils.unwrapObservable(self.primaryCardHolder().preferences.cardDeliveryPreferences.statementDeliveryMode);
      self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress.state = ko.utils.unwrapObservable(self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress.state);
      self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress.state = ko.utils.unwrapObservable(self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress.state);
      self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress.country = ko.utils.unwrapObservable(self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress.country);
      self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress.country = ko.utils.unwrapObservable(self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress.country);
      var payload = ko.mapping.toJSON(self.primaryCardHolder().preferences.cardDeliveryPreferences, {
        "ignore": ["selectedValues"]
      });
      CardDeliveryPreferencesModelObject.updateCardDeliveryPreferences(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), payload).done(function() {
        self.uplTrackingDetails().additionalInfo.sections[1].isComplete(true);
        self.additionalInfoAccordion().open(3);
      });
    };
    self.cardBranchChange = function(event) {
      if (event.detail.value) {
        self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress = {};
        self.cardDeliveryAddressRefreshed(false);
        self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryBranch = event.detail.value;
        for (var i = 0; i < self.branchAddresses().length; i++) {
          if (self.branchAddresses()[i].branchCode === self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryBranch) {
            self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress.line1 = self.branchAddresses()[i].branchAddress.postalAddress.line1;
            self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress.line2 = self.branchAddresses()[i].branchAddress.postalAddress.line2;
            self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress.city = self.branchAddresses()[i].branchAddress.postalAddress.city;
            self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress.state = self.branchAddresses()[i].branchAddress.postalAddress.state;
            self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress.country = self.branchAddresses()[i].branchAddress.postalAddress.country;
            self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress.postalCode = self.branchAddresses()[i].branchAddress.postalAddress.postalCode;
            self.primaryCardHolder().preferences.cardDeliveryPreferences.selectedValues().cardDeliveryAddress.state = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress.state);
          }
        }
        ko.tasks.runEarly();
        self.cardDeliveryAddressRefreshed(true);
      }
    };
    self.pinBranchChange = function(event) {
      if (event.detail.value) {
        self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress = {};
        self.pinDeliveryAddressRefreshed(false);
        self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryBranch = event.detail.value;
        for (var i = 0; i < self.branchAddresses().length; i++) {
          if (self.branchAddresses()[i].branchCode === self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryBranch) {
            self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress.line1 = self.branchAddresses()[i].branchAddress.postalAddress.line1;
            self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress.line2 = self.branchAddresses()[i].branchAddress.postalAddress.line2;
            self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress.city = self.branchAddresses()[i].branchAddress.postalAddress.city;
            self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress.state = self.branchAddresses()[i].branchAddress.postalAddress.state;
            self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress.country = self.branchAddresses()[i].branchAddress.postalAddress.country;
            self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress.postalCode = self.branchAddresses()[i].branchAddress.postalAddress.postalCode;
            self.primaryCardHolder().preferences.cardDeliveryPreferences.selectedValues().pinDeliveryAddress.state = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress.state);
          }
        }
        ko.tasks.runEarly();
        self.pinDeliveryAddressRefreshed(true);
      }
    };
    self.pinDeliveryChange = function(event) {
      if (event.detail.value) {
        self.pinDeliveryAddressRefreshed(false);
        self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryMode = event.detail.value;
        if (self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryMode === "CURRENT_ADDRESS") {
          self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress = self.getNewAddress();
        } else if (self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryMode === "HOME") {
          self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress = self.partyAddresses().HOME;
        } else if (self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryMode === "POSTAL") {
          self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress = self.partyAddresses().POSTAL;
        } else if (self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryMode === "BRANCH") {
          self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress = null;
        }
        if (self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress) {
          self.primaryCardHolder().preferences.cardDeliveryPreferences.selectedValues().pinDeliveryAddress.state = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress.state);
        }
        ko.tasks.runEarly();
        self.pinDeliveryAddressRefreshed(true);
      }
    };
    self.cardDeliveryChange = function(event) {
      if (event.detail.value) {
        self.cardDeliveryAddressRefreshed(false);
        self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryMode = event.detail.value;
        if (self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryMode === "CURRENT_ADDRESS") {
          self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress = self.getNewAddress();
        } else if (self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryMode === "HOME") {
          self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress = self.partyAddresses().HOME;
        } else if (self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryMode === "POSTAL") {
          self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress = self.partyAddresses().POSTAL;
        } else if (self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryMode === "BRANCH") {
          self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress = null;
        }
        if (self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress) {
          self.primaryCardHolder().preferences.cardDeliveryPreferences.selectedValues().cardDeliveryAddress.state = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress.state);
        }
        ko.tasks.runEarly();
        self.cardDeliveryAddressRefreshed(true);
      }
    };
    self.getNewAddress = function() {
      var address = {
        country: "",
        state: "",
        city: "",
        postalCode: "",
        line1: "",
        line2: ""
      };
      if (self.partyAddresses().HOME.country === "US") {
        address.country = self.partyAddresses().HOME.country;
      }
      return address;
    };
    self.formatzipCode = function(val) {
      var newVal = "";
      while (val.length > 5) {
        newVal += val.substr(0, 5) + "-";
        val = val.substr(5);
      }
      newVal += val;
      return newVal;
    };
    $(document).on("keyup", ".zipCodeUS", function() {
      var val = this.value.replace(/\D/g, "");
      this.value = self.formatzipCode(val);
    });
    self.statementDeliveryChange = function(event) {
      if (event.detail.value) {
        self.statementDeliveryAddressRefreshed(false);
        self.primaryCardHolder().preferences.cardDeliveryPreferences.statementDeliveryMode = event.detail.value;
        ko.tasks.runEarly();
        self.statementDeliveryAddressRefreshed(true);
      }
    };
    CardDeliveryPreferencesModelObject.fetchCardDeliveryPreferences(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function(data) {
      var country = null;
      if (data) {
        self.primaryCardHolder().preferences = getNewKoModel(data);
      }
      self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryBranch = data.pinDeliveryBranch;
      self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryBranch = data.cardDeliveryBranch;
      CardDeliveryPreferencesModelObject.fetchAddresses(self.primaryCardHolder().applicantId.value).done(function(data) {
        if (data.partyAddressDTO) {
          for (var i = 0; i < data.partyAddressDTO.length; i++) {
            if (data.partyAddressDTO[i].type === "RES") {
              self.partyAddresses().HOME = data.partyAddressDTO[i].postalAddress;
              country = data.partyAddressDTO[i].postalAddress.country;
            } else if (data.partyAddressDTO[i].type === "PST") {
              self.partyAddresses().POSTAL = data.partyAddressDTO[i].postalAddress;
            }
          }
          if (country) {
            CardDeliveryPreferencesModelObject.fetchStates(country).done(function(data) {
              self.stateOptions(data.enumRepresentations[0].data);
              self.statesChanged(true);
              self.primaryCardHolder().preferences.cardDeliveryPreferences.selectedValues().cardDeliveryAddress.state = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.primaryCardHolder().preferences.cardDeliveryPreferences.cardDeliveryAddress.state);
              self.primaryCardHolder().preferences.cardDeliveryPreferences.selectedValues().pinDeliveryAddress.state = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.primaryCardHolder().preferences.cardDeliveryPreferences.pinDeliveryAddress.state);
              self.primaryCardHolder().preferences.cardDeliveryPreferences.selectedValues().statementDeliveryAddress.state = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.partyAddresses().POSTAL.state);
            });
          }
        }
        CardDeliveryPreferencesModelObject.fetchBranches(self.applicationInfo().currentSubmissionId()).done(function(data) {
          if (data.addressDTO) {
            self.branchAddresses(data.addressDTO);
          }
          self.statementDeliveryAddressRefreshed(true);
          self.cardDeliveryAddressRefreshed(true);
          self.pinDeliveryAddressRefreshed(true);
          self.deliveryPreferencesLoaded(true);
        });
      });
    });
  };
});
