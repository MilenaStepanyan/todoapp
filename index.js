import http from "node:http";
import url from "node:url";
import { STATUS_CODES } from "./lib/index.js";
import { getTodos, addTodo, updateTodo, deleteTodoById } from './data/todos.js';
import { getUsers, addUser, updateUser, deleteUserById } from './data/users.js'; // Import User functions

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const method = req.method;
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname.startsWith("/todos")) {
    if (method === "GET") {
      try {
        const todos = await getTodos();
        res.writeHead(STATUS_CODES.OK, {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(JSON.stringify({ data: todos })),
        });
        res.end(JSON.stringify({ data: todos }));
      } catch (error) {
        console.error("Error fetching todos:", error);
        res.writeHead(STATUS_CODES.INTERNAL_SERVER_ERROR, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ error: { message: "Internal Server Error" } }));
      }
    } else if (method === "DELETE") {
      const todoId = parsedUrl.query.id;
      try {
        const result = await deleteTodoById(todoId);
        res.writeHead(result ? STATUS_CODES.OK : STATUS_CODES.NOT_FOUND, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify(result ? { data: result } : { error: { message: "Todo not found" } })
        );
      } catch (error) {
        console.error("Error deleting todo:", error);
        res.writeHead(STATUS_CODES.INTERNAL_SERVER_ERROR, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ error: { message: "Internal Server Error" } }));
      }
    } else if (method === "POST") {
      let body = '';
      await new Promise(resolve => req.on('data', chunk => body += chunk.toString()).on('end', resolve));
      const newTodo = JSON.parse(body);
      await addTodo(newTodo);
      res.writeHead(201, { "Content-Type": "application/json" }).end(JSON.stringify({ data: newTodo }));
    }
  } else if (parsedUrl.pathname.startsWith("/users")) {
    if (method === "GET") {
      try {
        const users = await getUsers();
        res.writeHead(STATUS_CODES.OK, {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(JSON.stringify({ data: users })),
        });
        res.end(JSON.stringify({ data: users }));
      } catch (error) {
        console.error("Error fetching users:", error);
        res.writeHead(STATUS_CODES.INTERNAL_SERVER_ERROR, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ error: { message: "Internal Server Error" } }));
      }
    } else if (method === "POST") {
      let body = '';
      await new Promise(resolve => req.on('data', chunk => body += chunk.toString()).on('end', resolve));
      const newUser = JSON.parse(body);
      await addUser(newUser);
      res.writeHead(201, { "Content-Type": "application/json" }).end(JSON.stringify({ data: newUser }));
    } else if (method === "PUT") {
      const userId = parsedUrl.query.id;
      try {
        let body = '';
        await new Promise(resolve => req.on('data', chunk => body += chunk.toString()).on('end', resolve));
        const updatedUser = JSON.parse(body);
        const result = await updateUser(userId, updatedUser);

        if (result) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ data: result }));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: { message: "User not found" } }));
        }
      } catch (error) {
        console.error("Error updating user:", error);
        res.writeHead(STATUS_CODES.INTERNAL_SERVER_ERROR, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ error: { message: "Internal Server Error" } }));
      }
    } else if (method === "DELETE") {
      const userId = parsedUrl.query.id;
      try {
        const result = await deleteUserById(userId);
        res.writeHead(result ? STATUS_CODES.OK : STATUS_CODES.NOT_FOUND, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify(result ? { data: result } : { error: { message: "User not found" } })
        );
      } catch (error) {
        console.error("Error deleting user:", error);
        res.writeHead(STATUS_CODES.INTERNAL_SERVER_ERROR, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ error: { message: "Internal Server Error" } }));
      }
    }
  } else {
    const response = {
      error: {
        message: "Not Found",
      },
      data: null,
    };
    res.writeHead(STATUS_CODES.NOT_FOUND, {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(JSON.stringify(response)),
    });
    res.end(JSON.stringify(response));
  }
});

server.on("error", (err) => {
  console.error("Server error:", err);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
