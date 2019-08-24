import { Column, PrimaryColumn, Entity } from 'typeorm'
import { AbstractEntity } from '../../Database/Entity/AbstractEntity'
import crypto from 'crypto'

@Entity({ name: 'users' })
export class User extends AbstractEntity {
    @PrimaryColumn('integer')
    public id!: number

    @Column('varchar')
    public email!: string

    @Column('varchar')
    public username!: string

    @Column('varchar')
    public name!: string

    @Column('varchar', { name: 'avatar_url' })
    public avatarUrl!: string

    @Column('varchar')
    public url!: string

    public get color() {
        const hash = crypto.createHash('md5').update(this.username).digest()
        const result: number[] = []
        for (let i = 0; i < 3; i++) {
            result.push(200 - hash[i] / 255 * 150)
        }
        return `rgb(${result.join(', ')})`
    }


}
