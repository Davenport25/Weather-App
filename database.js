

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./weather.db"
    },
    useNullAsDefault: true
});

// Create tables 
knex.schema.hasTable('users').then(exists => {
    if (!exists) {
        return knex.schema.createTable('users', table => {
            table.increments('id').primary();
            table.string('username').unique();
            table.string('email').unique();
            table.string('password');
        });
    }
});

knex.schema.hasTable('search_history').then(exists => {
    if (!exists) {
        return knex.schema.createTable('search_history', table => {
            table.increments('id').primary();
            table.integer('userId').references('id').inTable('users');
            table.string('city');
            table.timestamp('searchDate').defaultTo(knex.fn.now());
        });
    }
});

module.exports = knex;
