"use strict";
function getNames(name) {
    var kv = { tag: null, name: null };
    var names = name.split('|');
    if (names.length > 1) {
        kv.tag = names[0];
        kv.name = names[1];
    }
    else
        kv.name = name;
    return kv;
}
function raiseEvent(evts, args, ctx) {
    if (evts) {
        var promises = [];
        for (var i = 0; i < evts.length;) {
            var h = evts[i];
            if (h.once)
                evts.splice(i, 1);
            else
                i++;
            var fn = h.fn;
            var result, promise;
            try {
                result = fn.apply(ctx, args || []);
                promise = (result instanceof Promise) ? result : Promise.resolve(result);
            }
            catch (err) {
                console.error(err);
                promise = Promise.reject(err);
            }
            promises.push(promise);
        }
        return Promise.all(promises);
    }
    else
        return Promise.resolve();
}
var EventService = (function () {
    function EventService() {
        this.events = {};
        this.cats = {};
    }
    EventService.prototype.cat = function (name) {
        var bus = this.cats[name];
        if (!bus)
            bus = this.cats[name] = new EventService();
        return bus;
    };
    EventService.prototype.raise = function (name, args, ctx) {
        return raiseEvent(this.events[name], args, ctx);
    };
    EventService.prototype.emit = function (name) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var args = [].slice.call(arguments, 1);
        return this.raise(name, args);
    };
    EventService.prototype.once = function (names, fn) {
        var _this = this;
        var items = names.split(' ');
        items.forEach(function (name) {
            _this.on(name, fn, true);
        });
        return this;
    };
    EventService.prototype.on = function (names, fn, once) {
        var _this = this;
        if (typeof (fn) == 'undefined') {
            return this;
        }
        var items = names.split(' ');
        items.forEach(function (name) {
            var kv = getNames(name);
            var _name = kv.name;
            var evts = _this.events[_name];
            if (!evts)
                evts = _this.events[_name] = [];
            evts.push({ fn: fn, once: once, tag: kv.tag });
        });
        return this;
    };
    EventService.prototype.off = function (names, fn) {
        var _this = this;
        var items = names.split(' ');
        items.forEach(function (name) {
            var kv = getNames(name);
            var _name = kv.name;
            var _tag = kv.tag;
            var no_tag = (name.indexOf('|') === -1);
            var evts = _this.events[_name];
            if (evts) {
                for (var i = 0; i < evts.length; i++) {
                    var h = evts[i];
                    if ((fn && h.fn === fn) || (!fn && (no_tag || h.tag === _tag)))
                        evts.splice(i, 1);
                }
            }
        });
        return this;
    };
    EventService.singleton = function () {
        if (EventService._instance)
            return EventService._instance;
        EventService._instance = new EventService();
        return EventService._instance;
    };
    return EventService;
}());
exports.__esModule = true;
exports["default"] = EventService;
