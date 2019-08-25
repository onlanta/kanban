interface Date {
    getTimestamp(): number
}

interface IConfig {
    listen: number
    logdir: string
    db: {
        type: string
        host: string
        port: number
        name: string
        user: string
        password: string
    }
    gitlab: {
        url: string
        token: string
        updateInterval: number
    },
    columns: { key: string, title: string, color: string }[]
}
