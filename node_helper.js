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
                this.setColor({red: 0, green: 0, blue: 0, brightness: 255});
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
                for (let i = 0; i < this.ledLength; i++) {
                    var current_led = 4 + (i * 4);
                    this.ledBuffer[current_led + 1] = e.blue;
                    this.ledBuffer[current_led + 2] = e.green;
                    this.ledBuffer[current_led + 3] = e.red;
                    this.ledBuffer[current_led + 0] = e.brightness;
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