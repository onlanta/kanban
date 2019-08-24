import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export default class Group1566055800285 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'group',
            columns: [
                { name: 'id', type: 'integer', isPrimary: true },
                { name: 'name', type: 'varchar', length: '128' },
                { name: 'url', type: 'varchar', length: '255' },
            ],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('group')
    }

}
