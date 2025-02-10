const knex = require("../database/connection");

class GroupsController {
  async index(request, response) {
    const groups = await knex("item").select("group").groupBy("group").orderBy("group");

    const formattedGroups = groups.map(item => item.group);
    
    return response.json(formattedGroups);
  }
}

module.exports = GroupsController;