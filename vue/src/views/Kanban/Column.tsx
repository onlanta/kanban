import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import draggable from 'vuedraggable'
import Issue from './Issue'
import { CreateElement, VNode } from 'vue'
import './Column.css'

interface IIssue {
    id: number
}

@Component({ components: { draggable, Issue } })
export default class extends Vue {
    @Prop()
    public title!: string
    @Prop()
    public color!: string
    @Prop()
    public value!: IIssue[]|null
    @Prop({ default: false })
    public disableDrag!: boolean
    public issuesValue: IIssue[]|null = null

    @Watch('value', { immediate: true })
    public onIssuesChange() {
        this.issuesValue = this.value
    }

    public onDrag() {
        this.$emit('input', this.issuesValue)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public render(h: CreateElement): VNode {
        const renderer = () => {
            if (this.issuesValue === null) {
                return <div class="kvcLoading">Загрузка...</div>
            } else if (!this.disableDrag) {
                return <draggable class="kvcIssues" vModel={ this.issuesValue } group={ { name: 'issues', pull: true, put: true } }
                    onEnd={ this.onDrag } onAdd={ this.onDrag }
                >
                    { this.issuesValue.map(i => <issue key={ i.id } issue={ i } />) }
                </draggable>
            } else {
                return <div class="kvcIssues noDrag">
                    { this.issuesValue.map(i => <issue key={ i.id } issue={ i } />) }
                </div>
            }
        }
        return <div class="kvColumn"><div class="kvcInner" style={ { background: this.color } }>
            <h2>{ this.title }</h2>
            { renderer() }
        </div></div>
    }

}
