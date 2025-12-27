const { z } = require("zod");

exports.registerSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});

exports.loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});
