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
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000; // Set a default port if PORT is not provided
const db = process.env.MONGO_URL || "";
mongoose_1.default.set("strictQuery", false);
mongoose_1.default
    .connect(db)
    .then(() => console.log("MongoDB Connection Successful"))
    .catch((err) => console.error("MongoDB Connection Error:", err));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/users", user_1.default);
app.use("/api/auth", auth_1.default);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
