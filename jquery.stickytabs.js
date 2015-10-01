/**
 * jQuery Plugin: Sticky Tabs
 *
 * @author Aidan Lister <aidan@php.net>
 * @version 1.2.0
 */
(function ($) {
    $.fn.stickyTabs = function (options) {
        var context = this;

        var settings = $.extend({
            getHashCallback: function (hash, btn) {
                return hash
            },
            selectorAttribute: "href",
            selectorOperator: "=",
            backToTop: false,
            initialTab: $('li.active > a', context),
            fragmentPathSeparator: '&'
        }, options);

        // Show the tab corresponding with the hash in the URL, or the first tab.
        var showTabFromHash = function () {
            var hash = settings.selectorAttribute == "href" ? window.location.hash : window.location.hash.substring(1);
            var selector = hash ? 'a[' + settings.selectorAttribute + settings.selectorOperator + '"' + hash.split(settings.fragmentPathSeparator)[0] + '"]' : settings.initialTab;
            $(selector, context).tab('show');
            if (settings.backToTop === true) {
                setTimeout(backToTop, 1);
            }
            else {
                followRemainingFragmentPath(hash);
            }
        };

        //Check whether multiple pathElements were indicated and follow them, make sure to skip the first one was already consumed to activate the tab
        var followRemainingFragmentPath = function(hash) {
            if(hash){
                var fragmentPathElements = hash.split(settings.fragmentPathSeparator);
                if (fragmentPathElements.length > 1) {
                    for (var i = 1; i < fragmentPathElements.length; i++) {
                        window.location.hash = fragmentPathElements[i];
                    }
                }
            }
        }

        // Use pushState if it is available so the page will not jump, otherwise a shim.
        var changeHash = function (hash) {
            if (history && history.pushState) {
                history.pushState(null, null, window.location.pathname + window.location.search + '#' + hash);
            } else {
                var scrollVertical = document.body.scrollTop;
                var scrollHorizontal = document.body.scrollLeft;
                window.location.hash = hash;
                document.body.scrollTop = scrollVertical;
                document.body.scrollLeft = scrollHorizontal;
            }
        };

        var backToTop = function () {
            window.scrollTo(0, 0);
        };

        // Set the correct tab when the page loads
        showTabFromHash();

        // Set the correct tab when a user uses their back/forward button
        $(window).on('hashchange', showTabFromHash);

        // Change the URL when tabs are clicked
        $('a', context).on('click', function (e) {
            var hash = this.href.split('#')[1];
            var adjustedHash = settings.getHashCallback(hash, this);
            changeHash(adjustedHash);
            setTimeout(backToTop, 1);
        });

        return this;
    };
}(jQuery));