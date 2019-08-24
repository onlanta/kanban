import { Application } from './Application'

export = (config: IConfig) => {
    Date.prototype.getTimestamp = function() { return Math.floor(this.getTime() / 1000) }
    const app = new Application(config)
    app.run()
}
