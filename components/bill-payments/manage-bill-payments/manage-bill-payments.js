define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",
    "ojL10n!resources/nls/manage-bill-payments",
    "text!./manage-bill-payments.json",
    "ojs/ojlistview",
    "ojs/ojavatar",
    "ojs/ojbutton",
    "ojs/ojmenu",
    "ojs/ojoption",
    "ojs/ojswipetoreveal",
    "ojs/ojarraytabledatasource",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, BaseLogger, RegisteredBillerModel, resourceBundle, BillPaymentJSON) {
    "use strict";
    var self, vm = function (rootParams) {
        self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resourceBundle = resourceBundle;
        rootParams.dashboard.headerName(self.resourceBundle.heading.bills);
        rootParams.baseModel.registerElement("search-box");
        rootParams.baseModel.registerElement("help");
        rootParams.baseModel.registerComponent("register-biller", "bill-payments");
        rootParams.baseModel.registerComponent("review-register-biller", "bill-payments");
        rootParams.baseModel.registerComponent("pay-bill", "bill-payments");
        rootParams.baseModel.registerComponent("payment-history", "bill-payments");
        rootParams.baseModel.registerComponent("quick-bill-payment", "bill-payments");
        rootParams.baseModel.registerElement("confirm-screen");

        self.billers = ko.observableArray();
        self.billerSearchData = ko.observableArray();
        self.billersLoaded = ko.observable(false);
        self.searchRefresh = ko.observable(true);
        self.originalBillers = ko.observableArray();
        self.selectedBillerId = null;
        self.currentStage = ko.observable("LIST");
        self.registerBillerDetails = ko.observable();
        self.logoList = ko.observableArray();
        var payLoad = { batchDetailRequestList: [] };

        var currentDate = oj.IntlConverterUtils.dateToLocalIso(new Date(rootParams.baseModel.getDate()));

        var billPaymentJSON = JSON.parse(BillPaymentJSON);
        var billerTypes = billPaymentJSON.billerTypes;
        self.payBill=ko.observable();
        self.billLoaded = ko.observable(false);
        self.categoryList = ko.observableArray();
        self.relationshipDetails = ko.observableArray();
        self.billerName = ko.observable();
        self.allowPayment = ko.observable();
        self.renderer = function(context) {
          var renderer;
          if(rootParams.baseModel.small()){
            renderer = oj.KnockoutTemplateUtils.getRenderer("biller_mobile_template", true);
          }else{
            renderer = oj.KnockoutTemplateUtils.getRenderer("biller_template", true);
          }
          return renderer.call(this, context);
        };

        /**
         * This function binds swipe event to list view
         *
         * @function setupSwipeEvent
         * @returns {void}
         */
        function setupSwipeEvent() {
          for (var i = 0; i < billerTypes.length; i++) {
            $("#listview_"+i).find(".item-marker").each(function () {
                var id = $(this).prop("id");
                var startOffcanvas = $(this).find(".oj-offcanvas-start").first();
                var endOffcanvas = $(this).find(".oj-offcanvas-end").first();
                oj.SwipeToRevealUtils.setupSwipeActions(startOffcanvas);
                oj.SwipeToRevealUtils.setupSwipeActions(endOffcanvas);
                endOffcanvas.off("ojdefaultaction");
                endOffcanvas.on("ojdefaultaction", function () {
                    self.handleTrash({ "id": id });
                });
            });
          }
        }

        /**
         * This function validates whether schedule pay is already past
         *
         * @function validateSchedulePay
         * @param {object} registrationData - biller registration data
         * @returns {boolean} true if schedule pay is active
         */
        function validateSchedulePay(registrationData){
          if(registrationData.autopayInstructions.endDate && currentDate <= registrationData.autopayInstructions.endDate){
            return true;
          }else if(registrationData.autopayInstructions.startDate && currentDate <= registrationData.autopayInstructions.startDate){
            return true;
          }
          return false;
        }

        /**
         * This function sets bill payment status based on conditions
         *
         * @function setBillPaymentStatus
         * @param {object} registrationData - biller registration data
         * @returns {void}
         */
        function setBillPaymentStatus(registrationData){
          if(registrationData.registrationStatus === "APPROVED"){
            if(registrationData.ebill && registrationData.ebill.dueDate < currentDate){
              registrationData.billPaymentStatus = "OVERDUE";
              }else {
              switch (registrationData.billerType) {
                case "PRESENTMENT":
                  if(registrationData.autopay){
                    registrationData.billPaymentStatus = "AUTOPAY";
                  }
                  break;
                case "PRESENTMENT_PAYMENT":
                  if(registrationData.autopay){
                    registrationData.billPaymentStatus = "AUTOPAY";
                  }else if(registrationData.isSchedule && validateSchedulePay(registrationData)){
                    registrationData.billPaymentStatus = "SCHEDULEDPAY";
                  }
                  break;
                default:
                  if(registrationData.isSchedule && validateSchedulePay(registrationData)){
                    registrationData.billPaymentStatus = "SCHEDULEDPAY";
                  }
              }
            }
          }
        }

        /**
         * This function manipulates the registration list to display it in proper format
         *
         * @function displayBillerDetails
         * @param {arrayList} data - bill payments details to be displayed on screen
         * @param {boolean} filteredData - flag stating whether data is filtered or not
         * @returns {void}
         */
        function displayBillerDetails(data, filteredData){
          var billerArray = [];
          self.billers.removeAll();
          for (var i = 0; i < billerTypes.length; i++) {
            billerArray = [];
            for (var j = 0; j < data.length ; j++) {
              if(data[j].category){
                data[j].categoryName = data[j].category.name;
              }
              if(data[j].relationshipDetails && data[j].relationshipDetails.length > 0){
                setBillPaymentStatus(data[j]);
                if(billerTypes[i] === data[j].billerType){
                  if(data[j].billerType === "PRESENTMENT" && !data[j].ebill){
                    data[j].noBillDue = true;
                  }
                  billerArray.push(data[j]);
                }
                if(billerTypes[i] === "PRESENTMENT" && data[j].billerType === "PRESENTMENT_PAYMENT"){
                  if(data[j].ebill){
                    billerArray.push(data[j]);
                  }
                }else if(billerTypes[i] === "PAYMENT" && data[j].billerType === "PRESENTMENT_PAYMENT"){
                  if(!data[j].ebill){
                    billerArray.push(data[j]);
                  }
                }
              }
            }
            if(filteredData){
              if(billerArray.length > 0){
                self.billers.push({
                  id: "listview_"+i,
                  billerType: billerTypes[i],
                  translations: {"msgNoData" : self.resourceBundle.messages[billerTypes[i]]},
                  datasource: new oj.ArrayTableDataSource(billerArray, { idAttribute: "id" })
                });
              }
            }else{
              self.billers.push({
                id: "listview_"+i,
                billerType: billerTypes[i],
                translations: {"msgNoData" : self.resourceBundle.messages[billerTypes[i]]},
                datasource: new oj.ArrayTableDataSource(billerArray, { idAttribute: "id" })
              });
            }
          }
          self.billersLoaded(true);
          if(rootParams.baseModel.small()){
            $(document).ready(function(){
              setupSwipeEvent();
            });
          }
        }

        self.billerSearchSubscribe = self.billerSearchData.subscribe(function(newValue){
          if(self.originalBillers().length === newValue.length){
            displayBillerDetails(newValue, false);
          }else{
            displayBillerDetails(newValue, true);
          }
        });

        /**
         * This function populate category logos
         *
         * @function fetchLogos
         * @returns {void}
         */
        function fetchLogos(){
          RegisteredBillerModel.fireBatch(payLoad).done(function (batchData) {
            var contentMap = [];
              if (batchData && batchData.batchDetailResponseDTOList) {
                  for (var j = 0; j < batchData.batchDetailResponseDTOList.length; j++) {
                      var batchResponse = JSON.parse(batchData.batchDetailResponseDTOList[j].responseText);
                      if (batchResponse.contentDTOList) {
                          if(batchResponse.contentDTOList[0].contentId)
                            contentMap[batchResponse.contentDTOList[0].contentId.value] = "data:image/gif;base64," + batchResponse.contentDTOList[0].content;
                      }
                  }
              }
              for (var i = 0; i < self.originalBillers().length; i++) {
                if(self.originalBillers()[i].category && self.originalBillers()[i].category.logo){
                  self.originalBillers()[i].categoryLogo(contentMap[self.originalBillers()[i].category.logo.value]);
                }
              }
          });
        }

        RegisteredBillerModel.fetchRegisteredBillers().done(function(data){
          var id;
          payLoad.batchDetailRequestList = [];
          self.originalBillers(data.billerRegistrationDTOs);
          for (var i = 0; i < self.originalBillers().length; i++) {
              if (self.originalBillers()[i].category) {
                  self.originalBillers()[i].categoryLogo = ko.observable();
                  self.originalBillers()[i].initials = oj.IntlConverterUtils.getInitials(self.originalBillers()[i].category.name);
                  if(self.originalBillers()[i].category.logo){
                    id = self.originalBillers()[i].category.logo.value;
                    var contentURL = {
                      value: "/contents/{id}",
                      params: { "id": id }
                    };
                    var obj = {
                      methodType: "GET",
                      uri: contentURL,
                      headers: {
                        "Content-Id": i + 1,
                        "Content-Type": "application/json"
                      }
                    };
                    payLoad.batchDetailRequestList.push(obj);
                  }
              }
          }
          if(payLoad.batchDetailRequestList.length > 0){
            fetchLogos();
          }
          self.billerSearchData(self.originalBillers());
        });

        /**
         * This function redirects to the modify biller screen
         *
         * @function editBiller
         * @param {object} billerData - selected biller
         * @returns {void}
         */
        function editBiller(billerData){
          self.selectedBillerId = billerData.id;
          if(billerData.registrationStatus === "PENDING"){
            rootParams.baseModel.showMessages(null, [self.resourceBundle.messages.editBillerPendingStatus], "ERROR");
          }else{
            var parameters = {
                mode: "EDIT",
                billerRegistrationId: self.selectedBillerId
            };
            rootParams.changeView("modify-biller", parameters);
          }
        }

        /**
         * This function opens a modal window for user to confirm biller delete
         *
         * @function confirmDelete
         * @param {object} billerData - selected biller
         * @returns {void}
         */
        function confirmDelete(billerData){
          if(billerData.autopay){
            rootParams.baseModel.showMessages(null, [self.resourceBundle.messages.deleteBillerError], "ERROR");
          }else if(billerData.isSchedule && validateSchedulePay(billerData)){
              rootParams.baseModel.showMessages(null, [self.resourceBundle.messages.deleteBillerError], "ERROR");
            }else{
              self.selectedBillerId = billerData.id;
              $("#deleteBiller").trigger("openModal");
            }
        }

        /* handle mobile swipe buttons */
        self.handleEdit = function(data)
        {
          editBiller(data);
        };

        self.handleTrash = function(data)
        {
          confirmDelete(data);
        };

        self.menuItems = [
            {
                id: "edit",
                label: self.resourceBundle.labels.manageBiller,
                icon: "icon-edit"
            },
            {
                id: "delete",
                label: self.resourceBundle.labels.deleteBiller,
                icon: "icon-delete"
            }
        ];

        self.openMenu = function (data, event) {
          document.getElementById("menuLauncher-billerlist-contents-" + data.id).open(event);
        };

        /* handle desktop more menu */
        self.menuItemSelect = function (data, event) {
          $("#menuLauncher-billerlist-contents-"+data.id).hide();
          self.selectedBillerId = data.id;
          var menuId = event.target.value;
          if(menuId === "edit"){
            editBiller(data);
          }else if(menuId === "delete"){
            confirmDelete(data);
          }
        };

        self.deleteBiller = function(){
          $("#deleteBiller").hide();
          RegisteredBillerModel.deleteBiller(self.selectedBillerId).done(function(data, status, jqXhr){
            var successMessage, statusMessages;
            if (self.userSegment === "CORP" && jqXhr.status && jqXhr.status === 202) {
                successMessage = self.resourceBundle.messages.corpMaker;
                statusMessages = self.resourceBundle.messages.pendingApproval;
            } else {
                successMessage = self.resourceBundle.messages.deleteSuccessMessage;
                statusMessages = self.resourceBundle.messages.sucessfull;
            }
            rootParams.dashboard.loadComponent("confirm-screen", {
                jqXHR: jqXhr,
                transactionName: self.resourceBundle.heading.deleteBiller,
                confirmScreenExtensions: {
                    successMessage: successMessage,
                    statusMessages: statusMessages,
                    isSet: true,
                    confirmScreenDetails: [],
                    template: "confirm-screen/bill-payments"
                }
            }, self);
          });
        };

        self.registerBiller = function(){
          rootParams.changeView("register-biller", null);
        };

        self.showBillerDetails = function(data) {
          RegisteredBillerModel.fetchBillerDetails(data.id).done(function(response){
              if(response.billerRegistration){

                if(response.billerRegistration.isSchedule && !validateSchedulePay(response.billerRegistration)){
                  response.billerRegistration.isSchedule = false;
                }
                self.registerBillerDetails(response.billerRegistration);
                self.currentStage("DETAILS");
              }
          });
        };

      self.showPayBill = function(data) {
       RegisteredBillerModel.fetchBillerDetails(data).done(function(billerResponse){
           var parameters = {
               registerBillerDetails: billerResponse.billerRegistration
           };
          self.payBill(billerResponse.billerRegistration);
          RegisteredBillerModel.fetchBillerValues(billerResponse.billerRegistration.billerId).done(function(response){
             if(response){
               if(response.biller.type === "PRESENTMENT" || (response.biller.type === "PRESENTMENT_PAYMENT" && billerResponse.billerRegistration.ebill)){
                 self.allowPayment=response.biller.paymentOptions.latePayment;
                 if(self.allowPayment === false && currentDate > billerResponse.billerRegistration.ebill.dueDate){
                   $("#hidePayBill").trigger("openModal");
                 }else if(self.payBill().autopay === true)
                     {
                       $("#autoPayBill").trigger("openModal");
                     }
                     else if(self.payBill().isSchedule && self.payBill().isSchedule === true)
                     {
                       $("#scheduledPay").trigger("openModal");
                     }
                     else {
                        rootParams.dashboard.loadComponent("pay-bill", parameters, self);
                     }
               }else if(self.payBill().autopay === true)
                   {
                     $("#autoPayBill").trigger("openModal");
                   }
                   else if(self.payBill().isSchedule && self.payBill().isSchedule === true)
                   {
                     $("#scheduledPay").trigger("openModal");
                   }
                   else {
                      rootParams.dashboard.loadComponent("pay-bill", parameters, self);
                   }
             }
          });
        });
       };

       self.autoPayBill = function(){
         var parameters = {
             registerBillerDetails: self.payBill()
         };
         rootParams.dashboard.loadComponent("pay-bill", parameters, self);
       };

       self.fetchBillerLogo = function(data) {
       RegisteredBillerModel.fetchBillerLogos(data).done(function (response) {
         var specsArray = [];
         for (var m = 0; m < response.biller.specifications.length; m++) {
             specsArray[response.biller.specifications[m].id] = response.biller.specifications[m].label;
         }
         self.billerName(response.biller.name);
         self.relationshipDetails.removeAll();
         for (var j = 0; j < self.registerBillerDetails().relationshipDetails.length; j++) {
           self.relationshipDetails.push({
             label: specsArray[self.registerBillerDetails().relationshipDetails[j].labelId],
             value: self.registerBillerDetails().relationshipDetails[j].value
           });
         }
         payLoad.batchDetailRequestList = [];
         if(response.biller.logo){
           var id, i = 0;
           id = response.biller.logo.value;
           self.logoList.push({
             initials: oj.IntlConverterUtils.getInitials(response.biller.name),
             logo: response.biller.logo,
             billerLogo: ko.observable()
           });
           var contentURL = {
             value: "/contents/{id}",
             params: { "id": id }
           };
             var obj = {
               methodType: "GET",
               uri: contentURL,
               headers: {
                 "Content-Id": ++i,
                 "Content-Type": "application/json"
               }
             };
            payLoad.batchDetailRequestList.push(obj);
             if(payLoad.batchDetailRequestList.length > 0){
               RegisteredBillerModel.fireBatch(payLoad).done(function (batchData) {
                 var contentMap = [];
                   if (batchData && batchData.batchDetailResponseDTOList) {
                     for (var s = 0; s < batchData.batchDetailResponseDTOList.length; s++) {
                       var batchResponse = JSON.parse(batchData.batchDetailResponseDTOList[s].responseText);
                         if (batchResponse.contentDTOList) {
                           if(batchResponse.contentDTOList[0].contentId)
                               contentMap[batchResponse.contentDTOList[0].contentId.value] = "data:image/gif;base64," + batchResponse.contentDTOList[0].content;
                           }
                         }
                       }
                   if(self.logoList()[0].logo && self.logoList()[0].logo.value){
                       self.logoList()[0].billerLogo = contentMap[self.logoList()[0].logo.value];
                       self.billLoaded(true);
                       $("#billWindow").trigger("openModal");
                   }
               });
             }
           }
        });
       };

       self.quickBill= function() {

             rootParams.dashboard.loadComponent("manage-accounts", {
                 applicationType: "billPayments",
                 defaultTab: "quick-bill-payment"
             });
       };

       self.paymentHistory= function() {

             rootParams.dashboard.loadComponent("manage-accounts", {
                 applicationType: "billPayments",
                 defaultTab: "payment-history"
             });
       };

       self.viewBill = function(data){
         RegisteredBillerModel.fetchBillerDetails(data.id).done(function(response){
           if(response.billerRegistration){
               self.registerBillerDetails(response.billerRegistration);
               self.fetchBillerLogo(self.registerBillerDetails().billerId);
           }
        });
       };

    };
    vm.prototype.dispose = function () {
      self.billerSearchSubscribe.dispose();
    };
    return vm;
});
