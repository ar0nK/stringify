import React from 'react'
import { Link } from "react-router";
import guitarbuilderimg from '../img/guitarbuildericon.png'
import webshopimg from '../img/webshopicon.png'

export default function PageSelector() {
  return (
    <div className="px-2 bg-white text-dark" style={{ minHeight: '100vh' }}>
      <h1 className='p-3 text-center text-dark' style={{ fontSize: 'clamp(2rem, 10vw, 4.5rem)' }}>Stringify</h1>
      <h2 className='p-3 text-center text-dark' style={{ fontSize: 'clamp(1.25rem, 5vw, 2.5rem)' }}>Kérjük válaszd ki, melyik oldalt akarod használni.</h2>
      <div className="container text-center">
        <div className='row row-cols-1 row-cols-md-2 g-4'>
          <div className='col'>
            <div className='bg-light text-dark p-4 rounded h-100' style={{ backgroundColor: '#f8f9fa' }}>
              <img className="icon-image rounded-3" src={webshopimg} alt="" />
              <h4 className='text-dark'>Webshop</h4>
              <h6 className='text-dark'>Fedezd fel a Webshop gitárkínálatát, ahol a kezdő szettektől a profi hangszerekig, széles választékban gitárokat találsz.</h6>
              <Link to="/store"><button style={{fontFamily: 'Inter'}} className='btn btn-dark rounded mt-2'>Tovább</button></Link>
            </div>
          </div>
          <div className='col'>
            <div className='bg-light text-dark p-4 rounded h-100' style={{ backgroundColor: '#f8f9fa' }}>
              <img className="icon-image rounded-3" src={guitarbuilderimg} alt="" />
              <h4 className='text-dark'>Gitárépítő</h4>
              <h6 className='text-dark'>Tervezd meg álomgitárodat a Gitárépítő oldalon: válassz formát, hardvert és elektronikát, és alkoss egyedi hangszert.</h6>
              <Link to="/guitar-builder"><button style={{fontFamily: 'Inter'}} className='btn btn-dark rounded mt-2'>Tovább</button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}