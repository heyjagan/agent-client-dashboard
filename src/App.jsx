
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  UserRound,
  UserPlus,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import AgentPage from "./pages/AgentPage";
import ClientPage from "./pages/ClientPage";
import AssignClient from "./pages/AssignClient";

import { AgentClientProvider } from "./context/AgentClientContext";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/agents",
    label: "Agents",
    icon: Users,
  },
  {
    to: "/clients",
    label: "Clients",
    icon: UserRound,
  },
  {
    to: "/assign-clients",
    label: "Assign Clients",
    icon: UserPlus,
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <AgentClientProvider>
        <div className="min-h-screen bg-gray-100">

         
          <header className="relative z-30 mx-2 my-2 rounded-xl bg-gradient-to-r from-blue-950 to-indigo-900 text-white shadow-lg">

            <div className="relative flex min-h-[70px] items-center justify-center px-4">

             
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="absolute left-4 rounded-lg p-2 transition hover:bg-white/20"
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <X size={28} />
                ) : (
                  <Menu size={28} />
                )}
              </button>

             
              <h1 className="px-12 text-center text-lg font-bold sm:text-2xl">
                Agent Client Dashboard
              </h1>

            </div>
          </header>

        
          <div
            onClick={() => setMenuOpen(false)}
            className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
              menuOpen
                ? "visible opacity-100"
                : "invisible opacity-0"
            }`}
          />

        
          <nav
            className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-indigo-950 text-white shadow-xl transition-transform duration-300 ${
              menuOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }`}
          >

           
            <div className="flex items-center justify-between border-b border-white/20 p-5">

              <h2 className="text-xl font-bold">
                Navigation
              </h2>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg p-2 transition hover:bg-white/20"
                aria-label="Close navigation menu"
              >
                <X size={24} />
              </button>

            </div>

          
            <div className="mt-4 flex flex-col gap-2 px-3">

              {links.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    state={{ fromDashboard: true }}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-4 py-3 transition duration-200 ${
                        isActive
                          ? "bg-white text-indigo-950 font-bold shadow-md"
                          : "text-white hover:bg-white/15"
                      }`
                    }
                  >
                    <Icon size={21} />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}

            </div>
          </nav>

       
          <main className="mx-auto max-w-7xl px-2 sm:px-4">

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/agents" element={<AgentPage />} />
              <Route path="/clients" element={<ClientPage />} />
              <Route path="/assign-clients" element={<AssignClient />} />
            </Routes>

          </main>

        </div>
      </AgentClientProvider>
    </BrowserRouter>
  );
}

export default App;


