export default function DashboardCard({ title, value, icon: Icon, tone = "brand", note }) {
  const tones = {
    brand: "bg-brand-100 text-brand-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {Icon && (
        <div className={`rounded-lg p-3 ${tones[tone]}`}>
          <Icon size={24} />
        </div>
      )}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {note && <p className="text-xs text-gray-400">{note}</p>}
      </div>
    </div>
  );
}