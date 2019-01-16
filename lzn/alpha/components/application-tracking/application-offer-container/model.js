define([], function() {
  "use strict";
  /**
   * Main file for Offer Acceptance Model. This file contains the model definition
   * for additional information section and exports the AdditionalInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Additional
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[fetchComponents()]{@link AdditionalInfoModel.fetchComponents}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace AdditionalInfo~AdditionalInfoModel
   * @class AdditionalInfoModel
   */
  var OfferAcceptanceContainerModel = function() {
    return {

    };
  };
  return new OfferAcceptanceContainerModel();
});