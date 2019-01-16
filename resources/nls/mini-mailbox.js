define([], function() {
  "use strict";
  var MailboxLocale = function() {
    return {
      root: {
        mailbox: {
          navBarDescription: "Mini-Mailbox",
          viewAll: "View All",
          anchorClick: "Show mail",
          mailTab: "Mails ({mailUnreadCount})",
          alertTab: "Alerts ({alertUnreadCount})",
          notificationTab: "Notifications ({unreadNotificationCount})",
          notificationTitle: "Notifications",
          alerts: "Alerts",
          notifications: "Notifications Table",
          ariaCount: "{unreadNotificationCount} Unread Notifications",
          mails: "Mails",
          dateText: "Date/Time",
          messageText: "Message",
          subject: "Subject",
          subjectLink: "Click on the subject to view additional details",
          noData: "No New Notiﬁcations",
          subData: "Check this section for new notiﬁcations"
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
  return new MailboxLocale();
});
