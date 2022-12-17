const router = require("express").Router();

const user = require("../models/user");
const song = require("../models/song");

const admin = require("../config/firebase.config");

router.get("/login", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(500).send({ message: "Invalid Token" });
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodeValue = await admin.auth().verifyIdToken(token);
        if (!decodeValue) {
            return res.status(500).json({ message: "Un Authorize" });
        } else {

            // => cek ketersediaan user <=

            const userExists = await user.findOne({ "user_id": decodeValue.user_id });
            if (!userExists) {
                newUserData(decodeValue, req, res);
                // return res.send("buat user baru")
            } else {
                updateUserData(decodeValue, req, res);
                // return res.send("update user lama")
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
});

const newUserData = async (decodeValue, req, res) => {
    const newUser = new user({
        name: decodeValue.name,
        email: decodeValue.email,
        imageURL: decodeValue.picture,
        user_id: decodeValue.user_id,
        email_verfied: decodeValue.email_verified,
        role: "member",
        auth_time: decodeValue.auth_time,
    });
    try {
        const savedUser = await newUser.save();
        res.status(200).send({ user: savedUser });
    } catch (err) {
        res.status(400).send({ success: false, msg: err });
    }
};

const updateUserData = async (decodeValue, req, res) => {
    const filter = { user_id: decodeValue.user_id };
    const options = {
        upsert: true,
        new: true,
    };

    try {
        const result = await user.findOneAndUpdate(
            filter,
            { auth_time: decodeValue.auth_time },
            options
        );
        res.status(200).send({ user: result });
    } catch (err) {
        res.status(400).send({ success: false, msg: err });
    }
};

router.get("/getUsers", async (req, res) => {
    const options = {
        sort: { createdAt: 1 },
    };

    const data = await user.find(options);
    if (data) {
        res.status(200).send({ success: true, data: data });
    } else {
        res.status(400).send({ success: false, msg: "Tidak ada user ditemukan" });
    }
});

router.get("/getUser/:userId", async (req, res) => {
    const filter = { _id: req.params.userId };

    const userExists = await user.findOne({ _id: filter });
    if (!userExists)
        return res.status(400).send({ success: false, msg: "Invalid User ID" });
    if (userExists.favourites) {
        res.status(200).send({ success: true, data: userExists });
    } else {
        res.status(200).send({ success: false, data: null });
    }
});

router.put("/updateRole/:userId", async (req, res) => {
    // console.log(req.body.data.role, req.params.userId);
    const filter = { _id: req.params.userId };
    const role = req.body.data.role;

    const options = {
        upsert: true,
        new: true,
    };

    try {
        const result = await user.findOneAndUpdate(filter, { role: role }, options);
        res.status(200).send({ user: result });
    } catch (err) {
        res.status(400).send({ success: false, msg: err });
    }
});

router.delete("/delete/:userId", async (req, res) => {
    const filter = { _id: req.params.userId };

    const result = await user.deleteOne(filter);
    if (result.deletedCount === 1) {
        res.status(200).send({ success: true, msg: "Data Dihapus" });
    } else {
        res.status(400).send({ success: false, msg: "Data tidak ditemukan" });
    }
});

router.put("/favourites/:userId", async (req, res) => {
    const filter = { _id: req.params.userId };
    const songId = req.query;

    try {
        console.log(filter, songId);
        const result = await user.updateOne(filter, {
            $push: { favourites: songId },
        });
        res.status(200).send({ success: true, msg: "Song added to favourites" });
    } catch (error) {
        res.status(400).send({ success: false, msg: error });
    }
});

router.put("/removeFavourites/:userId", async (req, res) => {
    const filter = { _id: req.params.userId };
    const songId = req.query;

    try {
        console.log(filter, songId);
        const result = await user.updateOne(filter, {
            $pull: { favourites: songId },
        });
        res
            .status(200)
            .send({ success: true, msg: "Song removed from favourites" });
    } catch (error) {
        res.status(400).send({ success: false, msg: error });
    }
});



module.exports = router;