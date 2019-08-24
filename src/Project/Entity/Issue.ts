import { Entity, PrimaryColumn, Column } from 'typeorm'
import { AbstractEntity } from '../../Database/Entity/AbstractEntity'

@Entity({ name: 'issue' })
export class Issue extends AbstractEntity {
    @PrimaryColumn('integer')
    public id!: number

    @Column('integer')
    public iid!: number

    @Column('integer', { name: 'project_id' })
    public projectId!: number

    @Column('text')
    public title!: string

    @Column('varchar')
    public url!: string

    @Column('bigint', { name: 'updated_timestamp' })
    public updatedTimestamp!: number

    @Column('smallint')
    public estimate!: number

    @Column('smallint')
    public spent!: number

    @Column('bool')
    public closed!: boolean

    @Column('int', { name: 'executor_id' })
    public executorId?: number|null

    @Column('varchar', { name: 'kanban_status' })
    public kanbanStatus?: 'new'|'planed'|'working'|'checking'|'done'

    @Column('int', { name: 'kanban_order' })
    public kanbanOrder?: number

}
