/**
 * Model for code-generation-search
 * @param {object} BaseService base service instance for server communication
 * @return {object} CodeGenerationSearchModel Modal instance
 */
define(["baseService"], function(BaseService) {
	"use strict";
	var CodeGenerationSearchModel = function() {
		/**
		 * baseService instance through which all the rest calls will be made.
		 *
		 * @attribute baseService
		 * @type {Object} BaseService Instance
		 * @private
		 */
		var baseService = BaseService.getInstance();

		return {

			/**
			 * fetchTierDetails - description
			 *
			 * @param  {Object} methodType method Type of the rest
			 * @param  {Object} uri        uri of the rest
			 * @return {Object}            fetches tier details
			 */

			fetchTierDetails: function(methodType, uri) {
				var params = {
						methodType: methodType,
						uri: uri
					},
					options = {
						url: "tierdetails/{methodType}/{uri}"
					};
				return baseService.fetch(options, params);
			}
		};
	};
	return new CodeGenerationSearchModel();
});
