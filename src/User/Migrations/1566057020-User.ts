import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export default class User1566057019500 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                { name: 'id', type: 'integer', isPrimary: true },
                { name: 'email', type: 'varchar', length: '64' },
                { name: 'username', type: 'varchar', length: '32' },
                { name: 'name', type: 'varchar', length: '32', isNullable: true },
                { name: 'avatar_url', type: 'varchar', length: '255', isNullable: true },
                { name: 'url', type: 'varchar', length: '128', isNullable: true },
            ],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('user')
    }

}
