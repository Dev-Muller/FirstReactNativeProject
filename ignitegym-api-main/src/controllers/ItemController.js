const knex = require("../database/connection");

class ItemController {
  async index(request, response) {
    const { group } = request.params;

    const item = await knex("item").where({ group }).orderBy("name");

    return response.json(item);
  }

  async show(request, response) {
    const { id } = request.params;

    const item = await knex("item").where({ id }).first();

    return response.json(item);
  }

  async create(request, response) {
    const { name, group, series, repeticoes } = request.body;

    await knex("item").insert({ name, group, series, repeticoes });

    return response.status(201).send();
  }
}

module.exports = ItemController;