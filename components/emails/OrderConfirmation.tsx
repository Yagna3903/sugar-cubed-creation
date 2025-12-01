import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationProps {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export const OrderConfirmationEmail = ({
  orderId = "ORD-123",
  customerName = "Valued Customer",
  items = [
    { name: "Holiday Sugar Cookie", quantity: 2, price: 4.25 },
    { name: "Classic Vanilla", quantity: 1, price: 4.0 },
  ],
  total = 12.5,
  // shippingAddress = {
  //     line1: "123 Cookie Lane",
  //     city: "Sweet City",
  //     state: "SC",
  //     postalCode: "12345",
  // },
}: OrderConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Your Sugar Cubed Creations order is confirmed!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Order Confirmed</Heading>
        <Text style={text}>Hi {customerName},</Text>
        <Text style={text}>
          Thank you for your order! We&apos;re getting your cookies ready!
          You&apos;ll receive another email when they ship.
        </Text>

        <Section style={orderSection}>
          <Text style={orderIdText}>Order ID: {orderId}</Text>
          <Hr style={hr} />
          {items.map((item, index) => (
            <div key={index} style={itemRow}>
              <Text style={itemText}>
                {item.quantity}x {item.name}
              </Text>
              <Text style={itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </div>
          ))}
          <Hr style={hr} />
          <div style={totalRow}>
            <Text style={totalText}>Total</Text>
            <Text style={totalPrice}>${total.toFixed(2)}</Text>
          </div>
        </Section>

        <Section style={addressSection}>
          {/* <Heading style={h2}>Shipping to:</Heading> */}
          {/* <Text style={addressText}>
            {shippingAddress.line1}
            <br />
            {shippingAddress.city}, {shippingAddress.state}{" "}
            {shippingAddress.postalCode}
          </Text> */}
        </Section>

        <Text style={footer}>
          Sugar Cubed Creations
          <br />
          Made with love.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const h1 = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#5C4033", // Brand brown
  marginBottom: "24px",
};

const h2 = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#5C4033",
  marginTop: "24px",
  marginBottom: "12px",
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#484848",
};

const orderSection = {
  padding: "24px",
  border: "1px solid #e6e6e6",
  borderRadius: "12px",
  marginTop: "24px",
};

const orderIdText = {
  fontSize: "14px",
  color: "#888888",
  marginBottom: "12px",
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "20px 0",
};

const itemRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

const itemText = {
  fontSize: "16px",
  color: "#484848",
  margin: "0",
};

const itemPrice = {
  fontSize: "16px",
  color: "#484848",
  margin: "0",
  fontWeight: "500",
};

const totalRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "12px",
};

const totalText = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#5C4033",
  margin: "0",
};

const totalPrice = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#5C4033",
  margin: "0",
};

const addressSection = {
  marginTop: "24px",
};

const addressText = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#484848",
};

const footer = {
  fontSize: "12px",
  color: "#888888",
  marginTop: "48px",
  textAlign: "center" as const,
};

export default OrderConfirmationEmail;
