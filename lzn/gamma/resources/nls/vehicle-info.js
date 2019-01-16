define([
  "ojL10n!lzn/gamma/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var propertyInfoLocale = function() {
    return {
      root: {
        ownershipType: "Vehicle Ownership",
        owner: "Owner",
        vehicleAge: "New or Used",
        vehicleType: "Vehicle Type",
        vehicleIdNumber: "Vehicle Identification Number",
        vehicleIdNumberOptional: "Vehicle Identification Number <br>(optional)",
        year: "Year",
        yearMsg: "Should be under {yearPolicy} years old",
        vehiclemake: "Make",
        vehicleModel: "Model",
        estValue: "Estimated Value",
        mileage: "Mileage",
        single: "Single",
        joint: "Joint",
        ownersOfTheProperty: "Owners",
        mileageMsg: "Should not be more than {mileagePolicy}",
        new: "New",
        used: "Used",
        optional: "(optional)",
        vehicleInfo: "Vehicle Information",
        vehicleNumRequirement: "A 17 character identifier unique to each vehicle. The Vehicle Identification Number (VIN) can be found on the lower-left corner of the dashboard or instrument panel.",
        vehicleNumRequirementAlt: "What is vehicle number?",
        vehicleNumRequirementTitle: "What is vehicle number? tooltip",
        mileageRequirement: "The total distance covered by the vehicle in miles",
        mileageRequirementAlt: "What is Mileage?",
        mileageRequirementTitle: "What is Mileage? tooltip",
        vehicleMsg: "Please specify details of the vehicle you are purchasing",
        lookup: "Lookup Vehicle",
        registrationState: "Registration State",
        messages: {
          currency: "Please select a currency",
          years: "Please select no of year(s)",
          vehicleModel: "Please select vehicle Model",
          vehicleModelOther: "Please enter vehicle Model",
          mileage: "Please enter mileage",
          vehicleId: "Please enter vehicle Id",
          vehicleMake: "Please enter vehicle Make",
          vehicleNumError: "Please provide vehicle identification number in order to lookup vehicle information.",
          invalidVin: "Invalid Vehicle Identification Number",
          invalidMileage: "Please enter valid mileage"
        },
        submitVehicle: "Click here to Submit Vehicle Information",
        generic: Generic

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
  return new propertyInfoLocale();
});
