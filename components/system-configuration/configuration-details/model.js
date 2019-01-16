define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var SystemConfigurationDetails = function() {
    var Model = function() {
      this.serverName = null;
        this.fromEmailAddress = null;
        this.port = null;
        this.recipientAddress = null;
        this.userName = null;
        this.password = null;
        this.authenticationFlag = null;
    };

    var Deferred, fireUrl = function(url, deferred) {
      var options = {
        url: url,
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };

    var validateHostConnectivityDeferred, validateHostConnectivity = function(gatewayIp, port, hostName, deferred) {
      var options = {
          url: "extConnection/validate/{gatewayIp}/{port}?hostName={hostName}",
          showMessage: false,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        },
        params = {
          gatewayIp: gatewayIp,
          port: port,
          hostName: hostName
        };
      baseService.fetch(options, params);
    };

    var validateSmtpServerConnectivityDeferred, validateSmtpServerConnectivity = function(payload, deferred) {
      var options = {
        url: "extConnection/validate/smtpServer",
        showMessage: false,
        data: payload,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        }
      };
      baseService.add(options);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      fireUrl: function(url) {
        Deferred = $.Deferred();
        fireUrl(url, Deferred);
        return Deferred;
      },
      validateHostConnectivity: function(gatewayIp, port, hostName) {
        validateHostConnectivityDeferred = $.Deferred();
        validateHostConnectivity(gatewayIp, port, hostName, validateHostConnectivityDeferred);
        return validateHostConnectivityDeferred;
      },
      validateSmtpServerConnectivity: function(payload) {
        validateSmtpServerConnectivityDeferred = $.Deferred();
        validateSmtpServerConnectivity(payload, validateSmtpServerConnectivityDeferred);
        return validateSmtpServerConnectivityDeferred;
      }

    };
  };
  return new SystemConfigurationDetails();
});