define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";
  /**
   * Main file for Feedback Model. This file contains the model definition
   * for list of scales fetched from the server from table digx_fd_scale  through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link FeedbackModel.init}</li>
   *
   *              <li>[getProperty()]{@link FeedbackModel.getFeedbackScale}</li>
   *
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~FeedbackModel
   * @class FeedbackModel
   */
  var FeedbackModel = function () {
    var baseService = BaseService.getInstance();
    return {
      getFeedbackScale: function () {
        return baseService.fetch({
          url: "feedback/ratingScales"
        });
      },
      getFeedbackScaleImage: function (contentId) {
        return baseService.fetch({
          url: "contents/{contentId}"
        }, {
          contentId: contentId
        });
      },
      getScaleSVGPath: function () {
        return baseService.fetchJSON({
          url: "scaleSVG"
        });
      }
    };
  };

  return new FeedbackModel();
});
