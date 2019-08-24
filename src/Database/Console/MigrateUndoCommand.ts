import { AbstractConsoleCommand } from '../../Base/Console/AbstractConsoleCommand'
import { Application } from '../../Application'

export class MigrateUndoCommand extends AbstractConsoleCommand {

    public constructor(app: Application) {
        super(app, 'migrations:migrate:undo', 'Undoing last migration')
    }

    public async execute() {
        await this.app.dbService.onConnect()
        await this.app.dbService.collectMigrations()
        const migrations = await this.app.dbService.connection.query('SELECT * FROM migrations')
        if (!migrations.length) {
            return console.log('There is no migrations to undo')
        }
        try {
            await this.app.dbService.connection.undoLastMigration()
        } catch (err) {
            return console.log(err)
        }
        console.log(`Migration ${migrations[migrations.length - 1].name} reverted`)
    }

}
