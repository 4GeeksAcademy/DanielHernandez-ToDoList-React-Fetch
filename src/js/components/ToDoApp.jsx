

import { useState, useEffect } from "react";

const TodoApp = () => {
    const [taskGroup, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const API_URL = "https://playground.4geeks.com/todo";

    // Obtener tareas
    const getTasks = async () => {
        try {
            const resp = await fetch(`${API_URL}/users/DanielH`);
            if (!resp.ok) throw new Error("Error getting tasks");
            const data = await resp.json();
            setTasks(data.todos);
        } catch (error) {
            console.error(error);
        }
    };

    // Añadir tarea
    const addTask = async () => {
        if (inputValue.trim() === "") return;

        const task = {
            label: inputValue,
            is_done: false
        };

        try {
            const resp = await fetch(`${API_URL}/todos/DanielH`, {
                method: "POST",
                body: JSON.stringify(task),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!resp.ok) throw new Error("Error adding task");

            setInputValue("");
            getTasks();
        } catch (error) {
            console.error(error);
        }
    };

    // Enter para añadir
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    };

    // Eliminar tarea
    const deleteTask = async (id) => {
        try {
            const resp = await fetch(`${API_URL}/todos/${id}`, {
                method: "DELETE"
            });

            if (!resp.ok) throw new Error("Error deleting task");

            getTasks();
        } catch (error) {
            console.error(error);
        }
    };

    // Cargar tareas
    useEffect(() => {
        getTasks();
    }, []);

    return (
        <div className="todo-container">
            <h1 className="title">To Do</h1>

            <div className="todo-box shadow">
                <input
                    type="text"
                    className="todo-input"
                    placeholder="What needs to be done?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <ul className="task-list">
                    {taskGroup.length === 0 ? (
                        <li className="empty-msg">No tasks, add some</li>
                    ) : (
                        taskGroup.map((task) => (
                            <li
                                key={task.id}
                                className="task-item d-flex justify-content-between align-items-center"
                            >
                                <span>{task.label}</span>
                                <span className="delete-btn" onClick={() => deleteTask(task.id)}>❌</span>
                            </li>
                        ))
                    )}
                </ul>

                <div className="task-count">
                    {taskGroup.length} item{taskGroup.length !== 1 ? "s" : ""} left
                </div>
            </div>
        </div>
    );
};

export default TodoApp;
