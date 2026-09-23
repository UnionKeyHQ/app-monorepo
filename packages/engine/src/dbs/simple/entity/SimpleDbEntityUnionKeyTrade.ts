import type {
  IUnionKeyAssistAgentGrant,
  IUnionKeyAssistExecutionReceipt,
  IUnionKeyAssistTask,
} from '@unionkeyhq/shared/types/unionkey/trade';

import { SimpleDbEntityBase } from './SimpleDbEntityBase';

const MAX_ASSIST_TASKS = 50;
const MAX_EXECUTION_RECEIPTS = 500;

export interface IUnionKeyTradeData {
  assistTasks: IUnionKeyAssistTask[];
  agentGrants?: IUnionKeyAssistAgentGrant[];
  executionReceipts?: IUnionKeyAssistExecutionReceipt[];
}

export class SimpleDbEntityUnionKeyTrade extends SimpleDbEntityBase<IUnionKeyTradeData> {
  entityName = 'unionKeyTrade';

  readonly enableCache = false;

  async getAssistTasks() {
    const data = await this.getRawData();
    return data?.assistTasks ?? [];
  }

  async upsertAssistTask(task: IUnionKeyAssistTask) {
    const data = await this.getRawData();
    await this.setRawData({
      ...data,
      assistTasks: [
        task,
        ...(data?.assistTasks ?? []).filter((item) => item.id !== task.id),
      ].slice(0, MAX_ASSIST_TASKS),
    });
    return task;
  }

  async deleteAssistTask(taskId: string) {
    const data = await this.getRawData();
    await this.setRawData({
      ...data,
      assistTasks: (data?.assistTasks ?? []).filter(
        (task) => task.id !== taskId,
      ),
    });
  }

  async getExecutionReceipts() {
    const data = await this.getRawData();
    return data?.executionReceipts ?? [];
  }

  async appendExecutionReceipt(receipt: IUnionKeyAssistExecutionReceipt) {
    const data = await this.getRawData();
    await this.setRawData({
      ...data,
      assistTasks: data?.assistTasks ?? [],
      executionReceipts: [
        receipt,
        ...(data?.executionReceipts ?? []).filter(
          (item) => item.id !== receipt.id,
        ),
      ].slice(0, MAX_EXECUTION_RECEIPTS),
    });
    return receipt;
  }

  async getAgentGrants() {
    const data = await this.getRawData();
    return data?.agentGrants ?? [];
  }

  async upsertAgentGrant(grant: IUnionKeyAssistAgentGrant) {
    const data = await this.getRawData();
    await this.setRawData({
      ...data,
      assistTasks: data?.assistTasks ?? [],
      agentGrants: [
        grant,
        ...(data?.agentGrants ?? []).filter(
          (item) => item.accountAddress !== grant.accountAddress,
        ),
      ],
    });
    return grant;
  }
}
