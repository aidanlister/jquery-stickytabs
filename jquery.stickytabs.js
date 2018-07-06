/**
 * jQuery Plugin: Sticky Tabs
 *
 * @author Aidan Lister <aidan@php.net>
 * @version 1.2.0
 */
(function ( $ ) {
    $.fn.stickyTabs = function( options ) {

        let context  = this;
        let settings = $.extend({
            getHashCallback: (hash, btn) => hash,
            selectorAttribute: "href",
            backToTop: false,
            initialTab: $('li.active > a', context)
    }, options );

        // Merge keys and values to object
        let keysValuesToObject = function (keys, values) {
            values = values || keys.map(function (v) { return true; });
            let some;
            keys.map(function (v) { return [v, this.shift()] }, values)
                .map(function (v) { this[v[0]] = v[1]; }, some = {});
            return some;
        };

        // Transpose keys and values on given object
        let transposeObject = (object) => {
            let keys   = Object.keys(object);
            let values = Object.values(object);
            return keysValuesToObject(values, keys);
        };

        // Get back from our custom route name to selector
        let resolveSelector = (hash) => {
            let realSelector;
            hash = hash.split('#')[1];

            // if there is route object given, get route name, else take hash as route name
            realSelector = (settings.routeObject ? transposeObject(settings.routeObject)[hash] : hash);
            return realSelector ? `a[${settings.selectorAttribute}='#${realSelector}']` : settings.initialTab;
        };

        // Show the tab corresponding with the hash in the URL, or the first tab.
        let showTabFromHash = () => {
            let hash = settings.selectorAttribute == "href" ? window.location.hash : window.location.hash.substring(1);
            if (hash !== '') {
                let selector = resolveSelector(hash);
                $(selector, context).tab('show');
                setTimeout(backToTop, 1);
            }
        };

        // We use pushState if it's available so the page won't jump, otherwise a shim.
        let changeHash = (hash) => {
            if (history && history.pushState) {
                history.pushState(null, null, window.location.pathname + window.location.search + '#' + hash);
            } else {
                scrollV = document.body.scrollTop;
                scrollH = document.body.scrollLeft;
                window.location.hash = hash;
                document.body.scrollTop = scrollV;
                document.body.scrollLeft = scrollH;
            }
        };

        let backToTop = () => {
            if (settings.backToTop === true) {
                window.scrollTo(0, 0);
            }
        };

        // Set the correct tab when the page loads
        showTabFromHash();

        // Set the correct tab when a user uses their back/forward button
        $(window).on('hashchange', showTabFromHash);

        // Change the URL when tabs are clicked
        $('a', context).on('click', function(e) {
            let hash = this.href.split('#')[1];

            if (settings.routeObject) {
                hash = settings.routeObject[hash];
            }

            if (typeof hash != 'undefined' && hash != '') {
                let adjustedhash = settings.getHashCallback(hash, this);
                changeHash(adjustedhash);
                setTimeout(backToTop, 1);
            }
        });

        return this;
    };
}( jQuery ));