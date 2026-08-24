import accountUtils from '@unionkeyhq/shared/src/utils/accountUtils';

import { AirGapUR } from './AirGapUR';

import type { IAirGapUrJson } from './AirGapUR';

export type IUnionKeyRequestDeviceQRData = {
  requestId: string;
  xfp: string;
  deviceId?: string;
  origin: string;
  method: string;
  params: any;
};
export class UnionKeyRequestDeviceQR {
  constructor(props: IUnionKeyRequestDeviceQRData) {
    const xfp = accountUtils.getShortXfp({ xfp: props.xfp });
    this.data = {
      ...props,
      xfp,
    };
  }

  data: IUnionKeyRequestDeviceQRData;

  type = 'onekey-app-call-device';

  toUR(): AirGapUR {
    const cbor = Buffer.from(JSON.stringify(this.data), 'utf-8');
    return new AirGapUR(cbor, this.type);
  }

  static fromCBOR(cbor: Buffer | Uint8Array): UnionKeyRequestDeviceQR {
    const data = JSON.parse(Buffer.from(cbor).toString('utf-8'));
    return new UnionKeyRequestDeviceQR(data);
  }

  static fromUR(ur: IAirGapUrJson | AirGapUR): UnionKeyRequestDeviceQR {
    const cbor = ur instanceof AirGapUR ? ur.cbor : Buffer.from(ur.cbor, 'hex');
    return UnionKeyRequestDeviceQR.fromCBOR(cbor);
  }
}
