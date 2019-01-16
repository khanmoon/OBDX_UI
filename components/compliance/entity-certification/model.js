define(["baseService"], function(BaseService) {
  "use strict";
  var Model = function() {
    var baseService = BaseService.getInstance();
    var modelPayload = function() {
      return {
        "dictionaryArray": [{
          "nameValuePairDTOArray": [{
            "name": null,
            "genericName": null,
            "value": null,
            "datatype": null
          }],
          "fullyQualifiedClassName": null
        }],
        "refLinks": [{
          "href": null,
          "rel": null,
          "method": null
        }],
        "partyId": {
          "displayValue": null,
          "value": null,
          "indirectionType": null,
          "maskingQualifier": null,
          "maskingAttribute": null
        },
        "title": null,
        "fullName": null,
        "addressDetails": {
          "line1": null,
          "line2": null,
          "line3": null,
          "line4": null,
          "line5": null,
          "line6": null,
          "line7": null,
          "line8": null,
          "line9": null,
          "line10": null,
          "city": null,
          "state": null,
          "country": null,
          "zipCode": null
        },
        "addressType": null,
        "mailingAddress": {
          "line1": null,
          "line2": null,
          "line3": null,
          "line4": null,
          "line5": null,
          "line6": null,
          "line7": null,
          "line8": null,
          "line9": null,
          "line10": null,
          "city": null,
          "state": null,
          "country": null,
          "zipCode": null
        },
        "nationality": null,
        "countryOfBirth": null,
        "cityOfBirth": null,
        "identificationType": null,
        "identificationNumber": null,
        "fathersName": null,
        "spouseName": null,
        "occupationDetails": null,
        "getpEPstatus": null,
        "taxResidencyInfo": [{
          "dictionaryArray": [{
            "nameValuePairDTOArray": [{
              "name": null,
              "genericName": null,
              "value": null,
              "datatype": null
            }],
            "fullyQualifiedClassName": null
          }],
          "refLinks": [{
            "href": null,
            "rel": null,
            "method": null
          }],
          "taxResidenceCountry": null,
          "taxIdentifierType": null,
          "taxIdentifier": null,
          "istINAvailable": null,
          "gettIN": null,
          "gettINNonAvailabilityReason": null
        }],
        "grossAnnualIncome": null,
        "domesticTaxResident": null,
        "domesticEntity": null,
        "isuSCitizen": null,
        "issPTstatus": null,
        "isuSGreenCardOwner": null
      };
    };
    return {
      mepartyFATCApost: function(payload) {
        var options = {
          url : "me/party/FATCA",
          data: payload
        };
        return baseService.add(options);
      },
      getNewModel: function() {
        return new modelPayload();
      }
    };
  };
  return new Model();
});
