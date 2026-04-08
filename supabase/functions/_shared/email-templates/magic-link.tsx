/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your login link for Allie.ai</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://frvjnuuqacrrrvrhzhuj.supabase.co/storage/v1/object/sign/files/Allie.ai%20OS%20Logo_for_emails.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZjEyOTIxOC0yOTEyLTRkYmQtYjAxZC1lYmRmNWJhMjMzMDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmaWxlcy9BbGxpZS5haSBPUyBMb2dvX2Zvcl9lbWFpbHMucG5nIiwiaWF0IjoxNzc1NjM4MjEwLCJleHAiOjE4MDcxNzQyMTB9.kEMqnfo7nXZuQFxfqjY5QrLNzBaSQto6SNx5M1IFymU"
          alt="Allie.ai"
          width="60"
          height="60"
          style={logo}
        />
        <Heading style={h1}>Your login link</Heading>
        <Text style={text}>
          Click the button below to log in to Allie.ai. This link will expire shortly.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Log In
        </Button>
        <Text style={footer}>
          If you didn't request this link, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '30px 25px' }
const logo = { margin: '0 0 24px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#0b1426',
  margin: '0 0 16px',
}
const text = {
  fontSize: '14px',
  color: '#6b7280',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const button = {
  backgroundColor: 'hsl(221.2, 83.2%, 53.3%)',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600' as const,
  borderRadius: '8px',
  padding: '12px 24px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#9ca3af', margin: '30px 0 0' }
