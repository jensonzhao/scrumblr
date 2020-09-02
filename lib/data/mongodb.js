var conf = require('../../config.js').database;

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


var db = function(callback)
{
	this.rooms = false;
	this.connected = false;
	var t = this;


	const url = conf.uri;

	// Open the connection to the server
	MongoClient.connect(url,{ native_parser: true, useNewUrlParser: true },function(err, client) {
		assert.equal(null, err);
		console.log("Connected successfully to server mongodb");
		const db2 = client.db(conf.database);
		db2.collection('rooms', function(err, collection) {
			// make sure we have an index on name
			collection.createIndexes([['name',1]],false,function() {});
			t.rooms = collection;
			t.connected = true;
			callback();
		});	
	});
}

var DEFAULT_BOARD_WIDTH = 1600;
var DEFAULT_BOARD_HEIGHT = 600;
var DEFAULT_THEME = 'bigcards';
var DEFAULT_FONT = 'Roboto';


db.prototype = {
	clearRoom: function(room, callback)
	{
		this.rooms.deleteOne({name:room},callback);
	},

	// theme commands
	setTheme: function(room, theme)
	{
		theme |= DEFAULT_THEME;
		this.rooms.updateOne(
			{name:room},
			{$set:{theme:theme}},
			{upsert:true}
		);
	},

	getTheme: function(room, callback)
	{
		this.rooms.findOne(
			{name:room},
			{theme:true},
			function(err, room_obj) {
				if(room_obj) {
					callback(room_obj.theme || DEFAULT_THEME);
				} else {
					callback(DEFAULT_THEME);
				}
			}
		);
	},
	setFont: function(room, font)
	{
		this.rooms.updateOne(
			{name:room},
			{$set:{font:font}},
			{upsert:true}
		);
	},

	getFont: function(room, callback)
	{
		this.rooms.findOne(
			{name:room},
			{font:true},
			function(err, room_obj) {
				if(room_obj) {
					callback(room_obj.font);
				} else {
					callback({family: DEFAULT_FONT,size: '12'});
				}
			}
		);
	},

	setPassword: function(room, password)
	{
		
		this.rooms.updateOne(
			{name:room},
			{$set:{password:password}},
			{upsert:true}
		);
	},

	getPassword: function(room, callback)
	{
		this.rooms.findOne(
			{name:room},
			{password:true},
			function(err, room_obj) {
				if(room_obj) {
					callback(room_obj.password);
				} else {
					callback(null);
				}
			}
		);
	},

	clearPassword: function(room, callback)
	{
		
		this.rooms.updateOne(
			{name:room},
			{$set:{password:null}},
			{upsert:true}
		);
		if (typeof callback != "undefined" && callback !== null) callback();
	},
	
	// revision commands
	setRevisions: function(room, revisions) {
		this.rooms.updateOne(
			{name:room},
			{$set:{revisions:revisions}}
		);
	},

	getRevisions: function(room, callback) {
		this.rooms.findOne(
			{name:room},
			{revisions:true},
			function(err, room_obj) {
				if(room_obj && room_obj.revisions) {
					callback(room_obj.revisions);
				} else {
					callback(null);
				}
			}
		);

	},

	// Column commands
	createColumn: function(room, name, callback)
	{
		this.rooms.updateOne(
			{name:room},
			{$push:{columns:name}},
			{upsert:true}
			,callback
		);
	},

	getAllColumns: function(room, callback)
	{
	    this.rooms.findOne({name:room},{columns:true},function(err, room) {
		if(room) {
		    callback(room.columns);
		} else {
		    callback();
    		}
	    });	
	},

	deleteColumn: function(room)
	{
		this.rooms.updateOne(
			{name:room},
			{$pop:{columns:1}}
		);
	},

	setColumns: function(room, columns)
	{
		this.rooms.updateOne(
			{name:room},
			{$set:{columns:columns}},
			{upsert:true}
		);
	},

	// Card commands
	createCard: function(room, id, card)
	{
		var doc = {};
		doc['cards.'+id] = card;
		this.rooms.updateOne(
			{name:room},
			{$set:doc},
			{upsert:true}
		);
	},

	getAllCards: function(room, callback)
	{
		this.rooms.findOne({name:room},{cards:true},function(err, room_obj) {
		    if(room_obj) {
                            var cards = [];
                            for (var card_id in room_obj.cards) {
                                cards.push(room_obj.cards[card_id]);
                            }
			callback(cards);
		    } else {

			callback([]);
		    }
		});
	},

	cardEdit: function(room, id, text)
	{
		var doc = {};
		doc['cards.'+id+'.text'] = text;
		this.rooms.updateOne(
			{name:room},
			{$set:doc}
		);
	},

	cardSetXY: function(room, id, x, y)
	{
		var doc = {};
		doc['cards.'+id+'.x'] = x;
		doc['cards.'+id+'.y'] = y;
		this.rooms.updateOne(
			{name:room},
			{$set:doc}
		);
	},

	deleteCard: function(room, id)
	{
		var doc = {};
		doc['cards.'+id] = true;
		this.rooms.updateOne(
			{name:room},
			{$unset:doc}
		);
	},

	addSticker: function(room, cardId, stickerId)
	{
		var doc = {};
		doc['cards.'+cardId+'.sticker'] = stickerId;
		this.rooms.updateOne(
			{name:room},
			{$set:doc}
		);
	},
	getBoardSize: function(room, callback) {
		this.rooms.findOne(
			{name:room},
			function(err, room_obj) {
		        	if(room_obj && room_obj.size) {
			    	    callback(room_obj.size);
				} else {
				    callback({
                                            width: DEFAULT_BOARD_WIDTH,
                                            height: DEFAULT_BOARD_HEIGHT,
                                        });
				}
			}
		);		
	},
	setBoardSize: function(room, size) {
		this.rooms.updateOne(
			{name:room},
			{$set:{'size':size}}
		);
	}
};
exports.db = db;
