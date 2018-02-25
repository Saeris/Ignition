import { Header, Footer } from "@components/structural"

export const Main = ({ id, children }) => (
  <main id={id}>
    <Header />
    {children}
    <Footer />
  </main>
)
