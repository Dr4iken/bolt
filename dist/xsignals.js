"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signal = void 0;
/**
 * Represents a lightweight implementation of the observer pattern.
 * Allows subscribing and emitting events with a specific data type.
 *
 * @template T - The type of data the signal will carry.
 */
var Signal = /** @class */ (function () {
    function Signal() {
        this.listenersMap = new Map();
    }
    /**
     * Subscribes a listener to the signal.
     *
     * @param {string} key - The key to identify the listener.
     * @param {SignalListener<T>} listener - The function to be called when the signal is emitted.
     * @returns {() => void} - A function that unsubscribes the listener when called.
     */
    Signal.prototype.subscribe = function (key, listener) {
        var _this = this;
        if (!this.listenersMap.has(key)) {
            this.listenersMap.set(key, []);
        }
        this.listenersMap.get(key).push(listener);
        return function () {
            _this.unsubscribeByKey(key);
        };
    };
    /**
     * Unsubscribes all listeners associated with a specific key.
     *
     * @param {string} key - The key to identify the listeners to unsubscribe.
     */
    Signal.prototype.unsubscribeByKey = function (key) {
        this.listenersMap.delete(key);
    };
    /**
     * Emits an event to all subscribed listeners associated with a specific key.
     *
     * @param {string} key - The key to identify the listeners to emit the event to.
     * @param {T} data - The data to be sent to the listeners.
     */
    Signal.prototype.emit = function (key, data) {
        var listeners = this.listenersMap.get(key) || [];
        listeners.forEach(function (listener) { return listener(data); });
    };
    return Signal;
}());
exports.Signal = Signal;
