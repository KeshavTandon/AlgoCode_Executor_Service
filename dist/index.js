"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serverConfig_1 = __importDefault(require("./config/serverConfig"));
const app = (0, express_1.default)();
app.listen(serverConfig_1.default.PORT, () => {
    console.log(`Server started at PORT: ${serverConfig_1.default.PORT}`);
});
