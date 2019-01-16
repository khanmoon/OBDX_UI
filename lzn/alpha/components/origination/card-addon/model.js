define(
  ["jquery",
    "baseService"
  ],
  function($, BaseService) {
    "use strict";
    /**
     * Model file for Authorized Users for Credit Card product.
     * @returns {function} cardAddonModel - model for card addon
     */
    return function cardAddonModel() {
      /**
       * Model for Authorized User object.
       * @param {Object} modelData - model data to initialize
       * @returns {void}
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
                residentCountry: modelData ? (modelData.applicantDTO.personalInfo.residentCountry ? modelData.applicantDTO.personalInfo.residentCountry : "") : ""
              }
            },
            partyId: {
              value: modelData ? (modelData.partyId ? modelData.partyId.value : null) : null,
              displayValue: null
            },
            temp_previousAddressRequired: false,
            temp_showPreviousAddress: false,
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
                country: "",
                postalCode: ""
              },
              accomodationType: "",
              stayingSince: ""
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
         * Method to fetch salutations for the applicant.
         * @param {Object} deferred - deferred object
         * @returns {void}
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
        fetchCountriesDeferred,
        /**
         * Method to fetch countries.
         * @param {Object} deferred - deferred object
         * @returns {void}
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
         * Method to update or create Authorized user details for credit card product.
         * @param {Object} submissionId - submission id
         * @param {Object} payload - payload of the request
         * @param {Object} deferred - deferred object
         * @returns {void}
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
         * Method to delete Authorized user details for credit card product.
         * @param {Object} submissionId - submission id
         * @param {Object} payload - payload of the request
         * @param {Object} deferred - deferred object
         * @returns {void}
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
         * Method to fetch Authorized user details for credit card product.
         * @param {Object} submissionId - submission id
         * @param {Object} facilityId - facility id
         * @param {Object} simulationId - simulation id
         * @param {Object} offerId - offer id
         * @param {Object} deferred - deferred object
         * @returns {void}
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
         * Method to fetch states.
         * @param {Object} country - country
         * @param {Object} deferred - deferred object
         * @returns {void}
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
         * Method to check whether previous address is required.
         * @param {Object} submissionId - submission id
         * @param {Object} applicantId - applicant id
         * @param {Object} dateData -  date data
         * @param {Object} deferred - deferred object
         * @returns {void}
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
         * Method to fetch accommodation type list.
         * @param {Object} deferred - deferred object
         * @returns {void}
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
        /**
         * Public method to delete addon card details
         *
         * @param {Object} submissionId Submission id of the application
         * @param {Object} payload request payloadss
         * @returns {Object} deleteAddOnCardDetailsDeferred - An object of type deferred
         */
        deleteAddOnCardDetails: function(submissionId, payload) {
          deleteAddOnCardDetailsDeferred = $.Deferred();
          deleteAddOnCardDetails(submissionId, payload, deleteAddOnCardDetailsDeferred);
          return deleteAddOnCardDetailsDeferred;
        },
        /**
         * Public method to update add on card details
         *
         * @param {Object} submissionId Submission id of the application
         * @param {Object} payload request payloadss
         * @returns {Object} deleteAddOnCardDetailsDeferred - An object of type deferred
         */
        updateAddOnCardDetails: function(submissionId, payload) {
          updateAddOnCardDetailsDeferred = $.Deferred();
          updateAddOnCardDetails(submissionId, payload, updateAddOnCardDetailsDeferred);
          return updateAddOnCardDetailsDeferred;
        },
        /**
         * Public method to get add on card details
         *
         * @param {Object} submissionId Submission id of the application
         * @param {Object} facilityId facility Id of the application
         * @param {Object} simulationId simulation Id of the application
         * @param {Object} offerId offer Id of the application
         * @returns {Object} deleteAddOnCardDetailsDeferred - An object of type deferred
         */
        fetchAddOnCardDetails: function(submissionId, facilityId, simulationId, offerId) {
          fetchAddOnCardDetailsDeferred = $.Deferred();
          fetchAddOnCardDetails(submissionId, facilityId, simulationId, offerId, fetchAddOnCardDetailsDeferred);
          return fetchAddOnCardDetailsDeferred;
        },
        /**
         * Public method to fetch salutations
         *
         * @param {Object} submissionId Submission id of the application
         * @param {Object} payload request payloadss
         * @returns {Object} deleteAddOnCardDetailsDeferred - An object of type deferred
         */
        fetchSalutations: function() {
          fetchSalutationsDeferred = $.Deferred();
          fetchSalutations(fetchSalutationsDeferred);
          return fetchSalutationsDeferred;
        },
        /**
         * Public method to fetch countries
         *
         * @param {Object} submissionId Submission id of the application
         * @param {Object} payload request payloadss
         * @returns {Object} deleteAddOnCardDetailsDeferred - An object of type deferred
         */
        fetchCountries: function() {
          fetchCountriesDeferred = $.Deferred();
          fetchCountries(fetchCountriesDeferred);
          return fetchCountriesDeferred;
        },
        /**
         * Public method to fetch accommodation type
         *
         * @param {Object} submissionId Submission id of the application
         * @param {Object} payload request payloadss
         * @returns {Object} deleteAddOnCardDetailsDeferred - An object of type deferred
         */
        getAccomodationTypeList: function() {
          getAccomodationTypeListDeferred = $.Deferred();
          getAccomodationTypeList(getAccomodationTypeListDeferred);
          return getAccomodationTypeListDeferred;
        },
        /**
         * Public method to fetch states
         *
         * @param {String} country country of user
         * @returns {Object} fetchStatesDeferred - An object of type deferred
         */
        fetchStates: function(country) {
          fetchStatesDeferred = $.Deferred();
          fetchStates(country, fetchStatesDeferred);
          return fetchStatesDeferred;
        },
        /**
         * Public method to check stayng since date
         *
         * @param {Object} submissionId Submission id of the application
         * @param {Object} applicantId applicant id
         * @param {Object} dateData date Data
         * @returns {Object} checkStayingSinceDateDeferred - An object of type deferred
         */
        checkStayingSinceDate: function(submissionId, applicantId, dateData) {
          checkStayingSinceDateDeferred = $.Deferred();
          checkStayingSinceDate(submissionId, applicantId, dateData, checkStayingSinceDateDeferred);
          return checkStayingSinceDateDeferred;
        }

      };
    };
  });