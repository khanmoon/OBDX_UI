define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var AMLModelObject = function() {

    /**
     * var Model - description
     *
     * @return {type}  description
     */
    var Model = function() {
        this.amlDetailsDTO = {
          amlCharacteristicType: "",
          amlCode: "",
          amlDescription: ""
        };
      },

      /**
       *
       */
      baseService = BaseService.getInstance(),

      /**
       *
       */
      fetchWealthSourcesDeferred,
      fetchWealthSources = function(deferred) {
        var options = {
          url: "enumerations/wealthSources",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },

      /**
       *
       */
      fetchFundSourcesDeferred,
      fetchFundSources = function(deferred) {
        var options = {
          url: "enumerations/fundSources",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },

      /**
       *
       */
      fetchRelationshipPurposesDeferred,
      fetchRelationshipPurposes = function(deferred) {
        var options = {
          url: "enumerations/relationshipPurposes",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },

      /**
       *
       */
      fetchAMLDetailsDeferred,
      fetchAMLDetails = function(deferred, data) {
        var params = {
            submissionId: data.submissionId,
            applicantId: data.applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/AML",
            //url: "origination/amlGet",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },

      /**
       *
       */
      saveAMLDetailsDeferred,
      saveAMLDetails = function(deferred, data, payload) {
        var params = {
            submissionId: data.submissionId,
            applicantId: data.applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/AML",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.add(options, params);
      },

      /**
       *
       */
      updateAMLDetailsDeferred,
      updateAMLDetails = function(deferred, data, payload) {
        var params = {
            submissionId: data.submissionId,
            applicantId: data.applicantId,
            aMLId: data.aMLId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/AML/{aMLId}",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.update(options, params);
      },
      fetchConsentDeferred,
      fetchConsent = function(deferred, data) {
        var params = {
            submissionId: data.submissionId,
            applicantId: data.applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/consents",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      saveConsentsDeferred,
      saveConsents = function (deferred, payload, data) {
        var params = {
            submissionId: data.submissionId,
            applicantId: data.applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/consents",
            data: payload,
            success: function (data) {
              deferred.resolve(data);
            }
          };
        baseService.add(options, params);
      },
      updateConsentsDeferred,
      updateConsents = function (deferred, payload, data) {
        var params = {
            submissionId: data.submissionId,
            applicantId: data.applicantId,
            consentId:data.consentId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/consents/{consentId}",
            data: payload,
            success: function (data) {
              deferred.resolve(data);
            }
          };
        baseService.update(options, params);
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      fetchWealthSources: function() {
        fetchWealthSourcesDeferred = $.Deferred();
        fetchWealthSources(fetchWealthSourcesDeferred);
        return fetchWealthSourcesDeferred;
      },
      fetchFundSources: function() {
        fetchFundSourcesDeferred = $.Deferred();
        fetchFundSources(fetchFundSourcesDeferred);
        return fetchFundSourcesDeferred;
      },
      fetchRelationshipPurposes: function() {
        fetchRelationshipPurposesDeferred = $.Deferred();
        fetchRelationshipPurposes(fetchRelationshipPurposesDeferred);
        return fetchRelationshipPurposesDeferred;
      },
      fetchAMLDetails: function(data) {
        fetchAMLDetailsDeferred = $.Deferred();
        fetchAMLDetails(fetchAMLDetailsDeferred, data);
        return fetchAMLDetailsDeferred;
      },
      saveAMLDetails: function(data, payload) {
        saveAMLDetailsDeferred = $.Deferred();
        saveAMLDetails(saveAMLDetailsDeferred, data, payload);
        return saveAMLDetailsDeferred;
      },
      updateAMLDetails: function(data, payload) {
        updateAMLDetailsDeferred = $.Deferred();
        updateAMLDetails(updateAMLDetailsDeferred, data, payload);
        return updateAMLDetailsDeferred;
      },
      fetchConsent: function(data) {
        fetchConsentDeferred = $.Deferred();
        fetchConsent(fetchConsentDeferred, data);
        return fetchConsentDeferred;
      },
      saveConsents: function (data, payload) {
        saveConsentsDeferred = $.Deferred();
        saveConsents(saveConsentsDeferred, payload, data);
        return saveConsentsDeferred;
      },
      updateConsents: function (data, payload) {
        updateConsentsDeferred = $.Deferred();
        updateConsents(updateConsentsDeferred, payload, data);
        return updateConsentsDeferred;
      }
    };
  };
  return new AMLModelObject();
});
