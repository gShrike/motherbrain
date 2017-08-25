var {Model,QueryBuilder} = require("objection");

class PerformanceQueryBuilder extends QueryBuilder {
  filtered(filters) {
    for (var filter in filters) {
      if (Performance.columns.includes(filter)) {
        this.where(filter, filters[filter])
      }
    }

    return this
  }
}

class Performance extends Model {
    static get QueryBuilder() {
        return PerformanceQueryBuilder;
    }
    static get tableName(){
        return "performances";
    }
    static get columns(){
        return [
            "id",
            "user_id",
            "standard_id",
            "score",
            "updator_id"
        ];
    }
    static getAll(){
        return this.query()
            .select(this.columns)
    }
    static getOne(id){
        return this.query()
            .select(this.columns)
            .where("id", id)
            .first();
    }
    static getByStandard(standard_id, filters){
        var query = this.query().filtered(filters)

        query = query
            .select(this.columns)
            .where("standard_id", standard_id)
            .orderBy("created_at", "desc");

        if (filters.snapshot) {
          // SNAPSHOTS:
          // all      --  Performances over time (default)
          // current  --  Their current performance

          // return only the current performance for each student_id
          if (filters.snapshot === 'current') {
            return query.then(performances => {
              var studentIds = []
              return performances.filter(perf => {
                if (studentIds.indexOf(perf.user_id) === -1) {
                  studentIds.push(perf.user_id)
                  return true
                }

                return false
              })
            })
          }
        }

        return query
    }
}
Performance.knex(require("../../database/learn_connection"));

module.exports = Performance;
