import { AbstractConsoleCommand } from '../../Base/Console/AbstractConsoleCommand'
import { Application } from '../../Application'

export class UpdateProjectsCommand extends AbstractConsoleCommand {

    public constructor(app: Application) {
        super(app, 'gitlab:update:projects', 'Updates projects and gathers all needed information', 'gitlab:update:projects [--alltime]')
    }

    public async execute() {
        await this.app.dbService.onConnect()
        await this.app.userService.updateUsers()
        await this.app.projectService.updateProjects(process.argv[3] === '--alltime')
    }

}
