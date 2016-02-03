#!/bin/bash

IMPORT_PATH=/Users/Daryl/Desktop/processed/*.json

for i in $IMPORT_PATH; do

    mongoimport --db niteworks --collection tweets --file $i --jsonArray

done

