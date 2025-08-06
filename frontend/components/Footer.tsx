export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 py-4 text-center text-sm text-white">
      <div className="flex justify-center items-center gap-4 flex-wrap">
        <span>© 2025 Axon Inc.</span>
        <div className="h-4 border-l border-gray-300" />
        <a href="/legal" className="hover:underline">Legal</a>
        <div className="h-4 border-l border-gray-300" />
        <a href="/privacy" className="hover:underline">Privacy</a>
        <div className="h-4 border-l border-gray-300" />
        <a href="/cookies" className="hover:underline">Manage cookies</a>
      </div>
    </footer>
  );
}
