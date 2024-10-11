import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import jwt from "jsonwebtoken";
import typeDefs from "./schema.js";
import resolvers from "./resolver.js";

let SECRET_KEY = "ansonwong";
let token = jwt.sign({}, SECRET_KEY);

//middleware
const auth = (req) => {
  const tokenString = req.headers.authorization || "";

  if (tokenString.startsWith("Bearer ")) {
    const token = tokenString.split(" ")[1];
    console.log("token ", token);
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      console.log(decoded);
      return decoded;
    } catch (err) {
      console.error("Token verification failed:", err);
      throw new Error("Unauthorized");
    }
  } else {
    throw new Error("Authorization header missing or invalid");
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: ({ req }) => {
    if (req && req.headers && req.headers.authorization) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const currentTime = `${hours}:${minutes}:${seconds}`;
      console.log(currentTime, "\nCheck auth ", req.headers.authorization);

      const user = auth(req);
      req.body = {};
      return { user };
    } else {
      throw new Error("Authorization header missing!!");
    }
  },
});

console.log(`🚀  Server ready at: ${url}`);
console.log("token ", token);
