define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/biller-onboarding",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojcheckboxset",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojvalidationgroup"
], function(oj, ko, $, BillerCreateModel, locale) {
    "use strict";
    return function (params) {
        var self = this,i;

        self.paymentsAllowed = ko.observableArray([]);
        self.paymentMethods = ko.observableArray([]);
        self.file = ko.observable();
        self.isLogoExist = ko.observable(false);
        self.isImageExist = ko.observable(false);
        self.preview = ko.observable();
        self.previewLogo = ko.observable();
        self.fileLogo = ko.observable();
        self.specificationsList = ko.observableArray();
        self.specificationCount = ko.observable(1);

        ko.utils.extend(self, params.rootModel);
        self.displaySampleImage = ko.observable(true);
        self.resourceBundle = locale;
        self.invalidTracker = ko.observable();
        self.mode = ko.observable("CREATE");
        self.imageId1 =ko.observable(self.resourceBundle.labels.imageId1);
        self.imageId2 = ko.observable(self.resourceBundle.labels.imageId2);
        self.fileId1 = ko.observable(self.resourceBundle.labels.fileId1);
        self.fileId2 = ko.observable(self.resourceBundle.labels.fileId2);

        self.autoPayDisabled = ko.observable(false);
        self.groupValid = ko.observable();
        self.tracker = ko.observable();
        self.numberConverter = ko.observable({"type": "number",
            "options": {
            "style":"decimal"
        }});
        params.baseModel.registerComponent("image-upload", "goals");
        params.dashboard.headerName(self.resourceBundle.heading.billerOnboarding);
        params.baseModel.registerComponent("review-biller", "biller-maintenance");
        params.baseModel.registerComponent("manage-category", "biller-maintenance");
        params.baseModel.registerComponent("biller-search", "biller-maintenance");
        self.billerTypes = ko.observableArray([
            {label:self.resourceBundle.labels.PRESENTMENT,
              value: "PRESENTMENT"},
            {label:self.resourceBundle.labels.PAYMENT,
              value: "PAYMENT"},
            {label:self.resourceBundle.labels.PRESENTMENT_PAYMENT,
              value: "PRESENTMENT_PAYMENT"},
            {label:self.resourceBundle.labels.RECHARGE,
              value: "RECHARGE"}
        ]);
        self.billerStatus = ko.observableArray([
            {label:self.resourceBundle.labels.ACTIVE,
              value: "ACTIVE"},
            {label:self.resourceBundle.labels.INACTIVE,
              value: "INACTIVE"}
        ]);

        self.billerDataType=ko.observableArray([
            {label:self.resourceBundle.billerSpecification.TEXT,
                value: "TEXT"},
            {label:self.resourceBundle.billerSpecification.NUMERIC,
                value: "NUMERIC"},
            {label:self.resourceBundle.billerSpecification.ALPHANUMERIC,
                value: "ALPHANUMERIC"},
            {label:self.resourceBundle.billerSpecification.DATE,
                value: "DATE"}
        ]);

        self.specificationRequired=ko.observableArray([
          {label:self.resourceBundle.billerSpecification.MANDATORY,
          value: "MANDATORY"},
          {label:self.resourceBundle.billerSpecification.OPTIONAL,
          value: "OPTIONAL"}]);

        self.billerCategoryList = ko.observableArray([]);
        self.currencyList = ko.observableArray([]);
        self.countryList = ko.observableArray([]);


        self.dropdownListLoaded = {
            categories: ko.observable(false),
            currency: ko.observable(false),
            country: ko.observable(false),
            paymentMethods: ko.observable(false)
        };
        self.paymentsAllowedValues = {
            presentment: ko.observable(false),
            payment: ko.observable(false),
            presentmentPayment: ko.observable(false),
            recharge: ko.observable(false)
        };
        self.paymentMethodsList = ko.observableArray([]);
        self.dataLoaded = ko.computed(function () {
            return self.dropdownListLoaded.categories() && self.dropdownListLoaded.currency() && self.dropdownListLoaded.country() && self.dropdownListLoaded.paymentMethods();
        });

        self.fetchData = function() {
            BillerCreateModel.fetchCategory().done(function (data) {
                self.billerCategoryList(data.categoryDTOs);
                self.dropdownListLoaded.categories(true);
            });
            BillerCreateModel.fetchCurrency().done(function (data) {
                self.currencyList(data.currencyList);
                self.dropdownListLoaded.currency(true);
            });
            BillerCreateModel.fetchPaymentMethods().done(function (data) {
                self.paymentMethodsList(data.enumRepresentations[0].data);
                self.dropdownListLoaded.paymentMethods(true);
            });
            BillerCreateModel.fetchCountry().done(function (data) {
                for(i = 0; i < data.enumRepresentations[0].data.length; i++) {
                  if(!data.enumRepresentations[0].data[i].description) {
                        data.enumRepresentations[0].data[i].description = data.enumRepresentations[0].data[i].code;
                    }
                }
                self.countryList(data.enumRepresentations[0].data);
                self.dropdownListLoaded.country(true);
            });
        };

        self.typeChangedHandler = function () {
            self.setPaymentOptions();
            self.paymentsAllowed.removeAll();
            self.billerDetails().paymentOptions.partPayment(false);
            self.billerDetails().paymentOptions.excessPayment(false);
            self.billerDetails().paymentOptions.latePayment(false);
            self.billerDetails().paymentOptions.quickBillPayment(false);
            self.billerDetails().paymentOptions.quickRecharge(false);
            self.billerDetails().paymentOptions.autoPayBufferDays(null);
        };

        self.setPaymentOptions = function(){
          if(self.billerDetails().type() === "RECHARGE" || self.billerDetails().type() === "PAYMENT") {
              if(self.billerDetails().type() === "RECHARGE") {
                  self.paymentsAllowedValues.payment(false);
                  self.paymentsAllowedValues.presentment(false);
                  self.paymentsAllowedValues.presentmentPayment(false);
                  self.paymentsAllowedValues.recharge(true);
              }
              if(self.billerDetails().type() === "PAYMENT") {
                  self.paymentsAllowedValues.payment(true);
                  self.paymentsAllowedValues.presentment(false);
                  self.paymentsAllowedValues.presentmentPayment(false);
                  self.paymentsAllowedValues.recharge(false);
              }
              self.displaySampleImage(false);
              self.autoPayDisabled(true);

          } else if(self.billerDetails().type() === "PRESENTMENT" || self.billerDetails().type() === "PRESENTMENT_PAYMENT") {
              if(self.billerDetails().type() === "PRESENTMENT") {
                  self.paymentsAllowedValues.presentment(true);
                  self.paymentsAllowedValues.payment(false);
                  self.paymentsAllowedValues.presentmentPayment(false);
                  self.paymentsAllowedValues.recharge(false);
              }
              if(self.billerDetails().type() === "PRESENTMENT_PAYMENT") {
                  self.paymentsAllowedValues.presentmentPayment(true);
                  self.paymentsAllowedValues.presentment(false);
                  self.paymentsAllowedValues.payment(false);
                  self.paymentsAllowedValues.recharge(false);
              }
              self.displaySampleImage(true);
              self.autoPayDisabled(false);
          }
        };
        self.backToView = function(){
          BillerCreateModel.getBillerDetails(self.billerDetails().id()).done(function (data) {
              var parameters = {
                  mode: "VIEW",
                  billerDetails: data.biller
              };
              params.dashboard.loadComponent("review-biller", parameters, self);
          });
        };

        self.back = function () {
              self.isLogoExist(false);
              self.isImageExist(false);
              self.paymentsAllowed([]);
              self.paymentMethods([]);
              self.specificationsList([]);
              params.dashboard.loadComponent("biller-search", {}, self);
        };

        self.manageCategory = function () {
          params.dashboard.loadComponent("manage-category", {}, self);
        };
        var getNewKoModel = function () {
            var billercreatemodel = ko.mapping.fromJS(BillerCreateModel.getNewModel());
            return billercreatemodel;
        };
        if (self.params.editFromView && self.params.editFromView === true) {
            self.editFromView = ko.observable(true);
        } else {
            self.editFromView = ko.observable(false);
        }
        if (self.params && self.params.mode) {
            self.mode(self.params.mode);
        }
        self.fetchData();
        if(self.mode()==="EDIT") {
            self.billerDetails = ko.observable(ko.mapping.fromJS(self.params.billerDetails));
            if(self.editFromView()) {
                self.specificationsList = ko.observableArray();
                self.billerDataType=ko.observableArray([
                    {label:self.resourceBundle.billerSpecification.TEXT,
                        value: "TEXT"},
                    {label:self.resourceBundle.billerSpecification.NUMERIC,
                        value: "NUMERIC"},
                    {label:self.resourceBundle.billerSpecification.ALPHANUMERIC,
                        value: "ALPHANUMERIC"},
                    {label:self.resourceBundle.billerSpecification.DATE,
                        value: "DATE"}
                ]);
                self.specificationRequired=ko.observableArray([
                    {label:self.resourceBundle.billerSpecification.MANDATORY,
                        value: "MANDATORY"},
                    {label:self.resourceBundle.billerSpecification.OPTIONAL,
                        value: "OPTIONAL"}
                ]);
                for(var l = 0; l < self.billerDetails().specifications().length; l++) {
                    if(self.billerDetails().specifications()[l] && self.billerDetails().specifications()[l].label !== null) {
                        self.specificationsList.push(ko.mapping.fromJS({
                            "id":null,
                            "sequenceId": self.billerDetails().specifications()[l].priority,
                            "label": self.billerDetails().specifications()[l].label,
                            "required":(self.billerDetails().specifications()[l].required === true || self.billerDetails().specifications()[l].required() === "MANDATORY") ? "MANDATORY" : "OPTIONAL",
                            "maxLength": self.billerDetails().specifications()[l].maxLength,
                            "datatype": self.billerDetails().specifications()[l].datatype,
                            "dataTypeRequired": false,
                            "optionalRequired": false,
                            "maxLengthRequired":true,
                            "disabled": false,
                            "minValue": 0
                        }));
                    }
                }
            }
            self.setPaymentOptions();
        } else {
          self.specificationsList.removeAll();
          self.billerDetails = ko.observable(getNewKoModel().BillerDetails);
          self.specificationsList.push(ko.mapping.fromJS({
            "id":null,
            "sequenceId": 1,
            "label": null,
            "required": "MANDATORY",
            "maxLength": null,
            "dataTypeRequired": false,
            "optionalRequired": false,
            "maxLengthRequired":true,
            "datatype": null,
            "disabled": true,
            "minValue": 1
          }));
        }
        self.loadImage = function () {
            $().ready(function () {
                if (self.preview()) {
                    $("#"+self.imageId1()).attr("src", self.preview());
                }
                if (self.previewLogo()) {
                    $("#"+self.imageId2()).attr("src", self.previewLogo());
                }
            });
        };

        self.addRow = function(){
          self.specificationCount(self.specificationsList().length+1);
          //Maximum 10 specification lables can be added for a biller
          if(self.specificationCount() < 11){
            self.specificationsList.push(ko.mapping.fromJS({
                "id":null,
                "sequenceId": self.specificationCount(),
                "label": null,
                "required": null,
                "maxLength": null,
                "dataTypeRequired": true,
                "optionalRequired": true,
                "maxLengthRequired":true,
                "datatype": null,
                "disabled": false,
                "minValue": 0
            }));
          }else{
            params.baseModel.showMessages(null, [self.resourceBundle.manageCategory.messages.specificationLimit], "ERROR");
          }
        };

        self.remove = function(data){
          self.specificationsList.splice(data,1).concat(self.specificationsList.slice(data+1));
          for(i=0; i < self.specificationsList().length; i++){
            self.specificationsList()[i].sequenceId(i+1);
          }
        };

        var validationTypeSubscription = self.billerDetails().validationType.subscribe(function(newValue) {
            if(newValue === "OFFLINE" || newValue === "AUTO")
                self.billerDetails().validationUrl(null);
        });
        var fileSubscription = self.file.subscribe(function(newValue) {
            if(newValue === "") {
                self.billerDetails().sampleBill.value(null);
                self.billerDetails().sampleBill.displayValue(null);
            }
        });
        var fileLogoSubscription = self.fileLogo.subscribe(function(newValue) {
            if(newValue === "") {
                self.billerDetails().logo.value(null);
                self.billerDetails().logo.displayValue(null);
            }
        });

        self.save = function() {
            var tracker = document.getElementById("tracker");
            if (tracker.valid === "valid") {
                if(self.paymentsAllowed().includes("PART")) {
                    self.billerDetails().paymentOptions.partPayment(true);
                }else{
                    self.billerDetails().paymentOptions.partPayment(false);
                }
                if(self.paymentsAllowed().includes("EXCESS")) {
                   self.billerDetails().paymentOptions.excessPayment(true);
                }else{
                  self.billerDetails().paymentOptions.excessPayment(false);
                }
                if(self.paymentsAllowed().includes("LATE")) {
                    self.billerDetails().paymentOptions.latePayment(true);
                }else{
                  self.billerDetails().paymentOptions.latePayment(false);
                }
                if(self.paymentsAllowed().includes("QUICK_PAY")) {
                    self.billerDetails().paymentOptions.quickBillPayment(true);
                }else{
                  self.billerDetails().paymentOptions.quickBillPayment(false);
                }
                if(self.paymentsAllowed().includes("QUICK_RECHARGE")) {
                    self.billerDetails().paymentOptions.quickRecharge(true);
                }else{
                  self.billerDetails().paymentOptions.quickRecharge(false);
                }
                self.billerDetails().paymentMethodsList.removeAll();
                for(i = 0; i < self.paymentMethods().length; i++) {
                    self.billerDetails().paymentMethodsList.push({
                        "id": null,
                        "payLimit": {
                            "minTransaction": {
                                "currency": null,
                                "amount": null
                            },
                            "maxTransaction": {
                                "currency": null,
                                "amount": null
                            }
                        },
                        "paymentType": self.paymentMethods()[i]
                    });
                }
                if (document.getElementById(self.imageId1()) === null && document.getElementById(self.imageId2()) !== null) {
                    self.preview(null);
                    self.isImageExist(false);
                    self.isLogoExist(true);
                    self.billerDetails().sampleBill.value(null);
                    self.billerDetails().sampleBill.displayValue(null);
                } else if(document.getElementById(self.imageId1()) !== null && document.getElementById(self.imageId2()) === null) {
                    self.previewLogo(null);
                    self.isImageExist(true);
                    self.isLogoExist(false);
                    self.billerDetails().logo.value(null);
                    self.billerDetails().logo.displayValue(null);
                } else if(document.getElementById(self.imageId1()) !== null && document.getElementById(self.imageId2()) !== null) {
                    self.isImageExist(true);
                    self.isLogoExist(true);
                }else if(document.getElementById(self.imageId1()) === null && document.getElementById(self.imageId2()) === null){
                    self.preview(null);
                    self.previewLogo(null);
                    self.isImageExist(false);
                    self.isLogoExist(false);
                    self.billerDetails().sampleBill.value(null);
                    self.billerDetails().logo.value(null);
                    self.billerDetails().sampleBill.displayValue(null);
                    self.billerDetails().logo.displayValue(null);
                }
                self.billerDetails().specifications.removeAll();
                for(var j = 0; j < self.specificationsList().length; j++) {
                    if(self.specificationsList()[j].label() && self.specificationsList()[j].label() !== "") {
                        self.billerDetails().specifications.push({
                            "id":null,
                            "priority": self.specificationsList()[j].sequenceId(),
                            "label": self.specificationsList()[j].label(),
                            "required": self.specificationsList()[j].required(),
                            "maxLength":self.specificationsList()[j].maxLength(),
                            "datatype": self.specificationsList()[j].datatype()
                        });
                    }
                }
                ko.tasks.runEarly();
                setTimeout(self.loadImage, 300);
                var parameters = {
                    mode: "REVIEW",
                    billerDetails: ko.mapping.toJS(self.billerDetails)
                };
                params.dashboard.loadComponent("review-biller", parameters, self);
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };

        self.validateSpecification = {
            validate: function (value) {
                if (value) {
                  var regex = new RegExp("^[a-zA-Z0-9 \%\&\:\,\)\(\.\_'\-\//;]*$");
                  if(!regex.test(value)) {
                    throw new oj.ValidatorError("", self.resourceBundle.messages.invalidSpecificationLabel);
                  }
                    if (value.length > 20) {
                        throw new oj.ValidatorError("", self.resourceBundle.messages.invalidSpecificationLabelLength);
                    }
                    for(i=0; i < self.specificationsList().length;i++) {
                        if(value === self.specificationsList()[i].label()) {
                            throw new oj.ValidatorError("", self.resourceBundle.messages.uniqueLabel);
                        }
                    }
                }
                return true;
            }
        };

        self.dispose = function () {
            self.dataLoaded.dispose();
            validationTypeSubscription.dispose();
            fileSubscription.dispose();
            fileLogoSubscription.dispose();
        };
    };
});
