const translations = {
    en: {
        title: "Tasks by User",
        username: "Username",
        taskID: "Task ID",
        description: "Description",
        completed: "Completed",
        yes: "Yes",
        no: "No",
        enterAdminToken: "Enter admin token",
        login: "Login",
        invalidToken: "Invalid token",
        noTasksFound: "No tasks found.",
    },
    ru: {
        title: "Задачи по пользователю",
        username: "Имя пользователя",
        taskID: "ID задачи",
        description: "Описание",
        completed: "Завершено",
        yes: "Да",
        no: "Нет",
        enterAdminToken: "Введите токен администратора",
        login: "Войти",
        invalidToken: "Неверный токен",
        noTasksFound: "Задачи не найдены.",
    }
};

let currentLanguage = 'en';
let adminToken = '';

document.addEventListener("DOMContentLoaded", function() {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
        adminToken = storedToken;
        verifyToken(adminToken);
    } else {
        updateTranslations();
    }
});

function login() {
    const token = document.getElementById('admin-token').value;
    verifyToken(token);
}

function verifyToken(token) {
    fetch('https://95edd8a4-2a2b-4765-b827-c5bd5d614e09-00-33wy3a5bcgmo.sisko.repl.co/verify_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
    })
    .then(response => response.json())
    .then(data => {
        if (data.valid) {
            adminToken = token;
            localStorage.setItem('adminToken', token);
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('language-selector').style.display = 'block';
            fetchTasks();
        } else {
            alert(translations[currentLanguage].invalidToken);
        }
    })
    .catch(error => console.error('Error verifying token:', error));
}

function setLanguage(language) {
    currentLanguage = language;
    updateTranslations();
    fetchTasks();
}

function updateTranslations() {
    document.querySelector('h1').textContent = translations[currentLanguage].title;
    document.getElementById('token-label').textContent = translations[currentLanguage].enterAdminToken;
    document.querySelector('button[onclick="login()"]').textContent = translations[currentLanguage].login;
}

function fetchTasks() {
    fetch('https://95edd8a4-2a2b-4765-b827-c5bd5d614e09-00-33wy3a5bcgmo.sisko.repl.co/users', {
        headers: {
            'Authorization': `Bearer ${adminToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('tasks-container');
        container.innerHTML = '';

        if (data.length === 0) {
            container.textContent = translations[currentLanguage].noTasksFound;
            return;
        }

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
