define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/add-ext-bank",
    "text!./add-ext-bank-create.json",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable",
    "ojs/ojvalidation",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojcheckboxset",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojvalidationgroup",
    "ojs/ojswitch"
], function (oj, ko, $, CreateBankmodel,locale,CreateExtBankJSON) {
    "use strict";
  return function (params) {
        var self = this, i;
        self.file = ko.observable();
        self.isLogoExist = ko.observable(false);
        self.isImageExist = ko.observable(false);
        self.preview = ko.observable();
        self.previewLogo = ko.observable();
        self.fileLogo = ko.observable();
        self.externalapiList = ko.observableArray();
        self.externalapiCount = ko.observable();
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;
        self.validationTracker = ko.observable();
        var getNewKoModel = function () {
            var KoModel = CreateBankmodel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.invalidTracker = ko.observable();
        self.mode = ko.observable("CREATE");
        self.externalapiCount = ko.observable();

        self.groupValid = ko.observable();
        self.tracker = ko.observable();
        self.mode = ko.observable();

        self.imageId2 = ko.observable(self.resourceBundle.labels.imageId2);
        self.fileId2 = ko.observable(self.resourceBundle.labels.fileId2);

        params.baseModel.registerComponent("image-upload", "goals");
        params.dashboard.headerName(self.resourceBundle.heading.addBank);
        params.baseModel.registerComponent("add-ext-bank-review", "account-aggregation");
        params.baseModel.registerComponent("add-ext-bank", "account-aggregation");
        params.baseModel.registerComponent("party-validate", "common");
        params.baseModel.registerComponent("review-rules-create", "approvals");
        params.baseModel.registerComponent("user-input", "common");
        params.baseModel.registerComponent("workflow-view", "approvals");

        var data = JSON.parse(CreateExtBankJSON);
        self.bankDataType=ko.observableArray();
        self.bankDataType1=ko.observableArray();
        var l;
        for(l = 0; l < data.mandatoryapi.length; l++) {
            self.bankDataType.push({
                "label":self.resourceBundle.labels[data.mandatoryapi[l].label],
                "value": data.mandatoryapi[l].value,
                "ismandatory": data.mandatoryapi[l].ismandatory,
                "priority":data.mandatoryapi[l].priority
            });
        }
        for(l = 0; l < data.apidropdown.length; l++) {
            self.bankDataType1.push({
                "label":self.resourceBundle.labels[data.apidropdown[l].label],
                "value": data.apidropdown[l].value,
                "ismandatory": data.apidropdown[l].ismandatory,
                "priority":data.apidropdown[l].priority
            });
        }
        if (self.params.editFromView && self.params.editFromView === true) {
            self.editFromView = ko.observable(true);
        } else {
            self.editFromView = ko.observable(false);
        }
        if (self.params && self.params.mode) {
            self.mode(self.params.mode);
        }

        self.switchEnabled = ko.observable(true);
        self.disabledState = ko.observable(true);

        if(self.mode()==="EDIT") {
            self.bankDetails = ko.mapping.fromJS(self.params.bankDetails);
              self.externalapiList = ko.observableArray();
                for(l = 0; l < data.apidropdownlength; l++) {
                  if (self.bankDataType < 1){
                    self.bankDataType.push({
                        "label":self.resourceBundle.labels[data.apidropdown[l].label],
                        "value": data.apidropdown[l].value,
                        "ismandatory": data.apidropdown[l].ismandatory,
                        "priority":data.apidropdown[l].priority
                    });
                }
                }
                for(l = 0; l < self.bankDetails.authorizationDetail.externalAPIs().length; l++) {
                    if(self.bankDetails.authorizationDetail.externalAPIs()[l] && self.bankDetails.authorizationDetail.externalAPIs()[l].api_url !== null) {
                        self.externalapiList.push(ko.mapping.fromJS({
                           "id":self.bankDetails.authorizationDetail.externalAPIs()[l].id,
                           "sequenceId": self.bankDetails.authorizationDetail.externalAPIs()[l].priority,
                            "api_url": self.bankDetails.authorizationDetail.externalAPIs()[l].api_url,
                            "api_name": self.bankDetails.authorizationDetail.externalAPIs()[l].api_name,
                              "ismandatory": self.bankDetails.authorizationDetail.externalAPIs()[l].ismandatory
                        }));
                    }
                }
          }else{
            self.externalapiList.removeAll();
            self.rootModelInstance = ko.observable(getNewKoModel());
            self.bankDetails = self.rootModelInstance().BankDetails;
            self.externalapiList.push(ko.mapping.fromJS({
              "id":null,
              "sequenceId": 1,
              "api_url": null,
              "api_name": null,
              "ismandatory":true


            }));
          }

          self.addRow = function(){
            self.externalapiCount(self.externalapiList().length+1);
            //Maximum 10 specification lables can be added for a bank
            if(self.externalapiCount() < 11){
              self.externalapiList.push(ko.mapping.fromJS({
                  "id":null,
                  "sequenceId": self.externalapiCount(),
                  "api_url": null,
                  "api_name": null,
                  "ismandatory":false

              }));
            }else{
              params.baseModel.showMessages(null, [self.resourceBundle.manageCategory.messages.specificationLimit], "ERROR");
            }
            self.onSwitchChange();
          };

          self.remove = function(data){
            self.externalapiList.splice(data,1).concat(self.externalapiList.slice(data+1));
            for(i=0; i < self.externalapiList().length; i++){
              self.externalapiList()[i].sequenceId(i+1);
            }
          };

          self.validateSpecification = {
            validate: function (value) {
              if (value) {
                var regex = new RegExp("^((http|https?):\/\/)+[a-zA-Z0-9\-\.]{2,}\.[a-zA-Z0-9:\/]{3,}(\.[a-zA-Z]{2,})?$");
                  if(!regex.test(value)) {
                    throw new oj.ValidatorError("", self.resourceBundle.messages.invalidExternalapiLabel);
                  }
                    if (value.length > 200) {
                        throw new oj.ValidatorError("", self.resourceBundle.messages.invalidExternalapiLabel);
                    }
                    for(i=0; i < self.externalapiList().length;i++) {
                        if(value === self.externalapiList()[i].api_url()) {
                            throw new oj.ValidatorError("", self.resourceBundle.messages.uniqueLabel);
                        }
                    }
                }
                return true;
            }
          };

          self.validateSpecificationapi = {
            validate: function (value) {
              if (value) {
                  var regex = new RegExp("^((http|https?):\/\/)+[a-zA-Z0-9\-\.]{2,}\.[a-zA-Z0-9:\/{}]{3,}(\.[a-zA-Z{}]{2,})?$");
                  if(!regex.test(value)) {
                    throw new oj.ValidatorError("", self.resourceBundle.messages.invalidExternalapiLabel);
                  }
                    if (value.length > 200) {
                        throw new oj.ValidatorError("", self.resourceBundle.messages.invalidExternalapiLabel);
                    }
                    for(i=0; i < self.externalapiList().length;i++) {
                        if(value === self.externalapiList()[i].api_url()) {
                            throw new oj.ValidatorError("", self.resourceBundle.messages.uniqueLabel);
                        }
                    }
                }
                return true;
            }
          };

      self.save = function () {
          var tracker = document.getElementById("tracker");
          if (tracker.valid === "valid") {
             if(document.getElementById(self.imageId2()) !== null) {
                 self.isImageExist(true);
                 self.isLogoExist(true);
             }else if(document.getElementById(self.imageId2()) === null){
                 self.preview(null);
                 self.previewLogo(null);
                 self.isImageExist(false);
                 self.isLogoExist(false);
                 self.bankDetails.logo.value(null);
                 self.bankDetails.logo.displayValue(null);
             }
             self.bankDetails.authorizationDetail.externalAPIs.removeAll();
             for(var j = 0; j < self.externalapiList().length; j++) {
                 if(self.externalapiList()[j].api_url() && self.externalapiList()[j].api_url() !== "") {
                     self.bankDetails.authorizationDetail.externalAPIs.push({
                         "id":null,
                         "priority": self.externalapiList()[j].sequenceId(),
                         "api_url": self.externalapiList()[j].api_url(),
                         "api_name": self.externalapiList()[j].api_name(),
                         "ismandatory": self.externalapiList()[j].ismandatory()

                     });
                 }
             }
             ko.tasks.runEarly();
             setTimeout(self.loadImage, 300);

             var parameters = {
                mode: "REVIEW",
                bankDetails: ko.mapping.toJS(self.bankDetails)
             };

              self.switchEnabled(true);
              params.dashboard.loadComponent("add-ext-bank-review", parameters, self);
          } else {
              tracker.showMessages();
              tracker.focusOn("@firstInvalidShown");
          }
        };

        self.backToView = function(){
              var parameters = {
                  mode: "VIEW",
                  bankDetails: ko.mapping.toJS(self.bankDetails)
              };
              params.dashboard.loadComponent("add-ext-bank-review", parameters, self);
        };

        self.back = function () {
              self.isLogoExist(false);
              self.isImageExist(false);
              params.dashboard.loadComponent("add-ext-bank", {}, self);
        };

        self.loadImage = function () {
            $().ready(function () {
                if (self.previewLogo()) {
                    $("#"+self.imageId2()).attr("src", self.previewLogo());
                }
            });
        };

        self.onSwitchChange = function() {
          if (!self.bankDetails.oauth_enabled()) {
            $("#authurl").prop({ disabled: true });
            $("#authurl").prop({ value: "" });

            $("#tokenurl").prop({ disabled: true });
            $("#tokenurl").prop({ value: "" });

            $("#revokeurl").prop({ disabled: true });
            $("#revokeurl").prop({ value: "" });

            $("#client_id").prop({ disabled: true });
            $("#client_id").prop({ value: "" });

            $("#client_secret").prop({ disabled: true });
            $("#client_secret").prop({ value: "" });

            $("#scope").prop({ disabled: true });
            $("#scope").prop({ value: "" });

            $("#addrowid").prop({ disabled: true });

            for(i=0; i < self.externalapiList().length;i++) {
              $("#externalapiType"+i).prop({ disabled: true });
              $("#externalapiType"+i).prop({ value: "" });
              $("#externalapiType"+i).selectedIndex = 0;
              $("#externalapiLabel"+i).prop({ disabled: true });
              $("#externalapiLabel"+i).prop({ value: "" });
            }
          } else {
              $("#authurl").prop({ disabled: false });
              $("#tokenurl").prop({ disabled: false });
              $("#revokeurl").prop({ disabled: false });
              $("#client_id").prop({ disabled: false });
              $("#client_secret").prop({ disabled: false });
              $("#scope").prop({ disabled: false });
              $("#externalapiType").prop({ disabled: false });
              $("#addrowid").prop({ disabled: false });

              for(i=0; i < self.externalapiList().length;i++) {
                $("#externalapiType"+i).prop({ disabled: false });
                $("#externalapiLabel"+i).prop({ disabled: false });
            }
          }
        };
        self.cancel = function () {
            params.dashboard.openDashBoard("message");

        };
      };
    });
