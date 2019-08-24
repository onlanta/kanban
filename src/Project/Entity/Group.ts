import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity({ name: 'group' })
export class Group {
    @PrimaryColumn('integer')
    public id!: number

    @Column('varchar')
    public name!: string

    @Column('varchar')
    public url!: string
}
