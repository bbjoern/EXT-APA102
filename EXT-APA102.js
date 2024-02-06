/**
 ** Module : EXT-APA102
 **/
 
Module.register("EXT-APA102", {
  defaults: {
    debug: false
  },

  start: function () {
  },

  notificationReceived: function(noti, payload, sender) {
    switch(noti) {
      case "GA_READY":
        if (sender.name == "MMM-GoogleAssistant") {
          this.sendSocketNotification("INIT", this.config)
          this.sendNotification("EXT_HELLO", this.name)
        }
        break
      case "ASSISTANT_LISTEN":
        this.sendSocketNotification("APA102_COLOR", this.configHelper.player.minVolume)
        break
      case "ASSISTANT_THINK":      
        this.sendSocketNotification("APA102_COLOR", this.configHelper.player.minVolume)
        break
      case "ASSISTANT_REPLY":
        this.sendSocketNotification("APA102_COLOR", this.configHelper.player.minVolume)
        break
      case "ASSISTANT_ERROR":
        this.sendSocketNotification("APA102_COLOR", this.configHelper.player.minVolume)
        break
    }
  }
})
