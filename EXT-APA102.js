Module.register("EXT-APA102",{defaults:{debug:!1},start:function(){},notificationReceived:function(e,t,i){switch(e){case"GA_READY":i.name=="MMM-GoogleAssistant"&&(this.sendSocketNotification("INIT",this.config),this.sendNotification("EXT_HELLO",this.name));break;case"ASSISTANT_LISTEN":this.sendSocketNotification("APA102_COLOR",this.configHelper.player.minVolume);break;case"ASSISTANT_THINK":this.sendSocketNotification("APA102_COLOR",this.configHelper.player.minVolume);break;case"ASSISTANT_REPLY":this.sendSocketNotification("APA102_COLOR",this.configHelper.player.minVolume);break;case"ASSISTANT_ERROR":this.sendSocketNotification("APA102_COLOR",this.configHelper.player.minVolume);break}}});
