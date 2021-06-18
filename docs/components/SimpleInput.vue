<template>
  <div class="demo">
    <simple :user-name="userName" :user-gender="userGender" :photo-count="photoCount" class="demo" />

    <div class="p-fluid p-py-3">
      <div class="p-field p-grid">
        <label for="userName" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">$userName</label>
        <div class="p-col-12 p-md-10">
          <p-input v-model="userName" id="userName" />
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="userGender" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">$userGender</label>
        <div class="p-col-12 p-md-10">
          <p-dropdown v-model="userGender" id="userGender" :options="genderOptions" />
        </div>
      </div>
      <div class="p-field p-grid">
        <label for="photoCount" class="p-col-12 p-mb-2 p-md-2 p-mb-md-0">$photoCount</label>
        <div class="p-col-12 p-md-10">
          <p-slider v-model="photoCount" id="photoCount" :min="1" :max="30" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Simple from './Simple.vue'

  export default {
    name: 'simple-input',
    components: {
      Simple
    },
    data () {
      return {
        userName: 'John Doe',
        userGender: 'male',
        photoCount: 2,
        genderOptions: [
          'male',
          'female',
          'unspecified'
        ]
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
