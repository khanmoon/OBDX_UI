define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for SupplementaryCard section
   *
   * @namespace SupplementaryCard~SupplementaryCardModel
   * @class
   */
  var CourierAddressModel = function() {
    /**
     * Model file for My accounts section. This file contains the model definition
     * for Myaccounts requirements section and exports the UserAccounts model which can be used
     * as a component in any form in which user's accounts information are required.
     *
     * @namespace myAccounts~UserAccountsModel
     */
    var params, baseService = BaseService.getInstance();
    /**
     * Method to fetch Accounts information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    var fetchAddressTypeDeferred, fetchAddressType = function(deferred) {
      params = {};
      var options = {
        url: "enumerations/addressType",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };
    /**
     * Method to fetch Accounts information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    var fetchCityDeferred, fetchCity = function(countryCode, deferred) {
      params = {
        "countryCode": countryCode
      };
      var options = {
        url: "locations/country/{countryCode}/city",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };
    /**
     * Method to fetch Accounts information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    var fetchBranchesDeferred, fetchBranches = function(country, city, deferred) {
      params = {
        "countryname": country,
        "city": city
      };
      var options = {
        url: "locations/country/{countryname}/city/{city}/branchCode/",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };
    /**
     * Method to fetch Accounts information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    var fetchAddressListDeferred, fetchAddressList = function(partyId, deferred) {
      params = {
        "partyId": partyId
      };
      var options = {
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };
    /**
     * Method to fetch Accounts information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    var fetchCountriesDeferred, fetchCountries = function(deferred) {
      params = {};
      var options = {
        url: "locations/country",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };
    /**
     * Method to fetch Accounts information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    var fetchStateDeferred, fetchState = function(countryCode, deferred) {
      params = {
        "countryCode": countryCode
      };
      var options = {
        url: "locations/country/{countryCode}/city",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };
    /**
     * Method to fetch Accounts information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    var fetchAddressDeferred, fetchAddress = function(branchCode, deferred) {
      params = {
        "branchCode": branchCode
      };
      var options = {
        url: "locations/branches?branchCode={branchCode}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };
    /**
     * Method to fetch Accounts information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    var fetchCourierAddressDeferred, fetchCourierAddress = function(addressType, deferred) {
      var options = {

        url: "me/party",
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
      fetchCourierAddress: function(addressType) {
        fetchCourierAddressDeferred = $.Deferred();
        fetchCourierAddress(addressType, fetchCourierAddressDeferred);
        return fetchCourierAddressDeferred;
      },
      fetchAddress: function(branchCode) {
        fetchAddressDeferred = $.Deferred();
        fetchAddress(branchCode, fetchAddressDeferred);
        return fetchAddressDeferred;
      },
      fetchCity: function(countryCode) {
        fetchCityDeferred = $.Deferred();
        fetchCity(countryCode, fetchCityDeferred);
        return fetchCityDeferred;
      },
      fetchAddressType: function() {
        fetchAddressTypeDeferred = $.Deferred();
        fetchAddressType(fetchAddressTypeDeferred);
        return fetchAddressTypeDeferred;
      },
      fetchBranches: function(country, city) {
        fetchBranchesDeferred = $.Deferred();
        fetchBranches(country, city, fetchBranchesDeferred);
        return fetchBranchesDeferred;
      },
      fetchAddressList: function() {
        fetchAddressListDeferred = $.Deferred();
        fetchAddressList(fetchAddressListDeferred);
        return fetchAddressListDeferred;
      },
      fetchCountries: function() {
        fetchCountriesDeferred = $.Deferred();
        fetchCountries(fetchCountriesDeferred);
        return fetchCountriesDeferred;
      },
      fetchState: function(countryCode) {
        fetchStateDeferred = $.Deferred();
        fetchState(countryCode, fetchStateDeferred);
        return fetchStateDeferred;
      }
    };
  };
  return new CourierAddressModel();
});