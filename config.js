let mongo = {};
if (process.env.VCAP_SERVICES) {
	mongo = JSON.parse(process.env.VCAP_SERVICES).mongodb[0].credentials;
}

exports.database = {
	type: 'mongodb',
	hostname: mongo.hostname || 'localhost',
	port: mongo.port || 27017,
	database: mongo.dbname || 'scrumblr',
	uri: mongo.uri || 'mongodb://localhost:27017'
};


var argv = require('yargs')
        .usage('Usage: $0 [--port INTEGER [8080]] [--baseurl STRING ["/"]] [--redis STRING:INT [127.0.0.1:6379]] [--gaEnabled] [--gaAccount STRING [UA-2069672-4]]')
        .argv;

exports.server = {
	port: argv.port || 8080,
	baseurl: argv.baseurl || '/',
	//force language
	//lang: 'en'
};

exports.googleanalytics = {
	enabled: argv['gaEnabled'] || false,
	account: argv['gaAccount'] || "UA-2069672-4"
};
/*
exports.database = {
	type: 'redis',
	prefix: '#scrumblr#',
	redis: argv.redis || '127.0.0.1:6379'
};*/

