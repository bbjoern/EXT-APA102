"use strict"

var NodeHelper = require("node_helper")
var rpio = require('rpio');

module.exports = NodeHelper.create({
  start: function () {
    this.ledProvider = null
  },

  socketNotificationReceived: function (noti, payload) {
    switch (noti) {
      case "INIT":
        console.log("[APA102] EXT-APA102 Version:", require('./package.json').version, "rev:", require('./package.json').rev)
        this.initialize(payload)
        break
      case "APA102_COLOR":
        rpio.init({ mapping: 'gpio', gpiomem: true });
        rpio.open(5, rpio.OUTPUT, rpio.HIGH);
        rpio.write(5, rpio.HIGH);
        break
    }
  },

  initialize: async function (config) {
    this.config = config;
  }
})
