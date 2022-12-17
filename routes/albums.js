const album = require("../models/album");

const router = require("express").Router();

router.get("/getAll", async (req, res) => {
    const options = {
        // sort returned documents in ascending order
        sort: { createdAt: 1 },
        // Include only the following
        // projection : {}
    };

    const cursor = await album.find(options);
    if (cursor) {
        res.status(200).send({ success: true, data: cursor });
    } else {
        res.status(200).send({ success: true, msg: "Tidak ada data Album" });
    }
});

router.get("/getOne/:id", async (req, res) => {
    const filter = { _id: req.params.id };

    const cursor = await album.findOne(filter);
    console.log(cursor);
    if (cursor) {
        res.status(200).send({ success: true, data: cursor });
    } else {
        res.status(200).send({ success: true, msg: "Tidak ada data Album" });
    }
});

router.post("/save", async (req, res) => {
    const newAlbum = album({
        name: req.body.name,
        imageURL: req.body.imageURL,
    });
    try {
        const savedAlbum = await newAlbum.save();
        res.status(200).send({ album: savedAlbum });
    } catch (error) {
        res.status(400).send({ success: false, msg: error });
    }
});

router.put("/update/:id", async (req, res) => {
    const filter = { _id: req.params.id };
    const options = {
        upsert: true,
        new: true,
    };
    try {
        const result = await album.findOneAndUpdate(
            filter,
            {
                name: req.body.name,
                imageURL: req.body.imageURL,
            },
            options
        );
        res.status(200).send({ album: result });
    } catch (error) {
        res.status(400).send({ success: false, msg: error });
    }
});

router.delete("/delete/:id", async (req, res) => {
    const filter = { _id: req.params.id };

    const result = await album.deleteOne(filter);
    if (result.deletedCount === 1) {
        res.status(200).send({ success: true, msg: "Album dihapus" });
    } else {
        res.status(200).send({ success: false, msg: "Album tak ditemukan" });
    }
});

module.exports = router;