define(["platform"], function(Platform) {
  return Platform.getInstance().then(function(platform) {
    var config = platform("getChatbotConfig");
    var ochatWidgetSettings = {
      uri: config.chatbot_url,
      channel: config.chatbot_id,
      userId: 'chatbotuser',
      isDebugMode: false,
      chatTitle: 'ZigBank',
      miniTitle: 'Hi, How Can I Help you?',
      position: {
        left: 0,
        bottom: 0
      },
      closeIcon: '',
      chatInputPlaceholder: 'Message'
    };
    return ochatWidgetSettings;
  });
});
