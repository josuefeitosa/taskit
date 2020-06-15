/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.get('/', () => ({ greeting: 'Welcome to TaskIt API!' })).prefix('v1').as('index');

require('./users');
require('./tasks');
require('./sessions');
