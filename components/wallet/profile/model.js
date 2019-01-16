define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  var PartyModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),
      params;
    var Model = function() {
      this.editProfileDTO = {
        firstName: "",
        lastName: ""
      };
    };
    var getWalletDeferred, getWallet = function(deferred) {
      var options = {
        url: "wallets/me",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options);
    };
    var fetchLastLoginTimeDeferred, fetchLastLoginTime = function(deferred) {
      var options = {
        url: "me",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };
    var editProfileDeferred, editProfile = function(vWalletId, editProfileDTO, deferred) {
      var options = {
          url: "wallets/{walletId}/profile",
          data: editProfileDTO,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          "walletId": vWalletId
        };
      baseService.update(options, params);
    };
    return {
      getNewModel: function() {
        return new Model();
      },
      fetchLastLoginTime: function() {
        fetchLastLoginTimeDeferred = $.Deferred();
        fetchLastLoginTime(fetchLastLoginTimeDeferred);
        return fetchLastLoginTimeDeferred;
      },
      getWallet: function() {
        getWalletDeferred = $.Deferred();
        getWallet(getWalletDeferred);
        return getWalletDeferred;
      },
      editProfile: function(walletId, editProfileDTO) {
        editProfileDeferred = $.Deferred();
        editProfile(walletId, editProfileDTO, editProfileDeferred);
        return editProfileDeferred;
      }
    };
  };
  return new PartyModel();
});
