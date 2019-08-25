import { AbstractController, IQueryData } from '../../Base/Controller/AbstractController'
import { Application } from '../../Application'

export default class IssueController extends AbstractController {

    public constructor(app: Application) {
        super(app)
        this.onQuery('issues/kanban', this.kanban)
        this.onQuery('issues/kanban/update', this.kanbanUpdate)
    }

    public async kanbanUpdate(data: IQueryData) {
        const keys = this.app.config.columns.map(c => c.key)
        for (const c of data.params as { key: string, title: string, color: string, issues: number[] }[]) {
            if (keys.indexOf(c.key) < 0) {
                continue
            }
            let index = 0
            for (const i of c.issues) {
                index++
                const issue = await this.app.issueService.getIssue(i)
                if (!issue) {
                    continue
                }
                issue.kanbanStatus = c.key
                issue.kanbanOrder = index
                this.app.issueService.issueRepository.save(issue)
            }
        }
    }

    public async kanban() {
        const issues = await this.app.issueService.getKanban()
        const result: { key: string, title: string, color: string, issues: any[] }[] = []
        for (const c of this.app.config.columns) {
            result.push({ ...c, issues: [] })
            for (const i of issues[c.key]) {
                const project = await this.app.projectService.getProject(i.projectId)
                if (!project) {
                    throw new Error(`Project #${i.projectId} not found`)
                }
                const group = project.groupId ? await this.app.groupService.getGroup(project.groupId) : undefined
                const executor = i.executorId ? await this.app.userService.getUser(i.executorId) : undefined
                result[result.length - 1].issues.push({
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
