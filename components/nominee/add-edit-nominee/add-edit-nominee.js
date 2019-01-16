/**
 * add-edit-nominee contains all the methods to create a non registered nominee
 * or to update an existing registered nominee.
 *
 * @module nominee
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} casaNomineeListModel
 * @requires {object} ResourceBundle
 */
define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/add-edit-nominee",
    "ojs/ojdialog",
    "ojs/ojradioset",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojvalidationgroup",
    "ojs/ojlistview",
    "ojs/ojdatetimepicker"

], function(oj, ko, $, nomineeModel, ResourceBundle) {
    "use strict";

    /** New Nominee creation or Updating an existing Nominee.
     *
     * This component will allow a user with account holding pattern as single
     * to update a nominee if already registered or to create a nominee if not registered
     * for CASA, TermDeposit, RecurringDeposit accpunts.
     * This will check the minority condition for nominee that if nominee's age < 18 then
     * the user have to enter the nominee's guardian details compulsorily.
     * @param {object} rootParams  An object which contains contect of dashboard and param values
     * @return {function} function
     * @return {object} getNewKoModel
     *
     */
    return function(rootParams) {
        var self = this,
            accountsListArray,
            date, partyNomineesMap = {},
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(nomineeModel.getNewModel());
                return KoModel;
            };
        self.addNomineeModel = (rootParams.rootModel.params && rootParams.rootModel.params.addNomineeModel) || getNewKoModel().addNomineeModel;
        self.isMinor = (rootParams.rootModel.params && rootParams.rootModel.params.minor) ? rootParams.rootModel.params.minor : ko.observable(false);
        self.landingComponent = rootParams.rootModel.params ? rootParams.rootModel.params.landingComponent : null;
        ko.utils.extend(self, rootParams.rootModel.previousState || rootParams.rootModel);
        self.resource = ResourceBundle;
        self.validationTracker = ko.observable();
        self.countries = ko.observableArray();
        self.dataLoaded = ko.observable(false);
        self.relationshipList = ko.observableArray();
        self.maxDate = ko.observable();
        self.groupValid = ko.observable();
        self.selectedNominee = ko.observable();
        self.nomineeList = ko.observable();
        self.additionalDetails = ko.observable();
        self.listLoaded = ko.observable(false);
        self.accountsListDataSource = ko.observable();
        self.customURLmap = {
            CSA: "demandDeposit",
            TRD: "deposit?module=CON",
            TRDRD: "deposit?module=RD"
        };
        self.nomineeArray = [{
            id: "add",
            label: self.resource.nominee.labels.add
        }, {
            id: "replicate",
            label: self.resource.nominee.labels.replicate
        }];
        self.manageNominee = ko.observable(self.nomineeArray[0].id);
        self.addNomineeModel.accountModule(rootParams.rootModel.params.selectedAccountModule);
        self.addNomineeModel.accountType(rootParams.rootModel.params.selectedAccountType);
        rootParams.baseModel.registerComponent("review-add-edit-nominee", "nominee");
        rootParams.baseModel.registerElement(["modal-window", "account-input"]);

        if (self.params && self.params.iseditable && !self.params.isNomineeRequired) {
            rootParams.dashboard.headerName(self.resource.nominee.header.edit);
            var nomineeData = ko.mapping.fromJS(self.params.nomineeDTO).data;
            if (nomineeData.guardian) {
                self.addNomineeModel.guardian = getNewKoModel().guardianDetails;
            }
            $.extend(true, self.addNomineeModel, nomineeData);
            void(self.addNomineeModel.minor() && self.isMinor(true));
        } else if (self.params && !self.params.iseditable && !self.params.isNomineeRequired) {
            rootParams.dashboard.headerName(self.resource.nominee.header.add);
            self.addNomineeModel.accountId.displayValue(ko.utils.unwrapObservable(self.params.selectedAccountId.displayValue));
            self.addNomineeModel.accountId.value(ko.utils.unwrapObservable(self.params.selectedAccountId.value));
        } else if (!(self.params && self.params.isNomineeRequired()))
            rootParams.dashboard.headerName(self.iseditable ? self.resource.nominee.header.edit : self.resource.nominee.header.add);

        /** All rest will be called once the component is loaded and html will be loaded only after
         * receiving the rest response.
         * Rest response can be either successful or rejected
         *
         * @instance {object} nomineeModel
         * param1 {nomineeModel.object} getHostDate
         * param2 {nomineeModel.object} getCountries
         * param3 {nomineeModel.object} getRelation
         */
        Promise.all([nomineeModel.getHostDate(), nomineeModel.getCountries(), nomineeModel.getRelation()]).then(function(response) {
            var dateResponse = response[0],
                countriesResponse = response[1],
                relationResponse = response[2];
            if (dateResponse && dateResponse.currentDate !== null) {
                date = new Date(dateResponse.currentDate.valueDate);
                self.maxDate(oj.IntlConverterUtils.dateToLocalIso(date));
                date.setFullYear(date.getFullYear() - 18);
            }

            if (countriesResponse && countriesResponse.enumRepresentations[0].data !== null && countriesResponse.enumRepresentations[0].data.length > 0) {

                for (var i = 0; i < countriesResponse.enumRepresentations[0].data.length; i++) {
                    self.countries.push({
                        text: countriesResponse.enumRepresentations[0].data[i].description,
                        value: countriesResponse.enumRepresentations[0].data[i].code
                    });
                }
            }

            if (relationResponse && relationResponse.enumRepresentations[0].data !== null && relationResponse.enumRepresentations[0].data.length > 0) {
                for (var j = 0; j < relationResponse.enumRepresentations[0].data.length; j++) {
                    self.relationshipList.push({
                        text: relationResponse.enumRepresentations[0].data[j].description,
                        value: relationResponse.enumRepresentations[0].data[j].code
                    });
                }
            }
            self.dataLoaded(true);
        });

        /**
         * This function will return the age of the nominee on the basis of selected date of birth.
         *
         *  @memberOf add-edit-nominee
         *  @function isMinor
         *  @returns {void}
         */
        function isMinor() {
            var dob = new Date(self.addNomineeModel.dateOfBirth());
            dob.setHours(0,0,0,0);
            return dob > date;
        }

        /**
         * Subscribe function for date of birth
         *
         *  @memberOf add-edit-nominee
         *  @function dateOfBirthSubscribeFunction
         *  @returns {void}
         */
        function dateOfBirthSubscribeFunction() {
            self.isMinor(isMinor());
            if (self.isMinor() && !self.addNomineeModel.guardian) {
                self.addNomineeModel.guardian = getNewKoModel().guardianDetails;
                self.addNomineeModel.minor(true);
            } else if (!self.isMinor()) {
                self.addNomineeModel.guardian = null;
                self.addNomineeModel.minor(false);
            }
        }

        /**
         * Changes replicate screen to nominee form
         *
         *  @memberOf add-edit-nominee
         *  @function openNomineeForm
         *  @returns {void}
         */
        self.openNomineeForm = function() {
            self.listLoaded(false);
            self.manageNominee(self.nomineeArray[0].id);
            self.dataLoaded(true);
        };

        var dateOfBirthSubscribe = self.addNomineeModel.dateOfBirth.subscribe(dateOfBirthSubscribeFunction);
        var noPreRegisteredNominees = false;

        /**
         * This function will handle the updation of nominee to be done in existing one
         * or to create a new one.
         *
         * @memberOf add-edit-nominee
         * @function nomineeArrayChanged
         * @param {object} event  An object containing the current event of field
         * @returns {void}
         */
        self.nomineeArrayChanged = function(event) {
            if (event.detail.value === self.manageNominee() && event.detail.value !== event.detail.previousValue) {
                if (self.manageNominee() === self.nomineeArray[0].id) {
                    self.reset();
                    self.dataLoaded(true);
                    self.listLoaded(false);
                } else if (self.manageNominee() === self.nomineeArray[1].id) {
                    if (noPreRegisteredNominees) {
                        rootParams.baseModel.showMessages(null, [self.resource.nominee.nomineeDetails.errorMessage.noPreRegisteredNominees], "INFO", function() {
                            self.manageNominee(self.nomineeArray[0].id);
                        });
                        return;
                    } else if (accountsListArray) {
                        self.selectedNominee(accountsListArray[0].accountNumberValue);
                        if (rootParams.baseModel.large()) {
                            $("#replicate-nominee").trigger("openModal");
                            self.listLoaded(false);
                        } else {
                            self.dataLoaded(false);
                            self.listLoaded(true);
                        }
                        return;
                    }
                    nomineeModel.getNomineeList().then(function(data) {
                        partyNomineesMap = {};
                        accountsListArray = $.map(data.nominees, function(a) {
                            partyNomineesMap[a.accountId.value] = a;
                            return {
                                "nomineeName": a.name,
                                "accountType": self.resource.nominee.accountTypeDescription[a.accountModule || a.accountType],
                                "accountName": a.partyName,
                                "accountNumber": a.accountId.displayValue,
                                "accountNumberValue": a.accountId.value
                            };
                        });
                        noPreRegisteredNominees = !(accountsListArray && accountsListArray.length > 0);
                        if (noPreRegisteredNominees) {
                            rootParams.baseModel.showMessages(null, [self.resource.nominee.nomineeDetails.errorMessage.noPreRegisteredNominees], "INFO", function() {
                                self.manageNominee(self.nomineeArray[0].id);
                            });
                        } else {
                            self.accountsListDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(accountsListArray, { idAttribute: "accountNumberValue" } || [])));
                            self.selectedNominee(accountsListArray[0].accountNumberValue);
                            ko.tasks.runEarly();
                            if (rootParams.baseModel.large()) {
                                $("#replicate-nominee").trigger("openModal");
                                self.listLoaded(false);
                            } else {
                                self.dataLoaded(false);
                                self.listLoaded(true);
                            }
                        }
                    });
                }
            }

        };

        /**
         * This function will check the minority condition i.e. age < 18 and guardian details are properly filled
         *  and vice versa, then redirect the user to next screen to review the nominee details entered.
         *
         *  @memberOf add-edit-nominee
         *  @function addNominee
         *  @returns {void}
         */
        self.addNominee = function() {
            if (rootParams.baseModel.showComponentValidationErrors(document.getElementById("nomineeTracker"))) {
                rootParams.dashboard.loadComponent("review-add-edit-nominee", {
                    addNomineeModel: self.addNomineeModel,
                    iseditable: self.params ? self.params.iseditable : self.iseditable,
                    isMinor: self.isMinor,
                    landingComponent: self.landingComponent
                });
            }
        };

        /** This function will autopopulate all fields of form on click of ok buton of modal window.
         *
         * @memberOf add-edit-nominee
         * @function replicateNominee
         *  @returns {void}
         */
        self.replicateNominee = function() {
            self.dataLoaded(false);
            self.listLoaded(false);
            if (self.selectedNominee()) {
                var selectedNomineeDetails = ko.mapping.fromJS(partyNomineesMap)[self.selectedNominee()];
                selectedNomineeDetails.accountId = self.addNomineeModel.accountId;
                selectedNomineeDetails.accountType = self.addNomineeModel.accountType;
                selectedNomineeDetails.accountModule = self.addNomineeModel.accountModule;

                if (selectedNomineeDetails.guardian)
                    self.addNomineeModel.guardian = getNewKoModel().guardianDetails;
                else
                    self.addNomineeModel.guardian = null;

                $.extend(true, self.addNomineeModel, selectedNomineeDetails);
                dateOfBirthSubscribe.dispose();
                dateOfBirthSubscribe = self.addNomineeModel.dateOfBirth.subscribe(dateOfBirthSubscribeFunction);
                self.isMinor(self.addNomineeModel.minor());
            }
            $("#replicate-nominee").hide();
            ko.tasks.runEarly();
            self.dataLoaded(true);
        };

        /**
         * This function will be triggered to cleanup the memory allocated to subscribed functions.
         *
         * @memberOf add-edit-nominee
         * @function dispose
         * @returns {void}
         */
        self.dispose = function() {
            dateOfBirthSubscribe.dispose();
        };

        /** This function will close window on click of cancel buton of modal window.
         *
         * @memberOf add-edit-nominee
         * @function closeModal
         *  @returns {void}
         */
        self.closeModal = function() {
            $("#replicate-nominee").hide();
            self.manageNominee(self.nomineeArray[0].id);
        };

        /** This function will empty all the fields of the form on click of reset button in edit mode.
         *
         * @memberOf add-edit-nominee
         * @function reset
         *  @returns {void}
         */
        self.reset = function() {
            self.addNomineeModel.dateOfBirth(null);
            self.addNomineeModel.relation("");
            self.addNomineeModel.minor(false);
            self.isMinor(false);
            self.addNomineeModel.name(null);
            self.addNomineeModel.address.country("");
            self.addNomineeModel.address.state(null);
            self.addNomineeModel.address.city(null);
            self.addNomineeModel.address.zipCode(null);
            self.addNomineeModel.address.line1(null);
            self.addNomineeModel.address.line2(null);
            self.addNomineeModel.guardian = null;
        };
    };
});