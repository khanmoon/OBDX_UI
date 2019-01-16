define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!lzn/gamma/resources/nls/account-details",
  "ojs/ojvalidationgroup"
], function(ko, $, AccountDetailsModel, resourceBundle) {
  "use strict";

  /**
   * var vm - description
   *
   * @param  {type} rootParams
   * @return {type}
   */
  var vm = function(rootParams) {
    var self = this,
      isToBeUpdated = false;
    ko.utils.extend(self, rootParams.rootModel);

    /**
     * var getNewKoModel - description
     *
     * @return {KoModel}  KoModel
     */
    var getNewKoModel = function() {
      var KoModel = AccountDetailsModel.getNewModel();
      KoModel.accountDetailsPayload.temp_maskAccountNumber = ko.observable(KoModel.accountDetailsPayload.temp_maskAccountNumber);
      KoModel.accountDetailsPayload.temp_reAccountNumber = ko.observable(KoModel.accountDetailsPayload.temp_reAccountNumber);
      KoModel.accountDetailsPayload.temp_maskReAccountNumber = ko.observable(KoModel.accountDetailsPayload.temp_maskReAccountNumber);
      return KoModel;
    };
    self.resource = resourceBundle;
    self.groupValid = ko.observable();
    self.accountDetailsLoaded = ko.observable(false);
    self.accountTypeListLoaded = ko.observable(false);
    self.accountTypeList = ko.observable();
    self.accountTypeChecked = ko.observable();
    self.applicantObject = ko.observable(rootParams.applicantObject);
    self.validationTracker = ko.observable();
    self.accountNumberChanged = ko.observable(false);
    self.validateBankName = {
      type: "length",
      options: {
        min: 1,
        max: 30
      }
    };
    self.validateRoutingNumber = {
      type: "length",
      options: {
        min: 5,
        max: 20
      }
    };
    self.applicantObject().accountDetails = getNewKoModel().accountDetailsPayload;
    AccountDetailsModel.getAccountTypeList().done(function(data) {
      if (data.enumRepresentations && data.enumRepresentations[0] && data.enumRepresentations[0].data) {
        self.accountTypeList(data.enumRepresentations[0].data);
        self.accountTypeChecked(self.accountTypeList()[0].code);
        self.applicantObject().accountDetails.accountType = self.accountTypeList()[0].code;
      }
      self.accountTypeListLoaded(true);
      AccountDetailsModel.getAccountDetails(self.productDetails().submissionId.value).done(function(data) {
        if (!$.isEmptyObject(data)) {
          if (data.accountNumber) {
            self.applicantObject().accountDetails.accountNumber = data.accountNumber;
            self.applicantObject().accountDetails.temp_maskAccountNumber(self.maskValue(self.applicantObject().accountDetails.accountNumber, self.applicantObject().accountDetails.accountNumber.length - 4));
            self.applicantObject().accountDetails.routingNumber = data.routingNumber;
            self.applicantObject().accountDetails.bankName = data.bankName;
            self.applicantObject().accountDetails.accountType = data.accountType;
            self.applicantObject().accountDetails.temp_selectedAccountType = rootParams.baseModel.getDescriptionFromCode(self.accountTypeList(), self.applicantObject().accountDetails.accountType);
            self.accountTypeChecked(data.accountType);
            isToBeUpdated = true;
          }
        }
        self.accountDetailsLoaded(true);
      });
    });

    /**
     * self - description
     *
     * @return {type}  description
     */
    self.accountTypeChange = function(event) {
      self.applicantObject().accountDetails.accountType = event.detail.value;
      self.applicantObject().accountDetails.accountNumber = "";
      self.applicantObject().accountDetails.temp_maskAccountNumber("");
      self.applicantObject().accountDetails.temp_reAccountNumber("");
      self.applicantObject().accountDetails.temp_maskReAccountNumber("");
    };

    /**
     * self - description
     *
     * @param  {type} event event
     * @param  {type} data  data
     * @return {type}       void
     */
    self.accountNumberChange = function(event) {

      if (event.detail.value) {
        self.accountDetailsLoaded(false);
        self.applicantObject().accountDetails.temp_reAccountNumber("");
        self.applicantObject().accountDetails.temp_maskReAccountNumber("");
        self.accountNumberChanged(true);
        ko.tasks.runEarly();
        self.accountDetailsLoaded(true);
      }
    };
    self.equalToAccountNo = {

      /**
       * validate - description
       *
       * @return {boolean}  description
       */
      validate: function(value) {
        var compareTo = self.applicantObject().accountDetails.accountNumber;
        if (!value && !compareTo) {
          return true;
        } else if (value !== compareTo) {
          throw new Error(self.resource.messages.accountNumberMatch);
        }
        return true;
      }
    };

    /**
     * self - description
     *
     * @return {type}  void
     */
    self.submitAccountDetails = function() {
      var tracker = document.getElementById("payday-account-tracker");
      if (tracker.valid === "valid") {
        self.applicantObject().accountDetails.temp_selectedAccountType = rootParams.baseModel.getDescriptionFromCode(self.accountTypeList(), self.applicantObject().accountDetails.accountType);
        AccountDetailsModel.submitAccountDetails(self.productDetails().submissionId.value, ko.mapping.toJSON(self.applicantObject().accountDetails, {
          "ignore": ["temp_selectedAccountType", "temp_reAccountNumber", "temp_maskReAccountNumber", "temp_maskAccountNumber"]
        }), isToBeUpdated).done(function() {
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
        });

      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }

    };

    /**
     * self - description
     *
     * @return {type}  description
     */
    self.accountNumberFocusOut = function(event) {
      var val = event.target.value.replace(/\-|\D/g, "");
      self.applicantObject().accountDetails.accountNumber = event.target.value.replace(/\-|\D/g, "");
      event.target.value = self.maskValue(val, val.length - 4);
    };

    /**
     * self - description
     *
     * @return {type}  description
     */
    self.accountNumberFocusIn = function(event) {
      event.target.value = self.applicantObject().accountDetails.accountNumber;
    };

    /**
     * self - description
     *
     * @param  {type} event description
     * @return {type}       description
     */
    self.reEnterAccountNumberFocusOut = function(event) {
      var val = event.target.value.replace(/\-|\D/g, "");
      self.applicantObject().accountDetails.temp_reAccountNumber(event.target.value.replace(/\-|\D/g, ""));
      event.target.value = self.maskValue(val, val.length - 4);
    };

    /**
     * self - description
     *
     * @param  {type} event description
     * @return {type}       description
     */
    self.reEnterAccountNumberFocusIn = function(event) {
      event.target.value = self.applicantObject().accountDetails.temp_reAccountNumber();
    };

  };
  return {
    viewModel: vm
  };
});
