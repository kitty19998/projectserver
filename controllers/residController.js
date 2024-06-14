import asyncHandler from 'express-async-handler'

import { prisma } from "../config/prismaConfig.js"

export const createResidency = asyncHandler(async (req, res) => {
    const { title, description, price, address, country, city, facilities, image, userEmail } = req.body.data

    console.log(req.body.data)
    try {
        const residency = await prisma.residency.create({
            data: {
                title,
                description,
                price,                
                address,
                country,
                city,
                facilities,
                image,
                owner: { connect: { email: userEmail } },
            },
        });
        res.send({ message: "Residency created successfully", residency })
    } catch (err) {
        if (err.code === "p2002") {
            throw new Error("A residency with address already exists")
        }
        throw new Error(err.message)     // discription
    }
});

// Function to get all the residencies
// export const getAllResidencies = asyncHandler(async (req, res) => {
//     // const residencies = await prisma.residency.findMany({
//     //     orderBy: {
//     //         createdAt: "desc",
//     //     },
//     // });
//     res.send(1)
// })
export const getAllResidencies = asyncHandler(async (req, res) => {
    // Assuming you want to send all residencies from your database
    const residencies = await prisma.residency.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    res.json(residencies); // Sending JSON response with all residencies
});

//function to geta aspecfic documnet residency
export const getAllResidency = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try{
        const residency  = await prisma.residency.findUnique({
            where: {id}
        })
        res.send(residency)
    }catch(err){
        throw new Error(err.message);
    }
})