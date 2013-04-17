jscene
======

JavaScript tutorial tool based on CodeMirror. Y'know, for kids!

Overview
--------

This app is a 100% JavaScript/HTML5 app that illustrates simple coding concepts
like functions, variables and loops by guiding the user through drawing a simple
scene in code.

It starts off with the user calling pre-made functions and gradually eases them
into uses Canvas directly.

It isn't a full-on tutorial, it's designed to give people a taster of coding.

More advanced users might be able to figure out how it's all done, and might even
unlock the secret code!

Demo
----

See [the Github Page](http://boxuk.github.io/jscene/) for a full demo!

Usage
-----

It's simply HTML. Put it anywhere on a web server and it should all just work
when you browse to it.

Modules/exercises
-----------------

At the time of writing, the modules are all built-in. We are considering making the exercises modular.

Documentation
-------------

See the literate documentation generated by [Docco](http://jashkenas.github.io/docco/) for a full walkthrough of the source code showing you just how everything works!

* [Literate documentation for docs/jscene.html](http://boxuk.github.io/jscene/docs/jscene.html)
* [Literate documentation for docs/jscene-iframe.html](http://boxuk.github.io/jscene/docs/jscene-iframe.html)

Updating documentation
----------------------

With [Docco](http://jashkenas.github.io/docco/) installed:

    docco js/**/*js

Libraries used
--------------

 * [Twitter Bootstrap](http://twitter.github.com/bootstrap/) - used for layout and to provide things like modal dialogs
 * [CodeMirror](http://codemirror.net/) for code editing
 * [jQuery](http://jquery.com/) for interactivity

Browser support
---------------

Tested primarily in Chrome and IE9 and IE10.

Will not work in IE8 or below as it uses Canvas.
