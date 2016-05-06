'use strict';
(function() {
    var $ = vk.$;
    var appName, category;
    var TIME_ON_PAGE_INTERVAL = 10;
    var MAX_TIME_ON_PAGE = 60 * 30; // 30 minutes
    var conf = {
        debug : false,
        useChartbeat : true,
        trackTimeonpage : true,
        trackLinks : true,
        trackFirstscroll : false
    };
    var $body = $("body");

    function getSessionTime() {
        if (!window.__headerstart__) {
            return -1;
        }

        var now = +new Date();
        var diff = now - window.__headerstart__
        // Round to 100s
        diff = Math.round(diff / 100) * 100;

        return diff;
    }

    function initTracker() {
        // Use the 'beacon' transport method if available
        if ('ga' in window) {
            ga('set', 'transport', 'beacon');
        }
    }

    function track(action, label) {
        label = label || '';

        if ('ga' in window) {
            window.ga('send', 'event', {
                'eventCategory' : category,
                'eventAction' : action,
                'eventLabel' : label
            });
        }

        if ('fbq' in window) {
            window.fbq('trackCustom', action, label);
        }

        if (conf.debug) {
            console.log('vktrack: ', category, action, label);
        }
    }

    var tracks = {};

    function trackOnce(action, label) {
        // Only track something once
        if (tracks[action + label]) return;

        tracks[action + label] = true;

        track(action, label);
    }

    function handleTrackClick(e) {
        var el = e.target;

        if (!el.matches('[data-track],[data-trackonce]')) {
            return;
        }

        var label, trackFn;

        if (el.hasAttribute('data-track')) {
            label = el.getAttribute('data-track');
            trackFn = track;
        } else if (el.hasAttribute('data-trackonce')) {
            label = el.getAttribute('data-trackonce');
            trackFn = trackOnce;
        }

        var parts = label.split(':');
        trackFn(parts[0], parts[1]);
    }

    function handleTrackLinkClick(e) {
        if (e.target.matches("a")) {
            track('clicklink', e.target.getAttribute('href'));
        }
    }

    function handleFirstScroll() {
        trackOnce('firstscroll', getSessionTime());
        window.removeEventListener('scroll', handleFirstScroll);
    }

    function bindEventHandlers() {
        $body.addEventListener('click', handleTrackClick);
        $body.addEventListener('contextmenu', handleTrackClick);

        if (conf.trackLinks) {
            $body.addEventListener('click', handleTrackLinkClick);
            $body.addEventListener('contextmenu', handleTrackLinkClick);
        }

        if (conf.trackFirstscroll) {
            window.addEventListener('scroll', handleFirstScroll);
        }
    }

    function initChartbeat() {
        window._sf_async_config = {
            uid : '46966',
            domain : 'volkskrant.nl',
            sections : 'specials'
        };

        window._sf_endpt = +new Date();
        var script = document.createElement('script');
        script.src = '//static.chartbeat.com/js/chartbeat.js';
        $body.appendChild(script);
    }

    function initTrackTime() {
        var startTime = 0;
        vk.track.track('timeonpage', startTime);

        function track() {
            startTime += TIME_ON_PAGE_INTERVAL;
            vk.track.track('timeonpage', startTime);

            if (startTime < MAX_TIME_ON_PAGE) {
                setTimeout(track, TIME_ON_PAGE_INTERVAL * 1000);
            }
        }

        setTimeout(track, TIME_ON_PAGE_INTERVAL * 1000);
    }

    function init(userConf) {
        vk.extend(conf, userConf);

        // Check if we have a data-track-app attribute available
        // otherwise, fail silently
        if (!$body.hasAttribute('data-track-app')) {
            return;
        }

        appName = $body.getAttribute('data-track-app');
        category = 'specials-uxtest-' + appName;
        bindEventHandlers();
        initTracker();

        if (conf.useChartbeat) initChartbeat();
        if (conf.trackTimeonpage) initTrackTime();

        track('vktrackinit');
    }

    if (typeof window.vk === 'object') {
        window.vk.track = {
            getSessionTime : getSessionTime,
            init : init,
            track : track,
            trackOnce : trackOnce
        };
    }
})();