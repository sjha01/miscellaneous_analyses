http://bl.ocks.org/jfreels/6816504
https://www.d3-graph-gallery.com/graph/connectedscatter_select.html

local server instructions (see https://stackoverflow.com/questions/10752055/cross-origin-requests-are-only-supported-for-http-error-when-loading-a-local)

1. open anaconda command prompt
2. cd to directory with index.html
3. type "python -m http.server"
Will get mesage "Serving HTTP on 0.0.0.0 port 8000. ...
Now, http://localhost.8000 is your root directory. So can e.g., load index.html at the following url.
4. In browser, go to http://localhost:8000/index.html


Remove cache of page in Chrome (or at least, local server page, don't know if it works with other pages):
    Ctrl-shift-R







http://bl.ocks.org/rpgove/10603627