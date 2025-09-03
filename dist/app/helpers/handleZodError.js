"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types"
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerZodError = void 0;
const handlerZodError = (err) => {
    const errorSources = [];
    err.issues.forEach((issue) => {
        const pathString = issue.path.length > 1
            ? issue.path.join(" inside ")
            : issue.path[0];
        errorSources.push({
            path: pathString,
            message: issue.message
        });
    });
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources
    };
};
exports.handlerZodError = handlerZodError;
