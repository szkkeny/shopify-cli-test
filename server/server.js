import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import * as handlers from "./handlers/index";
import axios from "axios";
dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY } = process.env;

const options = {
  page: {
    title: "Warranty information",
    body_html:
      "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>",
    published: false,
  },
};
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      server
    )
  );
  server.keys = [SHOPIFY_API_SECRET];
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [
        "read_content",
        "write_content",
        "write_draft_orders",
        "write_products",
        "write_customers",
      ],

      async afterAuth(ctx) {
        //Auth token and shop available in session
        //Redirect to shop upon auth
        const { shop, accessToken } = ctx.session;
        console.log(accessToken);
        console.log("afterAuth");
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });
        ctx.redirect("/");
      },
    })
  );
  server.use(
    graphQLProxy({
      version: ApiVersion.October19,
    })
  );
  router.get("/api/test", verifyRequest(), async (ctx) => {
    const { shop, accessToken } = ctx.session;
    axios
      .post(`https://${shop}/admin/api/2021-01/pages.json`, options, {
        headers: { "X-Shopify-Access-Token": accessToken },
      })
      .catch((e) => console.log(e));
    ctx.body = accessToken;
  });
  router.get("(.*)", verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
