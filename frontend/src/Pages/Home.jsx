import React from 'react'

import LatestGrid from '../components/latest/LatestGrid'
import AdBanner from '../components/ads/AdBanner'
import CategoryList from '../components/categories/CategoryList'

const Home = () => {
  return (
    <div>

      <LatestGrid/>
      <CategoryList/>   
    <AdBanner/>
    </div>
  )
}

export default Home
