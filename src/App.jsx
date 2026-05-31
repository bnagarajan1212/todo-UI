import { useState, useEffect } from "react";

const API = "https://uzrwzbb9vl.execute-api.ap-south-2.amazonaws.com";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  // Load todos when app starts
  useEffect(() => {
    fetch(`${API}/todos`)
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  // Add a new todo
  function addTodo() {
    if (!newTitle.trim()) return;
    fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((res) => res.json())
      .then((todo) => {
        setTodos([...todos, todo]);
        setNewTitle("");
      });
  }

  // Toggle complete
  function toggleTodo(id) {
    fetch(`${API}/todos/${id}/complete`, { method: "PATCH" })
      .then((res) => res.json())
      .then((updated) =>
        setTodos(todos.map((t) => (t.id === id ? updated : t)))
      );
  }

  // Delete a todo
  function deleteTodo(id) {
    fetch(`${API}/todos/${id}`, { method: "DELETE" }).then(() =>
      setTodos(todos.filter((t) => t.id !== id))
    );
  }

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>📝 Todo App</h1>

      {/* Add new todo */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          style={{ flex: 1, padding: "8px", fontSize: "1rem" }}
        />
        <button onClick={addTodo} style={{ padding: "8px 16px" }}>
          Add
        </button>
      </div>

      {/* Todo list */}
      {todos.map((todo) => (
        <div
          key={todo.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px",
            marginBottom: "8px",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
        >
          <input
            type="checkbox"
            checked={todo.isCompleted}
            onChange={() => toggleTodo(todo.id)}
          />
          <span
            style={{
              flex: 1,
              textDecoration: todo.isCompleted ? "line-through" : "none",
              color: todo.isCompleted ? "#aaa" : "#000",
            }}
          >
            {todo.title}
          </span>
          <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
        </div>
      ))}

      {todos.length === 0 && <p style={{ color: "#aaa" }}>No todos yet!</p>}
    </div>
  );
}

export default App;