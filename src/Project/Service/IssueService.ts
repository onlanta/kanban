import { AbstractService } from '../../Base/Service/AbstractService'
import { Issue } from '../Entity/Issue'
import { MoreThanOrEqual } from 'typeorm'
import { Project } from '../Entity/Project'

export class IssueService extends AbstractService {

    public get issueRepository() {
        return this.app.dbService.connection.getRepository(Issue)
    }

    public async updateProjectIssues(project: Project, allTime = false) {
        const issues = await this.app.gitlabService.getIssues(project.id, allTime ? undefined : new Date().getTimestamp() - 60 * 60 * 24)
        for (const data of issues) {
            let issue = await this.getIssue(data.id)

            if (!issue) {
                issue = this.issueRepository.create({
                    id: data.id,
                    iid: data.iid,
                    projectId: project.id,
                })
            }
            issue.title = data.title
            issue.url = data.web_url
            issue.updatedTimestamp = Math.floor(new Date(data.updated_at).getTime() / 1000)
            issue.estimate = data.time_stats.time_estimate ? Math.ceil(data.time_stats.time_estimate / 60) : 0
            issue.spent = Math.round(data.time_stats.total_time_spent / 60)
            issue.closed = !!data.closed_at
            issue.executorId = data.assignee ? data.assignee.id : null
            await this.issueRepository.save(issue)
        }
    }

    public async getKanban() {
        const issues = await this.issueRepository.find({
            where: { updatedTimestamp: MoreThanOrEqual(new Date().getTimestamp() - 60 * 60 * 24 * 30) },
            order: { kanbanOrder: 'ASC', updatedTimestamp: 'DESC' },
        })
        const result = {
            new: [] as Issue[],
            planed: [] as Issue[],
            working: [] as Issue[],
            checking: [] as Issue[],
            done: [] as Issue[],
        }
        for (const i of issues) {
            if (i.kanbanStatus === 'done' || i.closed) {
                result.done.push(i)
            } else if (i.kanbanStatus === 'planed') {
                result.planed.push(i)
            } else if (i.kanbanStatus === 'working') {
                result.working.push(i)
            } else if (i.kanbanStatus === 'checking') {
                result.checking.push(i)
            } else {
                result.new.push(i)
            }
        }

        return result
    }

    public async getIssue(id: number) {
        return id ? this.issueRepository.findOne(id) : undefined
    }

}
