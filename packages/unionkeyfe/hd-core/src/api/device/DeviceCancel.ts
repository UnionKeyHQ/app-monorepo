import { Cancel } from '@unionkeyfe/hd-transport';
import { BaseMethod } from '../BaseMethod';

export default class DeviceCancel extends BaseMethod<Cancel> {
  init() {
    this.useDevicePassphraseState = false;
  }

  async run() {
    const res = await this.device.commands.typedCall('Cancel', 'Success');

    return Promise.resolve(res.message);
  }
}
