// @@@SNIPSTART typescript-hello-workflow
import { proxyActivities, defineSignal, setHandler, condition } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const { approveRequest, rejectRequest, cancelRequest, executeCallback } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

// 定义信号，用于接收用户审批结果
export const userApprovalSignal = defineSignal<['user1' | 'user2' | 'user3', boolean]>('userApprovalSignal');
// 定义信号，用于接收撤销请求
export const cancelRequestSignal = defineSignal<[]>('cancelRequestSignal');


/** A workflow that simply calls an activity */
export async function approvalWorkflow(requestId: string): Promise<string> {
  // 初始化用户审批状态
  const approvals: Record<'user1' | 'user2' | 'user3', boolean> = {
    user1: false,
    user2: false,
    user3: false,
  };
  let isCancelled = false;

  // 设置信号处理器
  setHandler(userApprovalSignal, (userId: 'user1' | 'user2' | 'user3', approved: boolean) => {
    approvals[userId] = approved;
  });

    // 设置信号处理器以处理撤销请求
    setHandler(cancelRequestSignal, () => {
        isCancelled = true;
    });

  // 等待所有用户审批
  await condition(() => approvals.user1 && approvals.user2 && approvals.user3 || isCancelled);

    // 检查是否接收到撤销请求
    if (isCancelled) {
        const result = await cancelRequest(requestId);
        return result;
    } 

  // 检查所有用户是否都审批通过
  if (approvals.user1 && approvals.user2 && approvals.user3) {
    const result = await approveRequest(requestId);
    await executeCallback(requestId);
    return result;
  } else {
    return await rejectRequest(requestId);
  }
}
// @@@SNIPEND
