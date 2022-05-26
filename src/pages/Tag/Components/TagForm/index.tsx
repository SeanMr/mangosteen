import { defineComponent, reactive, ref } from 'vue';
import { Rules } from '@/api/types/form';
import { Button } from '@/components/Button';
import { EmojiList } from '@/components/EmojiList';
import form from '@/components/Form';
import formItem from '@/components/Form/Components/FormItem';
import { MainLayout } from '@/components/MainLayout';
import { validate } from '@/utils/validateForm';
import { useRoute } from 'vue-router';
import styles from './index.module.scss';

type tagPageType = 'show' | 'edit';

export const TagForm = defineComponent({
  setup: (props, context) => {
    const tagPageType: tagPageType = useRoute().params.type as tagPageType;
    const tagName = useRoute().query.tagName as string;
    const tagSign = useRoute().query.tagSign as string;

    const formData = reactive({
      name: tagName || '',
      sign: tagSign || '',
    });

    const rules: Rules<typeof formData>[] = [
      { key: 'name', type: 'required', message: '必填' },
      { key: 'name', type: 'pattern', regex: /^.{1,4}$/, message: '只能填1到4个字符' },
      { key: 'sign', type: 'required', message: '必填' },
    ];

    const Form = form<typeof formData>();
    const FormItem = formItem<{ [k in keyof typeof formData]?: string[] }>();

    return () => (
      <MainLayout title="新建标签" icon="back">
        <Form formData={formData} rules={rules}>
          <FormItem label="标签名" prop="name" />
          <FormItem label={`符号 ${formData.sign}`} prop="sign">
            {{
              default: () => <EmojiList v-model={formData.sign} />,
            }}
          </FormItem>
          <p class={styles.tips}>记账时长按标签即可进行编辑</p>
          <FormItem>
            {{
              default: () => <button class={[styles.form_item, styles.button]}>提交</button>,
            }}
          </FormItem>
        </Form>

        {tagPageType === 'edit' ? (
          <div class={styles.actions}>
            <Button level="danger" class={styles.removeTags} onClick={() => {}}>
              删除标签
            </Button>
            <Button level="danger" class={styles.removeTagsAndItems} onClick={() => {}}>
              删除标签和记账
            </Button>
          </div>
        ) : null}
      </MainLayout>
    );
  },
});