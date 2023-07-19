import '../style/main.css'
import '../style/crew.css'
import '../style/popup.css'
import '../style/manage-mission.css'
import '../style/fleet.css'

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel='stylesheet' href='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.23.0/maps/maps.css' />
        <link rel='stylesheet' href='https://api.tomtom.com/maps-sdk-for-web/cdn/plugins/SearchBox/3.2.0//SearchBox.css' />
        <link rel='stylesheet' href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel='stylesheet' href='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.23.0/maps/maps.css' />

        <script defer type="module" src="../script/main.js"></script>
        <script defer type="module" src="../script/database.js"></script>
        <script defer type="module" src="../script/gen/location.js"></script>
        <script defer type="module" src="../script/gen/onmap.js"></script>
        <script defer type="module" src="../script/ui/dialog.js"></script>
        <script defer type="module" src="../script/ui/fleet.js"></script>
        <script defer type="module" src="../script/ui/district.js"></script>
        <script defer type="module" src="../script/ui/parts/gen-part.js"></script>
        <script defer type="module" src="../script/init/map.js"></script>
        <script defer type="module" src="../env.js"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
