"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const db = process.env.MONGO_URL || "";
mongoose_1.default
    .connect(db)
    .then(() => console.log("MongoDB Connection Successfull"))
    .catch((err) => console.log(err));
app.use(express_1.default.json());
app.use("/api/users", user_1.default);
app.use("/api/auth", auth_1.default);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
