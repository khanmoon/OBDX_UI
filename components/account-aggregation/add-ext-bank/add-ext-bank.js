define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/add-ext-bank",
    "text!./add-ext-bank.json",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojknockout",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojpagingcontrol"
], function(oj, ko, $, AddExtBankModel, locale) {
    "use strict";
    return function (params) {
      var self = this;
      self.bankName = ko.observable();
      self.banklist = null;
      self.tempcontent = null;
      self.previewLogo = ko.observable();
      self.imageId2 = ko.observable();
      self.isLogoExist = ko.observable(false);
      self.dataSourceCreated = ko.observable(false);
       ko.utils.extend(self, params.rootModel);
       self.mode = ko.observable();
       self.resourceBundle = locale;
       params.dashboard.headerName(self.resourceBundle.heading.addBank);
       self.dataprovider = ko.observableArray();
       params.baseModel.registerComponent("add-ext-bank-create", "account-aggregation");
       params.baseModel.registerComponent("add-ext-bank-review", "account-aggregation");

      self.create = function () {
           self.mode("CREATE");
           params.dashboard.loadComponent("add-ext-bank-create", {}, self);
       };

       self.reset = function () {
           self.bankName(null);
           self.dataSourceCreated(false);
       };

       self.getListBanks = function () {
         self.dataSourceCreated(false);
         AddExtBankModel.getBankList(self.bankName()).done(function (data) {
             var bankList = [];
             if(data.externalBankDTOs !== undefined){
               for (var i = 0; i < data.externalBankDTOs.length; i++) {
                 var statusValue = null;
                 if (data.externalBankDTOs[i].oauth_enabled){
                   statusValue = self.resourceBundle.labels.enabled;
                 } else{
                   statusValue = self.resourceBundle.labels.disabled;
                 }
                  data.externalBankDTOs = params.baseModel.sortLib(data.externalBankDTOs,["bankName"],["asc"]);
                    bankList.push({
                            bankLogo:data.externalBankDTOs[i].logo.value,
                            bankName: data.externalBankDTOs[i].bankName,
                            bankCode: data.externalBankDTOs[i].bankCode,
                            bankurl:data.externalBankDTOs[i].url,
                            status:statusValue,
                            enabledon:params.baseModel.formatDate(data.externalBankDTOs[i].enabledon)
                        });
              }
            }
              self.banklist = data;
              self.pagingDatasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(bankList, {idAttribute:  ["bankName"] }));
              self.dataSourceCreated(true);
           });
       };

       self.retrieveLogoImage1 = function (obj1) {
         if (obj1 !== null){
           AddExtBankModel.retrieveImage(obj1).done(function (data) {
               if (data && data.contentDTOList[0]) {
                  $("#"+obj1).attr("src", "data:image/gif;base64," + data.contentDTOList[0].content);
                 }
             });
           }
       };

       self.headerText = ko.observableArray([
         {"headerText":self.resourceBundle.labels.bankLogo,
            "renderer": oj.KnockoutTemplateUtils.getRenderer("bank_photo", true)},
           {"headerText":self.resourceBundle.labels.bankName,
             "renderer": oj.KnockoutTemplateUtils.getRenderer("bank_link", true)},
           {"headerText":self.resourceBundle.labels.bankurl,
                   "field":"bankurl"},
           {"headerText":self.resourceBundle.labels.status,
                   "field":"status"},
           {"headerText":self.resourceBundle.labels.enabledon,
                   "field":"enabledon"}
       ]);

       self.viewBankDetails = function (bankCode) {
         var selectedBank = {
          "bankCode": null,
          "bankName": null,
          "url": null,
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
          "oauth_enabled":false,
          "authorizationDetail":{
            "authurl": null,
            "tokenurl":null,
            "revokeurl":null,
            "client_id":null,
            "client_secret":null,
            "scope":null,
            "externalAPIs": []
          }
        };

          for (var i = 0; i < self.banklist.externalBankDTOs.length; i++) {
              if(self.banklist.externalBankDTOs[i].bankCode === bankCode){
                selectedBank = self.banklist.externalBankDTOs[i];
              }
            }
            var parameters = {
                 mode: "VIEW",
                 bankDetails: selectedBank
               };
             params.dashboard.loadComponent("add-ext-bank-review", parameters, self);
           };
         };
       });
