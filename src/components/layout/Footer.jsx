export default function Footer() {
  return (
    <footer className="bg-accent border-t border-border py-6">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm text-foreground/70">
          © {new Date().getFullYear()} Reddit Clone. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 