/**
 * Model for code-generation
 * @param {object} BaseService base service instance for server communication
 * @return {object} CodeGenerationModel Modal instance
 */
define(["baseService"], function(BaseService) {
	"use strict";
	var CodeGenerationModel = function() {

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
			 * fetchCodeGen - method that accepts tier details and generates scripts accordingly.
			 *
			 * @param  {Object} tierDetailsDTO data transfer object containing tier details
			 * @return {Object}                text file containing scripts
			 */
			fetchCodeGen: function(tierDetailsDTO) {


				var params = {
						tierDetailsDTO: tierDetailsDTO
					},
					options = {
						url: "tierdetails?tierDetailsDTO={tierDetailsDTO}"
					};
				return baseService.downloadFile(options, params);
			}
		};
	};
	return new CodeGenerationModel();
});
