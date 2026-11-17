
import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAgentClient } from "../context/useAgentClient";
import { ArrowLeft, Users, UserPlus } from "lucide-react";

function AssignClient() {
  const location = useLocation();

  const {
    agents,
    clients,
    assignments,
    assignClient,
  } = useAgentClient();

  const [agentId, setAgentId] = useState("");
  const [clientId, setClientId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  function isAgentAssigned(id) {
    return assignments.some(
      (assignment) => assignment.agentId === id
    );
  }

  function isClientAssigned(id) {
    return assignments.some(
      (assignment) => assignment.clientId === id
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!agentId || !clientId) {
      setMessage("Please select an agent and a client.");
      setMessageType("error");
      return;
    }

    const selectedAgent = agents.find(
      (agent) => agent.id === agentId
    );

    const selectedClient = clients.find(
      (client) => client.id === clientId
    );

    if (!selectedAgent || !selectedClient) {
      setMessage(
        "The selected agent or client was not found. Please select again."
      );
      setMessageType("error");
      return;
    }

    if (isAgentAssigned(agentId)) {
      setMessage(
        "This agent already has a client. Please select another agent."
      );
      setMessageType("error");
      return;
    }

    if (isClientAssigned(clientId)) {
      setMessage(
        "This client is already assigned to an agent."
      );
      setMessageType("error");
      return;
    }

    const success = assignClient(agentId, clientId);

    if (!success) {
      setMessage(
        "Assignment failed. This agent or client may already be assigned."
      );
      setMessageType("error");
      return;
    }

    setMessage("Client assigned successfully!");
    setMessageType("success");

    setAgentId("");
    setClientId("");
  }

  if (!location.state?.fromDashboard) {
    return <Navigate to="/" replace />;
  }

  const availableAgents = agents.some(
    (agent) => !isAgentAssigned(agent.id)
  );

  const availableClients = clients.some(
    (client) => !isClientAssigned(client.id)
  );

  const noAvailableOptions =
    agents.length > 0 &&
    clients.length > 0 &&
    (!availableAgents || !availableClients);

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

    
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <Users size={26} />
            </div>

            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Assign Client
            </h1>
          </div>

          <p className="text-sm text-slate-500 sm:text-base">
            Connect an available client with an available agent.
          </p>
        </div>
      </div>

  
      <div className="mb-8 rounded-2xl border border-purple-100 bg-white p-4 shadow-lg sm:p-6 lg:p-7">

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
            <UserPlus size={23} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
              Create Assignment
            </h2>

            <p className="text-sm text-slate-500">
              Select an agent and a client below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

        
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

         
            <div className="w-full min-w-0">
              <label
                htmlFor="agent"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Select Agent
              </label>

              <select
                id="agent"
                value={agentId}
                onChange={(e) => {
                  setAgentId(e.target.value);
                  setMessage("");
                  setMessageType("");
                }}
                className="block w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-black-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                required
              >
                <option value="">-- Select Agent --</option>

                {agents.map((agent) => (
                  <option
                    key={agent.id}
                    value={agent.id}
                    disabled={isAgentAssigned(agent.id)}
                  >
                    {agent.name} ({agent.email})
                    {isAgentAssigned(agent.id)
                      ? " - Already Assigned"
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            
            <div className="w-full min-w-0">
              <label
                htmlFor="client"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Select Client
              </label>

              <select
                id="client"
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                  setMessage("");
                  setMessageType("");
                }}
                className="block w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-black-600 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                required
              >
                <option value="">-- Select Client --</option>

                {clients.map((client) => (
                  <option
                    key={client.id}
                    value={client.id}
                    disabled={isClientAssigned(client.id)}
                  >
                    {client.name} ({client.email})
                    {isClientAssigned(client.id)
                      ? " - Already Assigned"
                      : ""}
                  </option>
                ))}
              </select>
            </div>

          </div>

          
          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`rounded-xl p-4 text-sm font-medium ${
                messageType === "success"
                  ? " text-green-700"
                  : " text-red-700"
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            <button
              type="submit"
              disabled={
                agents.length === 0 ||
                clients.length === 0 ||
                !availableAgents ||
                !availableClients
              }
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400 disabled:bg-none disabled:shadow-none sm:w-auto"
            >
              Assign Client
            </button>

            {(agents.length === 0 || clients.length === 0) && (
              <p className="text-sm text-amber-700">
                
              </p>
            )}

            {noAvailableOptions && (
              <p className="text-sm text-amber-700">
                
              </p>
            )}

          </div>
        </form>
      </div>

      
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg">

        <div className="flex flex-col gap-2 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
              Assigned Agents and Clients
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View all your completed assignments.
            </p>
          </div>

        
        </div>

        {assignments.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-slate-500">
            No assignments yet. Assign a client to see the list here.
          </p>
        ) : (
          <div className="w-full overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[700px] border-collapse text-left">

              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="border border-indigo-400/30 p-3 sm:p-4">
                    No
                  </th>

                  <th className="border border-indigo-400/30 p-3 sm:p-4">
                    Agent Name
                  </th>

                  <th className="border border-indigo-400/30 p-3 sm:p-4">
                    Agent Email
                  </th>

                  <th className="border border-indigo-400/30 p-3 sm:p-4">
                    Client Name
                  </th>

                  <th className="border border-indigo-400/30 p-3 sm:p-4">
                    Client Email
                  </th>
                </tr>
              </thead>

              <tbody>
                {assignments.map((assignment, index) => {
                  const agent = agents.find(
                    (item) => item.id === assignment.agentId
                  );

                  const client = clients.find(
                    (item) => item.id === assignment.clientId
                  );

                  if (!agent || !client) {
                    return null;
                  }

                  return (
                    <tr
                      key={assignment.id}
                      className="border-t border-slate-100 transition hover:bg-purple-50/60"
                    >
                      <td className="border border-slate-100 p-3 font-semibold text-slate-500 sm:p-4">
                        {index + 1}
                      </td>

                      <td className="border border-slate-100 p-3 font-semibold text-slate-800 sm:p-4">
                        {agent.name}
                      </td>

                      <td className="break-all border border-slate-100 p-3 text-slate-600 sm:p-4">
                        {agent.email}
                      </td>

                      <td className="border border-slate-100 p-3 font-semibold text-slate-800 sm:p-4">
                        {client.name}
                      </td>

                      <td className="break-all border border-slate-100 p-3 text-slate-600 sm:p-4">
                        {client.email}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default AssignClient;




