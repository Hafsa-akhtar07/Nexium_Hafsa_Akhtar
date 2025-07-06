export default function Home() {
  return (
    <main style={{ padding: "1rem" }}>
      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "#f8f8f8", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <div>
          <strong style={{ fontSize: "20px" }}>Nexium</strong>
        </div>
        <div>
          <a href="#" style={{ marginRight: "1rem" }}>Homepage</a>
          <a href="#" style={{ marginRight: "1rem" }}>Portfolio</a>
          <a href="#">About</a>
        </div>
      </nav>

      {/* Hero/Product Section */}
      <section style={{ margin: "2rem 0", padding: "2rem", backgroundColor: "#f0f0f0", borderRadius: "10px", display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
        <img
          src="https://placehold.co/300x200"
          alt="Product"
          style={{ borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)", maxWidth: "100%" }}
        />
        <div>
          <h1 style={{ fontSize: "32px", marginBottom: "1rem" }}>Cool Gadget</h1>
          <p style={{ marginBottom: "1rem" }}>The latest tech at your fingertips.</p>
          <button style={{ padding: "0.5rem 1rem", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "4px" }}>
            Buy Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "1rem", backgroundColor: "#e0e0e0", borderRadius: "10px" }}>
        <p>© 2025 Nexium. All rights reserved.</p>
      </footer>
    </main>
  );
}
