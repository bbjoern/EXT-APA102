"use strict";var NodeHelper=require("node_helper"),rpio=require("rpio");module.exports=NodeHelper.create({start:function(){this.ledProvider=null},socketNotificationReceived:function(e,i){switch(e){case"INIT":console.log("[APA102] EXT-APA102 Version:",require("./package.json").version,"rev:",require("./package.json").rev),this.initialize(i);break;case"APA102_COLOR":console.log("[APA102] Set color");rpio.init({mapping:"gpio",gpiomem:!0}),rpio.open(5,rpio.OUTPUT,rpio.HIGH),rpio.write(5,rpio.HIGH);break}},initialize:async function(e){this.config=e}});
