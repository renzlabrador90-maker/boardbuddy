
import { useAuth } from "../context/useAuth";
import DashboardCard from "../components/DashboardCard";

const money = (n) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(n);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

/* ---------- Sample data (3 persons) ---------- */
const payments = [
  { id: 1, tenant: "Sample Tenant A", room: "101", amount: 3500, date: "2026-11-08" },
  { id: 2, tenant: "Sample Tenant B", room: "102", amount: 2000, date: "2026-11-07" },
  { id: 3, tenant: "Sample Tenant C", room: "203", amount: 4200, date: "2026-11-05" },
];

const rooms = [
  { id: 1, room_number: "101", status: "Occupied" },
  { id: 2, room_number: "102", status: "Occupied" },
  { id: 3, room_number: "203", status: "Occupied" },
  { id: 4, room_number: "104", status: "Vacant" },
  { id: 5, room_number: "205", status: "Vacant" },
];

const requests = [
  { id: 1, title: "Leaking faucet", room: "101", status: "Pending" },
  { id: 2, title: "Broken ceiling light", room: "203", status: "In Progress" },
  { id: 3, title: "Wi-Fi not working", room: "102", status: "Pending" },
];

function PaymentsTable({ rows, showTenant }) {
  return (
    <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">Recent Payments</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {showTenant && <th className="p-3">Tenant</th>}
              <th className="p-3">Room</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t">
                {showTenant && <td className="p-3">{p.tenant}</td>}
                <td className="p-3">{p.room}</td>
                <td className="p-3 font-semibold">{money(p.amount)}</td>
                <td className="p-3">{formatDate(p.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function LandlordDashboard() {
  const rentCollected = payments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const vacantRooms = rooms.filter(
    (r) => r.status === "Vacant"
  ).length;

  const pendingRequests = requests.filter(
    (r) => r.status === "Pending"
  ).length;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="Rent Collected"
          value={money(rentCollected)}
          tone="green"
        />

        <DashboardCard
          title="Vacant Rooms"
          value={vacantRooms}
          tone="brand"
          note={`out of ${rooms.length} rooms`}
        />

        <DashboardCard
          title="Pending Requests"
          value={pendingRequests}
          tone="amber"
        />
      </div>

      <PaymentsTable rows={payments} showTenant />
    </>
  );
}

function TenantDashboard() {
  const mine = [
    { id: 1, room: "101", amount: 3500, date: "2026-11-08" },
    { id: 2, room: "101", amount: 4100, date: "2026-10-04" },
    { id: 3, room: "101", amount: 3900, date: "2026-09-03" },
  ];

  const total = mine.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const latest = [...mine].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )[0];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="Total Paid"
          value={money(total)}
          tone="green"
        />

        <DashboardCard
          title="Payments Made"
          value={mine.length}
          tone="brand"
        />

        <DashboardCard
          title="Last Payment"
          value={formatDate(latest.date)}
          tone="indigo"
          note={money(latest.amount)}
        />
      </div>

      <PaymentsTable rows={mine} />
    </>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const isLandlord = user.role === "landlord";

  return (
    <div>
      <h1 className="text-2xl font-bold">
        {isLandlord ? "Dashboard" : "My Dashboard"}
      </h1>

      <p className="mb-6 text-sm text-gray-500">
        Welcome back, {user.full_name}.
      </p>

      {isLandlord ? <LandlordDashboard /> : <TenantDashboard />}
    </div>
  );
}
