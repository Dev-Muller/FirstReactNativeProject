const path = require("path");
const { search } = require("./src/routes");

module.exports = {
  development: {
    client: "postgres",
    connection: {
      host: "::1",
      port: 5432,
      user: "postgres",
      password: "masterkey",
      database: "postgres"
    },
    searchPath: ["xt"],
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "migrations")
    },
    seeds: {
      directory: path.resolve(__dirname, "src", "database", "seeds")
    },
    useNullAsDefault: true
  }
};