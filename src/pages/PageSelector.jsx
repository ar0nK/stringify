import React from 'react'
import '../style/PageSelector.css';
import { Link } from "react-router";
import guitarbuilderimg from '../img/guitarbuildericon.png'
import webshopimg from '../img/webshopicon.png'

export default function PageSelector() {
  return (
    <div>
      <h1 className='p-3'>Stringify</h1>
      <h2 className='p-3'>Kérjük válaszd ki, melyik oldalt akarod használni.</h2>
      <div className="container text-center">
        <div className='row gap-5'>
          <div className='col bg-light p-4 rounded'>
            <img className="icon-image rounded-3 rounded-bottom-3" src={webshopimg} alt="" />
            <h4>Webshop</h4>
            <h6>Fedezd fel a Webshop gitárkínálatát, ahol a kezdő szettektől a profi hangszerekig, széles választékban gitárokat találsz.</h6>
            <Link to="/store"><button className='btn btn-dark rounded'>Tovább</button></Link>
          </div>
          <div className='col bg-light p-4 rounded'>
            <img className="icon-image rounded-3" src={guitarbuilderimg} alt="" />
            <h4>Gitárépítő</h4>
            <h6>Tervezd meg álomgitárodat a Gitárépítő oldalon: válassz formát, hardvert és elektronikát, és alkoss egyedi hangszert.</h6>
            <Link to="/guitar-builder"><button className='btn btn-dark rounded'>Tovább</button></Link>
          </div>
        </div>
      </div>
    </div>
  )
}