import request from "supertest";
import app from "../src/server.js"; // asegúrate que server.js haga export default app

describe("Pruebas de usuario", () => {
  it("Debe obtener un usuario por ID", async () => {
    const res = await request(app).get("/api/usuario/1");
    expect(res.statusCode).toBe(200);
  });
});