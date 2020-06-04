import express from "express";

import knex from "./database/connection";

const Routes = express.Router();

Routes.get("/items", async (request, response) => {
  const items = await knex("items").select("*");

  const serializedItems = items.map((item) => {
    return {
      title: item.title,
      image_url: `http://localhost:3333/uploads/${item.image}`,
    };
  });

  return response.json(serializedItems);
});

Routes.post("/points", async (request, response) => {
  const {
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
    items,
  } = request.body;

  const trx = await knex.transaction();

  const ids = await trx("points").insert({
    image: "image-fake",
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
  });

  const pointItems = items.map((item_id: number) => {
    return {
      item_id,
      point_id: ids[0],
    };
  });

  await trx("points_items").insert(pointItems);

  return response.json({ success: true });
});

export default Routes;
