import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import './Issue.css'
import { CreateElement, VNode } from 'vue'

interface IIssue {
    groupId: number
    groupName: string
    groupUrl: string
    projectName: string
    projectUrl: string
    url: string
    title: string
    executor: { color: string, name: string }
    spent: number
    estimate: number
}

@Component
export default class extends Vue {
    @Prop()
    public issue!: IIssue
    public issueValue!: IIssue
    public selectUser = false

    @Watch('issue', { immediate: true })
    public onIssueChange() {
        this.issueValue = this.issue
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public render(h: CreateElement): VNode {
        return <div class="kvcIssue">
            <div class="kvciTitle">
                { this.issueValue.groupId ? <small><a href={ this.issueValue.groupUrl } target="_blank">
                    { this.issueValue.groupName }
                </a> / </small> : undefined }
                <a href={ this.issueValue.projectUrl } target="_blank">{ this.issueValue.projectName }</a>
            </div>
            <div class="kvciText"><a href={ this.issueValue.url } target="_blank">{ this.issueValue.title }</a></div>
            <div class={ ['kvciExecutor', this.issueValue.executor ? '' : 'none'] }>
                <span class="timeTd">
                    <span title="Времени потрачено">{ this.issueValue.spent.time() }</span> / <span title="Времени планировалось">
                        { this.issueValue.estimate.time() }</span>
                </span>
                { this.issueValue.executor ? <span class="kvcieUser" style={ { background: this.issueValue.executor.color } }>
                    { this.issueValue.executor.name }
                </span> : <span class="kvcieSelect">не определён</span> }
            </div>
        </div>
    }

}
