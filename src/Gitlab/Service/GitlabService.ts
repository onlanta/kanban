import { AbstractService } from '../../Base/Service/AbstractService'
import { Application } from '../../Application'
import axios from 'axios'
import https from 'https'
import qs from 'querystring'

interface IProjectData {
    id: number
    description: string
    name: string
    namespace?: {
        full_path: string,
        id: number,
        kind: 'group',
        name: string,
        parent_id: number|null,
        path: string,
    }
    name_with_namespace: string
    path: string
    path_with_namespace: string
    created_at: string
    default_branch: object
    tag_list: object
    ssh_url_to_repo: string
    http_url_to_repo: string
    web_url: string
    avatar_url: string|null
    star_count: number
    forks_count: number
    last_activity_at: string
}
interface ICommitData {
    id: string
    short_id: string
    title: string
    created_at: string
    message: string
    author_name: string
    author_email: string
    authored_date: string
    committer_name: string
    committer_email: string
    committed_date: string
}
interface IUserData {
    id: number
    name: string
    username: string
    state: string
    avatar_url: string
    web_url: string
    created_at: string
    bio: string
    location: string
    skype: string
    linkedin: string
    twitter: string
    website_url: string
    organization: string
    last_sign_in_at: string
    confirmed_at: string
    last_activity_on: string
    email: string
    theme_id: number
    color_scheme_id: number
    projects_limit: number
    current_sign_in_at: string
    identities: { provider: string, extern_uid: string }[]
    can_create_group: boolean
    can_create_project: boolean
    two_factor_enabled: boolean
    external: boolean
    is_admin: boolean
}
interface IIssueData {
    id: number
    iid: number
    project_id: number
    title: string
    description: string
    state: string
    created_at: string
    updated_at: string
    closed_at: string|null
    labels: object
    milestone: any
    assignees: object
    author: object
    assignee: {
        avatar_url: string
        id: number
        name: string
        state: string
        username: string
        // tslint:disable-next-line
        web_url: string
    }|null
    user_notes_count: number
    upvotes: number
    downvotes: number
    due_date: object
    confidential: boolean
    discussion_locked: object
    web_url: string
    time_stats: {
        human_time_estimate: string|null,
        human_total_time_spent: string|null,
        time_estimate: number,
        total_time_spent: number,
    }
}
interface IGroupData {
    id: number
    lfs_enabled: boolean
    name: string
    parent_id: number|null
    path: string
    visibility: string
    web_url: string
}

export class GitlabService extends AbstractService {
    private readonly url = this.app.config.gitlab.url
    private readonly token = this.app.config.gitlab.token
    private readonly agent = new https.Agent({ rejectUnauthorized: false })

    public constructor(app: Application) {
        super(app)
    }

    public async canUserEditGroup(userId: number, groupId: number): Promise<boolean> {
        const user = await this.getUser(userId)
        if (user.is_admin) {
            return true
        }
        const members = await this.call(`/groups/${groupId}/members`)

        return !!members.find((m: any) => Number(m.id) === Number(userId) && m.access_level >= 40)
    }

    public async getIssues(projectId: number, updatedAfterTimestamp?: number): Promise<IIssueData[]> {
        // eslint-disable-next-line @typescript-eslint/camelcase
        const params: any = { order_by: 'updated_at' }
        if (updatedAfterTimestamp) {
            // eslint-disable-next-line @typescript-eslint/camelcase
            params.updated_after = new Date(updatedAfterTimestamp * 1000).toISOString()
        }
        return this.getAll(`projects/${projectId}/issues`, params)
    }

    public async getIssue(projectId: number, issueIid: number): Promise<IIssueData> {
        return this.call(`projects/${projectId}/issues/${issueIid}`)
    }

    public async findUser(email: string): Promise<IUserData|undefined> {
        return (await this.call('users', { search: email }))[0]
    }

    public async getUsers(): Promise<IUserData[]> {
        return this.getAll('users')
    }

    public async getUser(userId: number): Promise<IUserData> {
        return await this.call(`/users/${userId}`)
    }

    public async getCommits(projectId: number): Promise<ICommitData[]> {
        return this.getAll(`projects/${projectId}/repository/commits`)
    }

    public async getProjects(): Promise<IProjectData[]> {
        return this.getAll('projects', { simple: 'true' })
    }

    public async deleteNote(projectId: number, issueIid: number, noteId: number, authorId: number) {
        return this.call(`/projects/${projectId}/issues/${issueIid}/notes/${noteId}?sudo=${authorId}`, undefined, 'delete')
    }

    public async getGroups(): Promise<IGroupData[]> {
        return this.getAll('groups')
    }

    private async getAll(action: string, data?: any) {
        const result: any[] = []
        let page = 0
        while (page < 1000) {
            // eslint-disable-next-line @typescript-eslint/camelcase
            const subResult = await this.call(action, { ...(data ? data : {}), per_page: 100, page: ++page })
            if (!subResult || !subResult.length) {
                break
            }
            subResult.forEach((s: any) => result.push(s))
        }
        return result
    }

    private async call(action: string, data?: any, method: 'get'|'post'|'put'|'delete' = 'get') {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        let result
        try {
            result = await axios({
                url: `${this.url}/api/v4/${action}` + (data && method === 'get' ? `?${qs.stringify(data)}` : ''),
                method,
                headers: { 'Private-Token': this.token },
                data: data ? data : undefined,
                httpsAgent: this.agent,
            })
        } catch (err) {
            if (err.response && err.response.status === 404) {
                return undefined
            }
            throw err
        }

        return result.data
    }

}
