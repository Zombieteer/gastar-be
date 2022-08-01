const promise = require("bluebird");
const pgPromise = require("pg-promise");
const config = require("config");

const create = (databaseUrl) => {
  const initOptions = {
    promiseLib: promise,
    error(error, e) {
      console.error(e.query);
      return { ...error, DB_ERROR: true, query: e.query };
    },
  };

  const pgp = pgPromise(initOptions);

  const returnAsIs = function (val) {
    return val;
  };

  const types = pgp.pg.types;
  types.setTypeParser(1186, returnAsIs);
  types.setTypeParser(types.builtins.TIMESTAMPTZ, returnAsIs);
  types.setTypeParser(types.builtins.TIMESTAMP, returnAsIs);

  const db = pgp(databaseUrl);
  return db;
};

const getUrl = (_) => process.env.DATABASE_URL;

module.exports = create(getUrl());
