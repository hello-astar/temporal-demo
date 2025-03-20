import Router from '@koa/router';
import { Connection, Client } from '@temporalio/client';
import { approvalWorkflow, cancelRequestSignal, userApprovalSignal } from './workflows';
import { nanoid } from 'nanoid';

const router = new Router();

// 创建一个唯一的 requestId 用于标识工作流实例
const requestId = 'approvalId-' + nanoid();

// 启动工作流
router.get('/start-approval', async (ctx) => {
  const connection = await Connection.connect();
  const client = new Client({ connection });

  // 启动工作流
  await client.workflow.start(approvalWorkflow, {
    taskQueue: 'approval-queue',
    args: [requestId],
    workflowId: requestId, // 使用 requestId 作为 workflowId
  });

  ctx.body = `Approval workflow started with ID: ${requestId}`;
});

// 定义路由以发送信号
router.get('/approval/:userId', async (ctx) => {
  const { userId } = ctx.params;
  const approved = true; // 假设从请求中获取审批结果

  const connection = await Connection.connect();
  const client = new Client({ connection });

  // 获取工作流句柄
  const handle = client.workflow.getHandle(requestId);

  // 发送信号
  await handle.signal(userApprovalSignal, userId, approved);

  ctx.body = `Signal sent for ${userId} with approval: ${approved}`;
});

router.get('/cancel', async (ctx) => {
    const connection = await Connection.connect();
    const client = new Client({ connection });
  
    // 获取工作流句柄
    const handle = client.workflow.getHandle(requestId);
  
    // 发送信号
    await handle.signal(cancelRequestSignal);
  
    ctx.body = `Signal sent with cancel`;
  });

export default router;