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
          requestedAmount: {
            currency: currency ? currency : null,
            amount: null
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
          isYourFirstHome: null,
          propertyDetails: {
            address: {
              line1: "",
              line2: "",
              city: "",
              state: "",
              country: "",
              postalCode: ""
            },
            isPrimaryResidence: true,
            ownership: [{
              partyId: null,
              partyName: null
            }],
            propertySubType: null,
            propertyType: "RESIDENTIAL_PROPERTY",
            purchasePrice: {
              currency: currency ? currency : null,
              amount: ""
            }
          },
          purpose: {
            name: null,
            description: null,
            code: null
          },
          selectedValues: {
            propertySubTypeName: "",
            propertyTypeName: "",
            selectedState: "",
            selectedCountry: ""
          }
        };

        this.disableInputs = false;
      },
      baseService = BaseService.getInstance(),
      fetchPropetyInfoDeferred,
      fetchPropetyInfo = function(deferred, submissionID) {
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
      fetchTypeOfPropertyDeferred,
      fetchTypeOfProperty = function(deferred) {
        var options = {

          url: "properties/propertyType",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchSubTypeOfPropertyDeferred,
      fetchSubTypeOfProperty = function(deferred, propertyType) {
        var params = {
            propertyType: propertyType
          },
          options = {

            url: "properties/subpropertyType?propertyType={propertyType}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      savePropetyInfoDeferred,
      savePropetyInfo = function(deferred, payload, submissionId) {
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

      fetchPropetyInfo: function(submissionID) {
        fetchPropetyInfoDeferred = $.Deferred();
        fetchPropetyInfo(fetchPropetyInfoDeferred, submissionID);
        return fetchPropetyInfoDeferred;
      },
      fetchTypeOfProperty: function() {
        fetchTypeOfPropertyDeferred = $.Deferred();
        fetchTypeOfProperty(fetchTypeOfPropertyDeferred);
        return fetchTypeOfPropertyDeferred;
      },
      fetchSubTypeOfProperty: function(propertyType) {
        fetchSubTypeOfPropertyDeferred = $.Deferred();
        fetchSubTypeOfProperty(fetchSubTypeOfPropertyDeferred, propertyType);
        return fetchSubTypeOfPropertyDeferred;
      },
      savePropetyInfo: function(payload, submissionId) {
        savePropetyInfoDeferred = $.Deferred();
        savePropetyInfo(savePropetyInfoDeferred, payload, submissionId);
        return savePropetyInfoDeferred;
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