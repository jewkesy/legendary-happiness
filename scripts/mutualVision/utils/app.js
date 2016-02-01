
var http = require('http');
var mongoose = require('mongoose');
var loremIpsum = require('lorem-ipsum');
var ss = require('simple-statistics');

function processBranchLatLons() {
  Branch.find({}, function (err, branches) {
    if (err) return console.error(err);
    if (branches == null) return console.log('empty')
      branches.forEach(function(branch, index, array) {
        //console.log(branch.LAT)
        if (!branch.LAT) {
          console.log('no lat for ' + branch.POSTCODE)
          //branch.POSTCODE = branch.POSTCODE.replace(" ", "") //run this after initial run through
          PostCode.findOne({ 'pd_post_cde': branch.POSTCODE}, function(err, item) {
            if (item == null) return
            branch.LAT = item.pd_lat_cor;
            branch.LON = item.pd_long_cor;
            branch.save();
          });
        }
        else {
          console.log('has lat')
        }
      });
  });
}

function processIntroducerLatLons() {
  Introducer.find({}, function (err, introducers) {
    if (err) return console.error(err);
    if (introducers == null) return console.log('empty')
      introducers.forEach(function(introducer, index, array) {
        //console.log(branch.LAT)
        if (!introducer.LAT && introducer.POSTCODE) {
          console.log('no lat for ' + introducer.POSTCODE)
          introducer.POSTCODE = introducer.POSTCODE.replace(" ", "") //run this after initial run through
          PostCode.findOne({ 'pd_post_cde': introducer.POSTCODE}, function(err, item) {
            if (item == null) return
            introducer.INTRO_NAME = loremIpsum({ count: 1, units: 'sentences', sentenceUpperBound: 10, random: Math.random})
            introducer.LAT = item.pd_lat_cor;
            introducer.LON = item.pd_long_cor;
            introducer.save();
          });
        }
        else {
          console.log('has lat')
        }
      });
  });
}

function processCustomerLatLons() {
  Customer.find({'LAT' : {$exists:false}}, function (err, customers) {
    if (err) return console.error(err);
    if (customers == null) return console.log('empty')
      customers.forEach(function(customer, index, array) {
        //console.log(branch.LAT)
        if (!customer.LAT && customer.POSTCODE) {
          //console.log('no lat for ' + customer.POSTCODE)
          customer.POSTCODE = customer.POSTCODE.replace(" ", "") //run this after initial run through
          //console.log(customer.POSTCODE)
          PostCode.findOne({ 'pd_post_cde': customer.POSTCODE}, function(err, item) {
            if (item == null) return
            customer.LAT = item.pd_lat_cor;
            customer.LON = item.pd_long_cor;
            customer.save();
          });
        }
        else {
          //console.log('no postcode or already has lat')
        }
      });
  });
}

function processSaverLatLons() {
  Saver.find({ 'LAT' : {$exists:false}}, function (err, savers) {
    if (err) return console.error(err);
    if (savers == null) return console.log('empty')
      savers.forEach(function(saver, index, array) {
        //console.log(saver.LAT)
        if (!saver.LAT && saver.POSTCODE) {
          //console.log('no lat for ' + saver.POSTCODE)
          saver.POSTCODE = saver.POSTCODE.replace(" ", "") //run this after initial run through

          PostCode.findOne({ 'pd_post_cde': saver.POSTCODE}, function(err, item) {
            if (item == null) return
              // console.log(saver.POSTCODE + ' = ' + item.pd_lat_cor);
            saver.LAT = item.pd_lat_cor;
            saver.LON = item.pd_long_cor;
            saver.save();
          });
        }
        // else {
        //   //console.log('no postcode or already has lat')
        // }
      });
  });
}

function processLoanLatLons() {
  Loan.find({ 'LAT' : {$exists:false}}, function (err, loans) {
    if (err) return console.error(err);
    if (loans == null) return console.log('empty')
    loans.forEach(function(loan, index, array) {
      //console.log(saver.LAT)
      if (!loan.LAT && loan.POSTCODE) {
        //console.log('no lat for ' + saver.POSTCODE)
        loan.POSTCODE = loan.POSTCODE.replace(" ", "") //run this after initial run through

        PostCode.findOne({ 'pd_post_cde': loan.POSTCODE}, function(err, item) {
          if (item == null) return
            // console.log(saver.POSTCODE + ' = ' + item.pd_lat_cor);
          loan.LAT = item.pd_lat_cor;
          loan.LON = item.pd_long_cor;
          loan.save();
        });
      }
      // else {
      //   //console.log('no postcode or already has lat')
      // }
    });
  });
}

function processBsLatLons() {
  bs.find({ 'LAT' : {$exists:false}}, function (err, bss) {
    if (err) return console.error(err);
    if (bss == null) return console.log('empty')
    bss.forEach(function(hq, index, array) {
      console.log(hq)
      if (!hq.LAT && hq.Postcode) {
        hq.Postcode = hq.Postcode.replace(" ", "") //run this after initial run through

        PostCode.findOne({ 'pd_post_cde': hq.Postcode}, function(err, item) {
          if (item == null) { console.log('no postcode data found');  return}
          console.log(hq.Postcode + ' = ' + item.pd_lat_cor);
          hq.LAT = item.pd_lat_cor;
          hq.LON = item.pd_long_cor;
          hq.save();
        });
      }
      else {
        console.log('no postcode or already has lat')
      }
    });
  });
}

function getJenks(arr, bins) {
  console.log(arr.length)
  var res = ss.jenks(arr, bins);
  console.log(res)
}

function getTranCounts() {
  var arrTranCount = [];
  Customer.find({'LAT' : {$exists:true}}, function (err, customers) {
    if (err) return console.error(err);
    if (customers == null) return console.log('empty')

    customers.forEach(function(customer, index, array) {
      arrTranCount.push(customer.TRAN_COUNT);
    });
    getJenks(arrTranCount, 6);
  });
}

function processLtv() {
  Loan.find({ 'LTV' : {$exists:false}}, function (err, loans) {
    if (err) return console.error(err);
    if (loans == null) return console.log('empty')
    loans.forEach(function(loan, index, array) {
      if (!loan.LVT) {
        var ltv = ((loan.OutstandingBalance / loan.PropertyValuation) * 100).toFixed(0)
        var drop = (40 / 100) * loan.PropertyValuation;
        var ltv_40 = ((loan.OutstandingBalance / (loan.PropertyValuation - drop)) * 100).toFixed(0);

// console.log(loan.ADDRESS_2 + ': ' + loan.OutstandingBalance + '/' + loan.PropertyValuation + '=' + ltv)
// console.log(loan.ADDRESS_2 + ': ' + loan.OutstandingBalance + '/' + (loan.PropertyValuation - drop) + '=' + ltv_40)

        loan.LTV = ltv;
        loan.LTV_40 = ltv_40;
        loan.save();
      }
    });
  });
}

var mongoPostOfficeUrl = 'mongodb://192.168.25.137/geo'
var mongoMutualVisionUrl = 'mongodb://localhost/mutualVision'

var poDb = mongoose.createConnection(mongoPostOfficeUrl);
var mvDb = mongoose.createConnection(mongoMutualVisionUrl);

var postCodeSchema = new mongoose.Schema({
	"pd_adm_cc" : String,
	"pd_adm_dc" : String,
	"pd_adm_wc" : String,
	"pd_country" : String,
	"pd_est_crd" : Number,
	"pd_lat_cor" : Number,
	"pd_lat_std" : Number,
	"pd_long_cor" : Number,
	"pd_long_std" : Number,
	"pd_nhs_ha" : String,
	"pd_nhs_reg" : String,
	"pd_nrt_crd" : Number,
	"pd_post_cde" : String,
	"pd_qual_ind" : Number
}, { collection: 'posData'});

var branchSchema = new mongoose.Schema({
  	"BRANCH_NAME" : String,
  	"BRANCH_CODE" : String,
  	"SAVER_BALANCE" : Number,
  	"LOAN_BALANCE" :Number,
  	"PIPELINE_REG" : Number,
  	"PIPELINE_OFFER" : Number,
  	"FAX" : String,
  	"TELEPHONE" : String,
  	"ADDRESS_1" : String,
  	"ADDRESS_2" : String,
  	"ADDRESS_3" : String,
  	"ADDRESS_4" : String,
  	"ADDRESS_5" : String,
  	"POSTCODE" : String,
    "LAT": Number,
    "LON": Number
}, { collection: 'branches'});

var introducerSchema = new mongoose.Schema({
  	"INTRO_NAME" : String,
  	"INTRO_CODE" : Number,
  	"LOAN_BALANCE" : Number,
  	"PIPELINE_OFFER" : Number,
  	"FAX" : String,
  	"TELEPHONE" : String,
  	"ADDRESS_1" : String,
  	"ADDRESS_2" : String,
  	"ADDRESS_3" : String,
  	"ADDRESS_4" : String,
  	"POSTCODE" : String,
    "LAT": Number,
    "LON": Number
}, { collection: 'introducers'});

var customerSchema = new mongoose.Schema({
    "CUST_ID" : Number,
    "Customer Name" : String,
    "ADDRESS_1" : String,
    "ADDRESS_2" : String,
    "ADDRESS_3" : String,
    "POSTCODE" : String,
    "SAVER_BALANCE" : Number,
    "LOAN_BALANCE" : Number,
    "AGE" : Number,
    "GENDER" : String,
    "DURATION" : Number,
    "TRAN_COUNT" : Number,
    "LAT": Number,
    "LON": Number
}, { collection: 'customers'});

var saverSchema = new mongoose.Schema({
    "CUST_ID" : Number,
    "Customer Name" : String,
    "ADDRESS_1" : String,
    "ADDRESS_2" : String,
    "ADDRESS_3" : String,
    "POSTCODE" : String,
    "SAVER_BALANCE" : Number,
    "AGE" : Number,
    "GENDER" : String,
    "DURATION" : Number,
    "LAT": Number,
    "LON": Number
}, { collection: 'savers'});

var loanSchema = new mongoose.Schema({
    "AccountName" : String,
  	"AccountNumber" : String,
  	"ADDRESS_2" : String,
  	"ADDRESS_3" : String,
  	"ADDRESS_4" : String,
  	"POSTCODE" : String,
  	"PropertyValuation" : Number,
  	"LoanDate" : Date,
  	"OutstandingBalance" : Number,
  	"Arrears" : Number,
  	"Rate" : Number,
    "LAT": Number,
    "LON": Number,
    "LTV": Number,
    "LTV_40": Number
}, { collection: 'loans'});

var bsSchema = new mongoose.Schema({
    "Society" : String,
    "Postcode" : String,
    "Total Assets 2014" : String,
    "Total Assets 2013" : String,
    "Management  Expenses 2014" : Number,
    "Management  Expenses 2013" : Number,
    "Profit/Loss 2014" : Number,
    "Profit/Loss 2013" : Number,
    "LAT": Number,
    "LON": Number
}, { collection: 'bs'});

var PostCode = poDb.model('PostCode', postCodeSchema);
var Branch = mvDb.model('Branch', branchSchema);
var Introducer = mvDb.model('Introducer', introducerSchema);
var Customer = mvDb.model('Customer', customerSchema);
var Saver = mvDb.model('Saver', saverSchema);
var Loan = mvDb.model('Loan', loanSchema);
var bs = mvDb.model('bs', bsSchema);

poDb.on('error', console.error);
poDb.once('open', function() {
  console.log('connected to mongo ' + mongoPostOfficeUrl);
});

mvDb.on('error', console.error);
mvDb.once('open', function() {
  console.log('connected to mongo ' + mongoMutualVisionUrl);
});

// processBranchLatLons();
// processIntroducerLatLons();
// processCustomerLatLons();
// processSaverLatLons();
// processLoanLatLons();
// processBsLatLons();

// getTranCounts();
processLtv();
