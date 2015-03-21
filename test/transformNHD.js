'use strict';

var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var transformNHD = require('../lib/transformNHD');
var readSql = require('../util/readSql');
var Q = require('../util/query');

var createNHDFlowline = path.join(__dirname, './fixtures/createNHDFlowline.sql');
var dropSchema = path.join(__dirname, './fixtures/dropSchema.sql');

var dbOpts = {
  dbname: 'test',
  user: 'postgres',
  password: 'password',
  host: 'localhost',
  port: '5432'
};

var query = new Q(dbOpts);

describe('transformNHD', function() {
  beforeEach(function(done) {
    readSql(createNHDFlowline, function(err, sql) {
      if (err) {
        return done(err);
      }

      query.exec(sql, function(er) {
        if (er) {
          return done(er);
        }

        return done();
      });
    });
  });

  afterEach(function(done) {
    readSql(dropSchema, function(err, sql) {
      if (err) {
        return done(err);
      }

      query.exec(sql, function(er) {
        if (er) {
          return done(er);
        }

        return done();
      });
    });
  });

  it('should successfully transform nhdflowline to flowlines table', function(done) {
    transformNHD(dbOpts, function(err, res) {
      if (err) {
        return done(err);
      }

      query.exec('SELECT COUNT(*) FROM flowlines;', function(error, count) {
        expect(count).to.be.an('array');
        expect(count[0].count).to.equal('5');
        done(error);
      });
    });
  });

  it('should successfully clean nhdflowline table', function(done) {
    transformNHD(dbOpts, function(err, res) {
      if (err) {
        return done(err);
      }

      query.exec('SELECT * FROM nhdflowline;', function(error) {
        expect(error).to.be.instanceof(Error);
        done();
      });
    });
  });
});
