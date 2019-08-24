import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export default class Issue1566056680401 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'issue',
            columns: [
                { name: 'id', type: 'integer', isPrimary: true },
                { name: 'iid', type: 'integer' },
                { name: 'project_id', type: 'integer' },
                { name: 'title', type: 'text' },
                { name: 'url', type: 'varchar', length: '255' },
                { name: 'updated_timestamp', type: 'bigint' },
                { name: 'estimate', type: 'smallint' },
                { name: 'spent', type: 'smallint' },
                { name: 'closed', type: 'bool', default: 'false' },
                { name: 'executor_id', type: 'int', isNullable: true },
                { name: 'kanban_status', type: 'varchar', length: '16', isNullable: true },
                { name: 'kanban_order', type: 'int', isNullable: true },
            ],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('issue')
    }

}
