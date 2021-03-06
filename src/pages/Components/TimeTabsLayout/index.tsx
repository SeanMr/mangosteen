import { defineComponent, PropType, reactive, ref } from 'vue';
import { Overlay } from 'vant';
import { Time } from '@/utils/time';
import { MainLayout } from '@/components/MainLayout';
import { Tabs } from '@/components/Tabs';
import { Tab } from '@/components/Tabs/Tab';
import { Form } from '@/components/Form';
import { FormItem } from '@/components/Form/Components/FormItem';
import styles from './index.module.scss';

const demo = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
      required: true,
    },
    endDate: {
      type: String as PropType<string>,
      required: true,
    },
  },
});

export const TimeTabsLayout = defineComponent({
  props: {
    component: {
      type: Object as PropType<typeof demo>,
      required: true,
    },
  },
  setup: (props, context) => {
    const refSelected = ref('本月');
    const refOverlayVisible = ref(false);
    const time = new Time();
    const customTime = reactive({
      start: new Time().format(),
      end: new Time().format(),
    });
    const timeList = [
      {
        start: time.firstDayOfMonth(),
        end: time.lastDayOfMonth(),
      },
      {
        start: time.add(-1, 'month').firstDayOfMonth(),
        end: time.add(-1, 'month').lastDayOfMonth(),
      },
      {
        start: time.firstDayOfYear(),
        end: time.lastDayOfYear(),
      },
    ];
    const onSubmitCustomTime = (e: Event) => {
      e.preventDefault();
      refOverlayVisible.value = false;
    };

    return () => (
      <MainLayout title="山竹记账" icon="menu">
        {{
          default: () => (
            <>
              <Tabs
                classPrefix={'customTabs'}
                v-model:selected={refSelected.value}
                onUpdate:selected={(value) => {
                  if (value === '自定义时间') {
                    refOverlayVisible.value = true;
                  }
                }}
              >
                <Tab name="本月">
                  <props.component
                    startDate={timeList[0].start.format()}
                    endDate={timeList[0].end.format()}
                  />
                </Tab>
                <Tab name="上月">
                  <props.component
                    startDate={timeList[1].start.format()}
                    endDate={timeList[1].end.format()}
                  />
                </Tab>
                <Tab name="今年">
                  <props.component
                    startDate={timeList[2].start.format()}
                    endDate={timeList[2].end.format()}
                  />
                </Tab>
                <Tab name="自定义时间">
                  <props.component startDate={customTime.start} endDate={customTime.end} />
                </Tab>
              </Tabs>

              <Overlay show={refOverlayVisible.value} class={styles.overlay}>
                <div class={styles.overlay_inner}>
                  <header>请选择时间</header>
                  <main>
                    <Form formData={customTime} onSubmit={onSubmitCustomTime}>
                      <FormItem label="开始时间" prop="start" type="date" />
                      <FormItem label="结束时间" prop="end" type="date" />
                      <FormItem>
                        <div class={styles.actions}>
                          <button
                            type="button"
                            onClick={() => {
                              refOverlayVisible.value = false;
                            }}
                          >
                            取消
                          </button>
                          <button type="submit" onClick={onSubmitCustomTime}>
                            确认
                          </button>
                        </div>
                      </FormItem>
                    </Form>
                  </main>
                </div>
              </Overlay>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});
