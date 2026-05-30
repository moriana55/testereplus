import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative mx-auto w-40 h-40 mb-8">
          <div className="absolute inset-0 bg-orange-100 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-orange-500">
              <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="3" strokeDasharray="8 6" />
              <path d="M28 32 L40 44 L52 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="40" cy="52" r="2" fill="currentColor" />
            </svg>
          </div>
        </div>
        <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-700 mb-3">Sayfa Bulunamadı</h2>
        <p className="text-gray-500 mb-8">
          Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/urunler"
            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Ürünlere Göz At
          </Link>
        </div>
      </div>
    </div>
  );
}
