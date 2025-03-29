import React from 'react'
import TopSellers from './TopSellers'
import Banner from './Banner'
import Recommended from './Recommended'
import News from './News'


const Home = () => {
  return (
    <>
      <Banner/>
      <TopSellers/>
      <Recommended/>
      <News/>
      
    </>
  )
}

export default Home
