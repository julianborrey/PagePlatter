# PagePlatter - Chrome Extension #

### What is this ###
This is a Chrome extension which can render many websites at once 
and display them in little windows. The module can save the sites 
you would like to view and the position at which the window should 
be centered. This allows for instant viewing of many pieces of 
information that may be displayed on multiple sites.

This is particularly useful if you frequently need visit the same sites 
or compare the data between multiple sites. Rather than opening each 
site every time you can click once (on the extension icon) and then 
all sites are rendered simultaneously.

### Notes ###
* This hasn't really been polished but its functional and doesn't look too bad.
* The UI should be very easy to use. In short though:
   * You can add a site to the list by visiting it normally and then 
     clicking the save page button.
   * You can save a rendering position for a particular page by scrolling 
     to it and then clicking the set position button.
   * To remove a page from the list click 'Remove Click' and 'Clear All' 
     will remove all pages and insert the default welcome page.
* To make the welcome page render you may need to change the path that is 
  set in the [code.js]() file to include your extension ID. It is a global 
  in the Platter object.
* Setting a scroll position on an iframe is close to impossible so instead 
  the frames are wrapped in a div that we use to scroll.
* This extension was tested without iframes and using Ajax to dump HTML 
  into divs before however this led to nuclear war between all the CSS on 
  different sites. iframe - although they have many policy and security 
  issues at least contain all the formating. Apparently HTML 5 has something 
  to do this well that is coming out shortly?
* Almost all pages render. The only ones which will not are the ones hosted 
  on a server which does not allow iframe rendering. Google, for example, 
  will not work.
* Screen shot to come.
* This project was really just used as a chance to learn extensions and JavaScript.

### Warning ###
* Security:
   * To make this extension work many security measures had to be 
     removed. In particular the 
     [Same Origin Policy](http://en.wikipedia.org/wiki/Same-origin_policy) 
     has been somewhat subverted. Using a Chrome extension gives greater 
     power in rendering HTML from foreign origins however this does not 
     make it safe.
   * There is overwhelming potential for [XSS](http://en.wikipedia.org/wiki/Cross-site_scripting) 
     attacks on this extension.
   * My advise is, probably don't use this extension.
