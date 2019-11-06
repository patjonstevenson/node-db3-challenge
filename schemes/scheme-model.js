const db = require("../data/dbConfig");

const model = {
    find: () => db.select('*').from('schemes'),

    findById: id => db.select('*').from('schemes').where({ id: id }),

    findSteps: id => db.select('step_number', 'scheme_name', 'instructions').where({ id: id }).orderBy('step_number'),

    add: scheme => {
        const newId = db.insert(scheme, 'id').into('schemes');
        return this.findById(newId);
    },

    update: (changes, id) => {
        const count = db.where({ id: id }).update(changes).into('schemes');
        if (!count) { return null };
        return this.findById(id);
    },

    remove: id => {
        const scheme = this.findById(id);
        if (!scheme) { return null };
        db('schemes').where({ id: id }).del();
        return scheme;
    }
};

module.exports = model;