var {Model} = require("objection");
var Cohort = require("./LocalCohort");
var LearnCohort = require("./LearnCohort");
var Instructor = require("./Instructor");
var flattenProperty = require("../utils/flatten-property");

class BusinessUnit extends Model {
    static get tableName(){
        return "business_unit";
    }
    static get columns(){
        return ["id", "label", "city", "state"];
    }
    static getOne(id){
        return this.getAll().where("id", id);
    }
    static getAll(){
        return this.query().select(this.columns);
    }
    static getOneWithRelations(id){
        return this.addRelations(this.getOne(id)).then(cohorts => cohorts[0]);
    }
    static getAllWithRelations(){
        return this.addRelations(this.getAll());
    }
    static addRelations(query){
        return query.eager(
            "[cohorts.[learnCohort(learnCohortColumns)], instructors(instructorColumns)]",
            {
                learnCohortColumns: builder => builder.select(LearnCohort.columns),
                instructorColumns: builder => builder.select(Instructor.columns)
            }
        ).then(businessUnits => {
            return businessUnits.map(businessUnit => {
                businessUnit.cohorts = businessUnit.cohorts
                    .map(flattenProperty.bind(null, "learnCohort"))
                    .map(require("./deserializers/learn-cohort"));
                businessUnit.instructors = businessUnit.instructors
                    .map(require("./deserializers/instructor"));
                return businessUnit;
            });
        });
    }
    static get relationMappings(){
        return {
            cohorts: {
                relation: Model.HasManyRelation,
                modelClass: Cohort,
                join: {
                    from: "business_unit.id",
                    to: "cohort.business_unit_id"
                }
            },
            instructors: {
                relation: Model.HasManyRelation,
                modelClass: Instructor,
                join: {
                    from: "instructor.business_unit_id",
                    to: "business_unit.id"
                }
            }
        }
    }
}
BusinessUnit.knex(require("../../database/connection"));

module.exports = BusinessUnit;
