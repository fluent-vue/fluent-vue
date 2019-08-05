import { Vue } from 'vue/types/vue'
import { FluentBundle } from 'fluent';

export interface FluentVueObject {
}

export interface FluentVueOptions {
  bundle: FluentBundle;
}

declare module 'vue/types/vue' {
  interface Vue {
    $fluent: FluentVueObject
    $t(key: string, values: any): string 
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    fluent?: FluentVueObject
  }
}

declare module '*.ftl' {
  export default String
}
