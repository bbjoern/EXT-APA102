"use strict"

var NodeHelper = require("node_helper")
var Apa102spi = require("apa102-spi")

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
        this.ledProvider.setLedColor(2, 15, 255, 0, 0)
        this.ledProvider.sendLeds();
        break
    }
  },

  initialize: async function (config) {
    this.config = config;
    this.ledProvider = new Apa102spi(12, 100);
  }
})
