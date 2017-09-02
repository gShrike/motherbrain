var {Model} = require("objection");

var Enrollment = require("./Enrollment");

class Student extends Model {
    static get tableName(){
        return "users";
    }
    static get columns(){
        return [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "github_username AS github",
            "twitter",
            "linkedin",
            "avatar",
            "galvanize_id"
        ];
    }
    static getAll(filters = {}){
        let query = this.query().select(this.columns)

        if (filters.github) {
          query = query.where("github_username", filters.github)
        }
        if (filters.email) {
          query = query.where("email", filters.email)
        }

        return query
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
    static getByCohort(id) {
        return Enrollment.byCohort(id)
            .then(studentIds => this.getSome(studentIds))
            .catch(console.error);
    }
}
Student.knex(require("../../database/learn_connection"));

module.exports = Student;
