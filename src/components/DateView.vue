<template>
  <div>
    <v-menu v-model="menu">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field v-model="text" v-bind="attrs" v-on="on" label="年月日">
        </v-text-field>
      </template>
      <v-date-picker v-model="picker" @input="formatDate(picker)">
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>

export default {
    name: 'DateView',
    components: {
    },
    data() {
      return {
          date:'',
          menu: "",
          text: "",
          picker: "",
      }
    },
    methods: {
      formatDate(date) {
        if (!date) return null;
        const [year, month, day] = date.split("-");
        this.text = `${year}-${month}-${day}`;
        this.menu = false;
        this.$emit('parent-setdate',this.picker); 
        return;
      }
    }
}
</script>
