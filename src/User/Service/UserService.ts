import { AbstractService } from '../../Base/Service/AbstractService'
import { User } from '../Entity/User'

export class UserService extends AbstractService {

    public get userRepository() {
        return this.app.dbService.connection.getRepository(User)
    }

    public async updateUsers() {
        const usersData = await this.app.gitlabService.getUsers()

        for (const userData of usersData) {
            let user = await this.getUser(userData.id)

            if (!user) {
                user = this.userRepository.create({ id: userData.id })
            }
            user.email = userData.email.toLowerCase()
            user.username = userData.username.toLowerCase()
            user.name = userData.name
            user.avatarUrl = userData.avatar_url
            user.url = userData.web_url
            await this.userRepository.save(user)
        }

    }

    public async getUser(id: number): Promise<User|undefined> {
        return id ? this.app.localCacheService.get(`user.${id}`, () => this.userRepository.findOne(id)) : undefined
    }

    public async getUserByUsername(username: string) {
        return this.userRepository.findOne({ where: { username: username.toLowerCase() } })
    }

}
