import { backgroundMethod } from '@onekeyhq/shared/src/background/backgroundDecorators';
import type {
  IUnionKeyAssistAgentGrant,
  IUnionKeyAssistExecutionReceipt,
  IUnionKeyAssistTask,
} from '@onekeyhq/shared/types/unionkey/trade';

import { SimpleDbEntityBase } from '../base/SimpleDbEntityBase';

const MAX_ASSIST_TASKS = 50;
const MAX_EXECUTION_RECEIPTS = 500;

export interface IUnionKeyTradeData {
  assistTasks: IUnionKeyAssistTask[];
  agentGrants?: IUnionKeyAssistAgentGrant[];
  executionReceipts?: IUnionKeyAssistExecutionReceipt[];
}

export class SimpleDbEntityUnionKeyTrade extends SimpleDbEntityBase<IUnionKeyTradeData> {
  entityName = 'unionKeyTrade';

  override enableCache = false;

  @backgroundMethod()
  async getAssistTasks() {
    const data = await this.getRawData();
    return data?.assistTasks ?? [];
  }

  @backgroundMethod()
  async upsertAssistTask(task: IUnionKeyAssistTask) {
    await this.setRawData((data) => {
      const tasks = data?.assistTasks ?? [];
      const nextTasks = [
        task,
        ...tasks.filter((item) => item.id !== task.id),
      ].slice(0, MAX_ASSIST_TASKS);
      return {
        ...data,
        assistTasks: nextTasks,
      };
    });
    return task;
  }

  @backgroundMethod()
  async deleteAssistTask(taskId: string) {
    await this.setRawData((data) => ({
      ...data,
      assistTasks: (data?.assistTasks ?? []).filter(
        (task) => task.id !== taskId,
      ),
    }));
  }

  @backgroundMethod()
  async getExecutionReceipts() {
    const data = await this.getRawData();
    return data?.executionReceipts ?? [];
  }

  @backgroundMethod()
  async appendExecutionReceipt(receipt: IUnionKeyAssistExecutionReceipt) {
    await this.setRawData((data) => ({
      ...data,
      assistTasks: data?.assistTasks ?? [],
      executionReceipts: [
        receipt,
        ...(data?.executionReceipts ?? []).filter(
          (item) => item.id !== receipt.id,
        ),
      ].slice(0, MAX_EXECUTION_RECEIPTS),
    }));
    return receipt;
  }

  @backgroundMethod()
  async getAgentGrants() {
    const data = await this.getRawData();
    return data?.agentGrants ?? [];
  }

  @backgroundMethod()
  async upsertAgentGrant(grant: IUnionKeyAssistAgentGrant) {
    await this.setRawData((data) => ({
      ...data,
      assistTasks: data?.assistTasks ?? [],
      agentGrants: [
        grant,
        ...(data?.agentGrants ?? []).filter(
          (item) => item.accountAddress !== grant.accountAddress,
        ),
      ],
    }));
    return grant;
  }
}
