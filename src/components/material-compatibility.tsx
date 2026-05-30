import { type MaterialCompatibility } from "@/lib/data";

const ratingColors = {
  3: "bg-green-100 text-green-700 border-green-200",
  2: "bg-amber-50 text-amber-700 border-amber-200",
  1: "bg-gray-100 text-gray-500 border-gray-200",
};

const ratingLabels = { 3: "Mükemmel", 2: "İyi", 1: "Uygun" };

export function MaterialCompatibilityBadges({ materials }: { materials: MaterialCompatibility[] }) {
  if (materials.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-text-primary mb-3">Malzeme Uyumluluğu</h4>
      <div className="flex flex-wrap gap-2">
        {materials.map((m) => (
          <div
            key={m.name}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm ${ratingColors[m.rating]}`}
          >
            <div className="flex gap-0.5">
              {[1, 2, 3].map((star) => (
                <span
                  key={star}
                  className={`w-1.5 h-1.5 rounded-full ${star <= m.rating ? "bg-current" : "bg-current opacity-20"}`}
                />
              ))}
            </div>
            <span className="font-medium">{m.name}</span>
            <span className="text-xs opacity-70">({ratingLabels[m.rating]})</span>
          </div>
        ))}
      </div>
      {materials.some((m) => m.notes) && (
        <div className="mt-2 space-y-1">
          {materials.filter((m) => m.notes).map((m) => (
            <p key={m.name} className="text-xs text-text-muted">
              <span className="font-medium">{m.name}:</span> {m.notes}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
