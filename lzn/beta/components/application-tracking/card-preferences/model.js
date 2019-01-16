define(
  ["jquery",
    "baseService"
  ],
  function($, BaseService) {
    "use strict";
    return function CardPreferenceModel() {
      var Model = function(modelData) {
          this.cardHolderPreferences = {
            embossName: modelData ? (modelData.embossName ? modelData.embossName : "") : "",
            isUserSpecifiedEmbossName: modelData ? (modelData.isUserSpecifiedEmbossName ? modelData.isUserSpecifiedEmbossName : false) : false,
            cardBackgroundId: modelData ? (modelData.cardBackgroundId ? modelData.cardBackgroundId : null) : null,
            companionCardBackgroundId: modelData ? (modelData.companionCardBackgroundId ? modelData.companionCardBackgroundId : null) : null,
            partyId: {
              value: modelData ? (modelData.partyId ? modelData.partyId.value : null) : null,
              displayValue: ""
            },
            applicantRelationshipType: modelData ? (modelData.applicantRelationshipType ? modelData.applicantRelationshipType : "") : "",
            documentId: {
              value: modelData ? (modelData.documentId ? modelData.documentId.value : null) : null,
              displayValue: ""
            },
            externalReferenceId: {
              value: modelData ? (modelData.externalReferenceId ? modelData.externalReferenceId.value : null) : null,
              displayValue: ""
            },
            selectedValues: {}
          };
        },
        baseService = BaseService.getInstance(),
        fetchBgContentIdsDeferred,
        fetchBgContentIds = function(submissionId, payload, deferred) {
          var options = {
            url: "submissions/" + submissionId + "/creditCardApplications/backGroundContent",
            data: JSON.stringify(payload),
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
          baseService.add(options);
        },
        updateCardHolderPreferencesDeferred,
        updateCardHolderPreferences = function(submissionId, applicationId, payload, deferred) {
          var params = {
              submissionId: submissionId,
              applicationId: applicationId
            },
            options = {
              url: "submissions/" + submissionId + "/applications/" + applicationId + "/cardHolderPreferences",
              data: payload,
              success: function(data) {
                deferred.resolve(data);
              },
              error: function(data) {
                deferred.reject(data);
              }
            };
          baseService.update(options, params);
        },
        fetchCardHolderPreferencesDeferred,
        fetchCardHolderPreferences = function(submissionId, applicationId, deferred) {
          var options = {
            url: "submissions/" + submissionId + "/applications/" + applicationId + "/cardHolderPreferences",
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
        fetchBgContentIds: function(submissionId, payLoad) {
          fetchBgContentIdsDeferred = $.Deferred();
          fetchBgContentIds(submissionId, payLoad, fetchBgContentIdsDeferred);
          return fetchBgContentIdsDeferred;
        },
        updateCardHolderPreferences: function(submissionId, applicationId, payload) {
          updateCardHolderPreferencesDeferred = $.Deferred();
          updateCardHolderPreferences(submissionId, applicationId, payload, updateCardHolderPreferencesDeferred);
          return updateCardHolderPreferencesDeferred;
        },
        fetchCardHolderPreferences: function(submissionId, applicationId) {
          fetchCardHolderPreferencesDeferred = $.Deferred();
          fetchCardHolderPreferences(submissionId, applicationId, fetchCardHolderPreferencesDeferred);
          return fetchCardHolderPreferencesDeferred;
        }
      };
    };
  });
