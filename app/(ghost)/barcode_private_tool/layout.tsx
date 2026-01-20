export const metadata = {
  title: 'Lettore GLS - Ghost Mode',
  robots: { index: false, follow: false }, // Nasconde la pagina a Google
};

export default function GhostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="min-h-screen bg-[#f0f2f5] text-gray-900 font-sans">
      {/* Nessuna Navbar qui */}
      {children}
    </section>
  );
}