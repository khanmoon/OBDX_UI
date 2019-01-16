define([], function () {
  "use strict";
  var CorpProfileLocale = function () {
    return {
      root: {
        welcome: "Welcome, {firstName} {lastName}",
        lastLogin: "Last login {lastLoginDate}",
        openProfileLauncher: "Options Menu",
        openProfileLauncherTitle: "Click to open options menu",
        clearAllNotifications: "Clear all notifications",
        clearAllNotificationsTitle: "Click here to clear all notifications",
        topProfile: {
          labels: {
            profile: "Profile",
            inbox: "Mailbox",
            settings: "Settings",
            logout: "Logout",
            login: "Login",
            logoutTitle: "Click to Logout",
            changePassword: "Change Password",
            changePasswordTitle: "Click to Change Password",
            mylimits: "My Limits",
            setSecQues: "Set Security Question",
            myalerts: "Manage Alerts",
            help: "Help",
            about: "About",
            mailbox: "Mailbox",
            logo_title: "Go to Dashboard",
            logo_alt: "Open Dashboard",
            back_title: "Click to Go Back",
            back_alt: "Back",
            requestfunds: "Request Funds",
            unclaimedfunds: "Unclaimed Funds",
            requestfundsTitle: "Click to view funds requested",
            unclaimedfundsTitle: "Click to view Unclaimed Funds",
            location: "Location",
            locationTitle: "Click to view Location",
            toggleInner: "Toggle Menu",
            openMenu: "Open Menu",
            openMail: "Open Mails",
            openAlerts: "Open Alerts",
            openProfile: "Open Profile",
            openProfileTitle: "Click to Open Profile",
            manageAlerts: "Manage Alerts",
            notifications: "Notifications",
            notificationAlt: "{notificationUnreadCount} Notifications",
            locateMe: "ATM/Branch Locator",
            locateMeAlt: "Locate ATM Branch",
            search: "Search for transactions example Pay Bills",
            info: "Information",
            helpDeskheading: "You are logged on behalf of {firstName} {lastName}",
            helpDeskUserName: "({userName})"
          },
          quickMenu: {
            dashboard: "Dashboard",
            trends: "Trends",
            "quick-access": "Quick Access",
            payments: "Payments"
          },
          bankName: "ZigBank"
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
  return new CorpProfileLocale();
});
