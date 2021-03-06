define([], function() {
  "use strict";
  var MenuLocale = function() {
    return {
      root: {
        roles: {
          currentView: "Your current view is",
          CORP: "Corporate",
          CORPADMIN: "Corporate Administrator",
          ADMIN: "Administrator",
          maker: "Maker",
          viewer: "Viewer",
          checker: "Approver",
          corporateadminchecker: "Approver",
          corporateadminmaker: "Maker",
          adminchecker: "Approver",
          adminmaker: "Maker",
          authadmin: "System Administrator"
        },
        entity: {
          currentView: "Current Entity"
        },
        menu: {

          mailboxAlt: "Mail Box",
          mailbox: "Mail Box",
          groups: {
            "sweep-in-instruction": "Manage Sweep-in",
            "interest-certificates": "Interest Certificates",
            "interest-certificate-casa": "Current and Savings",
            "interest-certificate-td": "Deposits",
            "interest-certificate-loans": "Loans",
            "tax-deduction-at-source": "TDS",
            "compliance-base": "Compliance",
            "entity-compliance-base": "Entity Compliance",
            DASHBOARD: "Dashboard",
            ACCOUNTS_TITLE: "Accounts",
            RECURRING_DEPOSIT_TITLE: "Recurring Deposits",
            "rd-redeem": "Redemption",
            "rd-calculator": "New Recurring Deposit",
            "rd-amend": "Edit Maturity Instruction",
            "view-statement": "View Statement",
            redemption: "Redemption",
            "request-statement": "Request Statement",
            SETUP: "Setups",
            INQUIRES: "Inquiries",
            PAYMENTS_TITLE: "Payments",
            CASA_ACCOUNT: "Current and Savings",
            "casa-nominee-list": "Current and Savings",
            "td-nominee-list": "Term Deposits",
            "rd-nominee-list": "Recurring Deposits",
            home: "Home",
            nominee: "Nominee",
            DD_OVERVIEW: "Overview",
            "account-transactions": "View Statement",
            "cheque-status-inquiry": "Cheque Status Inquiry",
            "cheque-book-request": "Cheque Book Request",
            "cheque-stop-unblock": "Stop/Unblock Cheque",
            "statement-request": "Request Statement",
            "debit-card-list": "Debit Cards",
            TERM_DEPOSIT_ACCOUNT: "Term Deposits",
            TD_OVERVIEW: "Overview",
            "td-details": "Term Deposit Details",
            "td-topup": "Top Up",
            "td-open": "New Deposit",
            "td-redeem": "Redemption",
            "td-amend": "Edit Maturity Instruction",

            "view-forex-deal": "Forex Deal",

            LOAN: "Loans and Finances",
            LOANS_OVERVIEW: "Overview",
            "loan-details": "Loan Details",
            "loan-repayment": "Repayment",
            "loan-disbursement": "Disbursement Inquiry",
            "loan-schedule": "Schedule Inquiry",

            AGGREGATE_ACCOUNT: "Aggreate Accounts",
            "aggreate_accounts_list": "Register Account",

            NOMINATIONS_TITLE: "Nominations",
            TRADE_FINANCE: "Trade Finance",
            "letter-of-credit": "Letter Of Credit",
            "lc-nav-bar": "Initiate LC",
            "import-lc": "View Import LC",
            "export-lc": "View Export LC",
            bills: "Bills & Collection",
            "import-bills": "View Import Bills",
            "export-bills": "View Export Bills",
            "list-collection": "Initiate Collection",
            guarantee: "Guarantee",
            "guarantee-list": "Initiate Outward Guarantee",
            "outward-guarantees": "View Outward Guarantee",
            discrepancies: "Customer Acceptance",
            "search-beneficiary-maintenance": "Beneficiary Maintenance",
            "search-credit-line": "Line Limits Utilization",

            PAYMENTS_OVERVIEW: "Overview",
            "payee-list": "Manage Payees",
            "biller-list": "Manage Billers",
            "manage-payees-billers": "Manage Payees & Billers",
            "standing-instructions-list": "Repeat Transfers",
            "standing-instructions-landing": "Repeat Transfers",
            "bill-payments": "Pay Bills",
            "payments-money-transfer": "Transfer Money",
            "payments-transfers": "Payments and Transfers",
            "adhoc-payments": "Adhoc Payment",
            "multiple-payments": "Multiple Transfers",
            "multiple-bill-payments": "Multiple Bill Payments",
            "issue-demand-draft": "Issue Demand Drafts",
            "debtor-money-request": "Request Money",
            "debtor-group-list": "Manage Debtors",
            "scheduled-payments": "Upcoming Payments Inquiry",
            "inward-remittance": "Inward Remittance Inquiry",
            "outward-remittance": "Outward Remittance Inquiry",
            favorites: "Favorites",
            CREDIT_CARD_TITLE: "Credit Cards",
            CC_OVERVIEW: "Overview",
            "card-details": "Credit Card Details",
            "card-statement": "View Statement",
            "card-pay": "Card Payment",
            "request-pin": "Request PIN",
            "block-card": "Block/Cancel Card",
            "auto-pay": "Auto Pay",
            "reset-pin": "Reset PIN",
            "add-on-card": "Add-On Card",

            MAILBOX_TITLE: "Mail Box",
            PFM: "PFM",
            "list-budget": "Budget",
            "list-goal": "Goal List",
            "goal-category-select": "New Goal",
            GOAL: "Goal",
            SPEND: "Spend",
            "manage-spend-categories": "Manage Categories",
            "transaction-list": "View Transactions",
            "mailbox-base": "Mails",
            "alert-list": "Alerts",
            "notification-list": "Notification",
            FILE_UPLOAD: "File Upload",
            "file-create": "File Identifier Maintenance",
            "user-search-type": "User File Identifier Mapping",
            "file-upload": "File Upload",
            "file-view": "Uploaded Files Inquiry",

            PARTY_TO_PARTY_LINKAGE: "Party To Party Linkage",
            ON_BOARDING: "Onboarding",
            USER_MANAGEMENT: "User Management",
            CORPORATE_PREFERENCES: "Party Preferences",
            LIMITS: "Limits",
            "limit-search": "Limit Definition",
            "limit-package-search": "Limits Package",
            "transaction-group-search": "Transaction Group Maintenance",
            APPROVALS: "Approvals",
            "workflow-type": "Workflow Management",
            "rule-type": "Rules Management",
            "user-group-type": "User Group Management",
            ACCOUNT_ACCESS: "Account Access",
            "access-management-base": "Party Account Access",
            SERVICE_REQUEST_CONFIG: "Service Requests",
            "service-requests-menu": "Service Request",
            "service-requests-track": "Track Request",
            "service-requests-base": "Request Processing",
            "feedback-capture": "Leave Feedback",
            "service-requests-base-main": "Raise New Request",
            "user-access-management-base": "User Account Access",
            "manage-service-request": "Manage Service Requests",
            REPORTS: "Reports",
            "report-generation": "Report Generation",
            "report-list": "My Reports",
            "report-user-search": "User Report Mapping",
            "audit-log": "Audit Log",
            "policy-search": "Password Policy Maintenance",
            OTHERS: "Others",
            "alerts-maintenance-search": "Alert Maintenance",
            "manage-alerts-subscription": "Manage Alerts",
            "alerts-select-user": "Alert Subscription",
            "claim-payment-dashboard": "Claim Money",
            "track-application": "Track Application",
            "user-credentials": "Register",
            "service-requests-search": "Service Request-Form Builder",
            login: "Login",
            logout: "Logout",
            clickhere: "Click to view {name}",
            locator: "ATM/Branch Locator",
            "preference-base": "Party Preferences",
			"add-ext-bank":"External Bank Maintenance",
            users: "User Management",
            "linkage-base": "Party To Party Linkage",
            "biller-search": "Biller Onboarding",
            profile: "My Profile",
            "template-list": "Dashboard Builder",
            "session-summary": "Session Summary",
            "alerts-list": "Manage Alerts",
            "my-limits": "Limits",
            "view-user-security-question": "Set Security Question",
            "change-password": "Change Password",
            "print-user-search": "Print Password",
            "security-menu": "Security Settings",
            help: "Help",
            about: "About",
            "third-party-consents": "Manage Third Party Consents",
            "feedback-analysis": "Feedback Analytics",
            BILL_PAYMENTS_TITLE: "Bill Payments",
            "bill-payments-favorites": "Favorites",
            "manage-bill-payments": "Bills",
            "register-biller": "Add Biller",
            "modify-biller": "Manage Billers",
            "quick-bill-payment": "Quick Bill Pay",
            "quick-recharge": "Quick Recharge",
            "payment-history": "Payment History",
            "side-menu": "My Preference",
            "code-generation-search": "Apptool Kit",
            trends: "Trends"
          }
        },
        welcome: "Welcome {firstName} {lastName}",
        lastLogin: "Your last login was on {lastLoginDate}",
        changeLanguage: "Click to change current language",
        selectLanguage: "Select Language"
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
  return new MenuLocale();
});
