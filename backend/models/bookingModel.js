import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

const bookingModel = {
    getBookingsByUserId: async (userId) => {
        const bookings = await prisma.bookingRecord.findMany({
            where: {
                userId: parseInt(userId)
            },
            orderBy: [
                {
                    date: 'desc'
                }
            ]
        });
        return bookings;
    },
    getBookingById: async (id) => {
        const booking = await prisma.bookingRecord.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                maker: true,
                activitiesRecords: true,
                stadiumAt: true,
            }
        });
        return booking;
    },
    getBookingBySportAndDates: async (sport, startDate, endDate) => {
        const bookings = await prisma.bookingRecord.findMany({
            where: {
                sport: sport.toUpperCase(),
                date: {
                    lte: new Date(endDate),
                    gte: new Date(startDate),
                }
            }
        });
        return bookings;
    },
    getBookingByStadiumAndDate: async (stadiumId, date) => {
        const bookings = await prisma.bookingRecord.findMany({
            where: {
                stadiumId: parseInt(stadiumId),
                date: new Date(date)
            },
            orderBy: [
                {
                    courtId: 'asc',
                },
                {
                    startHour: 'asc'
                }
            ],
        });
        return bookings;
    },
    createBooking: async (userId, vendorId, stadiumId, courtId, sport, bookingDate, startHour, endHour) => {
        const booking = await prisma.bookingRecord.create({
            data: {
                userId,
                vendorId,
                stadiumId,
                courtId,
                sport,
                date: new Date(bookingDate),
                startHour,
                endHour
            },
        });
        return booking;
    },
    deleteBookingById: async (id) => {
        const booking = await prisma.bookingRecord.delete({
            where: {
                id: parseInt(id),
            },
        });
        return booking;
    }, 
    updateBookingById: async (id, isActivity, note, capacity) => {
        const booking = await prisma.bookingRecord.update({
            where: {
                id: parseInt(id),
            },
            data: {
                isActivity,
                note,
                capacity
            },
        });
        return booking;
    },
    joinActivity: async (userId, activityId) => {
        const activityRecord = await prisma.activityRecord.create({
            data: {
                bookingId: parseInt(activityId),
                userId: parseInt(userId),
            },
        });
        return activityRecord;
    }
}

export { bookingModel };