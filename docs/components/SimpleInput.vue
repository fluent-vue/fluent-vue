<template>
  <div class="demo">
    <simple :user-name="userName" :user-gender="userGender" :photo-count="photoCount" class="demo" />

    <dl>
      <dt>$userName</dt>
      <dd><input v-model="userName" type="text"></dd>
    </dl>
    <dl>
      <dt>$userGender</dt>
      <dd>
        <select v-model="userGender">
          <option>male</option>
          <option>female</option>
          <option>unspecified</option>
        </select>
      </dd>
    </dl>
    <dl>
      <dt>$photoCount</dt>
      <dd><input v-model.number="photoCount" type="range" min="1" max="100"> {{ photoCount }}</dd>
    </dl>
  </div>
</template>

<script>
  import { ref } from 'vue-demi'
  import Simple from './Simple.vue'

  export default {
    name: 'simple-input',
    components: {
      Simple
    },
    setup () {
      const userName = ref('Jonh Doe')
      const userGender = ref('male')
      const photoCount = ref(1)

      return {
        userName,
        userGender,
        photoCount
      }
    }
  }
</script>

<style>
  dl {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  dt {
    width: 100px;
  }

  .demo {
    padding: 1rem 1.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
</style>
