import express from "express";
import Album from "../../models/Album/Album";
import Artist from "../../models/Artist/Artist";
import mongoose from 'mongoose';
import auth, {RequestWithUser} from "../../middleware/auth";
import permit from "../../middleware/permit";
import {imagesUpload} from "../../multer";

const albumRouter = express.Router();

interface Query {
    artist?: string;
}

albumRouter.get('/', auth, async (req, res) => {
    try {
        const expressReq = req as RequestWithUser;
        const user = expressReq.user;

        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { artist } = req.query as Query;
        let query: { artist?: mongoose.Types.ObjectId, isPublished?: boolean } = { isPublished: true };

        if (user.role === 'admin') {
            query = {};
        } else if (user.role === 'user') {
            query.isPublished = true;
        }

        if (artist) {
            const artistDoc = await Artist.findOne({ name: artist });
            if (artistDoc) {
                query.artist = artistDoc._id;
            } else {
                res.status(404).json({ error: 'Artist not found' });
                return;
            }
        }

        const albums = await Album.find(query)
            .populate('artist')
            .sort({ year: -1 });

        res.json(albums);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching albums'});
    }
});


albumRouter.get('/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id).populate('artist');

        if (!album) {
            res.status(404).json({ error: 'Album not found' });
        }

        res.json(album);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching album' });
    }
});

albumRouter.post('/new_album', auth, imagesUpload.single('coverImage'), async (req, res) => {
    const expressReq = req as RequestWithUser;
    const user = expressReq.user;

    if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }

    try {
        const { name, artist, releaseYear } = req.body;

        if (!name || !artist || !releaseYear) {
            res.status(400).json({ error: "Name, artist, and release year are required" });
            return;
        }

        const newAlbum = new Album({
            name,
            artist,
            releaseYear,
            coverImage: req.file ? '/images' + req.file.filename : null,
        });
        await newAlbum.save();

        res.status(201).json(newAlbum);
    } catch (error) {
        res.status(500).json({ error: 'Error creating album' });
    }
});

albumRouter.delete('/:id', auth, permit('admin'), async (req, res) => {
    const expressReq = req as RequestWithUser;
    const user = expressReq.user;

    if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }

    try {
        const albumId = req.params.id;

        const album = await Album.findByIdAndDelete(albumId);

        if (!album) {
            res.status(404).json({ error: 'Album not found' });
            return;
        }

        res.status(200).json({ message: 'Album deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting album' });
    }
});

albumRouter.patch('/:id/togglePublished', auth, permit('admin'), async (req, res) => {
    try {
        const albumId = req.params.id;
        const album = await Album.findById(albumId);

        if (!album) {
            res.status(404).json({ error: 'Album not found' });
            return;
        }

        album.isPublished = !album.isPublished;
        await album.save();

        res.status(200).json({ message: `Album ${album.isPublished ? 'true' : 'false'}`, album });
    } catch (error) {
        res.status(500).json({ error: 'Error toggling album publication' });
    }
});

export default albumRouter;
