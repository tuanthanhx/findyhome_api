import express, { Router } from 'express';
import config from './config/config';

import userRoute from './modules/user/user.routes';
// import productRoute from "./modules/product/product.routes";

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoutes: IRoute[] = [
  { path: '/users', route: userRoute },
  // { path: "/products", route: productRoute },
];

const devIRoutes: IRoute[] = [];

defaultIRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  devIRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
