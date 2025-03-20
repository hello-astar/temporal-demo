// @@@SNIPSTART typescript-hello-client
import { Connection, Client } from '@temporalio/client';
import { approvalWorkflow, userApprovalSignal } from './workflows';


export async function run(requestId: string, user: 'user1' | 'user2' | 'user3') {
  // Connect to the default Server location
  const connection = await Connection.connect({ address: 'localhost:7233' });
  // In production, pass options to configure TLS and other settings:
  // {
  //   address: 'foo.bar.tmprl.cloud',
  //   tls: {}
  // }

  const client = new Client({
    connection,
    // namespace: 'foo.bar', // connects to 'default' namespace if not specified
  });

  const handle = await client.workflow.start(approvalWorkflow, {
    taskQueue: 'approval-queue',
    // type inference works! args: [name: string]
    args: [requestId],
    // in practice, use a meaningful business ID, like customerId or transactionId
    workflowId: 'workflow-' + requestId,
  });
  console.log(`Started workflow ${handle.workflowId}`);
  await handle.signal(userApprovalSignal, user, true)

  // optional: wait for client result
  console.log(await handle.result()); // Hello, Temporal!
}
