import Route from '@ioc:Adonis/Core/Route';
import HealthCheck from '@ioc:Adonis/Core/HealthCheck';

import './users';
import './tasks';

Route.get('/', async () => {
  return { greetings: 'Welcome to TaskIt API!' };
}).prefix('/v1');

Route.get('/health', async ({ response }) => {
  const report = await HealthCheck.getReport();
  return report.healthy ? response.ok(report) : response.badRequest(report);
});
