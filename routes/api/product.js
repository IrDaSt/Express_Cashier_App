const express = require("express");
const productServiceApi = require("../../services/api/product.services");
const authMiddleware = require("../../middlewares/auth");
const upload = require("../../middlewares/multer");
const responses = require("../../utilities/responses.utils");

const productRouterApi = express.Router();

/**
 * This is an example on how to implement mysql query with promise
 */

// GET all books data
productRouterApi.get("/", async (req, res, next) => {
    try {
        // GET all books data
        const books = await productServiceApi.getAll();
        responses.Success(res, books);
    } catch (error) {
        return responses.InternalServerErrorCatch(res, error);
    }
});

// GET book data by id
productRouterApi.get("/:id", async (req, res, next) => {
    try {
        const book = await productServiceApi.getById(req.params.id);
        if (!book.length) {
            return responses.InternalServerError(res, {
                message: "Not Found",
            });
        }
        responses.Success(res, book);
    } catch (error) {
        return responses.InternalServerErrorCatch(res, error);
    }
});

// POST create new book
productRouterApi.post(
    "/",
    upload.array(),
    // authMiddleware.verifyToken,
    async (req, res, next) => {
        const { nama_produk, id_kategori } = req.body;
        try {
            const result_insert = await productServiceApi.create({
                nama_produk: nama_produk,
                id_kategori: id_kategori
            });
            if (!result_insert.affectedRows) {
                return responses.InternalServerError(res, {
                    message: "Insert failed",
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
productRouterApi.put(
    "/:id",
    upload.array(),
    // authMiddleware.verifyToken,
    async (req, res, next) => {
        const id_produk = req.params.id;
        const { nama_produk, id_kategori } = req.body;
        try {
            const result_edit = await productServiceApi.update({
                id_produk,
                nama_produk,
                id_kategori
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
productRouterApi.delete(
    "/:id",
    authMiddleware.verifyToken,
    async (req, res, next) => {
        const id_book = req.params.id;
        try {
            const result_delete = await productServiceApi.remove(id_book);
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

module.exports = productRouterApi;
