/**
 * This file lists all the methods needed for validations.
 */
define(["jquery", "base-models/validations/obdx-locale"], function($, obdxLocale) {
  /**
   * This file lists all the methods needed for validations.
   * @class
   * @alias Validations
   * @memberof module:baseModel
   */
  "use strict";
  var Validations = function(Localization) {
    /**
     * Assign <code>this</code> to <code>self</code>.
     * @member {Object}
     */
    var self = this;
    /**
     * This function is used to generate the validation object from specified arguments.
     * @function getValidator
     * @instance
     * @memberof Validations
     * @param  {String} key       Key of the object required from <code>obdx-locale</code> or <code>data-type</code> if <code>extension</code> argument is supplied.
     * @param  {String} [message]  The custom validation message to be shown.
     * @param  {Object} [extension] The validation object to be passed to override/add validation like length, number range, etc.<br>
     *                              If specified, the <code>key</code> is no longer a key from <code>obdx-locale</code> but from <code>data-type</code>.
     * @return {Validator}         Returns the Oracle JET validator object.
     * @example
     * self.getValidator('ACCOUNT');
     * self.getValidator('ACCOUNT', 'My custom validation message');
     * self.getValidator('AlphanumericWithSpace', 'My required validation message',
     * {
     *  type: 'numberRange',
     *  options: {
     *    min: 2,
     *    max: 10
     *  }
     *  });
     */
    self.getValidator = function(key, message, extension) {
      if (extension) {
        return [{
          type: "regExp",
          options: {
            pattern: obdxLocale.DataTypes[key],
            messageDetail: message
          }
        }, extension];
      } else if (message) {
        var clone = JSON.parse(JSON.stringify(obdxLocale.validations[key]));
        clone[0].options.messageDetail = message;
        return clone;
      }
      return obdxLocale.validations[key];
    };

    /**
     * This function is used to display the validation errors if any for a form, and automatically focus on the first erroneous field.
     * @function showComponentValidationErrors
     * @instance
     * @param {object} trackerObj  - This knockout observable tracking the form.
     * @memberof Validations
     * @returns {Boolean}  True in case all validations succeed, false otherwise.
     */
    self.showComponentValidationErrors = function(trackerObj) {
      if (trackerObj && trackerObj.valid !== "valid") {
        trackerObj.showMessages();
        trackerObj.focusOn("@firstInvalidShown");
        return false;
      }
      return true;
    };
    self.updateValidation = function(override) {
      if (override && override.validations) {
        Object.keys(override.validations).forEach(function(key) {
          for (var i = 0; i < override.validations[key].length; i++) {
            var notfound = true;
            for (var j = 0; j < obdxLocale.validations[key].length; j++) {
              if (override.validations[key][i].type === obdxLocale.validations[key][j].type) {
                obdxLocale.validations[key][j] = override.validations[key][i];
                notfound = false;
                break;
              }
            }
            if (notfound) {
              obdxLocale.validations[key].push(override.validations[key][i]);
            }
          }
        });
      }
    };
    if (Localization) {
      self.updateValidation(Localization.obdxLocale);
    }
  };
  return Validations;
});
