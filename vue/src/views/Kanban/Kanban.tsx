import { Vue, Component } from 'vue-property-decorator'
import Column from './Column'
import { CreateElement, VNode } from 'vue'
import './Kanban.css'

interface IIssue {
    id: number
}
type IKanban = { key: string, title: string, color: string, issues: IIssue[] }[]

@Component
export default class extends Vue {
    public issues: IKanban = []
    public updateTimeout?: number
    public interval?: number

    public async created() {
        document.title = 'Канбан-доска'
        this.issues = await this.$post('issues/kanban')
        this.interval = setInterval(async () => {
            this.issues = await this.$post('issues/kanban')
        }, 60000) as any
    }

    public changed() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout)
        }
        this.updateTimeout = setTimeout(() => {
            this.$post('issues/kanban/update', [ ...this.issues.map(c => ({ ...c, issues: c.issues.map(i => i.id) })) ])
            this.updateTimeout = undefined
        }, 500) as any
    }

    public destroyed() {
        clearInterval(this.interval)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public render(h: CreateElement): VNode {
        return <div class="kanbanView">
            { this.issues.map(c => <Column
                title={ c.title } color={ c.color } vModel={ c.issues } onInput={ this.changed } />) }
        </div>
    }

}
