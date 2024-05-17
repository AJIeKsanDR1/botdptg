document.addEventListener("DOMContentLoaded", function() {
    fetch('https://95edd8a4-2a2b-4765-b827-c5bd5d614e09-00-33wy3a5bcgmo.sisko.repl.co/users')  // используем правильный URL
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('tasks-container');
            data.forEach(user => {
                const username = user.username;
                const tasks = user.tasks;

                const userHeader = document.createElement('h2');
                userHeader.textContent = `Username: ${username}`;
                container.appendChild(userHeader);

                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                thead.innerHTML = `
                    <tr>
                        <th>Task ID</th>
                        <th>Description</th>
                        <th>Completed</th>
                    </tr>
                `;

                tasks.forEach(task => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${task.id}</td>
                        <td>${task.description}</td>
                        <td>${task.completed ? 'Yes' : 'No'}</td>
                    `;
                    tbody.appendChild(row);
                });

                table.appendChild(thead);
                table.appendChild(tbody);
                container.appendChild(table);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
});
