<template>
  <SellerLayout>
    <router-view />
  </SellerLayout>
</template>

<script>
import { defineComponent } from 'vue'
import SellerLayout from '@/Components/SellerLayout.vue'

export default defineComponent({
  name: 'SellerIndex',
  components: {
    SellerLayout
  },
})
</script>

