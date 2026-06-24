import { Link } from "react-router-dom";
import {
  Offcanvas,
  Card,
  Form,
  Alert,
  Button,
} from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import { cartCopy } from "../../data/copy.js";
import { formatPrice } from "../../utils/cartHelpers";
import CartItemRow from "./CartItemRow";
import { useCartCheckout } from "./useCartCheckout";

export default function CartDrawer() {
  const {
    items,
    updateQuantity,
    setItemQuantity,
    removeFromCart,
    clearCart,
    totalBill,
    isCartOpen,
    closeCart,
  } = useCart();

  const {
    checkout,
    handleChange,
    phoneInvalid,
    canPlaceOrder,
    submitting,
    errorMessage,
    handlePlaceOrder,
    phoneError,
    idPrefix,
  } = useCartCheckout({ onOrderSuccess: closeCart, idPrefix: "drawer" });

  const itemLabel = items.length === 1 ? cartCopy.item : cartCopy.items;

  return (
    <Offcanvas show={isCartOpen} onHide={closeCart} placement="end" scroll={false}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{cartCopy.title}</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        {items.length === 0 ? (
          <div className="text-center py-4">
            <div className="fs-1 mb-3" aria-hidden="true">🛒</div>
            <h3 className="h5">{cartCopy.emptyTitle}</h3>
            <p className="text-muted mb-4">{cartCopy.emptyDesc}</p>
            <Button
              as={Link}
              to={{ pathname: "/", hash: "#products" }}
              variant="primary"
              size="sm"
              onClick={closeCart}
            >
              {cartCopy.shopProducts}
            </Button>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onUpdate={(delta) => updateQuantity(item.productId, delta)}
                onSetQuantity={(value) => setItemQuantity(item.productId, value)}
                onRemove={() => removeFromCart(item.productId)}
              />
            ))}

            <Card className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    {cartCopy.subtotal} ({items.length} {itemLabel})
                  </span>
                  <span>{formatPrice(totalBill)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>{cartCopy.delivery}</span>
                  <span>{cartCopy.deliveryPending}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold border-top pt-2 mt-2">
                  <span>{cartCopy.totalBill}</span>
                  <span className="text-success">{formatPrice(totalBill)}</span>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Card.Title as="h3" className="h6 mb-3">{cartCopy.checkoutTitle}</Card.Title>

                {errorMessage && (
                  <Alert variant="danger" className="mb-3">{errorMessage}</Alert>
                )}

                <Form onSubmit={handlePlaceOrder}>
                  <Form.Group className="mb-3" controlId={`${idPrefix}-name`}>
                    <Form.Label>{cartCopy.fullName}</Form.Label>
                    <Form.Control
                      name="fullName"
                      type="text"
                      required
                      placeholder={cartCopy.fullNamePlaceholder}
                      value={checkout.fullName}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId={`${idPrefix}-phone`}>
                    <Form.Label>{cartCopy.phone}</Form.Label>
                    <Form.Control
                      name="phone"
                      type="tel"
                      required
                      placeholder={cartCopy.phonePlaceholder}
                      value={checkout.phone}
                      onChange={handleChange}
                      disabled={submitting}
                      inputMode="tel"
                      autoComplete="tel"
                      isInvalid={phoneInvalid}
                    />
                    {phoneInvalid && (
                      <Form.Control.Feedback type="invalid">{phoneError}</Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3" controlId={`${idPrefix}-address`}>
                    <Form.Label>{cartCopy.address}</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="address"
                      required
                      rows={3}
                      placeholder={cartCopy.addressPlaceholder}
                      value={checkout.address}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button
                      type="submit"
                      variant="success"
                      disabled={!canPlaceOrder}
                    >
                      {submitting ? cartCopy.saving : cartCopy.placeOrder}
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={clearCart}
                      disabled={submitting}
                    >
                      {cartCopy.clearCart}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}