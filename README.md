# Kanban board for GitLab
Simple kanban board for GitLab

## Installation
```
git clone git@github.com:onlanta/kanban.git
cd kanban
npm run ci
npm run build
npm run vue-build
cp config.js.dist to config.js
```
Then edit config.js, where:
```
module.exports = {
    listen: 37433, // Port on which web-application will be available
    logdir: 'logs', // Logdir
    db: {
        name: 'db name', // DB name of Postgres
        user: 'db user', // username for DB
        password: 'db password', // password for DB
    },
    gitlab: {
        url: 'https://localhost', // GitLab address
        token: 'dasdasd', // GitLab access token
        updateInterval: 60, // Interval between reciving updates from GitLab in seconds, 0 - disabled
    },
    columns: [
        { key: 'new', title: 'Новые', color: 'rgb(255, 255, 219)' },
        { key: 'planned', title: 'Запланировано', color: 'rgb(236, 236, 191)' },
        { key: 'working', title: 'В работе', color: 'rgb(253, 214, 162)' },
        { key: 'checking', title: 'На проверке', color: 'rgb(162, 226, 253)' },
        { key: 'done', title: 'Выполнено', color: 'rgb(162, 253, 200)' },
    ],
}

```

