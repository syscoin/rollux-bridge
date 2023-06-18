db.auth("admin", "admin");

db.createUser({
  user: "admin",
  pwd: "admin",
  roles: [{ role: "readWrite", db: "syscoin-bridge" }],
});
