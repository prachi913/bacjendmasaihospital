const express = require("express");
const { appointmentModel } = require("../Models/appointmentModel");

const appointmentRouter = express.Router();

// post
appointmentRouter.post("/appointments", async (req, res) => {
    try {
        // const { name, image, specialization, experience, location, slots, fee } = req.body;
        const date = new Date();

        const appointment = new appointmentModel({ ...req.body, date });

        await appointment.save();
        res.json({ message: "Appointment created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get
appointmentRouter.get("/", async (req, res) => {
    const { specialization, name, sort } = req.query;
    try {
        let search = {};
        let sorting = {};

        if (sort == "asc") {
            sorting.date = 1;
        }
        else if (sort == "desc") {
            sorting.date = -1;
        }
        else {
            sorting = null;
        }
        if (name) {
            search.name = name;
        }
        if (name) {
            search.name = { $regex: name, $options: "i" };
        }
        if (specialization) {
            search.specialization = specialization; 
        }
      
        const appointments = await appointmentModel.find(search).sort(sorting);
        res.json(appointments);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// update
appointmentRouter.patch("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDetails = req.body;
        await appointmentModel.findByIdAndUpdate(id, updatedDetails);
        res.json({ message: "Appointment updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete 
appointmentRouter.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await appointmentModel.findByIdAndDelete(id);
        res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    appointmentRouter,
};
