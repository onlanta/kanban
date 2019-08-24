import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export default class Project1566056268336 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'project',
            columns: [
                { name: 'id', type: 'integer', isPrimary: true },
                { name: 'name', type: 'varchar', length: '255' },
                { name: 'url', type: 'varchar', length: '255' },
                { name: 'updated_timestamp', type: 'bigint' },
                { name: 'group_id', type: 'integer', isNullable: true },
            ],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('project')
    }

}
