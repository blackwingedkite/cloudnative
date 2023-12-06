import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

const activityModel = {
    createActivity: async (userId, bookingId) => {
        const activity = await prisma.activityRecord.create({
            data: {
                userId: parseInt(userId),
                bookingId: parseInt(bookingId),
            },
        });
        return activity;
    },
    getActivities: async (startDate, endDate) => {
        const activities = await prisma.bookingRecord.groupBy({
            by: ['sport', 'date'],
            _count: {
                id: true,
            },
            where: {
                date: {
                    lte: new Date(endDate),
                    gte: new Date(startDate),
                },
                isActivity: {
                    equals: true
                }
            }
        });
        return activities;
    },
    getActivitiesByUserId: async (userId) => {
        const activities = await prisma.activityRecord.findMany({
            where: {
                userId: parseInt(userId)
            },
            include: {
                belongs: true
            }
        });
        return activities;
    },
    getActivitiesBySportAndDate: async (sport, date) => {
        const activities = await prisma.bookingRecord.findMany({
            where: {
                sport: sport.toUpperCase(),
                date: new Date(date),
                isActivity: true
            },
            include: {
                maker: true,
                activitiesRecords: true,
                stadiumAt: true
            }
        });
        return activities;
    },
    deleteActivityById: async (id) => {
        const activity = await prisma.activityRecord.delete({
            where: {
                id: parseInt(id),
            },
        });
        return activity;
    },
    joinActivity: async (userId, bookingId) => {
        const activityRecord = await prisma.activityRecord.create({
            data: {
                id: parseInt(bookingId),
                userId: parseInt(userId),
            },
        });
        return activityRecord;
    },
    leaveActivity: async (userId, bookingId) => {
        const activityRecord = await prisma.activityRecord.delete({
            where: {
                id: parseInt(bookingId),
                userId: parseInt(userId),
            },
        });
        return activityRecord;
    }
}

export { activityModel };