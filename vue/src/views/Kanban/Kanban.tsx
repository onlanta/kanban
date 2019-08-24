import { Vue, Component } from 'vue-property-decorator'
import Column from './Column'
import { CreateElement, VNode } from 'vue'
import './Kanban.css'

interface IIssue {
    id: number
}
interface IKanban {
    new: IIssue[],
    planed: IIssue[],
    working: IIssue[],
    checking: IIssue[],
    done: IIssue[],
}

@Component
export default class extends Vue {
    public issues: IKanban = {
        new: null,
        planed: null,
        working: null,
        checking: null,
        done: null,
    } as any
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
            this.$post('issues/kanban/update', { ...this.issues })
            this.updateTimeout = undefined
        }, 500) as any
    }

    public destroyed() {
        clearInterval(this.interval)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public render(h: CreateElement): VNode {
        return <div class="kanbanView">
            <Column title="Новые" color="rgb(255, 255, 219)" vModel={ this.issues.new } onInput={ this.changed } />
            <Column title="Запланировано" color="rgb(236, 236, 191)" vModel={ this.issues.planed } onInput={ this.changed } />
            <Column title="В работе" color="rgb(253, 214, 162)" vModel={ this.issues.working } onInput={ this.changed } />
            <Column title="На проверке" color="rgb(162, 226, 253)" vModel={ this.issues.checking } onInput={ this.changed } />
            <Column title="Выполнено" color="rgb(162, 253, 200)" vModel={ this.issues.done } onInput={ this.changed } disableDrag={ true }/>
        </div>
    }

}
