const translations = {
    en: {
        title: "Tasks by User",
        username: "Username",
        taskID: "Task ID",
        description: "Description",
        completed: "Completed",
        yes: "Yes",
        no: "No",
        enterAdminToken: "Enter admin username and password",
        login: "Login",
        invalidToken: "Invalid username or password",
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
        enterAdminToken: "Введите имя пользователя и пароль администратора",
        login: "Войти",
        invalidToken: "Неверное имя пользователя или пароль",
        noTasksFound: "Задачи не найдены.",
    }
};

let currentLanguage = 'en';
let adminUsername = '';
let adminPassword = '';

document.addEventListener("DOMContentLoaded", function() {
    const storedUsername = localStorage.getItem('adminUsername');
    const storedPassword = localStorage.getItem('adminPassword');
    if (storedUsername && storedPassword) {
        adminUsername = storedUsername;
        adminPassword = storedPassword;
        verifyToken(adminUsername, adminPassword);
    } else {
        updateTranslations();
    }
});

function login() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    verifyToken(username, password, rememberMe);
}

function verifyToken(username, password, rememberMe) {
    fetch('https://example.com/verify_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.valid) {
            adminUsername = username;
            adminPassword = password;
            if (rememberMe) {
                localStorage.setItem('adminUsername', username);
                localStorage.setItem('adminPassword', password);
            }
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
    document.getElementById('username-label').textContent = translations[currentLanguage].enterAdminToken.split(' ')[0] + ':';
    document.getElementById('password-label').textContent = translations[currentLanguage].enterAdminToken.split(' ')[3] + ':';
    document.querySelector('button[onclick="login()"]').textContent = translations[currentLanguage].login;
}

function fetchTasks() {
    fetch('https://example.com/users', {
        headers: {
            'Authorization': `Bearer ${adminUsername}:${adminPassword}`
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
