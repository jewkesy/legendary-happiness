# NiteWorks Conduce Demonstrator

rm -rf .sluice/var/logs/*; /opt/mct/sluice/bin/sluice-run -w -D  ~/Documents/conduce/treatments/niteworks/

### MongoDB 3.0
MongoDB 3.0 can use the *Wired Tiger* storage engine for faster data retrieval.  If you normally start MongoDB on demand, you can take advantage of the performance gains using the following: -
```
$ mongod --storageEngine wiredTiger --dbpath /data/tiger/
```
Obviously you will need the data stored within the correct storage engine data path...
```
$ mongorestore ~/Documents/conduce/treatments/mutualVision/share/mutualVision/data/mutualVision.dmp/ --drop
```

## Launch Sluice
Start the sluiced service using the following command: -
```
$ sudo service sluiced start
```
The service supports 
 - start
 - restart 
 - stop

## Wands
Upon a server restart you may need to start the wands script.  This script monitors the Mezzanine wands pool and injects the proteins into the sluice *wands* pool 
```
$ sudo start-wands
```

## LaunchPad
Mutual Vision uses a web-based applicaiton to run through the demonstrator.  Navigate to the [LaunchPad] which is hosted as part of the Mutual Vision Treatment

 - http://localhost:7787/launchpad/

## Administration Panel
Sluice has a web-based control/administration panel.  Navigate to [sluice] which is hosted by the treatment loaded

 - http://localhost:7787/sluice

[LaunchPad]:http://localhost:7787/launchpad/
[sluice]:http://localhost:7787/sluice