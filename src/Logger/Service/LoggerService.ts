import fs from 'fs'
import { Application } from '../../Application'
import { AbstractService } from '../../Base/Service/AbstractService'

export class LoggerService extends AbstractService {
    public interval?: NodeJS.Timeout
    public intervalExecuting = false

    public constructor(app: Application) {
        super(app)
        this.interval = setInterval(async () => {
            if (this.intervalExecuting) {
                return
            }
            this.intervalExecuting = true
            try {
                await this.getCurrentFilename()
            } catch (err) {
                this.write(err)
            } finally {
                this.intervalExecuting = false
            }
        }, 60000 * 60)
        process.on('uncaughtException', this.exceptionListener.bind(this))
        process.on('unhandledRejection', this.exceptionListener.bind(this) as any)
    }

    public async exceptionListener(error: Error) {
        this.write(error)
        console.error(error)
    }

    public async write(message: string | Error | (string|Error)[], log = 'error') {
        const file = await this.getCurrentFilename(log)
        const date = new Date()
        message = Array.isArray(message) ? message : [message]
        for (const m of message) {
            let messageForWrite = m instanceof Error ? m.stack : `${m}`
            messageForWrite = `${date.getFullYear()}-` +
                `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T` +
                `${String(date.getHours()).padStart(2, '0')}:` +
                `${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')} ` +
                messageForWrite
            fs.appendFileSync(file, messageForWrite + '\n')
        }
    }

    public async getCurrentFilename(log = 'error') {
        if (!fs.existsSync(this.app.config.logdir)) {
            fs.mkdirSync(this.app.config.logdir)
        }
        const fileName = `${this.app.config.logdir}/${log}.log`
        if (!fs.existsSync(fileName)) {
            return fileName
        }
        const fd = fs.openSync(fileName, 'r')
        const stat = fs.fstatSync(fd)
        fs.closeSync(fd)
        const date = new Date()
        if (stat.mtime.getDate() !== date.getDate()) {
            let moveFileName = `${this.app.config.logdir}/${log}-${stat.mtime.getFullYear()}-` +
                `${String(stat.mtime.getMonth() + 1).padStart(2, '0')}-${String(stat.mtime.getDate()).padStart(2, '0')}.log`
            moveFileName = fs.existsSync(moveFileName) ? moveFileName + '.' + Date.now() : moveFileName
            fs.renameSync(fileName, moveFileName)
        }
        return fileName
    }

}
