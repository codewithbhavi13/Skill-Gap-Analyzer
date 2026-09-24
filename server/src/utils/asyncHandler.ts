import { RequestHandler } from "express";

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    void Promise.resolve(handler(req, res, next)).catch(next);
  };
};

export default asyncHandler;