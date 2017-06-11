var {Model} = require("objection");

class LearnCohort extends Model {
    static get tableName(){
        return "cohorts";
    }
    static get columns(){
        return ["id", "name", "start_date", "end_date"];
    }
    static getOne(id){
        return this.query()
            .select(this.columns)
            .where("id", id)
            .first();
    }
    static getSome(ids){
        return this.query()
            .select(this.columns)
            .whereIn("id", ids);
    }
    static getAll(){
        return this.query().select(this.columns);
    }
}
LearnCohort.knex(require("../../database/learn_connection"));

module.exports = LearnCohort;
