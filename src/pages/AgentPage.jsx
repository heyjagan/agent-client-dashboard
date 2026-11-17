
import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAgentClient } from "../context/useAgentClient";
import { Pencil, Trash2, ArrowLeft, Users } from "lucide-react";

function AgentPage() {
  const location = useLocation();

  const {
    agents,
    clients,
    assignments,
    addAgent,
    updateAgent,
    deleteAgent,
  } = useAgentClient();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedClientId, setExpandedClientId] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  function getAssignedClients(agentId) {
    const assignedClientIds = assignments
      .filter((item) => item.agentId === agentId)
      .map((item) => item.clientId);

    return assignedClientIds
      .map((clientId) =>
        clients.find((client) => client.id === clientId)
      )
      .filter(Boolean);
  }

  function toggleAssignedAgentDetails(clientId) {
    setExpandedClientId((previousId) =>
      previousId === clientId ? null : clientId
    );
  }

  function handleAdd() {
    if (showForm) {
      handleCloseForm();
      return;
    }

    setForm({ name: "", email: "", phone: "" });
    setEditingId(null);
    setMessage("");
    setShowForm(true);
  }

  function handleEdit(agent) {
    setForm({
      name: agent.name || "",
      email: agent.email || "",
      phone: agent.phone || "",
    });

    setEditingId(agent.id);
    setMessage("");
    setShowForm(true);
  }

  function handleChange(e) {
    const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");

    setForm((previous) => ({
      ...previous,
      name: lettersOnly,
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

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();

    if (!name || !email) {
      setMessageType("error");
      setMessage("Please enter the agent name and email.");
      return;
    }

    if (phone.length !== 10) {
      setMessageType("error");
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    const duplicate = agents.some((agent) => {
      if (agent.id === editingId) return false;

      return (
        (agent.name || "").trim().toLowerCase() === name.toLowerCase() &&
        (agent.email || "").trim().toLowerCase() === email &&
        (agent.phone || "").trim() === phone
      );
    });

    if (duplicate) {
      setMessageType("error");
      setMessage("This agent already exists!");
      return;
    }

    const agentData = { name, email, phone };

    if (editingId !== null) {
      updateAgent(editingId, agentData);
      setMessageType("success");
      setMessage("Agent updated successfully!");
    } else {
      addAgent(agentData);
      setMessageType("success");
      setMessage("Agent added successfully!");
    }

    setForm({ name: "", email: "", phone: "" });
    setEditingId(null);
    setShowForm(false);
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this agent?"
    );

    if (!confirmed) return;

    const assignedClients = getAssignedClients(id);
    const assignedClientIds = assignedClients.map(
      (client) => client.id
    );

    deleteAgent(id);

    setExpandedClientId((previousId) =>
      assignedClientIds.includes(previousId) ? null : previousId
    );

    if (editingId === id) {
      setShowForm(false);
      setEditingId(null);
      setForm({ name: "", email: "", phone: "" });
    }

    setMessageType("success");
    setMessage("Agent deleted successfully!");
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", email: "", phone: "" });
    setMessage("");
  }

  if (!location.state?.fromDashboard) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">

      {/* Back to Dashboard */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-900 hover:shadow-lg"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>

      {/* Page Heading */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl bg-pink-100 p-3 text-pink-600">
              <Users size={26} />
            </div>

            <h1 className="text-3xl font-bold text-slate-800">
              Agents
            </h1>
          </div>

          <p className="text-sm text-slate-500">
            Manage your agent details and assigned clients.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:from-fuchsia-700 hover:to-pink-700 hover:shadow-lg"
        >
          {showForm ? "Cancel" : "+ Add Agent"}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-5 p-4 font-medium ${
            messageType === "error"
              ? "text-red-700"
              : "text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-7 rounded-2xl border border-purple-100 bg-white p-5 shadow-lg sm:p-7"
        >
          <h2 className="mb-6 text-xl font-bold text-slate-800">
            {editingId !== null ? "Update Agent Details" : "Add New Agent"}
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label
                htmlFor="agent-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Agent Name
              </label>

              <input
                id="agent-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Agent Name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-fuchsia-400 focus:bg-white focus:ring-2 focus:ring-fuchsia-100"
                required
              />
            </div>

            <div>
              <label
                htmlFor="agent-email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>

              <input
                id="agent-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleEmailChange}
                placeholder="email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-fuchsia-400 focus:bg-white focus:ring-2 focus:ring-fuchsia-100"
                required
              />
            </div>

            <div>
              <label
                htmlFor="agent-phone"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Phone
              </label>

              <input
                id="agent-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handlePhoneChange}
                placeholder="10-digit phone number"
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]{10}"
                title="Enter exactly 10 digits"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-fuchsia-400 focus:bg-white focus:ring-2 focus:ring-fuchsia-100"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:from-green-700 hover:to-emerald-700"
            >
              {editingId !== null ? "Update Agent" : "Save Agent"}
            </button>

            <button
              type="button"
              onClick={handleCloseForm}
              className="rounded-xl bg-slate-100 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Agent Table */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50 p-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Agent List
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage all your agents.
            </p>
          </div>
        </div>

        {agents.length === 0 ? (
          <p className="py-8 text-center text-slate-500">
            No agents found. Please add an agent.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Assigned Clients</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {agents.map((agent, index) => {
                  const assignedClients = getAssignedClients(agent.id);

                  return (
                    <tr
                      key={agent.id}
                      className="border-t border-slate-100 align-top transition hover:bg-purple-50/60"
                    >
                      <td className="p-4 font-semibold text-slate-500">
                        {index + 1}
                      </td>

                      <td className="p-4 font-semibold text-slate-800">
                        {agent.name}
                      </td>

                      {/* Agent Email - Normal Text */}
                      <td className="p-4 text-slate-600">
                        <span className="break-all">
                          {agent.email}
                        </span>
                      </td>

                      <td className="p-4 text-slate-600">
                        {agent.phone}
                      </td>

                      {/* Assigned Clients */}
                      <td className="p-4">
                        {assignedClients.length === 0 ? (
                          <span className="text-sm text-slate-400">
                            No clients assigned
                          </span>
                        ) : (
                          <div className="space-y-3">
                            {assignedClients.map((client) => (
                              <div key={client.id}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleAssignedAgentDetails(client.id)
                                  }
                                  className="font-semibold text-indigo-600 hover:text-purple-700 hover:underline"
                                >
                                  {client.name}
                                </button>

                                {expandedClientId === client.id && (
                                  <div className="mt-3 space-y-2 rounded-xl border border-purple-100 bg-purple-50 p-3 text-sm">
                                    <p>
                                      <span className="font-semibold text-slate-700">
                                        Email:{" "}
                                      </span>

                                      {/* Assigned Client Email - Popup */}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setSelectedEmail(client.email)
                                        }
                                        className="break-all text-blue-600 hover:text-blue-800 hover:underline"
                                      >
                                        {client.email || "Not available"}
                                      </button>
                                    </p>

                                    <p className="text-slate-700">
                                      <span className="font-semibold">
                                        Phone:{" "}
                                      </span>
                                      {client.phone || "Not available"}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap p-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(agent)}
                            aria-label={`Edit ${agent.name}`}
                            title="Edit Agent"
                            className="rounded-lg bg-indigo-100 p-2 text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(agent.id)}
                            aria-label={`Delete ${agent.name}`}
                            title="Delete Agent"
                            className="rounded-lg bg-rose-100 p-2 text-rose-600 transition hover:bg-rose-600 hover:text-white"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assigned Client Email Popup */}
      {selectedEmail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30  p-4 backdrop-blur-md"
          onClick={() => setSelectedEmail(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="client-email-title"
            className="w-full max-w-md rounded-2xl bg-white/30 bg-white/95 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="client-email-title"
                className="text-xl font-bold text-slate-800"
              >
                Client Email
              </h2>

              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                aria-label="Close email popup"
                className="rounded-lg px-3 py-1 text-xl text-slate-500 transition hover:bg-red-50 hover:text-red-600"
              >
                ✕
              </button>
            </div>

            <div className="break-all rounded-xl border border-blue-100 bg-blue-50 p-4 text-blue-700">
              {selectedEmail}
            </div>

            <button
              type="button"
              onClick={() => setSelectedEmail(null)}
              className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default AgentPage;











