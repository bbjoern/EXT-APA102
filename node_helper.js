"use strict";
var NodeHelper = require("node_helper"),
    rpio = require('rpio'),
    spi = require('spi-device');

module.exports = NodeHelper.create({
    start: function() {
        this.config = {}
    },
    socketNotificationReceived: function(e, i) {
        switch (e) {
            case "INIT":
                console.log("[APA102] EXT-APA102 Version:", require("./package.json").version, "rev:", require("./package.json").rev), this.initialize(i);
                break;
            case "APA102_COLOR":
                console.log("[APA102] Set color RGB " + i.red + "," + i.green + "," + i.blue);
                this.setColor(i)
                break;
            case "APA102_CLEAR":
                console.log("[APA102] Clear color");
                setTimeout(() => {
                    this.setColor({red: 0, green: 0, blue: 0, brightness: 255});
                }, 1000);
                break;
        }
    },
    initialize: async function(e) {
        this.config = e
        rpio.init({ mapping: 'gpio', gpiomem: true })
        rpio.open(5, rpio.OUTPUT, rpio.HIGH);
    },
    setColor: function(e) {
        const apa102 = spi.open(this.config.busNumber,
            this.config.deviceNumber,
            (err) => {
                if (err) {
                    console.error('[APA102] Error opening spi device', err);
                };
        
                console.log('[APA102] Create buffer...');
                this.ledLength = this.config.ledLength;
                this.ledBits =  4 + this.ledLength * 4 + 4;
                this.ledBuffer = Buffer.alloc(this.ledBits);
                for (let i = 0; i < this.ledBits; i++) {
                    if (i < (this.ledBits - 4))
                        this.ledBuffer[i] = 0;
                    else
                        this.ledBuffer[i] = 255;
                }
              
                console.log('[APA102] Fill buffer...');                
                var red = e.red || Math.floor(Math.random() * (255 - 0 + 1)) + 0;
                var green = e.green || Math.floor(Math.random() * (255 - 0 + 1)) + 0;
                var blue = e.blue || Math.floor(Math.random() * (255 - 0 + 1)) + 0;
                var brightness = e.brightness || 255;              
                for (let i = 0; i < this.ledLength; i++) {
                    var current_led = 4 + (i * 4);
                    this.ledBuffer[current_led + 1] = blue;
                    this.ledBuffer[current_led + 2] = green;
                    this.ledBuffer[current_led + 3] = red;
                    this.ledBuffer[current_led + 0] = brightness;
                }      
              
                console.log('[APA102] Transfer message...');   
                const message = [{
                  byteLength: this.ledBits,
                  sendBuffer: this.ledBuffer,
                  receiveBuffer: Buffer.alloc(this.ledBits),
                  speedHz: 2000
                }];              
                apa102.transfer(message, (err, result) => {
                    if (err) {
                        console.error('[APA102] Error transfering data to spi device', err);
                    };
                    console.log('[APA102] Transferred  message successfully');   
                    apa102.close(err => {
                        if (err) {
                            console.error('[APA102] Error closing device', err);
                        };
                    })
                })
        
            }
        )
    }

});