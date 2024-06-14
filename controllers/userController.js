import asyncHandler from 'express-async-handler'
import { prisma } from "../config/prismaConfig.js"
export const createUser = asyncHandler(async (req, res) => {
    console.log("creating a user");

    let { email } = req.body;
    const userExists = await prisma.user.findUnique({ where: { email: email } });
    if (!userExists) {
        const user = await prisma.user.create({ data: req.body });
        res.send({
            message: "user registered successfully",
            user: user,
        });
    } else res.sendStatus(201).send({ message: "User Already Exist OR Registered" })
});

//function to book a visit to residency
// // Define a function to handle booking visits
export const bookVisit = asyncHandler(async (req, res) => {
    // Destructure email and date from the request body
    const { email, date } = req.body;
    // Destructure id from the request parameters
    const { id } = req.params;

    try {
        // Check if the user has already booked visits
        const alreadyBooked = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true },
        });

        // Check if the residency is already booked by the user
        if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
            res.sendStatus(400).json({ message: "This residency is already booked by you" });
        } else {
            // Update the user's booked visits with the new visit
            await prisma.user.update({
                where: { email: email },
                data: {
                    bookedVisits: { push: { id, date } }
                }
            });

            // Send success message if the visit is booked successfully
            res.send("Your visit is booked successfully");
        }
    } catch (err) {
        // Handle errors and throw a new error with the error message
        throw new Error(err.message);
    }
});

//function to get all the bookings of a user

export const getAllBookings = asyncHandler(async (req, res) => {
    const { email } = req.body
    try {
        const bookings = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true }
        })
        res.sendStatus(200).send(bookings)
    } catch (err) {
        throw new Error(err.message);
    }
})

//function to delete or cancel the bookings

export const cancelBooking = asyncHandler(async (req, res) => {
    const { email } = req.body
    const { id } = req.params
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            select: { bookedVisits: true }
        })

        const index = user.bookedVisits.findIndex((visit) => visit.id === id)

        if (index === -1) {
            res.sendStatus(404).json({ message: "Booking Not Found" })
        } else {
            user.bookedVisits.splice(index, 1)
            await prisma.user.update({
                where: { email },
                data: {
                    bookedVisits: user.bookedVisits
                }
            })
            res.send("Booking cancelled Successfully")
        }

    } catch (err) {
        throw new Error(err.message);
    }
})

//fintion to add a residency in favorite list of a user

export const toFav = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { rid } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (user.favResidenciesid.includes(rid)) { //condition to check user fav residencies
            const updateUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesid: {
                        set: user.favResidenciesid.filter((id) => id !== rid)
                    }
                }
            });
            res.send({ message: "Removed From favorites", user: updateUser })
        } else {
            const updateUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesid: {
                        push: rid
                    }
                }
            })
            res.send({ message: "Updated Favorites", user: updateUser })
        }
    } catch (err) {
        throw new Error(err.message);
    }
})

//function to get all fav from a user
export const getAllFavorites = asyncHandler(async (req, res) => {
    const { email } = req.body
    try {
        const favResd = await prisma.user.findUnique({
            where: { email },
            select: { favResidenciesid: true }
        })
        res.sendStatus(200).send(favResd)
    } catch (err) {
        throw new Error(err.message);
    }
})