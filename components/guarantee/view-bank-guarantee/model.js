define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var ViewBankGuaranteeModel = function() {
    var Model = function() {
      this.ModifyContractModel = {
        "attachedDocuments": [],
        "deletedDocuments": [],
        "beneName": null,
        "contractAmount": {
          "currency": null,
          "amount": null
        }
      };
    };
    var modifyContractDeferred, modifyContract = function(bankGuaranteeId, model, deferred) {
        var options = {
            url: "bankguarantees/{bankGuaranteeId}/documents",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          },
          params = {
            "bankGuaranteeId": bankGuaranteeId
          };
        baseService.update(options, params);
      },
      fetchGuranteeTypeDeferred, fetchGuranteeType = function(deferred) {
        var options = {
          url: "bankguarantees/types",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchProductNameDeferred, fetchProductName = function(productId, deferred) {
        var options = {
            url: "products/bankguarantees/{productId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "productId": productId
          };
        baseService.fetch(options, params);
      },
      fetchBranchDeferred, fetchBranch = function(deferred) {
        var options = {
          url: "locations/country/all/city/all/branchCode/",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchPartyDetailsDeferred, fetchPartyDetails = function(partyID, deferred) {
        var params = {
            "partyId": partyID
          },
          options = {
            url: "me/party/relations/{partyId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      getAmmendmentsDeferred, getAmendments = function(bankGuaranteeId, deferred) {
        var options = {
            url: "bankguarantees/{bankGuaranteeId}/amendments",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "bankGuaranteeId": bankGuaranteeId
          };
        baseService.fetch(options, params);
      },
      getAmmendmentDetailsDeferred, getAmendmentDetails = function(bankGuaranteeId, amendmentId, deferred) {
        var options = {
            url: "bankguarantees/{bankGuaranteeId}/amendments/{amendmentId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "bankGuaranteeId": bankGuaranteeId,
            "amendmentId": amendmentId
          };
        baseService.fetch(options, params);
      },
      fetchBeniCountryDeferred, fetchBeniCountry = function(deferred) {
        var options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getBankDetailsBICDeferred, getBankDetailsBIC = function(code, deferred) {
        var options = {
            url: "financialInstitution/bicCodeDetails/{BICCode}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "BICCode": code
          };
        baseService.fetch(options, params);
      },
      getAdviceDetailsDeferred, getAdviceDetails = function(bankGuaranteeId, dcnNo, deferred) {
        var options = {
            url: "bankguarantees/{bankGuaranteeId}/advices/{dcnNo}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "bankGuaranteeId": bankGuaranteeId,
            "dcnNo": dcnNo
          };
        baseService.fetch(options, params);
      },
      getSwiftDetailsDeferred, getSwiftDetails = function(bankGuaranteeId, dcnNo, deferred) {
        var options = {
            url: "bankguarantees/{bankGuaranteeId}/swiftMessages/{dcnNo}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "bankGuaranteeId": bankGuaranteeId,
            "dcnNo": dcnNo
          };
        baseService.fetch(options, params);
      },
      fetchAdvicePDFDeferred, fetchAdvicePDF = function(bankGuaranteeId, dcnNo) {
        var options = {
          url: "bankguarantees/" + bankGuaranteeId + "/advices/" + dcnNo + "?media=application/pdf"
        };
        baseService.downloadFile(options);
      },
      fetchSwiftPDFDeferred, fetchSwiftPDF = function(bankGuaranteeId, dcnNo) {
        var options = {
          url: "bankguarantees/" + bankGuaranteeId + "/swiftMessages/" + dcnNo + "?media=application/pdf"
        };
        baseService.downloadFile(options);
      },
      getChargesDetailsDeferred, getChargesDetails = function(bankGuaranteeId, deferred) {
        var params = {
            "bankGuaranteeId": bankGuaranteeId
          },
          options = {
            url: "bankguarantees/{bankGuaranteeId}/charges",
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
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      modifyContract: function(bankGuaranteeId, model) {
        modifyContractDeferred = $.Deferred();
        modifyContract(bankGuaranteeId, model, modifyContractDeferred);
        return modifyContractDeferred;
      },
      fetchProductName: function(productId) {
        fetchProductNameDeferred = $.Deferred();
        fetchProductName(productId, fetchProductNameDeferred);
        return fetchProductNameDeferred;
      },
      fetchGuranteeType: function() {
        fetchGuranteeTypeDeferred = $.Deferred();
        fetchGuranteeType(fetchGuranteeTypeDeferred);
        return fetchGuranteeTypeDeferred;
      },
      fetchAdvicePDF: function(bankGuaranteeId, dcnNo) {
        fetchAdvicePDFDeferred = $.Deferred();
        fetchAdvicePDF(bankGuaranteeId, dcnNo, fetchAdvicePDFDeferred);
        return fetchAdvicePDFDeferred;
      },
      fetchSwiftPDF: function(bankGuaranteeId, dcnNo) {
        fetchSwiftPDFDeferred = $.Deferred();
        fetchSwiftPDF(bankGuaranteeId, dcnNo, fetchSwiftPDFDeferred);
        return fetchSwiftPDFDeferred;
      },
      fetchBranch: function() {
        fetchBranchDeferred = $.Deferred();
        fetchBranch(fetchBranchDeferred);
        return fetchBranchDeferred;
      },
      getAdviceDetails: function(bankGuaranteeId, dcnNo) {
        getAdviceDetailsDeferred = $.Deferred();
        getAdviceDetails(bankGuaranteeId, dcnNo, getAdviceDetailsDeferred);
        return getAdviceDetailsDeferred;
      },
      getSwiftDetails: function(bankGuaranteeId, dcnNo) {
        getSwiftDetailsDeferred = $.Deferred();
        getSwiftDetails(bankGuaranteeId, dcnNo, getSwiftDetailsDeferred);
        return getSwiftDetailsDeferred;
      },
      fetchPartyDetails: function(partyID) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyID, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      getChargesDetails: function(bankGuaranteeId) {
        getChargesDetailsDeferred = $.Deferred();
        getChargesDetails(bankGuaranteeId, getChargesDetailsDeferred);
        return getChargesDetailsDeferred;
      },
      fetchBeniCountry: function() {
        fetchBeniCountryDeferred = $.Deferred();
        fetchBeniCountry(fetchBeniCountryDeferred);
        return fetchBeniCountryDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      },
      getAmendments: function(bankGuaranteeId) {
        getAmmendmentsDeferred = $.Deferred();
        getAmendments(bankGuaranteeId, getAmmendmentsDeferred);
        return getAmmendmentsDeferred;
      },
      getAmendmentDetails: function(bankGuaranteeId, amendmentId) {
        getAmmendmentDetailsDeferred = $.Deferred();
        getAmendmentDetails(bankGuaranteeId, amendmentId, getAmmendmentDetailsDeferred);
        return getAmmendmentDetailsDeferred;
      }
    };
  };
  return new ViewBankGuaranteeModel();
});
