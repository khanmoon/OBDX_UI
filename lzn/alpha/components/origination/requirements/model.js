define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model file for Product Requirements section. This file contains the model definition
   * for product requirements section and exports the Requirements model which can be used
   * as a component in any form in which user's product requirements are required.
   *
   * @namespace Requirements~RequirementsModel
   * @class
   * @property {Object} requestedAmount - Object containing the Requested Amount details
   * @property {string} requestedAmount.currency - ISO currency code of the requested loan amount
   * @property {Float} requestedAmount.amount - The requested loan amount in decimal format
   * @property {Object} requestedTenure - Object containing the Requested Loans Tenure details
   * @property {Integer} requestedTenure.days - Number of days in tenure
   * @property {Integer} requestedTenure.months - Number of months in tenure
   * @property {Integer} requestedTenure.years - Number of years in tenure
   * @property {string} purposeType - The purpose for requiring a loan
   * @property {string} purpose - The purpose for requiring a loan
   * @property {Object} expectedSettlementDate - Object containing the expected settlement date value
   * @property {string} expectedSettlementDate.dateString - the expected settlement date
   * @property {boolean} isCapitalizeFeesOpted - true if isCapitalizeFeesOpted is checked
   * @property {boolean} isSettlementRequired - true if isSettlementRequired is checked
   * @property {string} frequency - the value of repayment frequency
   * @property {string} noOfCoApplicants - the number of co-applicants of the loan
   * @property {string} facilityId - The generated facility ID for the submission
   * @property {string} productGroupCode - Value of Product Group Code
   * @property {string} productGroupName - Value of Product Group Name
   */
  var RequirementsModel = function() {
    /**
     * In case more than one instance of model is required
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     * @param  {Object} currency Parametes passed from the parent component
     * @class Model
     * @private
     * @memberOf Requirements~RequirementsModel
     */
    var Model = function(currency) {
        this.loanRequirement = {
          requestedAmount: {
            currency: "",
            amount: null
          },
          requestedTenure: {
            days: 0,
            months: "",
            years: ""
          },
          isCapitalizeFeesOpted: false,
          isSettlementRequired: false,
          purpose: {
            code: ""
          },
          isIPA: false,
          purposeType: "",
          frequency: "MONTHLY",
          noOfCoApplicants: "",
          productGroupCode: null,
          productGroupName: null,
          productGroupSerialNumber: null,
          productClass: null,
          productSubClass: null,
          offerId: null,
          productId: null
        };
        this.autoloanRequirement = {
          requestedAmount: {
            currency: "",
            amount: null
          },
          requestedTenure: {
            days: 0,
            months: "",
            years: ""
          },

          isCapitalizeFeesOpted: false,
          isSettlementRequired: false,
          purpose: {
            code: ""
          },
          vehicleDetails: {
            address: {
              line1: "",
              line2: "",
              city: "",
              state: "",
              country: "",
              postalCode: ""
            },
            collateralId: "",
            ownership: [{
              partyId: null,
              partyName: null
            }],
            vehicleIdentificationNum: null,
            vehicleMakeType: null,
            vehicleModel: null,
            vehicleSubType: null,
            vehicleType: null,
            vehicleYear: null,
            isVehicleNew: "true",
            distanceTravelled: null,
            purchasePrice: {
              currency: currency ? currency : null,
              amount: ""
            }
          },
          submissionId: {
            displayValue: null,
            value: null
          },
          facilityId: null,
          purposeType: "",
          frequency: "MONTHLY",
          noOfCoApplicants: "",
          productGroupCode: null,
          productGroupName: null,
          productGroupSerialNumber: null,
          productClass: null,
          productSubClass: null,
          offerId: null,
          productId: null
        };

        this.homeLoanRequirement = {
          requestedAmount: {
            currency: "",
            amount: null
          },
          requestedTenure: {
            days: 0,
            months: "",
            years: ""
          },
          isCapitalizeFeesOpted: false,
          isSettlementRequired: false,
          purpose: {
            name: null,
            description: null,
            code: null
          },
          isIPA: false,
          submissionId: {
            displayValue: null,
            value: null
          },
          facilityId: null,

          purposeType: "",
          frequency: "MONTHLY",
          noOfCoApplicants: "",
          productGroupCode: null,
          productGroupName: null,
          productGroupSerialNumber: null,
          productGroupLinkageType: null,
          productClass: null,
          productSubClass: null,
          offerId: null,
          productId: null,

          isYourFirstHome: "false",
          propertyDetails: {
            address: {
              line1: "",
              line2: "",
              city: "",
              state: "",
              country: "",
              postalCode: ""
            },
            isPrimaryResidence: false,
            ownership: [{
              partyId: null,
              partyName: null
            }],
            propertySubType: null,
            propertyType: null,
            purchasePrice: {
              currency: currency ? currency : null,
              amount: ""
            }
          },
          selectedValues: {
            propertySubTypeName: "",
            propertyTypeName: "",
            selectedState: "",
            selectedCountry: ""
          }

        };

        this.disableInputs = false;
        this.termRequirement = {
          requestedAmount: {
            currency: "",
            amount: null
          },
          requestedTenure: {
            days: "",
            months: "",
            years: ""
          },
          maturityDate: null,
          currency: currency,
          maturityFactor: null,
          frequency: "",
          noOfCoApplicants: "",
          productGroupCode: null,
          productGroupName: null,
          productGroupSerialNumber: null,
          productClass: null,
          productSubClass: null,
          offerId: null,
          productId: null
        };
        this.savingsRequirement = {
          currency: "",
          noOfCoApplicants: "",
          productGroupCode: null,
          productGroupName: null,
          productGroupSerialNumber: null,
          productClass: null,
          productSubClass: null,
          offerId: null,
          productId: null
        };
        this.cardRequirement = {
          requestedAmount: {
            currency: currency,
            amount: null
          },
          currency: "",
          isGrantEmployeeBenefitsApplicable: false,
          isMaximumLimitRequested: true,
          productGroupCode: null,
          productGroupName: null,
          productGroupSerialNumber: null,
          productClass: null,
          productSubClass: null,
          offerId: null,
          productId: null
        };
        this.coappPreference = {
          isEmailOpted: false,
          isMobileOpted: false
        };
      },
      params, baseService = BaseService.getInstance();
    /**
     * Method to fetch Purpose Type enumeration data.
     *  deferred object is resolved once the purpose list is successfully fetched
     */

    var createSubmissionDeferred,
      /**
       * This function is used to get the index of an object in an array
       * @function getIndex
       * @memberOf AccountSummaryViewModel
       * @param {object} payload - payload used
       * @param {object} deferred -  Parametes passed from the parent component
       * @returns {void}
       */

      createSubmission = function(payload, deferred) {
        var options = {
          url: "submissions/",
          data: JSON.stringify(payload),
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options, params);
      },
      /**
       * This function is used to get the index of an object in an array
       * @function getIndex
       * @memberOf AccountSummaryViewModel
       * @param {object} submissionId - key used for submission
       * @param {object} model - Parametes passed from the parent component
       * @param {object} deferred -  Parametes passed from the parent component
       * @returns {void}
       */
      updateApplicantDeferred, updateApplicant = function(submissionId, model, deferred) {

        var params = {
            submissionId: submissionId

          },
          options = {
            url: "submissions/{submissionId}/applicants",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.add(options, params);

      },

      getAllowedCurrenciesDeferred,
      /**
       * This function is used to get the index of an object in an array
       * @function getIndex
       * @memberOf AccountSummaryViewModel
       * @param {object} productGroupId - key used for product Group
       * @param {object} deferred -  Parametes passed from the parent component
       * @returns {void}
       */
      getAllowedCurrencies = function(productGroupId, deferred) {
        var options = {
            url: "productGroups/{productGroupId}/currencies",

            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "productGroupId": productGroupId
          };
        baseService.fetch(options, params);
      },
      /**
       * This function is used to get the index of an object in an array
       * @function getIndex
       * @memberOf AccountSummaryViewModel
       * @param {object} productCode - key used for product
       * @param {object} deferred -  Parametes passed from the parent component
       * @returns {void}
       */
      fetchLoanPurposeListDeferred,
      fetchLoanPurposeList = function(productCode, deferred) {
        params = {
          "productCode": productCode
        };
        var options = {
          url: "productGroups/{productCode}/purposes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      /**
       * Method to fetch Frequency Options enumeration data.
       * deferred object is resolved once data is fetched
       */
      fetchFrequencyListDeffered,
      /**
       * This function is used to get the index of an object in an array
       * @function getIndex
       * @memberOf AccountSummaryViewModel
       * @param {object} submissionId - key used for submission
       * @param {object} data -  Parametes passed from the parent component
       * @param {object} deferred -  Parametes passed from the parent component
       * @returns {void}
       */
      fetchFrequencyList = function(submissionId, data, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/depositApplications/interestFrequencies?currency=" + data.baseCurrency + "&amount=" + data.requirements.requestedAmount.amount() + "&days=" + data.requirements.requestedTenure.days() + "&months=" + data.requirements.requestedTenure.months() + "&years=" + data.requirements.requestedTenure.years() + "&offerID=" + data.offers.offerId + "&productCode=" + data.productCodeTD + "&productGroupSerialNumber=" + data.requirements.productGroupSerialNumber + "&maturityDate=" + data.requirements.maturityDate() + "&maturityFactor=" + data.requirements.maturityFactor,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       * Method to fetch Loan repayment amount,
       *deferred object is resolved  once the loan repayment amount is successfully fetched
       */
      getRepaymentAmountDeferred,
      /**
       * This function is used to get the index of an object in an array
       * @function getIndex
       * @memberOf AccountSummaryViewModel
       * @param {object} RepaymentAmountRequiredData - amount of Repayment
       * @param {object} deferred -  Parametes passed from the parent component
       * @returns {void}
       */
      getRepaymentAmount = function(RepaymentAmountRequiredData, deferred) {
        var options = {
          selfLoader: true,
          url: "calculators/loan/installment",
          data: JSON.stringify(RepaymentAmountRequiredData),
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      /**
       * Method to fetch Co-Applicants Relation,
       *deferred object is resolved once the Co-Applicants Relation amount is successfully fetched
       */
      fetchOfferDetailsDeferred,
      /**
       * This function is used to get the index of an object in an array
       * @function getIndex
       * @memberOf AccountSummaryViewModel
       * @param {object} offerId -  key for offer
       * @param {object} productType -  Parametes passed for product
       * @param {object} deferred -  Parametes passed from the parent component
       * @returns {void}
       */
      fetchOfferDetails = function(offerId, productType, deferred) {
        params = {
          offerId: offerId,
          productType: productType
        };
        var options = {
          url: "offers/{offerId}?productType={productType}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      /* This function will fire batch request for frequency, relation and purposeList and will return response for all of them in sigle request.
       *deferred object corresponding to eacht request is resolved once the request is successfully fetched respectively.
       */
      fireBatchDeferred,
      /**
       * This function is used to get the index of an object in an array
       * @function getIndex
       * @memberOf AccountSummaryViewModel
       * @param {object} subRequestList -  list of request
       * @param {object} deferred -  Parametes passed from the parent component
       * @returns {void}
       */
      fireBatch = function(subRequestList, deferred) {
        var options = {
          headers: {
            "BATCH_ID": "2653"
          },
          url: "batch/",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.batch(options, {}, subRequestList);
      },
      submitRequirementsDeferred,
      /**
       * This function is used to get the index of an object in an array
       * @function getIndex
       * @memberOf AccountSummaryViewModel
       * @param {object} url -  url used
       * @param {object} submissionId - key used for submission
       * @param {object} requirements -  Parametes passed from the parent component
       * @param {object} deferred -  Parametes passed from the parent component
       * @returns {void}
       */
      submitRequirements = function(url, submissionId, requirements, deferred) {
        params = {
          "submissionId": submissionId
        };
        var options = {
          url: url,
          data: requirements,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.update(options, params);
      },
      fetchApplicantDeferred,
      /**
       * This function is used to get the index of an object in an array
       * @function getIndex
       * @memberOf AccountSummaryViewModel
       * @param {object} submissionId - key used for submission
       * @param {object} deferred -  Parametes passed from the parent component
       * @returns {void}
       */
      fetchApplicant = function(submissionId, deferred) {
        params = {
          "submissionId": submissionId
        };
        var options = {
          url: "submissions/{submissionId}/applicants",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      associateOfferDeferred,
      /**
       * This function is used to get the index of an object in an array
       * @function getIndex
       * @memberOf AccountSummaryViewModel
       * @param {object} submissionId - key used for submission
       * @param {object} productGroupSerialNumber - key used for productGroup
       * @param {object} selectedOfferId -  Parametes passed from the parent component
       * @param {object} deferred -  Parametes passed from the parent component
       * @returns {void}
       */
      associateOffer = function(submissionId, productGroupSerialNumber, selectedOfferId, deferred) {
        params = {
          submissionId: submissionId,
          productGroupSerialNumber: productGroupSerialNumber
        };
        var options = {
          url: "submissions/{submissionId}/products/{productGroupSerialNumber}/selectedOffer",
          data: JSON.stringify({
            "offerId": selectedOfferId
          }),
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options, params);
      },
      fetchRelationsDeferred,
      /**
       * This function is used to get the index of an object in an array
       * @function getIndex
       * @memberOf AccountSummaryViewModel
       * @param {object} deferred -  Parametes passed from the parent component
       * @returns {void}
       */
      fetchRelations = function(deferred) {
        params = {
          "personal": "personal"
        };
        var options = {
          url: "enumerations/relation?type={personal}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      verifyEmailDeferred,
      /**
       * This function is used to get the index of an object in an array
       * @function getIndex
       * @memberOf AccountSummaryViewModel
       * @param {object} payload - Payload used
       * @param {object} deferred -  Parametes passed from the parent component
       * @returns {void}
       */
      verifyEmail = function(payload, deferred) {
        var options = {
          url: "me/emailVerification/otp",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      getApplicantIdDeferred,
      /**
       * This function is used to get the index of an object in an array
       * @function getIndex
       * @memberOf AccountSummaryViewModel
       * @param {object} submissionId - key used for submission
       * @param {object} partyId - key used for party
       * @param {object} payload -  Parametes passed from the parent component
       * @param {object} deferred -  Parametes passed from the parent component
       * @returns {void}
       */
      getApplicantId = function(submissionId, partyId, payload, deferred) {
        params = {
          submissionId: submissionId,
          partyId: partyId
        };
        var options = {
          url: "submissions/{submissionId}/coApplicants/{partyId}/verificationCode",
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
      fetchMaturityPeriodDeferred,

      /**
       * fetchMaturityPeriod - This function is used to fetch maturity date if maturity term is provided and vice versa.
       *
       * @param  {type} submissionId description
       * @param  {type} payload      description
       * @param  {type} deferred     description
       * @return {type}              description
       */
      fetchMaturityPeriod = function(submissionId, payload, deferred) {
        var url;
        if (payload.requirements.maturityFactor === "TERM") {
          url = "submissions/{submissionId}/depositApplications/maturityParameters?maturityFactor={maturityFactorId}&days={days}&months={months}&years={years}&offerID={offerId}";
          params = {
            submissionId: submissionId,
            //maturityFactorId: payload.requirements.maturityFactor,
            "maturityFactorId": "TERM",
            "days": payload.requirements.requestedTenure.days(),
            "months": payload.requirements.requestedTenure.months(),
            "years": payload.requirements.requestedTenure.years(),
            "offerId": payload.offerId
          };
        } else {
          url = "submissions/{submissionId}/depositApplications/maturityParameters?maturityFactor={maturityFactorId}&maturityDate={maturityDate}&offerID={offerId}";
          params = {
            submissionId: submissionId,
            //maturityFactorId: payload.requirements.maturityFactor,
            "maturityFactorId": "MATURITY_DATE",
            "maturityDate": payload.requirements.maturityDate(),
            "offerId": payload.offerId
          };
        }
        var options = {
          url: url,
          //url: "origination/maturityResponse",
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
      createSubmission: function(payload) {
        createSubmissionDeferred = $.Deferred();
        createSubmission(payload, createSubmissionDeferred);
        return createSubmissionDeferred;
      },
      getAllowedCurrencies: function(productGroupId) {
        getAllowedCurrenciesDeferred = $.Deferred();
        getAllowedCurrencies(productGroupId, getAllowedCurrenciesDeferred);
        return getAllowedCurrenciesDeferred;
      },

      fetchLoanPurposeList: function(payload) {
        fetchLoanPurposeListDeferred = $.Deferred();
        fetchLoanPurposeList(payload, fetchLoanPurposeListDeferred);
        return fetchLoanPurposeListDeferred;
      },
      fetchFrequencyList: function(submissionId, data) {
        fetchFrequencyListDeffered = $.Deferred();
        fetchFrequencyList(submissionId, data, fetchFrequencyListDeffered);
        return fetchFrequencyListDeffered;
      },
      getRepaymentAmount: function(RepaymentAmountRequiredData) {
        getRepaymentAmountDeferred = $.Deferred();
        getRepaymentAmount(RepaymentAmountRequiredData, getRepaymentAmountDeferred);
        return getRepaymentAmountDeferred;
      },
      fetchRelations: function() {
        fetchRelationsDeferred = $.Deferred();
        fetchRelations(fetchRelationsDeferred);
        return fetchRelationsDeferred;
      },
      fireBatch: function(subRequestList) {
        fireBatchDeferred = $.Deferred();
        fireBatch(subRequestList, fireBatchDeferred);
        return fireBatchDeferred;
      },
      updateApplicant: function(submissionId, model) {
        updateApplicantDeferred = $.Deferred();
        updateApplicant(submissionId, model, updateApplicantDeferred);
        return updateApplicantDeferred;
      },
      submitRequirements: function(url, submissionId, requirements) {
        submitRequirementsDeferred = $.Deferred();
        submitRequirements(url, submissionId, requirements, submitRequirementsDeferred);
        return submitRequirementsDeferred;
      },
      fetchApplicant: function(submissionId) {
        fetchApplicantDeferred = $.Deferred();
        fetchApplicant(submissionId, fetchApplicantDeferred);
        return fetchApplicantDeferred;
      },
      associateOffer: function(submissionId, productGroupSerialNumber, selectedOfferId) {
        associateOfferDeferred = $.Deferred();
        associateOffer(submissionId, productGroupSerialNumber, selectedOfferId, associateOfferDeferred);
        return associateOfferDeferred;
      },
      fetchOfferDetails: function(offerId, productType) {
        fetchOfferDetailsDeferred = $.Deferred();
        fetchOfferDetails(offerId, productType, fetchOfferDetailsDeferred);
        return fetchOfferDetailsDeferred;
      },
      verifyEmail: function(payload) {
        verifyEmailDeferred = $.Deferred();
        verifyEmail(payload, verifyEmailDeferred);
        return verifyEmailDeferred;
      },
      getApplicantId: function(submissionId, partyId, payload) {
        getApplicantIdDeferred = $.Deferred();
        getApplicantId(submissionId, partyId, payload, getApplicantIdDeferred);
        return getApplicantIdDeferred;
      },
      fetchMaturityPeriod: function(submissionId, payload) {
        fetchMaturityPeriodDeferred = $.Deferred();
        fetchMaturityPeriod(submissionId, payload, fetchMaturityPeriodDeferred);
        return fetchMaturityPeriodDeferred;
      }
    };
  };
  return new RequirementsModel();
});
