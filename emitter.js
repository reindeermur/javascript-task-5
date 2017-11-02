'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (! ((event in events))) {
                events[event] = [];
            }
            events[event].push({ context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            [event].concat(Object.keys(events)
                .filter(ev => ev.startsWith(event + '.')))
                .filter(ev => events[ev])
                .forEach(currentEvent => {
                    events[currentEvent] = events[currentEvent]
                        .filter(i => i.context !== context);
                });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let localEvent = event.split('.');
            while (localEvent.length) {
                event = localEvent.join('.');
                if (events[event]) {
                    events[event].forEach(i =>i.handler.call(i.context));
                }
                localEvent.pop();
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            if (times <= 0) {
                this.on(event, context, handler);
            }
            let count = times;
            this.on(event, context, () => {
                if (count > 0) {
                    handler.call(context);
                }
                count--;
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            if (frequency <= 0) {
                this.on(event, context, handler);
            }
            let count = 0;
            this.on(event, handler, () => {
                if (count % frequency === 0) {
                    handler.call(context);
                }
                count++;
            });

            return this;
        }
    };
}
