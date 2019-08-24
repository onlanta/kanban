import Vue, { VNode } from 'vue'
import 'vue-tsx-support/enable-check'
import "vue-tsx-support/options/allow-unknown-props"

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    /* interface IntrinsicElements {
      [elem: string]: any
    }*/
  }
}
