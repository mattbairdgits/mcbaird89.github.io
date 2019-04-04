require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"input":[function(require,module,exports){
var wrapInput,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Events.EnterKey = "EnterKey";

Events.SpaceKey = "SpaceKey";

Events.BackspaceKey = "BackspaceKey";

Events.CapsLockKey = "CapsLockKey";

Events.ShiftKey = "ShiftKey";

Events.ValueChange = "ValueChange";

Events.InputFocus = "InputFocus";

Events.InputBlur = "InputBlur";

exports.InputLayer = (function(superClass) {
  extend(InputLayer, superClass);

  function InputLayer(options) {
    var base, currentValue, property, textProperties, value;
    if (options == null) {
      options = {};
    }
    this._setTextProperties = bind(this._setTextProperties, this);
    this._setPlaceholder = bind(this._setPlaceholder, this);
    _.defaults(options, {
      backgroundColor: "#FFF",
      width: 375,
      height: 60,
      padding: {
        left: 20
      },
      text: "Type something...",
      fontSize: 40,
      fontWeight: 300
    });
    if (options.multiLine) {
      if ((base = options.padding).top == null) {
        base.top = 20;
      }
    }
    this._inputElement = document.createElement("input");
    this._inputElement.style.position = "absolute";
    InputLayer.__super__.constructor.call(this, options);
    this._background = void 0;
    this._placeholder = void 0;
    this._isDesignLayer = false;
    this.input = new Layer({
      backgroundColor: "transparent",
      name: "input",
      width: this.width,
      height: this.height,
      parent: this
    });
    if (this.multiLine) {
      this._inputElement = document.createElement("textarea");
    }
    this.input._element.appendChild(this._inputElement);
    this._setTextProperties(this);
    this._inputElement.autocomplete = "off";
    this._inputElement.autocorrect = "off";
    this._inputElement.spellcheck = false;
    this._inputElement.className = "input" + this.id;
    textProperties = {
      text: this.text,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      lineHeight: this.lineHeight,
      fontWeight: this.fontWeight,
      color: this.color,
      backgroundColor: this.backgroundColor,
      width: this.width,
      height: this.height,
      padding: this.padding,
      parent: this.parent
    };
    for (property in textProperties) {
      value = textProperties[property];
      this.on("change:" + property, (function(_this) {
        return function(value) {
          _this._elementHTML.children[0].textContent = "";
          if (_this._isDesignLayer) {
            return;
          }
          _this._setTextProperties(_this);
          return _this._setPlaceholderColor(_this._id, _this.color);
        };
      })(this));
    }
    this._setPlaceholder(this.text);
    this._setPlaceholderColor(this._id, this.color);
    this._elementHTML.children[0].textContent = "";
    this._isFocused = false;
    this._inputElement.onfocus = (function(_this) {
      return function(e) {
        if (_this.focusColor == null) {
          _this.focusColor = "#000";
        }
        _this.emit(Events.InputFocus, event);
        return _this._isFocused = true;
      };
    })(this);
    this._inputElement.onblur = (function(_this) {
      return function(e) {
        _this.emit(Events.InputBlur, event);
        return _this._isFocused = false;
      };
    })(this);
    currentValue = void 0;
    this._inputElement.onkeydown = (function(_this) {
      return function(e) {
        currentValue = _this.value;
        if (e.which === 20) {
          _this.emit(Events.CapsLockKey, event);
        }
        if (e.which === 16) {
          return _this.emit(Events.ShiftKey, event);
        }
      };
    })(this);
    this._inputElement.onkeyup = (function(_this) {
      return function(e) {
        if (currentValue !== _this.value) {
          _this.emit("change:value", _this.value);
          _this.emit(Events.ValueChange, _this.value);
        }
        if (e.which === 13) {
          _this.emit(Events.EnterKey, event);
        }
        if (e.which === 8) {
          _this.emit(Events.BackspaceKey, event);
        }
        if (e.which === 32) {
          _this.emit(Events.SpaceKey, event);
        }
        if (e.which === 20) {
          return _this.emit(Events.CapsLockKey, event);
        }
      };
    })(this);
  }

  InputLayer.prototype._setPlaceholder = function(text) {
    return this._inputElement.placeholder = text;
  };

  InputLayer.prototype._setPlaceholderColor = function(id, color) {
    return document.styleSheets[0].addRule(".input" + id + "::-webkit-input-placeholder", "color: " + color);
  };

  InputLayer.prototype._checkDevicePixelRatio = function() {
    var dpr, ratio;
    ratio = Screen.width / Framer.Device.screen.width;
    if (Utils.isDesktop()) {
      if (ratio < 0.5 && ratio > 0.25) {
        dpr = 1 - ratio;
      } else if (ratio === 0.25) {
        dpr = 1 - (ratio * 2);
      } else {
        dpr = Utils.devicePixelRatio();
      }
      if (Framer.Device.deviceType === "fullscreen") {
        dpr = 2;
      }
    } else {
      if (ratio < 0.5 && ratio > 0.25) {
        dpr = 1 - ratio;
      } else if (ratio === 0.25) {
        dpr = 1 - (ratio * 2);
      } else if (ratio === 0.5) {
        dpr = 1;
      }
    }
    return dpr;
  };

  InputLayer.prototype._setTextProperties = function(layer) {
    var dpr, ref;
    dpr = this._checkDevicePixelRatio();
    if (!this._isDesignLayer) {
      this._inputElement.style.fontFamily = layer.fontFamily;
      this._inputElement.style.fontSize = (layer.fontSize / dpr) + "px";
      this._inputElement.style.fontWeight = (ref = layer.fontWeight) != null ? ref : "normal";
      this._inputElement.style.paddingTop = (layer.padding.top * 2 / dpr) + "px";
      this._inputElement.style.paddingRight = (layer.padding.bottom * 2 / dpr) + "px";
      this._inputElement.style.paddingBottom = (layer.padding.right * 2 / dpr) + "px";
      this._inputElement.style.paddingLeft = (layer.padding.left * 2 / dpr) + "px";
    }
    this._inputElement.style.width = ((layer.width - layer.padding.left * 2) * 2 / dpr) + "px";
    this._inputElement.style.height = (layer.height * 2 / dpr) + "px";
    this._inputElement.style.outline = "none";
    this._inputElement.style.backgroundColor = "transparent";
    this._inputElement.style.cursor = "auto";
    this._inputElement.style.webkitAppearance = "none";
    this._inputElement.style.resize = "none";
    this._inputElement.style.overflow = "hidden";
    return this._inputElement.style.webkitFontSmoothing = "antialiased";
  };

  InputLayer.prototype.addBackgroundLayer = function(layer) {
    this._background = layer;
    this._background.parent = this;
    this._background.name = "background";
    this._background.x = this._background.y = 0;
    this._background._element.appendChild(this._inputElement);
    return this._background;
  };

  InputLayer.prototype.addPlaceHolderLayer = function(layer) {
    var dpr;
    this._isDesignLayer = true;
    this._inputElement.className = "input" + layer.id;
    this.padding = {
      left: 0,
      top: 0
    };
    this._setPlaceholder(layer.text);
    this._setTextProperties(layer);
    this._setPlaceholderColor(layer.id, layer.color);
    this.on("change:color", (function(_this) {
      return function() {
        return _this._setPlaceholderColor(layer.id, _this.color);
      };
    })(this));
    layer.visible = false;
    this._elementHTML.children[0].textContent = "";
    dpr = this._checkDevicePixelRatio();
    this._inputElement.style.fontSize = (layer.fontSize * 2 / dpr) + "px";
    this._inputElement.style.paddingTop = (layer.y * 2 / dpr) + "px";
    this._inputElement.style.paddingLeft = (layer.x * 2 / dpr) + "px";
    this._inputElement.style.width = ((this._background.width - layer.x * 2) * 2 / dpr) + "px";
    if (this.multiLine) {
      this._inputElement.style.height = (this._background.height * 2 / dpr) + "px";
    }
    this.on("change:padding", (function(_this) {
      return function() {
        _this._inputElement.style.paddingTop = (_this.padding.top * 2 / dpr) + "px";
        return _this._inputElement.style.paddingLeft = (_this.padding.left * 2 / dpr) + "px";
      };
    })(this));
    return this._placeholder;
  };

  InputLayer.prototype.focus = function() {
    return this._inputElement.focus();
  };

  InputLayer.define("value", {
    get: function() {
      return this._inputElement.value;
    },
    set: function(value) {
      return this._inputElement.value = value;
    }
  });

  InputLayer.define("focusColor", {
    get: function() {
      return this._inputElement.style.color;
    },
    set: function(value) {
      return this._inputElement.style.color = value;
    }
  });

  InputLayer.define("multiLine", InputLayer.simpleProperty("multiLine", false));

  InputLayer.wrap = function(background, placeholder, options) {
    return wrapInput(new this(options), background, placeholder, options);
  };

  InputLayer.prototype.onEnterKey = function(cb) {
    return this.on(Events.EnterKey, cb);
  };

  InputLayer.prototype.onSpaceKey = function(cb) {
    return this.on(Events.SpaceKey, cb);
  };

  InputLayer.prototype.onBackspaceKey = function(cb) {
    return this.on(Events.BackspaceKey, cb);
  };

  InputLayer.prototype.onCapsLockKey = function(cb) {
    return this.on(Events.CapsLockKey, cb);
  };

  InputLayer.prototype.onShiftKey = function(cb) {
    return this.on(Events.ShiftKey, cb);
  };

  InputLayer.prototype.onValueChange = function(cb) {
    return this.on(Events.ValueChange, cb);
  };

  InputLayer.prototype.onInputFocus = function(cb) {
    return this.on(Events.InputFocus, cb);
  };

  InputLayer.prototype.onInputBlur = function(cb) {
    return this.on(Events.InputBlur, cb);
  };

  return InputLayer;

})(TextLayer);

wrapInput = function(instance, background, placeholder) {
  var input, ref;
  if (!(background instanceof Layer)) {
    throw new Error("InputLayer expects a background layer.");
  }
  if (!(placeholder instanceof TextLayer)) {
    throw new Error("InputLayer expects a text layer.");
  }
  input = instance;
  if (input.__framerInstanceInfo == null) {
    input.__framerInstanceInfo = {};
  }
  if ((ref = input.__framerInstanceInfo) != null) {
    ref.name = instance.constructor.name;
  }
  input.frame = background.frame;
  input.parent = background.parent;
  input.index = background.index;
  input.addBackgroundLayer(background);
  input.addPlaceHolderLayer(placeholder);
  return input;
};


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1ZvbHVtZXMvR29vZ2xlRHJpdmUvVGVhbSBEcml2ZXMvUHJvZHVjdCBEZXNpZ24vMDJfQ29uc3VtZXIvUGVyc29uYWxpemF0aW9uIFJlbGV2YW5jZS9QcmVmZXJlbmNlcyBpT1MvT25ib2FyZGluZyBGbG93IC0gNi03LTguZnJhbWVyL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVm9sdW1lcy9Hb29nbGVEcml2ZS9UZWFtIERyaXZlcy9Qcm9kdWN0IERlc2lnbi8wMl9Db25zdW1lci9QZXJzb25hbGl6YXRpb24gUmVsZXZhbmNlL1ByZWZlcmVuY2VzIGlPUy9PbmJvYXJkaW5nIEZsb3cgLSA2LTctOC5mcmFtZXIvbW9kdWxlcy9pbnB1dC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCJFdmVudHMuRW50ZXJLZXkgPSBcIkVudGVyS2V5XCJcbkV2ZW50cy5TcGFjZUtleSA9IFwiU3BhY2VLZXlcIlxuRXZlbnRzLkJhY2tzcGFjZUtleSA9IFwiQmFja3NwYWNlS2V5XCJcbkV2ZW50cy5DYXBzTG9ja0tleSA9IFwiQ2Fwc0xvY2tLZXlcIlxuRXZlbnRzLlNoaWZ0S2V5ID0gXCJTaGlmdEtleVwiXG5FdmVudHMuVmFsdWVDaGFuZ2UgPSBcIlZhbHVlQ2hhbmdlXCJcbkV2ZW50cy5JbnB1dEZvY3VzID0gXCJJbnB1dEZvY3VzXCJcbkV2ZW50cy5JbnB1dEJsdXIgPSBcIklucHV0Qmx1clwiXG5cbmNsYXNzIGV4cG9ydHMuSW5wdXRMYXllciBleHRlbmRzIFRleHRMYXllclxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblxuXHRcdF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCIjRkZGXCJcblx0XHRcdHdpZHRoOiAzNzVcblx0XHRcdGhlaWdodDogNjBcblx0XHRcdHBhZGRpbmc6XG5cdFx0XHRcdGxlZnQ6IDIwXG5cdFx0XHR0ZXh0OiBcIlR5cGUgc29tZXRoaW5nLi4uXCJcblx0XHRcdGZvbnRTaXplOiA0MFxuXHRcdFx0Zm9udFdlaWdodDogMzAwXG5cblx0XHRpZiBvcHRpb25zLm11bHRpTGluZVxuXHRcdFx0b3B0aW9ucy5wYWRkaW5nLnRvcCA/PSAyMFxuXG5cdFx0QF9pbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIilcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIlxuXG5cdFx0c3VwZXIgb3B0aW9uc1xuXG5cdFx0IyBHbG9iYWxzXG5cdFx0QF9iYWNrZ3JvdW5kID0gdW5kZWZpbmVkXG5cdFx0QF9wbGFjZWhvbGRlciA9IHVuZGVmaW5lZFxuXHRcdEBfaXNEZXNpZ25MYXllciA9IGZhbHNlXG5cblx0XHQjIExheWVyIGNvbnRhaW5pbmcgaW5wdXQgZWxlbWVudFxuXHRcdEBpbnB1dCA9IG5ldyBMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0XHRcdG5hbWU6IFwiaW5wdXRcIlxuXHRcdFx0d2lkdGg6IEB3aWR0aFxuXHRcdFx0aGVpZ2h0OiBAaGVpZ2h0XG5cdFx0XHRwYXJlbnQ6IEBcblxuXHRcdCMgVGV4dCBhcmVhXG5cdFx0aWYgQG11bHRpTGluZVxuXHRcdFx0QF9pbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIilcblxuXHRcdCMgQXBwZW5kIGVsZW1lbnRcblx0XHRAaW5wdXQuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoQF9pbnB1dEVsZW1lbnQpXG5cblx0XHQjIE1hdGNoIFRleHRMYXllciBkZWZhdWx0cyBhbmQgdHlwZSBwcm9wZXJ0aWVzXG5cdFx0QF9zZXRUZXh0UHJvcGVydGllcyhAKVxuXG5cdFx0IyBTZXQgYXR0cmlidXRlc1xuXHRcdEBfaW5wdXRFbGVtZW50LmF1dG9jb21wbGV0ZSA9IFwib2ZmXCJcblx0XHRAX2lucHV0RWxlbWVudC5hdXRvY29ycmVjdCA9IFwib2ZmXCJcblx0XHRAX2lucHV0RWxlbWVudC5zcGVsbGNoZWNrID0gZmFsc2VcblxuXHRcdCMgVGhlIGlkIHNlcnZlcyB0byBkaWZmZXJlbnRpYXRlIG11bHRpcGxlIGlucHV0IGVsZW1lbnRzIGZyb20gb25lIGFub3RoZXIuXG5cdFx0IyBUbyBhbGxvdyBzdHlsaW5nIHRoZSBwbGFjZWhvbGRlciBjb2xvcnMgb2Ygc2VwZXJhdGUgZWxlbWVudHMuXG5cdFx0QF9pbnB1dEVsZW1lbnQuY2xhc3NOYW1lID0gXCJpbnB1dFwiICsgQGlkXG5cblx0XHQjIEFsbCBpbmhlcml0ZWQgcHJvcGVydGllc1xuXHRcdHRleHRQcm9wZXJ0aWVzID1cblx0XHRcdHtAdGV4dCwgQGZvbnRGYW1pbHksIEBmb250U2l6ZSwgQGxpbmVIZWlnaHQsIEBmb250V2VpZ2h0LCBAY29sb3IsIEBiYWNrZ3JvdW5kQ29sb3IsIEB3aWR0aCwgQGhlaWdodCwgQHBhZGRpbmcsIEBwYXJlbnR9XG5cblx0XHRmb3IgcHJvcGVydHksIHZhbHVlIG9mIHRleHRQcm9wZXJ0aWVzXG5cblx0XHRcdEBvbiBcImNoYW5nZToje3Byb3BlcnR5fVwiLCAodmFsdWUpID0+XG5cdFx0XHRcdCMgUmVzZXQgdGV4dExheWVyIGNvbnRlbnRzXG5cdFx0XHRcdEBfZWxlbWVudEhUTUwuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBcIlwiXG5cblx0XHRcdFx0cmV0dXJuIGlmIEBfaXNEZXNpZ25MYXllclxuXHRcdFx0XHRAX3NldFRleHRQcm9wZXJ0aWVzKEApXG5cdFx0XHRcdEBfc2V0UGxhY2Vob2xkZXJDb2xvcihAX2lkLCBAY29sb3IpXG5cblxuXHRcdCMgU2V0IGRlZmF1bHQgcGxhY2Vob2xkZXJcblx0XHRAX3NldFBsYWNlaG9sZGVyKEB0ZXh0KVxuXHRcdEBfc2V0UGxhY2Vob2xkZXJDb2xvcihAX2lkLCBAY29sb3IpXG5cblx0XHQjIFJlc2V0IHRleHRMYXllciBjb250ZW50c1xuXHRcdEBfZWxlbWVudEhUTUwuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBcIlwiXG5cblx0XHQjIENoZWNrIGlmIGluIGZvY3VzXG5cdFx0QF9pc0ZvY3VzZWQgPSBmYWxzZVxuXG5cdFx0IyBEZWZhdWx0IGZvY3VzIGludGVyYWN0aW9uXG5cdFx0QF9pbnB1dEVsZW1lbnQub25mb2N1cyA9IChlKSA9PlxuXG5cdFx0XHRAZm9jdXNDb2xvciA/PSBcIiMwMDBcIlxuXG5cdFx0XHQjIEVtaXQgZm9jdXMgZXZlbnRcblx0XHRcdEBlbWl0KEV2ZW50cy5JbnB1dEZvY3VzLCBldmVudClcblxuXHRcdFx0QF9pc0ZvY3VzZWQgPSB0cnVlXG5cblx0XHQjIEVtaXQgYmx1ciBldmVudFxuXHRcdEBfaW5wdXRFbGVtZW50Lm9uYmx1ciA9IChlKSA9PlxuXHRcdFx0QGVtaXQoRXZlbnRzLklucHV0Qmx1ciwgZXZlbnQpXG5cblx0XHRcdEBfaXNGb2N1c2VkID0gZmFsc2VcblxuXHRcdCMgVG8gZmlsdGVyIGlmIHZhbHVlIGNoYW5nZWQgbGF0ZXJcblx0XHRjdXJyZW50VmFsdWUgPSB1bmRlZmluZWRcblxuXHRcdCMgU3RvcmUgY3VycmVudCB2YWx1ZVxuXHRcdEBfaW5wdXRFbGVtZW50Lm9ua2V5ZG93biA9IChlKSA9PlxuXHRcdFx0Y3VycmVudFZhbHVlID0gQHZhbHVlXG5cblx0XHRcdCMgSWYgY2FwcyBsb2NrIGtleSBpcyBwcmVzc2VkIGRvd25cblx0XHRcdGlmIGUud2hpY2ggaXMgMjBcblx0XHRcdFx0QGVtaXQoRXZlbnRzLkNhcHNMb2NrS2V5LCBldmVudClcblxuXHRcdFx0IyBJZiBzaGlmdCBrZXkgaXMgcHJlc3NlZFxuXHRcdFx0aWYgZS53aGljaCBpcyAxNlxuXHRcdFx0XHRAZW1pdChFdmVudHMuU2hpZnRLZXksIGV2ZW50KVxuXG5cdFx0QF9pbnB1dEVsZW1lbnQub25rZXl1cCA9IChlKSA9PlxuXG5cdFx0XHRpZiBjdXJyZW50VmFsdWUgaXNudCBAdmFsdWVcblx0XHRcdFx0QGVtaXQoXCJjaGFuZ2U6dmFsdWVcIiwgQHZhbHVlKVxuXHRcdFx0XHRAZW1pdChFdmVudHMuVmFsdWVDaGFuZ2UsIEB2YWx1ZSlcblxuXHRcdFx0IyBJZiBlbnRlciBrZXkgaXMgcHJlc3NlZFxuXHRcdFx0aWYgZS53aGljaCBpcyAxM1xuXHRcdFx0XHRAZW1pdChFdmVudHMuRW50ZXJLZXksIGV2ZW50KVxuXG5cdFx0XHQjIElmIGJhY2tzcGFjZSBrZXkgaXMgcHJlc3NlZFxuXHRcdFx0aWYgZS53aGljaCBpcyA4XG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5CYWNrc3BhY2VLZXksIGV2ZW50KVxuXG5cdFx0XHQjIElmIHNwYWNlIGtleSBpcyBwcmVzc2VkXG5cdFx0XHRpZiBlLndoaWNoIGlzIDMyXG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5TcGFjZUtleSwgZXZlbnQpXG5cblx0XHRcdCMgSWYgY2FwcyBsb2NrIGtleSBpcyBwcmVzc2VkIHVwXG5cdFx0XHRpZiBlLndoaWNoIGlzIDIwXG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5DYXBzTG9ja0tleSwgZXZlbnQpXG5cblx0X3NldFBsYWNlaG9sZGVyOiAodGV4dCkgPT5cblx0XHRAX2lucHV0RWxlbWVudC5wbGFjZWhvbGRlciA9IHRleHRcblxuXHRfc2V0UGxhY2Vob2xkZXJDb2xvcjogKGlkLCBjb2xvcikgLT5cblx0XHRkb2N1bWVudC5zdHlsZVNoZWV0c1swXS5hZGRSdWxlKFwiLmlucHV0I3tpZH06Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXJcIiwgXCJjb2xvcjogI3tjb2xvcn1cIilcblxuXHRfY2hlY2tEZXZpY2VQaXhlbFJhdGlvOiAtPlxuXHRcdHJhdGlvID0gKFNjcmVlbi53aWR0aCAvIEZyYW1lci5EZXZpY2Uuc2NyZWVuLndpZHRoKVxuXHRcdGlmIFV0aWxzLmlzRGVza3RvcCgpXG5cdFx0XHQjIEAzeFxuXHRcdFx0aWYgcmF0aW8gPCAwLjUgYW5kIHJhdGlvID4gMC4yNVxuXHRcdFx0XHRkcHIgPSAxIC0gcmF0aW9cblx0XHRcdCMgQDR4XG5cdFx0XHRlbHNlIGlmIHJhdGlvIGlzIDAuMjVcblx0XHRcdFx0ZHByID0gMSAtIChyYXRpbyAqIDIpXG5cdFx0XHQjIEAxeCwgQDJ4XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRwciA9IFV0aWxzLmRldmljZVBpeGVsUmF0aW8oKVxuXHRcdFx0aWYgRnJhbWVyLkRldmljZS5kZXZpY2VUeXBlIGlzIFwiZnVsbHNjcmVlblwiXG5cdFx0XHRcdGRwciA9IDJcblx0XHRlbHNlXG5cdFx0XHQjIEAzeFxuXHRcdFx0aWYgcmF0aW8gPCAwLjUgYW5kIHJhdGlvID4gMC4yNVxuXHRcdFx0XHRkcHIgPSAxIC0gcmF0aW9cblx0XHRcdCMgQDR4XG5cdFx0XHRlbHNlIGlmIHJhdGlvIGlzIDAuMjVcblx0XHRcdFx0ZHByID0gMSAtIChyYXRpbyAqIDIpXG5cdFx0XHQjIEAxeCwgQDJ4XG5cdFx0XHRlbHNlIGlmIHJhdGlvIGlzIDAuNVxuXHRcdFx0XHRkcHIgPSAxXG5cblx0XHRyZXR1cm4gZHByXG5cblx0X3NldFRleHRQcm9wZXJ0aWVzOiAobGF5ZXIpID0+XG5cblx0XHRkcHIgPSBAX2NoZWNrRGV2aWNlUGl4ZWxSYXRpbygpXG5cblx0XHRpZiBub3QgQF9pc0Rlc2lnbkxheWVyXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5mb250RmFtaWx5ID0gbGF5ZXIuZm9udEZhbWlseVxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSBcIiN7bGF5ZXIuZm9udFNpemUgLyBkcHJ9cHhcIlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9IGxheWVyLmZvbnRXZWlnaHQgPyBcIm5vcm1hbFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nVG9wID0gXCIje2xheWVyLnBhZGRpbmcudG9wICogMiAvIGRwcn1weFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIiN7bGF5ZXIucGFkZGluZy5ib3R0b20gKiAyIC8gZHByfXB4XCJcblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdCb3R0b20gPSBcIiN7bGF5ZXIucGFkZGluZy5yaWdodCAqIDIgLyBkcHJ9cHhcIlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucGFkZGluZ0xlZnQgPSBcIiN7bGF5ZXIucGFkZGluZy5sZWZ0ICogMiAvIGRwcn1weFwiXG5cblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS53aWR0aCA9IFwiI3soKGxheWVyLndpZHRoIC0gbGF5ZXIucGFkZGluZy5sZWZ0ICogMikgKiAyIC8gZHByKX1weFwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCIje2xheWVyLmhlaWdodCAqIDIgLyBkcHJ9cHhcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLm91dGxpbmUgPSBcIm5vbmVcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwidHJhbnNwYXJlbnRcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLmN1cnNvciA9IFwiYXV0b1wiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUud2Via2l0QXBwZWFyYW5jZSA9IFwibm9uZVwiXG5cdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUucmVzaXplID0gXCJub25lXCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS53ZWJraXRGb250U21vb3RoaW5nID0gXCJhbnRpYWxpYXNlZFwiXG5cblx0YWRkQmFja2dyb3VuZExheWVyOiAobGF5ZXIpIC0+XG5cdFx0QF9iYWNrZ3JvdW5kID0gbGF5ZXJcblx0XHRAX2JhY2tncm91bmQucGFyZW50ID0gQFxuXHRcdEBfYmFja2dyb3VuZC5uYW1lID0gXCJiYWNrZ3JvdW5kXCJcblx0XHRAX2JhY2tncm91bmQueCA9IEBfYmFja2dyb3VuZC55ID0gMFxuXHRcdEBfYmFja2dyb3VuZC5fZWxlbWVudC5hcHBlbmRDaGlsZChAX2lucHV0RWxlbWVudClcblxuXHRcdHJldHVybiBAX2JhY2tncm91bmRcblxuXHRhZGRQbGFjZUhvbGRlckxheWVyOiAobGF5ZXIpIC0+XG5cblx0XHRAX2lzRGVzaWduTGF5ZXIgPSB0cnVlXG5cdFx0QF9pbnB1dEVsZW1lbnQuY2xhc3NOYW1lID0gXCJpbnB1dFwiICsgbGF5ZXIuaWRcblx0XHRAcGFkZGluZyA9IGxlZnQ6IDAsIHRvcDogMFxuXG5cdFx0QF9zZXRQbGFjZWhvbGRlcihsYXllci50ZXh0KVxuXHRcdEBfc2V0VGV4dFByb3BlcnRpZXMobGF5ZXIpXG5cdFx0QF9zZXRQbGFjZWhvbGRlckNvbG9yKGxheWVyLmlkLCBsYXllci5jb2xvcilcblxuXHRcdEBvbiBcImNoYW5nZTpjb2xvclwiLCA9PlxuXHRcdFx0QF9zZXRQbGFjZWhvbGRlckNvbG9yKGxheWVyLmlkLCBAY29sb3IpXG5cblx0XHQjIFJlbW92ZSBvcmlnaW5hbCBsYXllclxuXHRcdGxheWVyLnZpc2libGUgPSBmYWxzZVxuXHRcdEBfZWxlbWVudEhUTUwuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBcIlwiXG5cblx0XHQjIENvbnZlcnQgcG9zaXRpb24gdG8gcGFkZGluZ1xuXHRcdGRwciA9IEBfY2hlY2tEZXZpY2VQaXhlbFJhdGlvKClcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IFwiI3tsYXllci5mb250U2l6ZSAqIDIgLyBkcHJ9cHhcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdUb3AgPSBcIiN7bGF5ZXIueSAqIDIgLyBkcHJ9cHhcIlxuXHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIje2xheWVyLnggKiAyIC8gZHByfXB4XCJcblx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS53aWR0aCA9IFwiI3soQF9iYWNrZ3JvdW5kLndpZHRoIC0gbGF5ZXIueCAqIDIpICogMiAvIGRwcn1weFwiXG5cblx0XHRpZiBAbXVsdGlMaW5lXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIiN7QF9iYWNrZ3JvdW5kLmhlaWdodCAqIDIgLyBkcHJ9cHhcIlxuXG5cdFx0QG9uIFwiY2hhbmdlOnBhZGRpbmdcIiwgPT5cblx0XHRcdEBfaW5wdXRFbGVtZW50LnN0eWxlLnBhZGRpbmdUb3AgPSBcIiN7QHBhZGRpbmcudG9wICogMiAvIGRwcn1weFwiXG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiI3tAcGFkZGluZy5sZWZ0ICogMiAvIGRwcn1weFwiXG5cblx0XHRyZXR1cm4gQF9wbGFjZWhvbGRlclxuXG5cdGZvY3VzOiAtPlxuXHRcdEBfaW5wdXRFbGVtZW50LmZvY3VzKClcblxuXHRAZGVmaW5lIFwidmFsdWVcIixcblx0XHRnZXQ6IC0+IEBfaW5wdXRFbGVtZW50LnZhbHVlXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAX2lucHV0RWxlbWVudC52YWx1ZSA9IHZhbHVlXG5cblx0QGRlZmluZSBcImZvY3VzQ29sb3JcIixcblx0XHRnZXQ6IC0+XG5cdFx0XHRAX2lucHV0RWxlbWVudC5zdHlsZS5jb2xvclxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0QF9pbnB1dEVsZW1lbnQuc3R5bGUuY29sb3IgPSB2YWx1ZVxuXG5cdEBkZWZpbmUgXCJtdWx0aUxpbmVcIiwgQHNpbXBsZVByb3BlcnR5KFwibXVsdGlMaW5lXCIsIGZhbHNlKVxuXG5cdCMgTmV3IENvbnN0cnVjdG9yXG5cdEB3cmFwID0gKGJhY2tncm91bmQsIHBsYWNlaG9sZGVyLCBvcHRpb25zKSAtPlxuXHRcdHJldHVybiB3cmFwSW5wdXQobmV3IEAob3B0aW9ucyksIGJhY2tncm91bmQsIHBsYWNlaG9sZGVyLCBvcHRpb25zKVxuXG5cdG9uRW50ZXJLZXk6IChjYikgLT4gQG9uKEV2ZW50cy5FbnRlcktleSwgY2IpXG5cdG9uU3BhY2VLZXk6IChjYikgLT4gQG9uKEV2ZW50cy5TcGFjZUtleSwgY2IpXG5cdG9uQmFja3NwYWNlS2V5OiAoY2IpIC0+IEBvbihFdmVudHMuQmFja3NwYWNlS2V5LCBjYilcblx0b25DYXBzTG9ja0tleTogKGNiKSAtPiBAb24oRXZlbnRzLkNhcHNMb2NrS2V5LCBjYilcblx0b25TaGlmdEtleTogKGNiKSAtPiBAb24oRXZlbnRzLlNoaWZ0S2V5LCBjYilcblx0b25WYWx1ZUNoYW5nZTogKGNiKSAtPiBAb24oRXZlbnRzLlZhbHVlQ2hhbmdlLCBjYilcblx0b25JbnB1dEZvY3VzOiAoY2IpIC0+IEBvbihFdmVudHMuSW5wdXRGb2N1cywgY2IpXG5cdG9uSW5wdXRCbHVyOiAoY2IpIC0+IEBvbihFdmVudHMuSW5wdXRCbHVyLCBjYilcblxud3JhcElucHV0ID0gKGluc3RhbmNlLCBiYWNrZ3JvdW5kLCBwbGFjZWhvbGRlcikgLT5cblx0aWYgbm90IChiYWNrZ3JvdW5kIGluc3RhbmNlb2YgTGF5ZXIpXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5wdXRMYXllciBleHBlY3RzIGEgYmFja2dyb3VuZCBsYXllci5cIilcblxuXHRpZiBub3QgKHBsYWNlaG9sZGVyIGluc3RhbmNlb2YgVGV4dExheWVyKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIklucHV0TGF5ZXIgZXhwZWN0cyBhIHRleHQgbGF5ZXIuXCIpXG5cblx0aW5wdXQgPSBpbnN0YW5jZVxuXG5cdGlucHV0Ll9fZnJhbWVySW5zdGFuY2VJbmZvID89IHt9XG5cdGlucHV0Ll9fZnJhbWVySW5zdGFuY2VJbmZvPy5uYW1lID0gaW5zdGFuY2UuY29uc3RydWN0b3IubmFtZVxuXG5cdGlucHV0LmZyYW1lID0gYmFja2dyb3VuZC5mcmFtZVxuXHRpbnB1dC5wYXJlbnQgPSBiYWNrZ3JvdW5kLnBhcmVudFxuXHRpbnB1dC5pbmRleCA9IGJhY2tncm91bmQuaW5kZXhcblxuXHRpbnB1dC5hZGRCYWNrZ3JvdW5kTGF5ZXIoYmFja2dyb3VuZClcblx0aW5wdXQuYWRkUGxhY2VIb2xkZXJMYXllcihwbGFjZWhvbGRlcilcblxuXHRyZXR1cm4gaW5wdXRcbiIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBRUFBO0FEQUEsSUFBQSxTQUFBO0VBQUE7Ozs7QUFBQSxNQUFNLENBQUMsUUFBUCxHQUFrQjs7QUFDbEIsTUFBTSxDQUFDLFFBQVAsR0FBa0I7O0FBQ2xCLE1BQU0sQ0FBQyxZ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
