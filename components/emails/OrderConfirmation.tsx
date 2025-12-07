import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string | null;
}

interface OrderConfirmationProps {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  orderUrl?: string;
  shippingAddress?: {
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
    {
      name: "Holiday Sugar Cookie",
      quantity: 2,
      price: 4.25,
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      name: "Classic Vanilla",
      quantity: 1,
      price: 4.0,
      imageUrl: "https://via.placeholder.com/150",
    },
  ],
  total = 12.5,
  orderUrl = "https://sugar-cubed-creation.vercel.app",
}: OrderConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Your Sugar Cubed Creations order is confirmed!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img
            src="https://sugar-cubed-creations.vercel.app/images/Main-Cookie.png"
            width="120"
            alt="Sugar Cubed Creations"
            style={logo}
          />
        </Section>
        <Heading style={h1}>Order Confirmed</Heading>
        <Text style={text}>Hi {customerName},</Text>
        <Text style={text}>
          Thank you for your order! We&apos;re getting your cookies ready!
        </Text>

        <Section style={orderSection}>
          <Text style={orderIdText}>Order ID: {orderId}</Text>
          <Hr style={hr} />
          {items.map((item, index) => (
            <div key={index} style={itemRow}>
              <div style={itemImageContainer}>
                {item.imageUrl && (
                  <Img
                    src={item.imageUrl}
                    alt={item.name}
                    width="64"
                    height="64"
                    style={itemImage}
                  />
                )}
              </div>
              <div style={itemDetails}>
                <Text style={itemText}>
                  {item.quantity}x {item.name}
                </Text>
                <Text style={itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </div>
            </div>
          ))}
          <Hr style={hr} />
          <div style={totalRow}>
            <Text style={totalText}>Total</Text>
            <Text style={totalPrice}>${total.toFixed(2)}</Text>
          </div>
        </Section>

        <Section style={btnSection}>
          <Button style={btn} href={orderUrl}>
            View Your Order
          </Button>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            Sugar Cubed Creations
            <br />
            Made with love.
          </Text>
          <div style={socialLinks}>
            <Link
              href="https://www.instagram.com/sugarcubedcreationscanada/?hl=en"
              style={socialLink}
            >
              Follow us on Instagram
            </Link>
          </div>
        </Section>
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

const logoSection = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logo = {
  margin: "0 auto",
};

const h1 = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#5C4033", // Brand brown
  marginBottom: "24px",
  textAlign: "center" as const,
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#484848",
  textAlign: "center" as const,
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
  marginBottom: "16px",
  alignItems: "center",
};

const itemImageContainer = {
  marginRight: "16px",
};

const itemImage = {
  borderRadius: "8px",
  objectFit: "cover" as const,
};

const itemDetails = {
  flex: 1,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const itemText = {
  fontSize: "16px",
  color: "#484848",
  margin: "0",
  fontWeight: "500",
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

const btnSection = {
  textAlign: "center" as const,
  marginTop: "32px",
};

const btn = {
  backgroundColor: "#5C4033",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const footer = {
  marginTop: "48px",
  textAlign: "center" as const,
  borderTop: "1px solid #e6e6e6",
  paddingTop: "24px",
};

const footerText = {
  fontSize: "12px",
  color: "#888888",
  marginBottom: "12px",
};

const socialLinks = {
  display: "flex",
  justifyContent: "center",
  gap: "16px",
};

const socialLink = {
  fontSize: "12px",
  color: "#5C4033",
  textDecoration: "underline",
};

export default OrderConfirmationEmail;
