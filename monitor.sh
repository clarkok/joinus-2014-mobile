#!/bin/sh
jade index.jade
stylus style.styl
while true
  do inotifywait -e modify -q -r .
  jade index.jade
  stylus style.styl
  stylus style-old.styl
  stylus style-pad.styl
done

