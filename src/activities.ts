export async function createApprovalRequest(requestId: string): Promise<string> {
    console.log(`Approval request ${requestId} created.`);
    return `========Approval request ${requestId} created.`;
  }
  
  export async function approveRequest(requestId: string): Promise<string> {
    console.log(`Approval request ${requestId} approved.`);
    return `========Approval request ${requestId} approved.`;
  }
  
  export async function rejectRequest(requestId: string): Promise<string> {
    console.log(`Approval request ${requestId} rejected.`);
    return `========Approval request ${requestId} rejected.`;
  }
  
  export async function cancelRequest(requestId: string): Promise<string> {
    console.log(`Approval request ${requestId} canceled.`);
    return `========Approval request ${requestId} canceled.`;
  }
  
  export async function executeTask(requestId: string, task: string): Promise<string> {
    console.log(`Executing callback for request ${requestId}, task ${task}`);
    if (task === 'task2') {
        throw new Error('模拟回调执行失败')
    }
    return `========Callback executed for request ${requestId}, task ${task}.`;
  }