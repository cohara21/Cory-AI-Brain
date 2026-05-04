export const metadata = {
  title: "Coral Keepers",
  description: "Coral Keepers Teacher App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
