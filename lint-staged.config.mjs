const appFiles = [
  "apps/app/**/*.{js,jsx,ts,tsx}",
  "packages/**/*.{js,jsx,ts,tsx}",
];

const dashboardFiles = [
  "apps/dev-dashboard/**/*.{js,jsx,ts,tsx}",
  "packages/**/*.{js,jsx,ts,tsx}",
];

const config = {
  [appFiles.join(",")]: () => "pnpm --filter @atimar/app lint",
  [dashboardFiles.join(",")]: () => "pnpm --filter @atimar/dev-dashboard lint",
};

export default config;
