
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserRound,
  GitBranch,
  UserPlus,
  UserRoundPlus,
  X,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

import { useAgentClient } from "../context/useAgentClient";

function Dashboard() {
  const {
    agents,
    clients,
    assignments,
    addAgent,
    addClient,
  } = useAgentClient();

  const [activeForm, setActiveForm] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  function openForm(type) {
    setForm({
      name: "",
      email: "",
      phone: "",
    });

    setMessage("");
    setActiveForm(type);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePhoneChange(e) {
    const digitsOnly = e.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setForm((previous) => ({
      ...previous,
      phone: digitsOnly,
    }));
  }

  function handleEmailChange(e) {
    setForm((previous) => ({
      ...previous,
      email: e.target.value.toLowerCase(),
    }));
  }

  function closeForm() {
    setActiveForm(null);
    setMessage("");

    setForm({
      name: "",
      email: "",
      phone: "",
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();

    if (!name || !email) {
      setMessage("Please enter name and email.");
      return;
    }

    if (phone.length !== 10) {
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    const formData = { name, email, phone };

    if (activeForm === "agent") {
      addAgent(formData);
    } else if (activeForm === "client") {
      addClient(formData);
    } else {
      return;
    }

    closeForm();
  }

  const dashboardCards = [
    {
      title: "Total Agents",
      count: agents.length,
      link: "/agents",
      icon: Users,
      color: "from-violet-600 to-purple-700",
      light: "bg-violet-50",
      text: "text-violet-700",
      description: "Manage your agents",
    },
    {
      title: "Total Clients",
      count: clients.length,
      link: "/clients",
      icon: UserRound,
      color: "from-pink-500 to-rose-600",
      light: "bg-pink-50",
      text: "text-pink-700",
      description: "Manage your clients",
    },
    {
      title: "Total Assignments",
      count: assignments.length,
      link: "/assign-clients",
      icon: GitBranch,
      color: "from-teal-500 to-emerald-600",
      light: "bg-teal-50",
      text: "text-teal-700",
      description: "View agent assignments",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 px-3 py-5 sm:px-6 sm:py-8">

      <div className="mx-auto max-w-7xl">

        
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-indigo-800 to-purple-800 p-5 shadow-xl sm:p-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div>
              <div className="mb-3 flex items-center gap-2 text-indigo-200">
                <LayoutDashboard size={20} />
                <span className="text-sm font-medium">
                  Management Overview
                </span>
              </div>

              <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                Welcome to your Dashboard
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-200 sm:text-base">
                Manage your agents, clients and assignments
                easily from one place.
              </p>
            </div>

            <div className="hidden rounded-2xl border border-white/20 bg-white/10 p-5 sm:block">
              <LayoutDashboard
                size={58}
                className="text-white"
              />
            </div>

          </div>
        </div>

       
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {dashboardCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="group overflow-hidden rounded-2xl border border-white bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                <div className={`h-2 bg-gradient-to-r ${card.color}`} />

                <div className="p-5 sm:p-6">

                  <div className="flex items-center justify-between gap-3">

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {card.title}
                      </p>

                      <p className={`mt-3 text-4xl font-bold ${card.text}`}>
                        {card.count}
                      </p>

                      <p className="mt-2 text-sm text-gray-400">
                        {card.description}
                      </p>
                    </div>

                    <div className={`rounded-2xl bg-gradient-to-br ${card.color} p-4 shadow-lg`}>
                      <Icon size={30} className="text-white" />
                    </div>

                  </div>

                  <Link
                    to={card.link}
                    state={{ fromDashboard: true }}
                    className={`mt-6 flex items-center justify-between rounded-xl ${card.light} px-4 py-3 text-sm font-semibold ${card.text} transition hover:brightness-95`}
                  >
                    View Details
                    <ArrowRight
                      size={19}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>

                </div>
              </div>
            );
          })}

        </div>

      
        <div className="mt-9 rounded-2xl border border-white bg-white p-5 shadow-md sm:p-7">

          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Quickly add new agents and clients.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <button
              type="button"
              onClick={() => openForm("agent")}
              className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-5 py-4 font-semibold text-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <UserPlus size={22} />
              Add Agent
            </button>

            <button
              type="button"
              onClick={() => openForm("client")}
              className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 px-5 py-4 font-semibold text-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <UserRoundPlus size={22} />
              Add Client
            </button>

          </div>
        </div>

        
        {activeForm && (
          <div className="mt-7 overflow-hidden rounded-2xl border border-white bg-white shadow-xl">

            <div className={`flex items-center justify-between gap-3 bg-gradient-to-r ${
              activeForm === "agent"
                ? "from-violet-800 to-indigo-800"
                : "from-pink-600 to-rose-600"
            } p-5 text-white sm:p-6`}>

              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  {activeForm === "agent" ? "Add New Agent" : "Add New Client"}
                </h2>

                <p className="mt-1 text-sm text-white/80">
                  Enter the details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 transition hover:bg-white/20"
                aria-label="Close form"
              >
                <X size={24} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-5 p-5 sm:p-6 md:grid-cols-2 xl:grid-cols-3"
            >

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={activeForm === "agent" ? "Agent Name" : "Client Name"}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleEmailChange}
                  placeholder="email"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder="10-digit phone number"
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  title="Enter exactly 10 digits"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              {message && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 p-3 text-sm text-red-700 md:col-span-2 xl:col-span-3"
                >
                  {message}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row md:col-span-2 xl:col-span-3">

                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 font-semibold text-white shadow transition hover:shadow-lg"
                >
                  Save {activeForm === "agent" ? "Agent" : "Client"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;






