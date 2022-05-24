const express = require("express");
const kategoriServiceApi = require("../../services/api/kategori.services");
const authMiddleware = require("../../middlewares/auth");
const upload = require("../../middlewares/multer");
const responses = require("../../utilities/responses.utils");
const { validationResult } = require("express-validator");
const kategoriRouterApi = express.Router();
const fsUtils = require("../../utilities/fs.utils");
const mysqlconn = require("../../utilities/mysql.utils");
const idGeneratorUtils = require("../../utilities/id-generator.utils");
const moment = require('moment')
const path = require('path');
const { generateUUIDV4 } = require("../../utilities/id-generator.utils");

// GET all books data
kategoriRouterApi.get("/", async (req, res, next) => {
    try {
        // GET all books data
        const all_kategori = await kategoriServiceApi.getAll();
        responses.Success(res, all_kategori);
    } catch (error) {
        return responses.InternalServerErrorCatch(res, error);
    }
});

// GET book data by User
kategoriRouterApi.get("/user/:id", async (req, res, next) => {
    try {
        const kategori_user = await kategoriServiceApi.getAllbyUser(req.params.id);
        if (!kategori_user.length) {
            return responses.InternalServerError(res, {
                message: "Not Found",
            });
        }
        responses.Success(res, kategori_user);
    } catch (error) {
        return responses.InternalServerErrorCatch(res, error);
    }
});

// GET book data by id
kategoriRouterApi.get("/:id", async (req, res, next) => {
    try {
        const kategori = await kategoriServiceApi.getById(req.params.id);
        if (!kategori.length) {
            return responses.InternalServerError(res, {
                message: "Not Found",
            });
        }
        responses.Success(res, kategori);
    } catch (error) {
        return responses.InternalServerErrorCatch(res, error);
    }
});

// GET Detail Produk by Kategori
kategoriRouterApi.get("/detail/:id", async (req, res, next) => {
    try {
        const detail_kategori_produk = await kategoriServiceApi.getProductByKategori(req.params.id);
        if (!detail_kategori_produk.length) {
            return responses.InternalServerError(res, {
                message: "Not Found",
            });
        }
        responses.Success(res, detail_kategori_produk[0]);
    } catch (error) {
        return responses.InternalServerErrorCatch(res, error);
    }
});

kategoriRouterApi.post(
    "/",
    upload.array(),
    authMiddleware.verifyToken,
    async (req, res, next) => {
        const { nama_kategori, id_user } = req.body;
        try {
            const last_kategori_data = await kategoriServiceApi.getLastData();
            if (last_kategori_data.length === 0) {
                const result_insert_kategori = await kategoriServiceApi.create({
                    nama_kategori: nama_kategori,
                    id_user: id_user,
                });
                return responses.Success(res, result_insert_kategori);
            } else {
                const result_insert_kategori = await kategoriServiceApi.create({
                    id_kategori: idGeneratorUtils.nextId({
                        id_lama: last_kategori_data[0].id_kategori,
                        prefix_length: 6,
                    }),
                    nama_kategori: nama_kategori,
                    id_user: id_user
                });
                return responses.Success(res, result_insert_kategori);
            }
        } catch (error) {
            return responses.InternalServerErrorCatch(res, error);
        }
    }
);

// PUT update book
kategoriRouterApi.put(
    "/:id",
    upload.array(),
    authMiddleware.verifyToken,
    async (req, res, next) => {
        const id_kategori = req.params.id;
        const { nama_kategori } = req.body;
        try {
            const result_edit = await kategoriServiceApi.update({
                id_kategori,
                nama_kategori,
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
kategoriRouterApi.delete(
    "/:id",
    authMiddleware.verifyToken,
    async (req, res, next) => {
        const id_kategori = req.params.id;
        try {
            const result_delete = await kategoriServiceApi.remove(id_kategori);
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

module.exports = kategoriRouterApi;
