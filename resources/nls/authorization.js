define([
    "ojL10n!resources/nls/messages",
    "ojL10n!resources/nls/generic",
    "ojL10n!resources/nls/authorization-common",
    "ojL10n!resources/nls/authorization-info"
], function(Messages, Generic, AuthorizationCommon, AuthorizationInfo) {
    "use strict";
    var OriginationLocale = function() {
        return {
            root: {
              Note: "Note",
                info: {
                    noData: "No data to display.",
                    tasksTable: "Tasks Table",
                    transactionTable: "Transaction Table"
                },
                labels: {
                    editTitle: "Click here to edit transaction mapping",
                    editAlt: "Edit Transaction Mapping"
                },
                compName: {
                    authHeader: "Authorization Workflow"
                },
                navBarDescription: "Authorization",
                headings: {
                    view: "View",
                    perform: "Perform",
                    approve: "Approve",
                    all:"All",
                    select: "Select",
                    createApplicationRole: "Create Application Role",
                    updateApplicationRole: "Update Application Role",
                    createEntitlement: "Create Entitlement",
                    entitlement: "Entitlements",
                    entitlementDetails: "Entitlement Details",
                    createPolicy: "Create Policy",
                    updatePolicy: "Update Policy",
                    editPolicy: "Edit Policy",
                    deletePolicy: "Delete Policy Warning",
                    createNewPolicy: "Create New Policy",
                    editRes: "Edit Resource",
                    searchResult: "Search Result",
                    createNewRes: "Create New Resource",
                    createPolicyDomain: "Create Policy Domain",
                    updatePolicyDomain: "Update Policy Domain",
                    authorizationSystem: "Authorization System",
                    serviceResponse: "Service Response",
                    uiComponent: "Ui component",
                    page: "Page",
                    service: "Service",
                    applicationRoleView: "Application Role View",
                    applicationRoleUpdate: "Application Role Update",
                    applicationRoleReview: "Application Role Review",
                    mapTransactions: "Map Transactions",
                    transactions: "Transactions"
                },
                approle: {
                    createSuccess: "Application Role created successfully.",
                    updateSuccess: "Application Role updated successfully.",
                    addApplicationRole: "Add New Application Role",
                    appRoles: "Application Roles",
                    appRoleAdded: "Application Role Added"
                },
                resource: {
                    policyName: "Policy Name",
                    createResource: "Resource created successfully.",
                    updateResource: "Resource updated successfully.",
                    validResourceName: "Enter Valid Resource Name",
                    validResourceDesc: "Enter Valid Resource Description",
                    validResourceDispName: "Enter Valid Resource Display Name",
                    resourceActionType: "Resource must have at least one action type selected",
                    resourceAdded: "Resource Added",
                    resourceAlreadyPresent: "Resource is already present in the list",
                    resources: "Resources"
                },
                entitlement: {
                    createSuccess: "Entitlement created successfully.",
                    updateSuccess: "Entitlement updated successfully.",
                    validEntitlementName: "Enter Valid Entitlement Name",
                    validEntitlementDisplayName: "Enter Valid Entitlement Display Name",
                    validEntitlementDesc: "Enter Valid Entitlement Description",
                    search: "Search",
                    entAdded: "Entitlements Added",
                    entitlements: "Entitlements",
                    entDeleted: "Entitlement deleted successfully",
                    entAlreadyPresent: "Entitlement is already present in the list"
                },
                policy: {
                    createSuccess: "Policy created successfully.",
                    updateSuccess: "Policy updated successfully.",
                    validPolicyName: "Enter Valid Policy Name",
                    validPolicyDesc: "Enter Valid Policy Description",
                    validPolicyDomainDesc: "Enter Valid Policy Domain Description"
                },
                policyDomain: {
                    createSuccess: "Policy Domain created successfully.",
                    updateSuccess: "Policy Domain updated successfully.",
                    policyDomains: "Policy Domains",
                    addPolicyDomain: "Add New Policy Domain"
                },
                rolePreferences: {
                    enterpriseRoles: "Enterprise Roles",
                    updateSuccess: "System Rules Updated successfully.",
                    enterpriseAdded: "Enterprise Role Added",
                    enterprisePresent: "Enterprise Role is already present in the list"
                },
                header: {
                    transactionName: "Application Role Policy Map",
                    appRoleDetails: "Application Role Details",
                    retail: "Retail",
                    corporate: "Corporate",
                    admin: "Admin"
                },
                messages: Messages,
                generic: Generic,
                common: AuthorizationCommon,
                information: AuthorizationInfo
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
    return new OriginationLocale();
});
