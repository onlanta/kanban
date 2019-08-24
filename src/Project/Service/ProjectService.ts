import { AbstractService } from '../../Base/Service/AbstractService'
import { Project } from '../Entity/Project'

export class ProjectService extends AbstractService {

    public get projectRepository() {
        return this.app.dbService.connection.getRepository(Project)
    }

    public async updateProjects(allTime = false) {
        await this.app.groupService.updateGroups()
        for (const data of await this.app.gitlabService.getProjects()) {
            let project = await this.getProject(data.id)

            if (!project) {
                project = this.projectRepository.create({ id: data.id })
            }
            project.name = data.name
            project.url = data.web_url
            project.updatedTimestamp = Math.round(new Date(data.last_activity_at).getTime() / 1000)
            project.groupId = data.namespace && data.namespace.kind === 'group' ? data.namespace.id : null
            await this.projectRepository.save(project)
            await this.app.issueService.updateProjectIssues(project, allTime)
        }
    }

    public async getProject(id: number): Promise<Project|undefined> {
        return id ? this.app.localCacheService.get(`project.${id}`, () => this.projectRepository.findOne(id)) : undefined
    }

}
