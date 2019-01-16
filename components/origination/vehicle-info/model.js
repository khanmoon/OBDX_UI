define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var PropertyInfoModel = function() {
    var Model = function(currency) {
        this.loanApplicationRequirementDTO = {
          productGroupSerialNumber: null,
          productGroupCode: null,
          productGroupName: null,
          productGroupLinkageType: null,
          submissionId: {
            displayValue: null,
            value: null
          },
          frequency: "Monthly",
          requestedAmount: {
            currency: currency ? currency : null,
            amount: ""
          },
          requestedTenure: {
            days: null,
            months: null,
            years: null
          },
          purposeType: null,
          isCapitalizeFeesOpted: null,
          noOfCoApplicants: null,
          facilityId: null,
          vehicleDetails: {

            collateralId: "",
            isAddedAsCollateral: true,

            vehicleIdentificationNum:"",
            vehicleMakeType: null,
            vehicleModel: null,
            vehicleSubType: "CAR",
            vehicleType: "PASSENGER_VEHICLE",
            vehicleYear: null,
            isVehicleNew: true,
            registrationState: null,
            distanceTravelled: null
          },
          purpose: {
            name: null,
            description: null,
            code: null
          },
          selectedValues: {
            selectedState: "",
            selectedCountry: "",
            vehicleMakeType: "",
            vehicleSubType: "",
            registrationState: ""
          }
        };

        this.disableInputs = false;
      },
      baseService = BaseService.getInstance(),
      fetchVehicleInfoDeferred,
      fetchVehicleInfo = function(deferred, submissionID) {
        var params = {
            submissionID: submissionID
          },
          options = {
            url: "submissions/{submissionID}/loanApplications",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchVehiclePolicyDeferred,
      fetchVehiclePolicy = function(deferred, submissionID) {
        var params = {
            submissionID: submissionID
          },
          options = {
            url: "vehiclePolicyTemplates",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchCollateralCategoryDeferred,
      fetchCollateralCategory = function(deferred) {
        var options = {

          url: "enumerations/collateralCategory?type=AUTOMOBILE",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchStatesDeferred,
      fetchStates = function(country, deferred) {
        var params = {
          "country": country
        };
        var options = {
          url: "enumerations/country/{country}/state",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchVehicleMakeDeferred,
      fetchVehicleMake = function(deferred) {
        var options = {

          url: "enumerations/vehicleMake",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      saveVehicleInfoDeferred,
      saveVehicleInfo = function(deferred, payload, submissionId) {
        var params = {
            submissionId: submissionId
          },
          options = {
            url: "submissions/{submissionId}/loanApplications",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.add(options, params);
      },
      lookupVehicleInfoDeferred,
      lookupVehicleInfo = function(deferred, submissionId, vehicleIdentificationNum, vehicleSubType, vehicleMake, vehicleModel) {
        var params = {
            "submissionId": submissionId,
            "vin": vehicleIdentificationNum,
            "type": "PASSENGER_VEHICLE",
            "subType": vehicleSubType,
            "make": vehicleMake,
            "model": vehicleModel
          },
          options = {
            url: "submissions/{submissionId}/loanApplications/vehicleLookup?vin={vin}&type={type}&subType={subType}&make={make}&model={model}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchVehicleTypeDeferred,
      fetchVehicleType = function(deferred, submissionId) {
        var params = {
            "submissionId": submissionId,
            "vehicleCategory": "PASSENGER_VEHICLE"
          },
          options = {
            url: "submissions/{submissionId}/loanApplications/vehicleSubType?vehicleType={vehicleCategory}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchVehicleModelDeferred,
      fetchVehicleModel = function(deferred, submissionId, vehicleCategory, vehicleMake) {
        var params = {
            "submissionId": submissionId,
            "vehicleCategory": vehicleCategory,
            "vehicleMake": vehicleMake
          },
          options = {
            url: "submissions/{submissionId}/loanApplications/vehicleModels?type={vehicleCategory}&make={vehicleMake}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      getApplicantDeferred,
      getApplicant = function(deferred, submissionId) {
        var params = {
            submissionId: submissionId
          },
          options = {
            url: "submissions/{submissionId}/applicants",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      };
    return {
      getNewModel: function(currency) {
        return new Model(currency);
      },
      fetchVehicleInfo: function(submissionID) {
        fetchVehicleInfoDeferred = $.Deferred();
        fetchVehicleInfo(fetchVehicleInfoDeferred, submissionID);
        return fetchVehicleInfoDeferred;
      },
      fetchVehiclePolicy: function(submissionID) {
        fetchVehiclePolicyDeferred = $.Deferred();
        fetchVehiclePolicy(fetchVehiclePolicyDeferred, submissionID);
        return fetchVehiclePolicyDeferred;
      },
      fetchVehicleType: function(submissionID) {
        fetchVehicleTypeDeferred = $.Deferred();
        fetchVehicleType(fetchVehicleTypeDeferred, submissionID);
        return fetchVehicleTypeDeferred;
      },
      fetchStates: function(country) {
        fetchStatesDeferred = $.Deferred();
        fetchStates(country, fetchStatesDeferred);
        return fetchStatesDeferred;
      },
      fetchVehicleModel: function(submissionID, vehicleCategory, vehicleMake) {
        fetchVehicleModelDeferred = $.Deferred();
        fetchVehicleModel(fetchVehicleModelDeferred, submissionID, vehicleCategory, vehicleMake);
        return fetchVehicleModelDeferred;
      },
      fetchCollateralCategory: function() {
        fetchCollateralCategoryDeferred = $.Deferred();
        fetchCollateralCategory(fetchCollateralCategoryDeferred);
        return fetchCollateralCategoryDeferred;
      },
      fetchVehicleMake: function() {
        fetchVehicleMakeDeferred = $.Deferred();
        fetchVehicleMake(fetchVehicleMakeDeferred);
        return fetchVehicleMakeDeferred;
      },
      saveVehicleInfo: function(payload, submissionId) {
        saveVehicleInfoDeferred = $.Deferred();
        saveVehicleInfo(saveVehicleInfoDeferred, payload, submissionId);
        return saveVehicleInfoDeferred;
      },
      lookupVehicleInfo: function(submissionId, vehicleIdentificationNum, vehicleSubType, vehicleMake, vehicleModel) {
        lookupVehicleInfoDeferred = $.Deferred();
        lookupVehicleInfo(lookupVehicleInfoDeferred, submissionId, vehicleIdentificationNum, vehicleSubType, vehicleMake, vehicleModel);
        return lookupVehicleInfoDeferred;
      },
      getApplicant: function(submissionId) {
        getApplicantDeferred = $.Deferred();
        getApplicant(getApplicantDeferred, submissionId);
        return getApplicantDeferred;
      }
    };
  };
  return new PropertyInfoModel();
});