import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "../foundation/firebase-init";

Vue.use(VueRouter);

const routes = [{
    path: "/",
    name: "home",
    component: () =>
      import ("../views/Home.vue"),
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/admin/u/0",
    name: "admin",
    component: () =>
      import ("../views/admin/index.vue"),
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/register",
    name: "register",
    component: () =>
      import ("../views/auth/register.vue"),
    meta: {
      guest: true,
    },
  },

  {
    path: "/login",
    name: "login",
    component: () =>
      import ("../views/auth/login.vue"),
    meta: {
      guest: true,
    },
  },

  {
    path: "/about",
    name: "about",
    component: () =>
      import ("../views/About.vue"),
    meta: {
      guest: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   firebase.auth().onAuthStateChanged((firebaseUser) => {
//     if (!firebaseUser && to.matched.some((record) => record.meta.requiresAuth))
//       next({
//         name: "login",
//       });
//     else if (firebaseUser) {
//       if (to.matched.some((record) => record.meta.guest)) {
//         next(from.fullPath);
//       } else {
//         firebase
//           .firestore()
//           .collection("roles")
//           .doc(firebaseUser.uid)
//           .get()
//           .then((snapshot) => {
//             if (snapshot.data().isAdmin) {
//               next({ name: "admin" });
//             } else {
//               next({ name: "home" });
//             }
//           });
//       }
//     } else {
//       next();
//     }
//     next();
//   });
// });

export default router;