"use strict";
var NodeHelper = require("node_helper"),
    rpio = require('rpio'),
    spi = require('spi-device');
var log = () => { /* do nothing */ };
module.exports = NodeHelper.create({
    start: function() {
        this.ledProvider = null
    },
    socketNotificationReceived: function(e, i) {
        switch (e) {
            case "INIT":
                console.log("[APA102] EXT-APA102 Version:", require("./package.json").version, "rev:", require("./package.json").rev), this.initialize(i);
                break;
            case "APA102_COLOR":
                console.log("[APA102] Set color");
                this.setColor(i)
                break
        }
    },
    initialize: async function(e) {
        this.config = e
        rpio.init({ mapping: 'gpio', gpiomem: true })
        rpio.open(5, rpio.OUTPUT, rpio.HIGH);
        if (e.debug) log = (...args) => { console.log("[APA102]", ...args) }
    },
    setColor: function(e) {
        const apa102 = spi.open(0,
            0,
            (err) => {
                if (err) {
                    console.error(err);
                };
        
                console.log('Create buffer');
                this._led_length = 12;
                this._led_bits =  4 + this._led_length * 4 + 4;
                this._led_buffer = Buffer.alloc(this._led_bits);
                for (let i = 0; i < this._led_bits; i++) {
                    if (i < (this._led_bits - 4))
                        this._led_buffer[i] = 0x00;
                    else
                        this._led_buffer[i] = 255;
                }
              
                console.log('Fill buffer');
                
                var red = e.red || Math.floor(Math.random() * (255 - 0 + 1)) + 0;
                var green = e.green || Math.floor(Math.random() * (255 - 0 + 1)) + 0;
                var blue = e.blue || Math.floor(Math.random() * (255 - 0 + 1)) + 0;
                var brightness = e.brightness || 255;
              
                for (let i = 0; i < this._led_length; i++) {
                    var current_led = 4 + (i * 4);
                    this._led_buffer[current_led + 1] = blue;
                    this._led_buffer[current_led + 2] = green;
                    this._led_buffer[current_led + 3] = red;
                    this._led_buffer[current_led + 0] = brightness;
                }      
              
                const message = [{
                  byteLength: this._led_bits,
                  sendBuffer: this._led_buffer,
                  receiveBuffer: Buffer.alloc(this._led_bits),
                  speedHz: 20000
                }];
              
                apa102.transfer(message, (err, result) => {
                    if (err) {
                        console.error(err);
                    };

                    apa102.close(err => {
                        if (err) {
                            console.error(err);
                        };
                    })
                })
        
            }
        )
    }

});