const router = require("express").Router();

const artist = require("../models/artist");

router.post("/save", async (req, res) => {
    const newArtist = artist({
        name: req.body.name,
        imageURL: req.body.imageURL,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
    });
    try {
        const savedArtist = await newArtist.save();
        res.status(200).send({ artist: savedArtist });
    } catch (error) {
        res.status(400).send({ success: false, msg: error });
    }
});

router.get("/getOne/:id", async (req, res) => {

    // return res.json(req.params.id);
    const filter = { _id: req.params.id };

    const cursor = await artist.findOne(filter);

    if (cursor) {
        res.status(200).send({ success: true, data: cursor });
    } else {
        res.status(200).send({ success: true, msg: "Artis tidak ditemukan" });
    }
});

router.get("/getAll", async (req, res) => {
    const options = {
        // sort returned documents in ascending order
        sort: { createdAt: 1 },
        // Include only the following
        // projection : {}
    };

    const cursor = await artist.find(options);
    if (cursor) {
        res.status(200).send({ success: true, data: cursor });
    } else {
        res.status(200).send({ success: true, msg: "Artis tidak ditemukan" });
    }
});

router.put("/update/:id", async (req, res) => {
    const filter = { _id: req.params.id };
    const options = {
        upsert: true,
        new: true,
    };
    try {
        const result = await artist.findOneAndUpdate(
            filter,
            {
                name: req.body.name,
                imageURL: req.body.imageURL,
                twitter: req.body.twitter,
                instagram: req.body.instagram,
            },
            options
        );
        res.status(200).send({ artist: result });
    } catch (error) {
        res.status(400).send({ success: false, msg: error });
    }
});

router.delete("/delete/:id", async (req, res) => {
    const filter = { _id: req.params.id };

    const result = await artist.deleteOne(filter);
    if (result) {
        res.status(200).send({ success: true, msg: "Data Dihapus", data: result });
    } else {
        res.status(200).send({ success: false, msg: "Data tak Ditemukan" });
    }
});


module.exports = router;