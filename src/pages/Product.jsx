import React from 'react'
import { useParams } from 'react-router-dom'
import guitars from '../temp/guitars.json'
import NavBar from '../components/NavBar'

export default function Product() {
  const { id } = useParams()
  const product = guitars.find(g => g.id.toString() === id)

  if (!product) return <>Product not found</>

  return (
    <div>
      <NavBar/>
      {product.title}<br />
      {product.image && <>{product.image}<br /></>}
      {product.rating} / {product.maxRating}<br />
      {product.description}<br />
      {product.price.toLocaleString('hu-HU')} {product.currency}
    </div>
  )
}
