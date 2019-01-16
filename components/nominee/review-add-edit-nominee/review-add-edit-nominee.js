/**
 * review add-edit-nominee contains all the methods to review the creation of a non registered nominee
 * or to review the updation an existing registered nominee.
 *
 * @module nominee
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} reviewNomineeModel
 * @requires {object} ResourceBundle
 */
define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/review-add-edit-nominee",
    "ojs/ojcheckboxset",
    "ojs/ojbutton"
], function(oj, ko, $, reviewNomineeModel, ResourceBundle) {
    "use strict";

    /** Review New Nominee creation or Updating an existing Nominee.
     *
     * This component will allow a user with account holding pattern as single
     * to review the updation of a nominee if already registered or to review the creation of a nominee if not registered
     * for CASA, TermDeposit, RecurringDeposit accounts.
     *
     * @param {object} rootParams  An object which contains contect of dashboard and param values
     * @return {function} function
     *
     */
    return function(rootParams) {
        var self = this,
            confirmScreenDetailsArray;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.relationDescription = ko.observable();
        self.nomineeDetailsLoaded = ko.observable(false);
        rootParams.baseModel.registerComponent("add-edit-nominee", "nominee");
        rootParams.baseModel.registerElement("confirm-screen");
        if (!self.params.isNomineeRequired)
            rootParams.dashboard.headerName((self.params && self.params.iseditable) ? (self.resource.reviewNominee.editNominee) : (self.resource.reviewNominee.addNominee));

        self.nominee = self.params.addNomineeModel;
        self.countryMap = {};
        Promise.all([reviewNomineeModel.getRelation(), reviewNomineeModel.getCountry()]).then(function(relationResponse) {
            if (relationResponse[0] && relationResponse[0].enumRepresentations[0].data !== null && relationResponse[0].enumRepresentations[0].data.length > 0) {
                for (var i = 0; i < relationResponse[0].enumRepresentations[0].data.length; i++) {
                    if (self.nominee.relation() === relationResponse[0].enumRepresentations[0].data[i].code) {
                        self.relationDescription(relationResponse[0].enumRepresentations[0].data[i].description);
                        break;
                    }
                }
            }
            var countryResponse = relationResponse[1];
            if (countryResponse && countryResponse.enumRepresentations[0].data !== null && countryResponse.enumRepresentations[0].data.length > 0) {
                for (var j = 0; j < countryResponse.enumRepresentations[0].data.length; j++) {
                    self.countryMap[countryResponse.enumRepresentations[0].data[j].code] = countryResponse.enumRepresentations[0].data[j].description;
                }
            }
            self.nomineeDetailsLoaded(true);
            confirmScreenDetailsArray = [
                [{
                    label: self.resource.reviewNominee.accountNumber,
                    value: self.nominee.accountId.displayValue()
                }, {
                    label: self.resource.reviewNominee.nomineeName,
                    value: self.nominee.name()
                }],
                [{
                    label: self.resource.reviewNominee.nomineeDOB,
                    value: rootParams.baseModel.formatDate(self.nominee.dateOfBirth())
                }, {
                    label: self.resource.reviewNominee.relationShip,
                    value: self.relationDescription
                }],
                [{
                    label: self.resource.reviewNominee.nomineeAddress,
                    value: [self.nominee.address.line1(),
                        self.nominee.address.line2(),
                        self.countryMap[self.nominee.address.country()],
                        self.nominee.address.city(),
                        self.nominee.address.state(),
                        self.nominee.address.zipCode()
                    ]
                }, {
                    label: self.resource.reviewNominee.guardianName,
                    value: self.nominee.guardian ? self.nominee.guardian.name() : null
                }]
            ];
        });

        /**
         * This function will allow the user to either create a new nominee or to update an existing one
         *  on the basis of roles assigned and grants given to the user at the initiation screen.
         *
         *  @memberOf review-add-edit-nominee
         *  @function confirmNominee
         *  @returns {void}
         */
        self.confirmNominee = function() {
            var nomineePayload = ko.toJSON(self.nominee);
            if (self.params.iseditable) {
                reviewNomineeModel.confirmEditNominee(nomineePayload).done(function(data, status, jqXHR) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        hostReferenceNumber: data.nominee.referenceId,
                        transactionName: self.resource.reviewNominee.editNominee,
                        confirmScreenExtensions: {
                            successMessage: self.resource.reviewNominee.editSuccessMessage,
                            isSet: true,
                            taskCode:"NM_M_UNM",
                            landingComponent : self.params.landingComponent,
                            confirmScreenDetails: confirmScreenDetailsArray,
                            template: "confirm-screen/nominee-template"
                        }
                    });
                });
            } else {
                reviewNomineeModel.confirmAddNominee(nomineePayload).done(function(data, status, jqXHR) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        hostReferenceNumber: data.nomineeDTO.referenceId,
                        transactionName: self.resource.reviewNominee.addNominee,
                        confirmScreenExtensions: {
                            successMessage: self.resource.reviewNominee.addSuccessMessage,
                            isSet: true,
                            taskCode:"NM_M_CNM",
                            landingComponent : self.params.landingComponent,
                            confirmScreenDetails: confirmScreenDetailsArray,
                            template: "confirm-screen/nominee-template"
                        }
                    });
                });
            }
        };
    };
});