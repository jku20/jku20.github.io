#!/bin/bash
DIR=`dirname $0`
printf -v date '%(%Y-%m-%d)T' -1
cp "$DIR"/template.md "$DIR"/../_posts/"$date"-daily.md
