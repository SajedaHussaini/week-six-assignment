import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: "/week-six-assignment/",
  plugins: [react()],
  // base: "/week-six-assignment"
  // base:"/",

  // this line is located in the package.json in the second line. do not forget this.
  // "homepage": "https://SajedaHussaini.github.io/week-six-assignment",

  // and this two lines are after the line preview in package.son
  // "predeploy": "npm run build",
  //   "deploy": "gh-pages -d dist"
})

