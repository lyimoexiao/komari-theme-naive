<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { NButton, NDivider, NForm, NFormItem, NInput, NInputOtp } from 'naive-ui'

import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { ApiError, getSharedApi } from '@/utils/api'
import { reconnectAfterLogin } from '@/utils/init'

const appStore = useAppStore()
const api = getSharedApi()

const formRef = ref<FormInst | undefined>()

const form = ref({
  username: '',
  password: '',
})

const loading = ref(false)
const showOtpDialog = ref(false)
const otpCode = ref<string[]>(['', '', '', '', '', ''])
const otpLoading = ref(false)

const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value)

const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: ['blur'] }],
  password: [{ required: true, message: '请输入密码', trigger: ['blur'] }],
})

async function handleLogin() {
  try {
    await formRef.value?.validate()
  }
  catch {
    return
  }

  loading.value = true

  try {
    await api.login(form.value.username, form.value.password)

    // 登录成功，重新连接 WebSocket
    await reconnectAfterLogin()

    window.$message?.success('登录成功')
    window.$modal?.destroyAll()
  }
  catch (error) {
    // 检查是否需要 2FA 验证
    if (error instanceof ApiError) {
      const msg = error.message.toLowerCase()
      if (msg.includes('2fa') || msg.includes('2fa code') || msg.includes('two factor')) {
        showOtpDialog.value = true
        return
      }
    }
    console.error('[LoginDialog] Login error:', error)
    window.$message?.error('登录失败，请检查用户名和密码')
  }
  finally {
    loading.value = false
  }
}

async function handleOtpSubmit() {
  const code = otpCode.value.join('')
  if (code.length < 6) {
    window.$message?.warning('请输入 6 位验证码')
    return
  }

  otpLoading.value = true

  try {
    await api.login(form.value.username, form.value.password, code)

    // 登录成功，重新连接 WebSocket
    await reconnectAfterLogin()

    window.$message?.success('登录成功')
    window.$modal?.destroyAll()
  }
  catch (error) {
    console.error('[LoginDialog] OTP error:', error)
    window.$message?.error('验证码错误，请重试')
    otpCode.value = ['', '', '', '', '', '']
  }
  finally {
    otpLoading.value = false
  }
}

function handleOAuth2Login() {
  location.href = '/api/oauth'
}
</script>

<template>
  <div class="w-full">
    <!-- 登录表单 -->
    <div v-if="!showOtpDialog" class="flex flex-col">
      <NForm ref="formRef" :model="form" :rules="rules" class="w-full">
        <NFormItem label="用户名" path="username">
          <NInput v-model:value="form.username" placeholder="请输入用户名" :disabled="loading" />
        </NFormItem>
        <NFormItem label="密码" path="password">
          <NInput
            v-model:value="form.password"
            type="password"
            placeholder="请输入密码"
            :disabled="loading"
            @keydown.enter="handleLogin"
          />
        </NFormItem>
      </NForm>
      <NButton type="primary" :loading="loading" block @click="handleLogin">
        <template #icon>
          <div class="i-icon-park-outline-login" />
        </template>
        登录
      </NButton>
    </div>

    <!-- OTP 验证表单 -->
    <div v-else class="flex flex-col gap-4 w-full items-center overflow-x-auto">
      <div class="text-center">
        <div class="text-lg font-medium mb-2">
          两步验证
        </div>
        <div class="text-sm text-gray-500">
          请输入验证器中的 6 位数字验证码
        </div>
      </div>
      <NInputOtp
        v-model:value="otpCode"
        :length="6"
        :disabled="otpLoading"
        :allow-input="onlyAllowNumber"
        @keydown.enter="handleOtpSubmit"
      />
      <div class="flex gap-2 w-full">
        <NButton quaternary :disabled="otpLoading" @click="showOtpDialog = false">
          返回
        </NButton>
        <NButton type="primary" class="flex-1" :loading="otpLoading" @click="handleOtpSubmit">
          验证
        </NButton>
      </div>
    </div>

    <template v-if="!showOtpDialog && appStore.publicSettings?.oauth_enable">
      <NDivider />
      <div class="flex flex-col">
        <NButton block @click="handleOAuth2Login">
          <template #icon>
            <div class="i-icon-park-outline-outbound" />
          </template>
          使用 OAuth2 登录
        </NButton>
      </div>
    </template>
  </div>
</template>
