const translations = {
    en: {
        title: "Tasks by User",
        username: "Username",
        taskID: "Task ID",
        description: "Description",
        completed: "Completed",
        yes: "Yes",
        no: "No"
    },
    ru: {
        title: "Задачи по пользователю",
        username: "Имя пользователя",
        taskID: "ID задачи",
        description: "Описание",
        completed: "Завершено",
        yes: "Да",
        no: "Нет"
    }
};

let currentLanguage = 'en';

document.addEventListener("DOMContentLoaded", function() {
    setLanguage(currentLanguage);
    fetchTasks();
});

function setLanguage(language) {
    currentLanguage = language;
    document.querySelector('h1').textContent = translations[language].title;
    fetchTasks();
}

function fetchTasks() {
    fetch('https://95edd8a4-2a2b-4765-b827-c5bd5d614e09-00-33wy3a5bcgmo.sisko.repl.co/users')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('tasks-container');
            container.innerHTML = '';  // Очистить контейнер перед обновлением

            data.forEach(user => {
                const username = user.username;
                const tasks = user.tasks;

                const userHeader = document.createElement('h2');
                userHeader.textContent = `${translations[currentLanguage].username}: ${username}`;
                container.appendChild(userHeader);

                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                thead.innerHTML = `
                    <tr>
                        <th>${translations[currentLanguage].taskID}</th>
                        <th>${translations[currentLanguage].description}</th>
                        <th>${translations[currentLanguage].completed}</th>
                    </tr>
                `;

                tasks.forEach(task => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${task.id}</td>
                        <td>${task.description}</td>
                        <td>${task.completed ? translations[currentLanguage].yes : translations[currentLanguage].no}</td>
                    `;
                    tbody.appendChild(row);
                });

                table.appendChild(thead);
                table.appendChild(tbody);
                container.appendChild(table);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}
