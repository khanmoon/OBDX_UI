/**
 * read add-edit-nominee contains all the methods to read an already registered nominee
 *
 * @module nominee
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} readNomineeModel
 * @requires {object} ResourceBundle
 */
define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/read-nominee",
    "ojs/ojbutton"
], function(oj, ko, $, readNomineeModel, ResourceBundle) {
    "use strict";

    /** User is allowed to read his nominee details if a nominee is already registered
     * irrespective of its account holding pattern which can be either single or joint.
     * But is allowed to either edit or delete nominee only if it's account holding pattern is single
     * and the nominee is already registered.
     *
     * @param {object} rootParams  An object which contains contect of dashboard and param values
     * @return {function} function
     */
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);

        self.resource = ResourceBundle;
        self.nominee = ko.observable();
        self.relationDescription = ko.observable();
        self.nomineeDTOLoaded = ko.observable(false);
        self.countryMap = {};
        rootParams.baseModel.registerComponent("add-edit-nominee", "nominee");
        rootParams.baseModel.registerElement(["confirm-screen", "modal-window"]);
        rootParams.dashboard.headerName(self.resource.readNominee.header);

        var selectedAccountId = self.params.selectedAccountId.value,
            confirmScreenDetailsArray;

        Promise.all([readNomineeModel.readNominee(selectedAccountId), readNomineeModel.getRelation(), readNomineeModel.getCountry()]).then(function(readNomineeResponse) {
            self.nominee(readNomineeResponse[0]);
            self.nominee().nomineeDTO.accountModule = self.params.selectedAccountModule;
            var relationResponse = readNomineeResponse[1],
                countryResponse = readNomineeResponse[2];
            if (relationResponse && relationResponse.enumRepresentations[0].data !== null && relationResponse.enumRepresentations[0].data.length > 0) {
                for (var i = 0; i < relationResponse.enumRepresentations[0].data.length; i++) {
                    if (self.nominee().nomineeDTO.relation === relationResponse.enumRepresentations[0].data[i].code) {
                        self.relationDescription(relationResponse.enumRepresentations[0].data[i].description);
                        break;
                    }
                }
            }
            if (countryResponse && countryResponse.enumRepresentations[0].data !== null && countryResponse.enumRepresentations[0].data.length > 0) {
                for (var j = 0; j < countryResponse.enumRepresentations[0].data.length; j++) {
                    self.countryMap[countryResponse.enumRepresentations[0].data[j].code] = countryResponse.enumRepresentations[0].data[j].description;
                }
            }
            self.nomineeDTOLoaded(true);
            confirmScreenDetailsArray = [
                [{
                    label: self.resource.readNominee.accountNumber,
                    value: self.nominee().nomineeDTO.accountId.displayValue
                }, {
                    label: self.resource.readNominee.nomineeName,
                    value: self.nominee().nomineeDTO.name
                }],
                [{
                    label: self.resource.readNominee.nomineeDOB,
                    value: rootParams.baseModel.formatDate(self.nominee().nomineeDTO.dateOfBirth)
                }, {
                    label: self.resource.readNominee.relationShip,
                    value: self.relationDescription
                }],
                [{
                    label: self.resource.readNominee.nomineeAddress,
                    value: [(self.nominee().nomineeDTO.address.line1),
                        (self.nominee().nomineeDTO.address.line2),
                        (self.countryDescription),
                        (self.nominee().nomineeDTO.address.state),
                        (self.nominee().nomineeDTO.address.city),
                        (self.nominee().nomineeDTO.address.zipCode)
                    ]
                }, {
                    label: self.resource.readNominee.guardianName,
                    value: (self.nominee().nomineeDTO.guardian) ? (self.nominee().nomineeDTO.guardian.name) : null
                }]
            ];
        });
        /**
         * This function will open the modal-window which will allow user to delete nominee.
         *
         * @memberOf read-nominee
         * @function deleteNominee
         * @returns {void}
         */
        self.deleteNominee = function() {
            $("#delete-nominee").trigger("openModal");
        };
        /**
         * This function will close the opened delete-nominee modal-window.
         *
         * @memberOf read-nominee
         * @function closeDeleteNomineeModal
         * @returns {void}
         */
        self.closeDeleteNomineeModal = function() {
            $("#delete-nominee").trigger("closeModal");
        };

        /**
         * This function will load the add-edit-nominee component for editing the existing nominee
         *
         * @memberOf read-nominee
         * @function editNominee
         * @returns {void}
         */
        self.editNominee = function() {
            rootParams.dashboard.loadComponent("add-edit-nominee", {
                nomineeDTO: {
                    data: self.nominee().nomineeDTO
                },
                iseditable: true,
                landingComponent: self.params.landingComponent,
                selectedAccountType: self.params.selectedAccountType,
                selectedAccountModule: self.params.selectedAccountModule
            });
        };

        /** confirm screen call on delete nominee confirmation from user
         *
         * @memberOf read-nominee
         * @function confirmDeleteNominee
         * @returns {void}
         */
        self.confirmDeleteNominee = function() {
            $("#delete-nominee").trigger("closeModal");
            readNomineeModel.deleteNominee(selectedAccountId).done(function(data, status, jqXHR) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceNumber,
                    transactionName: self.resource.readNominee.nomineeDelete,
                    confirmScreenExtensions: {
                        successMessage: self.resource.readNominee.deleteSuccessMessage,
                        isSet: true,
                        taskCode: "NM_M_DNM",
                        landingComponent: self.params.landingComponent,
                        confirmScreenDetails: confirmScreenDetailsArray,
                        template: "confirm-screen/nominee-template"
                    }
                });
            });
        };
    };
});