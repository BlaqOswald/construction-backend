"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUuidParam = exports.validateDto = void 0;
// src/middleware/validate.ts
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const validateDto = (dtoClass) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const dto = (0, class_transformer_1.plainToInstance)(dtoClass, req.body);
        const errors = yield (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            const messages = errors
                .map((e) => Object.values(e.constraints || {}))
                .flat();
            return res
                .status(400)
                .json({ message: "Validation failed", errors: messages });
        }
        next();
    });
};
exports.validateDto = validateDto;
const validateUuidParam = (paramName) => {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return (req, res, next) => {
        const value = req.params[paramName];
        if (typeof value !== "string" || !uuidPattern.test(value)) {
            return res.status(400).json({ message: `${paramName} must be a valid UUID` });
        }
        next();
    };
};
exports.validateUuidParam = validateUuidParam;
