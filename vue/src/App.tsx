import { Vue, Component } from 'vue-property-decorator'
import { CreateElement, VNode } from 'vue'
import './App.css'

@Component
export default class extends Vue {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public render(h: CreateElement): VNode {
        return <div id="app">
            <router-view/>
        </div>
    }

}
