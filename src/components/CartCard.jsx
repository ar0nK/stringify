
const CartCard = ({
    id,
    productId,
    image,
    title,
    price,
    quantity,
    isAvailable
}) => {
  const formatPrice = (price) => price.toLocaleString('hu-HU');
  
  return (
    <div>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{formatPrice(price)} Ft</p>
      <p>Mennyiség: {quantity}</p>
      <p>{isAvailable ? 'Elérhető' : 'Nem elérhető'}</p>
      <p>Összesen: {formatPrice(price * quantity)} Ft</p>
    </div>
  )
}

export default CartCard;