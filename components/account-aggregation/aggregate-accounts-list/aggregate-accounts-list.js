define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/aggregate-accounts-list",
  "text!./aggregate-accounts-list.json",
  "ojs/ojbutton"
], function(oj, ko, $, AddExtBankModel, locale) {
  "use strict";
  return function(params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.banklist = ko.observable();
    self.accountsList = [];
    self.mode = ko.observable();
    self.resourceBundle = locale;
    params.dashboard.headerName(self.resourceBundle.labels.linkAccount);
    self.delinkAccount = ko.observable(false);
    self.dataLoaded = ko.observable(false);
    var authURL = null;
    var client_id = null;
    var scope = null;
    var redirecturl = null;
    var reg = "reg";
    var unreg = "unreg";
    var message = "message";
    var token = "";
    var delinkid = null;

    params.baseModel.registerComponent("aggregate-register-accounts", "account-aggregation");
    params.baseModel.registerComponent("link-account-dashboard", "account-aggregation");
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerElement("modal-window");

    AddExtBankModel.fetchAccessToken().done(function(data) {
      token = data.accessTokenDTOs;
      $("#" + reg + data.state).prop({
        disabled: true
      });
      $("#" + unreg + data.state).prop({
        disabled: false
      });
      $("#" + message + data.state).show();
    });

    AddExtBankModel.getBankList().done(function(data) {
      if (data.externalBankDTOs !== undefined) {
        for (var i = 0; i < data.externalBankDTOs.length; i++) {
          if(token){
            for (var j = 0; j < token.length; j++) {
              if (data.externalBankDTOs[i].bankCode === token[j].bankCode) {
                self.delinkAccount(true);
              } else {
                self.delinkAccount(false);
              }
            }
          }else{
            self.delinkAccount(false);
          }
            if (data.externalBankDTOs[i].oauth_enabled === "true") {
              self.accountsList.push({
                bankLogo: data.externalBankDTOs[i].logo.value,
                bankName: data.externalBankDTOs[i].bankName,
                bankCode: data.externalBankDTOs[i].bankCode,
                registeraccount: data.externalBankDTOs[i].bankCode,
                unregisteraccount: data.externalBankDTOs[i].bankCode,
                isRegistered: data.externalBankDTOs[i].isRegistered,
                accountLinked: self.delinkAccount()
              });
            }
        }
      }
      self.banklist = data;
      self.dataLoaded(true);
    });

    self.retrieveLogoImage1 = function(obj1) {
      if (obj1 !== null) {
        AddExtBankModel.retrieveImage(obj1).done(function(data) {
          if (data && data.contentDTOList[0]) {
            $("#" + obj1).attr("src", "data:image/gif;base64," + data.contentDTOList[0].content);
          }
        });
      }
    };

    self.UnregisterBank = function(data) {
      delinkid = data;
      $("#confirmDialog").trigger("openModal");
    };

    self.confirm = function(){
      AddExtBankModel.deleteBank(delinkid).done(function(data, status, jqXhr) {
        self.httpStatus = jqXhr.status;
        var deleteSuccessMessage, deleteStatusMessages;

        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.resourceBundle.heading.registerAccount,
          summaryMessage: self.resourceBundle.labels.deleteSuccessMessage,
          deleteStatusMessages : self.resourceBundle.labels.completed,
          confirmScreenExtensions: {
            successMessage: deleteSuccessMessage,
            statusMessages: deleteStatusMessages,
            isSet: true,
            template: "confirm-screen/aggregate-account"
          }
        }, self);
      });
    };

    self.viewBankDetails = function(bankCode) {
      var selectedBank = {
        "bankCode": null,
        "bankName": null,
        "url": null,
        "bankIdentifier": null,
        "bankDomain": null,
        "address": {
          "line1": null,
          "line2": null,
          "line3": null,
          "city": null,
          "state": null,
          "country": null,
          "zipCode": null
        },
        "logo": {
          "value": null,
          "maskingQualifier": null,
          "maskingAttribute": null,
          "indirectionType": null,
          "displayValue": null
        },
        "isRegistered": false,
        "oauth_enabled": false,
        "authorizationDetail": {
          "authurl": null,
          "tokenurl": null,
          "revokeurl": null,
          "redirecturl": null,
          "client_id": null,
          "client_secret": null,
          "externalAPIs": []
        }
      };
      for (var i = 0; i < self.banklist.externalBankDTOs.length; i++) {
        if (self.banklist.externalBankDTOs[i].bankCode === bankCode) {
          selectedBank = self.banklist.externalBankDTOs[i];
        }
      }
      authURL = selectedBank.authorizationDetail.authurl;
      client_id = selectedBank.authorizationDetail.client_id;
      scope = selectedBank.authorizationDetail.scope;
      redirecturl = selectedBank.authorizationDetail.redirecturl;

      var request = {
        "redirectUrl": redirecturl,
        "bankCode": selectedBank.bankCode,
        "clientId": client_id,
        "state": "",
        "status": "I",
        "oauthUrl": authURL,
        "userId": "",
        "apiUrl": "",
        "determinantValue": null,
        "dateTime": ""
      };
      AddExtBankModel.createState(ko.mapping.toJSON(request)).done(function(data) {

        var _loc;
        _loc = authURL + "&client_id=" + client_id + "&scope=" + scope + "&state=" + data.userState.state + "&redirect_uri=" + redirecturl;
        location.href = _loc;
      });
    };

    self.CancelButton = function() {
      params.dashboard.loadComponent("link-account-dashboard", {}, self);
    };

  };
});
