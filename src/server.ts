import Koa from 'koa';
import router from './router';

const app = new Koa();

// 使用路由中间件
app.use(router.routes());
app.use(router.allowedMethods());

// 监听端口
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});