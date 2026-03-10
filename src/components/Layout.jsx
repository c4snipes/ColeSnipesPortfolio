import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import ScrollProgress from './ScrollProgress'

export default function Layout() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <Outlet />
      <Footer />
    </>
  )
}
