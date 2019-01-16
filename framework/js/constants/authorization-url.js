define([], function() {
  "use strict";
  return {
    CREATE_POLICY: "policydomains/{policyDomainId}/policies",
    CREATE_APPLICATION_ROLE: "applicationRoles",
    UPDATE_APPLICATION_ROLE: "applicationRoles/{applicationRoleId}",
    FETCH_APPLICATION_ROLES: "applicationRoles?applicationRoleName={applicationRoleName}&enterpriseRoleName={enterpriseRoleName}",
    DELETE_ENTITLEMENT: "entitlements/{entitlementId}",
    DELETE_RESOURCE: "resources/{resourceId}",
    DELETE_POLICY: "policydomains/{policyDomainId}/policies/{policyId}",
    DELETE_APPLICATION_ROLE: "applicationRoles/{applicationRoleId}",
    DELETE_POLICY_DOMAIN: "policydomains/{policyDomainId}",
    FETCH_ENTERPRISE_ROLES: "enterpriseRoles?enterpriseRoleName={enterpriseRoleName}&defaultRole=true",
    FETCH_RESOURCES: "resources?resourceName={resourceName}&resourceType={resourceType}",
    UPDATE_ENTITLEMENT: "entitlements/{entitlementId}",
    CREATE_ENTITLEMENT: "entitlements",
    FETCH_ENTITLEMENTS: "entitlements?resourceName={resourceName}&entitlementName={entitlementName}",
    FETCH_POLICIES: "policydomains/{policyDomainId}/policies?policyName={policyName}&policyEffect={policyEffect}&applicationRole={applicationRole}&enterpriseRole={enterpriseRole}&resourceName={resourceName}&entitlementName={entitlementName}",
    CREATE_POLICY_DOMAIN: "policydomains",
    UPDATE_POLICY_DOMAIN: "policydomains/{policyDomainId}",
    FETCH_POLICY_DOMAINS: "policydomains",
    UPDATE_POLICY: "policydomains/{policyDomainId}/policies/{policyId}"
  };
});