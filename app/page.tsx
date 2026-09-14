import { redirect } from "next/navigation"

// The landing page is preserved at /landing but disabled as the entry point.
// The app now opens directly into the application (the demo acts as the app).
export default function Home() {
  redirect("/demo")
}
