declare module "db-vendo-client/p/db/index.js" {
  const profile: any;
  export { profile };
}

declare module "db-vendo-client" {
  export const createClient: (profile: any, userAgent: string) => any;
}
