export default function GhostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="bg-[#f0f2f5] min-h-screen">
      {/* Niente Navbar qui, solo il contenuto nudo e crudo */}
      {children}
    </section>
  )
}