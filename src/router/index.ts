import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from "@/components/Layout.vue";
import Blank from "@/components/Blank.vue";
import NotFound from "@/components/NotFound.vue";

import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Account from "@/views/Account.vue";
import About from "@/views/About.vue";
import Chat from "@/views/Chat.vue";
import List from "@/views/List.vue";

import Terms from "@/views/Docs/Terms.vue";
import Privacy from "@/views/Docs/Privacy.vue";

const routeChildren: Array<RouteRecordRaw> = [
  {
    path: "",
    component: Home,
  },
  {
    path: "about",
    component: About,
  },
  {
    path: "login",
    component: Login,
  },
  {
    path: "account",
    component: Account,
  },
  {
    path: "chats/:chatId",
    component: Chat,
  },
  {
    path: "list",
    component: List,
  },
  {
    path: "terms",
    component: Terms,
  },
  {
    path: "privacy",
    component: Privacy,
  },
];

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/:lang",
        component: Blank,
        children: routeChildren,
      },
      {
        path: "",
        component: Blank,
        children: routeChildren,
      },
    ],
  },
  {
    path: "/:page(.*)",
    name: "NotFoundPage",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
