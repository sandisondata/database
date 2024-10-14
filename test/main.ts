import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Debug, MessageType } from 'node-debug';
import { Database } from '../dist';

describe('main', (suiteContext) => {
  Debug.initialize(true);
  let debug: Debug;
  before(async () => {});
  it('repository', async (testContext) => {
    debug = new Debug(`${suiteContext.name}.test.${testContext.name}`);
    debug.write(MessageType.Entry);
    debug.write(MessageType.Step, 'Establishing database connectivity...');
    const database = Database.getInstance({ repositoryNumber: 1 });
    debug.write(MessageType.Step, 'Verifying database connection...');
    debug.write(
      MessageType.Value,
      `QueryResult.rows=${JSON.stringify((await database.query('SELECT current_database()')).rows)}`,
    );
    debug.write(MessageType.Step, 'Shutting down database connection...');
    await database.shutdown();
    debug.write(MessageType.Exit);
    assert.ok(true);
  });
  after(async () => {});
});
