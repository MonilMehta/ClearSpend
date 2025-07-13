import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type User = Awaited<ReturnType<typeof prisma.user.findUnique>>;
export type IUser = NonNullable<User>;

// Export a default object for backward compatibility if needed
export default {
    // You can add utility methods here if needed
};
