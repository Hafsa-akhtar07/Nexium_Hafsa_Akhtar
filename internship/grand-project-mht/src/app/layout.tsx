export const metadata = {
  title: 'Mental Health Tracker',
  description: 'Track your moods and mental well-being',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}