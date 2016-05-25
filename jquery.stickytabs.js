/**
* jQuery Plugin: Sticky Tabs
*
* @author Aidan Lister <aidan@php.net>
* @version 1.2.0
*/

(function ($) {

    'use strict';

    $.fn.stickyTabs = function (options) {

        var context, settings, showTabFromHash, changeHash, backToTop;

        context = this;

        settings = $.extend({
            getHashCallback: function (hash, btn) {
                return hash;
            },
            tabPersistence: true,
            selectorAttribute: "href",
            backToTop: false,
            initialTab: $('li.active > a', context)
        }, options);

        // Show the tab corresponding with the hash in the URL, or the first tab.
        showTabFromHash = function () {
            var hash, selector;
            hash = (settings.selectorAttribute === "href") ? window.location.hash : window.location.hash.substring(1);
            selector = hash ? 'a[' + settings.selectorAttribute + '="' + hash + '"]' : settings.initialTab;
            $(selector, context).tab('show');
            setTimeout(backToTop, 1);
        };

        // We use pushState if it's available so the page won't jump, otherwise a shim.
        changeHash = function (hash) {
            var url, scrollV, scrollH;
            scrollV = document.body.scrollTop;
            scrollH = document.body.scrollLeft;
            url = window.location.pathname + window.location.search;
            if (settings.tabPersistence === true) {
                url += '#' + hash;
                if (history && history.pushState) {
                    history.pushState(null, null, url);
                } else {
                    window.location = url;
                }
            } else if (history && history.replaceState) {
                history.replaceState(null, null, url);
            }
            document.body.scrollTop = scrollV;
            document.body.scrollLeft = scrollH;
        };

        backToTop = function () {
            if (settings.backToTop === true) {
                window.scrollTo(0, 0);
                document.body.scrollTop;
            }
        };

        // Set the correct tab when the page loads
        showTabFromHash();

        // Set the correct tab when a user uses their back/forward button
        $(window).on('hashchange', showTabFromHash);

        // Change the URL when tabs are clicked
        $('a', context).on('click', function () {
            var hash, adjustedhash;
            hash = this.href.split('#')[1];
            adjustedhash = settings.getHashCallback(hash, this);
            changeHash(adjustedhash);
            setTimeout(backToTop, 1);
        });

        return this;
    };

}(jQuery));