import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: {
//       id: string;
//       roles: number[];
//       iat?: number;
//       exp?: number;
//     };
//   }
// }
