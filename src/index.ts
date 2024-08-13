import { Elysia } from "elysia";
import admin from "firebase-admin";
import { cors } from "@elysiajs/cors";

const serviceAccount = "serviceAccount.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const checkToken = async (token: string) => {
  return await admin.auth().verifyIdToken(token);
};

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia")
  .onBeforeHandle(({ set, headers }) => {
    const token = headers.authorization;
    if (!token) {
      set.status = 401;
      return {
        message: "No token provided",
      };
    }
    checkToken(token);
    console.log("onBeforeHandle hook");
  })
  .get("/protected", () => {
    return;
  })
  .get("/users", () => {
    return {
      users: [
        { id: 1, name: "John Doe", email: "john.doe@example.com" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
        { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com" },
      ],
    };
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
