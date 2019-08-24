import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

Vue.prototype.$post = async (method: string, params: { [key: string]: any } = {}) => {
    const result = await fetch(`/api/${method}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    })
    const json = await result.json()
    if (!json || json.error) {
        throw new Error(json.errorMessage ? 'Error: ' + json.errorMessage : 'Unknown error')
    }
    return json.result
}
Number.prototype.time = function(this: number) {
    const hours = Math.floor(this / 60)
    const minutes = this % 60
    const result = [...(hours ? [hours + 'h'] : []), minutes + 'm']
    return result.join(' ')
}

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
