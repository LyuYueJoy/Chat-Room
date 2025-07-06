import ThemeContextProvider from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeContextProvider>
          <main>{children}</main>
        </ThemeContextProvider>
          
      </body>
    </html>
  );
}
