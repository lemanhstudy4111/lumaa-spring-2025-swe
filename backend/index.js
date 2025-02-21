import express from "express";
import dotenv from "dotenv";

export const app = express();
const dotenv = dotenv.config();
const port = process.env.EXPRESS_PORT || 3000;
