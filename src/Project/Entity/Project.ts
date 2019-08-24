import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity({ name: 'project' })
export class Project {
    @PrimaryColumn('integer')
    public id!: number

    @Column('varchar')
    public name!: string

    @Column('varchar')
    public url!: string

    @Column('bigint', { name: 'updated_timestamp' })
    public updatedTimestamp!: number

    @Column('integer', { name: 'group_id' })
    public groupId?: number|null
}
