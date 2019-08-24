import { Application } from '../../Application'
import { AbstractConsoleCommand } from './AbstractConsoleCommand'

export class HelpCommand extends AbstractConsoleCommand {

    public constructor(app: Application) {
        super(app, '--help', 'Show this help')
    }

    public async execute(): Promise<void> {
        console.log('\n=== Available commands: ===')
        const commands: AbstractConsoleCommand[] = Object.keys(this.app)
            .map((k) => (this.app as any)[k]).filter((f) => f instanceof AbstractConsoleCommand)
            .sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
        const maxLength = Math.max(...commands.map((c) => c.usage ? c.usage.length : c.name.length))

        for (const commandInstance of commands) {
            console.log('  ' +
                (commandInstance.usage ? commandInstance.usage : commandInstance.name).padEnd(maxLength) +
                `  ${commandInstance.description}`)
        }
    }

}
