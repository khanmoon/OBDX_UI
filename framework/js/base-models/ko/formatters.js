/**
 * This file lists all the methods needed for formatting.
 * @requires ojs/ojcore
 * @requires ojs/ojvalidation
 * @requires knockout
 */
define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "base-models/validations/obdx-locale",
  "framework/js/constants/constants",
  "ojs/ojvalidation"
], function(oj, ko, $, BaseLocale, Constants) {
  /**
   * This file lists all the methods needed for formatting.
   * @class
   * @alias Formatter
   * @memberof module:baseModel
   */
  "use strict";
  var FormatterModel = function(Localization) {
    /**
     * Assign <code>this</code> to <code>self</code>.
     * @member {Object}
     */
    var self = this;
    /**
     * This function is used to format the number into percent value
     * @function formatNumber
     * @instance
     * @memberof Formatter
     * @param {Float} number        - This field indicates the number in decimal format which has to be formatted
     * @param {String} style         - This field indicates the style which should be used for formatting the number, like percent or decimal
     * @param {Integer} [maximumFractionDigits=2] - This field indicates the maximum digits permissible after the decimal.
     * @param {Integer} [minimumFractionDigits=2] -  This field indicates the minimum digits permissible after the decimal.
     * @returns {String} The formatted number e.g. <code>50.00%</code>.
     * @example
     * self.formatNumber(63.2512/100, 'percent', 2, 1);
     * // returns "63.25%"
     */
    self.formatNumber = function(number, style, maximumFractionDigits, minimumFractionDigits) {
      var formatOption, numberConverter;
      maximumFractionDigits = maximumFractionDigits || 2;
      minimumFractionDigits = minimumFractionDigits || 2;
      formatOption = {
        style: style,
        maximumFractionDigits: maximumFractionDigits,
        minimumFractionDigits: minimumFractionDigits
      };
      numberConverter = oj.Validation.converterFactory("number").createConverter(formatOption);
      return numberConverter.format(number);
    };

    /**
     * This function is used to format the date as per the standard format of the users locale.
     * It internally uses <code>oj.Validation.converterFactory</code> for formatting.<br>
     * <table class="params">
     * <thead>
     * <tr>
     * <th>Format</th>
     * <th class="last">Style</th>
     * </tr>
     * </thead>
     * <tbody>
     * <tr>
     * <td class="name">dateFormat</td>
     * <td class="type">dd MMM yyyy</td>
     * </tr>
     * <tr>
     * <td class="name">dateMonthFormat</td>
     * <td class="type">dd MMM</td>
     * </tr>
     * <tr>
     * <td class="name">dateTimeStampFormat</td>
     * <td class="type">dd MMM yyyy hh:mm:ss a</td>
     * </tr>
     * <tr>
     * <td class="name">dateTimehhmmFormat</td>
     * <td class="type">dd MMM yyyy hh:mm a</td>
     * </tr>
     * <tr>
     * <td class="name">timeFormat</td>
     * <td class="type">h:mm a</td>
     * </tr>
     * <tr>
     * <td class="name">monthYearFormat</td>
     * <td class="type">MMM yyyy</td>
     * </tr>
     * <tr>
     * <td class="name">dateTimeFormat</td>
     * <td class="type">dd MMM hh:mm a</td>
     * </tr>
     * <tr>
     * <td class="name">timeStampFormat</td>
     * <td class="type">hh:mm:ss</td>
     * </tr>
     * </tbody>
     * </table>
     * @function formatDate
     * @memberof Formatter
     * @instance
     * @param {String} date  The unformatted date string
     * @param {String} [dateFormat=dateFormat]  The date format, if any custom format is required.
     * @returns {String} The formatted date is returned.
     * @example
     * self.formatDate("2017-10-03T19:43:45.695Z", "dateTimeStampFormat")
     * // returns "04 Oct 2017 01:13:45 AM"
     */
    self.formatDate = function(date, dateFormat) {
      var dateConverter, pattern,
        localeDate = ko.utils.unwrapObservable(date);
      var conversionDate = null;
      if (!localeDate || localeDate === "") {
        return "";
      }
      if (localeDate.length > 19 && Constants.timezoneOffset) {
        conversionDate = new Date(localeDate);
        conversionDate.setMinutes(conversionDate.getMinutes() + conversionDate.getTimezoneOffset() + (-1 * Constants.timezoneOffset));
      }
      dateFormat = dateFormat || "dateFormat";
      pattern = BaseLocale.formats[dateFormat];
      dateConverter = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
        pattern: pattern
      });
      return dateConverter.format(conversionDate ? oj.IntlConverterUtils.dateToLocalIso(conversionDate) : localeDate);
    };

    /**
     * Returns <code>DateTimeConverter</code> object using date format as <code>dd MMM YYYY</code>.
     * @instance
     * @memberof Formatter
     * @alias dateConverter
     * @type {DateTimeConverter}
     */
    self.dateConverter = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
      pattern: BaseLocale.formats.dateFormat
    });

    /**
     * Returns <code>DateTimeConverter</code> object using time format as <code>hh:mm</code>.
     * @instance
     * @memberof Formatter
     * @alias timeConverter
     * @type {DateTimeConverter}
     */
    self.timeConverter = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
      "hour": "2-digit",
      "hour12": false,
      "minute": "2-digit"
    });

    /**
     * Returns <code>DateTimeConverter</code> object using date time format as <code>dd MMM yyyy hh:mm a</code>.
     * @instance
     * @memberof Formatter
     * @alias dateTimeConverter
     * @type {DateTimeConverter}
     */
    self.dateTimeConverter = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
      pattern: BaseLocale.formats.dateTimehhmmFormat
    });

    /**
     * This function is used to format the currency as per the standard format for a particular currency.
     * @instance
     * @function formatCurrency
     * @param {Float} amount        This field indicates the amount in decimal format which has to be formatted
     * @param {String} currencyCode     This field indicates the standard ISO currency code which should be used for formatting the amount
     * @memberof Formatter
     * @returns {String} The formatted amount e.g. $5,000.00
     * @example self.formatCurrency(2502.25, 'GBP') //returns "£2,502.25"
     */
    self.formatCurrency = function(amount, currencyCode) {
      var salOptions = {
          style: "currency",
          currency: currencyCode,
          useGrouping: true
        },
        salaryConverter = oj.Validation.converterFactory("number").createConverter(salOptions);
      return salaryConverter.format(amount);
    };

    /**
     * Return value corresponding to key in <code>obdx-locale</code>.
     * @param  {String} key The key for which value is required.
     * @return {*}     The value against the specified key.
     */
    self.getLocaleValue = function(key) {
      return BaseLocale.formats[key];
    };

    self.updateFormatter = function(override) {
      if (override && override.formats) {
        $.extend(BaseLocale.formats, override.formats);
      }
    };
    if (Localization) {
      self.updateFormatter(Localization.obdxLocale);
    }
  };
  return FormatterModel;
});
