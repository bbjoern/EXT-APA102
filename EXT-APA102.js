Module.register("EXT-APA102", {
    defaults: {
        debug: !1
    },
    start: function() {},
    notificationReceived: function(e, t, i) {
        switch (e) {
            case "GA_READY":
                i.name == "MMM-GoogleAssistant" && (this.sendSocketNotification("INIT", this.config), this.sendNotification("EXT_HELLO", this.name));
                break;
            case "ASSISTANT_LISTEN":
                this.sendSocketNotification("APA102_COLOR", {red: 255, green: 255, blue: 255, brightness: 255});
                break;
            case "ASSISTANT_THINK":
                this.sendSocketNotification("APA102_COLOR", {red: 0, green: 0, blue: 255, brightness: 255});
                break;
            case "ASSISTANT_REPLY":
                this.sendSocketNotification("APA102_COLOR", {red: 0, green: 255, blue: 0, brightness: 255});
                break;
            case "ASSISTANT_ERROR":
                this.sendSocketNotification("APA102_COLOR", {red: 255, green: 0, blue: 0, brightness: 255});
                break;
            case "ASSISTANT_STANDBY":
                this.sendSocketNotification("APA102_COLOR", {red: 0, green: 0, blue: 0, brightness: 255});
                break;
        }
    }
});