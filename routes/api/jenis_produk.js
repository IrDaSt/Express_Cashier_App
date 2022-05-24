const express = require("express");
const jenis_produk_ServiceApi = require("../../services/api/jenis_produk.services");
const authMiddleware = require("../../middlewares/auth");
const upload = require("../../middlewares/multer");
const responses = require("../../utilities/responses.utils");
const { validationResult } = require("express-validator");
const jenis_produk_RouterApi = express.Router();
const fsUtils = require("../../utilities/fs.utils");
const mysqlconn = require("../../utilities/mysql.utils");
const idGeneratorUtils = require("../../utilities/id-generator.utils");
const moment = require('moment')
const path = require('path');
const { generateUUIDV4 } = require("../../utilities/id-generator.utils");

// GET all jenis_produk
jenis_produk_RouterApi.get("/", async (req, res, next) => {
    try {
        // GET all jenis_produk data
        const all_jenis_produk = await jenis_produk_ServiceApi.getAll();
        responses.Success(res, all_jenis_produk);
    } catch (error) {
        return responses.InternalServerErrorCatch(res, error);
    }
});

// GET book data by id
jenis_produk_RouterApi.get("/:id", async (req, res, next) => {
    try {
        const jenis_produk = await jenis_produk_ServiceApi.getById(req.params.id);
        if (!jenis_produk.length) {
            return responses.InternalServerError(res, {
                message: "Not Found",
            });
        }
        responses.Success(res, jenis_produk);
    } catch (error) {
        return responses.InternalServerErrorCatch(res, error);
    }
});

jenis_produk_RouterApi.post(
    "/",
    upload.array(),
    // authMiddleware.verifyToken,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responses.BadRequest(res, errors.array());
        }
        const { id_produk, nama_jenis_produk, jumlah_produk, harga_produk } = req.body;
        try {
            let result_insert_jenis_produk;
            const last_jenis_produk_data = await jenis_produk_ServiceApi.getLastData();
            if (last_jenis_produk_data.length === 0) {
                result_insert_jenis_produk = await jenis_produk_ServiceApi.create({
                    id_produk: id_produk,
                    nama_jenis_produk: nama_jenis_produk,
                    jumlah_produk: jumlah_produk,
                    harga_produk: harga_produk,
                });
            } else {
                result_insert_jenis_produk = await jenis_produk_ServiceApi.create({
                    id_jenis_produk: idGeneratorUtils.nextId({
                        id_lama: last_jenis_produk_data[0].id_jenis_produk,
                        prefix_length: 6,
                    }),
                    id_produk: id_produk,
                    nama_jenis_produk: nama_jenis_produk,
                    jumlah_produk: jumlah_produk,
                    harga_produk: harga_produk,
                });
            }
            responses.Created(res, {
                message: "Insert success",
            });
        } catch (error) {
            return responses.InternalServerErrorCatch(res, error);
        }
    }
);

// PUT update book
jenis_produk_RouterApi.put(
    "/:id",
    upload.array(),
    // authMiddleware.verifyToken,
    async (req, res, next) => {
        const id_jenis_produk = req.params.id;
        const { nama_jenis_produk, jumlah_produk, harga_produk } = req.body;
        try {
            const result_edit = await jenis_produk_ServiceApi.update({
                id_jenis_produk,
                nama_jenis_produk,
                jumlah_produk,
                harga_produk
            });
            if (!result_edit.affectedRows) {
                return responses.InternalServerError(res, {
                    message: "Update failed",
                });
            }
            responses.Success(res, {
                message: "Update success",
            });
        } catch (error) {
            return responses.InternalServerErrorCatch(res, error);
        }
    }
);

// DELETE book by id
jenis_produk_RouterApi.delete(
    "/:id",
    // authMiddleware.verifyToken,
    async (req, res, next) => {
        const id_jenis_produk = req.params.id;
        try {
            const result_delete = await jenis_produk_ServiceApi.remove(id_jenis_produk);
            if (!result_delete.affectedRows) {
                return responses.InternalServerError(res, {
                    message: "Delete failed",
                });
            }
            responses.Success(res, {
                message: "Delete success",
            });
        } catch (error) {
            return responses.InternalServerErrorCatch(res, error);
        }
    }
);

module.exports = jenis_produk_RouterApi;
