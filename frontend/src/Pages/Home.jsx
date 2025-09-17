import React from 'react'
import Footer from '../components/Navbar/Footer/Footer'
import Navbar from '../components/Navbar/Navbar'
import LatestGrid from '../components/latest/LatestGrid'
import AdBanner from '../components/ads/AdBanner'
import CategoryList from '../components/categories/CategoryList'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <LatestGrid/>
      <CategoryList/>   
    <AdBanner/>
      <Footer/>
    </div>
  )
}

export default Home
