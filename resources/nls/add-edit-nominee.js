  define(["ojL10n!resources/nls/generic"], function(Generic) {
      "use strict";
      var addEditNominee = function() {
          return {
              root: {
                  nominee: {
                      header: {
                          edit: "Edit Nominee",
                          add: "Add Nominee"
                      },
                      labels: {
                          add: "Add New",
                          replicate: "Replicate Existing Nominee"
                      },
                      nomineeDetails: {
                          accountNumber: "Account Number",
                          name: "Nominee Name",
                          dob: "Nominee Date of Birth",
                          relationship: "Relationship",
                          nominationType:"Nomination Type",
                          nominationDetails: "Nomination Details",
                          errorMessage: {
                              noPreRegisteredNominees : "You do not have any existing nominee available for selection.",
                              zip: "Please enter valid zip code",
                              state: "Please enter valid state name",
                              addressError: "Please enter valid address",
                              minorError: "Please enter guardian details since date of birth of nominee is less than 18 years.",
                              notMinorError: "Since nominee is not a minor and guardian details are not required hence please unselect the values filled in guardian details"
                          }
                      },
                      accountTypeDescription: {
                          CSA: "Current and Savings",
                          TRD: "Term Deposit",
                          RD: "Recurring Deposit"
                      },
                      addressDetails: {
                          country: "Country",
                          city: "City",
                          state: "State",
                          zip: "Zip",
                          address: "Address"

                      },
                      guardianDetails: {
                          name: "Name"
                      },
                      pleaseSelect: "Please Select",
                      selectNominee: "Select Nominee",
                      minorCondition: "Enter Guardian details since nominee is a minor below 18 years:",
                      acceptCondition: "Yes, I would like to enter Guardian Details",
                      accountListTable: "Accounts List Table",
                      nomineeListTable: "Nominee List Table",
                      accountType: "Account Type",
                      accountName: "Account Name",
                      generic: Generic

                  }
              },
              ar: true,
              fr: true,
              cs: true,
              sv: true,
              en: false,
              "en-us": false,
              el: true
          };
      };
      return new addEditNominee();
  });
