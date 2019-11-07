const db = require("../data/dbConfig");

const model = {
    find: () => db.select('*').from('schemes'),

    findById: id => {
        const scheme = db.select('*').from('schemes').where({ id });
        // should I be using try/catch here instead of if?
        if (!scheme) { return null };
        return scheme;
    },

    findSteps: schemeId => {
        const steps = db('steps')
            .join('schemes', 'steps.scheme_id', '=', 'schemes.id')
            .select('steps.step_number', 'schemes.scheme_name', 'steps.instructions')
            .where({ scheme_id: schemeId })
            .orderBy('steps.step_number');
        console.log(typeof steps);
        return steps;
    },

    add: scheme => {
        const newId = db.insert(scheme, 'id').into('schemes');
        return this.findById(newId);
    },

    update: (changes, id) => {
        const count = db.where({ id }).update(changes).into('schemes');
        if (!count) { return null };
        return this.findById(id);
    },

    remove: id => {
        const scheme = this.findById(id);
        if (!scheme) { return null };
        const schemesCount = db('schemes').where({ id }).del();
        const stepsCount = db('steps').where({ scheme_id: id }).del();
        return scheme;
    },

    addStep: (step, scheme_id) => {
        const newStep = {
            ...step,
            scheme_id
        };
        const newStepId = db.insert(newStep, 'id').into('steps');
        const addedStep = db('steps').select('*').where({ id: newStepId });
        return newStepId;
    }

};

module.exports = model;