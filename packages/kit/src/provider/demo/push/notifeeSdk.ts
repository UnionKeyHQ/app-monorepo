import notifee from '@notifee/react-native';

import { UNIONKEY_LOGO_ICON_URL } from '@unionkey/shared/src/consts';

import type { IDemoNotificationSdk } from './types';
import type { EventType } from '@notifee/react-native';

notifee.onForegroundEvent((event, ...others) => {
  const type: EventType = event.type;
  console.log('notifee.onForegroundEvent >>> ', event, ...others);
});

notifee.onBackgroundEvent(async (event, ...others) => {
  console.log('notifee.onBackgroundEvent >>> ', event, ...others);
});

const sdk: IDemoNotificationSdk = {
  async init() {
    //
  },
  async showNotification(params) {
    const { title, content, uuid } = params;
    console.log('notifee.displayNotification >>> ', params);
    await notifee.displayNotification({
      id: uuid,
      title,
      subtitle: `${title} -- `,
      body: content,
      data: {
        messageID: uuid,
        title,
        content,
        // ios 的通知横幅点击事件�?jpush 接管了，notifee �?onForegroundEvent �?onBackgroundEvent 都不会触�?
        // 所以参数要放到 extras �?�?JPush.addLocalNotificationListener 接收横幅点击事件
        extras: {
          uuid,
          customName: 'customName',
          customValue: 'customValue',
          customValue2: 'customValue2',
        },
        // notificationEventType // readOnly
      },
      android: {
        channelId: 'default',
        // 设置自定义图片（Android�?待定
        largeIcon: UNIONKEY_LOGO_ICON_URL, // 可以是网络图�?URL 或本地图片路�?
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        // 设置自定义图片（iOS�?working
        attachments: [
          {
            url: UNIONKEY_LOGO_ICON_URL, // 可以是网络图�?URL 或本地图片路�?
          },
        ],
      },
    });
  },
};

export default sdk;
