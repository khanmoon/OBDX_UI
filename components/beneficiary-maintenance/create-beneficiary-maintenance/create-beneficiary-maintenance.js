define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/beneficiary-maintenance",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojpagingtabledatasource",
    "ojs/ojtable",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojradioset",
    "ojs/ojcheckboxset",
    "ojs/ojvalidationgroup"

], function (oj, ko, $, BeneMaintenancemodel) {
    "use strict";
    var vm = function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        var getNewKoModel = function () {
            var KoModel = BeneMaintenancemodel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.beneficiaryDetails = self.rootModelInstance().BeneficiaryDetails;
        self.additionalBankDetails = ko.observable();
        self.transactionTypeArray = ko.observableArray();
        self.bicCodeError = ko.observable(false);
        self.clearingCodeType = ko.observable("SWI");
        self.networkCode = ko.observable();
        self.mode = ko.observable();
        self.groupValid = ko.observable();
        self.invalidTracker = ko.observable();
        self.tracker = ko.observable();
        self.beneCountryoptions = ko.observable();
        self.dropdownLabels = { country: ko.observable() };
        self.dropdownListLoaded = { country: ko.observable(false) };
        self.dropdownCountryListLoaded = ko.observable(false);
        params.baseModel.registerElement("bank-look-up");
        params.baseModel.registerComponent("review-beneficiary-maintenance", "beneficiary-maintenance");

        self.benecountry = ko.observable("");
        if (self.params.editFlag) {
            params.dashboard.headerName(self.resourceBundle.heading.editBeneMaintenance);
            self.editFlag = ko.observable(true);
        } else {
            params.dashboard.headerName(self.resourceBundle.heading.createBeneMaintenance);
            self.editFlag = ko.observable(false);
        }

        self.verifyCode = function () {
            var trackerSwift;
            trackerSwift = document.getElementById("bankSwiftCode");
            if(trackerSwift.valid === "valid"){
              if (!self.bicCodeError()) {
                  BeneMaintenancemodel.getBankDetailsBIC(self.beneficiaryDetails.swiftId()).done(function (data) {
                      self.additionalBankDetails(data);
                  }).fail(function () {
                      self.beneficiaryDetails.swiftId("");
                  });
              }
            }else {
                trackerSwift.showMessages();
                trackerSwift.focusOn("@firstInvalidShown");
            }
        };


        self.resetCode = function () {
            self.additionalBankDetails(null);
            self.beneficiaryDetails.swiftId("");
        };
        self.openLookup = function () {
            self.clearingCodeType.valueHasMutated();
            $("#menuButtonDialog").trigger("openModal");
        };
        self.save = function () {
            var tracker = document.getElementById("tracker");
            if (tracker.valid === "valid") {

              if (self.beneficiaryDetails.id() === null) {
                  for (var i = 0; i < self.transactionTypeArray().length; i++) {
                      self.beneficiaryDetails.transactionTypeMap().push({
                          id: null,
                          transactionType: self.transactionTypeArray()[i]
                      });
                  }
              } else {
                  for (var j = 0; j < self.transactionTypeArray().length; j++) {
                      self.beneficiaryDetails.transactionTypeMap().push({
                          id: self.beneficiaryDetails.id,
                          transactionType: self.transactionTypeArray()[j]
                      });
                  }
              }

              if (self.beneficiaryDetails.swiftId() !== null && self.beneficiaryDetails.swiftId() !== "") {
                  BeneMaintenancemodel.getBankDetailsBIC(self.beneficiaryDetails.swiftId()).done(function (data) {
                      self.additionalBankDetails(data);
                      if (self.additionalBankDetails()) {
                          var parameters = {
                              mode: "REVIEW",
                              editFlag: self.editFlag(),
                              beneficiaryDetails: ko.mapping.toJS(self.beneficiaryDetails),
                              additionalBankDetails: self.additionalBankDetails
                          };
                          params.dashboard.loadComponent("review-beneficiary-maintenance", parameters, self);
                      }
                  });
              } else {
                  var parameters = {
                      mode: "REVIEW",
                      editFlag: self.editFlag(),
                      beneficiaryDetails: ko.mapping.toJS(self.beneficiaryDetails),
                      additionalBankDetails: self.additionalBankDetails
                  };
                  params.dashboard.loadComponent("review-beneficiary-maintenance", parameters, self);
              }
            }
            else {
               tracker.showMessages();
               tracker.focusOn("@firstInvalidShown");
           }
        };
        if (self.params.mode === "EDIT") {
            ko.utils.extend(self.beneficiaryDetails, self.params.beneficiaryDetails);
            self.beneficiaryDetails = ko.mapping.fromJS(self.beneficiaryDetails);
            if (self.beneficiaryDetails.transactionTypeMap()) {
                self.transactionTypeArray.removeAll();
                for (var i = 0; i < self.beneficiaryDetails.transactionTypeMap().length; i++) {
                    self.transactionTypeArray().push(self.beneficiaryDetails.transactionTypeMap()[i].transactionType());
                }
                self.beneficiaryDetails.transactionTypeMap([]);
            }
            if (self.beneficiaryDetails.swiftId() !== null && self.beneficiaryDetails.swiftId() !== "") {
                BeneMaintenancemodel.getBankDetailsBIC(self.beneficiaryDetails.swiftId()).done(function (data) {
                    self.additionalBankDetails(data);
                });
            }
        }
        BeneMaintenancemodel.fetchBeniCountry().done(function (taskData) {
            var countries = taskData.enumRepresentations[0].data.map(function (data) {
                return {
                    value: data.code,
                    label: data.description
                };
            });
            self.beneCountryoptions(countries);
            if (self.beneficiaryDetails.address.country() && self.beneficiaryDetails.address.country() !== null) {
                var countryLabel = self.beneCountryoptions().filter(function (data) {
                    return data.value === self.beneficiaryDetails.address.country();
                });
                if (countryLabel && countryLabel.length > 0) {
                    self.dropdownLabels.country(countryLabel[0].label);
                }
            }
            self.dropdownListLoaded.country(true);
        });
        self.back = function () {
            history.back();
        };
        self.beneCountrySubscribe = self.beneficiaryDetails.address.country.subscribe(function (newValue) {
            if (!$.isEmptyObject(newValue)) {
                if (self.beneCountryoptions()) {
                    var countryLabel = self.beneCountryoptions().filter(function (data) {
                        return data.value === newValue;
                    });
                    if (countryLabel && countryLabel.length > 0) {
                        self.dropdownLabels.country(countryLabel[0].label);
                    }
                }
            }
        });
    };
    vm.prototype.dispose = function () {
        this.beneCountrySubscribe.dispose();
    };
    return vm;
});
