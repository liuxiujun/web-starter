<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance, FormRules } from 'element-plus'
import type { UserFormData, UserItem } from '@/types/user'

const { t } = useI18n()

interface Props {
  visible: boolean
  initialData?: Partial<UserItem> | null
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  initialData: null,
})

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'submit', data: UserFormData): void
}>()

// 表单 DOM 实例引用（用于触发 validate / resetFields）
const formRef = ref<FormInstance>()
const isEdit = computed(() => Boolean(props.initialData?.id))

// 初始默认值
const defaultForm: UserFormData = {
  username: '',
  email: '',
  role: 'viewer',
  status: 'active',
}

// 表单响应式数据
const formData = reactive<UserFormData>({ ...defaultForm })

// 强类型校验规则：响应式动态切换多语言
const rules = computed<FormRules<UserFormData>>(() => ({
  username: [
    { required: true, message: t('user.rules.usernameRequired'), trigger: 'blur' },
    { min: 3, max: 20, message: t('user.rules.usernameLength'), trigger: 'blur' },
  ],
  email: [
    { required: true, message: t('user.rules.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('user.rules.emailInvalid'), trigger: 'blur' },
  ],
  role: [
    { required: true, message: t('user.rules.roleRequired'), trigger: 'change' },
  ],
  status: [
    { required: true, message: t('user.rules.statusRequired'), trigger: 'change' },
  ],
}))

// 监听弹窗显示状态
watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.initialData?.id) {
        // 关键防御：必须浅拷贝，断开对象引用，杜绝在弹窗输入时反向污染表格行数据
        Object.assign(formData, {
          username: props.initialData.username || '',
          email: props.initialData.email || '',
          role: props.initialData.role || 'viewer',
          status: props.initialData.status || 'active',
        })
      } else {
        Object.assign(formData, defaultForm)
      }
      // 等待 DOM 挂载完毕后清空历史校验红色提示
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }
  }
)

const handleClose = () => {
  emit('update:visible', false)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  // 执行表单校验，相当于后端的 @Valid 拦截
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  // 抛出干净的数据副本
  emit('submit', { ...formData })
  handleClose()
}
</script>

<template>
  <el-dialog
    :model-value="props.visible"
    :title="isEdit ? t('user.editUser') : t('user.createUser')"
    width="500px"
    destroy-on-close
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="110px"
      status-icon
    >
      <el-form-item :label="t('user.username')" prop="username">
        <el-input v-model="formData.username" :placeholder="t('user.rules.usernameRequired')" />
      </el-form-item>

      <el-form-item :label="t('user.email')" prop="email">
        <el-input v-model="formData.email" placeholder="example@domain.com" />
      </el-form-item>

      <el-form-item :label="t('user.role')" prop="role">
        <el-select v-model="formData.role" style="width: 100%">
          <el-option :label="t('role.admin')" value="admin" />
          <el-option :label="t('role.editor')" value="editor" />
          <el-option :label="t('role.viewer')" value="viewer" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('user.status')" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio value="active">{{ t('status.active') }}</el-radio>
          <el-radio value="inactive">{{ t('status.inactive') }}</el-radio>
          <el-radio value="pending">{{ t('status.pending') }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ t('common.confirm') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
