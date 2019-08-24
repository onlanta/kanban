import Vue from 'vue'

declare global {
    interface Number {
        time(): string
    }
}

declare module 'vue/types/vue' {
    interface Vue {
        $post(method: string, params?: { [key: string]: any }): any
    }
}
