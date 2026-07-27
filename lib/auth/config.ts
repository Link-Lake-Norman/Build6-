export const authConfig = {

  session: {
    strategy: "database",
  },

  providers: [
    "student",
    "employer",
    "partner",
    "admin",
  ],

};
