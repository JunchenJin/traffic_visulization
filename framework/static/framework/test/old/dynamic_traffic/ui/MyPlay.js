// UMD initialization to work with CommonJS, AMD and basic browser script include
(function (factory) {
	var L;
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['leaflet'], factory);
	} else if (typeof module === 'object' && typeof module.exports === "object") {
		// Node/CommonJS
		L = require('leaflet');
		module.exports = factory(L);
	} else {
		// Browser globals
		if (typeof window.L === 'undefined')
			throw 'Leaflet must be loaded first';
		factory(window.L);
	}
}(function (L) {
L.Playback = L.Playback || {};

L.Playback.Clock = L.Class.extend({
    statics: {
	
    //convert a date to string
    DateStr: function(time) {
      var d= new Date(time);
	  var yy= d.getFullYear();
	  var mm= d.getMonth();
	  var dd= d.getDate();
	  if (mm < 10) mm = '0' + mm;
	  if (dd < 10) dd = '0' + dd;
	  return yy + '-' + mm + '-' + dd + ' ';
    },
    
    //convert time to string    
    TimeStr: function(time) {
      var d = new Date(time);
      var h = d.getHours();
      var m = d.getMinutes();
      var s = d.getSeconds();
      var tms = time / 1000;
      //var dec = (tms - Math.floor(tms)).toFixed(2).slice(1);
      //var mer = 'AM';
      //if (h > 11) {
        //h %= 12;
        //mer = 'PM';
      //} 
      //if (h === 0) h = 12;
      if (h < 10) h = '0' + h;
      if (m < 10) m = '0' + m;
      if (s < 10) s = '0' + s;
      return h + ':' + m + ':' + s + ' ';
    },
  },
  
  initialize: function (callback, options) {
    console.log("Clock Initialized");	
	//this._map=map;
	this._callbacksArry = [];
	console.log("current callback",callback);
	console.log("current options",options);
    if (callback) this.addCallback(callback);
	L.setOptions(this, options);
	//console("Length of callback arry",this._callbackArry.length);
    this._speed = this.options.speed;    
    this._tickLen = this.options.tickLen;
    this._cursor = this.options.cursor;//current
    this._starttime= this.options.starttime;
    this._endtime = this.options.endtime;
    this._timestep=this.options.timestep;
  },

  //add a tick and update time
  _tick: function (self) {
    if (self._cursor > self._endtime) {
      clearInterval(self._intervalID);
      return;
    }
    self._callbacks(self._cursor);
    self._cursor += self._tickLen;
  },

  _callbacks: function(cursor) {
    var arry = this._callbacksArry;
	console.log(arry);
    for (var i=0, len=arry.length; i<len; i++) {
      arry[i](cursor);
    }
  },

  addCallback: function(fn) {
    this._callbacksArry.push(fn);
	console.log("callback added",fn);
  },


  //window.setInterval(fucntion,time,options)
  start: function () {
    if (this._intervalID) return;
    this._intervalID = window.setInterval(
      this._tick, 
      this._timestep, 
      this);
	console.log("playback start completed");  
  },

  //_intervalID defines whether it is playing.
  stop: function () {
    if (!this._intervalID) return;
    clearInterval(this._intervalID);
    this._intervalID = null;
  },

  getSpeed: function() {
    return this._speed;
  },

  isPlaying: function() {
    return this._intervalID ? true : false;
  },

  setSpeed: function (speed) {
    this._speed = speed;
    this._transitionTime = this._tickLen / speed;
    if (this._intervalID) {
      this.stop();
      this.start();
    }
  },

  setCursor: function (ms) {
    var time = parseInt(ms);
    if (!time) return;
    var mod = time % this._tickLen;
    if (mod !== 0) {
      time += this._tickLen - mod;
    }
    this._cursor = time;
    this._callbacks(this._cursor);
  },

  getTime: function() {
    return this._cursor;
  },

  getStartTime: function() {
    return this._starttime;
  },

  getEndTime: function() {
    return this._endtime;
  },

  getTickLen: function() {
    return this._tickLen;
  }

});

L.Playback = L.Playback || {};

L.Playback = L.Playback.Clock.extend({
        statics : {
            Clock : L.Playback.Clock,
            PlayControl : L.Playback.PlayControl,
            DateControl : L.Playback.DateControl,
            SliderControl : L.Playback.SliderControl
        },

        initialize : function (map,callback,options) {
			console.log("Initialize of play with callback",callback);
			console.log("Initialize of play with options ",options);
            L.setOptions(this, options);            
            this._map = map;
			// Be careful here, a this is must for calling another constructor.
            L.Playback.Clock.prototype.initialize.call(this,callback, this.options);
			console.log("Initialize of play 2",callback)
        },
    });

L.Map.addInitHook(function () {
    if (this.options.playback) {
        this.playback = new L.Playback(this);
    }
});

L.playback = function (map, callback, options) {
    return new L.Playback(map, callback, options);
};

return L.Playback;
}));