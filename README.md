jquery-stickytabs
=================

Provides pushState (back and forward button support) to Bootstrap tabs


Usage
=====

Run this in document ready or some equivalent initializer on your page:

    $('.nav-tabs').stickyTabs();

Where `nav-tabs` is the default class for the bootstrap tabs feature.

Override the default `href` attribute used as selector when you need to activate multiple TabPanels at once with a single Tab using the `data-target` attribute.

    var options = { selectorAttribute: "data-target" };
    $('.nav-tabs').stickyTabs( options );