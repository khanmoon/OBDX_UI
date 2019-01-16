define(["extensions/override/task-component-mapping", "jquery"], function(extension, $) {
  "use strict";
  var tasks = {
    "UM_N_UMD": {
      "initComponent": {
        "name": "users-create",
        "module": "user-management"
      },
      "reviewComponent": {
        "name": "review-user-update",
        "module": "user-management"
      }
    },
    "SR_M_FBU": {
      "initComponent": {
        "name": "service-request-approval-view",
        "module": "service-requests"
      },
      "reviewComponent": {
        "name": "service-request-approval-view",
        "module": "service-requests"
      }
    },
    "UM_N_UCR": {
      "initComponent": {
        "name": "users-create",
        "module": "user-management"
      },
      "reviewComponent": {
        "name": "review-user-create",
        "module": "user-management"
      }
    },
    "AP_N_CWF": {
      "initComponent": {
        "name": "workflow-view",
        "module": "approvals"
      },
      "reviewComponent": {
        "name": "workflow-review",
        "module": "approvals"
      }
    },
    "AP_N_UWF": {
      "initComponent": {
        "name": "workflow-view",
        "module": "approvals"
      },
      "reviewComponent": {
        "name": "workflow-review",
        "module": "approvals"
      }
    },
    "AP_N_UR": {
      "initComponent": {
        "name": "rules-create",
        "module": "approvals"
      },
      "reviewComponent": {
        "name": "rules-review",
        "module": "approvals"
      }
    },
    "AP_N_CR": {
      "initComponent": {
        "name": "rules-create",
        "module": "approvals"
      },
      "reviewComponent": {
        "name": "rules-review",
        "module": "approvals"
      }
    },
    "PP_N_UPD": {
      "initComponent": {
        "name": "preference-base",
        "module": "customer-preference"
      },
      "reviewComponent": {
        "name": "review-modify-customer-preference",
        "module": "customer-preference"
      }
    },
    "AP_N_CUG": {
      "initComponent": {
        "name": "user-group-view",
        "module": "approvals"
      },
      "reviewComponent": {
        "name": "user-group-review",
        "module": "approvals"
      }
    },
    "AP_N_UUG": {
      "initComponent": {
        "name": "user-group-view",
        "module": "approvals"
      },
      "reviewComponent": {
        "name": "user-group-review",
        "module": "approvals"
      }
    },
    "AT_N_UCA": {
      "initComponent": {
        "name": "access-management-base",
        "module": "account-access-management"
      },
      "reviewComponent": {
        "name": "review-party-access-management",
        "module": "account-access-management"
      }
    },
    "AT_N_CCA": {
      "initComponent": {
        "name": "access-management-base",
        "module": "account-access-management"
      },
      "reviewComponent": {
        "name": "review-party-access-management",
        "module": "account-access-management"
      }
    },
    "AT_N_DCA": {
      "initComponent": {
        "name": "access-management-base",
        "module": "account-access-management"
      },
      "reviewComponent": {
        "name": "review-party-access-management",
        "module": "account-access-management"
      }
    },
    "PC_N_PCL": {
      "initComponent": {
        "name": "payee-restrictions-landing",
        "module": "payee-restrictions"
      },
      "reviewComponent": {
        "name": "review-payee-restrictions",
        "module": "payee-restrictions"
      }
    },
    "PAT_N_CA": {
      "initComponent": {
        "name": "access-management-base",
        "module": "account-access-management"
      },
      "reviewComponent": {
        "name": "review-linked-party-access-management",
        "module": "account-access-management"
      }
    },
    "PAT_N_UA": {
      "initComponent": {
        "name": "access-management-base",
        "module": "account-access-management"
      },
      "reviewComponent": {
        "name": "review-linked-party-access-management",
        "module": "account-access-management"
      }
    },
    "PAT_N_DA": {
      "initComponent": {
        "name": "access-management-base",
        "module": "account-access-management"
      },
      "reviewComponent": {
        "name": "review-linked-party-access-management",
        "module": "account-access-management"
      }
    },
    "UAT_N_UA": {
      "initComponent": {
        "name": "access-management-base",
        "module": "account-access-management"
      },
      "reviewComponent": {
        "name": "review-user-access-management",
        "module": "account-access-management"
      }
    },
    "UAT_N_CA": {
      "initComponent": {
        "name": "access-management-base",
        "module": "account-access-management"
      },
      "reviewComponent": {
        "name": "review-user-access-management",
        "module": "account-access-management"
      }
    },
    "UAT_N_DA": {
      "initComponent": {
        "name": "access-management-base",
        "module": "account-access-management"
      },
      "reviewComponent": {
        "name": "review-user-access-management",
        "module": "account-access-management"
      }
    },
    "LAT_N_CA": {
      "initComponent": {
        "name": "access-management-base",
        "module": "account-access-management"
      },
      "reviewComponent": {
        "name": "review-linked-user-access-management",
        "module": "account-access-management"
      }
    },
    "LAT_N_UA": {
      "initComponent": {
        "name": "access-management-base",
        "module": "account-access-management"
      },
      "reviewComponent": {
        "name": "review-linked-user-access-management",
        "module": "account-access-management"
      }
    },
    "LAT_N_DA": {
      "initComponent": {
        "name": "access-management-base",
        "module": "account-access-management"
      },
      "reviewComponent": {
        "name": "review-linked-user-access-management",
        "module": "account-access-management"
      }
    },
    "PP_N_CRE": {
      "initComponent": {
        "name": "preference-base",
        "module": "customer-preference"
      },
      "reviewComponent": {
        "name": "review-create-customer-preference",
        "module": "customer-preference"
      }
    },
    "FU_N_CFR": {

      "initComponent": {

      },

      "reviewComponent": {
        "name": "review-file-identifier",
        "module": "file-upload"
      }
    },
    "FU_N_UFR": {
      "initComponent": {

      },

      "reviewComponent": {
        "name": "review-file-identifier",
        "module": "file-upload"
      }
    },
    "FU_N_UUM": {

      "initComponent": {

      },

      "reviewComponent": {
        "name": "review-user-map",
        "module": "file-upload"
      }
    },
    "AP_N_DR": {
      "initComponent": {
        "name": "rules-create",
        "module": "approvals"
      },
      "reviewComponent": {
        "name": "rules-review",
        "module": "approvals"
      }
    },

    "CP_LIN": {
      "initComponent": {
        "name": "linkage-base",
        "module": "party-linkage"
      },
      "reviewComponent": {
        "name": "linkage-review",
        "module": "party-linkage"
      }
    },

    "UP_LIN": {
      "initComponent": {
        "name": "linkage-base",
        "module": "party-linkage"
      },
      "reviewComponent": {
        "name": "linkage-review",
        "module": "party-linkage"
      }
    },
    "AL_N_UPD": {
      "initComponent": {
        "name": "alerts-maintenance",
        "module": "alerts"
      },
      "reviewComponent": {
        "name": "alerts-maintenance",
        "module": "alerts"
      }
    },
    "AL_N_CR": {
      "initComponent": {
        "name": "alerts-maintenance",
        "module": "alerts"
      },
      "reviewComponent": {
        "name": "alerts-maintenance",
        "module": "alerts"
      }
    },
    "AL_N_DEL": {
      "initComponent": {
        "name": "alerts-maintenance",
        "module": "alerts"
      },
      "reviewComponent": {
        "name": "alerts-maintenance",
        "module": "alerts"
      }
    },
    "SM_N_CTB": {
      "initComponent": {
        "name": "transaction-blackout-review",
        "module": "transaction-blackout"
      },
      "reviewComponent": {
        "name": "transaction-blackout-review",
        "module": "transaction-blackout"
      }
    },
    "SM_N_UTB": {
      "initComponent": {
        "name": "transaction-blackout-review",
        "module": "transaction-blackout"
      },
      "reviewComponent": {
        "name": "transaction-blackout-review",
        "module": "transaction-blackout"
      }
    },
    "SM_N_DTB": {
      "initComponent": {
        "name": "transaction-blackout-review",
        "module": "transaction-blackout"
      },
      "reviewComponent": {
        "name": "transaction-blackout-review",
        "module": "transaction-blackout"
      }
    },
    "WW_N_CWW": {
      "initComponent": {
        "name": "create-standard-work-window",
        "module": "cutoff"
      },
      "reviewComponent": {
        "name": "review-working-window",
        "module": "cutoff"
      }
    },
    "WW_N_UWW": {
      "initComponent": {
        "name": "create-standard-work-window",
        "module": "cutoff"
      },
      "reviewComponent": {
        "name": "review-working-window",
        "module": "cutoff"
      }
    },
    "WW_N_DWW": {
      "initComponent": {
        "name": "review-standard-work-window",
        "module": "cutoff"
      },
      "reviewComponent": {
        "name": "review-working-window",
        "module": "cutoff"
      }
    },
    "UM_N_RCR": {
      "initComponent": {
        "name": "review-user-action",
        "module": "user-management"
      },
      "reviewComponent": {
        "name": "review-user-action",
        "module": "user-management"
      }
    },

    UGSM_N_CM: {
      "initComponent": {
        "name": "mapping-create",
        "module": "usergroup-subject-map"
      },
      "reviewComponent": {
        "name": "review-mapping-create",
        "module": "usergroup-subject-map"
      }

    },

    UGSM_N_UM: {
      "initComponent": {
        "name": "mapping-update",
        "module": "usergroup-subject-map"
      },
      "reviewComponent": {
        "name": "review-mapping-update",
        "module": "usergroup-subject-map"
      }
    },
    "AL_N_CS": {
      "initComponent": {
        "name": "manage-alerts-subscription",
        "module": "alerts"
      },
      "reviewComponent": {
        "name": "manage-alerts-subscription",
        "module": "alerts"
      }
    },
    "AL_N_US": {
      "initComponent": {
        "name": "manage-alerts-subscription",
        "module": "alerts"
      },
      "reviewComponent": {
        "name": "manage-alerts-subscription",
        "module": "alerts"
      }
    },
    "AL_N_DS": {
      "initComponent": {
        "name": "manage-alerts-subscription",
        "module": "alerts"
      },
      "reviewComponent": {
        "name": "manage-alerts-subscription",
        "module": "alerts"
      }
    },
    "TD_N_ATD": {
      "initComponent": {
        "name": "td-amend",
        "module": "term-deposits"
      },
      "reviewComponent": {
        "name": "review-td-amend",
        "module": "term-deposits"
      }
    },
    "TD_F_TTD": {
      "initComponent": {
        "name": "td-topup",
        "module": "term-deposits"
      },
      "reviewComponent": {
        "name": "review-td-topup",
        "module": "term-deposits"
      }
    },
    "TD_F_RTD": {
      "initComponent": {
        "name": "td-redeem",
        "module": "term-deposits"
      },
      "reviewComponent": {
        "name": "review-td-redeem",
        "module": "term-deposits"
      }
    },
    "PC_N_CDDP": {
      "initComponent": {
        "name": "demand-draft-payee",
        "module": "payee"
      },
      "reviewComponent": {
        "name": "review-demand-draft-payee",
        "module": "payee"
      }
    },
    "TD_F_OTD": {
      "initComponent": {
        "name": "td-open",
        "module": "term-deposits",
        "hostReferenceNumber": "result.termDepositDetails.id.displayValue"
      },
      "reviewComponent": {
        "name": "review-td-open",
        "module": "term-deposits"
      }
    },
    "PC_F_PIC": {
      "initComponent": {
        "name": "scheduled-payments",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-scheduled-payments",
        "module": "payments"
      }
    },
    "LN_F_LRP": {
      "initComponent": {
        "name": "loan-repayment",
        "module": "loans"
      },
      "reviewComponent": {
        "name": "review-loan-repayment",
        "module": "loans"
      }
    },
    "PC_F_SFT": {
      "initComponent": {
        "name": "payment-self",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-payment-self",
        "module": "payments"
      }
    },
    "PC_F_SFTI": {
      "initComponent": {
        "name": "payment-self",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-payment-self",
        "module": "payments"
      }
    },
    "PC_F_ITR": {
      "initComponent": {
        "name": "payment-international",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-payment-international",
        "module": "payments"
      }
    },
    "PC_F_ITRI": {
      "initComponent": {
        "name": "payment-international",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-payment-international",
        "module": "payments"
      }
    },
    "PC_F_DFT": {
      "initComponent": {
        "name": "payment-domestic",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-payment-domestic",
        "module": "payments"
      }
    },
    "PC_F_DFTI": {
      "initComponent": {
        "name": "payment-domestic",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-payment-domestic",
        "module": "payments"
      }
    },
    "PC_F_ITF": {
      "initComponent": {
        "name": "payment-internal",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-payment-internal",
        "module": "payments"
      }
    },
    "PC_F_ITFI": {
      "initComponent": {
        "name": "payment-internal",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-payment-internal",
        "module": "payments"
      }
    },
    "PC_F_BPT": {
      "initComponent": {
        "name": "bill-payments",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-bill-payments",
        "module": "payments"
      }
    },
    "PC_N_PBR": {
      "initComponent": {
        "name": "add-biller-main",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-add-biller-main",
        "module": "payments"
      }
    },
    "PC_N_DOP": {
      "initComponent": {
        "name": "domestic-payee",
        "module": "payee"
      },
      "reviewComponent": {
        "name": "review-domestic-payee",
        "module": "payee"
      }
    },
    "PC_N_UPBR": {
      "initComponent": {
        "name": "biller-details-edit",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-biller-details-edit",
        "module": "payments"
      }
    },
    "PC_N_DPBR": {
      "initComponent": {
        "name": "biller-details-edit",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-biller-details-edit",
        "module": "payments"
      }
    },
    "PC_N_CIP": {
      "initComponent": {
        "name": "internal-payee",
        "module": "payee"
      },
      "reviewComponent": {
        "name": "review-internal-payee",
        "module": "payee"
      }
    },
    "PC_N_DIP": {
      "initComponent": {
        "name": "internal-payee",
        "module": "payee"
      },
      "reviewComponent": {
        "name": "review-internal-payee",
        "module": "payee"
      }
    },
    "PC_N_DDP": {
      "initComponent": {
        "name": "domestic-payee",
        "module": "payee"
      },
      "reviewComponent": {
        "name": "review-domestic-payee",
        "module": "payee"
      }
    },
    "PC_N_DITNP": {
      "initComponent": {
        "name": "international-payee",
        "module": "payee"
      },
      "reviewComponent": {
        "name": "review-international-payee",
        "module": "payee"
      }
    },
    "CH_I": {
      "initComponent": {
        "name": "cheque-status-inquiry",
        "module": "demand-deposits"
      },
      "reviewComponent": {
        "name": "review-cheque-status-inquiry",
        "module": "demand-deposits"
      }
    },
    "CH_N_RAS": {
      "initComponent": {
        "name": "physicalStatement",
        "module": "accounts"
      },
      "reviewComponent": {
        "name": "review-physical-statement",
        "module": "accounts"
      }
    },
    "CH_N_CBR": {
      "initComponent": {
        "name": "cheque-book-request",
        "module": "demand-deposits"
      },
      "reviewComponent": {
        "name": "review-cheque-book-request",
        "module": "demand-deposits"
      }
    },
    "CH_N_BDC": {
      "initComponent": {
        "name": "debit-card-hotlisting",
        "module": "demand-deposits"
      },
      "reviewComponent": {
        "name": "review-debit-card-hotlisting",
        "module": "demand-deposits"
      }
    },
    "CH_N_CIN": {
      "initComponent": {
        "name": "cheque-stop-unblock",
        "module": "demand-deposits"
      },
      "reviewComponent": {
        "name": "review-cheque-stop-unblock",
        "module": "demand-deposits"
      }
    },
    "TD_N_RAS": {
      "initComponent": {
        "name": "physicalStatement",
        "module": "accounts"
      },
      "reviewComponent": {
        "name": "review-physical-statement",
        "module": "accounts"
      }
    },
    "CH_N_EST": {
      "initComponent": {
        "name": "eStatement",
        "module": "accounts"
      },
      "reviewComponent": {
        "name": "review-eStatement",
        "module": "accounts"
      }
    },
    "CH_N_RDCP": {
      "initComponent": {
        "name": "debit-card-pin-request",
        "module": "demand-deposits"
      },
      "reviewComponent": {
        "name": "review-debit-card-pin-request",
        "module": "demand-deposits"
      }
    },
    "CH_N_ADC": {
      "initComponent": {
        "name": "debit-card-apply",
        "module": "demand-deposits"
      },
      "reviewComponent": {
        "name": "review-debit-card-apply",
        "module": "demand-deposits"
      }
    },
    "PC_N_CITNP": {
      "initComponent": {
        "name": "international-payee",
        "module": "payee"
      },
      "reviewComponent": {
        "name": "review-international-payee",
        "module": "payee"
      }
    },
    "FU_F_IFT": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "file-approval",
        "module": "file-upload"
      }
    },
    "FU_F_ABS":{
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "file-approval",
        "module": "file-upload"
      }
    },
    "FU_R_ABS":{
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "record-approval",
        "module": "file-upload"
      }
    },
    "FU_F_ILFT": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "file-approval",
        "module": "file-upload"
      }
    },
    "FU_F_DFT": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "file-approval",
        "module": "file-upload"
      }
    },
    "FU_F_MFT": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "file-approval",
        "module": "file-upload"
      }
    },
    "FU_R_IFT": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "record-approval",
        "module": "file-upload"
      }
    },
    "FU_R_ILFT": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "record-approval",
        "module": "file-upload"
      }
    },
    "FU_R_DFT": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "record-approval",
        "module": "file-upload"
      }
    },
    "FU_R_MFT": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "record-approval",
        "module": "file-upload"
      }
    },
    "FU_R_IP": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "record-approval",
        "module": "file-upload"
      }
    },
    "FU_F_IP": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "file-approval",
        "module": "file-upload"
      }
    },
    "FU_R_ILP": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "record-approval",
        "module": "file-upload"
      }
    },
    "FU_F_ILP": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "file-approval",
        "module": "file-upload"
      }
    },
    "FU_F_DP": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "file-approval",
        "module": "file-upload"
      }
    },
    "FU_R_DP": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "record-approval",
        "module": "file-upload"
      }
    },
    "FU_R_DDP": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "record-approval",
        "module": "file-upload"
      }
    },
    "FU_F_DDP": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "file-approval",
        "module": "file-upload"
      }
    },
    "FU_F_MPY": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "file-approval",
        "module": "file-upload"
      }
    },
    "FU_R_MPY": {
      "initComponent": {
        "name": "",
        "module": "file-upload"
      },
      "reviewComponent": {
        "name": "record-approval",
        "module": "file-upload"
      }
    },
    "PC_F_DDD": {
      "initComponent": {
        "name": "issue-demand-draft",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-domestic-demand-draft",
        "module": "payments"
      }
    },
    "PC_F_DDDI": {
      "initComponent": {
        "name": "issue-demand-draft",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-domestic-demand-draft",
        "module": "payments"
      }
    },
    "PC_F_IDD": {
      "initComponent": {
        "name": "issue-demand-draft",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-international-demand-draft",
        "module": "payments"
      }
    },
    "PC_F_IDDI": {
      "initComponent": {
        "name": "issue-demand-draft",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-international-demand-draft",
        "module": "payments"
      }
    },
    "PC_F_GNIP": {
      "initComponent": {
        "name": "adhoc-payments",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-adhoc-payments",
        "module": "payments"
      }
    },
    "PC_F_GNITNP": {
      "initComponent": {
        "name": "adhoc-payments",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-adhoc-payments",
        "module": "payments"
      }
    },
    "PC_F_GNDP": {
      "initComponent": {
        "name": "adhoc-payments",
        "module": "payments"
      },
      "reviewComponent": {
        "name": "review-adhoc-payments",
        "module": "payments"
      }
    },
    "TF_N_CLC": {
      "initComponent": {
        "name": "lc-search",
        "module": "letter-of-credit"
      },
      "reviewComponent": {
        "name": "review-lc",
        "module": "letter-of-credit"
      }
    },
    "TF_N_ALC": {
      "initComponent": {
        "name": "amend-letter-of-credit",
        "module": "letter-of-credit"
      },
      "reviewComponent": {
        "name": "review-amend-lc",
        "module": "letter-of-credit"
      }
    },
    "TF_N_CBL": {
      "initComponent": {
        "name": "list-collection",
        "module": "collection"
      },
      "reviewComponent": {
        "name": "review-collection",
        "module": "collection"
      }
    },
    "USPM_N_CM": {
      "initComponent": {
        "name": "user-segments-product-map",
        "module": "user-segments-product"
      },
      "reviewComponent": {
        "name": "user-segments-product-map",
        "module": "user-segments-product"
      }
    },
    "USPM_N_UM": {
      "initComponent": {
        "name": "user-segments-product-map",
        "module": "user-segments-product"
      },
      "reviewComponent": {
        "name": "user-segments-product-map",
        "module": "user-segments-product"
      }
    },
    "ML_N_CM": {
      "initComponent": {
        "name": "create",
        "module": "mailers"
      },
      "reviewComponent": {
        "name": "review-mailer-create",
        "module": "mailers"
      }
    },
    "ML_N_UM": {
      "initComponent": {
        "name": "edit",
        "module": "mailers"
      },
      "reviewComponent": {
        "name": "review-mailer-edit",
        "module": "mailers"
      }
    },
    "ML_N_DM": {
      "initComponent": {
        "name": "delete",
        "module": "mailers"
      },
      "reviewComponent": {
        "name": "review-mailer-create",
        "module": "mailers"
      }
    },
    "FL_N_CLT": {
      "initComponent": {
        "name": "create-limit",
        "module": "financial-limits"
      },
      "reviewComponent": {
        "name": "review-create-limit",
        "module": "financial-limits"
      }
    },
    "FL_N_CLP": {
      "initComponent": {
        "name": "limit-package",
        "module": "financial-limit-package"
      },
      "reviewComponent": {
        "name": "review-limit-package",
        "module": "financial-limit-package"
      }
    },
    "FL_N_DLT": {
      "initComponent": {
        "name": "limit-view",
        "module": "financial-limits"
      },
      "reviewComponent": {
        "name": "review-create-limit",
        "module": "financial-limits"
      }
    },
    "FL_N_ULP": {
      "initComponent": {
        "name": "limit-package",
        "module": "financial-limit-package"
      },
      "reviewComponent": {
        "name": "review-limit-package",
        "module": "financial-limit-package"
      }
    },
    "FL_N_DLP": {
      "initComponent": {
        "name": "review-limit-package",
        "module": "financial-limit-package"
      },
      "reviewComponent": {
        "name": "review-limit-package",
        "module": "financial-limit-package"
      }
    },
    "TG_N_CTG": {
      "initComponent": {
        "name": "transaction-group-create",
        "module": "transaction-group"
      },
      "reviewComponent": {
        "name": "review-transaction-group-create",
        "module": "transaction-group"
      }
    },
    "TG_N_DTG": {
      "initComponent": {
        "name": "transaction-group-read",
        "module": "transaction-group"
      },
      "reviewComponent": {
        "name": "transaction-group-read",
        "module": "transaction-group"
      }
    },
    "TG_N_UTG": {
      "initComponent": {
        "name": "transaction-group-update",
        "module": "transaction-group"
      },
      "reviewComponent": {
        "name": "review-transaction-group-update",
        "module": "transaction-group"
      }
    },
    "AU_N_UAM": {
      "initComponent": {
        "name": "view-authentication-maintenance",
        "module": "authentication"
      },
      "reviewComponent": {
        "name": "confirm-authentication-maintenance",
        "module": "authentication"
      }
    },
    "AU_N_CAM": {
      "initComponent": {
        "name": "view-authentication-maintenance",
        "module": "authentication"
      },
      "reviewComponent": {
        "name": "confirm-authentication-maintenance",
        "module": "authentication"
      }
    },
    "UPP_N_CPP": {
      "initComponent": {
        "name": "policy-search",
        "module": "password-policy"
      },
      "reviewComponent": {
        "name": "review-create",
        "module": "password-policy"
      }
    },
    "UPP_N_UPP": {
      "initComponent": {
        "name": "policy-search",
        "module": "password-policy"
      },
      "reviewComponent": {
        "name": "review-update",
        "module": "password-policy"
      }
    },
    "TF_N_CBG": {
      "initComponent": {
        "name": "guarantee-list",
        "module": "guarantee"
      },
      "reviewComponent": {
        "name": "review-guarantee",
        "module": "guarantee"
      }
    },
    "UM_N_USD": {
      "initComponent": {
        "name": "review-user-channel-access",
        "module": "user-management"
      },
      "reviewComponent": {
        "name": "review-user-channel-access",
        "module": "user-management"
      }
    },
    "RM_ENT_CR": {
      "initComponent": {
        "name": "review-enterprise-role-create",
        "module": "enterprise-role-management"
      },
      "reviewComponent": {
        "name": "review-enterprise-role-create",
        "module": "enterprise-role-management"
      }
    },
    "RM_ENT_UP": {
      "initComponent": {
        "name": "review-enterprise-role-update",
        "module": "enterprise-role-management"
      },
      "reviewComponent": {
        "name": "review-enterprise-role-update",
        "module": "enterprise-role-management"
      }
    },
    "RM_ENT_DE": {
      "initComponent": {
        "name": "review-enterprise-role-create",
        "module": "enterprise-role-management"
      },
      "reviewComponent": {
        "name": "review-enterprise-role-create",
        "module": "enterprise-role-management"
      }
    },
    "RT_N_UUM": {
      "initComponent": {

      },
      "reviewComponent": {
        "name": "review-report-user-map",
        "module": "reports"
      }
    },
    "RT_N_CAR": {
      "initComponent": {

      },
      "reviewComponent": {
        "name": "review-report-generation",
        "module": "reports"
      }
    },
    "RT_N_CUR": {
      "initComponent": {

      },
      "reviewComponent": {
        "name": "review-report-generation",
        "module": "reports"
      }
    },
    "RT_N_DAR": {
      "initComponent": {

      },
      "reviewComponent": {
        "name": "review-report-generation",
        "module": "reports"
      }
    },
    "RT_N_UUR": {
      "initComponent": {

      },
      "reviewComponent": {
        "name": "review-report-generation",
        "module": "reports"
      }
    },
    "RT_N_UAR": {
      "initComponent": {

      },
      "reviewComponent": {
        "name": "review-report-generation",
        "module": "reports"
      }
    },
    "RT_N_CAC": {
      "initComponent": {

      },
      "reviewComponent": {
        "name": "review-report-generation",
        "module": "reports"
      }
    },
    "RT_N_CAD": {
      "initComponent": {

      },
      "reviewComponent": {
        "name": "review-report-generation",
        "module": "reports"
      }
    },
    "RT_N_CAU": {
      "initComponent": {

      },
      "reviewComponent": {
        "name": "review-report-generation",
        "module": "reports"
      }
    },
    "RT_N_DUR": {
      "initComponent": {

      },
      "reviewComponent": {
        "name": "review-report-generation",
        "module": "reports"
      }
    },
    "TF_N_ACA": {
      "initComponent": {
        "name": "export-amendment",
        "module": "customer-acceptance"
      },
      "reviewComponent": {
        "name": "review-amend-lc",
        "module": "letter-of-credit"
      }
    },
    "UM_N_ULS": {
      "initComponent": {
        "name": "review-user-status",
        "module": "user-management"
      },
      "reviewComponent": {
        "name": "review-user-status",
        "module": "user-management"
      }
    },
    "TF_N_CAB": {
      "initComponent": {
        "name": "view-discrepancies",
        "module": "customer-acceptance"
      },
      "reviewComponent": {
        "name": "view-discrepancies",
        "module": "customer-acceptance"
      }
    },
    "TF_N_ULC":{
      "initComponent": {
      "name": "view-letter-of-credit",
      "module": "letter-of-credit"
     },
    "reviewComponent": {
      "name": "review-attach-documents",
      "module": "trade-finance"
    }
   },
   "TF_N_UBG":{
     "initComponent": {
     "name": "view-bank-guarantee",
     "module": "guarantee"
    },
   "reviewComponent": {
     "name": "review-attach-documents",
     "module": "trade-finance"
   }
  },
    "TF_N_ABG": {
        "initComponent": {
        "name": "amend-bank-guarantee",
        "module": "guarantee"
      },
      "reviewComponent": {
        "name": "review-amendment",
        "module": "guarantee"
      }
    },
    "TF_N_UBM": {
    "initComponent": {
      "name": "create-beneficiary-maintenance",
      "module": "beneficiary-maintenance"
    },
    "reviewComponent": {
      "name": "review-beneficiary-maintenance",
      "module": "beneficiary-maintenance"
    }
  },
  "TF_N_CBM": {
        "initComponent": {
        "name": "create-beneficiary-maintenance",
        "module": "beneficiary-maintenance"
      },
      "reviewComponent": {
        "name": "review-beneficiary-maintenance",
        "module": "beneficiary-maintenance"
      }
    },
    "TF_N_DBM": {
          "initComponent": {
          "name": "create-beneficiary-maintenance",
          "module": "beneficiary-maintenance"
        },
        "reviewComponent": {
          "name": "review-beneficiary-maintenance",
          "module": "beneficiary-maintenance"
        }
      },
      "EB_N_CBLR": {
            "initComponent": {
            "name": "biller-create",
            "module": "biller-maintenance"
          },
          "reviewComponent": {
            "name": "review-biller",
            "module": "biller-maintenance"
          }
      },
      "EB_N_UBLR": {
            "initComponent": {
            "name": "biller-create",
            "module": "biller-maintenance"
          },
          "reviewComponent": {
            "name": "review-biller",
            "module": "biller-maintenance"
          }
      },
      "EB_N_DBLR": {
            "initComponent": {
            "name": "biller-create",
            "module": "biller-maintenance"
          },
          "reviewComponent": {
            "name": "review-biller",
            "module": "biller-maintenance"
          }
      },
      "FX_M_CFX": {
          "initComponent": {
          "name": "forex-deal-create",
          "module": "forex-deal",
          "hostReferenceNumber": "result.forexDealDTO.dealId"
        },
        "reviewComponent": {
          "name": "review-forex-deal-create",
          "module": "forex-deal"
        }
      },
      "AZ_A_PMC": {
          "initComponent": {
          "name": "application-role-create",
          "module": "role-transaction-mapping"
        },
        "reviewComponent": {
          "name": "review-application-role-create",
          "module": "role-transaction-mapping"
        }
      },
      "AZ_A_PMU": {
          "initComponent": {
          "name": "role-transaction-update",
          "module": "role-transaction-mapping"
        },
        "reviewComponent": {
          "name": "review-role-transaction-update",
          "module": "role-transaction-mapping"
        }
      },
      "AZ_A_PMD": {
          "initComponent": {
          "name": "review-role-transaction-update",
          "module": "role-transaction-mapping"
        },
        "reviewComponent": {
          "name": "review-role-transaction-update",
          "module": "role-transaction-mapping"
        }
      },
      "EB_N_CCAT": {
            "initComponent": {
            "name": "manage-category",
            "module": "biller-maintenance"
          },
          "reviewComponent": {
            "name": "review-category",
            "module": "biller-maintenance"
          }
      },
      "EB_N_UCAT": {
          "initComponent": {
            "name": "manage-category",
            "module": "biller-maintenance"
          },
          "reviewComponent": {
            "name": "review-category",
            "module": "biller-maintenance"
          }
      },
      "EB_N_DCAT": {
          "initComponent": {
            "name": "manage-category",
            "module": "biller-maintenance"
          },
          "reviewComponent": {
            "name": "review-category",
            "module": "biller-maintenance"
          }
      },
      "FD_M_FTU": {
        "initComponent": {
          "name": "feedback-home",
          "module": "feedback"
        },
        "reviewComponent": {
          "name": "feedback-home",
          "module": "feedback"
        }
    },
    "FD_M_FTC": {
      "initComponent": {
        "name": "feedback-home",
        "module": "feedback"
      },
      "reviewComponent": {
          "name": "feedback-home",
          "module": "feedback"
        }
    },
    "SR_M_FBC": {
      "initComponent": {
        "name": "service-request-approval-view",
        "module": "service-requests"
      },
      "reviewComponent": {
        "name": "service-request-approval-view",
        "module": "service-requests"
      }
    },
    "FX_MT_CFXM": {
        "initComponent": {
        "name": "view-forex-deal-settings",
        "module": "forex-deal-settings"
      },
      "reviewComponent": {
        "name": "review-forex-deal-settings",
        "module": "forex-deal-settings"
      }
    },
    "FX_MT_UFXM": {
        "initComponent": {
        "name": "view-forex-deal-settings",
        "module": "forex-deal-settings"
      },
      "reviewComponent": {
        "name": "review-forex-deal-settings",
        "module": "forex-deal-settings"
      }
    },
    "FX_MT_DFXM": {
        "initComponent": {
        "name": "view-forex-deal-settings",
        "module": "forex-deal-settings"
      },
      "reviewComponent": {
        "name": "review-forex-deal-delete-settings",
        "module": "forex-deal-settings"
      }
    },
    "AR_N_CMP": {
        "initComponent": {
        "name": "relationship-matrix-base",
        "module": "relationship-matrix"
      },
      "reviewComponent": {
        "name": "relationship-matrix-mapping",
        "module": "relationship-matrix"
      }
    },
    "AR_N_CMT": {
        "initComponent": {
        "name": "relationship-mapping-base",
        "module": "relationship-mapping"
      },
      "reviewComponent": {
        "name": "relationship-mapping-base",
        "module": "relationship-mapping"
      }
    },
    "RT_N_CUN": {
      "initComponent": {
      },
      "reviewComponent": {
        "name": "review-report-generation",
        "module": "reports"
      }
    },
	"AA_N_UEBM": {
      "initComponent": {
        "name": "add-ext-bank",
        "module": "account-aggregation"
      },
      "reviewComponent": {
        "name": "add-ext-bank-review",
        "module": "account-aggregation"
      }
    },
    "AA_N_CEBM": {
      "initComponent": {
        "name": "add-ext-bank-create",
        "module": "account-aggregation"
      },
      "reviewComponent": {
        "name": "add-ext-bank-review",
        "module": "account-aggregation"
      }
    }
  };
  return $.extend(true, tasks, extension);
});
