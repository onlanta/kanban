interface Date {
    getTimestamp(): number
}

interface IConfig {
    listen: number
    logdir: string
    db: {
        name: string
        user: string
        password: string
    }
    gitlab: {
        url: string
        token: string
        updateInterval: number
    },
}
