import fs from 'fs'
import { Application } from '../../Application'
import { AbstractService } from '../../Base/Service/AbstractService'
import { Connection, createConnection } from 'typeorm'

export class DbService extends AbstractService {
    public connection!: Connection

    public constructor(app: Application) {
        super(app)
        const type = app.config.db.type

        if (!['mysql', 'mariadb', 'postgres', 'cockroachdb', 'sqlite', 'mssql', 'oracle', 'cordova', 'nativescript', 'react-native',
            'sqljs', 'mongodb', 'expo'].includes(type)
        ) {
            throw new Error(`DB type ${type} is not supported`)
        }

        createConnection({
            host: app.config.db.host,
            port: app.config.db.port,
            type: type as any,
            database: app.config.db.name,
            username: app.config.db.user,
            password: app.config.db.password,
            migrationsTableName: 'migrations',
            entities: ['dist/**/Entity/*.js'],
            logging: ['error', 'warn', 'migration'],
        }).then(async (connection) => {
            this.connection = connection
        }).catch((err: any) => console.error(err))
    }

    public onConnect() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this.connection) {
                    resolve()
                    clearInterval(interval)
                }
            }, 10)
        })
    }

    public collectMigrations() {
        fs.readdirSync('src')
            .filter((i) => fs.lstatSync(`src/${i}`).isDirectory())
            .map((i) => `src/${i}/Migrations`)
            .filter((i) => fs.existsSync(i))
            .reduce((result, i) => {
                return [
                    ...result,
                    ...fs.readdirSync(i).filter(subi => /\.ts$/.test(subi))
                        .map(subi => `${i.replace('src/', '')}/${subi.replace('.ts', '.js')}`),
                ]
            }, [] as string[])
            .forEach(async (f) => {
                this.connection.migrations.push(new (await import(`../../${f}`)).default())
            })
    }

}
