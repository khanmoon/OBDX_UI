define([], function () {
  "use strict";
  var ComponentInputLocale = function () {
    return {
      root: {
        "dashboard": {
          "dashboard-quick-links": {
            "type": {
              "name": "Component Type",
              "values": {
                "payments-quick-links": "Payments",
                "quick-access": "Quick Access"
              }
            }
          },
          "admin-activities": {
            type: {
              name: "Component Type",
              values: {
                "user-management": "User Management",
                "party-preferences": "Party Preferences",
                "workflow-management": "Workflow Management",
                "rules-management": "Rules Management",
                "party-account-access": "Party Account Access",
                "user-account-access": "User Account Access",
                "file-identifier-maintenance": "File Identifier Maintenance",
                "user-file-identifier-mapping": "User File Identifier Mapping",
                "workflow-config": "Workflow Configuration",
                "request-processing": "Request Processing",
                feedback: "Feedback",
                "user-help-desk": "User Help Desk",
                "merchant-management": "Merchant Management",
                "biller-onboarding": "Biller Onboarding",
                "user-group-subject-mapping": "User Group Subject Mapping",
                "alerts-maintenance": "Alerts Maintenance",
                mailers: "Mailers",
                authentication: "Authentication",
                "security-question-maintenance": "Security Question Maintenance",
                "password-policy-maintenance": "Password Policy Maintenance",
                "service-request-form-builder": "Service Request Form Builder",
                "sms-and-missed-call-banking": "SMS and Missed Call Banking",
                "limit-definition": "Limit Definition",
                "limit-package-management": "Limit Package Management",
                "user-limit": "User Limit",
                "system-configuration": "System Configuration",
                "system-rules": "System Rules",
                "transaction-aspects": "Transaction Aspects",
                "ATM-Branch-Maintenance": "ATM/Branch Maintenance",
                "payment-purpose-mapping":"Payment Purpose Mapping",
                "product-mapping": "Product Mapping",
                "payee-restriction": "Payee Restriction",
                "biller-category-maintenance": "Biller Category Maintenance",
                "forex-deal-maintenance": "Forex Deal Maintenance",
                "biller-category-maintenance-integrated": "Biller Category Maintenance - Integrated",
                "network-preference-maintenance": "Network Preference Maintenance",
                "touch-points":"Touch Points",
                "touch-points-groups":"Touch Points Groups",
                "role-transaction-mapping": "Role Transaction Mapping",
                "view-entitlements": "View Entitlements",
                "user-segment-maintenance": "User Segment Maintenance",
                "spend-category-maintenance": "Spend Category Maintenance",
                "goal-category-maintenance": "Goal Category Maintenance",
                "ext-bank-maintenance": "External Bank Maintenance",
                "manage-brand": "Manage Brand",
                "dashboard-builder": "Dashboard Builder",
                "transaction-blackout": "Transaction Blackout",
                "transaction-working-window": "Transaction Working Window",
                "audit-log": "Audit Log",
                "feedback-analytics": "Feedback Analytics",
                "relationship-mapping": "Relationship Mapping",
                "relationship-matrix": "Relationship Matrix"
              }
            }
          },
          "dashboard-admin-action-card": {
            type: {
              name: "Component Type",
              values: {
                "onboarding": "Onboarding",
                "communications": "Communications",
                "security": "Security",
                "templates": "Templates",
                "limits": "Limits",
                "commonServices": "Common Services",
                "payments": "Payments",
                "accessPolicies": "Access Policies",
                "pfm": "PFM",
                "userExp": "User Experience",
                "controlMonitor": "Control & Monitor"
              }
            }
          }
        },
        "personal-finance-management": {
          "spend-summary": {
            "type": {
              "name": "Component Type",
              "values": {
                "cards": "Cards",
                "graph": "Graph"
              }
            }
          }
        },
        "corporateDashboard": {
          "limits-widget": {
            "type": {
              "name": "Component Type",
              "values": {
                "USER": "User",
                "PARTY": "Party"
              }
            }
          }
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
  return new ComponentInputLocale();
});