import { AbstractService } from '../../Base/Service/AbstractService'
import { Group } from '../Entity/Group'

export class GroupService extends AbstractService {

    public get groupRepository() {
        return this.app.dbService.connection.getRepository(Group)
    }

    public async updateGroups() {
        for (const data of await this.app.gitlabService.getGroups()) {
            let group = await this.getGroup(data.id)
            if (!group) {
                group = this.groupRepository.create({
                    id: data.id,
                })
                group.name = data.name
                group.url = data.web_url
                await this.groupRepository.save(group)
            }
        }
    }

    public async getGroup(id: number): Promise<Group|undefined> {
        return id ? this.app.localCacheService.get(`group.${id}`, () => this.groupRepository.findOne(id)) : undefined
    }

}
