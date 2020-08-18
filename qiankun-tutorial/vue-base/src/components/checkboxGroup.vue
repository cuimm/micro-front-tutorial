<template>
  <div class="th-checkbox-group">
    <el-checkbox-group
      v-model="model"
      :disabled="disabled"
    >
      <el-checkbox
        v-for="(option,index) in options"
        :key="index"
        :label="option.id"
        :disabled="option.disabled"
        @change="handleCheckboxChange(option)"
      >
        {{ option.text }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'CheckboxGroup',
  props: {
    value: {
      type: Array,
      default: () => [],
      required: true,
    },
    options: {
      type: Array,
      default: () => [],
      required: true,
    },
    showNoLimit: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(val) {
        this.handleData(val)
      },
    },
    noLimit: {
      get() {
        return this.model.every(
            item => this.options.find(option => option.id === item).disabled
        )
      },
      set(val) {
        if (val) {
          this.model = this.model.filter(item => this.options.find(option => option.id === item).disabled)
        }
      },
    },
  },
  watch: {
    model(val) {
      this.handleData(val)
    },
  },
  methods: {
    handleData(value) {
      this.$emit('input', value)
    },
    handleCheckboxChange(option) {
      this.$emit('option-click', option)
    },
  },
}
</script>
