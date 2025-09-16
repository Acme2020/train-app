import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DurationInput from '../DurationInput.vue'

describe('DurationInput.vue', () => {
  it('renders correctly with default duration', () => {
    const wrapper = mount(DurationInput, {
      props: {
        duration: 10,
      },
    })

    // Check that component renders
    expect(wrapper.exists()).toBe(true)

    // Check that slider input exists and has correct value
    const slider = wrapper.findComponent({ name: 'v-slider' })
    expect(slider.exists()).toBe(true)
    expect(slider.props('modelValue')).toBe(10)

    // Check label display format
    expect(wrapper.text()).toContain('10 Minuten')
  })

  it('emits update event when value changes', async () => {
    const wrapper = mount(DurationInput, {
      props: {
        duration: 5,
      },
    })

    // Find slider component
    const slider = wrapper.findComponent({ name: 'v-slider' })

    // Trigger update on slider
    await slider.vm.$emit('update:modelValue', 15)

    // Check that component emitted the correct event
    expect(wrapper.emitted('update:duration')).toBeTruthy()
    expect(wrapper.emitted('update:duration')?.[0]).toEqual([15])
  })
})
