import fs from "node:fs/promises";
import path from "node:path";

const dbPath = path.resolve("data/db.json");

async function getDb() {
  const db = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(db);
}

async function updateTodosInDb(todos) {
  const db = await getDb();
  db.todos = todos;
  await fs.writeFile(dbPath, JSON.stringify(db));
}

export async function getTodos() {
  const db = await getDb();
  return db.todos;
}

export async function addTodo(todo) {
  const todos = await getTodos();
  todo.id = todos.length + 1;
  todos.push(todo);
  await updateTodosInDb(todos);
}

export async function updateTodo(id, todo) {
  const todos = await getTodos();
  const index = todos.findIndex((t) => t.id === id);
  if (index !== -1) {
    todos[index] = todo;
    await updateTodosInDb(todos);
    return todo;
  }
  return null;
}

export async function deleteTodoById(id) {
  const todos = await getTodos();
  const index = todos.findIndex((t) => t.id === id);
  if (index !== -1) {
    const todo = todos[index];
    todos.splice(index, 1);
    await updateTodosInDb(todos);
    return todo;
  }
  return null;
}
