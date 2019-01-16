define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/feedback",
  "ojs/ojbutton"
], function(oj, ko, $, FeedbackModel, resourceBundle) {
  "use strict";
  /**
   * File contains the view model for listing of properties realated to db table digx_fw_configallb
   *
   * @property {Boolean}  templateLoaded       - Initially self flag is set to false until data is fetched from server
   *                                            and ready to display on UI.
   * return function - description
   *
   * @param  {Object} params parent context
   * @return {void}
   */
  return function(params) {
    var self = this;
    if (params.rootModel.params.fromApproval) {
      params.rootModel.params.feedbackHomeDTO = params.rootModel.params.feedbackHomeDTO();
      params.rootModel.params.feedbackDefinitionDTO = params.rootModel.params.feedbackDefinitionDTO();
      ko.utils.extend(self, params.rootModel.params);
    } else {
      ko.utils.extend(self, params.rootModel);
    }
    self.resource = resourceBundle;
    self.fromReview = ko.observable(false);
    self.templateLoaded = ko.observableArray(false);
    params.dashboard.headerName(self.resource.title);
    self.transactionName = ko.observable(self.resource.message);
    params.baseModel.registerElement("confirm-screen");
    self.selectedScale(params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleId);
    self.showViewFlag = ko.observable(params.rootModel.params.isViewFlag ? params.rootModel.params.isViewFlag : false);
    self.componentsToLoad = [{
        label: self.resource.titleForTemplate,
        id: "feedback-template-landing"
      },
      {
        label: self.resource.selectScale,
        id: "feedback-scale-configuration"
      },
      {
        label: self.resource.selectQuestions,
        id: "feedback-question-configurations"
      },
      {
        label: self.resource.linkTransaction,
        id: "feedback-transaction-configuration"
      }
    ];
    self.backToSearch = function() {
      params.dashboard.loadComponent("feedback-template-search", {}, self);
    };
    self.addTemplate = function() {
      var transactionsList = [];
      var feedbackObject = null;
      var definitionDTOs = [];
      var transactionCount = 0;
      params.rootModel.params.feedbackDefinitionDTO.forEach(function(dto) {
        transactionCount++;
        if (typeof dto.temp_transactions === "object") {
          if (dto.temp_transactions.length > 1) {
            dto.transactionId(dto.temp_transactions[0]);
            dto.transactionGroupId(transactionCount);
            transactionsList = dto.temp_transactions;
            definitionDTOs.push(dto);
            for (var k = 1; k < transactionsList.length; k++) {
              feedbackObject = JSON.parse(JSON.stringify(dto));
              feedbackObject.transactionId = transactionsList[k];
              feedbackObject.transactionGroupId = transactionCount;
              feedbackObject.ratings = ko.mapping.fromJS(dto.ratings());
              definitionDTOs.push(feedbackObject);
            }
          } else if (dto.temp_transactions.length === 1) {
            dto.transactionId = JSON.parse(JSON.stringify(dto.temp_transactions[0]));
            dto.transactionGroupId = transactionCount;
            definitionDTOs.push(dto);
          }
        } else if (dto.temp_transactions && dto.temp_transactions().length > 1) {
          dto.transactionId = dto.temp_transactions()[0];
          dto.transactionGroupId = transactionCount;
          transactionsList = dto.temp_transactions();
          definitionDTOs.push(dto);
          for (var v = 1; v < transactionsList.length; v++) {
            feedbackObject = JSON.parse(JSON.stringify(dto));
            feedbackObject.transactionId = transactionsList[v];
            feedbackObject.transactionGroupId = transactionCount;
            feedbackObject.ratings = ko.mapping.fromJS(dto.ratings());
            definitionDTOs.push(feedbackObject);
          }
        } else if (dto.temp_transactions && dto.temp_transactions().length === 1) {
          dto.transactionId = JSON.parse(JSON.stringify(dto.temp_transactions()[0]));
          dto.transactionGroupId = transactionCount;
          definitionDTOs.push(dto);
        }
      });
      var flag = -1,
        transactionObj = null,
        tempOption = null,
        newDefDTO = [],
        defdto = null;
      definitionDTOs.forEach(function(dto) {
        defdto = null;
        defdto = JSON.parse(ko.toJSON(dto));
        flag = self.feedbackOriginalDTO.indexOf(defdto.transactionId);
        if (flag > -1) {
          self.fetchedTransactions().forEach(function(transaction) {
            if (transaction.transactionId === defdto.transactionId) {
              transactionObj = JSON.parse(JSON.stringify(transaction));
            }
          });
          transactionObj.ratings.reverse();
          defdto.version = transactionObj.version;
          for (var a = 0; a < defdto.ratings.length; a++) {
            defdto.ratings[a].version = transactionObj.ratings[a].version;
            for (var b = 0; b < defdto.ratings[a].questionRequestList.length; b++) {
              if (defdto.ratings[a].questionRequestList[b].questionId === transactionObj.ratings[a].questionRequestList[b].questionId) {
                defdto.ratings[a].questionRequestList[b].version = JSON.parse(JSON.stringify(transactionObj.ratings[a].questionRequestList[b].version));
                defdto.ratings[a].questionRequestList[b].questionDefintionId = JSON.parse(JSON.stringify(transactionObj.ratings[a].questionRequestList[b].questionDefintionId));
              }
              for (var c = 0; c < defdto.ratings[a].questionRequestList[b].optionsRequestList.length; c++) {
                if (transactionObj.ratings[a].questionRequestList[b].optionsRequestList[c]) {
                  tempOption = null;
                  tempOption = ko.utils.arrayFilter(transactionObj.ratings[a].questionRequestList[b].optionsRequestList, function(obj) {
                    if (obj.optionId === defdto.ratings[a].questionRequestList[b].optionsRequestList[c].optionId) {
                      return obj;
                    }
                  });
                  if (tempOption[0]) {
                    defdto.ratings[a].questionRequestList[b].optionsRequestList[c].version = tempOption[0].version;
                  }
                }
              }
            }
          }
        } else {
          defdto.ratings.forEach(function(rating) {
            rating.questionRequestList.forEach(function(question) {
              question.questionDefintionId = null;
            });
          });
        }
        newDefDTO.push(JSON.parse(JSON.stringify(defdto)));
      });
      var enterpriseRolesModified = [];
      for (var e = 0; e < params.rootModel.params.feedbackHomeDTO.roles.length; e++) {
        enterpriseRolesModified.push(params.rootModel.params.feedbackHomeDTO.roles[e].toLowerCase());
      }
      var feedbackDefinitionDTO = {
        templateIdentifier: params.rootModel.params.feedbackHomeDTO.templateIdentifier,
        templateName: params.rootModel.params.feedbackHomeDTO.templateName,
        templateDescription: params.rootModel.params.feedbackHomeDTO.templateDescription,
        scaleDTO: {
          scaleId: params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleId,
          scaleType: self.scaleTypeText() + params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleId
        },
        templateId: params.rootModel.params.feedbackHomeDTO.templateId ? params.rootModel.params.feedbackHomeDTO.templateId : null,
        version: params.rootModel.params.feedbackHomeDTO.version ? params.rootModel.params.feedbackHomeDTO.version : null,
        enterpriseRoles: enterpriseRolesModified,
        definitionDTOs: newDefDTO
      };
      FeedbackModel.addTemplate(ko.mapping.toJSON(feedbackDefinitionDTO, {
        "ignore": ["temp_questionSelected", "temp_optionsRequestList", "temp_questionDescription", "temp_selectedOptions", "temp_transactions", "temp_txnCollection", "transactions_count"]
      }), params.rootModel.params.feedbackHomeDTO.templateId).done(function(data, status, jqXhr) {
        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.transactionName(),
          template: "feedback/feedback-create-confirmation"
        }, self);
      });
    };
    self.edit = function(event) {
      self.fromReview(true);
      if (event.id === "feedback-template-landing") {
        self.reviewTemplate(false);
        params.dashboard.loadComponent(event.id, {
          feedbackHomeDTO: params.rootModel.params.feedbackHomeDTO
        }, self);
      } else {
        self.selectedStepValue(event.id);
        self.disableInputsGlobal(false);
        params.dashboard.loadComponent("feedback-home", {
          feedbackHomeDTO: params.rootModel.params.feedbackHomeDTO
        }, self);
      }
    };
    self.toLastStep = function(event) {
      self.fromReview(true);
      if (event.id === "feedback-template-landing") {
        self.reviewTemplate(false);
        params.dashboard.loadComponent(event.id, {
          feedbackHomeDTO: params.rootModel.params.feedbackHomeDTO
        }, self);
      } else {
        self.disableInputsGlobal(false);
        params.dashboard.loadComponent("feedback-home", {
          feedbackHomeDTO: params.rootModel.params.feedbackHomeDTO
        }, self);
      }
    };
  };
});
