define([], function() {
  "use strict";
  var MessagesLocale = function() {
    return {
      root: {
        requirements: {
          purpose: "Please specify the Loan Purpose",
          tenure: "Please specify Loan Tenure",
          repaymentFrequency: "Please specify repayment frequency",
          coApplicant: "Please specify if co-applicant is required"
        },
        tdRequirements: {
          purpose: "Please specify the Loan Purpose",
          tenure: "Please specify Term Deposit Tenure",
          frequency: "Please specify Interest Payout Frequency",
          coApplicant: "Please specify if co-applicant is required"
        },
        primaryInfo: {
          salutation: "Please select a Salutation",
          firstName: "Please enter a valid First Name",
          lastName: "Please enter a valid Last Name",
          email: "Please enter a valid email ID",
          dob: "Please enter a valid date of birth",
          maritalStatus: "Please define your marital status",
          dependants: "Please select the number of dependants",
          others: "Please select other salutation"
        },
        registration: {
          blankPassword: "Please enter password",
          blankConfirmPassword: "Please re-enter password",
          blankSecurityQuestion: "Please specify security question",
          blankSecurityAnswer: "Please specify security question answer",
          blankTnC: "Please accept Terms & Conditions",
          passwordMismatch: "Password mismatch",
          tooWeak: "Too Weak",
          weakPassword: "You must enter a password that meets our minimum security requirements.",
          successHeading: "Registration Successful",
          successText: "You have been successfully registered. Please Login to continue"
        },
        identityInfo: {
          type: "Please specify Type of Identification",
          number: "Please enter a valid Identification number",
          citizenship: "Please define your citizenship"
        },
        contactInfo: {
          stayingSince: "Please enter a valid date",
          accomodationType: "Please specify accommodation type",
          mobileNumber: "Please enter a valid mobile number",
          phoneNumber: "Please enter a valid phone number"
        },
        occupationInfo: {
          occupationType: "Please specify Occupation type",
          occupationStatus: "Please define occupation status",
          employerName: "Please specify employer name",
          startDate: "Please specify Start Date",
          designation: "Please specify designation"
        },
        assetsInfo: {
          assetType: "Please specify the type of asset",
          assetAmount: "Please enter a valid amount",
          ownership: "Please enter a valid ownership percentage"
        },
        financialInfo: {
          assetType: "Please specify the type of asset",
          ownership: "Please enter a valid ownership percentage",
          expenseType: "Please specify the type of Expense",
          invalidAmount: "Please enter a valid amount",
          frequency: "Please specify frequency",
          incomeFrequency: "Please specify frequency of income",
          incomeType: "Please specify an Income Type",
          netIncome: "Please enter Net income lesser than Gross income",
          liabilityValue: "Please enter Outstanding value lesser than Original value"
        },
        address: {
          country: "Please specify country",
          state: "Please specify state",
          invalidCity: "Please specify a valid city",
          city: "Please specify city",
          zipcode: "Please enter a valid zipcode",
          address: "Please enter valid address details"
        },
        applicationRepayment: {
          accountType: "Please specify Account Type",
          accountNumber: "Please specify Account Number",
          institutionCodeType: "Please Specify the Institution Code Type",
          specify: "Please specify a value"
        },
        applicationFees: {
          feeAction: "Please specify Action",
          chooseAccount: "Please specify Account Number"
        },
        applicationInsurance: {
          premiumPayment: "Please specify Payment Option",
          coverType: "Please specify Cover Type"
        },
        applicationLoan: {
          statementFrequency: "Please specify Statement Frequency"
        },
        invalidPartyId: "Please enter valid party ID",
        invalidAmount: "Please enter a valid amount",
        invalidSecurityCode: "Please enter valid security code",
        share: "Share with Co-applicant",
        coapplicant: {
          securityCode: "Security Code",
          coappSecurity: {
            labelText: "Share security code with"
          }
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
  return new MessagesLocale();
});