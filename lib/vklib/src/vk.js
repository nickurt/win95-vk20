(function() {
    if (typeof window.vk === 'object') {
        return;
    }

    var slice = Array.prototype.slice;

    function $(selector) {
        return document.querySelector(selector);
    }

    function $$(selector) {
        var elements = document.querySelectorAll(selector);
        return slice.call(elements);
    }

    // Polyfill Element.matches
    if (!Element.prototype.matches) {
        var ep = Element.prototype;
        ep.matches = ep.matchesSelector ||
                     ep.msMatchesSelector ||
                     ep.webkitMatchesSelector ||
                     ep.mozMatchesSelector;
    }

    var vk = {
        $ : $,

        $$ : $$,

        extend : function(source, target) {
            for (var key in target) {
                source[key] = target[key];
            }
        },

        isTouch : function() {
            return 'ontouchend' in window;
        },

        setupTouchClasses : function() {
            var className = vk.isTouch() ? 'has-touch' : 'has-mouse';
            $("html").classList.add(className);
        },

        // A bare-bones class creation utility.
        subclass : function(Parent, methods) {
            var Ctor = function() {
                if (typeof methods.constructor === 'function') {
                    methods.constructor.apply(this, arguments);
                }
            };

            Ctor.prototype = Object.create(Parent.prototype);

            vk.extend(Ctor.prototype, methods);

            return Ctor;
        }
    };

    window.vk = vk;
})();