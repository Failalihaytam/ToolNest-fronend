"use client"

import dynamic from 'next/dynamic'
import './styles.css'

const AppWithNoSSR = dynamic(() => import('./App'), {
  ssr: false,
})

export default function ClientApp() {
  return <AppWithNoSSR />
}