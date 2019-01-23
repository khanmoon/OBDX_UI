define([], function() {
    "use strict";
    var OBDXLocale = function() {
        return {
            root: {
                messages: {
                    ACCOUNT: "Please enter valid account number. Only alphanumeric characters are allowed.",
                    NAME: "Please enter valid name. Allowed characters are : alphanumeric characters, space and - = & # * + : , ) ( . ! $ | ' ` ? [ \ ] /",
                    TENURE_MONTHS: "Please enter valid months. Only numbers are allowed.",
                    TENURE_YEARS: "Please enter valid years. Only numbers are allowed.",
                    TENURE_DAYS: "Please enter valid days. Only numbers are allowed.",
                    REFERENCE_NUMBER: "Please enter valid reference number. Only alphanumeric characters are allowed.",
                    CITY: "Please enter valid city name. Allowed characters are : alphanumeric characters, space and  % & : , ) ( . _ ' - / ;",
                    IBAN: "Please enter valid account number. Only alphanumeric characters are allowed.",
                    DEBTOR_IBAN: "Please enter valid iban number. Only alphanumeric characters are allowed.",
                    COMMENTS: "Invalid comments. Allowed characters are : alphanumeric characters, space and & : $ , . _ ?",
                    PARTY_ID: "Please enter valid party ID. Only alphanumeric characters are allowed.",
                    MESSAGE: "Invalid Message. Allowed characters are : alphanumeric characters and space",
                    PIN: "Invalid Pin. Only numbers are allowed.",
                    CVV: "Invalid CVV number. Only numbers are allowed.",
                    ONLY_NUMERIC: "Please enter only numeric values",
                    ONLY_SPECIAL: "Please enter only special characters. Allowed characters are space and ! \" # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~",
                    BANK_CODE: "Invalid bank code. Only alphanumeric characters are allowed.",
                    BANK_NAME: "Invalid bank Name. Allowed characters are : alphanumeric characters and space",
                    CHEQUE_NUMBER: "Invalid cheque number. Only alphanumeric characters are allowed.",
                    EMAIL: "Invalid email.",
                    MOBILE_NO: "Invalid mobile number. Allowed characters are : numbers, space and -",
                    IFSC_CODE: "Invalid IFSC code. Only alphanumeric characters are allowed.",
                    ADDRESS: "Invalid Address. Allowed characters are : alphanumeric characters, space and  % & : , ) ( . _ ' - / ;",
                    POSTAL_CODE: "Invalid postal code. Only alphanumeric characters are allowed.",
                    OTP: "Invalid OTP. Only numbers are allowed.",
                    CARD_NUMBER: "Invalid Card Number. Only numbers and space are allowed.",
                    APPLICATION_CODE: "Invalid value. Allowed characters are : alphanumeric, space and & - # * +' , ( ) [ ] $ : . / \ ` ! $ _ [ ] | ?",
                    APPLICATION_NAME: "Invalid value. Allowed characters are : alphanumeric, space and & - # * +' , ( ) [ ] $ : . / \ ` ! $ _ [ ] | ?",
                    APPLICATION_DESCRIPTION: "Invalid value. Allowed characters are : alphanumeric, space and & - # * +' , ( ) [ ] $ : . / \ ` ! $ _ [ ] | ?",
                    USER_ID: "Invalid User Id.  Allowed characters are : alphanumeric and . @ _",
                    BILLER_NAME: "Please enter a valid name. Allowed characters are : alphanumeric, space and . _",
                    SSN: "Invalid SSN. Only numbers and hyphen (-) are allowed",
                    PHONE_NO: "Invalid phone number. Only numbers are allowed.",
                    IP_ADDRESS: "Invalid IP Address",
                    URL: "Invalid URL",
                    PORT: "Invalid port number. Only numbers are allowed.",
                    BRANCH: "Invalid Branch Code. Only alphanumeric characters are allowed.",
                    VEHICLE_MODEL: "Enter valid vehicle model. Allowed characters are : alphanumeric characters and space",
                    REGISTRATION_NO: "Enter valid registration number. Allowed characters are : alphanumeric characters and space",
                    YEAR: "Enter a valid year. Only numbers are allowed.",
                    OIN_NUMBER: "Invalid oin number. Only alphanumeric characters are allowed.",
                    PAYMENT_DETAILS: "Invalid payment details. Allowed characters are : alphanumeric, space and - + : , ) ( . ' ? /",
                    ATTRIBUTE_MASK: "Please enter valid attribute mask",
                    LATITUDE: "Please enter valid latitude",
                    LONGITUDE: "Please enter valid longitude"
                }
            },
            ar: true,
            fr: true,
            cs: true,
            sv: true,
            en: false,
            "en-us": false,
            el: false
        };
    };
    return new OBDXLocale();
});