import fs from "node:fs/promises";
import path from "node:path";

const dbPath = path.resolve("data/db.json");

async function getDb() {
  const db = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(db);
}

async function updateUsersInDb(users) {
  const db = await getDb();
  db.users = users;
  await fs.writeFile(dbPath, JSON.stringify(db));
}

export async function getUsers() {
  const db = await getDb();
  return db.users;
}

export async function addUser(user) {
  const users = await getUsers();
  user.id = users.length + 1;
  users.push(user);
  await updateUsersInDb(users);
}

export async function updateUser(id, user) {
  const users = await getUsers();
  const index = users.findIndex((t) => t.id === id);
  if (index !== -1) {
    users[index] = user;
    await updateUsersInDb(users);
    return user;
  }
  return null;
}

export async function deleteUserById(id) {
  const users = await getUsers();
  const index = users.findIndex((t) => t.id === id);
  if (index !== -1) {
    const user = users[index];
    users.splice(index, 1);
    await updateUsersInDb(users);
    return user;
  }
  return null;
}
