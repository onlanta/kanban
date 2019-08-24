import Express from 'express'
import { AbstractConsoleCommand } from './Base/Console/AbstractConsoleCommand'
import { DbService } from './Database/Service/DbService'
import { HelpCommand } from './Base/Console/HelpCommand'
import { LoggerService } from './Logger/Service/LoggerService'
import { IssueService } from './Project/Service/IssueService'
import { GitlabService } from './Gitlab/Service/GitlabService'
import { LocalCacheService } from './Base/Service/LocalCacheService'
import { ProjectService } from './Project/Service/ProjectService'
import { GroupService } from './Project/Service/GroupService'
import { UserService } from './User/Service/UserService'
import { UpdateProjectsCommand } from './Gitlab/Console/UpdateProjectsCommand'
import { CreateMigrationCommand } from './Database/Console/CreateMigrationCommand'
import { MigrateCommand } from './Database/Console/MigrateCommand'
import { MigrateUndoCommand } from './Database/Console/MigrateUndoCommand'
import IssueController from './Project/Controller/IssueController'
import fs from 'fs'

export class Application {
    public http!: Express.Express

    // Services
    public localCacheService!: LocalCacheService
    public loggerService!: LoggerService
    public dbService!: DbService
    public gitlabService!: GitlabService
    public issueService!: IssueService
    public projectService!: ProjectService
    public groupService!: GroupService
    public userService!: UserService

    // Commands
    public helpCommand!: HelpCommand
    public createMigrationCommand!: CreateMigrationCommand
    public migrateCommand!: MigrateCommand
    public migrateUndoCommand!: MigrateUndoCommand
    public updateProjectsCommand!: UpdateProjectsCommand

    // Controllers
    public issueController!: IssueController

    public constructor(public readonly config: IConfig) { }

    public async run() {
        this.initializeServices()
        if (process.argv[2]) {
            this.initializeCommands()
            for (const command of Object.values(this)
                .filter((c: any) => c instanceof AbstractConsoleCommand) as AbstractConsoleCommand[]
            ) {
                if (command.name === process.argv[2]) {
                    await command.execute()
                    process.exit()
                }
            }
            await this.helpCommand.execute()
            process.exit()
        } else {
            this.runWebServer()
        }
    }

    protected runWebServer() {
        this.runCron()
        this.http = Express()
        this.http.use('/', Express.static('vue/dist'))
        this.http.use((req, res, next) => {
            if (req.url.indexOf('/api') === -1) {
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
                res.header('Expires', '-1')
                res.header('Pragma', 'no-cache')
                return res.send(fs.readFileSync('vue/dist/index.html').toString())
            }
            next()
        })
        this.http.use(Express.urlencoded())
        this.http.use(Express.json())
        this.http.listen(this.config.listen, () => console.log(`Listening on port ${this.config.listen}`))

        this.initializeControllers()
    }

    protected runCron() {
        if (this.config.gitlab.updateInterval) {
            setInterval(async () => {
                if (!this.updateProjectsCommand) {
                    this.updateProjectsCommand = new UpdateProjectsCommand(this)
                }
                await this.updateProjectsCommand.execute()
            }, this.config.gitlab.updateInterval * 1000)
        }
    }

    protected initializeServices() {
        this.localCacheService = new LocalCacheService(this)
        this.gitlabService = new GitlabService(this)
        this.loggerService = new LoggerService(this)
        this.dbService = new DbService(this)
        this.issueService = new IssueService(this)
        this.projectService = new ProjectService(this)
        this.groupService = new GroupService(this)
        this.userService = new UserService(this)
    }

    protected initializeCommands() {
        this.helpCommand = new HelpCommand(this)
        this.createMigrationCommand = new CreateMigrationCommand(this)
        this.migrateCommand = new MigrateCommand(this)
        this.migrateUndoCommand = new MigrateUndoCommand(this)
        this.updateProjectsCommand = new UpdateProjectsCommand(this)
    }

    protected initializeControllers() {
        this.issueController = new IssueController(this)
    }

}
