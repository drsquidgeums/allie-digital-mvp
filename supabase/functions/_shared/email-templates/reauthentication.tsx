/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code for Allie.ai</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://frvjnuuqacrrrvrhzhuj.supabase.co/storage/v1/object/sign/files/Allie.ai%20OS%20Logo_for_emails.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZjEyOTIxOC0yOTEyLTRkYmQtYjAxZC1lYmRmNWJhMjMzMDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmaWxlcy9BbGxpZS5haSBPUyBMb2dvX2Zvcl9lbWFpbHMucG5nIiwiaWF0IjoxNzc1NjM4MjEwLCJleHAiOjE4MDcxNzQyMTB9.kEMqnfo7nXZuQFxfqjY5QrLNzBaSQto6SNx5M1IFymU"
          alt="Allie.ai"
          width="60"
          height="60"
          style={logo}
        />
        <Heading style={h1}>Confirm reauthentication</Heading>
        <Text style={text}>Use the code below to confirm your identity:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          This code will expire shortly. If you didn't request this, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

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
const codeStyle = {
  fontFamily: "'IBM Plex Mono', Courier, monospace",
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: 'hsl(221.2, 83.2%, 53.3%)',
  margin: '0 0 30px',
  letterSpacing: '4px',
}
const footer = { fontSize: '12px', color: '#9ca3af', margin: '30px 0 0' }
