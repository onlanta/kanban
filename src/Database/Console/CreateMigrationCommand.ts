import { AbstractConsoleCommand } from '../../Base/Console/AbstractConsoleCommand'
import { Application } from '../../Application'
import fs from 'fs'

export class CreateMigrationCommand extends AbstractConsoleCommand {

    public constructor(app: Application) {
        super(app,
            'migrations:generate',
            'Creates migration with name from argument',
            'migrations:generate <name>',
        )
    }

    public async execute() {
        const name = process.argv[3].split('/')

        if (name.length !== 2) {
            return console.error('You must provide name for new migration with following format: ' +
                '<BundleName>/<MigrationName>, for example Content/News')
        }
        const stamp = Date.now()
        const timestamp = Math.round(stamp / 1000)
        const dirname = `src/${name[0]}/Migrations`
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname)
        }
        const filename = `${dirname}/${timestamp}-${name[1]}.ts`
        let str = 'import { MigrationInterface, QueryRunner } from \'typeorm\'\n\n'
        str += `export default class ${name[1]}${stamp} implements MigrationInterface {\n\n`
        str += '    public async up(queryRunner: QueryRunner): Promise<any> {}\n\n'
        str += '    public async down(queryRunner: QueryRunner): Promise<any> {}\n\n'
        str += '}\n'
        fs.writeFileSync(filename, str)

        console.log(`New migration placed into ${filename}`)
    }

}
