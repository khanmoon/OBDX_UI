define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ViewLCDetailsModel = function() {
    var baseService = BaseService.getInstance();
    var Model = function() {
      this.ModifyContractModel = {
        "attachedDocuments": [],
        "deletedDocuments": [],
        "counterPartyName": null,
        "amount": {
          "currency": null,
          "amount": null
        }
      };
    };
    var modifyContractDeferred, modifyContract = function(letterOfCreditId, model, deferred) {
        var options = {
            url: "letterofcredits/{letterOfCreditId}/documents",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          },
          params = {
            "letterOfCreditId": letterOfCreditId
          };
        baseService.update(options, params);
      },
      getLCBillsDeferred, getLCBills = function(letterOfCreditId, deferred) {
        var options = {
            url: "letterofcredits/{letterOfCreditId}/bills",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "letterOfCreditId": letterOfCreditId
          };
        baseService.fetch(options, params);
      },
      getGuaranteesDeferred, getGuarantees = function(letterOfCreditId, deferred) {
        var options = {
            url: "letterofcredits/{letterOfCreditId}/guarentees",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "letterOfCreditId": letterOfCreditId
          };
        baseService.fetch(options, params);
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
      fetchProductDeferred, fetchProduct = function(productID, deferred) {
        var params = {
            "productId": productID
          },
          options = {
            url: "products/letterofcredits/{productId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchIncotermDeferred, fetchIncoterm = function(code, deferred) {
        var options = {
          url: "letterofcredits/incoterms?code=" + code,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
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
      fetchBranchDeferred, fetchBranch = function(deferred) {
        var options = {
          url: "locations/country/all/city/all/branchCode/",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getAccountDetailDeferred, getAccountDetail = function(accountId, deferred) {
        var params = {
            "accountId": accountId
          },
          options = {
            url: "accounts/demandDeposit/{accountId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
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
      getAmmendmentsDeferred, getAmendments = function(letterOfCreditId, deferred) {
        var options = {
            url: "letterofcredits/{letterOfCreditId}/amendments",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "letterOfCreditId": letterOfCreditId
          };
        baseService.fetch(options, params);
      },
      getAmmendmentDetailsDeferred, getAmendmentDetails = function(letterOfCreditId, amendmentId, deferred) {
        var options = {
            url: "letterofcredits/{letterOfCreditId}/amendments/{amendmentId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "letterOfCreditId": letterOfCreditId,
            "amendmentId": amendmentId
          };
        baseService.fetch(options, params);
      },
      getImportLCDeferred, getImportLC = function(letterOfCreditId, versionNo, deferred) {
        var options = {
            url: "letterofcredits/{letterOfCreditId}?versionNo=" + versionNo,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "letterOfCreditId": letterOfCreditId
          };
        baseService.fetch(options, params);
      },
      getAdviceDetailsDeferred, getAdviceDetails = function(letterOfCreditId, adviceId, deferred) {
        var options = {
            url: "letterofcredits/{letterOfCreditId}/advices/{adviceId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "letterOfCreditId": letterOfCreditId,
            "adviceId": adviceId
          };
        baseService.fetch(options, params);
      },
      getSwiftDetailsDeferred, getSwiftDetails = function(letterOfCreditId, swiftId, deferred) {
        var options = {
            url: "letterofcredits/{letterOfCreditId}/swiftMessages/{swiftId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "letterOfCreditId": letterOfCreditId,
            "swiftId": swiftId
          };
        baseService.fetch(options, params);
      },
      getChargesDetailsDeferred, getChargesDetails = function(letterOfCreditId, deferred) {
        var params = {
            "letterOfCreditId": letterOfCreditId
          },
          options = {
            url: "letterofcredits/{letterOfCreditId}/charges",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchAdvicePDFDeferred, fetchAdvicePDF = function(letterOfCreditId, adviceId) {
        var options = {
          url: "letterofcredits/" + letterOfCreditId + "/advices/" + adviceId + "?media=application/pdf"
        };
        baseService.downloadFile(options);
      },
      fetchSwiftPDFDeferred, fetchSwiftPDF = function(letterOfCreditId, swiftId) {
        var options = {
          url: "letterofcredits/" + letterOfCreditId + "/swiftMessages/" + swiftId + "?media=application/pdf"
        };
        baseService.downloadFile(options);
      },
      getBillDetailsDeferred, getBillDetails = function(billNo, deferred) {
        var params = {
            "billReferenceNo": billNo
          },
          options = {
            url: "bills/{billReferenceNo}",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      modifyContract: function(letterOfCreditId, model) {
        modifyContractDeferred = $.Deferred();
        modifyContract(letterOfCreditId, model, modifyContractDeferred);
        return modifyContractDeferred;
      },
      fetchPartyDetails: function(partyID) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyID, fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      fetchAdvicePDF: function(letterOfCreditId, adviceId) {
        fetchAdvicePDFDeferred = $.Deferred();
        fetchAdvicePDF(letterOfCreditId, adviceId, fetchAdvicePDFDeferred);
        return fetchAdvicePDFDeferred;
      },
      fetchSwiftPDF: function(letterOfCreditId, swiftId) {
        fetchSwiftPDFDeferred = $.Deferred();
        fetchSwiftPDF(letterOfCreditId, swiftId, fetchSwiftPDFDeferred);
        return fetchSwiftPDFDeferred;
      },
      getImportLC: function(letterOfCreditId, versionNo) {
        getImportLCDeferred = $.Deferred();
        getImportLC(letterOfCreditId, versionNo, getImportLCDeferred);
        return getImportLCDeferred;
      },
      fetchProduct: function(productID) {
        fetchProductDeferred = $.Deferred();
        fetchProduct(productID, fetchProductDeferred);
        return fetchProductDeferred;
      },
      fetchIncoterm: function(code) {
        fetchIncotermDeferred = $.Deferred();
        fetchIncoterm(code, fetchIncotermDeferred);
        return fetchIncotermDeferred;
      },
      fetchBeniCountry: function() {
        fetchBeniCountryDeferred = $.Deferred();
        fetchBeniCountry(fetchBeniCountryDeferred);
        return fetchBeniCountryDeferred;
      },
      fetchBranch: function() {
        fetchBranchDeferred = $.Deferred();
        fetchBranch(fetchBranchDeferred);
        return fetchBranchDeferred;
      },
      getAccountDetail: function(accountId) {
        getAccountDetailDeferred = $.Deferred();
        getAccountDetail(accountId, getAccountDetailDeferred);
        return getAccountDetailDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      },
      getAmendments: function(letterOfCreditId) {
        getAmmendmentsDeferred = $.Deferred();
        getAmendments(letterOfCreditId, getAmmendmentsDeferred);
        return getAmmendmentsDeferred;
      },
      getAmendmentDetails: function(letterOfCreditId, amendmentId) {
        getAmmendmentDetailsDeferred = $.Deferred();
        getAmendmentDetails(letterOfCreditId, amendmentId, getAmmendmentDetailsDeferred);
        return getAmmendmentDetailsDeferred;
      },
      getAdviceDetails: function(letterOfCreditId, adviceId) {
        getAdviceDetailsDeferred = $.Deferred();
        getAdviceDetails(letterOfCreditId, adviceId, getAdviceDetailsDeferred);
        return getAdviceDetailsDeferred;
      },
      getSwiftDetails: function(letterOfCreditId, swiftId) {
        getSwiftDetailsDeferred = $.Deferred();
        getSwiftDetails(letterOfCreditId, swiftId, getSwiftDetailsDeferred);
        return getSwiftDetailsDeferred;
      },
      getLCBills: function(letterOfCreditId) {
        getLCBillsDeferred = $.Deferred();
        getLCBills(letterOfCreditId, getLCBillsDeferred);
        return getLCBillsDeferred;
      },
      getBillDetails: function(billNo) {
        getBillDetailsDeferred = $.Deferred();
        getBillDetails(billNo, getBillDetailsDeferred);
        return getBillDetailsDeferred;
      },
      getGuarantees: function(letterOfCreditId) {
        getGuaranteesDeferred = $.Deferred();
        getGuarantees(letterOfCreditId, getGuaranteesDeferred);
        return getGuaranteesDeferred;
      },
      getChargesDetails: function(letterOfCreditId) {
        getChargesDetailsDeferred = $.Deferred();
        getChargesDetails(letterOfCreditId, getChargesDetailsDeferred);
        return getChargesDetailsDeferred;
      }
    };
  };
  return new ViewLCDetailsModel();
});