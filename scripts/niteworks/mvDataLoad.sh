#!/bin/sh

root=$(cd `dirname $0`/../..; echo $PWD)

exec "${root}/scripts/rubydo" ruby ${root}/scripts/niteworks/mvDataLoad.rb -v -s localhost -m localhost -c 100
