define(
  ["jquery",
    "baseService"
  ],
  function($, BaseService) {
    "use strict";
    /**
     * cardAddonModel - Model file for Authorized Users for Credit Card product.
     *
     * @return {object}  description
     */
    return function cardAddonModel() {
      /**
       * var Model - Model for Authorized User object.
       *
       * @param  {object} modelData description
       * @return {void}           description
       */
      var Model = function(modelData) {

          this.addonCard = {
            temp_isActive: false,
            submissionId: "",
            facilityId: "",
            simulationId: "",
            productGroupSerialNumber: "",
            applicantDTO: {
              facilityId: "",
              applicantRelationshipType: "ADDON_CARDHOLDER",
              personalInfo: {
                salutation: modelData ? (modelData.applicantDTO.personalInfo.salutation ? modelData.applicantDTO.personalInfo.salutation : "") : "",
                firstName: modelData ? (modelData.applicantDTO.personalInfo.firstName ? modelData.applicantDTO.personalInfo.firstName : "") : "",
                middleName: modelData ? (modelData.applicantDTO.personalInfo.middleName ? modelData.applicantDTO.personalInfo.middleName : null) : null,
                lastName: modelData ? (modelData.applicantDTO.personalInfo.lastName ? modelData.applicantDTO.personalInfo.lastName : "") : "",
                birthDate: modelData ? (modelData.applicantDTO.personalInfo.birthDate ? modelData.applicantDTO.personalInfo.birthDate : "") : "",
                citizenship: modelData ? (modelData.applicantDTO.personalInfo.citizenship ? modelData.applicantDTO.personalInfo.citizenship : "") : "",
                isPermanentResidence: modelData ? (modelData.applicantDTO.personalInfo.isPermanentResidence ? modelData.applicantDTO.personalInfo.isPermanentResidence : "") : true,
                residentCountry: modelData ? (modelData.applicantDTO.personalInfo.residentCountry ? modelData.applicantDTO.personalInfo.residentCountry : "") : "",
                suffix: modelData ? (modelData.applicantDTO.personalInfo.suffix ? modelData.applicantDTO.personalInfo.suffix : null) : null
              }
            },
            partyId: {
              value: modelData ? (modelData.partyId ? modelData.partyId.value : null) : null,
              displayValue: null
            },
            temp_previousAddressRequired: false,
            temp_showPreviousAddress: false,
            temp_maskedSSN: "",
            temp_isResAddressSameAsPrimary: false,
            temp_isAddressSameAsPrimary: "OPTION_NO",
            temp_permanentResident: "OPTION_YES",
            temp_showAddressSwitch: true,
            selectedValues: {
              currentAddress: {},
              previousAddress: {},
              primaryInfo: {}
            },
            partyAddresses: modelData ? modelData.partyAddresses : [{
              type: "RES",
              status: "CURRENT",
              postalAddress: {
                line1: "",
                line2: "",
                city: "",
                state: "",
                country: "US",
                postalCode: ""
              },
              accomodationType: "",
              stayingSince: ""
            }],
            identifications: [{
              type: "SSN",
              id: modelData ? (modelData.identifications[0] ? modelData.identifications[0].id : "") : ""
            }],
            addOnCardHolderRequirement: {
              embossName: "",
              creditLimitPercentage: "100",
              isUserSpecifiedEmbossName: false
            }

          };
        },
        baseService = BaseService.getInstance();

      var fetchSalutationsDeferred,
        /**
         * fetchSalutations - Method to fetch salutations for the applicant.
         *
         * @param  {object} deferred description
         * @return {void}          description
         */
        fetchSalutations = function(deferred) {
          var options = {
            url: "enumerations/salutation?for=primary",

            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
          baseService.fetch(options);
        },
        fetchSuffixesDeferred,
        /**
         * fetchSuffixes - Method to fetch suffixes for the applicant.
         *
         * @param  {object} deferred description
         * @return {void}          description
         */
        fetchSuffixes = function(deferred) {
          var options = {
            url: "enumerations/suffix",

            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
          baseService.fetch(options);
        },
        fetchCountriesDeferred,
        /**
         * fetchCountries - Method to fetch countries.
         *
         * @param  {object} deferred description
         * @return {void}          description
         */
        fetchCountries = function(deferred) {
          var options = {
            url: "enumerations/country",
            success: function(data) {
              deferred.resolve(data);
            }
          };
          baseService.fetch(options);
        },
        updateAddOnCardDetailsDeferred,
        /**
         * updateAddOnCardDetails - Method to update or create Authorized user details for credit card product.
         *
         * @param  {object} submissionId description
         * @param  {object} payload      description
         * @param  {object} deferred     description
         * @return {void}              description
         */
        updateAddOnCardDetails = function(submissionId, payload, deferred) {
          var params = {
              submissionId: submissionId
            },
            options = {
              url: "submissions/{submissionId}/creditCardApplications/supplementaryCard",
              data: payload,
              success: function(data) {
                deferred.resolve(data);
              },
              error: function(data) {
                deferred.reject(data);
              }
            };
          if (JSON.parse(payload).partyId && JSON.parse(payload).partyId.value) {
            baseService.update(options, params);
          } else {
            baseService.add(options, params);
          }
        },
        deleteAddOnCardDetailsDeferred,
        /**
         * deleteAddOnCardDetails - Method to delete Authorized user details for credit card product.
         *
         * @param  {object} submissionId description
         * @param  {object} payload      description
         * @param  {object} deferred     description
         * @return {void}              description
         */
        deleteAddOnCardDetails = function(submissionId, payload, deferred) {
          var params = {
              submissionId: submissionId
            },
            options = {
              url: "submissions/{submissionId}/creditCardApplications/supplementaryCard",
              data: payload,
              success: function(data) {
                deferred.resolve(data);
              },
              error: function(data) {
                deferred.reject(data);
              }
            };
          baseService.remove(options, params);
        },
        fetchAddOnCardDetailsDeferred,
        /**
         * fetchAddOnCardDetails - Method to fetch Authorized user details for credit card product.
         *
         * @param  {object} submissionId description
         * @param  {object} facilityId   description
         * @param  {object} simulationId description
         * @param  {object} offerId      description
         * @param  {object} deferred     description
         * @return {void}              description
         */
        fetchAddOnCardDetails = function(submissionId, facilityId, simulationId, offerId, deferred) {
          var params = {
              submissionId: submissionId,
              facilityId: facilityId,
              simulationId: simulationId,
              offerId: offerId
            },
            options = {
              url: "submissions/{submissionId}/creditCardApplications/supplementaryCard?offerId={offerId}&facilityId={facilityId}&simulationId={simulationId}",
              success: function(data) {
                deferred.resolve(data);
              },
              error: function(data) {
                deferred.reject(data);
              }
            };
          baseService.fetch(options, params);
        },
        fetchStatesDeferred,
        /**
         * fetchStates - Method to fetch states.
         *
         * @param  {object} country  description
         * @param  {object} deferred description
         * @return {void}          description
         */
        fetchStates = function(country, deferred) {
          var params = {
            "countryCode": country
          };
          var options = {
            url: "enumerations/country/{countryCode}/state",
            success: function(data) {
              deferred.resolve(data);
            }
          };
          baseService.fetch(options, params);
        },
        checkStayingSinceDateDeferred,
        /**
         * checkStayingSinceDate - Method to check whether previous address is required.
         *
         * @param  {object} submissionId description
         * @param  {object} applicantId  description
         * @param  {object} dateData     description
         * @param  {object} deferred     description
         * @return {void}              description
         */
        checkStayingSinceDate = function(submissionId, applicantId, dateData, deferred) {
          var params = {
              submissionId: submissionId,
              applicantId: applicantId,
              date: dateData
            },
            options = {
              url: "submissions/{submissionId}/applicants/{applicantId}/validateAddressDate/{date}",
              showMessage: false,
              success: function(data) {
                deferred.resolve(data);
              },
              error: function(data) {
                deferred.reject(data);
              }
            };

          baseService.fetch(options, params);

        },
        getAccomodationTypeListDeferred,
        /**
         *Method to fetch accommodation type list.
         * @param  {object} deferred description
         * @return {void}          description
         */
        getAccomodationTypeList = function(deferred) {
          var options = {
            url: "enumerations/accomodationType",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
          baseService.fetch(options);
        };
      return {
        getNewModel: function(modelData) {
          return new Model(modelData);
        },
        deleteAddOnCardDetails: function(submissionId, payload) {
          deleteAddOnCardDetailsDeferred = $.Deferred();
          deleteAddOnCardDetails(submissionId, payload, deleteAddOnCardDetailsDeferred);
          return deleteAddOnCardDetailsDeferred;
        },
        updateAddOnCardDetails: function(submissionId, payload) {
          updateAddOnCardDetailsDeferred = $.Deferred();
          updateAddOnCardDetails(submissionId, payload, updateAddOnCardDetailsDeferred);
          return updateAddOnCardDetailsDeferred;
        },
        fetchAddOnCardDetails: function(submissionId, facilityId, simulationId, offerId) {
          fetchAddOnCardDetailsDeferred = $.Deferred();
          fetchAddOnCardDetails(submissionId, facilityId, simulationId, offerId, fetchAddOnCardDetailsDeferred);
          return fetchAddOnCardDetailsDeferred;
        },
        fetchSuffixes: function() {
          fetchSuffixesDeferred = $.Deferred();
          fetchSuffixes(fetchSuffixesDeferred);
          return fetchSuffixesDeferred;
        },
        fetchSalutations: function() {
          fetchSalutationsDeferred = $.Deferred();
          fetchSalutations(fetchSalutationsDeferred);
          return fetchSalutationsDeferred;
        },
        fetchCountries: function() {
          fetchCountriesDeferred = $.Deferred();
          fetchCountries(fetchCountriesDeferred);
          return fetchCountriesDeferred;
        },
        getAccomodationTypeList: function() {
          getAccomodationTypeListDeferred = $.Deferred();
          getAccomodationTypeList(getAccomodationTypeListDeferred);
          return getAccomodationTypeListDeferred;
        },
        fetchStates: function(country) {
          fetchStatesDeferred = $.Deferred();
          fetchStates(country, fetchStatesDeferred);
          return fetchStatesDeferred;
        },
        checkStayingSinceDate: function(submissionId, applicantId, dateData) {
          checkStayingSinceDateDeferred = $.Deferred();
          checkStayingSinceDate(submissionId, applicantId, dateData, checkStayingSinceDateDeferred);
          return checkStayingSinceDateDeferred;
        }

      };
    };
  });
