/**
 * jQuery Plugin: Sticky Tabs
 *
 * @author Aidan Lister <aidan@php.net>
 * @version 1.1.2
 */
(function ( $ ) {
    $.fn.stickyTabs = function( options ) {
        var context = this;

        var settings = $.extend({
            getHashCallback: function(hash, btn) { return hash },
            defaultHash: '',
        }, options );

        // Show the tab corresponding with the hash in the URL, or the first tab.
        var showTabFromHash = function() {
          var hash = window.location.hash;
          var selector = hash ? 'a[href="' + hash + '"]' : getFallbackHash();
          $(selector, context).tab('show');
        }

        var getFallbackHash = function() {

            if(settings.defaultHash != '')
            {
                return 'a[href="#' + settings.defaultHash + '"]';
            }

            return 'li.active > a';
        }

        settings.defaultHash = $("li.active > a", context).prop("href").split('#')[1];

        // Set the correct tab when the page loads
        showTabFromHash(context);

        // Set the correct tab when a user uses their back/forward button
        $(window).on('hashchange', showTabFromHash);

        // Change the URL when tabs are clicked using
        //   window.location.hash which sets the state without needing pushState.
        $('a', context).on('click', function(e) {
          var hash = this.href.split('#')[1];
          window.location.hash = settings.getHashCallback(hash, this)
        });

        return this;
    };
}( jQuery ));
