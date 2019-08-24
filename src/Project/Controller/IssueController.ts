import { AbstractController, IQueryData } from '../../Base/Controller/AbstractController'
import { Application } from '../../Application'
import { Issue } from '../Entity/Issue'

export default class IssueController extends AbstractController {

    public constructor(app: Application) {
        super(app)
        this.onQuery('issues/kanban', this.kanban)
        this.onQuery('issues/kanban/update', this.kanbanUpdate)
    }

    public async kanbanUpdate(data: IQueryData) {
        for (const key of Object.keys(data.params)) {
            if (['new', 'planed', 'working', 'checking', 'done'].indexOf(key) < 0) {
                continue
            }
            let index = 0
            for (const i of data.params[key]) {
                index++
                const issue = await this.app.issueService.getIssue(i.id)
                if (!issue) {
                    continue
                }
                issue.kanbanStatus = key as any
                issue.kanbanOrder = index
                this.app.issueService.issueRepository.save(issue)
            }
        }
    }

    public async kanban() {
        const issues = await this.app.issueService.getKanban()
        const result: any = {}
        for (const key of Object.keys(issues)) {
            result[key] = []
            for (const i of (issues as any)[key] as Issue[]) {
                const project = await this.app.projectService.getProject(i.projectId)
                if (!project) {
                    throw new Error(`Project #${i.projectId} not found`)
                }
                const group = project.groupId ? await this.app.groupService.getGroup(project.groupId) : undefined
                const executor = i.executorId ? await this.app.userService.getUser(i.executorId) : undefined
                result[key].push({
                    ...i.getPlain(),
                    projectName: project.name,
                    projectUrl: project.url,
                    groupId: group ? group.id : undefined,
                    groupName: group ? group.name : undefined,
                    groupUrl: group ? group.url : undefined,
                    executor: executor ? { id: executor.id, name: executor.username, color: executor.color } : undefined,
                })
            }
        }

        return result
    }

}
