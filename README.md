# Mutual Vision Conduce Demonstrator

/opt/mct/sluice/bin/sluice-run -w -D  ~/Documents/conduce/treatments/mutualvision

## Data
All Mutual Vision data was supplied via CSV from the Vernon Building Society.  All names and address details are scrambled.  

### MongoDB 3.0
MongoDB 3.0 can use the *Wired Tiger* storage engine for faster data retrieval.  If you normally start MongoDB on demand, you can take advantage of the performance gains using the following: -
```
$ mongod --storageEngine wiredTiger --dbpath /data/tiger/
```
Obviously you will need the data stored within the correct storage engine data path...
```
$ mongorestore ~/Documents/conduce/treatments/mutualVision/share/mutualVision/data/mutualVision.dmp/ --drop
```

### Fresh data rebuild 
If you need to rebuild the data from scratch - for example a new set is provided, you will need to the perform the following import commands, assuming that you are running from the root of the treatment folder: -
```
$ mongoimport -h localhost -d mutualVision -c branches --type csv --file share/mutualVision/data/BRANCH.csv --headerline --ignoreBlanks --drop
$ mongoimport -h localhost -d mutualVision -c introducers --type csv --file share/mutualVision/data/INTRODUCER.csv --headerline --ignoreBlanks --drop
$ mongoimport -h localhost -d mutualVision -c customers --type csv --file share/mutualVision/data/CUSTOMERS.csv --headerline --ignoreBlanks --drop
$ mongoimport -h localhost -d mutualVision -c savers --type csv --file share/mutualVision/data/SAVERS.csv --headerline --ignoreBlanks --drop
$ mongoimport -h localhost -d mutualVision -c loans --type csv --file share/mutualVision/data/LOANS.csv --headerline --ignoreBlanks --drop
```
The data requires the latitude and longitude data to be created.  This is calculated using a Post Office dataset. Using *NodeJS*, familiaise yourself with the following NodeJS script to rebuild all the necessary location data: -
```
$ nano scripts/mutualVision/utils/apps.js
```

Once complete, apply the following indexes to the MongoDb data via the mongo client tool: -
```
$ mongo mutualVision
> db.branches.createIndex({ "LAT" : 1 }, {sparse: true})
> db.customers.createIndex({ "LAT" : 1 }, {sparse: true})
> db.loans.createIndex({ "LAT" : 1 }, {sparse: true})
> db.introducers.createIndex({ "LAT" : 1 }, {sparse: true})
> db.savers.createIndex({ "LAT" : 1 }, {sparse: true})
```
When you have confirmed that the data is correct and operational, export it so that a copy is retaining in source control
```
$ mongodump -h localhost -d mutualVision --out  ~/Documents/conduce/treatments/mutualVision/share/mutualVision/data/mutualVision.dmp
```

## Deployment
The following describes how to get an offline staging environment up and running.  This assumes that you have a fully working instance on your local development machine and the development branch is up to date.

### Sync your treatment to an offline staging server
On staging, back up any existing treatment that may be there: -
```
$ mv /opt/lsc/treatments/mutualVision/ /opt/lsc/treatments/mutualVision_bak
```
On your development machine: -
```
$ scp -r ~/Documents/conduce/treatments/mutualvision/ demo@192.168.20.2:/opt/lsc/treatments/mutualVision
```

### Sync your tiles to an offline staging server
On your development machine: -
```
$ rsync -avzh ~/tmp/cache/ demo@192.168.20.2:/home/demo/tmp/cache
```

## Configure Treatment to Load
On the staging server, modify the service configuration file: -
```
$ sudo nano /etc/sluice/sluice.cfg
```
Set the location of the treatment to load. If using wands, make sure the Mezzanine host is configured 
```
TREATMENT=/opt/lsc/treatments/mutualVision
MEZZANINE_HOST=192.168.20.73
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