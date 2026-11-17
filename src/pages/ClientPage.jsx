
import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAgentClient } from "../context/useAgentClient";
import { Pencil, Trash2, Users, ArrowLeft } from "lucide-react";

function ClientPage() {
  const location = useLocation();

  const {
    clients,
    agents,
    assignments,
    addClient,
    updateClient,
    deleteClient,
  } = useAgentClient();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedClientId, setExpandedClientId] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  function getAssignedAgent(clientId) {
    const assignment = assignments.find(
      (item) => item.clientId === clientId
    );

    if (!assignment) return null;

    return agents.find(
      (agent) => agent.id === assignment.agentId
    ) || null;
  }

  function toggleAssignedAgent(clientId) {
    setExpandedClientId((previousId) =>
      previousId === clientId ? null : clientId
    );
  }

  function handleChange(e) {
    const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g,"");

    setForm((previous) => ({
      ...previous,
    name: lettersOnly,
    }));
  }

  function handleEmailChange(e) {
    setForm((previous) => ({
      ...previous,
      email: e.target.value.toLowerCase(),
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

  function resetForm() {
    setForm({
      name: "",
      email: "",
      phone: "",
    });

    setEditingId(null);
    setShowForm(false);
    setMessage("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();

    if (!name || !email) {
      setMessage("Please enter the client name and email.");
      return;
    }

    if (phone.length !== 10) {
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    const duplicate = clients.some((client) => {
      if (client.id === editingId) return false;

      return (
        (client.name || "").trim().toLowerCase() === name.toLowerCase() &&
        (client.email || "").trim().toLowerCase() === email &&
        (client.phone || "").trim() === phone
      );
    });

    if (duplicate) {
      setMessage("This client already exists!");
      return;
    }

    const clientData = { name, email, phone };

    if (editingId !== null) {
      updateClient(editingId, clientData);
      setMessage("Client updated successfully!");
    } else {
      addClient(clientData);
      setMessage("Client added successfully!");
    }

    setForm({
      name: "",
      email: "",
      phone: "",
    });

    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(client) {
    setForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
    });

    setEditingId(client.id);
    setShowForm(true);
    setMessage("");
  }

  function handleAddClick() {
    if (showForm) {
      resetForm();
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
      });

      setEditingId(null);
      setMessage("");
      setShowForm(true);
    }
  }

  function handleDelete(clientId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmed) return;

    deleteClient(clientId);

    if (editingId === clientId) {
      resetForm();
    }

    if (expandedClientId === clientId) {
      setExpandedClientId(null);
    }
  }

  if (!location.state?.fromDashboard) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">

      
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-900 hover:shadow-lg"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>


      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl bg-pink-100 p-3 text-pink-600">
              <Users size={27} />
            </div>

            <h1 className="text-3xl font-bold text-slate-800">
              Clients
            </h1>
          </div>

          <p className="text-sm text-slate-500">
            Manage your client details and assigned agents.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddClick}
          className="rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:from-fuchsia-700 hover:to-pink-700 hover:shadow-lg"
        >
          {showForm ? "Cancel" : "+ Add Client"}
        </button>
      </div>

      
      {message && (
        <div
          role="status"
          className={`mb-5 p-4 font-medium  ${
            message.startsWith("Please") ||
            message.includes("already exists")
              ? " text-red-700"
              : "  text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-7 rounded-2xl border border-purple-100 bg-white p-5 shadow-lg sm:p-7"
        >
          <h2 className="mb-6 text-xl font-bold text-slate-800">
            {editingId !== null ? "Update Client Details" : "Add New Client"}
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label
                htmlFor="client-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Client Name
              </label>

              <input
                id="client-name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-fuchsia-400 focus:bg-white focus:ring-2 focus:ring-fuchsia-100"
                type="text"
                name="name"
                placeholder="Client Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="client-email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>

              <input
                id="client-email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-fuchsia-400 focus:bg-white focus:ring-2 focus:ring-fuchsia-100"
                type="email"
                name="email"
                placeholder="email"
                value={form.email}
                onChange={handleEmailChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="client-phone"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Phone
              </label>

              <input
                id="client-phone"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-fuchsia-400 focus:bg-white focus:ring-2 focus:ring-fuchsia-100"
                type="tel"
                name="phone"
                placeholder="10-digit phone number"
                value={form.phone}
                onChange={handlePhoneChange}
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]{10}"
                title="Enter exactly 10 digits"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:from-green-700 hover:to-emerald-700"
            >
              {editingId !== null ? "Update Client" : "Save Client"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl bg-slate-100 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50 p-5">
          <div>
            <h2 className="text-xl font-bold mx-5 text-slate-800">
              Client List
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View and manage all your clients.
            </p>
          </div>

        
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full min-w-[950px] text-left mx-2 rounded-lg ">
            <thead className="bg-gradient-to-r from-indigo-800 to-purple-700 text-white rounded-t-xl" >
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Assigned Agent</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-slate-500"
                  >
                    No clients found. Please add a client.
                  </td>
                </tr>
              ) : (
                clients.map((client, index) => {
                  const assignedAgent = getAssignedAgent(client.id);
                  const isExpanded = expandedClientId === client.id;

                  return (
                    <tr
                      key={client.id}
                      className="border-t border-slate-100 align-top transition hover:bg-purple-50/60"
                    >
                      <td className="p-2 font-semibold text-slate-500">
                        {index + 1}
                      </td>

                      <td className="p-2 font-semibold text-slate-800">
                        {client.name}
                      </td>

                      <td className="p-2 text-slate-600">
                        {client.email}
                      </td>

                      <td className="p-2 text-slate-600">
                        {client.phone}
                      </td>

                      <td className="p-2">
                        {assignedAgent ? (
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleAssignedAgent(client.id)}
                              aria-expanded={isExpanded}
                              className="font-semibold text-indigo-600 transition hover:text-purple-700 hover:underline"
                            >
                              {assignedAgent.name}
                            </button>

                            {isExpanded && (
                              <div className="mt-3 space-y-2 rounded-xl border border-purple-100 bg-purple-50 p-3 text-sm">
                                <p>
                                  <span className="font-semibold text-slate-700">
                                    Email:{" "}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSelectedEmail(assignedAgent.email)
                                    }
                                    className="break-all text-blue-600 underline hover:text-blue-800"
                                  >
                                    {assignedAgent.email}
                                  </button>
                                </p>

                                <p className="text-slate-700">
                                  <span className="font-semibold">
                                    Phone:{" "}
                                  </span>
                                  {assignedAgent.phone || "Not available"}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                            Not assigned
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap p-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(client)}
                            className="rounded-lg bg-indigo-100 p-2 text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
                            title="Edit Client"
                            aria-label="Edit Client"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(client.id)}
                            className="rounded-lg bg-rose-100 p-2 text-rose-600 transition hover:bg-rose-600 hover:text-white"
                            title="Delete Client"
                            aria-label="Delete Client"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      {selectedEmail !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedEmail(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="client-email-popup-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2
                id="client-email-popup-title"
                className="text-xl font-bold text-slate-800"
              >
                Email Address
              </h2>

              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                aria-label="Close email popup"
                className="rounded-lg px-3 py-2 text-slate-500 transition hover:bg-rose-100 hover:text-rose-600"
              >
                ✕
              </button>
            </div>

            <p className="break-all rounded-xl bg-purple-50 p-4 text-purple-700">
              {selectedEmail}
            </p>

            <button
              type="button"
              onClick={() => setSelectedEmail(null)}
              className="mt-5 w-full rounded-xl bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientPage;




