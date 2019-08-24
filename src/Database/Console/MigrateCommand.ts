import { AbstractConsoleCommand } from '../../Base/Console/AbstractConsoleCommand'
import { Application } from '../../Application'
import { Migration } from 'typeorm/migration/Migration'

export class MigrateCommand extends AbstractConsoleCommand {

    public constructor(app: Application) {
        super(app, 'migrations:migrate', 'Perform migrations')
    }

    public async execute() {
        await this.app.dbService.onConnect()
        await this.app.dbService.collectMigrations()
        let migrations: Migration[]
        try {
            migrations = await this.app.dbService.connection.runMigrations()
        } catch (err) {
            return console.log(err)
        }

        if (migrations.length) {
            for (const migration of migrations) {
                console.log(`Migration ${migration.name} applied`)
            }
        } else {
            console.log('No new migrations')
        }
    }

}
