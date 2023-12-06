import { bookingModel } from '../models/bookingModel.js';
import { activityModel } from '../models/activityModel.js';

const activityController = {
    createActivity: async (req, res) => {
        const {note, capacity} = req.body;
        // get user id from jwt
        // const userId = req.user.id;
        const userId = 1;
        const {bookingId} = req.params;
        const isActivity = true;
        try {
            await bookingModel.updateBookingById(bookingId, isActivity, note, capacity);
            const activityRecord = await activityModel.createActivity(userId, bookingId);
            res.status(200).json({
                msg: "Activity created successfully.",
                data: {
                    activityRecord
                }
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({
                msg: "Failed to create activity."
            });
        }
    },
    getActivities: async (req, res) => {
        const {startDate, endDate} = req.body;
        const activities = await activityModel.getActivities(startDate, endDate);
        const data = []
        for (const activity of activities) {
            data.push({
                "sport": activity.sport,
                "date": activity.date.toISOString().split('T')[0],
                "count": activity._count.id,
            })
        }
        res.status(200).json({
            msg: "Get activities summary successfully.",
            data
        });
    },
    getActivitiesByUserId: async (req, res) => {
        // const {userId} = req.user.id;
        const userId = 1;
        const activities = await activityModel.getActivitiesByUserId(userId);
        const records = []
        for (const activity of activities) {
            const booking = await bookingModel.getBookingById(activity.bookingId);
            records.push({
                "id": activity.bookingId,
                "date": activity.belongs.date.toISOString().split('T')[0],
                "startHour": activity.belongs.startHour,
                "endHour": activity.belongs.endHour,
                "stadium": booking.stadiumAt.name,
                "court": booking.courtId,
                "maker": booking.maker.username,
                "capacity": booking.capacity,
                "note": booking.note,
                "participants": booking.activitiesRecords.map(record => record.userId)
            })
        }
        res.status(200).json({
            msg: "Get activities by user id successfully.",
            data: {
                activities: records
            }
        });
    },
    getActivitiesBySportAndDate: async (req, res) => {
        const {sport, date} = req.params;
        const activities = await activityModel.getActivitiesBySportAndDate(sport, date);
        console.log(activities)
        const records = []
        for (const activity of activities) {
            records.push({
                "id": activity.id,
                "date": activity.date.toISOString().split('T')[0],
                "startHour": activity.startHour,
                "endHour": activity.endHour,
                "stadium": activity.stadiumAt.name,
                "court": activity.courtId,
                "maker": activity.maker.username,
                "capacity": activity.capacity,
                "note": activity.note,
                "participants": activity.activitiesRecords.map(record => record.userId)
            })
        }
        res.status(200).json({
            msg: "Get activities by sport and date successfully.",
            data: {
                sport,
                activities: records
            }
        });
    },
    deleteActivityById: async (req, res) => {
        const {id} = req.params;
        const activityRecord = await activityModel.deleteActivityById(id);
        res.status(200).json({
            msg: "Activity deleted successfully.",
            data: {
                activityRecord
            }
        });
    },
    joinActivity: async (req, res) => {
        const userId = req.user.id;
        const bookingId = req.params;
        try {
            const activityRecord = await activityModel.joinActivity(userId, bookingId);
            res.status(200).json({
                msg: "Activity joined successfully.",
                data: {
                    activityRecord
                }
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                msg: "Failed to join activity."
            });
        }
    },
    leaveActivity: async (req, res) => {
        // TODO: user validation
        const userId = req.user.id;
        const bookingId= req.params;
        const activityRecord = await activityModel.leaveActivity(userId, activityId);
        res.status(200).json({
            msg: "Activity left successfully.",
            data: {
                activityRecord
            }
        });
    }
}
export default activityController;