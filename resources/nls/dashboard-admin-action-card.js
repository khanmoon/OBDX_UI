define([], function() {
  "use strict";
  var DashboardAdminActionCardLocale = function() {
    return {
      root: {
        dashboard: {
          titles: {
            configuration: "Configuration",
            limits: "Limits",
            pfm: "Personal Finance",
            payments: "Payments",
            security: "Security",
            onboarding: "Onboarding",
            userExp: "User Experience",
            notifications: "Notifications",
            communications: "Communications",
            templates : "Templates",
            commonServices : "Common Services",
            accessPolicies : "Access Policies",
            controlMonitor : "Controls & Monitoring"
          },
          description: {
            templates : "Define templates for capturing service requests and customer feedback.  Set up SMS and Missed Call Banking.",
            configuration: "Manage Entity and Day 1 configurations and various transaction aspects.",
            limits: "Manage various types of limits for transaction and  transaction group.",
            pfm: "Maintain spend and goal categories to facilitate customers to manage their personal finance.",
            accessPolicies : "Manage Touch Points. Control access by defining user role-transaction mapping and by maintaining account relationships-transaction access.",
            payments: "Payment purpose definition for each payment type. Restrict the number of payees that a retail user can create. Define and map biller categories. Set up forex deal related maintenances.",
            security: "Reduce security threats by maintaining two factor authentication and by defining complex password policy.",
            onboarding: "Onboard and manage users, billers and merchants.",
            commonServices : "Manage entities and Day 1 configurations and various transaction aspects. Maintain ATM and Branch locations and update services offered. Enable Term deposit and Recurring deposit products on digital banking platform.",
            userExp: "Build seamless digital customer experience by managing brands.",
            communications: "Manage user communications by publishing mailers and by definition alerts for each event.",
            controlMonitor : "Define transaction working window and blackout window. Check audit logs."
          },
          others: {
            "system-configuration-home": "System Configuration",
            "task-aspects": "Transaction Aspects",
            "view-forex-deal-settings": "Forex Deal Maintenance",
            "sms-banking-search" : "SMS and Missed Call Banking",
            "limit-base": "Limit Definition",
            "limit-package-search": "Limit Package Management",
            "transaction-group-search" : "Transaction Group Maintenance",
            "spend-category-landing": "Spend Category Maintenance",
            "goal-category-list": "Goal Category Maintenance",
            "system-rules-map": "System Rules",
            "enterprise-role-search": "Enterprise Role Maintenance",
            "application-role-base": "Role Transaction Mapping",
            "entitlements-base": "View Entitlements",
            "task-purpose-landing": "Payment Purpose Mapping",
            "payee-restrictions-landing": "Payee Restrictions",
            "manage-category": "Biller Category Maintenance",
            "biller-category-landing":"Biller Category Maintenance - Integrated",
            "segment-authentication-mapping": "Authentication",
            "view-security-question-maintenance": "Security Question Maintenance",
            "policy-search": "Password Policy Maintenance",
            "users": "User Management",
            "merchant-dashboard": "Merchant Management",
            "biller-search": "Biller Onboarding",
            "transaction-blackout": "Transaction Blackout",
            "transaction-cutoff": "Transaction Working Window",
            "theme-list": "Manage Brand",
            "template-list": "Dashboard Builder",
            "mapping-base": "User Group Subject Mapping",
            "alerts-maintenance-search": "Alerts Maintenance",
            "mailers-base": "Mailers",
            "mailbox-base": "Mailbox",
            "audit-log": "Audit Log",
            "location-search": "ATM/Branch Maintenance",
            "user-segments-product-list": "Product Mapping",
            "print-user-search": "Print Password",
            "access-point-search": "Touch Points",
            "access-point-group-search": "Touch Point Groups",
            "service-requests-search":"Service Request- Form Builder",
            "feedback-template-search":"Feedback Template",
            "feedback-analysis" : "Feeback Analytics",
            "relationship-mapping-base" : "Relationship Mapping",
            "relationship-matrix-base" : "Relationship Matrix",
			"add-ext-bank":"External Bank Maintenance"
          },
          commonTitle: "Click Here For {action}"
        }
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
  return new DashboardAdminActionCardLocale();
});
