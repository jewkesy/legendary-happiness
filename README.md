# NiteWorks Conduce Demonstrator

### MongoDB 3.0
MongoDB 3.0 can use the *Wired Tiger* storage engine for faster data retrieval.  If you normally start MongoDB on demand, you can take advantage of the performance gains using the following: -
```
$ mongod --storageEngine wiredTiger --dbpath /data/tiger/
```

Check your indexes
```
> db.tweets.createIndex({ "twitter.coordinates.coordinates":1  }, {  sparse: true })
```


## Launch Sluice
```
rm -rf .sluice/var/logs/*; /opt/mct/sluice/bin/sluice-run -w -D  ~/Documents/conduce/treatments/niteworks/
```

## LaunchPad
Ues a web-based applicaiton to run through the demonstrator.  Navigate to the [LaunchPad] which is hosted as part of the Treatment

 - http://localhost:7787/launchpad/

## Administration Panel
Sluice has a web-based control/administration panel.  Navigate to [sluice] which is hosted by the treatment loaded

 - http://localhost:7787/sluice

[LaunchPad]:http://localhost:7787/launchpad/
[sluice]:http://localhost:7787/sluice

