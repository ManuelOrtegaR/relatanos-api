import jwt from "jsonwebtoken";
import { config } from "../../config.ts";
import { ReqWithResult, SignInToken } from "../../types.ts";
import { NextFunction, Response } from "express";

const { token } = config;
const { secret, expires } = token;

export const signToken = (payload: SignInToken, expiresIn = expires) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

export const auth = (req: ReqWithResult, res: Response, next: NextFunction) => {
  let token = req.headers.authorization || "";
  if (token.startsWith("Bearer")) {
    token = token.substring(7);
  }
  if (!token) {
    return next({
      message: "Forbidden",
      status: 403,
    });
  }

  jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      return next({
        message: "Forbidden",
        status: 403,
      });
    }

    if (!decoded) {
      return next({
        message: "Forbidden",
        status: 403,
      });
    }

    req.decoded = decoded as Record<string, string>;
    next();
  });
};

export const verifyToken = (payload: string) => {
  return jwt.verify(payload, secret, function (err, decoded) {
    if (err) {
      return false;
    }
    return decoded;
  });
};

// export const owner = (req, res, next) => {
//   const { decoded = {}, data = {} } = req;
//   const { idType: ownerId, userType } = decoded;
//   const { id_empresa: idEmpresa } = data;

//   if (userType === "Administrador") {
//     return next();
//   }

//   if (ownerId !== idEmpresa) {
//     return next({
//       message: "Prohibido",
//       status: 403,
//     });
//   }

//   next();
// };
